// src/context/RoutesContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncService } from '../services/sync.service';
import { routesApi, favoriteApi } from '../services/api.service';
import { storage } from '../services/storage.service';
import type { RouteItem, Booking } from '../types';

interface RoutesContextType {
  routes: RouteItem[];
  favorites: string[];
  bookings: Booking[];
  loading: boolean;
  addRoute: (route: RouteItem) => Promise<void>;
  deleteRoute: (routeId: string) => Promise<void>; // <--- ДОДАЙТЕ ЦЕЙ РЯДОК
  toggleFavorite: (routeId: string) => Promise<void>;
  addBooking: (booking: Booking) => void;
  refreshRoutes: (searchQuery?: string, forceRefresh?: boolean) => Promise<void>;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteItem[]>(() => storage.routes.getCustom());
  const [favorites, setFavorites] = useState<string[]>(() => storage.favorites.get());
  const [bookings, setBookings] = useState<Booking[]>(() => storage.bookings.get());
  const [loading, setLoading] = useState(false);

  const refreshRoutes = async (searchQuery = '', forceRefresh = false) => {
    setLoading(true);
    try {
      const syncedRoutes = await syncService.syncRoutes(
        searchQuery ? { search: searchQuery } : undefined,
        forceRefresh
      );
      setRoutes(syncedRoutes);

      // Фоново підтягуємо обране
      const syncedFavs = await syncService.syncFavorites(forceRefresh);
      setFavorites(syncedFavs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRoutes();
  }, []);

  const addRoute = async (newRoute: RouteItem) => {
    storage.routes.addCustom(newRoute);
    setRoutes((prev) => [newRoute, ...prev.filter((r) => r.id !== newRoute.id)]);

    try {
      await routesApi.create({
        title: newRoute.title,
        description: newRoute.description,
        location: newRoute.location,
        price: newRoute.price,
        categoryId: newRoute.categoryId,
        imageUrls: newRoute.imageUrls,
        amenities: newRoute.amenities,
      });
      // Скидаємо кеш маршрутів, щоб підтягнути оновлені з сервера
      syncService.invalidate('routes_');
    } catch (e) {
      console.warn('Маршрут збережено локально:', e);
    }
  };

  // ================= ОСЬ ТУТ ДОДАЄТЬСЯ deleteRoute =================
  const deleteRoute = async (routeId: string) => {
    // 1. Миттєво видаляємо зі стейту React (щоб на Головній і в Каталозі зникло без F5)
    setRoutes((prev) => prev.filter((r) => String(r.id) !== String(routeId)));

    // 2. Видаляємо з localStorage
    storage.routes.removeCustom(routeId);

    // 3. Скидаємо кеш
    syncService.invalidate('routes_');

    // 4. Відправляємо запит на видалення в базу даних C#
    try {
      await routesApi.delete(routeId);
    } catch (e) {
      console.warn('Помилка видалення на сервері:', e);
    }
  };
  // =================================================================

  const toggleFavorite = async (routeId: string) => {
    const nextFavs = storage.favorites.toggle(routeId);
    setFavorites(nextFavs);

    try {
      await favoriteApi.toggle(routeId);
      syncService.invalidate('user_favorites');
    } catch (e) {
      console.warn('Обране збережено локально:', e);
    }
  };

  const addBooking = (booking: Booking) => {
    const updated = storage.bookings.add(booking);
    setBookings(updated);
  };

  return (
    <RoutesContext.Provider
      value={{
        routes,
        favorites,
        bookings,
        loading,
        addRoute,
        deleteRoute, // <--- І ОСЬ ТУТ ПЕРЕДАЄМО ЇЇ В КОНТЕКСТ
        toggleFavorite,
        addBooking,
        refreshRoutes,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = () => {
  const context = useContext(RoutesContext);
  if (!context) {
    throw new Error('useRoutes must be used within a RoutesProvider');
  }
  return context;
};