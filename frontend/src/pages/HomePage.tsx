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
      const response = await api.get(`/routes?search=${encodeURIComponent(searchQuery)}`);
      if (Array.isArray(response.data)) {
        setRoutes(response.data);
      } else {
        setRoutes([]);
      }
    } catch (e) {
      console.error('Ошибка загрузки маршрутов:', e);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.get('/favorite');
      if (Array.isArray(res.data)) {
        setFavoriteIds(res.data.map((r: RouteItem) => r.id));
      }
    } catch (e) {
      console.error('Ошибка загрузки избранного:', e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRoutes(search);
  };

  const toggleFavorite = async (routeId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Увійдіть, щоб зберігати в обране!');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/favorite/${routeId}`);
      if (res.data?.isFavorite) {
        setFavoriteIds([...favoriteIds, routeId]);
      } else {
        setFavoriteIds(favoriteIds.filter(id => id !== routeId));
      }
    } catch (e) {
      alert('Помилка збереження');
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px 24px' }}>
      
      {/* 1. HERO BANNER */}
      <div style={heroContainerStyle}>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>
            ЗНАЙДІТЬ СВІЙ<br />ІДЕАЛЬНИЙ ВІДПОЧИНОК
          </h1>
          <p style={heroSubtitleStyle}>
            Бронюйте затишні будиночки та відкривайте найкращі туристичні маршрути України ❤️
          </p>

          <form onSubmit={handleSearch} style={searchBoxStyle}>
            <div style={searchFieldStyle}>
              <span style={searchLabelStyle}>Куди ви їдете?</span>
              <input
                type="text"
                placeholder="Введіть локацію або маршрут..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={searchInnerInputStyle}
              />
            </div>
            <div style={searchFieldStyle}>
              <span style={searchLabelStyle}>Дати</span>
              <input type="text" placeholder="Дати заїзду — виїзду" style={searchInnerInputStyle} />
            </div>
            <div style={searchFieldStyle}>
              <span style={searchLabelStyle}>Гості</span>
              <input type="text" placeholder="1 Кімната / 2 Гостя" style={searchInnerInputStyle} />
            </div>
            <button type="submit" style={searchActionButtonStyle}>Пошук</button>
          </form>
        </div>

        <div style={heroImageContainerStyle}>
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
            alt="Cabin"
            style={heroImgStyle}
          />
        </div>
      </div>

      {/* 2. ЧОМУ МИ? */}
      <div style={{ margin: '60px 0 50px 0' }}>
        <h2 style={sectionHeaderStyle}>ЧОМУ МИ?</h2>
        <div style={featuresGridStyle}>
          <div style={featureCardStyle}>
            <div style={featureIconCircleStyle}>🔍</div>
            <h4 style={featureTitleStyle}>Перевірені помешкання</h4>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconCircleStyle}>🎧</div>
            <h4 style={featureTitleStyle}>Підтримка 24/7</h4>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconCircleStyle}>🛡️</div>
            <h4 style={featureTitleStyle}>Безпечне бронювання</h4>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconCircleStyle}>☀️</div>
            <h4 style={featureTitleStyle}>Відпочинок, що залишає спогади</h4>
          </div>
        </div>
      </div>

      {/* 3. КАТАЛОГ МАРШРУТІВ */}
      <div style={{ margin: '50px 0' }}>
        <h2 style={sectionHeaderStyle}>ПОПУЛЯРНІ МАРШРУТИ ТА ПОМЕШКАННЯ</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Завантаження...</div>
        ) : !Array.isArray(routes) || routes.length === 0 ? (
          <div style={emptyCardStyle}>
            <p>Маршрути поки не додані. Створіть перший маршрут через кабінет орендодавця!</p>
          </div>
        ) : (
          <div style={routesGridStyle}>
            {routes.map((route) => {
              const isFav = favoriteIds.includes(route.id);
              return (
                <div key={route.id} style={routeCardStyle}>
                  <div style={{ position: 'relative', height: '190px' }}>
                    <img
                      src={route.imageUrls?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'}
                      alt={route.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      onClick={() => toggleFavorite(route.id)}
                      style={heartBtnStyle}
                      title="В обране"
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                    <span style={cardCategoryBadgeStyle}>{route.categoryName || 'Тур'}</span>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ color: '#d9793e', fontSize: '13px' }}>⭐⭐⭐⭐⭐</span>
                      <span style={{ fontSize: '12px', color: '#7a6a5d' }}>{route.distanceKm} км • {route.durationHours} год</span>
                    </div>

                    <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', color: '#291C0E', fontWeight: 700 }}>{route.title}</h3>
                    <p style={{ fontSize: '13px', color: '#7a6a5d', margin: '0 0 14px 0' }}>📍 {route.location}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE4', paddingTop: '10px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#291C0E' }}>
                        ₴ {route.price || '1 490'}
                      </span>
                      <button onClick={() => navigate(`/routes/${route.id}`)} style={detailsBtnStyle}>
                        Дивитися деталі
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. БЛОК АКЦІЙ */}
      <div style={promoBannerContainerStyle}>
        <div style={{ flex: 1, minHeight: '260px' }}>
          <img
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=700&q=80"
            alt="Cabin"
            style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#291C0E', margin: 0 }}>АКЦІЇ ДЛЯ ВАС</h2>
          
          <div style={discountItemStyle}>
            <span style={{ fontSize: '22px' }}>🏷️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Знижка 20% на Колибу "Два Потоки"</div>
              <div style={{ fontSize: '12px', color: '#7a6a5d' }}>Яремче, Карпати</div>
            </div>
            <span>➔</span>
          </div>

          <div style={discountItemStyle}>
            <span style={{ fontSize: '22px' }}>🏷️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Знижка 15% на Пентхаус з видом на Оперу</div>
              <div style={{ fontSize: '12px', color: '#7a6a5d' }}>Львів, Центр</div>
            </div>
            <span>➔</span>
          </div>

          <button style={{ alignSelf: 'flex-start', padding: '12px 24px', backgroundColor: '#DC9666', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}>
            Дивитися всі акції
          </button>
        </div>
      </div>
    </div>
  );
};

// Стили
const heroContainerStyle: React.CSSProperties = { display: 'flex', gap: '30px', alignItems: 'center', backgroundColor: '#E1D4C2', borderRadius: '28px', padding: '40px', marginTop: '24px' };
const heroContentStyle: React.CSSProperties = { flex: 1.2 };
const heroTitleStyle: React.CSSProperties = { fontSize: '36px', fontWeight: 800, color: '#291C0E', lineHeight: 1.2, margin: '0 0 14px 0' };
const heroSubtitleStyle: React.CSSProperties = { fontSize: '15px', color: '#6E473B', margin: '0 0 28px 0', lineHeight: 1.5 };
const heroImageContainerStyle: React.CSSProperties = { flex: 1, height: '320px' };
const heroImgStyle: React.CSSProperties = { width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' };
const searchBoxStyle: React.CSSProperties = { display: 'flex', backgroundColor: '#F4ECE4', borderRadius: '16px', padding: '8px 12px', border: '1px solid #BEB5A9', gap: '10px', alignItems: 'center' };
const searchFieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', flex: 1, padding: '4px 8px' };
const searchLabelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#6E473B' };
const searchInnerInputStyle: React.CSSProperties = { border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#291C0E', fontWeight: 600, marginTop: '2px' };
const searchActionButtonStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' };
const sectionHeaderStyle: React.CSSProperties = { fontSize: '22px', fontWeight: 800, color: '#291C0E', textAlign: 'center', marginBottom: '24px', letterSpacing: '0.5px' };
const featuresGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' };
const featureCardStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 15px rgba(41,28,14,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' };
const featureIconCircleStyle: React.CSSProperties = { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F4ECE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' };
const featureTitleStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 700, color: '#291C0E', margin: 0 };
const routesGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' };
const routeCardStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(41,28,14,0.06)', border: '1px solid #E1D4C2' };
const heartBtnStyle: React.CSSProperties = { position: 'absolute', top: '10px', right: '10px', background: '#FFFFFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardCategoryBadgeStyle: React.CSSProperties = { position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(41, 28, 14, 0.75)', color: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 };
const detailsBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#DC9666', fontWeight: 700, fontSize: '13px', cursor: 'pointer' };
const emptyCardStyle: React.CSSProperties = { textAlign: 'center', padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '18px', color: '#7a6a5d' };
const promoBannerContainerStyle: React.CSSProperties = { display: 'flex', gap: '30px', backgroundColor: '#E1D4C2', borderRadius: '24px', padding: '30px', marginTop: '40px' };
const discountItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(41,28,14,0.04)' };