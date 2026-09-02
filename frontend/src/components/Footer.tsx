// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={footerWrapperStyle}>
      <div style={footerContainerStyle}>
        {/* Колонка 1: Логотип */}
        <div style={{ flex: 1.4, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '26px' }}>🏔️</span>
            <span style={{ fontWeight: 800, fontSize: '24px', color: '#FFFFFF' }}>
              Trails<span style={{ color: '#DC9666' }}>UA</span>
            </span>
          </div>
          <p style={{ color: '#E1D4C2', fontSize: '13px', lineHeight: 1.6, maxWidth: '280px' }}>
            Надійний український сервіс перевіреного житла. Робимо подорожі рідним краєм доступними, комфортними та незабутніми.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🇺🇦</span>
            <span style={{ border: '1px solid #A78D78', padding: '3px 10px', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px' }}>
              UAH ₴
            </span>
          </div>
        </div>

        {/* Колонка 2 */}
        <div style={colStyle}>
          <h4 style={colHeadingStyle}>Основні опції</h4>
          <Link to="/" style={footerLinkStyle}>Головна</Link>
          <Link to="/about" style={footerLinkStyle}>Про нас</Link>
          <Link to="/promotions" style={footerLinkStyle}>Акції</Link>
          <Link to="/faq" style={footerLinkStyle}>Підтримка</Link>
          <Link to="/routes/create" style={footerLinkStyle}>Зареєструвати своє помешкання</Link>
        </div>

        {/* Колонка 3 */}
        <div style={colStyle}>
          <h4 style={colHeadingStyle}>Напрямки</h4>
          <Link to="/routes" style={footerLinkStyle}>Львів</Link>
          <Link to="/routes" style={footerLinkStyle}>Одеса</Link>
          <Link to="/routes" style={footerLinkStyle}>Буковель</Link>
          <Link to="/routes" style={footerLinkStyle}>Карпати</Link>
          <Link to="/routes" style={footerLinkStyle}>Івано-Франківськ</Link>
        </div>

        {/* Колонка 4 */}
        <div style={colStyle}>
          <h4 style={colHeadingStyle}>Меню</h4>
          <Link to="/news" style={footerLinkStyle}>Новини та блог</Link>
          <Link to="/profile" style={footerLinkStyle}>Бронювання</Link>
          <Link to="/routes" style={footerLinkStyle}>Керування помешканням</Link>
          <Link to="/contact" style={footerLinkStyle}>Зв'язатися з нами</Link>
          <Link to="/legal" style={footerLinkStyle}>Юридичні умови</Link>
        </div>

        {/* Колонка 5 */}
        <div style={colStyle}>
          <h4 style={colHeadingStyle}>Особистий кабінет</h4>
          <Link to="/profile" style={footerLinkStyle}>Обліковий запис</Link>
          <Link to="/profile" style={footerLinkStyle}>Платежі та картки</Link>
          <Link to="/profile" style={footerLinkStyle}>Фінанси та бонуси</Link>
          <Link to="/profile" style={footerLinkStyle}>Аналітика</Link>
          <Link to="/profile" style={footerLinkStyle}>Безпека</Link>
        </div>
      </div>

      <div style={copyrightBarStyle}>
        Авторські права © 2016—2026 «TrailsUA». Усі права захищено.
      </div>
    </footer>
  );
};

const footerWrapperStyle: React.CSSProperties = { backgroundColor: '#6E473B', color: '#FFFFFF', paddingTop: '48px', marginTop: 'auto' };
const footerContainerStyle: React.CSSProperties = { maxWidth: '1440px', margin: '0 auto', padding: '0 32px 40px 32px', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between' };
const colStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '150px' };
const colHeadingStyle: React.CSSProperties = { fontSize: '15px', fontWeight: 700, color: '#E1D4C2', marginBottom: '6px' };
const footerLinkStyle: React.CSSProperties = { color: '#E1D4C2', textDecoration: 'none', fontSize: '13px', cursor: 'pointer', opacity: 0.85 };
const copyrightBarStyle: React.CSSProperties = { borderTop: '1px solid rgba(225, 212, 194, 0.2)', textAlign: 'center', padding: '16px 20px', fontSize: '12px', color: '#BEB5A9' };