import { describe, expect, it } from 'vitest';
import { internationalPhone } from './phoneCountries';

describe('phone input', () => {
  it('normalizes national and international Ukrainian numbers', () => {
    expect(internationalPhone('UA', '067 123-45-67')).toBe('+380671234567');
    expect(internationalPhone('UA', '+380 (67) 123-45-67')).toBe('+380671234567');
  });
  it('uses the selected country and retains the Italian leading zero', () => {
    expect(internationalPhone('PL', '512345678')).toBe('+48512345678');
    expect(internationalPhone('IT', '0612345678')).toBe('+390612345678');
    expect(internationalPhone('OTHER', '+61 412345678')).toBe('+61412345678');
  });
  it('rejects mismatched codes, short numbers and letters', () => {
    expect(() => internationalPhone('PL', '+380671234567')).toThrow();
    expect(() => internationalPhone('UA', '123')).toThrow();
    expect(() => internationalPhone('UA', '067abc1234567')).toThrow();
    expect(() => internationalPhone('OTHER', '412345678')).toThrow();
  });
});
