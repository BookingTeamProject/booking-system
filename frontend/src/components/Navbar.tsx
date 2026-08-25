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
    <nav style={navStyle}>
      <div style={logoStyle}>
        <Link to="/" style={{ color: '#059669', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
          🌲 Trails UA
        </Link>
      </div>

      <div style={linksContainerStyle}>
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
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const logoStyle: React.CSSProperties = { display: 'flex', alignItems: 'center' };
const linksContainerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '20px' };
const linkStyle: React.CSSProperties = { color: '#374151', textDecoration: 'none', fontSize: '15px', fontWeight: 500 };
const registerBtnStyle: React.CSSProperties = { ...linkStyle, backgroundColor: '#059669', color: '#fff', padding: '8px 16px', borderRadius: '6px' };
const logoutBtnStyle: React.CSSProperties = { backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 };