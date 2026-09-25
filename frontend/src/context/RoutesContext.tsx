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
  deleteRoute: (routeId: string) => Promise<void>;
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

  const refreshRoutes = async (searchQuery = '', forceRefresh = true) => {
    setLoading(true);
    try {
      const syncedRoutes = await syncService.syncRoutes(
        searchQuery ? { search: searchQuery } : undefined,
        forceRefresh
      );
      setRoutes(syncedRoutes);

      const syncedFavs = await syncService.syncFavorites(forceRefresh);
      setFavorites(syncedFavs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRoutes('', true);

    const handleFocus = () => {
      refreshRoutes('', true);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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
      syncService.invalidate('routes_');
      await refreshRoutes('', true);
    } catch (e) {
      console.warn('Error saving route to server:', e);
    }
  };

  const deleteRoute = async (routeId: string) => {
    setRoutes((prev) => prev.filter((r) => String(r.id) !== String(routeId)));
    storage.routes.removeCustom(routeId);
    syncService.invalidate('routes_');

    try {
      await routesApi.delete(routeId);
      await refreshRoutes('', true);
    } catch (e) {
      console.warn('Error deleting route from server:', e);
    }
  };

  const toggleFavorite = async (routeId: string) => {
    const nextFavs = storage.favorites.toggle(routeId);
    setFavorites(nextFavs);

    try {
      await favoriteApi.toggle(routeId);
      syncService.invalidate('user_favorites');
    } catch (e) {
      console.warn('Error toggling favorite on server:', e);
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
        deleteRoute,
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