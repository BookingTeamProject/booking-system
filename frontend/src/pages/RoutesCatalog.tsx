// src/pages/RoutesCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { RouteItem } from '../types';

export const RoutesCatalog: React.FC = () => {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/routes');
      const apiRoutes = Array.isArray(res.data) ? res.data : [];
      const localCustomRoutes: RouteItem[] = JSON.parse(localStorage.getItem('custom_routes') || '[]');

      // Объединяем созданные пользователем объекты и данные API
      const combined = [...localCustomRoutes, ...apiRoutes];

      if (combined.length > 0) {
        setRoutes(combined);
      } else {
        setRoutes([
          {
            id: '1',
            title: 'Еко-садиба «Затишок лісу» з чаном',
            description: 'Приватне шале посеред смерекового лісу. Панорамна тераса, чан на дровах та закрита територія.',
            location: 'Яремче, Івано-Франківська обл.',
            distanceKm: 4.2,
            durationHours: 2,
            price: 2400,
            categoryId: 'chalet',
            categoryName: 'Шале',
            authorName: 'Олександр П.',
            averageRating: 4.95,
            imageUrls: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'],
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
            authorName: 'Марія К.',
            averageRating: 5.0,
            imageUrls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80'],
            createdAt: '2026-08-10',
          },
        ]);
      }
    } catch (e) {
      const localCustomRoutes: RouteItem[] = JSON.parse(localStorage.getItem('custom_routes') || '[]');
      setRoutes(localCustomRoutes);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = (r.price || 0) <= maxPrice;
    const matchesType = selectedType === 'all' || r.categoryId === selectedType;
    const matchesRating = (r.averageRating || 0) >= minRating;
    return matchesSearch && matchesPrice && matchesType && matchesRating;
  });

  const handleResetFilters = () => {
    setSearch('');
    setMaxPrice(6000);
    setSelectedType('all');
    setMinRating(0);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 24px 60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#291C0E', margin: 0 }}>Каталог маршрутів та житла</h1>
          <p style={{ color: '#6E473B', margin: '4px 0 0 0', fontSize: '14px' }}>
            Знайдено {filteredRoutes.length} перевірених пропозицій
          </p>
        </div>

        <Link to="/routes/create" style={createCtaBtnStyle}>
          ➕ Створити оголошення
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* ЛЕВАЯ ПАНЕЛЬ ФИЛЬТРОВ */}
        <div style={filterSidebarStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#291C0E', marginBottom: '18px' }}>Фільтри пошуку</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={filterLabelStyle}>Пошук за локацією</label>
            <input
              type="text"
              placeholder="Яремче, Буковель..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={filterInputStyle}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={filterLabelStyle}>Макс. ціна за добу</label>
              <strong style={{ fontSize: '13px', color: '#DC9666' }}>₴ {maxPrice}</strong>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#DC9666' }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={filterLabelStyle}>Тип об'єкта</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {[
                { id: 'all', label: 'Усі категорії' },
                { id: 'chalet', label: 'Шале та котеджі' },
                { id: 'glamping', label: 'Глемпінги' },
                { id: 'house', label: 'Приватні будинки' },
                { id: 'apartment', label: 'Квартири' },
              ].map((t) => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#291C0E' }}>
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === t.id}
                    onChange={() => setSelectedType(t.id)}
                    style={{ accentColor: '#DC9666' }}
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={filterLabelStyle}>Мінімальний рейтинг</label>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {[
                { label: 'Будь-який', val: 0 },
                { label: '4.5 ★', val: 4.5 },
                { label: '4.8 ★', val: 4.8 },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setMinRating(r.val)}
                  style={{
                    ...ratingPillStyle,
                    backgroundColor: minRating === r.val ? '#DC9666' : '#F4ECE4',
                    color: minRating === r.val ? '#FFFFFF' : '#6E473B',
                    borderColor: minRating === r.val ? '#DC9666' : '#E1D4C2',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleResetFilters} style={resetFilterBtnStyle}>
            Скинути всі фільтри
          </button>
        </div>

        {/* СПИСОК КАРТОЧЕК */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>Завантаження каталогу...</div>
          ) : filteredRoutes.length === 0 ? (
            <div style={emptyBoxStyle}>
              <span style={{ fontSize: '36px' }}>🔍</span>
              <h3 style={{ margin: '10px 0 6px 0', color: '#291C0E' }}>Нічого не знайдено</h3>
              <p style={{ color: '#6E473B', fontSize: '13px' }}>Спробуйте змінити фільтри ціни або параметри пошуку.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredRoutes.map((route) => (
                <div key={route.id} style={horizontalCardStyle}>
                  <div style={{ width: '320px', height: '210px', flexShrink: 0, position: 'relative' }}>
                    <img
                      src={route.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'}
                      alt={route.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={categoryBadgeStyle}>{route.categoryName || 'Помешкання'}</span>
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ color: '#DC9666', fontSize: '13px', fontWeight: 700 }}>
                          ⭐ {route.averageRating || '4.95'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#A78D78' }}>📍 {route.location}</span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E', margin: '0 0 8px 0' }}>
                        {route.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6E473B', lineHeight: 1.5, margin: 0 }}>
                        {route.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE4', paddingTop: '12px', marginTop: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#A78D78' }}>Вартість:</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E' }}>
                          ₴ {route.price || '1 950'} <span style={{ fontSize: '12px', fontWeight: 500, color: '#6E473B' }}>/ доба</span>
                        </div>
                      </div>

                      <button onClick={() => navigate(`/routes/${route.id}`)} style={viewDetailsBtnStyle}>
                        Переглянути деталі →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const filterSidebarStyle: React.CSSProperties = {
  width: '280px',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '24px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 18px rgba(41,28,14,0.04)',
  height: 'fit-content',
};
const filterLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#6E473B',
  display: 'block',
};
const filterInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #BEB5A9',
  marginTop: '6px',
  fontSize: '13px',
  outline: 'none',
};
const ratingPillStyle: React.CSSProperties = {
  flex: 1,
  padding: '6px 8px',
  borderRadius: '8px',
  border: '1px solid',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
};
const resetFilterBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#F4ECE4',
  border: '1px solid #E1D4C2',
  borderRadius: '10px',
  color: '#6E473B',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};
const createCtaBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '10px 20px',
  borderRadius: '14px',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: '13px',
};
const horizontalCardStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid #E1D4C2',
  boxShadow: '0 6px 20px rgba(41,28,14,0.05)',
};
const categoryBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '12px',
  left: '12px',
  backgroundColor: 'rgba(41, 28, 14, 0.8)',
  color: '#FFFFFF',
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '11px',
  fontWeight: 700,
};
const viewDetailsBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '10px 20px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
};
const emptyBoxStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #E1D4C2',
};