import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      saveSessionAndNavigate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Невірний email або пароль');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('/auth/google', { idToken: credentialResponse.credential });
      saveSessionAndNavigate(response.data);
    } catch (err: any) {
      setError('Помилка входу через Google');
    }
  };

  const saveSessionAndNavigate = (data: any) => {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    alert('Успішний вхід!');
    navigate('/profile');
  };

  return (
    <div style={splitScreenWrapperStyle}>
      <div style={authCardContainerStyle}>
        <div style={leftImageContainerStyle}>
          <img
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
            alt="Cabin"
            style={coverImageStyle}
          />
        </div>

        <div style={rightFormContainerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '28px' }}>📍</span>
            <h2 style={{ fontSize: '28px', color: '#291C0E', fontWeight: 800, letterSpacing: '1px' }}>ВХІД</h2>
          </div>

          {error && <div style={errorAlertStyle}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email або телефон</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введіть ваш email..."
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            <button type="submit" style={primaryButtonStyle}>Вхід</button>
          </form>

          <div style={{ textAlign: 'center', margin: '18px 0', color: '#6E473B', fontSize: '13px', fontWeight: 600 }}>або</div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Помилка Google')} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6E473B' }}>
            Немає акаунту? <Link to="/register" style={{ color: '#DC9666', fontWeight: 700, textDecoration: 'none' }}>Зареєструватись</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const splitScreenWrapperStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '30px 20px' };
const authCardContainerStyle: React.CSSProperties = { display: 'flex', width: '100%', maxWidth: '880px', backgroundColor: '#F4ECE4', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(41, 28, 14, 0.08)', border: '2px solid #E1D4C2' };
const leftImageContainerStyle: React.CSSProperties = { flex: 1, minHeight: '480px' };
const coverImageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const rightFormContainerStyle: React.CSSProperties = { flex: 1.1, padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#6E473B', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #BEB5A9', backgroundColor: '#FFFFFF', fontSize: '14px', outline: 'none' };
const primaryButtonStyle: React.CSSProperties = { width: '100%', padding: '13px', backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(220, 150, 102, 0.3)' };
const errorAlertStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' };