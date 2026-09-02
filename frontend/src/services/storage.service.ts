// src/services/storage.service.ts
import type { User, RouteItem, Booking, Review, UserRole } from '../types';
import {
  MOCK_ROUTES,
  MOCK_BOOKINGS,
  MOCK_MESSAGES,
  MOCK_BLACKLIST,
  MOCK_DEFAULT_REVIEWS,
  type HostBookingRequest,
  type ChatMessage,
  type BlacklistGuest,
} from '../data/mockData';

// Реэкспортируем типы
export type { HostBookingRequest, ChatMessage, BlacklistGuest };

const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  ROLE_OVERRIDE: 'role_override',
  CUSTOM_ROUTES: 'custom_routes',
  FAVORITES: 'fav_ids',
  BOOKINGS: 'bookings',
  REVIEWS_PREFIX: 'reviews_',
  BLACKLIST: 'host_blacklist',
  MESSAGES: 'chat_messages',
} as const;

export const checkIsLandlord = (role?: UserRole | string | null): boolean => {
  if (!role) return false;
  return role === 'Landlord' || role === 1 || String(role) === '1' || storage.role.get() === 'Landlord';
};

export const storage = {
  // 1. АВТОРИЗАЦИЯ
  auth: {
    getToken: (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN),
    getRefreshToken: (): string | null => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    setTokens: (token: string, refreshToken?: string) => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    },
    clear: () => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ROLE_OVERRIDE);
    },
  },

  // 2. ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
  user: {
    get: (): User | null => {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as User;
      } catch {
        return null;
      }
    },
    set: (user: User) => {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    update: (partial: Partial<User>): User | null => {
      const current = storage.user.get();
      if (current) {
        const merged: User = { ...current, ...partial };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
        return merged;
      }
      return null;
    },
  },

  // 3. РОЛЬ
  role: {
    get: (): string | null => localStorage.getItem(STORAGE_KEYS.ROLE_OVERRIDE),
    set: (role: string) => localStorage.setItem(STORAGE_KEYS.ROLE_OVERRIDE, role),
    clear: () => localStorage.removeItem(STORAGE_KEYS.ROLE_OVERRIDE),
  },

  // 4. МАРШРУТЫ И ЖИЛЬЕ
  routes: {
    getCustom: (): RouteItem[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_ROUTES);
      if (!raw) return MOCK_ROUTES;
      try {
        const parsed = JSON.parse(raw) as RouteItem[];
        return parsed.length > 0 ? parsed : MOCK_ROUTES;
      } catch {
        return MOCK_ROUTES;
      }
    },
    addCustom: (route: RouteItem): RouteItem[] => {
      const current = storage.routes.getCustom();
      const filtered = current.filter((r) => r.id !== route.id);
      const updated = [route, ...filtered];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ROUTES, JSON.stringify(updated));
      return updated;
    },
    removeCustom: (id: string): RouteItem[] => {
      const current = storage.routes.getCustom();
      const updated = current.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ROUTES, JSON.stringify(updated));
      return updated;
    },
  },

  // 5. ИЗБРАННОЕ
  favorites: {
    get: (): string[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!raw) return ['1'];
      try {
        return JSON.parse(raw) as string[];
      } catch {
        return [];
      }
    },
    set: (favs: string[]) => {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    },
    toggle: (id: string): string[] => {
      const current = storage.favorites.get();
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      storage.favorites.set(next);
      return next;
    },
  },

  // 6. БРОНИРОВАНИЯ
  bookings: {
    get: (): Booking[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!raw) return MOCK_BOOKINGS;
      try {
        const parsed = JSON.parse(raw) as Booking[];
        return parsed.length > 0 ? parsed : MOCK_BOOKINGS;
      } catch {
        return MOCK_BOOKINGS;
      }
    },
    add: (booking: Booking): Booking[] => {
      const current = storage.bookings.get();
      const updated = [booking, ...current];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    },
    cancel: (bookingId: string | number, _reason?: string): Booking[] => {
      const current = storage.bookings.get();
      const updated: Booking[] = current.map((b) =>
        String(b.id) === String(bookingId) ? { ...b, status: 'Скасовано' } : b
      );
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    },
  },

  // 7. ЧЕРНЫЙ СПИСОК
  blacklist: {
    get: (): BlacklistGuest[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.BLACKLIST);
      if (!raw) return MOCK_BLACKLIST;
      try {
        return JSON.parse(raw);
      } catch {
        return MOCK_BLACKLIST;
      }
    },
    add: (guest: { name: string; email: string; reason: string }) => {
      const current = storage.blacklist.get();
      const updated = [{ id: String(Date.now()), ...guest, date: new Date().toLocaleDateString('uk-UA') }, ...current];
      localStorage.setItem(STORAGE_KEYS.BLACKLIST, JSON.stringify(updated));
      return updated;
    },
    remove: (id: string) => {
      const current = storage.blacklist.get();
      const updated = current.filter((g) => g.id !== id);
      localStorage.setItem(STORAGE_KEYS.BLACKLIST, JSON.stringify(updated));
      return updated;
    },
  },

  // 8. ЧАТ
  chat: {
    get: (): ChatMessage[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (!raw) return MOCK_MESSAGES;
      try {
        return JSON.parse(raw);
      } catch {
        return MOCK_MESSAGES;
      }
    },
    send: (msg: { senderName: string; text: string; isHost?: boolean }): ChatMessage[] => {
      const current = storage.chat.get();
      const newMsg: ChatMessage = {
        id: String(Date.now()),
        senderId: msg.isHost ? 'host' : 'guest',
        senderName: msg.senderName,
        text: msg.text,
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        isHost: msg.isHost,
      };
      const updated = [...current, newMsg];
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      return updated;
    },
  },

  // 9. ОТЗЫВЫ
  reviews: {
    get: (routeId: string): Review[] => {
      const raw = localStorage.getItem(`${STORAGE_KEYS.REVIEWS_PREFIX}${routeId}`);
      if (!raw) return MOCK_DEFAULT_REVIEWS;
      try {
        return JSON.parse(raw) as Review[];
      } catch {
        return MOCK_DEFAULT_REVIEWS;
      }
    },
    add: (routeId: string, review: Review): Review[] => {
      const current = storage.reviews.get(routeId);
      const filtered = current.filter((r) => r.id !== review.id);
      const updated = [review, ...filtered];
      localStorage.setItem(`${STORAGE_KEYS.REVIEWS_PREFIX}${routeId}`, JSON.stringify(updated));
      return updated;
    },
  },
};