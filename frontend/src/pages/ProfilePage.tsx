import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'payments' | 'analytics' | 'settings' | 'security'>('overview');

  // Форма редактирования
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Форма пароля
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);
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
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await api.put('/user/profile', { firstName, lastName, phoneNumber, avatarUrl: profile?.avatarUrl });
      setProfile(response.data);
      setMessage('Дані успішно збережено!');
    } catch (err: any) {
      setError('Помилка оновлення');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/user/change-password', { oldPassword, newPassword });
      setMessage('Пароль успішно змінено!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError('Помилка зміни пароля');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      await api.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchProfile();
      setMessage('Аватар оновлено!');
    } catch (err) {
      setError('Помилка завантаження фото');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!profile) return <div style={{ textAlign: 'center', marginTop: '60px' }}>Завантаження кабінету...</div>;

  const isLandlord = profile.role === 'Landlord' || profile.role === '1';

  return (
    <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 24px 60px 24px', display: 'flex', gap: '30px' }}>
      
      {/* ЛЕВОЕ МЕНЮ (САЙДБАР ИЗ FIGMA) */}
      <div style={sidebarContainerStyle}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F4ECE4', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={profile.avatarUrl ? `http://localhost:5238${profile.avatarUrl}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt="avatar"
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DC9666' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#291C0E' }}>{profile.firstName} {profile.lastName}</div>
            <div style={{ fontSize: '11px', color: '#DC9666', fontWeight: 600 }}>{isLandlord ? 'ОРЕНДОДАВЕЦЬ' : 'ОРЕНДАР'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: '4px' }}>
          <button style={activeTab === 'overview' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('overview')}>
            🏠 Обліковий запис
          </button>
          <button style={activeTab === 'edit' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('edit')}>
            👤 Редагувати профіль
          </button>
          <button style={activeTab === 'payments' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('payments')}>
            💳 Платежі та Картки
          </button>
          <button style={activeTab === 'analytics' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('analytics')}>
            📊 Фінанси та Аналітика
          </button>
          <button style={activeTab === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('settings')}>
            ⚙️ Налаштування
          </button>
          <button style={activeTab === 'security' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('security')}>
            🔒 Безпека
          </button>
          <button style={{ ...sidebarItemStyle, color: '#BA2D2D', marginTop: '16px' }} onClick={handleLogout}>
            🚪 Вийти з акаунту
          </button>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: КОНТЕНТ ВКЛАДОК */}
      <div style={{ flex: 1 }}>
        {message && <div style={successAlertStyle}>{message}</div>}
        {error && <div style={errorAlertStyle}>{error}</div>}

        {/* 1. ОБЛІКОВИЙ ЗАПИС (СВОДКА ИЗ FIGMA) */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#291C0E', marginBottom: '20px' }}>
              Вітаємо, {profile.firstName}!
            </h1>

            {/* Карточка пользователя */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={cardBoxStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '18px' }}>
                  <img
                    src={profile.avatarUrl ? `http://localhost:5238${profile.avatarUrl}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt="user"
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DC9666' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '20px' }}>{profile.firstName} {profile.lastName}</h3>
                      <span style={badgeStyle}>✓ Верифіковано</span>
                    </div>
                    <p style={{ color: '#7a6a5d', margin: '4px 0 0 0', fontSize: '13px' }}>⭐ 4.98 • {isLandlord ? 'Суперхост' : 'Постійний мандрівник'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F4ECE4', paddingTop: '12px' }}>
                  <div><span style={statLabelStyle}>Поїздок:</span> <strong>12 бронювань</strong></div>
                  <div><span style={statLabelStyle}>Реєстрація:</span> <strong>Серпень 2026</strong></div>
                  <div><span style={statLabelStyle}>Статус:</span> <strong style={{ color: '#059669' }}>Активний</strong></div>
                </div>
              </div>

              {/* Контакты */}
              <div style={cardBoxStyle}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Контактні дані</h4>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#6E473B' }}>📞 {profile.phoneNumber || '+380 (67) 123-45-67'}</p>
                <p style={{ margin: '0', fontSize: '13px', color: '#6E473B' }}>✉️ {profile.email}</p>
              </div>
            </div>

            {/* Блок "Поточні броні" */}
            <div style={{ ...cardBoxStyle, marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 14px 0', color: '#291C0E' }}>Поточні та заплановані бронювання</h3>
              {bookings.length === 0 ? (
                <p style={{ color: '#7a6a5d', fontSize: '14px', margin: 0 }}>У вас поки немає активних бронювань. Оберіть будиночок або тур на головній!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bookings.map((b) => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F4ECE4', borderRadius: '12px' }}>
                      <div>
                        <strong>{b.title}</strong>
                        <div style={{ fontSize: '12px', color: '#6E473B' }}>📅 {b.checkIn} — {b.checkOut} • 📍 {b.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 800, color: '#291C0E' }}>₴ {b.totalSum}</span>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{b.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Блок "Збережені маршрути / житло" */}
            <div style={cardBoxStyle}>
              <h3 style={{ fontSize: '18px', margin: '0 0 14px 0', color: '#291C0E' }}>Збережені об'єкти ({favorites.length})</h3>
              {favorites.length === 0 ? (
                <p style={{ color: '#7a6a5d', fontSize: '14px', margin: 0 }}>Немає збережених маршрутів.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                  {favorites.map((f) => (
                    <div key={f.id} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E1D4C2' }}>
                      <img src={f.imageUrls?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80'} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                      <div style={{ padding: '8px' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{f.title}</div>
                        <div style={{ color: '#DC9666', fontWeight: 800, fontSize: '12px' }}>₴ {f.price || '1 490'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. РЕДАГУВАННЯ ПРОФІЛЮ */}
        {activeTab === 'edit' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Редагування профілю</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <img src={profile.avatarUrl ? `http://localhost:5238${profile.avatarUrl}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <label style={uploadPhotoBtnStyle}>
                📷 Завантажити нове фото
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Ім'я</label><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Прізвище</label><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Номер телефону</label><input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+380..." style={inputStyle} /></div>
              <button type="submit" style={primaryBtnStyle}>Зберегти зміни</button>
            </form>
          </div>
        )}

        {/* 3. ПЛАТЕЖІ ТА КАРТКИ */}
        {activeTab === 'payments' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>💳 Платежі та Оплата</h2>
            <p style={{ color: '#6E473B', fontSize: '13px', marginBottom: '20px' }}>Керуйте вашими збереженими картками для швидкого та безпечного бронювання.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={bankCardStyle}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Visa Gold</div>
                <div style={{ fontSize: '18px', fontWeight: 800, margin: '14px 0', letterSpacing: '2px' }}>•••• 5682</div>
                <div style={{ fontSize: '11px' }}>{profile.firstName} {profile.lastName}</div>
              </div>
              <div style={{ ...bankCardStyle, backgroundColor: '#291C0E' }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Mastercard World</div>
                <div style={{ fontSize: '18px', fontWeight: 800, margin: '14px 0', letterSpacing: '2px' }}>•••• 1204</div>
                <div style={{ fontSize: '11px' }}>{profile.firstName} {profile.lastName}</div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Історія транзакцій</h3>
            <div style={{ border: '1px solid #E1D4C2', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={txRowStyle}><span>Бронювання Колиба "Два Потоки" (20 Серп)</span><strong>-14,200 ₴</strong></div>
              <div style={txRowStyle}><span>Апартаменти біля Ратуші (12 Лип)</span><strong>-5,100 ₴</strong></div>
            </div>
          </div>
        )}

        {/* 4. АНАЛІТИКА ТА ФІНАНСИ */}
        {activeTab === 'analytics' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>📊 Фінансова аналітика</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#F4ECE4', borderRadius: '14px' }}>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Загальні витрати</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#291C0E', marginTop: '4px' }}>19,300 ₴</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F4ECE4', borderRadius: '14px' }}>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Накопичена знижка</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#DC9666', marginTop: '4px' }}>7% Gold</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#F4ECE4', borderRadius: '14px' }}>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Бонусний баланс</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>500 ₴</div>
              </div>
            </div>
            <p style={{ color: '#7a6a5d', fontSize: '13px' }}>Звіт сформовано автоматично за період серпень 2026 року.</p>
          </div>
        )}

        {/* 5. НАЛАШТУВАННЯ */}
        {activeTab === 'settings' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>⚙️ Налаштування акаунту</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <label style={switchLabelStyle}><span>Email-сповіщення про бронювання</span><input type="checkbox" defaultChecked /></label>
              <label style={switchLabelStyle}><span>SMS-нагадування за день до заїзду</span><input type="checkbox" defaultChecked /></label>
              <label style={switchLabelStyle}><span>Публічний профіль мандрівника</span><input type="checkbox" defaultChecked /></label>
            </div>
            <div style={{ borderTop: '1px solid #F4ECE4', paddingTop: '16px' }}>
              <h4 style={{ color: '#BA2D2D', margin: '0 0 8px 0' }}>Небезпечна зона</h4>
              <button onClick={() => alert('Запит на видалення акаунту створено')} style={{ padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                🗑️ Видалити мій акаунт
              </button>
            </div>
          </div>
        )}

        {/* 6. БЕЗПЕКА (СМЕНА ПАРОЛЯ) */}
        {activeTab === 'security' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>🔒 Безпека та зміна пароля</h2>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle}>Поточний пароль</label><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={inputStyle} /></div>
              <div style={{ marginBottom: '18px' }}><label style={labelStyle}>Новий пароль</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} /></div>
              <button type="submit" style={primaryBtnStyle}>Оновити пароль</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Стили Сайдбара и компонентов
const sidebarContainerStyle: React.CSSProperties = { width: '280px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E1D4C2', boxShadow: '0 4px 18px rgba(41,28,14,0.04)', height: 'fit-content' };
const sidebarItemStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#6E473B', cursor: 'pointer' };
const activeSidebarItemStyle: React.CSSProperties = { ...sidebarItemStyle, backgroundColor: '#DC9666', color: '#FFFFFF' };
const cardBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E1D4C2', boxShadow: '0 4px 18px rgba(41,28,14,0.04)' };
const badgeStyle: React.CSSProperties = { backgroundColor: '#F4ECE4', color: '#DC9666', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 };
const statLabelStyle: React.CSSProperties = { fontSize: '12px', color: '#A78D78' };
const uploadPhotoBtnStyle: React.CSSProperties = { backgroundColor: '#F4ECE4', color: '#6E473B', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: '1px solid #BEB5A9' };
const primaryBtnStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#6E473B', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #BEB5A9', outline: 'none' };
const bankCardStyle: React.CSSProperties = { background: 'linear-gradient(135deg, #6E473B, #291C0E)', color: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 6px 15px rgba(0,0,0,0.15)' };
const txRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #F4ECE4', fontSize: '13px' };
const switchLabelStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: 600, color: '#291C0E' };
const successAlertStyle: React.CSSProperties = { backgroundColor: '#ECFDF5', color: '#059669', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' };
const errorAlertStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' };