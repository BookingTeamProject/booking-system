// src/context/RoutesContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { storage } from '../services/storage.service';
import type { RouteItem, Booking } from '../types';

const INITIAL_ROUTES: RouteItem[] = [
  {
    id: '1',
    title: 'Еко-садиба «Затишок лісу» з карпатським чаном',
    description: 'Приватне шале посеред смерекового лісу. Панорамна тераса, чан на дровах та закрита територія.',
    location: 'Яремче, Івано-Франківська обл.',
    distanceKm: 4.2,
    durationHours: 2,
    price: 2400,
    categoryId: 'chalet',
    categoryName: 'Шале в Карпатах',
    authorName: 'Олександр Петренко',
    averageRating: 4.95,
    reviewsCount: 28,
    imageUrls: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Швидкісний Wi-Fi', 'Гаряча вода', 'Камін на дровах', 'Кухня', 'Тераса'],
    createdAt: '2026-08-01',
  },
  {
    id: '2',
    title: 'Глемпінг-купол на полонині Стеришора',
    description: 'Неймовірні краєвиди Чорногори прямо з вашого ліжка. Тепла підлога, панорамне вікно, авторські сніданки.',
    location: 'с. Криворівня, Верховина',
    distanceKm: 8.0,
    durationHours: 4,
    price: 3200,
    categoryId: 'glamping',
    categoryName: 'Глемпінг',
    authorName: 'Марія Коваль',
    averageRating: 5.0,
    reviewsCount: 16,
    imageUrls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Швидкісний Wi-Fi', 'Панорамне вікно', 'Чан на полонині'],
    createdAt: '2026-08-10',
  },
  {
    id: '3',
    title: 'Маршрут на гору Шпиці та озеро Несамовите',
    description: 'Один з найвеличніших скельних хребтів Карпат. Джерельна вода, альпійські сосни та скелі-вежі.',
    location: 'Чорногірський хребет',
    distanceKm: 16.5,
    durationHours: 7,
    price: 850,
    categoryId: 'trail',
    categoryName: 'Піший маршрут',
    authorName: 'Гід Тарас',
    averageRating: 4.88,
    reviewsCount: 42,
    imageUrls: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'],
    createdAt: '2026-08-15',
  },
];

interface RoutesContextType {
  routes: RouteItem[];
  favorites: string[];
  bookings: Booking[];
  loading: boolean;
  addRoute: (route: RouteItem) => Promise<void>;
  toggleFavorite: (routeId: string) => Promise<void>;
  addBooking: (booking: Booking) => void;
  refreshRoutes: (searchQuery?: string) => Promise<void>;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteItem[]>(() => {
    const custom = storage.routes.getCustom();
    return [...custom, ...INITIAL_ROUTES];
  });
  const [favorites, setFavorites] = useState<string[]>(() => storage.favorites.get());
  const [bookings, setBookings] = useState<Booking[]>(() => storage.bookings.get());
  const [loading, setLoading] = useState(false);

  const refreshRoutes = async (searchQuery = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/routes?search=${encodeURIComponent(searchQuery)}`);
      const apiData = Array.isArray(res.data) ? res.data : [];
      const custom = storage.routes.getCustom();

      const merged = [...custom, ...apiData.filter((ar: RouteItem) => !custom.some((c) => c.id === ar.id))];
      setRoutes(merged.length > 0 ? merged : INITIAL_ROUTES);
    } catch {
      const custom = storage.routes.getCustom();
      setRoutes([...custom, ...INITIAL_ROUTES]);
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
      await api.post('/routes', {
        title: newRoute.title,
        description: newRoute.description,
        location: newRoute.location,
        price: newRoute.price,
        distanceKm: newRoute.distanceKm || 0,
        durationHours: newRoute.durationHours || 0,
        categoryId: newRoute.categoryId || 'chalet',
        imageUrls: newRoute.imageUrls,
        amenities: newRoute.amenities,
      });
    } catch (e) {
      console.warn('Маршрут збережено в локальний каталог:', e);
    }
  };

  const toggleFavorite = async (routeId: string) => {
    const nextFavs = storage.favorites.toggle(routeId);
    setFavorites(nextFavs);

    try {
      await api.post(`/favorite/${routeId}`);
    } catch (e) {
      console.warn('Обране оновлено локально:', e);
    }
  };

  const addBooking = (booking: Booking) => {
    const updated = storage.bookings.add(booking);
    setBookings(updated);
  };

  return (
    <RoutesContext.Provider value={{ routes, favorites, bookings, loading, addRoute, toggleFavorite, addBooking, refreshRoutes }}>
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