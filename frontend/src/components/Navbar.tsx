import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <div style={navContainerStyle}>
        {/* Логотип */}
        <Link to="/" style={logoStyle}>
          🌲 Trails UA
        </Link>

        {/* Навигация */}
        <div style={linksGroupStyle}>
          <Link to="/" style={linkStyle}>Маршруты</Link>
          
          {token ? (
            <>
              <Link to="/favorites" style={linkStyle}>❤️ Избранное</Link>
              <Link to="/profile" style={linkStyle}>👤 Профиль</Link>
              <button onClick={handleLogout} style={logoutBtnStyle}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Вход</Link>
              <Link to="/register" style={registerBtnStyle}>Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const navContainerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '16px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const logoStyle: React.CSSProperties = {
  color: '#059669',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '22px',
  letterSpacing: '-0.5px',
};

const linksGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const linkStyle: React.CSSProperties = {
  color: '#374151',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
  transition: 'color 0.2s',
};

const registerBtnStyle: React.CSSProperties = {
  ...linkStyle,
  backgroundColor: '#059669',
  color: '#ffffff',
  padding: '8px 18px',
  borderRadius: '6px',
  fontWeight: 600,
};

const logoutBtnStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: '1px solid #ef4444',
  color: '#ef4444',
  padding: '6px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: '14px',
};