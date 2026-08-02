import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState(0);
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

      alert('Регистрация прошла успешно!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#111827' }}>Регистрация Trails UA</h2>
      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ ...fieldStyle, flex: 1 }}>
            <label style={labelStyle}>Имя</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ ...fieldStyle, flex: 1 }}>
            <label style={labelStyle}>Фамилия</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ ...inputStyle, width: '100%' }} />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" required style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Тип аккаунта</label>
          <select value={role} onChange={(e) => setRole(Number(e.target.value))} style={selectStyle}>
            <option value={0}>Турист / Арендатор</option>
            <option value={1}>Арендодатель (Создание маршрутов)</option>
          </select>
        </div>

        <button type="submit" style={buttonStyle}>
          Зарегистрироваться
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
        Уже есть аккаунт? <Link to="/login" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>Войти</Link>
      </p>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '460px',
  margin: '20px',
  padding: '32px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '16px',
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

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '15px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  outline: 'none',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: '8px',
  backgroundColor: '#059669',
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