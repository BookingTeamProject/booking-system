// src/services/sync.service.ts
import { routesApi, userApi, favoriteApi, categoriesApi, reviewApi } from './api.service';
import { storage } from './storage.service';
import type { RouteItem, User, Review } from '../types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
}

class DataSyncService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private inFlightRequests = new Map<string, Promise<any>>();

  // Час життя кешу за замовчуванням (3 хвилини)
  private readonly DEFAULT_TTL = 3 * 60 * 1000;

  private generateHash(data: any): string {
    try {
      return JSON.stringify(data);
    } catch {
      return String(Date.now());
    }
  }

  /**
   * Універсальний метод отримання даних із захистом від дублювання та кешем
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL,
    forceRefresh: boolean = false
  ): Promise<{ data: T; isFromCache: boolean; hasChanged: boolean }> {
    const cached = this.memoryCache.get(key);
    const now = Date.now();

    // 1. Повертаємо з кешу, якщо він свіжий і не потрібен примусовий рефреш
    if (!forceRefresh && cached && now - cached.timestamp < ttl) {
      return { data: cached.data, isFromCache: true, hasChanged: false };
    }

    // 2. Дедуплікація: якщо запит з таким ключем ВЖЕ летить, підключаємося до нього
    if (this.inFlightRequests.has(key)) {
      const data = await this.inFlightRequests.get(key);
      return { data, isFromCache: false, hasChanged: false };
    }

    // 3. Запускаємо новий запит
    const requestPromise = (async () => {
      try {
        const freshData = await fetcher();
        const newHash = this.generateHash(freshData);
        const hasChanged = !cached || cached.hash !== newHash;

        // Зберігаємо в кеш тільки якщо дані валідні
        this.memoryCache.set(key, {
          data: freshData,
          timestamp: now,
          hash: newHash,
        });

        return { data: freshData, hasChanged };
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, requestPromise.then((res) => res.data));

    const result = await requestPromise;
    return { data: result.data, isFromCache: false, hasChanged: result.hasChanged };
  }

  // ================= СИНХРОНІЗАЦІЯ МАРШРУТІВ ТА ЖИТЛА =================
  async syncRoutes(
    params?: { search?: string; categoryId?: string; maxPrice?: number },
    forceRefresh = false
  ): Promise<RouteItem[]> {
    const cacheKey = `routes_${params?.search || ''}_${params?.categoryId || ''}_${params?.maxPrice || ''}`;

    try {
      const { data, hasChanged } = await this.getOrFetch<RouteItem[]>(
        cacheKey,
        async () => {
          const apiRoutes = await routesApi.getAll(params);
          const custom = storage.routes.getCustom();
          // Об'єднуємо локально створені об'єкти з бекендом
          return [...custom, ...apiRoutes.filter((ar) => !custom.some((c) => c.id === ar.id))];
        },
        2 * 60 * 1000, // 2 хвилини TTL
        forceRefresh
      );

      // Якщо дані дійсно змінились, оновлюємо резерв у localStorage
      if (hasChanged && (!params || Object.keys(params).length === 0)) {
        localStorage.setItem('custom_routes', JSON.stringify(data));
      }

      return data;
    } catch (err) {
      console.warn('⚠️ Помилка зв’язку з сервером, використовуємо локальний кеш:', err);
      return storage.routes.getCustom();
    }
  }

  // ================= СИНХРОНІЗАЦІЯ ПРОФІЛЮ КОРИСТУВАЧА =================
  async syncUserProfile(forceRefresh = false): Promise<User | null> {
    const token = storage.auth.getToken();
    if (!token) return null;

    try {
      const { data, hasChanged } = await this.getOrFetch<User>(
        'user_profile',
        () => userApi.getProfile(),
        5 * 60 * 1000,
        forceRefresh
      );

      if (hasChanged) {
        storage.user.set(data);
      }

      return data;
    } catch {
      return storage.user.get();
    }
  }

  // ================= СИНХРОНІЗАЦІЯ ОБРАНОГО =================
  async syncFavorites(forceRefresh = false): Promise<string[]> {
    const token = storage.auth.getToken();
    if (!token) return storage.favorites.get();

    try {
      const { data, hasChanged } = await this.getOrFetch<string[]>(
        'user_favorites',
        async () => {
          const res = await favoriteApi.getMyFavorites();
          if (Array.isArray(res)) {
            // Нормалізуємо якщо бекенд повертає об'єкти або масив рядків id
            return res.map((item: any) => (typeof item === 'string' ? item : item.id || item.routeId));
          }
          return [];
        },
        60 * 1000, // 1 хвилина TTL
        forceRefresh
      );

      if (hasChanged) {
        storage.favorites.set(data);
      }

      return data;
    } catch {
      return storage.favorites.get();
    }
  }

  // ================= СИНХРОНІЗАЦІЯ КАТЕГОРІЙ =================
  async syncCategories(): Promise<any[]> {
    try {
      const { data } = await this.getOrFetch(
        'categories_all',
        () => categoriesApi.getAll(),
        10 * 60 * 1000 // Категорії рідко змінюються (10 хв TTL)
      );
      return data;
    } catch {
      return [];
    }
  }

  // ================= СИНХРОНІЗАЦІЯ ВІДГУКІВ =================
  async syncReviews(routeId: string, forceRefresh = false): Promise<Review[]> {
    try {
      const { data } = await this.getOrFetch<Review[]>(
        `reviews_${routeId}`,
        async () => {
          const res = await reviewApi.getByRouteId(routeId);
          return Array.isArray(res) ? res : [];
        },
        60 * 1000,
        forceRefresh
      );
      return data;
    } catch {
      return storage.reviews.get(routeId);
    }
  }

  // Очистити кеш (наприклад, при Logout або після створення нового житла)
  invalidate(keyPrefix?: string) {
    if (!keyPrefix) {
      this.memoryCache.clear();
      return;
    }
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const syncService = new DataSyncService();