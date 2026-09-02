// src/data/mockData.ts
import type { RouteItem, Booking, Review, User } from '../types';

export interface HostBookingRequest {
  id: string;
  propertyTitle: string;
  guestName: string;
  guestAvatar?: string;
  dates: string;
  totalSum: number;
  guestsCount: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isHost?: boolean;
}

export interface BlacklistGuest {
  id: string;
  name: string;
  email: string;
  reason: string;
  date: string;
}

// 1. ДЕМО ПОЛЬЗОВАТЕЛЬ
export const MOCK_DEFAULT_USER: User = {
  id: 'u-demo-1',
  firstName: 'Анастасія',
  lastName: 'Приходько',
  email: 'anastasia@gmail.com',
  phoneNumber: '+380 (67) 123-45-67',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80',
  role: 'User',
};

// 2. ДЕМО ПОМЕШКАННЯ ТА МАРШРУТИ
export const MOCK_ROUTES: RouteItem[] = [
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
  {
    id: '4',
    title: "Шале 'Вершина Свободи'",
    description: 'Сучасне дворівневе шале біля витягів у Буковелі.',
    location: 'Буковель, Поляниця',
    distanceKm: 0,
    durationHours: 0,
    price: 3600,
    categoryId: 'chalet',
    categoryName: 'Шале',
    authorName: 'Олександр Петренко',
    averageRating: 5.0,
    reviewsCount: 19,
    imageUrls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80'],
    createdAt: '2026-08-18',
  },
];

// 3. ДЕМО БРОНИРОВАНИЯ ТУРИСТА
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    routeId: '1',
    title: "Шале 'Карпатська Тиша'",
    location: 'с. Пилипець, Закарпатська область',
    checkIn: '12 грудня 2026',
    checkOut: '18 грудня 2026',
    guests: 2,
    totalSum: 12000,
    paidAmount: 12000,
    paymentType: 'full',
    status: 'Підтверджено',
    date: '28.08.2026',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b2',
    routeId: '2',
    title: "Глемпінг 'Затишний ліс'",
    location: 'Яремче, Івано-Франківська обл.',
    checkIn: '01 вересня 2026',
    checkOut: '05 вересня 2026',
    guests: 2,
    totalSum: 5550,
    paidAmount: 5550,
    paymentType: 'full',
    status: 'Підтверджено',
    date: '20.08.2026',
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
  },
];

// 4. ДЕМО ЗАЯВКИ ДЛЯ ХОСТА
export const MOCK_HOST_REQUESTS: HostBookingRequest[] = [
  {
    id: 'req1',
    propertyTitle: 'Еко-садиба «Затишок лісу» з карпатським чаном',
    guestName: 'Олександр Дмитренко',
    dates: '12 Вересня — 16 Вересня (4 ночі)',
    totalSum: 9600,
    guestsCount: 2,
    status: 'pending',
    createdAt: '2 год тому',
  },
  {
    id: 'req2',
    propertyTitle: "Шале 'Вершина Свободи'",
    guestName: 'Ірина Савченко',
    dates: '18 Вересня — 20 Вересня (2 ночі)',
    totalSum: 7200,
    guestsCount: 4,
    status: 'pending',
    createdAt: '5 год тому',
  },
];

// 5. ДЕМО ЧАТЫ И СООБЩЕНИЯ
export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', senderId: 'guest', senderName: 'Іван Мельник', text: 'Доброго дня! Чи є у вас генератор, якщо вимкнуть світло?', time: '14:20', isHost: false },
  { id: 'm2', senderId: 'host', senderName: 'Олександр (Господар)', text: 'Вітаю! Так, у нас встановлено генератор на 7.5 кВт, швидкісний Wi-Fi працює цілодобово.', time: '14:22', isHost: true },
  { id: 'm3', senderId: 'guest', senderName: 'Іван Мельник', text: 'Чудово! А чан входить у вартість чи оплачується окремо?', time: '14:25', isHost: false },
  { id: 'm4', senderId: 'host', senderName: 'Олександр (Господар)', text: 'Перша розпалка чану на дровах у подарунок при бронюванні від 3 діб 😊', time: '14:28', isHost: true },
];

// 6. ДЕМО ЧЕРНЫЙ СПИСОК
export const MOCK_BLACKLIST: BlacklistGuest[] = [
  { id: 'bl1', name: 'Артем Клименко', email: 'artem.k@gmail.com', reason: 'Порушення правил тиші та вечірка без дозволу', date: '15 Серпня 2026' },
  { id: 'bl2', name: 'Наталія Сидоренко', email: 'natali@ukr.net', reason: 'Несплата за додаткові послуги чану', date: '02 Липня 2026' },
  { id: 'bl3', name: 'Владислав Швед', email: 'vlad.shved@gmail.com', reason: 'Псування майна в котеджі', date: '20 Червня 2026' },
];

// 7. ДЕМО ОТЗЫВЫ
export const MOCK_DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    routeId: '1',
    userId: 'u-1',
    userName: 'Анастасія П.',
    rating: 5,
    comment: 'Неймовірне місце! Чан під зорями — це щось магічне. Господарі дуже привітні, обов’язково повернемось!',
    createdAt: '2026-08-20',
  },
  {
    id: 'rev-2',
    routeId: '1',
    userId: 'u-2',
    userName: 'Михайло Р.',
    rating: 5,
    comment: 'Ідеальна чистота, швидкий інтернет (працював віддалено без проблем) та дуже теплий камін.',
    createdAt: '2026-08-15',
  },
];