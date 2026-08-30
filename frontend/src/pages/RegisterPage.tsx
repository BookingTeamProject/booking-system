import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(0); // 0: Орендар, 1: Орендодавець
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        role: Number(role),
      });

      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert('Реєстрація успішна!');
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка при реєстрації');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('/auth/google', { idToken: credentialResponse.credential });
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/profile');
    } catch (err: any) {
      setError('Помилка реєстрації через Google');
    }
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
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '26px' }}>🏔️</span>
            <h2 style={{ fontSize: '26px', color: '#291C0E', fontWeight: 800, letterSpacing: '1px' }}>РЕЄСТРАЦІЯ</h2>
          </div>

          {error && <div style={errorAlertStyle}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Ім'я</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Прізвище</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Оберіть роль</label>
              <select value={role} onChange={(e) => setRole(Number(e.target.value))} style={selectStyle}>
                <option value={0}>Орендар (Шукаю житло та тури)</option>
                <option value={1}>Орендодавець (Здаю житло та маршрути)</option>
              </select>
            </div>

            <button type="submit" style={primaryButtonStyle}>Зареєструватись</button>
          </form>

          <div style={{ textAlign: 'center', margin: '14px 0', color: '#6E473B', fontSize: '13px', fontWeight: 600 }}>або</div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Помилка Google')} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6E473B' }}>
            Вже є акаунт? <Link to="/login" style={{ color: '#DC9666', fontWeight: 700, textDecoration: 'none' }}>Увійти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const splitScreenWrapperStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '30px 20px' };
const authCardContainerStyle: React.CSSProperties = { display: 'flex', width: '100%', maxWidth: '900px', backgroundColor: '#F4ECE4', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(41, 28, 14, 0.08)', border: '2px solid #E1D4C2' };
const leftImageContainerStyle: React.CSSProperties = { flex: 1, minHeight: '520px' };
const coverImageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const rightFormContainerStyle: React.CSSProperties = { flex: 1.1, padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#6E473B', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #BEB5A9', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' };
const selectStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #BEB5A9', backgroundColor: '#FFFFFF', fontSize: '13px', outline: 'none' };
const primaryButtonStyle: React.CSSProperties = { width: '100%', padding: '12px', backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(220, 150, 102, 0.3)' };
const errorAlertStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', textAlign: 'center' };