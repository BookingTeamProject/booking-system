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
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'security'>('view');

  // Редактирование
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Пароль
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/me');
      setProfile(response.data);
      setFirstName(response.data.firstName || '');
      setLastName(response.data.lastName || '');
      setPhoneNumber(response.data.phoneNumber || '');
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorite');
      setFavorites(res.data);
    } catch (e) {
      console.error(e);
    }
  };

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
      setMessage('Дані успішно збережено!');
      setActiveTab('view');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка оновлення');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/user/change-password', { oldPassword, newPassword });
      setMessage('Пароль успішно змінено!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка зміни пароля');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProfile();
      setMessage('Аватар оновлено!');
    } catch (err: any) {
      setError('Помилка завантаження фото');
    }
  };

  if (!profile) return <div style={{ textAlign: 'center', marginTop: '60px' }}>Завантаження кабінету...</div>;

  const isLandlord = profile.role === 'Landlord' || profile.role === '1';

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px 60px 20px' }}>
      
      {/* Заголовок */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#291C0E', fontWeight: 800, margin: 0 }}>
            {isLandlord ? 'Обліковий запис орендодавець' : 'Обліковий запис орендар'}
          </h1>
          <p style={{ color: '#6E473B', margin: '4px 0 0 0', fontSize: '14px' }}>
            Вітаємо, <strong>{profile.firstName}!</strong> Керуйте вашими подорожами та налаштуваннями.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab(activeTab === 'view' ? 'edit' : 'view')} style={outlineBtnStyle}>
            {activeTab === 'view' ? '✏️ Редагувати профіль' : '👁️ Перегляд'}
          </button>
          <button onClick={() => setActiveTab(activeTab === 'security' ? 'view' : 'security')} style={dangerBtnStyle}>
            🔒 Безпека
          </button>
        </div>
      </div>

      {message && <div style={successAlertStyle}>{message}</div>}
      {error && <div style={errorAlertStyle}>{error}</div>}

      {/* Редактирование */}
      {activeTab === 'edit' && (
        <div style={cardBoxStyle}>
          <h3 style={{ marginBottom: '16px', color: '#291C0E' }}>Редагування персональних даних</h3>
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Ім'я</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Прізвище</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Номер телефону</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+380..." style={inputStyle} />
            </div>
            <button type="submit" style={primaryBtnStyle}>Зберегти зміни</button>
          </form>
        </div>
      )}

      {/* Смена пароля */}
      {activeTab === 'security' && (
        <div style={cardBoxStyle}>
          <h3 style={{ marginBottom: '16px', color: '#291C0E' }}>Зміна пароля</h3>
          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Поточний пароль</label>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Новий пароль</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
            </div>
            <button type="submit" style={primaryBtnStyle}>Оновити пароль</button>
          </form>
        </div>
      )}

      {/* ОСНОВНОЙ ВИД (FIGMA) */}
      {activeTab === 'view' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
            <div style={cardBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={profile.avatarUrl ? `http://localhost:5238${profile.avatarUrl}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt="User"
                    style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #DC9666' }}
                  />
                  <label style={avatarUploadBadgeStyle} title="Змінити фото">
                    📷
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '22px', color: '#291C0E' }}>{profile.firstName} {profile.lastName}</h2>
                    <span style={verifiedBadgeStyle}>✓ Верифікований</span>
                  </div>
                  <div style={{ marginTop: '6px', color: '#6E473B', fontSize: '14px' }}>
                    ⭐ <strong>4.92</strong> (12 відгуків)
                  </div>
                </div>
              </div>

              <div style={statsRowStyle}>
                <div>
                  <div style={statsLabelStyle}>{isLandlord ? 'Оголошень' : 'Загалом поїздок'}</div>
                  <div style={statsValueStyle}>{isLandlord ? '6 активних об\'єктів' : '18 бронювань'}</div>
                </div>
                <div>
                  <div style={statsLabelStyle}>Дата реєстрації</div>
                  <div style={statsValueStyle}>Серпень 2026</div>
                </div>
                <div>
                  <div style={statsLabelStyle}>Рейтинг</div>
                  <div style={{ ...statsValueStyle, color: '#059669' }}>{isLandlord ? 'Суперхост' : 'Добрий орендар'}</div>
                </div>
              </div>
            </div>

            <div style={cardBoxStyle}>
              <h3 style={{ fontSize: '17px', margin: '0 0 14px 0', color: '#291C0E' }}>Як зв'язатись зі мною?</h3>
              <div style={{ marginBottom: '10px' }}>
                <div style={statsLabelStyle}>Номер телефону</div>
                <div style={contactValueStyle}>{profile.phoneNumber || '+380 (67) 123-45-67'}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={statsLabelStyle}>Email</div>
                <div style={contactValueStyle}>{profile.email}</div>
              </div>
              <div>
                <div style={statsLabelStyle}>Опис</div>
                <div style={{ fontSize: '13px', color: '#6E473B' }}>Завжди на зв'язку для класних подорожей!</div>
              </div>
            </div>
          </div>

          {/* Сохранённые маршруты */}
          <div style={{ ...cardBoxStyle, marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', margin: 0, color: '#291C0E' }}>Збережені помешкання та маршрути</h3>
              <span style={{ color: '#DC9666', fontSize: '14px', fontWeight: 700 }}>Усі збережені ({favorites.length})</span>
            </div>

            {favorites.length === 0 ? (
              <p style={{ color: '#6E473B', fontSize: '14px' }}>У вас ще немає збережених маршрутів.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {favorites.map((fav) => (
                  <div key={fav.id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E1D4C2' }}>
                    <img src={fav.imageUrls?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80'} alt={fav.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#291C0E' }}>{fav.title}</div>
                      <div style={{ color: '#6E473B', fontSize: '12px' }}>📍 {fav.location}</div>
                      <div style={{ color: '#DC9666', fontWeight: 800, fontSize: '13px', marginTop: '4px' }}>{fav.price ? `₴ ${fav.price}` : 'Безкоштовно'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const cardBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 18px rgba(41,28,14,0.04)', border: '1px solid #E1D4C2' };
const verifiedBadgeStyle: React.CSSProperties = { backgroundColor: '#F4ECE4', color: '#DC9666', border: '1px solid #E1D4C2', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' };
const statsRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F4ECE4', paddingTop: '16px' };
const statsLabelStyle: React.CSSProperties = { fontSize: '12px', color: '#A78D78' };
const statsValueStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 700, color: '#291C0E', marginTop: '2px' };
const contactValueStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 700, color: '#291C0E', wordBreak: 'break-all' };
const outlineBtnStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', border: '1px solid #BEB5A9', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#291C0E' };
const dangerBtnStyle: React.CSSProperties = { backgroundColor: '#BA2D2D', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' };
const primaryBtnStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', color: '#6E473B', marginBottom: '6px', fontWeight: 600 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #BEB5A9', outline: 'none' };
const avatarUploadBadgeStyle: React.CSSProperties = { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: '50%', padding: '4px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', fontSize: '14px' };
const successAlertStyle: React.CSSProperties = { backgroundColor: '#ECFDF5', color: '#059669', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' };
const errorAlertStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' };