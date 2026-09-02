// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        {/* Декоративный SVG карпатских сосен и тропы */}
        <div style={illustrationContainerStyle}>
          <svg width="240" height="90" viewBox="0 0 240 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Пунктирная туристическая тропа */}
            <path
              d="M10 75 C 60 40, 100 80, 150 45 C 190 20, 210 50, 230 30"
              stroke="#DC9666"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            {/* Пин локации */}
            <circle cx="230" cy="30" r="5" fill="#DC9666" />
            <circle cx="230" cy="30" r="10" stroke="#DC9666" strokeWidth="1.5" opacity="0.4" />

            {/* Силуэты сосен */}
            <polygon points="50,75 35,75 42.5,50 38,50 42.5,35 40,35 42.5,20 45,35 47,35 42.5,50 50,75" fill="#6E473B" opacity="0.85" />
            <polygon points="85,78 68,78 76.5,50 71,50 76.5,32 73,32 76.5,12 80,32 82,32 76.5,50 85,78" fill="#291C0E" />
            <polygon points="120,75 105,75 112.5,50 108,50 112.5,35 110,35 112.5,22 115,35 117,35 112.5,50 120,75" fill="#6E473B" opacity="0.9" />
            <polygon points="175,76 160,76 167.5,52 163,52 167.5,38 165,38 167.5,24 170,38 172,38 167.5,52 175,76" fill="#A78D78" />
          </svg>
        </div>

        <h1 style={errorCodeStyle}>404</h1>
        <h2 style={titleStyle}>САЙТУ ПОГАНО! ПОЧЕКАЙТЕ ТА ОНОВІТЬ СТОРІНКУ</h2>
        <p style={subtitleStyle}>
          Здається, ви звернули не на ту туристичну стежку. Сторінку не знайдено, або зараз тривають технічні роботи на маршруті.
        </p>

        <div style={btnGroupStyle}>
          <button onClick={() => window.location.reload()} style={secondaryBtnStyle}>
            🔄 Оновити сторінку
          </button>
          <button onClick={() => navigate(-1)} style={secondaryBtnStyle}>
            ← Попередня сторінка
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
  minHeight: 'calc(100vh - 140px)',
  padding: '40px 20px',
  backgroundColor: '#F7F2EB',
};

const cardStyle: React.CSSProperties = {
  maxWidth: '740px',
  width: '100%',
  backgroundColor: '#F4ECE4',
  border: '2px dashed #DC9666',
  borderRadius: '28px',
  padding: '50px 36px',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(41, 28, 14, 0.06)',
};

const illustrationContainerStyle: React.CSSProperties = {
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'center',
};

const errorCodeStyle: React.CSSProperties = {
  fontSize: '76px',
  fontWeight: 800,
  color: '#6E473B',
  margin: '0 0 6px 0',
  letterSpacing: '2px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#291C0E',
  marginBottom: '12px',
  letterSpacing: '0.5px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6E473B',
  lineHeight: 1.6,
  maxWidth: '520px',
  margin: '0 auto 28px auto',
};

const btnGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  flexWrap: 'wrap',
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
  boxShadow: '0 4px 12px rgba(220, 150, 102, 0.3)',
};

const secondaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  color: '#6E473B',
  border: '1.5px solid #BEB5A9',
  padding: '12px 20px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};