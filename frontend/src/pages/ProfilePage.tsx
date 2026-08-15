import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'edit' | 'security'>('info');

  // Форма изменения данных
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Форма смены пароля
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Загружаем профиль при открытии страницы
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/me');
      setProfile(response.data);
      setFirstName(response.data.firstName || '');
      setLastName(response.data.lastName || '');
      setPhoneNumber(response.data.phoneNumber || '');
    } catch (err) {
      setError('Не удалось загрузить профиль. Попробуйте войти заново.');
      navigate('/login');
    }
  };

  // 1. Обновление личных данных
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.put('/user/profile', {
        firstName,
        lastName,
        phoneNumber,
        avatarUrl: profile?.avatarUrl
      });
      setProfile(response.data);
      setMessage('Данные успешно обновлены!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
    }
  };

  // 2. Смена пароля
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/user/change-password', {
        oldPassword,
        newPassword
      });
      setMessage('Пароль успешно изменён!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при смене пароля');
    }
  };

  // 3. Загрузка аватара
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setMessage('');
    setError('');

    try {
      const response = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProfile(); // Перезагружаем профиль с новым аватаром
      setMessage('Аватар успешно обновлён!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке аватара');
    }
  };

  // Выход из системы
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Игнорируем ошибки при выходе
    }
    localStorage.clear();
    navigate('/login');
  };

  if (!profile) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка профиля...</div>;

  return (
    <div style={containerStyle}>
      {/* Шапка карточки профиля */}
      <div style={headerStyle}>
        <div style={avatarContainerStyle}>
          <img
            src={profile.avatarUrl ? `http://localhost:5238${profile.avatarUrl}` : 'https://via.placeholder.com/100'}
            alt="Avatar"
            style={avatarStyle}
          />
          <label style={uploadButtonStyle}>
            📷 Сменить фото
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
          </label>
        </div>
        <div>
          <h2 style={{ margin: 0, color: '#111827' }}>{profile.firstName} {profile.lastName}</h2>
          <p style={{ margin: '4px 0', color: '#6b7280' }}>{profile.email}</p>
          <span style={roleBadgeStyle}>
            Роль: {profile.role === 'Landlord' ? 'Арендодатель / Гид' : profile.role === 'Admin' ? 'Администратор' : 'Турист / Арендатор'}
          </span>
        </div>
      </div>

      {/* Переключение вкладок */}
      <div style={tabsStyle}>
        <button style={activeTab === 'info' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('info')}>
          👤 Личный кабинет
        </button>
        <button style={activeTab === 'edit' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('edit')}>
          ✏️ Изменение данных
        </button>
        <button style={activeTab === 'security' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('security')}>
          🔒 Настройки и Безопасность
        </button>
      </div>

      {message && <div style={successAlertStyle}>{message}</div>}
      {error && <div style={errorAlertStyle}>{error}</div>}

      {/* Вкладка 1: Личный кабинет */}
      {activeTab === 'info' && (
        <div style={cardContentStyle}>
          <h3>Информация об аккаунте</h3>
          <p><strong>Имя:</strong> {profile.firstName}</p>
          <p><strong>Фамилия:</strong> {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Телефон:</strong> {profile.phoneNumber || 'Не указан'}</p>
          <button onClick={handleLogout} style={logoutButtonStyle}>Выйти из аккаунта</button>
        </div>
      )}

      {/* Вкладка 2: Изменение данных */}
      {activeTab === 'edit' && (
        <form onSubmit={handleUpdateProfile} style={cardContentStyle}>
          <h3>Редактирование профиля</h3>
          <div style={fieldStyle}>
            <label style={labelStyle}>Имя</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Фамилия</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Телефон</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+380..." style={inputStyle} />
          </div>
          <button type="submit" style={saveButtonStyle}>Сохранить изменения</button>
        </form>
      )}

      {/* Вкладка 3: Настройки и Смена пароля */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} style={cardContentStyle}>
          <h3>Смена пароля</h3>
          <div style={fieldStyle}>
            <label style={labelStyle}>Текущий пароль</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Новый пароль</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
          </div>
          <button type="submit" style={saveButtonStyle}>Изменить пароль</button>
        </form>
      )}
    </div>
  );
};

// Стили
const containerStyle: React.CSSProperties = {
  maxWidth: '650px',
  margin: '40px auto',
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '24px',
  paddingBottom: '20px',
  borderBottom: '1px solid #e5e7eb',
};

const avatarContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const avatarStyle: React.CSSProperties = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #2563eb',
};

const uploadButtonStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#2563eb',
  cursor: 'pointer',
  fontWeight: 600,
};

const roleBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '8px',
  padding: '4px 12px',
  backgroundColor: '#eff6ff',
  color: '#2563eb',
  borderRadius: '16px',
  fontSize: '13px',
  fontWeight: 600,
};

const tabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginBottom: '20px',
  borderBottom: '2px solid #f3f4f6',
};

const tabStyle: React.CSSProperties = {
  padding: '10px 16px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#6b7280',
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  color: '#2563eb',
  fontWeight: 600,
  borderBottom: '2px solid #2563eb',
};

const cardContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '15px',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '10px',
};

const logoutButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
  marginTop: '20px',
  alignSelf: 'flex-start',
};

const successAlertStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#ecfdf5',
  color: '#059669',
  borderRadius: '6px',
  marginBottom: '16px',
  fontSize: '14px',
};

const errorAlertStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  borderRadius: '6px',
  marginBottom: '16px',
  fontSize: '14px',
};