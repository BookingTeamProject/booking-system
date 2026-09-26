import React from 'react';
import { Link } from 'react-router-dom';
import { useRoutes } from '../context/RoutesContext';

export const FavoritesPage: React.FC = () => {
  const { routes, favorites: ids, loading, toggleFavorite } = useRoutes();
  const favorites = routes.filter(route => ids.includes(route.id));
  const removeFavorite = toggleFavorite;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', color: '#111827' }}>❤️ Ваши избранные маршруты</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</div>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '12px' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>У вас пока нет сохранённых маршрутов.</p>
          <Link to="/" style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}>Найти интересные маршруты →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {favorites.map((route) => (
            <div key={route.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <img src={route.imageUrls?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'} alt={route.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{route.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>📍 {route.location}</p>
                <button onClick={() => removeFavorite(route.id)} style={{ width: '100%', padding: '8px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  Удалить из избранного
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};