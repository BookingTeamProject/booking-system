// src/pages/HostAccommodationsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage, type HostBookingRequest } from '../services/storage.service';
import { MOCK_HOST_REQUESTS } from '../data/mockData';
import type { RouteItem } from '../types';

export const HostAccommodationsPage: React.FC = () => {
  const { isLandlord } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'properties' | 'current' | 'history' | 'blacklist' | 'calendar'>('properties');
  const [properties, setProperties] = useState<RouteItem[]>(() => storage.routes.getCustom());
  const [blacklist, setBlacklist] = useState(() => storage.blacklist.get());
  const [requests, setRequests] = useState<HostBookingRequest[]>(() => MOCK_HOST_REQUESTS);

  // Модалка черного списка
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [blName, setBlName] = useState('');
  const [blEmail, setBlEmail] = useState('');
  const [blReason, setBlReason] = useState('');

  const handleAccept = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r)));
    alert('✅ Заявку на бронювання прийнято! Гостю надіслано підтвердження.');
  };

  const handleDecline = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)));
    alert('❌ Заявку відхилено.');
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blName || !blEmail) return;
    const updated = storage.blacklist.add({ name: blName, email: blEmail, reason: blReason });
    setBlacklist(updated);
    setIsBlacklistModalOpen(false);
    setBlName('');
    setBlEmail('');
    setBlReason('');
    alert('Гостя додано до чорного списку.');
  };

  const handleRemoveBlacklist = (id: string) => {
    const updated = storage.blacklist.remove(id);
    setBlacklist(updated);
  };

  if (!isLandlord) {
    return (
      <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={emptyCardWrapperStyle}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>🏡</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#291C0E', margin: '0 0 10px 0' }}>
            У вас ще немає зареєстрованих помешкань
          </h2>
          <p style={{ color: '#6E473B', fontSize: '15px', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            Станьте господарем на Trails UA: здавайте затишні шале, глемпінги або створюйте авторські гірські тури.
          </p>
          <button onClick={() => navigate('/routes/create')} style={primaryCtaBtnStyle}>
            🏠 Зареєструвати своє перше помешкання
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 24px 80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#291C0E', margin: 0 }}>
            Керування помешканням
          </h1>
          <p style={{ color: '#6E473B', margin: '4px 0 0 0', fontSize: '14px' }}>
            Управління вашими об'єктами, заявками гостей, календарем та чорним списком.
          </p>
        </div>

        <button onClick={() => navigate('/routes/create')} style={primaryCtaBtnStyle}>
          ➕ Додати нове помешкання
        </button>
      </div>

      {/* Вкладки */}
      <div style={tabsBarStyle}>
        <button style={tab === 'properties' ? activeTabBtnStyle : tabBtnStyle} onClick={() => setTab('properties')}>
          Мої помешкання ({properties.length})
        </button>
        <button style={tab === 'current' ? activeTabBtnStyle : tabBtnStyle} onClick={() => setTab('current')}>
          Поточні броні
        </button>
        <button style={tab === 'history' ? activeTabBtnStyle : tabBtnStyle} onClick={() => setTab('history')}>
          Історія бронювань
        </button>
        <button style={tab === 'blacklist' ? activeTabBtnStyle : tabBtnStyle} onClick={() => setTab('blacklist')}>
          Чорний список ({blacklist.length})
        </button>
        <button style={tab === 'calendar' ? activeTabBtnStyle : tabBtnStyle} onClick={() => setTab('calendar')}>
          Календар помешкань
        </button>
      </div>

      {/* 1. МОЇ ПОМЕШКАННЯ ТА ЗАЯВКИ */}
      {tab === 'properties' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px', marginBottom: '40px' }}>
            {properties.map((p) => (
              <div key={p.id} style={propertyCardStyle}>
                <div style={{ height: '180px', position: 'relative' }}>
                  <img src={p.imageUrls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={activeStatusBadgeStyle}>● Активне</span>
                </div>

                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#291C0E', margin: '0 0 6px 0' }}>{p.title}</h3>
                    <p style={{ fontSize: '13px', color: '#6E473B', margin: '0 0 12px 0' }}>📍 {p.location}</p>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#DC9666', marginBottom: '14px' }}>
                      ₴ {p.price} <span style={{ fontSize: '12px', fontWeight: 400, color: '#6E473B' }}>/ доба</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F4ECE4', paddingTop: '12px' }}>
                    <button onClick={() => navigate(`/routes/${p.id}`)} style={propertyActionBtnStyle}>
                      👁️ Переглянути
                    </button>
                    <button onClick={() => setTab('calendar')} style={propertyActionBtnStyle}>
                      📅 Календар
                    </button>
                    <button
                      onClick={() => {
                        const updated = storage.routes.removeCustom(p.id);
                        setProperties(updated);
                      }}
                      style={{ ...propertyActionBtnStyle, color: '#DC2626' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Заявки на бронювання */}
          <div style={requestsBoxStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E', margin: '0 0 16px 0' }}>
              Заявки на бронювання (Очікують підтвердження)
            </h3>

            {requests.filter((r) => r.status === 'pending').length === 0 ? (
              <p style={{ color: '#6E473B', fontSize: '14px', margin: 0 }}>Немає нових заявок, що очікують підтвердження.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {requests
                  .filter((r) => r.status === 'pending')
                  .map((req) => (
                    <div key={req.id} style={requestRowStyle}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '15px', color: '#291C0E' }}>{req.guestName}</strong>
                          <span style={{ fontSize: '11px', color: '#A78D78' }}>• {req.createdAt}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#6E473B', marginTop: '3px' }}>
                          🏡 {req.propertyTitle} | 📅 {req.dates} | 👥 {req.guestsCount} гостей
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <strong style={{ fontSize: '17px', color: '#291C0E' }}>₴ {req.totalSum}</strong>
                        <button onClick={() => handleAccept(req.id)} style={acceptBtnStyle}>
                          Прийняти
                        </button>
                        <button onClick={() => handleDecline(req.id)} style={declineBtnStyle}>
                          Відхилити
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ПОТОЧНІ БРОНІ */}
      {tab === 'current' && (
        <div style={whiteCardBoxStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 18px 0', color: '#291C0E' }}>Поточні заселення гостей</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={bookingItemStyle}>
              <div>
                <strong style={{ fontSize: '15px' }}>Котедж 'Nordic Forest'</strong>
                <div style={{ fontSize: '13px', color: '#6E473B', marginTop: '4px' }}>
                  👤 Гість: Роман Грицак • 📅 01 Вер — 06 Вер 2026 • 👥 2 гостей
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>₴ 14,200</span>
                <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>Проживають зараз</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ІСТОРІЯ БРОНЮВАНЬ */}
      {tab === 'history' && (
        <div style={whiteCardBoxStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 18px 0', color: '#291C0E' }}>Історія завершених заїздів</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={bookingItemStyle}>
              <div>
                <strong style={{ fontSize: '15px' }}>Шале 'Карпатська Тиша'</strong>
                <div style={{ fontSize: '13px', color: '#6E473B', marginTop: '4px' }}>
                  👤 Гість: Марія Шевченко • 📅 12 Лип — 18 Лип 2026
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E' }}>₴ 12,000</span>
                <div style={{ fontSize: '12px', color: '#A78D78' }}>Успішно завершено</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ЧОРНИЙ СПИСОК */}
      {tab === 'blacklist' && (
        <div style={whiteCardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#291C0E' }}>Чорний список гостей</h3>
              <p style={{ color: '#6E473B', fontSize: '13px', margin: '4px 0 0 0' }}>
                Користувачі з цього списку не зможуть бронювати ваші об'єкти.
              </p>
            </div>
            <button onClick={() => setIsBlacklistModalOpen(true)} style={dangerActionBtnStyle}>
              ➕ Додати до чорного списку
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blacklist.map((item) => (
              <div key={item.id} style={blacklistRowStyle}>
                <div>
                  <strong style={{ fontSize: '15px', color: '#291C0E' }}>{item.name}</strong>
                  <span style={{ fontSize: '13px', color: '#6E473B', marginLeft: '8px' }}>({item.email})</span>
                  <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>⚠️ Причина: {item.reason}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#A78D78' }}>{item.date}</span>
                  <button onClick={() => handleRemoveBlacklist(item.id)} style={unblockBtnStyle}>
                    Розблокувати
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. КАЛЕНДАР */}
      {tab === 'calendar' && (
        <div style={whiteCardBoxStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', color: '#291C0E' }}>Календар завантаженості та цін</h3>
          <p style={{ color: '#6E473B', fontSize: '13px', marginBottom: '24px' }}>
            Оберіть дні, щоб заблокувати їх або змінити базову ціну.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div style={{ backgroundColor: '#FAF5EE', padding: '24px', borderRadius: '18px', border: '1px solid #E1D4C2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 700 }}>
                <span>Вересень 2026</span>
                <span>‹ Попередній | Наступний ›</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d) => (
                  <strong key={d} style={{ fontSize: '12px', color: '#6E473B' }}>{d}</strong>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isBusy = day >= 12 && day <= 16;
                  return (
                    <div
                      key={day}
                      style={{
                        padding: '12px 4px',
                        borderRadius: '10px',
                        backgroundColor: isBusy ? '#DC9666' : '#FFFFFF',
                        color: isBusy ? '#FFFFFF' : '#291C0E',
                        fontWeight: 700,
                        fontSize: '13px',
                        border: '1px solid #E1D4C2',
                        cursor: 'pointer',
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={infoCardBoxStyle}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Встановлення ціни на вихідні</h4>
                <input type="number" defaultValue={2800} style={calendarInputStyle} />
                <button onClick={() => alert('Ціни збережено')} style={primarySmallBtnStyle}>
                  Зберегти тариф
                </button>
              </div>

              <div style={{ ...infoCardBoxStyle, borderLeft: '4px solid #DC2626' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#DC2626' }}>Заблокувати обрані дати</h4>
                <p style={{ fontSize: '12px', color: '#6E473B', margin: '0 0 10px 0' }}>Дати стануть недоступними для туристів.</p>
                <button onClick={() => alert('Дати заблоковано')} style={dangerSmallBtnStyle}>
                  Заблокувати дні
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА ЧОРНОГО СПИСКУ */}
      {isBlacklistModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsBlacklistModalOpen(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0', color: '#291C0E' }}>
              Додати до чорного списку
            </h3>
            <form onSubmit={handleAddBlacklist} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" required placeholder="ПІБ гостя..." value={blName} onChange={(e) => setBlName(e.target.value)} style={calendarInputStyle} />
              <input type="email" required placeholder="Email гостя..." value={blEmail} onChange={(e) => setBlEmail(e.target.value)} style={calendarInputStyle} />
              <textarea rows={3} placeholder="Причина блокування..." value={blReason} onChange={(e) => setBlReason(e.target.value)} style={calendarInputStyle} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={dangerActionBtnStyle}>Заблокувати</button>
                <button type="button" onClick={() => setIsBlacklistModalOpen(false)} style={cancelBtnStyle}>Скасувати</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Стили
const tabsBarStyle: React.CSSProperties = { display: 'flex', gap: '8px', borderBottom: '2px solid #E1D4C2', paddingBottom: '10px', marginBottom: '28px', overflowX: 'auto' };
const tabBtnStyle: React.CSSProperties = { padding: '10px 18px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 600, color: '#6E473B', cursor: 'pointer', borderRadius: '10px' };
const activeTabBtnStyle: React.CSSProperties = { ...tabBtnStyle, backgroundColor: '#DC9666', color: '#FFFFFF', fontWeight: 700 };
const propertyCardStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E1D4C2', boxShadow: '0 4px 16px rgba(41,28,14,0.04)', display: 'flex', flexDirection: 'column' };
const activeStatusBadgeStyle: React.CSSProperties = { position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(5, 150, 105, 0.9)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700 };
const propertyActionBtnStyle: React.CSSProperties = { flex: 1, padding: '8px 4px', border: '1px solid #E1D4C2', backgroundColor: '#FAF5EE', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' };
const requestsBoxStyle: React.CSSProperties = { backgroundColor: '#F4ECE4', borderRadius: '20px', padding: '24px', border: '1px solid #E1D4C2' };
const requestRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E1D4C2' };
const acceptBtnStyle: React.CSSProperties = { backgroundColor: '#059669', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' };
const declineBtnStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' };
const whiteCardBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '22px', padding: '28px', border: '1px solid #E1D4C2', boxShadow: '0 4px 18px rgba(41,28,14,0.04)' };
const bookingItemStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#FAF5EE', borderRadius: '12px', border: '1px solid #E1D4C2' };
const blacklistRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #F4ECE4' };
const unblockBtnStyle: React.CSSProperties = { backgroundColor: '#F4ECE4', border: '1px solid #BEB5A9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' };
const dangerActionBtnStyle: React.CSSProperties = { backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' };
const cancelBtnStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', border: '1px solid #BEB5A9', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' };
const infoCardBoxStyle: React.CSSProperties = { backgroundColor: '#FAF5EE', padding: '16px', borderRadius: '14px', border: '1px solid #E1D4C2' };
const calendarInputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #BEB5A9', outline: 'none', fontSize: '13px', marginBottom: '8px' };
const primarySmallBtnStyle: React.CSSProperties = { width: '100%', backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' };
const dangerSmallBtnStyle: React.CSSProperties = { width: '100%', backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' };
const primaryCtaBtnStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', padding: '11px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' };
const emptyCardWrapperStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '60px 30px', border: '2px dashed #DC9666' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(41,28,14,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', maxWidth: '440px', width: '100%', border: '1px solid #E1D4C2' };