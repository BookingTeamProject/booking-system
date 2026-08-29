import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const u = JSON.parse(userJson);
        setUserName(`${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Користувач');
        setAvatarUrl(u.avatarUrl);
      } catch (e) {
        console.error(e);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Логотип */}
        <Link to="/" style={logoStyle}>
          <span style={{ fontSize: '24px' }}>🏔️</span>
          <span style={{ fontWeight: 800, fontSize: '22px', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Trails<span style={{ color: '#DC9666' }}>UA</span>
          </span>
        </Link>

        {/* Навигация */}
        <nav style={navLinksStyle}>
          <Link to="/" style={navItemStyle}>🏠 Головна</Link>
          <Link to="/" style={navItemStyle}>☰ Меню</Link>
          <Link to="/" style={navItemStyle}>👥 Про нас</Link>
          <Link to="/" style={navItemStyle}>🏷️ Акції</Link>
          <Link to="/" style={navItemStyle}>🎧 Підтримка</Link>
        </nav>

        {/* Кнопка регистрации жилья / роли орендодавця */}
        <Link to="/register" style={ctaButtonStyle}>
          🏠 Зареєструвати своє помешкання
        </Link>

        {/* Язык и Профиль */}
        <div style={rightGroupStyle}>
          <div style={langBadgeStyle}>🌐 UA ▾</div>

          {token ? (
            <div style={userProfileDropdownStyle}>
              <Link to="/profile" style={userCardStyle}>
                <img
                  src={avatarUrl ? `http://localhost:5238${avatarUrl}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt="avatar"
                  style={userAvatarStyle}
                />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{userName}</span>
                  <span style={{ color: '#E1D4C2', fontSize: '11px' }}>особистий кабінет ▾</span>
                </div>
              </Link>
              <button onClick={handleLogout} style={logoutIconBtnStyle} title="Вийти">🚪</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" style={loginBtnStyle}>Увійти</Link>
              <Link to="/register" style={registerBtnStyle}>Зареєструватися</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#6E473B',
  boxShadow: '0 4px 15px rgba(41, 28, 14, 0.15)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '14px 28px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' };
const navLinksStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '18px' };
const navItemStyle: React.CSSProperties = { color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: 500, opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' };
const ctaButtonStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#ffffff', padding: '10px 18px', borderRadius: '24px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(220, 150, 102, 0.4)' };
const rightGroupStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '14px' };
const langBadgeStyle: React.CSSProperties = { color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' };
const userProfileDropdownStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '4px 10px 4px 6px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.15)' };
const userCardStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' };
const userAvatarStyle: React.CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #DC9666' };
const logoutIconBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', color: '#fff', opacity: 0.8 };
const loginBtnStyle: React.CSSProperties = { color: '#ffffff', border: '1px solid #DC9666', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 };
const registerBtnStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#ffffff', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 };