// src/pages/TenantBookingsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage.service';
import type { Booking } from '../types';

export const TenantBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'current' | 'history'>('current');
  const [bookings, setBookings] = useState<Booking[]>(() => storage.bookings.get());

  // Модалка деталей
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  // Модалка отмены
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Мої плани змінилися');

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    const updated = storage.bookings.cancel(cancelTarget.id, cancelReason);
    setBookings(updated);
    setCancelTarget(null);
    setSelectedBooking(null);
    alert('Бронювання успішно скасовано.');
  };

  const currentBookings = bookings.filter((b) => b.status !== 'Скасовано');
  const historyBookings = bookings.filter((b) => b.status === 'Скасовано' || b.status === 'Завершено');

  return (
    <div style={{ maxWidth: '1380px', margin: '30px auto', padding: '0 24px 80px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#291C0E', marginBottom: '20px' }}>
        📅 Мої Бронювання
      </h1>

      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #E1D4C2', paddingBottom: '10px', marginBottom: '28px' }}>
        <button
          style={tab === 'current' ? activeTabStyle : tabStyle}
          onClick={() => setTab('current')}
        >
          Поточні броні ({currentBookings.length})
        </button>
        <button
          style={tab === 'history' ? activeTabStyle : tabStyle}
          onClick={() => setTab('history')}
        >
          Історія бронювань ({historyBookings.length})
        </button>
      </div>

      {/* Список бронирований */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(tab === 'current' ? currentBookings : historyBookings).map((b) => (
          <div key={b.id} style={bookingCardItemStyle}>
            <div style={{ width: '180px', height: '120px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={b.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80'}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, padding: '0 20px' }}>
              <span style={b.status === 'Скасовано' ? statusCancelledBadgeStyle : statusConfirmedBadgeStyle}>
                ● {b.status}
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#291C0E', margin: '6px 0 4px 0' }}>{b.title}</h3>
              <p style={{ fontSize: '13px', color: '#6E473B', margin: '0 0 8px 0' }}>📍 {b.location}</p>
              <div style={{ fontSize: '13px', color: '#A78D78' }}>
                📅 {b.checkIn} — {b.checkOut} • 👥 {b.guests} гостей
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E' }}>₴ {b.totalSum}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setSelectedBooking(b)} style={viewDetailsActionBtnStyle}>
                  Деталі бронювання
                </button>
                {b.status !== 'Скасовано' && (
                  <button onClick={() => setCancelTarget(b)} style={cancelActionBtnStyle}>
                    Скасувати
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* МОДАЛКА: ДЕТАЛІ БРОНЮВАННЯ */}
      {selectedBooking && (
        <div style={modalOverlayStyle} onClick={() => setSelectedBooking(null)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: 0 }}>Деталі бронювання</h2>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={selectedBooking.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E', margin: '0 0 6px 0' }}>{selectedBooking.title}</h3>
            <p style={{ fontSize: '13px', color: '#6E473B', margin: '0 0 16px 0' }}>📍 {selectedBooking.location}</p>

            <div style={{ backgroundColor: '#FAF5EE', padding: '16px', borderRadius: '14px', marginBottom: '16px', border: '1px solid #E1D4C2', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Код підтвердження:</span>
                <strong style={{ letterSpacing: '1px' }}>HM8W29PZ</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Дати перебування:</span>
                <strong>{selectedBooking.checkIn} — {selectedBooking.checkOut}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E1D4C2', paddingTop: '8px', fontSize: '15px' }}>
                <strong>Всього сплачено:</strong>
                <strong style={{ color: '#059669' }}>₴ {selectedBooking.totalSum}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setSelectedBooking(null); navigate('/messages'); }} style={primaryModalBtnStyle}>
                💬 Зв'язатись з господарем
              </button>
              {selectedBooking.status !== 'Скасовано' && (
                <button onClick={() => { setCancelTarget(selectedBooking); setSelectedBooking(null); }} style={dangerModalBtnStyle}>
                  Скасувати бронь
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА: СКАСУВАННЯ */}
      {cancelTarget && (
        <div style={modalOverlayStyle} onClick={() => setCancelTarget(null)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: '0 0 10px 0' }}>
              Скасувати бронювання
            </h2>
            <div style={{ backgroundColor: '#FEE2E2', padding: '12px 16px', borderRadius: '12px', fontSize: '12px', color: '#DC2626', marginBottom: '16px' }}>
              ⚠️ Безкоштовне скасування можливе за 48 годин до заїзду. Кошти повертаються на картку протягом 3 днів.
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Оберіть причину скасування:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {[
                'Мої плани змінилися',
                'Непередбачувані обставини / Хвороба',
                'Знайшов(-ла) інший варіант проживання',
                'Забронював(-ла) помилково',
                'Інша причина',
              ].map((r) => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', padding: '8px', borderRadius: '8px', backgroundColor: cancelReason === r ? '#FAF5EE' : '#FFFFFF', border: '1px solid #E1D4C2' }}>
                  <input type="radio" name="cancel_r" checked={cancelReason === r} onChange={() => setCancelReason(r)} style={{ accentColor: '#DC9666' }} />
                  {r}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleConfirmCancel} style={dangerModalBtnStyle}>
                Підтвердити скасування
              </button>
              <button onClick={() => setCancelTarget(null)} style={cancelModalBtnStyle}>
                Повернутись назад
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const tabStyle: React.CSSProperties = { padding: '10px 18px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 600, color: '#6E473B', cursor: 'pointer', borderRadius: '10px' };
const activeTabStyle: React.CSSProperties = { ...tabStyle, backgroundColor: '#DC9666', color: '#FFFFFF', fontWeight: 700 };
const bookingCardItemStyle: React.CSSProperties = { display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E1D4C2', boxShadow: '0 4px 16px rgba(41,28,14,0.04)' };
const statusConfirmedBadgeStyle: React.CSSProperties = { color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 };
const statusCancelledBadgeStyle: React.CSSProperties = { color: '#DC2626', backgroundColor: '#FEE2E2', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 };
const viewDetailsActionBtnStyle: React.CSSProperties = { backgroundColor: '#FAF5EE', border: '1px solid #BEB5A9', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' };
const cancelActionBtnStyle: React.CSSProperties = { backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(41,28,14,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', maxWidth: '500px', width: '100%', border: '1px solid #E1D4C2' };
const primaryModalBtnStyle: React.CSSProperties = { flex: 1, backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' };
const dangerModalBtnStyle: React.CSSProperties = { flex: 1, backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' };
const cancelModalBtnStyle: React.CSSProperties = { flex: 1, backgroundColor: '#FFFFFF', border: '1px solid #BEB5A9', padding: '12px', borderRadius: '12px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' };