// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { RouteItem, Booking } from '../types';

// Хелпер отображения аватаров
const getAvatarSrc = (url?: string | null): string => {
  if (!url) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = window.location.hostname !== 'localhost' ? 'https://trailsua.pp.ua' : 'http://localhost:5238';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<RouteItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myProperties, setMyProperties] = useState<RouteItem[]>([]);

  // Вкладки
  const [activeTab, setActiveTab] = useState<
    'overview' | 'edit' | 'payments' | 'wallet' | 'host-finance' | 'host-analytics' | 'settings' | 'security'
  >('overview');

  // Модальные окна
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Форма редактирования профиля
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Форма пароля
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Новая карта
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
    loadBookingsAndProperties();
  }, []);

  const fetchProfile = async () => {
    const savedRole = localStorage.getItem('role_override');
    const localUserJson = localStorage.getItem('user');
    const localUser = localUserJson ? JSON.parse(localUserJson) : null;

    try {
      const response = await api.get('/user/me');
      let userData = response.data;
      if (savedRole) {
        userData = { ...userData, role: savedRole };
      }
      // Если на сервере avatarUrl пустой, но в кэше есть сохраненный — сохраняем аватар
      if (!userData.avatarUrl && localUser?.avatarUrl) {
        userData.avatarUrl = localUser.avatarUrl;
      }
      setProfile(userData);
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setPhoneNumber(userData.phoneNumber || '');
      localStorage.setItem('user', JSON.stringify(userData));
      window.dispatchEvent(new Event('user_updated'));
    } catch {
      if (localUser) {
        if (savedRole) localUser.role = savedRole;
        setProfile(localUser);
        setFirstName(localUser.firstName || 'Анастасія');
        setLastName(localUser.lastName || 'Приходько');
        setPhoneNumber(localUser.phoneNumber || '+380 (67) 123-45-67');
      } else {
        const defaultUser = {
          id: '1',
          firstName: 'Анастасія',
          lastName: 'Приходько',
          email: 'anastasia@gmail.com',
          role: savedRole || 'User',
          phoneNumber: '+380 (67) 123-45-67',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80',
        };
        setProfile(defaultUser);
        setFirstName(defaultUser.firstName);
        setLastName(defaultUser.lastName);
        setPhoneNumber(defaultUser.phoneNumber);
      }
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorite');
      if (Array.isArray(res.data)) {
        const mapped = res.data.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          location: r.location,
          price: r.price,
          distanceKm: r.distanceKm,
          durationHours: r.durationHours,
          categoryName: r.category?.name || r.categoryName || 'Помешкання',
          categoryId: r.categoryId,
          authorName: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() : r.authorName,
          averageRating: r.averageRating || 5.0,
          imageUrls: Array.isArray(r.images) && r.images.length > 0
            ? r.images.map((img: any) => (typeof img === 'string' ? img : img.url))
            : r.imageUrls || ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80'],
          createdAt: r.createdAt,
        }));
        setFavorites(mapped);
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  };

  const loadBookingsAndProperties = () => {
    const savedBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(savedBookings);

    const savedCustom: RouteItem[] = JSON.parse(localStorage.getItem('custom_routes') || '[]');
    setMyProperties(savedCustom);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.put('/user/profile', { firstName, lastName, phoneNumber, avatarUrl: profile.avatarUrl });
      const updated = { ...profile, firstName, lastName, phoneNumber };
      setProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('user_updated'));
      setMessage('Дані успішно збережено!');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Помилка оновлення на сервері');
      const updated = { ...profile, firstName, lastName, phoneNumber };
      setProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('user_updated'));
    }
  };

  const handleChangeRole = async (newRole: 'Landlord' | 'User') => {
    const roleNum = newRole === 'Landlord' ? 1 : 0;
    try {
      if (profile?.id) {
        await api.put(`/admin/users/${profile.id}/role`, roleNum);
      }
    } catch {
      try {
        await api.put('/user/profile', { ...profile, role: roleNum });
      } catch (err) {
        console.warn('Серверний апдейт ролі (fallback):', err);
      }
    }

    const updated = { ...profile, role: newRole };
    setProfile(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    localStorage.setItem('role_override', newRole);
    window.dispatchEvent(new Event('user_updated'));
    setIsRoleModalOpen(false);
    setMessage(newRole === 'Landlord' ? '🎉 Вітаємо! Ви успішно стали орендодавцем!' : 'Роль змінено на Орендаря');
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddCardOpen(false);
    setMessage('Картку •••• ' + newCardNumber.slice(-4) + ' успішно додано!');
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvv('');
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
      setError(err?.response?.data?.message || 'Помилка зміни пароля');
      setOldPassword('');
      setNewPassword('');
    }
  };

  // ПОЛНОЦЕННАЯ ЗАГРУЗКА АВАТАРА (BASE64 PREVIEW + MULTIPART API)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      let finalAvatarUrl = base64Url;

      // 1. Отправляем на бэкенд .NET API multipart/form-data
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/user/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.avatarUrl || typeof res.data === 'string') {
          finalAvatarUrl = res.data.avatarUrl || res.data;
        }
      } catch (uploadErr) {
        console.warn('Сервер не зберіг файл на диск, використовуємо локальний аватар:', uploadErr);
      }

      // 2. Обновляем состояние и сохраняем
      const updated = { ...profile, avatarUrl: finalAvatarUrl };
      setProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));

      // 3. Синхронизируем с бэкенд профилем
      try {
        await api.put('/user/profile', {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber,
          avatarUrl: finalAvatarUrl,
        });
      } catch (err) {
        console.warn('Profile sync fallback:', err);
      }

      // 4. Оповещаем Navbar в реальном времени
      window.dispatchEvent(new Event('user_updated'));
      setMessage('Аватар успішно оновлено!');
    };

    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('user_updated'));
    navigate('/login');
  };

  if (!profile) return <div style={{ textAlign: 'center', marginTop: '60px' }}>Завантаження кабінету...</div>;

  const isLandlord = profile.role === 'Landlord' || profile.role === 1 || profile.role === '1';

  return (
    <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 24px 80px 24px', display: 'flex', gap: '30px' }}>
      {/* САЙДБАР */}
      <div style={sidebarContainerStyle}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F4ECE4', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={getAvatarSrc(profile.avatarUrl)}
            alt="avatar"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DC9666' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
            }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#291C0E', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {profile.firstName} {profile.lastName}
            </div>
            <div style={{ fontSize: '11px', color: '#DC9666', fontWeight: 700, marginTop: '2px' }}>
              {isLandlord ? 'ОРЕНДОДАВЕЦЬ (ХОСТ)' : 'ОРЕНДАР (ТУРИСТ)'}
            </div>
          </div>
        </div>

        {/* Список вкладок */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: '4px' }}>
          <button style={activeTab === 'overview' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('overview')}>
            🏠 Обліковий запис
          </button>
          <button style={activeTab === 'edit' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('edit')}>
            👤 Редагувати профіль
          </button>
          <button style={activeTab === 'payments' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('payments')}>
            💳 Платежі та Оплата
          </button>
          <button style={activeTab === 'wallet' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('wallet')}>
            🎁 Гаманець та Привілеї
          </button>

          {/* Вкладки для Орендодавцев */}
          {isLandlord && (
            <>
              <div style={{ padding: '8px 12px 4px 12px', fontSize: '11px', fontWeight: 800, color: '#A78D78', letterSpacing: '0.5px' }}>
                ХОСТ-ПАНЕЛЬ
              </div>
              <button style={activeTab === 'host-finance' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('host-finance')}>
                📈 Фінансова аналітика
              </button>
              <button style={activeTab === 'host-analytics' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('host-analytics')}>
                📊 Аналітика та Ефективність
              </button>
            </>
          )}

          <div style={{ padding: '8px 12px 4px 12px', fontSize: '11px', fontWeight: 800, color: '#A78D78', letterSpacing: '0.5px' }}>
            НАЛАШТУВАННЯ
          </div>
          <button style={activeTab === 'settings' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('settings')}>
            ⚙️ Налаштування профілю
          </button>
          <button style={activeTab === 'security' ? activeSidebarItemStyle : sidebarItemStyle} onClick={() => setActiveTab('security')}>
            🔒 Безпека та Пароль
          </button>

          {!isLandlord ? (
            <button onClick={() => setIsRoleModalOpen(true)} style={becomeHostSidebarBtnStyle}>
              🏡 Стати орендодавцем
            </button>
          ) : (
            <button onClick={() => handleChangeRole('User')} style={switchBackBtnStyle}>
              🎒 Перемкнутись на Орендаря
            </button>
          )}

          <button style={{ ...sidebarItemStyle, color: '#DC2626', marginTop: '12px' }} onClick={handleLogout}>
            🚪 Вийти з акаунту
          </button>
        </div>
      </div>

      {/* КОНТЕНТ ВКЛАДОК */}
      <div style={{ flex: 1 }}>
        {message && <div style={successAlertStyle}>{message}</div>}
        {error && <div style={errorAlertStyle}>{error}</div>}

        {/* 1. ОБЛІКОВИЙ ЗАПИС */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#291C0E', margin: 0 }}>
                  Вітаємо, {profile.firstName}!
                </h1>
                <p style={{ color: '#6E473B', margin: '4px 0 0 0', fontSize: '14px' }}>
                  {isLandlord ? 'Керуйте вашими садибами, бронюваннями та доходами.' : 'Ваші подорожі, обрані маршрути та бонусна програма.'}
                </p>
              </div>

              {isLandlord ? (
                <button onClick={() => navigate('/routes/create')} style={primaryBtnStyle}>
                  ➕ Додати нове житло
                </button>
              ) : (
                <button onClick={() => setIsRoleModalOpen(true)} style={primaryBtnStyle}>
                  🏡 Здати житло в оренду
                </button>
              )}
            </div>

            {/* Карточка пользователя */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={cardBoxStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '18px' }}>
                  <img
                    src={getAvatarSrc(profile.avatarUrl)}
                    alt="user"
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DC9666' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80';
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '19px', color: '#291C0E' }}>
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <span style={badgeStyle}>✓ Верифіковано</span>
                    </div>
                    <p style={{ color: '#6E473B', margin: '4px 0 0 0', fontSize: '13px' }}>
                      ⭐ 4.98 • {isLandlord ? 'Суперхост Карпат' : 'Мандрівник Gold'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F4ECE4', paddingTop: '14px' }}>
                  <div>
                    <span style={statLabelStyle}>{isLandlord ? 'Оголошень:' : 'Поїздок:'}</span>
                    <strong style={{ display: 'block', fontSize: '15px' }}>{isLandlord ? `${myProperties.length} об'єкти` : `${bookings.length} бронювань`}</strong>
                  </div>
                  <div>
                    <span style={statLabelStyle}>Реєстрація:</span>
                    <strong style={{ display: 'block', fontSize: '15px' }}>Серпень 2026</strong>
                  </div>
                  <div>
                    <span style={statLabelStyle}>Статус акаунту:</span>
                    <strong style={{ display: 'block', color: '#059669', fontSize: '15px' }}>Активний</strong>
                  </div>
                </div>
              </div>

              {/* Контакты */}
              <div style={cardBoxStyle}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#291C0E' }}>Контактна інформація</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6E473B' }}>📞 {profile.phoneNumber || '+380 (67) 123-45-67'}</p>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6E473B' }}>✉️ {profile.email}</p>
                <span style={{ fontSize: '12px', color: '#DC9666', fontWeight: 600 }}>🇺🇦 Україна</span>
              </div>
            </div>

            {/* Блок для Орендодавца */}
            {isLandlord && (
              <div style={{ ...cardBoxStyle, marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, color: '#291C0E' }}>Мої зареєстровані помешкання ({myProperties.length})</h3>
                  <button onClick={() => navigate('/routes/create')} style={smallBtnStyle}>
                    + Додати ще
                  </button>
                </div>

                {myProperties.length === 0 ? (
                  <p style={{ color: '#7a6a5d', fontSize: '14px', margin: 0 }}>
                    У вас поки немає доданих помешкань. Створіть ваше перше шале чи глемпінг!
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {myProperties.map((p) => (
                      <div key={p.id} style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E1D4C2', backgroundColor: '#FFFFFF' }}>
                        <img src={p.imageUrls?.[0]} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                        <div style={{ padding: '12px' }}>
                          <strong style={{ fontSize: '14px', color: '#291C0E', display: 'block', marginBottom: '4px' }}>{p.title}</strong>
                          <span style={{ fontSize: '12px', color: '#6E473B' }}>📍 {p.location}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                            <span style={{ color: '#DC9666', fontWeight: 800 }}>₴ {p.price} / доба</span>
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Опубліковано</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Блок: Бронирования */}
            <div style={{ ...cardBoxStyle, marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#291C0E' }}>
                Поточні та заплановані бронювання ({bookings.length})
              </h3>
              {bookings.length === 0 ? (
                <p style={{ color: '#7a6a5d', fontSize: '14px', margin: 0 }}>
                  У вас поки немає активних бронювань. Оберіть затишне шале або тур на головній!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bookings.map((b) => (
                    <div key={b.id} style={bookingRowStyle}>
                      <div>
                        <strong style={{ fontSize: '15px', color: '#291C0E' }}>{b.title}</strong>
                        <div style={{ fontSize: '13px', color: '#6E473B', marginTop: '3px' }}>
                          📅 {b.checkIn} — {b.checkOut} • 📍 {b.location} • 👥 {b.guests} гостей
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '17px', fontWeight: 800, color: '#291C0E' }}>₴ {b.totalSum}</span>
                        <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>✓ {b.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Блок: Избранное */}
            <div style={cardBoxStyle}>
              <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#291C0E' }}>
                Збережені помешкання та тури ({favorites.length})
              </h3>
              {favorites.length === 0 ? (
                <p style={{ color: '#7a6a5d', fontSize: '14px', margin: 0 }}>Поки немає збережених маршрутів чи житла.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      onClick={() => navigate(`/routes/${fav.id}`)}
                      style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E1D4C2', cursor: 'pointer' }}
                    >
                      <img src={fav.imageUrls?.[0]} alt="" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                      <div style={{ padding: '10px' }}>
                        <strong style={{ fontSize: '13px', color: '#291C0E', display: 'block' }}>{fav.title}</strong>
                        <span style={{ color: '#DC9666', fontWeight: 800, fontSize: '13px', marginTop: '4px', display: 'block' }}>
                          ₴ {fav.price} / доба
                        </span>
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
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#291C0E' }}>Редагувати профіль</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
              <img
                src={getAvatarSrc(profile.avatarUrl)}
                alt="avatar"
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DC9666' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80';
                }}
              />
              <label style={uploadPhotoBtnStyle}>
                📷 Змінити фотографію
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </label>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Ім'я</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Прізвище</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Номер телефону</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Email адреса</label>
                <input type="email" value={profile.email} disabled style={{ ...inputStyle, backgroundColor: '#F4ECE4' }} />
              </div>

              <button type="submit" style={primaryBtnStyle}>
                Зберегти зміни
              </button>
            </form>
          </div>
        )}

        {/* 3. ПЛАТЕЖІ */}
        {activeTab === 'payments' && (
          <div style={cardBoxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '22px', color: '#291C0E', margin: 0 }}>💳 Платежі та Оплата</h2>
                <p style={{ color: '#6E473B', fontSize: '13px', margin: '4px 0 0 0' }}>
                  Керуйте збереженими картками для швидкого та безпечного бронювання.
                </p>
              </div>
              <button onClick={() => setIsAddCardOpen(true)} style={primaryBtnStyle}>
                + Додати нову картку
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div style={bankCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>Visa Platinum</span>
                  <span>💳</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, margin: '18px 0', letterSpacing: '2px' }}>•••• 5682</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.85 }}>
                  <span>{profile.firstName} {profile.lastName}</span>
                  <span>08/28</span>
                </div>
              </div>

              <div style={{ ...bankCardStyle, background: 'linear-gradient(135deg, #291C0E, #6E473B)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>Mastercard World</span>
                  <span>💳</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, margin: '18px 0', letterSpacing: '2px' }}>•••• 1204</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.85 }}>
                  <span>{profile.firstName} {profile.lastName}</span>
                  <span>11/27</span>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '17px', marginBottom: '12px', color: '#291C0E' }}>Історія фінансових транзакцій</h3>
            <div style={{ border: '1px solid #E1D4C2', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={txRowStyle}>
                <div>
                  <strong>Бронювання: Еко-садиба «Затишок лісу»</strong>
                  <div style={{ fontSize: '12px', color: '#A78D78' }}>20 Серпня 2026 • Картка •••• 5682</div>
                </div>
                <strong style={{ color: '#DC2626' }}>-9,600 ₴</strong>
              </div>
              <div style={txRowStyle}>
                <div>
                  <strong>Бронювання: Глемпінг-купол на полонині</strong>
                  <div style={{ fontSize: '12px', color: '#A78D78' }}>14 Липня 2026 • Картка •••• 1204</div>
                </div>
                <strong style={{ color: '#DC2626' }}>-6,400 ₴</strong>
              </div>
            </div>
          </div>
        )}

        {/* 4. ГАМАНЕЦЬ */}
        {activeTab === 'wallet' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#291C0E' }}>🎁 Гаманець та Клубні привілеї Trails UA</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
              <div style={statBoxCardStyle}>
                <span style={{ fontSize: '13px', color: '#6E473B', fontWeight: 600 }}>Бонусний баланс</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669', marginTop: '6px' }}>14,250.00 ₴</div>
                <span style={{ fontSize: '11px', color: '#A78D78' }}>Доступно до списання 100%</span>
              </div>
              <div style={statBoxCardStyle}>
                <span style={{ fontSize: '13px', color: '#6E473B', fontWeight: 600 }}>Рівень лояльності</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#DC9666', marginTop: '6px' }}>Gold (7%)</div>
                <span style={{ fontSize: '11px', color: '#A78D78' }}>Автоматична знижка на всі шале</span>
              </div>
              <div style={statBoxCardStyle}>
                <span style={{ fontSize: '13px', color: '#6E473B', fontWeight: 600 }}>Запрошено друзів</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#291C0E', marginTop: '6px' }}>6 мандрівників</div>
                <span style={{ fontSize: '11px', color: '#059669' }}>+3,000 ₴ зароблено</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#F4ECE4', borderRadius: '16px', padding: '22px', border: '1px solid #E1D4C2' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#291C0E' }}>Запроси друга — отримай 500 ₴ на подорож!</h3>
              <p style={{ fontSize: '13px', color: '#6E473B', margin: '0 0 14px 0' }}>
                Поділіться вашим реферальним промокодом з друзями. Вони отримають знижку 500 ₴ на перше бронювання, а ви — 500 ₴ на баланс.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" readOnly value="TRAILS-ANASTASIA-2026" style={{ ...inputStyle, maxWidth: '280px', fontWeight: 700, color: '#DC9666' }} />
                <button onClick={() => alert('Промокод скопійовано в буфер!')} style={smallBtnStyle}>
                  Скопіювати
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. ХОСТ-ФІНАНСИ */}
        {activeTab === 'host-finance' && isLandlord && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#291C0E' }}>📈 Хост-Фінансова аналітика</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              <div style={statBoxCardStyle}>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Загальний дохід</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#291C0E', marginTop: '4px' }}>142,800 ₴</div>
              </div>
              <div style={statBoxCardStyle}>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Цього місяця</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>36,900 ₴</div>
              </div>
              <div style={statBoxCardStyle}>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Середній чек</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#DC9666', marginTop: '4px' }}>7,120 ₴</div>
              </div>
              <div style={statBoxCardStyle}>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Очікує виплати</span>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#291C0E', marginTop: '4px' }}>9,600 ₴</div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Останні виплати за оренду</h3>
            <div style={{ border: '1px solid #E1D4C2', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={txRowStyle}>
                <div><strong>Виплата IBAN: UA82305299...</strong><div style={{ fontSize: '12px', color: '#A78D78' }}>26 Серпня 2026</div></div>
                <strong style={{ color: '#059669' }}>+18,400 ₴</strong>
              </div>
              <div style={txRowStyle}>
                <div><strong>Виплата IBAN: UA82305299...</strong><div style={{ fontSize: '12px', color: '#A78D78' }}>12 Серпня 2026</div></div>
                <strong style={{ color: '#059669' }}>+14,200 ₴</strong>
              </div>
            </div>
          </div>
        )}

        {/* 6. ХОСТ-АНАЛІТИКА */}
        {activeTab === 'host-analytics' && isLandlord && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#291C0E' }}>📊 Хост-Аналітика та Ефективність</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#F4ECE4', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#6E473B', fontWeight: 700 }}>Загальний рейтинг житла</span>
                <div style={{ fontSize: '48px', fontWeight: 800, color: '#DC9666', margin: '8px 0' }}>4.95</div>
                <div style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>⭐⭐⭐⭐⭐ 100% позитивних відгуків</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E1D4C2', padding: '20px', borderRadius: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#291C0E' }}>Завантаженість за місяцями (Календар)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', textAlign: 'center' }}>
                  {['Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень'].map((m, idx) => (
                    <div key={m} style={{ backgroundColor: idx >= 2 && idx <= 3 ? '#DC9666' : '#F4ECE4', color: idx >= 2 && idx <= 3 ? '#fff' : '#291C0E', padding: '10px 4px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>{m}</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, marginTop: '4px' }}>{80 + idx * 3}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. НАЛАШТУВАННЯ */}
        {activeTab === 'settings' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#291C0E' }}>⚙️ Налаштування сповіщень та профілю</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              <label style={switchLabelStyle}><span>Email-сповіщення про нові бронювання</span><input type="checkbox" defaultChecked style={{ accentColor: '#DC9666' }} /></label>
              <label style={switchLabelStyle}><span>SMS-нагадування за добу до заїзду</span><input type="checkbox" defaultChecked style={{ accentColor: '#DC9666' }} /></label>
              <label style={switchLabelStyle}><span>Маркетингові акції та промокоди вихідного дня</span><input type="checkbox" defaultChecked style={{ accentColor: '#DC9666' }} /></label>
            </div>

            <div style={{ borderTop: '1px solid #F4ECE4', paddingTop: '20px' }}>
              <h4 style={{ color: '#DC2626', margin: '0 0 8px 0' }}>Небезпечна зона</h4>
              <button onClick={() => alert('Запит на видалення облікового запису надіслано модераторам.')} style={dangerBtnStyle}>
                🗑️ Видалити мій акаунт
              </button>
            </div>
          </div>
        )}

        {/* 8. БЕЗПЕКА */}
        {activeTab === 'security' && (
          <div style={cardBoxStyle}>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#291C0E' }}>🔒 Безпека та зміна пароля</h2>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Поточний пароль</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Новий пароль</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
              </div>
              <button type="submit" style={primaryBtnStyle}>Оновити пароль</button>
            </form>
          </div>
        )}
      </div>

      {/* МОДАЛКА КАРТКИ */}
      {isAddCardOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsAddCardOpen(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, color: '#291C0E', fontSize: '18px' }}>Додати банківську картку</h3>
              <button onClick={() => setIsAddCardOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddCardSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Номер картки</label>
                <input type="text" placeholder="4149 •••• •••• 5682" maxLength={19} required value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Термін (ММ/РР)</label>
                  <input type="text" placeholder="08/28" maxLength={5} required value={newCardExp} onChange={(e) => setNewCardExp(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CVV / CVC</label>
                  <input type="password" placeholder="•••" maxLength={3} required value={newCardCvv} onChange={(e) => setNewCardCvv(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <button type="submit" style={{ ...primaryBtnStyle, width: '100%' }}>Прив'язати картку</button>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛКА ЗМІНИ РОЛІ */}
      {isRoleModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsRoleModalOpen(false)}>
          <div style={{ ...modalBoxStyle, maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '40px' }}>🏡</span>
              <h3 style={{ margin: '8px 0', fontSize: '22px', color: '#291C0E', fontWeight: 800 }}>
                Станьте господарем та здавайте житло
              </h3>
              <p style={{ color: '#6E473B', fontSize: '13px', lineHeight: 1.5 }}>
                Приєднуйтесь до спільноти хостів Trails UA: публікуйте власні шале, котеджі та авторські маршрути по Україні.
              </p>
            </div>

            <div style={{ backgroundColor: '#F4ECE4', padding: '16px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px', color: '#291C0E' }}>
              <div style={{ marginBottom: '6px' }}>✓ Безкоштовне розміщення до 10 об'єктів</div>
              <div style={{ marginBottom: '6px' }}>✓ Страхування житла до 100,000 ₴</div>
              <div>✓ Доступ до фінансової хост-аналітики</div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleChangeRole('Landlord')} style={{ ...primaryBtnStyle, flex: 1 }}>
                Підтвердити: Стати орендодавцем
              </button>
              <button onClick={() => setIsRoleModalOpen(false)} style={secondaryBtnStyle}>
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Стили
const sidebarContainerStyle: React.CSSProperties = {
  width: '280px',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 18px rgba(41,28,14,0.04)',
  height: 'fit-content',
};
const sidebarItemStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: 'none',
  background: 'none',
  textAlign: 'left',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#6E473B',
  cursor: 'pointer',
};
const activeSidebarItemStyle: React.CSSProperties = {
  ...sidebarItemStyle,
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
};
const becomeHostSidebarBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  backgroundColor: '#F4ECE4',
  border: '1px solid #DC9666',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 700,
  color: '#DC9666',
  cursor: 'pointer',
  marginTop: '8px',
};
const switchBackBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  backgroundColor: '#FAF5EE',
  border: '1px dashed #A78D78',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#6E473B',
  cursor: 'pointer',
  marginTop: '8px',
};
const cardBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '28px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 18px rgba(41,28,14,0.04)',
};
const badgeStyle: React.CSSProperties = {
  backgroundColor: '#ECFDF5',
  color: '#059669',
  padding: '3px 8px',
  borderRadius: '10px',
  fontSize: '11px',
  fontWeight: 700,
};
const statLabelStyle: React.CSSProperties = { fontSize: '12px', color: '#A78D78' };
const statBoxCardStyle: React.CSSProperties = {
  backgroundColor: '#F4ECE4',
  padding: '18px',
  borderRadius: '16px',
  border: '1px solid #E1D4C2',
};
const uploadPhotoBtnStyle: React.CSSProperties = {
  backgroundColor: '#F4ECE4',
  color: '#6E473B',
  padding: '8px 16px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  border: '1px solid #BEB5A9',
};
const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  border: 'none',
  padding: '11px 22px',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
  boxShadow: '0 3px 10px rgba(220, 150, 102, 0.3)',
};
const secondaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  color: '#6E473B',
  border: '1px solid #BEB5A9',
  padding: '11px 20px',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
};
const smallBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};
const dangerBtnStyle: React.CSSProperties = {
  padding: '9px 18px',
  backgroundColor: '#FEE2E2',
  color: '#DC2626',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: '#6E473B',
  marginBottom: '5px',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #BEB5A9',
  outline: 'none',
  fontSize: '13px',
};
const bankCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6E473B, #DC9666)',
  color: '#FFFFFF',
  padding: '22px',
  borderRadius: '18px',
  boxShadow: '0 8px 20px rgba(41,28,14,0.15)',
};
const bookingRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  backgroundColor: '#F4ECE4',
  borderRadius: '14px',
  border: '1px solid #E1D4C2',
};
const txRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  borderBottom: '1px solid #F4ECE4',
  fontSize: '13px',
};
const switchLabelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: 600,
  color: '#291C0E',
};
const successAlertStyle: React.CSSProperties = {
  backgroundColor: '#ECFDF5',
  color: '#059669',
  padding: '12px',
  borderRadius: '10px',
  marginBottom: '16px',
  fontSize: '13px',
  fontWeight: 600,
};
const errorAlertStyle: React.CSSProperties = {
  backgroundColor: '#FEE2E2',
  color: '#DC2626',
  padding: '12px',
  borderRadius: '10px',
  marginBottom: '16px',
  fontSize: '13px',
  fontWeight: 600,
};
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(41, 28, 14, 0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};
const modalBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '32px',
  maxWidth: '460px',
  width: '100%',
  boxShadow: '0 20px 40px rgba(41, 28, 14, 0.25)',
  border: '1px solid #E1D4C2',
};