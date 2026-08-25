import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Обычный вход по Email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      saveSessionAndNavigate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
    }
  };

  // Вход через Google
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('/auth/google', {
        idToken: credentialResponse.credential
      });
      saveSessionAndNavigate(response.data);
    } catch (err: any) {
      setError('Не удалось войти через Google');
    }
  };

  const saveSessionAndNavigate = (data: any) => {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    alert('Вы успешно вошли!');
    navigate('/profile');
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#111827' }}>Вход в Trails UA</h2>
        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          </div>

          <button type="submit" style={buttonStyle}>Войти</button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>или</div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Ошибка входа через Google')}
          />
        </div>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Нет аккаунта? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  margin: '20px',
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '18px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '15px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  outline: 'none',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: '8px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 600,
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  padding: '10px',
  borderRadius: '6px',
  marginBottom: '16px',
  fontSize: '14px',
  textAlign: 'center',
};

const pageWrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 80px)',
  padding: '20px',
};