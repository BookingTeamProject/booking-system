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

export const BLOG_POSTS: BlogPost[] = [
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
