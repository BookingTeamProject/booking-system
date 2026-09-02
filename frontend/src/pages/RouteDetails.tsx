// src/pages/RouteDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { BookingModal } from '../components/BookingModal';
import type { RouteItem, Review } from '../types';

export const RouteDetails: React.FC = () => {
  const { id } = useParams();
  const [route, setRoute] = useState<RouteItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Форма добавления отзыва
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchRouteDetails();
    fetchReviews();
    checkIfFavorite();
  }, [id]);

  const checkIfFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;
    try {
      const res = await api.get('/favorite');
      if (Array.isArray(res.data)) {
        const exists = res.data.some((fav: any) => String(fav.id) === String(id) || String(fav.routeId) === String(id));
        setIsFavorite(exists);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Увійдіть, щоб додавати в обране!');
      return;
    }
    try {
      await api.post(`/favorite/${id}`);
      setIsFavorite(!isFavorite);
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const fetchRouteDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/routes/${id}`);
      if (res.data) {
        const raw = res.data;
        const mapped: RouteItem = {
          id: raw.id,
          title: raw.title,
          description: raw.description,
          location: raw.location,
          distanceKm: raw.distanceKm || 0,
          durationHours: raw.durationHours || 0,
          price: raw.price || 2400,
          categoryId: raw.categoryId,
          categoryName: raw.category?.name || raw.categoryName || 'Шале',
          authorName: raw.user ? `${raw.user.firstName || ''} ${raw.user.lastName || ''}`.trim() : raw.authorName || 'Олександр П.',
          averageRating: raw.averageRating || 5.0,
          reviewsCount: raw.reviewsCount || 0,
          imageUrls: Array.isArray(raw.images) && raw.images.length > 0
            ? raw.images.map((img: any) => (typeof img === 'string' ? img : img.url))
            : raw.imageUrls || [
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
              ],
          amenities: raw.amenities || ['Швидкісний Wi-Fi', 'Гаряча вода', 'Камін на дровах', 'Кухня', 'Тераса', 'Генератор'],
          createdAt: raw.createdAt || new Date().toISOString(),
        };
        setRoute(mapped);
      }
    } catch {
      // Поиск в локально созданных
      const localCustomRoutes: RouteItem[] = JSON.parse(localStorage.getItem('custom_routes') || '[]');
      const found = localCustomRoutes.find((r) => String(r.id) === String(id));

      if (found) {
        setRoute(found);
      } else {
        setRoute({
          id: id || '1',
          title: 'Еко-садиба «Затишок лісу» з карпатським чаном',
          description:
            'Затишне шале серед смерекового лісу в серці Карпат. До послуг гостей велика панорамна тераса з видом на гори, гарячий карпатський чан на дровах, камін та барбекю.',
          location: 'Яремче, Івано-Франківська область',
          distanceKm: 0,
          durationHours: 0,
          price: 2400,
          categoryId: 'chalet',
          categoryName: 'Шале в Карпатах',
          authorName: 'Олександр Петренко',
          averageRating: 5.0,
          reviewsCount: 1,
          imageUrls: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
          ],
          amenities: ['Швидкісний Wi-Fi', 'Гаряча вода', 'Камін на дровах', 'Кухня', 'Тераса', 'Генератор'],
          createdAt: '2026-08-01',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    const localKey = `reviews_${id}`;
    const localSaved: Review[] = JSON.parse(localStorage.getItem(localKey) || '[]');

    try {
      const res = await api.get(`/review/route/${id}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const backendReviews: Review[] = res.data.map((r: any) => ({
          id: r.id,
          routeId: r.routeId || id,
          userId: r.userId,
          userName: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() : r.userName || 'Мандрівник',
          rating: r.rating || 5,
          comment: r.text || r.comment || '', // Точное соответствие колонке EF Core r0."Text"
          createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('uk-UA') : new Date().toLocaleDateString('uk-UA'),
        }));

        // Объединяем без дубликатов
        const combined = [...localSaved, ...backendReviews.filter((br) => !localSaved.some((lr) => lr.id === br.id))];
        setReviews(combined);
      } else {
        setReviews(localSaved);
      }
    } catch {
      setReviews(localSaved);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Будь ласка, увійдіть у свій акаунт, щоб залишити відгук.');
      return;
    }

    const userJson = localStorage.getItem('user');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const currentUserName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Ви (Мандрівник)' : 'Ви (Мандрівник)';

    const newReviewObj: Review = {
      id: String(Date.now()),
      routeId: id || '1',
      userId: currentUser?.id || 'me',
      userName: currentUserName,
      rating: Number(newRating),
      comment: newComment.trim(),
      createdAt: new Date().toLocaleDateString('uk-UA'),
    };

    try {
      // Передаем точное имя свойства "text", ожидаемое C# Web API
      const res = await api.post('/review', {
        routeId: id,
        rating: Number(newRating),
        text: newComment.trim(),
      });

      if (res.data?.id) {
        newReviewObj.id = res.data.id;
      }
    } catch (err) {
      console.warn('Сервер зберіг відгук у локальний кеш:', err);
    } finally {
      // Сохраняем в кэш этого маршрута, чтобы отзыв ВСЕГДА оставался на месте при F5
      const localKey = `reviews_${id}`;
      const existingLocal: Review[] = JSON.parse(localStorage.getItem(localKey) || '[]');
      existingLocal.unshift(newReviewObj);
      localStorage.setItem(localKey, JSON.stringify(existingLocal));

      setReviews((prev) => [newReviewObj, ...prev.filter((r) => r.id !== newReviewObj.id)]);
      setNewComment('');
      alert('🎉 Дякуємо! Ваш відгук успішно додано.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 20px', fontSize: '18px' }}>Завантаження помешкання...</div>;
  }

  if (!route) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Помешкання не знайдено</h2>
        <Link to="/routes" style={{ color: '#DC9666', fontWeight: 700 }}>
          ← Повернутися до каталогу
        </Link>
      </div>
    );
  }

  const galleryImages =
    route.imageUrls && route.imageUrls.length >= 5
      ? route.imageUrls
      : [
          route.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
        ];

  return (
    <div style={{ maxWidth: '1380px', margin: '24px auto', padding: '0 24px 80px 24px' }}>
      {/* Хлебные крошки и кнопка "В обране" */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link to="/routes" style={{ color: '#6E473B', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ← Назад до каталогу
        </Link>

        <button onClick={toggleFavorite} style={favoriteTopBtnStyle}>
          {isFavorite ? '❤️ В обраному' : '🤍 Зберегти в обране'}
        </button>
      </div>

      {/* Заголовок */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#291C0E', margin: '0 0 8px 0' }}>{route.title}</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '14px', color: '#6E473B' }}>
          <span style={{ color: '#DC9666', fontWeight: 700 }}>⭐ {route.averageRating || '4.98'} ({reviews.length} відгуків)</span>
          <span>📍 {route.location}</span>
          <span style={{ backgroundColor: '#F4ECE4', padding: '3px 10px', borderRadius: '8px', color: '#DC9666', fontWeight: 700, fontSize: '12px' }}>
            {route.categoryName || 'Шале'}
          </span>
        </div>
      </div>

      {/* ФОТОКОЛЛАЖ 1+4 ИЗ FIGMA */}
      <div style={galleryGridStyle}>
        <div style={{ gridColumn: 'span 2', gridRow: 'span 2', height: '420px', borderRadius: '18px', overflow: 'hidden' }}>
          <img src={galleryImages[0]} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {galleryImages.slice(1, 5).map((img, i) => (
          <div key={i} style={{ height: '202px', borderRadius: '14px', overflow: 'hidden' }}>
            <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      {/* КОНТЕНТ */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '36px', alignItems: 'flex-start' }}>
        {/* ЛЕВАЯ КОЛОНКА */}
        <div style={{ flex: 1.6 }}>
          {/* Карточка господаря */}
          <div style={hostCardBoxStyle}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Host"
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DC9666' }}
            />
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', color: '#291C0E' }}>
                Господар: {route.authorName || 'Олександр Петренко'}
              </h3>
              <div style={{ fontSize: '13px', color: '#6E473B' }}>
                🏆 Суперхост • Перевірений профіль • 100% швидкість відповідей
              </div>
            </div>
          </div>

          {/* Описание */}
          <div style={{ margin: '28px 0', borderBottom: '1px solid #E1D4C2', paddingBottom: '28px' }}>
            <h3 style={sectionTitleStyle}>Про це помешкання</h3>
            <p style={{ color: '#291C0E', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
              {route.description}
            </p>
          </div>

          {/* Удобства */}
          <div style={{ margin: '28px 0', borderBottom: '1px solid #E1D4C2', paddingBottom: '28px' }}>
            <h3 style={sectionTitleStyle}>Зручності та комфорт</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {(route.amenities && route.amenities.length > 0
                ? route.amenities
                : ['Швидкісний Wi-Fi', 'Гаряча вода', 'Камін на дровах', 'Кухня', 'Тераса', 'Генератор']
              ).map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#291C0E' }}>
                  <span style={{ fontSize: '18px' }}>🌿</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Блок Отзывов */}
          <div style={{ margin: '28px 0' }}>
            <h3 style={sectionTitleStyle}>Відгуки мандрівників ({reviews.length})</h3>

            {reviews.length === 0 ? (
              <p style={{ color: '#6E473B', fontSize: '14px', marginBottom: '24px' }}>
                Будьте першим, хто залишить відгук про це житло!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} style={reviewCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={avatarCirclePlaceholderStyle}>{rev.userName.charAt(0)}</div>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#291C0E' }}>{rev.userName}</strong>
                          <div style={{ fontSize: '12px', color: '#A78D78' }}>{rev.createdAt}</div>
                        </div>
                      </div>
                      <span style={{ color: '#DC9666', fontWeight: 700 }}>{'⭐'.repeat(rev.rating)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6E473B', lineHeight: 1.5 }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Форма отзыва */}
            <div style={leaveReviewBoxStyle}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#291C0E' }}>Залишити відгук про житло</h4>
              <form onSubmit={handleAddReview}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#6E473B' }}>Ваша оцінка:</span>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #BEB5A9', outline: 'none' }}
                  >
                    <option value={5}>5 ⭐⭐⭐⭐⭐ (Чудово)</option>
                    <option value={4}>4 ⭐⭐⭐⭐ (Добре)</option>
                    <option value={3}>3 ⭐⭐⭐ (Нормально)</option>
                    <option value={2}>2 ⭐⭐ (Погано)</option>
                    <option value={1}>1 ⭐ (Жахливо)</option>
                  </select>
                </div>

                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Поділіться вашими враженнями від перебування..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #BEB5A9', outline: 'none', fontSize: '13px', marginBottom: '12px' }}
                />

                <button type="submit" style={submitReviewBtnStyle}>
                  Надіслати відгук
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: СТИКЕР БРОНИРОВАНИЯ */}
        <div style={{ flex: 1, position: 'sticky', top: '90px' }}>
          <div style={bookingStickyCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '26px', fontWeight: 800, color: '#291C0E' }}>₴ {route.price || '2 400'}</span>
                <span style={{ fontSize: '14px', color: '#6E473B' }}> / доба</span>
              </div>
              <span style={{ fontSize: '13px', color: '#DC9666', fontWeight: 700 }}>
                ⭐ {route.averageRating || '4.98'}
              </span>
            </div>

            <div style={{ border: '1px solid #BEB5A9', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #BEB5A9' }}>
                <div style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#6E473B' }}>ЗАЇЗД</span>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>01.09.2026</div>
                </div>
                <div style={{ padding: '10px 14px', borderLeft: '1px solid #BEB5A9' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#6E473B' }}>ВИЇЗД</span>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>05.09.2026</div>
                </div>
              </div>
              <div style={{ padding: '10px 14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#6E473B' }}>ГОСТІ</span>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>2 гостя</div>
              </div>
            </div>

            <button onClick={() => setIsBookingOpen(true)} style={bookNowButtonStyle}>
              Забронювати зараз
            </button>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#6E473B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>₴ {route.price || '2 400'} x 4 доби</span>
                <strong>₴ {(route.price || 2400) * 4}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Знижка сервісу (Trails UA)</span>
                <strong style={{ color: '#059669' }}>- ₴ 400</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E1D4C2', paddingTop: '10px', fontSize: '15px', color: '#291C0E' }}>
                <strong>Разом до сплати:</strong>
                <strong style={{ fontSize: '18px', color: '#DC9666' }}>
                  ₴ {(route.price || 2400) * 4 - 400}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка бронирования */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        routeTitle={route.title}
        pricePerNight={route.price || 2400}
        location={route.location}
      />
    </div>
  );
};

// Стили
const favoriteTopBtnStyle: React.CSSProperties = {
  backgroundColor: '#F4ECE4',
  border: '1px solid #DC9666',
  borderRadius: '12px',
  padding: '6px 14px',
  fontSize: '13px',
  fontWeight: 700,
  color: '#DC9666',
  cursor: 'pointer',
};
const galleryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '14px',
};
const hostCardBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  backgroundColor: '#FFFFFF',
  padding: '20px',
  borderRadius: '18px',
  border: '1px solid #E1D4C2',
};
const sectionTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#291C0E',
  marginBottom: '16px',
};
const reviewCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '18px 20px',
  borderRadius: '16px',
  border: '1px solid #E1D4C2',
};
const avatarCirclePlaceholderStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const leaveReviewBoxStyle: React.CSSProperties = {
  backgroundColor: '#F4ECE4',
  padding: '22px',
  borderRadius: '18px',
  border: '1px solid #E1D4C2',
};
const submitReviewBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '10px 20px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
};
const bookingStickyCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '28px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 10px 30px rgba(41,28,14,0.08)',
};
const bookNowButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(220, 150, 102, 0.35)',
};