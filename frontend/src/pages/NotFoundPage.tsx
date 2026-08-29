import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌲 📍 🌲</div>
        <h1 style={codeStyle}>404</h1>
        <h2 style={titleStyle}>САЙТУ ПОГАНО! ПОЧЕКАЙТЕ ТА ОНОВІТЬ СТОРІНКУ</h2>
        <p style={subtitleStyle}>
          Здається, ви звернули не на ту туристичну стежку. Сторінку не знайдено або зараз тривають технічні роботи.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button onClick={() => window.location.reload()} style={secondaryBtnStyle}>
            🔄 Оновити
          </button>
          <Link to="/" style={primaryBtnStyle}>
            🏠 На головну
          </Link>
        </div>
      </div>
    </div>
  );
};

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 120px)',
  padding: '40px 20px',
  backgroundColor: '#f7f2eb',
};

const cardStyle: React.CSSProperties = {
  maxWidth: '680px',
  width: '100%',
  backgroundColor: '#F4ECE4',
  border: '2px dashed #DC9666',
  borderRadius: '24px',
  padding: '48px 32px',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(41, 28, 14, 0.06)',
};

const codeStyle: React.CSSProperties = {
  fontSize: '72px',
  fontWeight: 800,
  color: '#6E473B',
  margin: '0 0 8px 0',
  letterSpacing: '2px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#291C0E',
  marginBottom: '12px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6E473B',
  lineHeight: 1.6,
  maxWidth: '480px',
  margin: '0 auto',
};

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '12px 24px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  border: 'none',
  cursor: 'pointer',
};

const secondaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  color: '#6E473B',
  border: '1px solid #BEB5A9',
  padding: '12px 24px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};