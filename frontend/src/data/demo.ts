import { BLOG_POSTS } from './articles';
import { MOCK_ROUTES, MOCK_INITIAL_TRANSACTIONS, MOCK_SUPPORT_TICKETS, MOCK_SUPPORT_CATEGORIES, MOCK_RESTRICTION_HISTORY, MOCK_PLATFORM_RULES, MOCK_CONTACT_SUBJECTS, MOCK_CONTACT_OFFICE_INFO } from './mockData';
import type { DataSources, FinanceSnapshot, ChatMessage, AssistanceSnapshot, SupportRequest, ContactRequest } from './contracts';
import type { BookingRecord, BookingRequest, BookingQuote } from '../services/bookings.service';
import type { CategoryDto } from '../services/http-api.service';
import type { Review, RouteItem, User } from '../types';

interface DemoState {
  assistance?: AssistanceSnapshot;
  supportRequests?: SupportRequest[];
  contactRequests?: ContactRequest[];
  messages?: Record<string, ChatMessage[]>;
  version: 1;
  properties: RouteItem[];
  categories: CategoryDto[];
  bookings: BookingRecord[];
  favorites: string[];
  reviews: Review[];
  finance: FinanceSnapshot;
}

const dateKey = (date: Date) => date.toISOString().slice(0, 10);
const fullName = (user: User | null) => user ? `${user.firstName} ${user.lastName}`.trim() : 'Демо користувач';
const active = (booking: BookingRecord) => booking.status === 'Pending' || booking.status === 'Confirmed';

// No HTTP calls in this module. Storage and identity are injectable for isolated tests.
export function createDemoDataSources(store: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>, identity: () => User | null): DataSources {
  const key = () => `trailsua:demo:v1:${identity()?.id || 'anonymous'}`;
  const currentId = () => identity()?.id || 'anonymous';
  const save = (state: DemoState) => store.setItem(key(), JSON.stringify(state));
  const clone = <T,>(value: T): T => structuredClone(value);
  const seed = (): DemoState => {
    const properties = MOCK_ROUTES.map((property, index) => ({ ...property, id: `demo-property-${index + 1}`,
      authorId: index === 0 ? currentId() : 'demo-host', authorName: index === 0 ? fullName(identity()) : property.authorName,
      maxGuests: 4,
    }));
    const categories = [...new Map(properties.map(p => [p.categoryId, { id: p.categoryId, name: p.categoryName }])).values()];
    const transactions = MOCK_INITIAL_TRANSACTIONS.map((tx, i) => ({ ...tx, date: dateKey(new Date(Date.now() - i * 86400000)) }));
    const state: DemoState = { version: 1, properties, categories, bookings: [], favorites: [], reviews: [],
      finance: { balance: 14250, expectedPayout: 5600, transactions,
        payoutSettings: { iban: 'DEMO-ACCOUNT', frequency: 'Щотижня' },
        kpi: { totalRevenue: 0, monthRevenue: 0, totalCommission: 0, pendingPayouts: 0 } },
    };
    // Demo records are dated relative to today so the demonstration remains usable.
    for (let i = 0; i < 2; i++) {
      const property = properties[i];
      state.bookings.push({ id: `demo-booking-${i}`, routeId: property.id, title: property.title,
        location: property.location, imageUrl: property.imageUrls[0] || null,
        guestId: i === 0 ? 'demo-guest' : currentId(), guestName: i === 0 ? 'Демо гість' : fullName(identity()),
        hostId: property.authorId!, hostName: property.authorName,
        checkIn: dateKey(new Date(Date.now() + 7 * 86400000)), checkOut: dateKey(new Date(Date.now() + 10 * 86400000)),
        guests: 2, pricePerNight: property.price, cleaningFee: 300, serviceFee: 150, totalPrice: property.price * 3 + 450,
        status: 'Pending', cancellationReason: null,
      });
    }
    save(state);
    return state;
  };
  const read = (): DemoState => {
    const raw = store.getItem(key());
    if (!raw) return seed();
    try {
      const data = JSON.parse(raw) as DemoState;
      if (data.version !== 1 || !Array.isArray(data.properties) || !Array.isArray(data.bookings) || !data.finance)
        throw new Error('Invalid demo data');
      return data;
    } catch { throw new Error('Демонстраційні дані пошкоджено. Натисніть «Скинути демодані».'); }
  };
  const propertyById = (state: DemoState, id: string) => {
    const property = state.properties.find(p => p.id === id);
    if (!property) throw new Error('Помешкання не знайдено.');
    return property;
  };
  const quote = (state: DemoState, request: BookingRequest): BookingQuote => {
    const property = propertyById(state, request.routeId);
    const nights = (Date.parse(request.checkOut) - Date.parse(request.checkIn)) / 86400000;
    if (!Number.isInteger(nights) || nights < 1 || nights > 365 || request.checkIn < dateKey(new Date()))
      throw new Error('Оберіть майбутній період від 1 до 365 ночей.');
    if (property.authorId === currentId()) throw new Error('Не можна бронювати власне помешкання.');
    if (!Number.isInteger(request.guests) || request.guests < 1 || request.guests > (property.maxGuests || 4))
      throw new Error('Перевищено допустиму кількість гостей.');
    if (state.bookings.some(b => b.routeId === request.routeId && active(b) && b.checkIn < request.checkOut && request.checkIn < b.checkOut))
      throw new Error('Помешкання вже заброньовано на ці дати.');
    return { nights, pricePerNight: property.price, cleaningFee: 300, serviceFee: 150, totalPrice: nights * property.price + 450 };
  };
  const financeResult = (state: DemoState): FinanceSnapshot => {
    const income = state.finance.transactions.filter(tx => tx.type === 'income');
    const month = dateKey(new Date()).slice(0, 7);
    state.finance.kpi = {
      totalRevenue: income.reduce((sum, tx) => sum + tx.amount, 0),
      monthRevenue: income.filter(tx => tx.date.startsWith(month)).reduce((sum, tx) => sum + tx.amount, 0),
      totalCommission: income.reduce((sum, tx) => sum + tx.commission, 0),
      pendingPayouts: income.filter(tx => tx.status === 'Очікується').reduce((sum, tx) => sum + tx.amount, 0),
    };
    state.finance.expectedPayout = state.finance.kpi.pendingPayouts;
    return clone(state.finance);
  };
  const assistanceState = () => {
    const state = read();
    state.assistance ??= clone({ tickets: MOCK_SUPPORT_TICKETS, restrictions: MOCK_RESTRICTION_HISTORY,
      categories: MOCK_SUPPORT_CATEGORIES, subjects: MOCK_CONTACT_SUBJECTS,
      office: MOCK_CONTACT_OFFICE_INFO, rules: MOCK_PLATFORM_RULES });
    return state as DemoState & { assistance: AssistanceSnapshot };
  };
  const validateText = (text: string) => {
    if (!text.trim() || text.length > 4000) throw new Error('Текст має містити від 1 до 4000 символів.');
  };
  const dialogState = (id: string) => {
    const state = read();
    if (!state.bookings.some(b => b.id === id && (b.guestId === currentId() || b.hostId === currentId())))
      throw new Error('Діалог недоступний.');
    return state;
  };
  return {
    news: BLOG_POSTS,
    assistance: {
      available: true,
      load: async () => clone(assistanceState().assistance),
      submitTicket: async request => {
        validateText(request.description);
        const state = assistanceState();
        if (!state.assistance.categories.includes(request.category)) throw new Error('Оберіть категорію.');
        const id = crypto.randomUUID();
        state.assistance.tickets.unshift({ id, ticketNumber: `DEMO-${id.slice(0, 8)}`, category: request.category,
          title: request.description.trim(), dateText: `Створено: ${dateKey(new Date())}`, status: 'Очікує' });
        state.supportRequests = [...(state.supportRequests || []), clone(request)];
        save(state); return clone(state.assistance.tickets);
      },
      submitAppeal: async text => {
        validateText(text);
        const state = assistanceState();
        state.assistance.restrictions.unshift({ id: crypto.randomUUID(), date: dateKey(new Date()),
          type: 'Апеляція модератору', reason: text.trim(), status: 'На розгляді' });
        save(state); return clone(state.assistance.restrictions);
      },
      submitContact: async request => {
        validateText(request.message);
        if (!request.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) throw new Error('Вкажіть ім’я та коректний email.');
        const state = assistanceState();
        if (!state.assistance.subjects.includes(request.subject)) throw new Error('Оберіть тему.');
        state.contactRequests = [...(state.contactRequests || []), clone(request)];
        save(state);
      },
    },
    chat: {
      list: async id => clone(dialogState(id).messages?.[id] || []),
      send: async (id, text) => {
        const state = dialogState(id);
        if (!text.trim() || text.length > 4000) throw new Error('Повідомлення має містити від 1 до 4000 символів.');
        const message: ChatMessage = { id: crypto.randomUUID(), senderName: fullName(identity()), text: text.trim(),
          time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }), isHost: true };
        state.messages ??= {};
        state.messages[id] = [...(state.messages[id] || []), message];
        save(state);
        return clone(message);
      },
    },
    mode: 'demo', resetDemo: () => store.removeItem(key()),
    properties: {
      getAll: async params => clone(read().properties.filter(p =>
        (!params?.search || `${p.title} ${p.description} ${p.location}`.toLowerCase().includes(params.search.toLowerCase())) &&
        (!params?.categoryId || p.categoryId === params.categoryId) && (params?.maxPrice === undefined || p.price <= params.maxPrice))),
      getMine: async () => clone(read().properties.filter(p => p.authorId === currentId())),
      getById: async id => clone(propertyById(read(), id)),
      create: async dto => {
        const state = read();
        const category = state.categories.find(c => c.id === dto.categoryId);
        if (!category || !dto.title.trim() || !Number.isFinite(dto.price) || dto.price <= 0 || dto.price > 1000000 ||
            (dto.maxGuests !== undefined && (!Number.isInteger(dto.maxGuests) || dto.maxGuests < 1 || dto.maxGuests > 100)))
          throw new Error('Перевірте назву, категорію, ціну та місткість.');
        const property: RouteItem = { ...dto, id: crypto.randomUUID(), categoryId: category.id, categoryName: category.name,
          authorId: currentId(), authorName: fullName(identity()), averageRating: 0, imageUrls: dto.imageUrls || [],
          maxGuests: dto.maxGuests || 4, createdAt: new Date().toISOString() };
        state.properties.unshift(property); save(state); return clone(property);
      },
      update: async (id, dto) => {
        const state = read(); const property = propertyById(state, id);
        if (property.authorId !== currentId()) throw new Error('Немає доступу до помешкання.');
        if ((dto.price !== undefined && (!Number.isFinite(dto.price) || dto.price <= 0 || dto.price > 1000000)) ||
            (dto.maxGuests !== undefined && (!Number.isInteger(dto.maxGuests) || dto.maxGuests < 1 || dto.maxGuests > 100)))
          throw new Error('Перевірте ціну та місткість.');
        Object.assign(property, dto); save(state); return clone(property);
      },
      delete: async id => {
        const state = read(); const property = propertyById(state, id);
        if (property.authorId !== currentId()) throw new Error('Немає доступу до помешкання.');
        if (state.bookings.some(b => b.routeId === id)) throw new Error('Помешкання має історію бронювань.');
        state.properties = state.properties.filter(p => p.id !== id); save(state);
      },
    },
    bookings: {
      quote: async request => quote(read(), request),
      create: async request => {
        const state = read(); const price = quote(state, request); const property = propertyById(state, request.routeId);
        const booking: BookingRecord = { ...request, ...price, id: crypto.randomUUID(), title: property.title,
          location: property.location, imageUrl: property.imageUrls[0] || null,
          guestId: currentId(), guestName: fullName(identity()), hostId: property.authorId!, hostName: property.authorName,
          status: 'Pending', cancellationReason: null };
        state.bookings.unshift(booking); save(state); return clone(booking);
      },
      list: async (host = false) => clone(read().bookings.filter(b => (host ? b.hostId : b.guestId) === currentId())
        .map(b => b.status === 'Confirmed' && b.checkOut <= dateKey(new Date()) ? { ...b, status: 'Completed' as const } : b)),
      unavailable: async routeId => read().bookings.filter(b => b.routeId === routeId && active(b) && b.checkOut > dateKey(new Date()))
        .map(b => ({ start: b.checkIn, end: b.checkOut })),
      changeStatus: async (id, status, reason) => {
        const state = read(); const booking = state.bookings.find(b => b.id === id);
        if (!booking || (booking.guestId !== currentId() && booking.hostId !== currentId())) throw new Error('Немає доступу до бронювання.');
        const host = booking.hostId === currentId();
        const allowed = host
          ? (booking.status === 'Pending' && (status === 'Confirmed' || status === 'Declined')) || (booking.status === 'Confirmed' && status === 'Cancelled')
          : active(booking) && status === 'Cancelled';
        if (!allowed || booking.checkIn < dateKey(new Date())) throw new Error('Цей перехід статусу недоступний.');
        booking.status = status; booking.cancellationReason = reason || null; save(state); return clone(booking);
      },
    },
    categories: {
      getAll: async () => clone(read().categories),
      getById: async id => { const category = read().categories.find(c => c.id === id); if (!category) throw new Error('Категорію не знайдено.'); return clone(category); },
      create: async dto => { const state = read(); const category = { ...dto, id: crypto.randomUUID() }; state.categories.push(category); save(state); return clone(category); },
      update: async (id, dto) => { const state = read(); const category = state.categories.find(c => c.id === id); if (!category) throw new Error('Категорію не знайдено.'); Object.assign(category, dto); save(state); return clone(category); },
      delete: async id => { const state = read(); if (state.properties.some(p => p.categoryId === id)) throw new Error('Категорія використовується.'); state.categories = state.categories.filter(c => c.id !== id); save(state); },
    },
    favorites: {
      getMyFavorites: async () => { const state = read(); return clone(state.properties.filter(p => state.favorites.includes(p.id))); },
      toggle: async routeId => {
        const state = read(); propertyById(state, routeId);
        const isFavorite = !state.favorites.includes(routeId);
        state.favorites = isFavorite ? [...state.favorites, routeId] : state.favorites.filter(id => id !== routeId);
        save(state); return { isFavorite, message: 'Оновлено' };
      },
    },
    reviews: {
      getByRouteId: async routeId => clone(read().reviews.filter(r => r.routeId === routeId)),
      addReview: async dto => {
        const state = read(); propertyById(state, dto.routeId);
        const review: Review = { id: crypto.randomUUID(), routeId: dto.routeId, rating: dto.rating, comment: dto.text,
          userId: currentId(), userName: fullName(identity()), createdAt: new Date().toISOString() };
        state.reviews.push(review); save(state); return clone(review);
      },
    },
    finance: {
      available: true,
      load: async () => financeResult(read()),
      withdraw: async amount => {
        const state = read();
        if (!Number.isFinite(amount) || amount <= 0 || amount > state.finance.balance) throw new Error('Недостатньо коштів або некоректна сума.');
        state.finance.balance -= amount;
        state.finance.transactions.unshift({ id: crypto.randomUUID(), date: dateKey(new Date()), title: 'Демонстраційне виведення',
          type: 'payout', amount: -amount, commission: 0, status: 'Успішно' });
        save(state); return financeResult(state);
      },
      updatePayoutSettings: async settings => {
        const state = read(); Object.assign(state.finance.payoutSettings, settings); save(state); return financeResult(state);
      },
    },
  };
}
