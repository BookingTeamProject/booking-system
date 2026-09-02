// src/pages/PromotionsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();

  const promotions = [
    {
      id: '1',
      title: 'Знижка 25% на Колибу «Два Потоки»',
      location: 'Яремче, Івано-Франківська обл.',
      discount: '-25%',
      oldPrice: '3 200 ₴',
      newPrice: '2 400 ₴',
      validUntil: '30 Вересня 2026',
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      title: 'Пентхаус з видом на Оперу зі знижкою 15%',
      location: 'Львів, Центр',
      discount: '-15%',
      oldPrice: '2 800 ₴',
      newPrice: '2 380 ₴',
      validUntil: '15 Жовтня 2026',
      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '3',
      title: 'Глемпінг на полонині Стеришора (-20%)',
      location: 'Верховина, Карпати',
      discount: '-20%',
      oldPrice: '4 000 ₴',
      newPrice: '3 200 ₴',
      validUntil: '31 Серпня 2026',
      img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div style={{ maxWidth: '1380px', margin: '30px auto', padding: '0 24px 80px 24px' }}>
      {/* Главный промо-баннер */}
      <div style={bannerContainerStyle}>
        <span style={badgeStyle}>СЕЗОННІ ЗНИЖКИ</span>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#291C0E', margin: '8px 0 12px 0' }}>
          КАРПАТСЬКЕ ЛІТО ТА ОСІНЬ: ЗНИЖКИ ДО -25%
        </h1>
        <p style={{ color: '#6E473B', fontSize: '15px', maxWidth: '640px', lineHeight: 1.5, margin: 0 }}>
          Отримуйте спеціальні ціни на перевірені котеджі, шале з чанами та авторські туристичні маршрути.
        </p>
      </div>

      {/* Список промо-карточек */}
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#291C0E', marginBottom: '22px' }}>
        Актуальні спеціальні пропозиції
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {promotions.map((promo) => (
          <div key={promo.id} style={promoCardStyle}>
            <div style={{ position: 'relative', height: '200px' }}>
              <img src={promo.img} alt={promo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={discountBadgeStyle}>{promo.discount}</span>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>📍 {promo.location}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#291C0E', margin: '6px 0 10px 0' }}>
                  {promo.title}
                </h3>
                <div style={{ fontSize: '12px', color: '#A78D78', marginBottom: '14px' }}>
                  ⏳ Діє до: {promo.validUntil}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE4', paddingTop: '14px' }}>
                <div>
                  <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#A78D78' }}>
                    {promo.oldPrice}
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>
                    {promo.newPrice} <span style={{ fontSize: '11px', color: '#6E473B', fontWeight: 400 }}>/ доба</span>
                  </div>
                </div>

                <button onClick={() => navigate(`/routes/${promo.id}`)} style={claimBtnStyle}>
                  Забронювати
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const bannerContainerStyle: React.CSSProperties = {
  backgroundColor: '#E1D4C2',
  borderRadius: '26px',
  padding: '40px 32px',
  marginBottom: '36px',
};
const badgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '1px',
  color: '#DC9666',
  backgroundColor: '#F4ECE4',
  padding: '4px 12px',
  borderRadius: '10px',
  display: 'inline-block',
};
const promoCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid #E1D4C2',
  boxShadow: '0 6px 20px rgba(41,28,14,0.05)',
  display: 'flex',
  flexDirection: 'column',
};
const discountBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: '#DC2626',
  color: '#FFFFFF',
  fontWeight: 800,
  fontSize: '13px',
  padding: '5px 12px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(220,38,38,0.4)',
};
const claimBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '10px 18px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
};