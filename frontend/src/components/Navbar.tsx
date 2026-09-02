// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLandlord, setIsLandlord] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const u = JSON.parse(userJson);
        setUserName(`${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Мандрівник');
        setAvatarUrl(u.avatarUrl || '');
        setIsLandlord(u.role === 'Landlord' || u.role === 1 || u.role === '1');
      } catch (e) {
        console.error(e);
      }
    }
  }, [token, location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Логотип */}
        <Link to="/" style={logoStyle} onClick={() => setIsMobileMenuOpen(false)}>
          <span style={{ fontSize: '26px' }}>🏔️</span>
          <span style={{ fontWeight: 800, fontSize: '22px', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            Trails<span style={{ color: '#DC9666' }}>UA</span>
          </span>
        </Link>

        {/* Десктопная навигация */}
        <nav style={navLinksStyle}>
          <Link to="/" style={isActive('/') ? activeNavItemStyle : navItemStyle}>
            Головна
          </Link>
          <Link to="/routes" style={isActive('/routes') ? activeNavItemStyle : navItemStyle}>
            Маршрути та житло
          </Link>
          <Link to="/faq" style={isActive('/faq') ? activeNavItemStyle : navItemStyle}>
            Підтримка
          </Link>
          <Link to="/favorites" style={isActive('/favorites') ? activeNavItemStyle : navItemStyle}>
            Обране
          </Link>
        </nav>

        {/* Правая часть: CTA, язык, профиль */}
        <div style={rightGroupStyle}>
          {isLandlord ? (
            <Link to="/routes/create" style={ctaButtonStyle}>
              ➕ Додати помешкання
            </Link>
          ) : (
            <Link to="/select-role" style={ctaButtonStyle}>
              🏠 Здати помешкання
            </Link>
          )}

          <div style={langBadgeStyle}>🇺🇦 UA</div>

          {token ? (
            <div style={userProfileDropdownStyle}>
              <Link to="/profile" style={userCardStyle}>
                <img
                  src={
                    avatarUrl
                      ? avatarUrl.startsWith('http')
                        ? avatarUrl
                        : `http://localhost:5238${avatarUrl}`
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                  }
                  alt="avatar"
                  style={userAvatarStyle}
                />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userName}
                  </span>
                  <span style={{ color: '#E1D4C2', fontSize: '11px' }}>кабінет ▾</span>
                </div>
              </Link>
              <button onClick={handleLogout} style={logoutIconBtnStyle} title="Вийти">
                🚪
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" style={loginBtnStyle}>
                Увійти
              </Link>
              <Link to="/register" style={registerBtnStyle}>
                Реєстрація
              </Link>
            </div>
          )}

          {/* Кнопка бургер-меню для мобильных */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={hamburgerBtnStyle}
            aria-label="Меню"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Выпадающее мобильное меню */}
      {isMobileMenuOpen && (
        <div style={mobileDropdownStyle}>
          <Link to="/" style={mobileNavItemStyle} onClick={() => setIsMobileMenuOpen(false)}>
            🏠 Головна
          </Link>
          <Link to="/routes" style={mobileNavItemStyle} onClick={() => setIsMobileMenuOpen(false)}>
            🗺️ Маршрути та житло
          </Link>
          <Link to="/favorites" style={mobileNavItemStyle} onClick={() => setIsMobileMenuOpen(false)}>
            ❤️ Обрані маршрути
          </Link>
          <Link to="/faq" style={mobileNavItemStyle} onClick={() => setIsMobileMenuOpen(false)}>
            🎧 Підтримка та FAQ
          </Link>
          <Link to="/profile" style={mobileNavItemStyle} onClick={() => setIsMobileMenuOpen(false)}>
            👤 Особистий кабінет
          </Link>
        </div>
      )}
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#6E473B',
  boxShadow: '0 4px 18px rgba(41, 28, 14, 0.15)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '12px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
};

const navLinksStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '22px',
};

const navItemStyle: React.CSSProperties = {
  color: '#E1D4C2',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'color 0.2s',
};

const activeNavItemStyle: React.CSSProperties = {
  ...navItemStyle,
  color: '#FFFFFF',
  fontWeight: 700,
  borderBottom: '2px solid #DC9666',
  paddingBottom: '2px',
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#ffffff',
  padding: '9px 16px',
  borderRadius: '20px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 2px 10px rgba(220, 150, 102, 0.35)',
};

const rightGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const langBadgeStyle: React.CSSProperties = {
  color: '#ffffff',
  border: '1px solid rgba(225, 212, 194, 0.35)',
  padding: '5px 10px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 600,
};

const userProfileDropdownStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  padding: '4px 10px 4px 6px',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
};

const userCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
};

const userAvatarStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '1.5px solid #DC9666',
};

const logoutIconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  padding: '4px',
  color: '#fff',
  opacity: 0.85,
};

const loginBtnStyle: React.CSSProperties = {
  color: '#ffffff',
  border: '1px solid #DC9666',
  padding: '7px 14px',
  borderRadius: '18px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 600,
};

const registerBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#ffffff',
  padding: '7px 14px',
  borderRadius: '18px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 600,
};

const hamburgerBtnStyle: React.CSSProperties = {
  display: 'none',
  background: 'none',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '22px',
  cursor: 'pointer',
  padding: '4px',
};

const mobileDropdownStyle: React.CSSProperties = {
  backgroundColor: '#5C392F',
  borderTop: '1px solid rgba(225, 212, 194, 0.15)',
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const mobileNavItemStyle: React.CSSProperties = {
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  padding: '6px 0',
};