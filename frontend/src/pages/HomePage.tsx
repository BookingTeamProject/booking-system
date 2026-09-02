// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '../context/RoutesContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { routes, favorites, toggleFavorite, loading } = useRoutes();
  const [search, setSearch] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [subDone, setSubDone] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/routes`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub) {
      setSubDone(true);
      setTimeout(() => setSubDone(false), 4000);
      setEmailSub('');
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
      {/* 1. HERO BANNER */}
      <div style={heroContainerStyle}>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>
            ЗНАЙДІТЬ СВІЙ<br />ІДЕАЛЬНИЙ ВІДПОЧИНОК
          </h1>
          <p style={heroSubtitleStyle}>
            Бронюйте затишні будиночки та відкривайте найкращі туристичні маршрути України ❤️
          </p>

          <form onSubmit={handleSearchSubmit} style={searchBoxStyle}>
            <div style={searchFieldStyle}>
              <span style={searchLabelStyle}>Куди ви їдете?</span>
              <input
                type="text"
                placeholder="Яремче, Буковель, Ворохта..."
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

      {/* 3. ВИ НЕЩОДАВНО ШУКАЛИ (FIGMA) */}
      <div style={{ margin: '50px 0' }}>
        <h2 style={{ ...sectionHeaderStyle, textAlign: 'left' }}>ВИ НЕЩОДАВНО ШУКАЛИ</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {routes.slice(0, 4).map((r) => (
            <div key={r.id} onClick={() => navigate(`/routes/${r.id}`)} style={recentCardStyle}>
              <img src={r.imageUrls[0]} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <strong style={{ fontSize: '14px', color: '#291C0E', display: 'block', marginBottom: '4px' }}>{r.title}</strong>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>📍 {r.location}</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#DC9666', marginTop: '6px' }}>₴ {r.price} / доба</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. БЛОК АКЦІЙ ДЛЯ ВАС (FIGMA) */}
      <div style={promoBannerContainerStyle}>
        <div style={{ flex: 1, minHeight: '260px', borderRadius: '20px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=700&q=80"
            alt="Cabin"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#291C0E', margin: 0 }}>АКЦІЇ ДЛЯ ВАС</h2>

          <div style={discountItemStyle} onClick={() => navigate('/promotions')}>
            <span style={{ fontSize: '22px' }}>🏷️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Знижка 20% на Колибу "Два Потоки"</div>
              <div style={{ fontSize: '12px', color: '#7a6a5d' }}>Яремче, Карпати</div>
            </div>
            <span>➔</span>
          </div>

          <div style={discountItemStyle} onClick={() => navigate('/promotions')}>
            <span style={{ fontSize: '22px' }}>🏷️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Знижка 15% на Пентхаус з видом на Оперу</div>
              <div style={{ fontSize: '12px', color: '#7a6a5d' }}>Львів, Центр</div>
            </div>
            <span>➔</span>
          </div>

          <button onClick={() => navigate('/promotions')} style={promoBtnStyle}>
            Дивитися всі акції
          </button>
        </div>
      </div>

      {/* 5. ПОПУЛЯРНІ МАРШРУТИ ТА ГОТЕЛІ */}
      <div style={{ margin: '60px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ ...sectionHeaderStyle, textAlign: 'left', margin: 0 }}>ПОПУЛЯРНІ МАРШРУТИ ТА ПОМЕШКАННЯ</h2>
          <button onClick={() => navigate('/routes')} style={viewCatalogBtnStyle}>
            Перейти до каталогу →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Завантаження...</div>
        ) : (
          <div style={routesGridStyle}>
            {routes.map((route) => {
              const isFav = favorites.includes(route.id);
              return (
                <div key={route.id} style={routeCardStyle}>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img
                      src={route.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'}
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
                      <span style={{ color: '#DC9666', fontSize: '13px', fontWeight: 700 }}>
                        ⭐ {route.averageRating || '4.95'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#A78D78' }}>📍 {route.location}</span>
                    </div>

                    <h3 style={{ fontSize: '16px', margin: '0 0 6px 0', color: '#291C0E', fontWeight: 700 }}>
                      {route.title}
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE4', paddingTop: '10px', marginTop: '10px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E' }}>
                        ₴ {route.price || '1 950'}
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

      {/* 6. БУДЬТЕ В КУРСІ НАЙКРАЩИХ ПРОПОЗИЦІЙ (FIGMA) */}
      <div style={newsletterBoxStyle}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '32px' }}>✉️</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#291C0E', margin: '8px 0' }}>
            БУДЬТЕ В КУРСІ НАЙКРАЩИХ ПРОПОЗИЦІЙ!
          </h2>
          <p style={{ color: '#6E473B', fontSize: '14px', marginBottom: '20px' }}>
            Підпишіться на розсилку та першими отримуйте секретні знижки на шале та авторські тури.
          </p>

          {subDone ? (
            <div style={{ color: '#059669', fontWeight: 700, fontSize: '15px' }}>
              ✓ Дякуємо за підписку! Секретний промокод відправлено на ваш email.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <input
                type="email"
                required
                placeholder="Введіть ваш email..."
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                style={newsletterInputStyle}
              />
              <button type="submit" style={newsletterBtnStyle}>
                Підписатися
              </button>
            </form>
          )}
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
const sectionHeaderStyle: React.CSSProperties = { fontSize: '22px', fontWeight: 800, color: '#291C0E', textAlign: 'center', marginBottom: '24px' };
const featuresGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' };
const featureCardStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 15px rgba(41,28,14,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid #E1D4C2' };
const featureIconCircleStyle: React.CSSProperties = { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#F4ECE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' };
const featureTitleStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 700, color: '#291C0E', margin: 0 };
const recentCardStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E1D4C2', cursor: 'pointer' };
const routesGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' };
const routeCardStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(41,28,14,0.06)', border: '1px solid #E1D4C2' };
const heartBtnStyle: React.CSSProperties = { position: 'absolute', top: '10px', right: '10px', background: '#FFFFFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardCategoryBadgeStyle: React.CSSProperties = { position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(41, 28, 14, 0.75)', color: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 };
const detailsBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#DC9666', fontWeight: 700, fontSize: '13px', cursor: 'pointer' };
const viewCatalogBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#DC9666', fontWeight: 700, fontSize: '14px', cursor: 'pointer' };
const promoBannerContainerStyle: React.CSSProperties = { display: 'flex', gap: '30px', backgroundColor: '#E1D4C2', borderRadius: '24px', padding: '30px', marginTop: '40px' };
const discountItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFFFFF', padding: '14px 18px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(41,28,14,0.04)', cursor: 'pointer' };
const promoBtnStyle: React.CSSProperties = { alignSelf: 'flex-start', padding: '12px 24px', backgroundColor: '#DC9666', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '6px' };
const newsletterBoxStyle: React.CSSProperties = { backgroundColor: '#F4ECE4', borderRadius: '24px', padding: '48px 24px', border: '2px dashed #DC9666', marginTop: '50px' };
const newsletterInputStyle: React.CSSProperties = { padding: '12px 18px', borderRadius: '12px', border: '1px solid #BEB5A9', outline: 'none', width: '300px', fontSize: '14px', backgroundColor: '#FFFFFF' };
const newsletterBtnStyle: React.CSSProperties = { padding: '12px 24px', backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' };