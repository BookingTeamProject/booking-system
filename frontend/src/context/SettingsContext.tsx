import { currencyConfig, languageConfig, parseLanguage, parseCurrency } from '../config/locales';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, type AppLanguage, type AppCurrency } from '../services/storage.service';

// Словничок для інтерфейсу
const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  UA: {
    destination: 'НАПРЯМОК',
    dates: 'ВВЕДІТЬ ДАТУ',
    guests: 'КІМНАТИ ТА ГОСТІ',
    showMap: 'Показати мапу',
    filters: 'Фільтри',
    clearAll: 'ОЧИСТИТИ ВСЕ',
    pricePerNight: 'Ціна за ніч',
    propertyType: 'Тип помешкання',
    amenities: 'Зручності',
    rating: 'Рейтинг еко-садиби',
    roomsCount: 'Кількість кімнат',
    sortBy: 'Сортувати за:',
    recommended: 'Рекомендовані',
    priceAsc: 'Спочатку дешевші',
    priceDesc: 'Спочатку дорожчі',
    bestRating: 'Найкращий рейтинг',
    perNight: '/ ніч',
    totalFor: 'Всього за 7 ночей:',
    details: 'Детальніше',
    notFound: 'Нічого не знайдено',
  },
  EN: {
    destination: 'DESTINATION',
    dates: 'SELECT DATES',
    guests: 'ROOMS & GUESTS',
    showMap: 'Show Map',
    filters: 'Filters',
    clearAll: 'CLEAR ALL',
    pricePerNight: 'Price per night',
    propertyType: 'Property type',
    amenities: 'Amenities',
    rating: 'Rating',
    roomsCount: 'Number of rooms',
    sortBy: 'Sort by:',
    recommended: 'Recommended',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    bestRating: 'Top Rated',
    perNight: '/ night',
    totalFor: 'Total for 7 nights:',
    details: 'Details',
    notFound: 'No properties found',
  },
  DE: {
    destination: 'REISEZIEL',
    dates: 'DATEN WÄHLEN',
    guests: 'ZIMMER & GÄSTE',
    showMap: 'Karte anzeigen',
    filters: 'Filter',
    clearAll: 'ALLES ZURÜCKSETZEN',
    pricePerNight: 'Preis pro Nacht',
    propertyType: 'Unterkunftsart',
    amenities: 'Ausstattung',
    rating: 'Bewertung',
    roomsCount: 'Anzahl der Zimmer',
    sortBy: 'Sortieren nach:',
    recommended: 'Empfohlen',
    priceAsc: 'Preis aufsteigend',
    priceDesc: 'Preis absteigend',
    bestRating: 'Beste Bewertung',
    perNight: '/ Nacht',
    totalFor: 'Gesamt für 7 Nächte:',
    details: 'Details',
    notFound: 'Keine Unterkünfte gefunden',
  },
  PL: {
    destination: 'KIERUNEK',
    dates: 'WYBIERZ DATY',
    guests: 'POKOJE I GOŚCIE',
    showMap: 'Pokaż mapę',
    filters: 'Filtry',
    clearAll: 'WYCZYŚĆ WSZYSTKO',
    pricePerNight: 'Cena za noc',
    propertyType: 'Typ obiektu',
    amenities: 'Udogodnienia',
    rating: 'Ocena',
    roomsCount: 'Liczba pokoi',
    sortBy: 'Sortuj według:',
    recommended: 'Polecane',
    priceAsc: 'Cena rosnąco',
    priceDesc: 'Cena malejąco',
    bestRating: 'Najwyższa ocena',
    perNight: '/ noc',
    totalFor: 'Łącznie za 7 nocy:',
    details: 'Szczegóły',
    notFound: 'Nie znaleziono obiektów',
  },
};

interface SettingsContextType {
  language: AppLanguage;
  currency: AppCurrency;
  setLanguage: (lang: AppLanguage) => void;
  setCurrency: (curr: AppCurrency) => void;
  formatPrice: (amountInUah: number) => string;
  getRawConvertedPrice: (amountInUah: number) => number;
  currencySymbol: string;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<AppLanguage>(() => storage.locale.getLanguage());
  const [currency, setCurrState] = useState<AppCurrency>(() => storage.locale.getCurrency());

  const setLanguage = (lang: AppLanguage) => {
    storage.locale.setLanguage(lang);
    setLangState(lang);
  };

  const setCurrency = (curr: AppCurrency) => {
    storage.locale.setCurrency(curr);
    setCurrState(curr);
  };

  // Синхронізація між різними вкладками браузера
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_language' || e.key === null) {
        setLangState(parseLanguage(e.newValue));
      }
      if (e.key === 'app_currency' || e.key === null) {
        setCurrState(parseCurrency(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => { document.documentElement.lang = languageConfig(language).locale; }, [language]);

  // Конвертація ціни з UAH у вибрану валюту з форматуванням
  const formatPrice = (amountInUah: number): string => {
    const rate = currencyConfig(currency).rate;
    const converted = Math.round(amountInUah * rate);
    const formattedNum = converted.toLocaleString(languageConfig(language).locale);
    const symbol = currencyConfig(currency).symbol;

    if (currency === 'USD' || currency === 'EUR') {
      return `${symbol}${formattedNum}`;
    }
    return `${formattedNum} ${symbol}`;
  };

  const getRawConvertedPrice = (amountInUah: number): number => {
    const rate = currencyConfig(currency).rate;
    return Math.round(amountInUah * rate);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.UA[key] || key;
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        formatPrice,
        getRawConvertedPrice,
        currencySymbol: currencyConfig(currency).symbol,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};