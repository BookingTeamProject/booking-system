// src/services/storage.service.ts
import type { User, RouteItem, Booking, Review, UserRole } from '../types';

const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  ROLE_OVERRIDE: 'role_override',
  CUSTOM_ROUTES: 'custom_routes',
  FAVORITES: 'fav_ids',
  BOOKINGS: 'bookings',
  REVIEWS_PREFIX: 'reviews_',
} as const;

export const checkIsLandlord = (role?: UserRole | string | null): boolean => {
  if (!role) return false;
  return role === 'Landlord' || role === 1 || String(role) === '1' || storage.role.get() === 'Landlord';
};

export const storage = {
  // 1. АВТОРИЗАЦИЯ И ТОКЕНЫ
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

  // 3. ФИКСАЦИЯ РОЛИ
  role: {
    get: (): string | null => localStorage.getItem(STORAGE_KEYS.ROLE_OVERRIDE),
    set: (role: string) => localStorage.setItem(STORAGE_KEYS.ROLE_OVERRIDE, role),
    clear: () => localStorage.removeItem(STORAGE_KEYS.ROLE_OVERRIDE),
  },

  // 4. СОЗДАННЫЕ ПОМЕШКАНИЯ И МАРШРУТЫ
  routes: {
    getCustom: (): RouteItem[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_ROUTES);
      if (!raw) return [];
      try {
        return JSON.parse(raw) as RouteItem[];
      } catch {
        return [];
      }
    },
    addCustom: (route: RouteItem): RouteItem[] => {
      const current = storage.routes.getCustom();
      const filtered = current.filter((r) => r.id !== route.id);
      const updated = [route, ...filtered];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ROUTES, JSON.stringify(updated));
      return updated;
    },
  },

  // 5. ИЗБРАННОЕ (FAVORITES)
  favorites: {
    get: (): string[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!raw) return [];
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

  // 6. БРОНИРОВАНИЯ (BOOKINGS)
  bookings: {
    get: (): Booking[] => {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!raw) return [];
      try {
        return JSON.parse(raw) as Booking[];
      } catch {
        return [];
      }
    },
    add: (booking: Booking): Booking[] => {
      const current = storage.bookings.get();
      const updated = [booking, ...current];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    },
  },

  // 7. ОТЗЫВЫ (REVIEWS ПО ID МАРШРУТА)
  reviews: {
    get: (routeId: string): Review[] => {
      const raw = localStorage.getItem(`${STORAGE_KEYS.REVIEWS_PREFIX}${routeId}`);
      if (!raw) return [];
      try {
        return JSON.parse(raw) as Review[];
      } catch {
        return [];
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