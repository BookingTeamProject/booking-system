// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formatAvatar = (url?: string | null): string => {
  if (!url) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = window.location.hostname !== 'localhost' ? 'https://trailsua.pp.ua' : 'http://localhost:5238';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const Navbar: React.FC = () => {
  const { user, isLandlord, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (p: string) => location.pathname === p;

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Логотип */}
        <Link to="/" style={logoStyle}>
          <span style={{ fontSize: '26px' }}>🏔️</span>
          <span style={{ fontWeight: 800, fontSize: '22px', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            Trails<span style={{ color: '#DC9666' }}>UA</span>
          </span>
        </Link>

        {/* Навигация Figma */}
        <nav style={navLinksStyle}>
          <Link to="/" style={isActive('/') ? activeNavStyle : navStyle}>🏠 Головна</Link>
          <Link to="/routes" style={isActive('/routes') ? activeNavStyle : navStyle}>☰ Меню</Link>
          <Link to="/about" style={isActive('/about') ? activeNavStyle : navStyle}>👥 Про нас</Link>
          <Link to="/promotions" style={isActive('/promotions') ? activeNavStyle : navStyle}>🏷️ Акції</Link>
          <Link to="/faq" style={isActive('/faq') ? activeNavStyle : navStyle}>🎧 Підтримка</Link>
        </nav>

        {/* Кнопка регистрации жилья / роли */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isLandlord ? (
            <Link to="/routes/create" style={ctaStyle}>
              ➕ Додати маршрут / житло
            </Link>
          ) : (
            <Link to="/profile" style={ctaStyle}>
              🏠 Зареєструвати своє помешкання
            </Link>
          )}

          <div style={langBadgeStyle}>🌐 UA</div>

          {/* Профиль или Вход */}
          {user ? (
            <div style={userCardWrapperStyle}>
              <Link to="/profile" style={userCardStyle}>
                <img
                  src={formatAvatar(user.avatarUrl)}
                  alt="avatar"
                  style={avatarStyle}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.firstName || 'Мандрівник'}
                  </span>
                  <span style={{ color: '#E1D4C2', fontSize: '11px' }}>
                    {isLandlord ? 'орендодавець ▾' : 'особистий кабінет ▾'}
                  </span>
                </div>
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} style={logoutBtnStyle} title="Вийти">
                🚪
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" style={loginBtnStyle}>Увійти</Link>
              <Link to="/register" style={registerBtnStyle}>Зареєструватися</Link>
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} style={burgerBtnStyle}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={mobileNavStyle}>
          <Link to="/" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>🏠 Головна</Link>
          <Link to="/routes" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>🗺️ Каталог житла та турів</Link>
          <Link to="/about" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>👥 Про нас</Link>
          <Link to="/promotions" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>🏷️ Акції</Link>
          <Link to="/faq" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>🎧 Підтримка</Link>
          <Link to="/profile" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>👤 Особистий кабінет</Link>
        </div>
      )}
    </header>
  );
};

const headerStyle: React.CSSProperties = { backgroundColor: '#6E473B', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 18px rgba(41,28,14,0.15)' };
const containerStyle: React.CSSProperties = { maxWidth: '1440px', margin: '0 auto', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' };
const navLinksStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '20px' };
const navStyle: React.CSSProperties = { color: '#E1D4C2', textDecoration: 'none', fontSize: '14px', fontWeight: 500 };
const activeNavStyle: React.CSSProperties = { ...navStyle, color: '#FFFFFF', fontWeight: 700, borderBottom: '2px solid #DC9666', paddingBottom: '2px' };
const ctaStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#FFFFFF', padding: '9px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, boxShadow: '0 2px 10px rgba(220,150,102,0.35)' };
const langBadgeStyle: React.CSSProperties = { color: '#FFFFFF', border: '1px solid rgba(225,212,194,0.35)', padding: '5px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 };
const userCardWrapperStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '4px 10px 4px 6px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.15)' };
const userCardStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' };
const avatarStyle: React.CSSProperties = { width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #DC9666' };
const logoutBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', color: '#FFFFFF' };
const loginBtnStyle: React.CSSProperties = { color: '#FFFFFF', border: '1px solid #DC9666', padding: '7px 14px', borderRadius: '18px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 };
const registerBtnStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#FFFFFF', padding: '7px 14px', borderRadius: '18px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 };
const burgerBtnStyle: React.CSSProperties = { display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' };
const mobileNavStyle: React.CSSProperties = { backgroundColor: '#5C392F', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' };
const mobileLinkStyle: React.CSSProperties = { color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: 600 };