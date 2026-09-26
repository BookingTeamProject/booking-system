import { describe, it, expect, vi } from 'vitest';
import { createDemoDataSources } from './demo';
import { parseDataMode, selectDataSource } from './selectSource';
import { withPropertyNotifications } from './propertyNotifications';
import { LANGUAGE_OPTIONS, CURRENCY_OPTIONS, parseLanguage, parseCurrency } from '../config/locales';
import type { User } from '../types';

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}
const user: User = { id: 'alice', email: 'alice@example.test', firstName: 'Alice', lastName: 'Test', role: 'Landlord' };
const future = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

describe('central data sources', () => {
  it('isolates demo conversations by booking and account and rejects invalid messages', async () => {
    const store = new MemoryStorage();
    let identity = user;
    const source = createDemoDataSources(store, () => identity);
    const booking = (await source.bookings.list())[0];
    await source.chat.send(booking.id, '  Hello  ');
    expect((await source.chat.list(booking.id))[0].text).toBe('Hello');
    const owned = (await source.bookings.list(true))[0];
    expect(await source.chat.list(owned.id)).toEqual([]);
    await expect(source.chat.send('c1', 'Hi')).rejects.toThrow();
    await expect(source.chat.send(booking.id, '  ')).rejects.toThrow();
    await expect(source.chat.send(booking.id, 'x'.repeat(4001))).rejects.toThrow();
    identity = { ...user, id: 'bob' };
    expect(await source.chat.list(booking.id)).toEqual([]);
    identity = user;
    expect(await source.chat.list(booking.id)).toHaveLength(1);
  });

  it('persists assistance requests per account and resets them with all demo data', async () => {
    const store = new MemoryStorage();
    let identity = user;
    const source = createDemoDataSources(store, () => identity);
    const initial = await source.assistance.load();
    const request = { category: initial.categories[0], description: 'Test issue', bookingCode: 'B1',
      priority: 'Низький', contactMethod: 'email', attachmentName: 'example.png' };
    await source.assistance.submitTicket(request);
    await source.assistance.submitAppeal('Test appeal');
    await source.assistance.submitContact({ name: 'Alice', email: 'alice@example.test', subject: initial.subjects[0], message: 'Test contact' });
    const reloaded = await createDemoDataSources(store, () => identity).assistance.load();
    expect(reloaded.tickets).toHaveLength(initial.tickets.length + 1);
    expect(reloaded.restrictions[0].reason).toBe('Test appeal');
    const saved = JSON.parse(store.getItem('trailsua:demo:v1:alice')!);
    expect(saved.contactRequests[0].message).toBe('Test contact');
    expect(saved.supportRequests[0]).toEqual(request);
    identity = { ...user, id: 'bob' };
    expect((await source.assistance.load()).tickets).toHaveLength(initial.tickets.length);
    source.resetDemo!();
    identity = user;
    expect((await source.assistance.load()).tickets).toHaveLength(initial.tickets.length + 1);
    source.resetDemo!();
    expect((await source.assistance.load()).tickets).toHaveLength(initial.tickets.length);
  });

  it('does not persist invalid assistance submissions or mutate shared seed data', async () => {
    const store = new MemoryStorage();
    const source = createDemoDataSources(store, () => user);
    const initial = await source.assistance.load();
    await expect(source.assistance.submitAppeal('  ')).rejects.toThrow();
    await expect(source.assistance.submitAppeal('x'.repeat(4001))).rejects.toThrow();
    await expect(source.assistance.submitContact({ name: '', email: 'invalid', subject: '', message: 'hello' })).rejects.toThrow();
    expect(await source.assistance.load()).toEqual(initial);
    initial.tickets.length = 0;
    expect((await source.assistance.load()).tickets.length).toBeGreaterThan(0);
  });

  it('defaults to live and refuses invalid modes', () => {
    expect(parseDataMode()).toBe('live');
    expect(parseDataMode('demo')).toBe('demo');
    expect(() => parseDataMode('production-typo')).toThrow();
  });

  it('never initializes demo data or falls back to it when the live source fails', () => {
    const demo = vi.fn();
    const live = vi.fn(() => { throw new Error('API configuration failed'); });
    expect(() => selectDataSource('live', { demo, live })).toThrow('API configuration failed');
    expect(demo).not.toHaveBeenCalled();
    expect(live).toHaveBeenCalledOnce();
  });

  it('persists demo mutations without modifying the fixture or other users', async () => {
    const store = new MemoryStorage();
    let identity = user;
    const source = createDemoDataSources(store, () => identity);
    const initial = await source.finance.load();
    await source.finance.withdraw(1000);
    expect((await source.finance.load()).balance).toBe(initial.balance - 1000);
    expect((await createDemoDataSources(store, () => user).finance.load()).balance).toBe(initial.balance - 1000);
    identity = { ...user, id: 'bob' };
    expect((await source.finance.load()).balance).toBe(initial.balance);
    identity = user;
    expect((await source.finance.load()).balance).toBe(initial.balance - 1000);
    const returned = await source.properties.getAll();
    returned[0].title = 'External mutation';
    expect((await source.properties.getAll())[0].title).not.toBe('External mutation');
  });

  it('rejects invalid withdrawals without changing balance or transactions', async () => {
    const source = createDemoDataSources(new MemoryStorage(), () => user);
    const initial = await source.finance.load();
    for (const amount of [-1, 0, NaN, Infinity, initial.balance + 1])
      await expect(source.finance.withdraw(amount)).rejects.toThrow();
    expect(await source.finance.load()).toEqual(initial);
  });

  it('preserves zero balance and an empty list instead of reseeding fake values', async () => {
    const source = createDemoDataSources(new MemoryStorage(), () => user);
    await source.finance.withdraw((await source.finance.load()).balance);
    expect((await source.finance.load()).balance).toBe(0);
    const properties = await source.properties.getAll();
    await source.favorites.toggle(properties[1].id);
    await source.favorites.toggle(properties[1].id);
    expect(await source.favorites.getMyFavorites()).toEqual([]);
  });

  it('reset touches only the current user demo namespace', async () => {
    const store = new MemoryStorage();
    store.setItem('token', 'test-session'); store.setItem('app_language', 'DE');
    const source = createDemoDataSources(store, () => user);
    const other = createDemoDataSources(store, () => ({ ...user, id: 'bob' }));
    await source.finance.withdraw(100);
    await other.finance.withdraw(200);
    source.resetDemo!();
    expect((await source.finance.load()).balance).toBe(14250);
    expect((await other.finance.load()).balance).toBe(14050);
    expect(store.getItem('token')).toBe('test-session');
    expect(store.getItem('app_language')).toBe('DE');
  });

  it('demo bookings use the same quote, ownership and cancellation contract', async () => {
    const source = createDemoDataSources(new MemoryStorage(), () => user);
    const property = (await source.properties.getAll())[1];
    const request = { routeId: property.id, checkIn: future(20), checkOut: future(23), guests: 2 };
    const quote = await source.bookings.quote(request);
    const booking = await source.bookings.create(request);
    expect(booking.totalPrice).toBe(quote.totalPrice);
    await expect(source.bookings.create(request)).rejects.toThrow();
    await expect(source.bookings.changeStatus(booking.id, 'Confirmed')).rejects.toThrow();
    await source.bookings.changeStatus(booking.id, 'Cancelled', 'Test');
    expect((await source.bookings.create(request)).status).toBe('Pending');
    const hostBooking = (await source.bookings.list(true))[0];
    expect((await source.bookings.changeStatus(hostBooking.id, 'Confirmed')).status).toBe('Confirmed');
  });

  it('notifies catalog consumers after success but not after failed changes', async () => {
    const source = withPropertyNotifications(createDemoDataSources(new MemoryStorage(), () => user));
    const notify = vi.fn(); const unsubscribe = source.subscribeProperties!(notify);
    const property = (await source.properties.getMine())[0];
    await source.properties.update(property.id, { title: 'Updated' });
    expect(notify).toHaveBeenCalledOnce();
    await expect(source.properties.delete(property.id)).rejects.toThrow();
    expect(notify).toHaveBeenCalledOnce();
    unsubscribe();
    await source.properties.update(property.id, { title: 'Updated again' });
    expect(notify).toHaveBeenCalledOnce();
  });
});

describe('central locale registry', () => {
  it('accepts exactly the languages and currencies supplied to all selectors', () => {
    for (const item of LANGUAGE_OPTIONS) expect(parseLanguage(item.code)).toBe(item.code);
    for (const item of CURRENCY_OPTIONS) expect(parseCurrency(item.code)).toBe(item.code);
    expect(parseLanguage('invalid')).toBe('UA'); expect(parseCurrency(null)).toBe('UAH');
  });
});
