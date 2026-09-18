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

// ================= 8. ФІНАНСОВІ ТА ПЛАТІЖНІ ДАНІ =================

// 8. ДЕМО ФІНАНСИ ТА ТРАНЗАКЦІЇ
export interface FinancialTransaction {
  id: string;
  date: string;
  title: string;
  guestName?: string;
  propertyName?: string;
  amount: number;
  commission: number;
  type: 'income' | 'payout' | 'refund' | 'insurance';
  status: 'Виплачено' | 'Очікується' | 'Успішно' | 'Повернено';
}

export interface PayoutSettings {
  iban: string;
  frequency: 'Щодня' | 'Щотижня' | 'Щомісяця' | 'Щокварталу' | 'Щороку';
}

export const MOCK_INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    date: '28 Січ, 2026',
    title: 'Бронювання Колиба "Два Потоки"',
    guestName: 'Олена К.',
    propertyName: "Колиба 'Два Потоки', Яремче",
    amount: 18400,
    commission: 2208,
    type: 'income',
    status: 'Успішно',
  },
  {
    id: 'tx-2',
    date: '22 Січ, 2026',
    title: 'Бронювання Chalet "Eco-Smerika"',
    guestName: 'Андрій М.',
    propertyName: "Chalet 'Eco-Smerika', Микуличин",
    amount: 9300,
    commission: 1116,
    type: 'income',
    status: 'Виплачено',
  },
  {
    id: 'tx-3',
    date: '18 Січ, 2026',
    title: "Бронювання Будинок на дереві 'Пташине Гніздо'",
    guestName: 'Тетяна С.',
    propertyName: "Будинок на дереві 'Пташине Гніздо'",
    amount: 5600,
    commission: 672,
    type: 'income',
    status: 'Очікується',
  },
  {
    id: 'tx-4',
    date: '12 Гру, 2025',
    title: 'Повернення коштів — Chalet "Eco-Smerika"',
    guestName: 'Олександр П.',
    propertyName: "Chalet 'Eco-Smerika'",
    amount: 8900,
    commission: 0,
    type: 'refund',
    status: 'Повернено',
  },
];

// ================= 9. РОБОЧИЙ ПРОСТІР: БРОНЮВАННЯ (MENU WORKSPACE) =================

export interface MenuBookingItem {
  id: string;
  propertyTitle: string;
  propertyType: string;
  location: string;
  address: string;
  dates: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  guestsCount: number;
  relationLabel: string;
  relationName: string;
  hostName: string;
  hostRating: string;
  hostReviewsCount: number;
  hostAvatar: string;
  status: 'Підтверджено' | 'Очікує' | 'Завершено' | 'Скасовано';
  isHistory: boolean;
  confirmationCode: string;
  basePricePerNight: number;
  nightsCount: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  thumbnail: string;
}

export const CANCELLATION_REASONS = [
  'Мої плани змінилися',
  'Непередбачувані обставини / Хвороба',
  'Знайшов(-ла) інший варіант проживання',
  'Забронював(-ла) помилково',
  'Інша причина',
];

export const MOCK_MENU_BOOKINGS: MenuBookingItem[] = [
  // Поточні
  {
    id: 'b-curr-1',
    propertyTitle: "Шале 'Карпатська Тиша'",
    propertyType: 'Будинок • Закарпатська, Поділ',
    location: 'с. Пилипець, Закарпатська область',
    address: 'вулиця Пилипець, Закарпатська область',
    dates: '12 Грудня — 18 Грудня, 2026',
    checkInDate: '12 грудня',
    checkInTime: 'Після 14:00',
    checkOutDate: '18 грудня',
    checkOutTime: 'До 11:00',
    guestsCount: 2,
    relationLabel: 'ВЛАСНИК ПОМЕШКАННЯ',
    relationName: 'Михайло Романюк',
    hostName: 'Марія Шевченко',
    hostRating: '4.9★',
    hostReviewsCount: 312,
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    status: 'Підтверджено',
    isHistory: false,
    confirmationCode: 'HM8W29PZ',
    basePricePerNight: 2400,
    nightsCount: 5,
    cleaningFee: 500,
    serviceFee: 1060,
    totalPrice: 14200,
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b-curr-2',
    propertyTitle: "Глемпінг 'Затишний Явір'",
    propertyType: 'Глемпінг • Івано-Франківщина',
    location: 'смт. Верховина, Івано-Франківська область',
    address: 'смт. Верховина, присілок Грабовець',
    dates: '23 Грудня — 26 Грудня, 2026',
    checkInDate: '23 грудня',
    checkInTime: 'Після 14:00',
    checkOutDate: '26 грудня',
    checkOutTime: 'До 12:00',
    guestsCount: 2,
    relationLabel: 'ОРЕНДАР',
    relationName: 'Данило Кравченко',
    hostName: 'Олег Васильович',
    hostRating: '4.8★',
    hostReviewsCount: 142,
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    status: 'Очікує',
    isHistory: false,
    confirmationCode: 'YAVIR774',
    basePricePerNight: 1700,
    nightsCount: 3,
    cleaningFee: 300,
    serviceFee: 400,
    totalPrice: 5800,
    thumbnail: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b-curr-3',
    propertyTitle: "Котедж 'Nordic Forest'",
    propertyType: 'Котедж • Карпати',
    location: 'Яремче, Івано-Франківська область',
    address: 'вул. Свободи, 142, Яремче',
    dates: '30 Грудня — 03 Січня, 2027',
    checkInDate: '30 грудня',
    checkInTime: 'Після 15:00',
    checkOutDate: '03 січня',
    checkOutTime: 'До 11:00',
    guestsCount: 4,
    relationLabel: 'ВЛАСНИК ПОМЕШКАННЯ',
    relationName: 'Ірина Мельник',
    hostName: 'Ірина Мельник',
    hostRating: '5.0★',
    hostReviewsCount: 88,
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    status: 'Підтверджено',
    isHistory: false,
    confirmationCode: 'NORDIC990',
    basePricePerNight: 5000,
    nightsCount: 4,
    cleaningFee: 800,
    serviceFee: 1200,
    totalPrice: 22000,
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },

  // Історія бронювань
  {
    id: 'b-hist-1',
    propertyTitle: "Шале 'Карпатська Тиша'",
    propertyType: 'Будинок • Закарпаття',
    location: 'с. Пилипець, Закарпатська область',
    address: 'вулиця Пилипець, Закарпатська область',
    dates: '12 Грудня — 18 Грудня, 2025',
    checkInDate: '12 грудня',
    checkInTime: 'Після 14:00',
    checkOutDate: '18 грудня',
    checkOutTime: 'До 11:00',
    guestsCount: 2,
    relationLabel: 'ВЛАСНИК ПОМЕШКАННЯ',
    relationName: 'Михайло Романюк',
    hostName: 'Марія Шевченко',
    hostRating: '4.9★',
    hostReviewsCount: 312,
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    status: 'Завершено',
    isHistory: true,
    confirmationCode: 'HM8W29PZ',
    basePricePerNight: 2000,
    nightsCount: 5,
    cleaningFee: 500,
    serviceFee: 1000,
    totalPrice: 12000,
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b-hist-2',
    propertyTitle: "Глемпінг 'Затишний Явір'",
    propertyType: 'Глемпінг • Івано-Франківщина',
    location: 'смт. Верховина, Івано-Франківська область',
    address: 'смт. Верховина',
    dates: '23 Грудня — 26 Грудня, 2025',
    checkInDate: '23 грудня',
    checkInTime: 'Після 14:00',
    checkOutDate: '26 грудня',
    checkOutTime: 'До 12:00',
    guestsCount: 2,
    relationLabel: 'ОРЕНДАР',
    relationName: 'Данило Кравченко',
    hostName: 'Олег Васильович',
    hostRating: '4.8★',
    hostReviewsCount: 142,
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    status: 'Завершено',
    isHistory: true,
    confirmationCode: 'YAVIR221',
    basePricePerNight: 1600,
    nightsCount: 3,
    cleaningFee: 300,
    serviceFee: 450,
    totalPrice: 5550,
    thumbnail: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'b-hist-3',
    propertyTitle: "Котедж 'Nordic Forest'",
    propertyType: 'Котедж • Карпати',
    location: 'Яремче, Івано-Франківська область',
    address: 'вул. Свободи, 142, Яремче',
    dates: '30 Грудня — 03 Січня, 2026',
    checkInDate: '30 грудня',
    checkInTime: 'Після 15:00',
    checkOutDate: '03 січня',
    checkOutTime: 'До 11:00',
    guestsCount: 4,
    relationLabel: 'ВЛАСНИК ПОМЕШКАННЯ',
    relationName: 'Ірина Мельник',
    hostName: 'Ірина Мельник',
    hostRating: '5.0★',
    hostReviewsCount: 88,
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    status: 'Скасовано',
    isHistory: true,
    confirmationCode: 'NORDIC990',
    basePricePerNight: 5500,
    nightsCount: 4,
    cleaningFee: 800,
    serviceFee: 1400,
    totalPrice: 25200,
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
];

// ================= 10. КЕРУВАННЯ ПОМЕШКАННЯМ (HOST PROPERTIES & CALENDAR) =================

export interface HostPropertyItem {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  viewsCount: number;
  bookingsCount: number;
  isActive: boolean;
  thumbnail: string;
}

export interface HostApplicationItem {
  id: string;
  guestName: string;
  guestAvatar: string;
  propertyTitle: string;
  dates: string;
  totalPrice: number;
}

export const MOCK_HOST_PROPERTIES: HostPropertyItem[] = [
  {
    id: 'hp-1',
    title: 'Затишний котедж у Карпатах',
    location: 'Яремче, вул. Свободи 12',
    pricePerNight: 1500,
    rating: 4.9,
    viewsCount: 342,
    bookingsCount: 12,
    isActive: true,
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hp-2',
    title: "Шале 'Вершина Свободи'",
    location: 'Буковель, присілок Вишня',
    pricePerNight: 2800,
    rating: 4.8,
    viewsCount: 189,
    bookingsCount: 5,
    isActive: false,
    thumbnail: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hp-3',
    title: 'Глемпінг над Черемошем',
    location: 'Верховина, урочище Очерет',
    pricePerNight: 1200,
    rating: 5.0,
    viewsCount: 512,
    bookingsCount: 24,
    isActive: true,
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
];

export const MOCK_HOST_APPLICATIONS: HostApplicationItem[] = [
  {
    id: 'app-1',
    guestName: 'Олександр Дмитренко',
    guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    propertyTitle: 'Затишний котедж у Карпатах',
    dates: '12 Березня - 15 Березня (3 ночі)',
    totalPrice: 4500,
  },
  {
    id: 'app-2',
    guestName: 'Ірина Савченко',
    guestAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    propertyTitle: 'Глемпінг над Черемошем',
    dates: '18 Березня - 20 Березня (2 ночі)',
    totalPrice: 2400,
  },
];

export const MOCK_BLACKLIST_EXTENDED = [
  {
    id: 'bl-1',
    name: 'Артем Клименко',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    reason: "Нехтування правилами перебування, пошкодження майна в котеджі 'Оріон'",
    date: '14 Листопада, 2024',
  },
  {
    id: 'bl-2',
    name: 'Наталія Петренко',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    reason: 'Регулярні скасування замовлень в останній момент без поважної причини',
    date: '03 Листопада, 2024',
  },
  {
    id: 'bl-3',
    name: 'Владислав Швед',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    reason: 'Спроба шахрайства з передплатою, надання неправдивих документів',
    date: '29 Жовтня, 2024',
  },
  {
    id: 'bl-4',
    name: 'Марія Сидоренко',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    reason: 'Порушення тиші у нічний час, скарги від сусідів',
    date: '18 Жовтня, 2024',
  },
];

// ================= 11. БЛОГ ТА СТАТТІ (NEWS & ARTICLES) =================

export interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  heroImage: string;
}

export interface PopularArticle {
  id: string;
  tag: string;
  title: string;
  thumbnail: string;
}

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    category: 'Поради',
    title: 'Як організувати ідеальний вікенд у Карпатах: автентичні маршрути 2026 року',
    excerpt: 'Розповідаємо, як уникнути туристичних натовпів, знайти найзатишніші колиби безпосередньо від місцевих мешканців та відкрити для себе дикі стежки Чорногори.',
    date: '25 Травня, 2026',
    readTime: '6 хв читання',
    author: 'Олена Ковальчук',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: '2',
    category: 'Подорожі',
    title: 'Таємниці Львова: дворики та кава',
    excerpt: 'Маловідомі місця старого міста, які не показують звичайним туристам у екскурсіях.',
    date: '20 Травня, 2026',
    readTime: '4 хв читання',
    author: 'Тарас Гринишин',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: '3',
    category: 'Поради',
    title: 'Безпека в горах: що взяти з собою',
    excerpt: 'Повний чек-лист необхідного спорядження та аптечки для безпечного походу в гори.',
    date: '18 Травня, 2026',
    readTime: '8 хв читання',
    author: 'Михайло Романюк',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: '4',
    category: 'Оновлення',
    title: 'Нові правила верифікації хостів',
    excerpt: 'Як ми підвищуємо рівень довіри та безпеки для наших користувачів у цьому сезоні.',
    date: '12 Травня, 2026',
    readTime: '3 хв читання',
    author: 'Команда TrailsUA',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: '5',
    category: 'Подорожі',
    title: 'Зимова мандрівка Карпатами',
    excerpt: 'Як ми відкриваємо красу засніжених вершин та теплий затишок гірських хатинок у цьому сезоні.',
    date: '10 Травня, 2026',
    readTime: '5 хв читання',
    author: 'Олена Ковальчук',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  },
];

export const MOCK_POPULAR_ARTICLES: PopularArticle[] = [
  {
    id: 'pop-1',
    tag: 'ЖИТЛО',
    title: '10 найзатишніших A-Frame будиночків у горах',
    thumbnail: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'pop-2',
    tag: 'ГАСТРОНОМІЯ',
    title: 'Справжній банош: де шукати автентичний смак',
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    id: 'pop-3',
    tag: 'РЕЛАКС',
    title: 'Карпатські чани: мистецтво цілющого купання',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  },
];

// ================= 12. КОНТАКТИ ТА ПІДТРИМКА (CONTACTS & SUPPORT) =================

export interface ContactOfficeInfo {
  address: string;
  phones: string[];
  emails: string[];
  workingHours: string;
}

export const MOCK_CONTACT_OFFICE_INFO: ContactOfficeInfo = {
  address: 'вул. Володимирська, 42, Київ, Україна, 01001',
  phones: ['+38 (044) 123-45-67', '+38 (093) 987-65-43'],
  emails: ['support@trailsua.com', 'partners@trailsua.com'],
  workingHours: 'Пн - Пт: 09:00 - 19:00\nСб - Нд: 10:00 - 16:00',
};

export const MOCK_CONTACT_SUBJECTS = [
  'Питання щодо бронювання житла',
  'Питання про оплату та рахунки',
  'Скасування або зміна бронювання',
  'Скарга на якість обслуговування',
  'Пропозиції щодо покращення сервісу',
  'Технічна підтримка сайту/додатку',
  'Питання щодо політики повернення коштів',
  'Співпраця та партнерство',
  'Інше',
];

// ================= 13. ОБМЕЖЕННЯ АКАУНТА ТА ПРАВИЛА (ACCOUNT RESTRICTIONS) =================

export interface RestrictionHistoryItem {
  id: string;
  date: string;
  type: string;
  reason: string;
  status: 'Вирішено' | 'Анульовано' | 'На розгляді';
}

export interface PlatformRuleItem {
  id: string;
  title: string;
  description: string;
}

export const MOCK_RESTRICTION_HISTORY: RestrictionHistoryItem[] = [
  {
    id: 'rh-1',
    date: '12 Лис, 2025',
    type: 'Тимчасове блокування',
    reason: 'Затримка з відповідями на понад 5 запитів',
    status: 'Вирішено',
  },
  {
    id: 'rh-2',
    date: '02 Вер, 2025',
    type: 'Попередження',
    reason: 'Невідповідність фото (скарга гостя на декор)',
    status: 'Анульовано',
  },
];

export const MOCK_PLATFORM_RULES: PlatformRuleItem[] = [
  {
    id: 'r-1',
    title: 'Повага та гостинність',
    description: 'Усі гості мають почуватися безпечно та комфортно без дискримінації.',
  },
  {
    id: 'r-2',
    title: 'Автентичність житла',
    description: 'Фото та опис мають на 100% відповідати реальному стану помешкання.',
  },
  {
    id: 'r-3',
    title: 'Оперативна комунікація',
    description: 'Хост має відповідати на запити бронювання протягом 24 годин.',
  },
];

// ================= 14. СЛУЖБА ПІДТРИМКИ ТА ТІКЕТИ (SUPPORT & TICKETS) =================

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  category: string;
  title: string;
  dateText: string;
  status: 'В роботі' | 'Вирішено' | 'Очікує';
}

export const MOCK_SUPPORT_CATEGORIES = [
  'Технічна проблема',
  'Зручності та умови проживання',
  'Труднощі із заселенням/виїздом',
  'Помилка у датах бронювання',
  'Відсутність заявлених зручностей',
  'Питання щодо повернення коштів',
  'Порушення правил або безпеки',
  'Немає зв’язку з орендодавцем',
  'Інше',
];

export const MOCK_SUPPORT_TICKETS: SupportTicketItem[] = [
  {
    id: 'st-1',
    ticketNumber: '#48291',
    category: 'Технічна проблема',
    title: 'Не відображається календар зайнятості',
    dateText: 'Створено: Сьогодні',
    status: 'В роботі',
  },
  {
    id: 'st-2',
    ticketNumber: '#47102',
    category: 'Скарга на користувача',
    title: 'Гість залишив сміття',
    dateText: 'Створено: 10 Лют, 2026',
    status: 'Вирішено',
  },
];

// ================= 15. ДЕМО ДІАЛОГИ ДЛЯ ЧАТУ ТА ПОВІДОМЛЕНЬ =================

export type MessageFolder = 'main' | 'requests' | 'spam' | 'blacklist';

export interface ChatDialogItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  folder: MessageFolder;
  isOnline?: boolean;
  statusText?: string;
  isBlocked?: boolean;
}

export const MOCK_CHAT_DIALOGS: ChatDialogItem[] = [
  // ОСНОВНІ
  {
    id: 'c1',
    name: 'Іван Мельник',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Привіт! Цікавлюсь вашим помешканням на вихідні...',
    time: '14:30',
    unreadCount: 2,
    folder: 'main',
    isOnline: false,
    statusText: 'Був у мережі 2 години тому',
  },
  {
    id: 'c2',
    name: 'Олена Бондаренко',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Дякую за чудове перебування! Все було супер',
    time: 'Вчора',
    folder: 'main',
    isOnline: true,
    statusText: 'В мережі',
  },
  {
    id: 'c3',
    name: 'Підтримка Trails UA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Ваш запит #4521 успішно оброблено оператором',
    time: '2 дні тому',
    folder: 'main',
    isOnline: true,
    statusText: 'Служба турботи онлайн',
  },
  {
    id: 'c4',
    name: 'Михайло Шевченко',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Чи є можливість пізнього виїзду у неділю?',
    time: '3 дні тому',
    unreadCount: 1,
    folder: 'main',
    isOnline: false,
    statusText: 'Був у мережі вчора',
  },
  {
    id: 'c5',
    name: 'Юлія Кравченко',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Бронювання підтверджено. Надішліть інструкції',
    time: '4 дні тому',
    folder: 'main',
    isOnline: false,
    statusText: 'Була у мережі 3 години тому',
  },
  {
    id: 'c6',
    name: 'Дмитро Коваленко',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Які умови проживання з домашніми тваринами?',
    time: 'Тиждень тому',
    folder: 'main',
    isOnline: false,
    statusText: 'Був у мережі 5 днів тому',
  },
  // ЗАПИТИ
  {
    id: 'req1',
    name: 'Іван Мельник (Запит)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Доброго дня! Я зацікавлений у вашій квартирі на період з 20 по 25 серпня...',
    time: '14:31',
    unreadCount: 2,
    folder: 'requests',
    isOnline: false,
    statusText: 'Був у мережі 2 години тому',
  },
  // СПАМ
  {
    id: 'sp1',
    name: 'Спеціальні пропозиції',
    avatar: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=120&q=80',
    lastMessage: '🔥 Спеціальна акція цього тижня! Бронюйте апартаменти зі знижкою...',
    time: '14:31',
    folder: 'spam',
    isOnline: false,
    statusText: 'Розсилка новин',
  },
  // ЧОРНИЙ СПИСОК
  {
    id: 'bl1',
    name: 'Олена Бондаренко (Блок)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Вітаю! Мене звати Іван. Можу я забронювати ваше помешкання безкоштовно?',
    time: '14:31',
    folder: 'blacklist',
    isOnline: false,
    statusText: 'Користувача заблоковано',
    isBlocked: true,
  },
];