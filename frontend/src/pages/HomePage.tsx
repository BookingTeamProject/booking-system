import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface RouteItem {
  id: string;
  title: string;
  description: string;
  location: string;
  distanceKm: number;
  durationHours: number;
  price?: number;
  categoryName: string;
  authorName: string;
  averageRating: number;
  imageUrls: string[];
}

export const HomePage: React.FC = () => {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRoutes();
    loadFavorites();
  }, []);

  const loadRoutes = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/route?search=${encodeURIComponent(searchQuery)}`);
      setRoutes(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.get('/favorite');
      setFavoriteIds(res.data.map((r: RouteItem) => r.id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRoutes(search);
  };

  const toggleFavorite = async (routeId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Войдите, чтобы добавлять в избранное!');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/favorite/${routeId}`);
      if (res.data.isFavorite) {
        setFavoriteIds([...favoriteIds, routeId]);
      } else {
        setFavoriteIds(favoriteIds.filter(id => id !== routeId));
      }
    } catch (e) {
      alert('Ошибка при сохранении в избранное');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Баннер поиска */}
      <div style={heroBannerStyle}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px', color: '#111827' }}>Откройте для себя лучшие маршруты Украины</h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>Горы, леса, пешие и веломаршруты с проверенными отзывами</p>
        
        <form onSubmit={handleSearch} style={searchFormStyle}>
          <input
            type="text"
            placeholder="Поиск по названию, локации (например: Карпаты, Говерла)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
          <button type="submit" style={searchButtonStyle}>Искать</button>
        </form>
      </div>

      {/* Список маршрутов */}
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Популярные маршруты</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка маршрутов...</div>
      ) : routes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Маршруты не найдены. Создайте свой первый маршрут!
        </div>
      ) : (
        <div style={gridStyle}>
          {routes.map((route) => {
            const isFav = favoriteIds.includes(route.id);
            return (
              <div key={route.id} style={cardStyle}>
                <div style={cardImageContainerStyle}>
                  <img
                    src={route.imageUrls?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'}
                    alt={route.title}
                    style={cardImageStyle}
                  />
                  <button
                    onClick={() => toggleFavorite(route.id)}
                    style={{ ...favoriteBtnStyle, color: isFav ? '#ef4444' : '#9ca3af' }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                  <span style={categoryBadgeStyle}>{route.categoryName}</span>
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111827' }}>{route.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0' }}>📍 {route.location}</p>
                  
                  <div style={routeStatsStyle}>
                    <span>📏 {route.distanceKm} км</span>
                    <span>⏱️ {route.durationHours} ч.</span>
                    <span>⭐ {route.averageRating > 0 ? route.averageRating : 'Новый'}</span>
                  </div>

                  <div style={cardFooterStyle}>
                    <span style={{ fontWeight: 'bold', color: '#059669', fontSize: '16px' }}>
                      {route.price ? `${route.price} грн` : 'Бесплатно'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Гид: {route.authorName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Стили
const heroBannerStyle: React.CSSProperties = { textAlign: 'center', padding: '40px 20px', backgroundColor: '#ecfdf5', borderRadius: '16px', marginBottom: '36px' };
const searchFormStyle: React.CSSProperties = { display: 'flex', maxWidth: '600px', margin: '0 auto', gap: '8px' };
const searchInputStyle: React.CSSProperties = { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' };
const searchButtonStyle: React.CSSProperties = { padding: '12px 24px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' };
const cardStyle: React.CSSProperties = { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' };
const cardImageContainerStyle: React.CSSProperties = { position: 'relative', height: '180px', width: '100%' };
const cardImageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const categoryBadgeStyle: React.CSSProperties = { position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
const favoriteBtnStyle: React.CSSProperties = { position: 'absolute', top: '12px', right: '12px', backgroundColor: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' };
const routeStatsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563', padding: '8px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', marginBottom: '12px' };
const cardFooterStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };