// One registry supplies every language/currency selector and the SettingsContext.
export const LANGUAGE_OPTIONS = [
  { code: 'UA', title: 'Українська (UA)', locale: 'uk-UA' },
  { code: 'EN', title: 'English (EN)', locale: 'en-US' },
  { code: 'DE', title: 'Deutsch (DE)', locale: 'de-DE' },
  { code: 'PL', title: 'Polski (PL)', locale: 'pl-PL' },
] as const;
export const CURRENCY_OPTIONS = [
  { code: 'UAH', title: 'Українська гривня (₴)', symbol: '₴', rate: 1 },
  { code: 'USD', title: 'Долар США ($)', symbol: '$', rate: 1 / 41.5 },
  { code: 'EUR', title: 'Євро (€)', symbol: '€', rate: 1 / 45 },
  { code: 'PLN', title: 'Польський злотий (zł)', symbol: 'zł', rate: 1 / 10.6 },
] as const;
export type AppLanguage = typeof LANGUAGE_OPTIONS[number]['code'];
export type AppCurrency = typeof CURRENCY_OPTIONS[number]['code'];
export const parseLanguage = (value: string | null): AppLanguage => LANGUAGE_OPTIONS.find(item => item.code === value)?.code || 'UA';
export const parseCurrency = (value: string | null): AppCurrency => CURRENCY_OPTIONS.find(item => item.code === value)?.code || 'UAH';

// These fixed rates are estimates for display, not a currency trading/payment rate.
export const currencyConfig = (code: AppCurrency) => CURRENCY_OPTIONS.find(item => item.code === code)!;
export const languageConfig = (code: AppLanguage) => LANGUAGE_OPTIONS.find(item => item.code === code)!;
