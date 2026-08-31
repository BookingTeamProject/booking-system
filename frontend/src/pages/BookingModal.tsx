import React, { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeTitle: string;
  pricePerNight: number;
  location: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, routeTitle, pricePerNight, location }) => {
  const [checkIn, setCheckIn] = useState('2026-09-01');
  const [checkOut, setCheckOut] = useState('2026-09-05');
  const [guests, setGuests] = useState(2);
  const [paymentType, setPaymentType] = useState<'full' | 'part'>('full');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const days = 4; // Расчёт дней
  const totalSum = pricePerNight * days;
  const payNow = paymentType === 'full' ? totalSum : totalSum / 2;

  const handleConfirm = () => {
    // Сохраняем бронирование в историю локального хранилища
    const currentBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    currentBookings.push({
      id: Date.now(),
      title: routeTitle,
      location,
      checkIn,
      checkOut,
      guests,
      totalSum,
      status: 'Підтверджено',
      date: new Date().toLocaleDateString('uk-UA')
    });
    localStorage.setItem('bookings', JSON.stringify(currentBookings));
    
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalBoxStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, color: '#291C0E', fontSize: '20px' }}>Бронювання: {routeTitle}</h3>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#059669', margin: '0 0 8px 0' }}>Бронювання успішно оформлено!</h3>
            <p style={{ color: '#6E473B', fontSize: '14px' }}>Деталі додано у ваш особистий кабінет.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#7a6a5d', fontSize: '13px', margin: '0 0 16px 0' }}>📍 {location} • ₴ {pricePerNight} / доба</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Дата заїзду</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Дата виїзду</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Кількість гостей</label>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} style={inputStyle}>
                <option value={1}>1 гість</option>
                <option value={2}>2 гостя</option>
                <option value={3}>3 гостя</option>
                <option value={4}>4+ гостей</option>
              </select>
            </div>

            {/* Выбор типа оплаты из Figma */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Варіант оплати</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setPaymentType('full')}
                  style={{ ...paymentOptionStyle, borderColor: paymentType === 'full' ? '#DC9666' : '#E1D4C2', backgroundColor: paymentType === 'full' ? '#F4ECE4' : '#fff' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>1 платіж (100%)</div>
                  <div style={{ fontSize: '12px', color: '#6E473B' }}>₴ {totalSum}</div>
                </div>
                <div
                  onClick={() => setPaymentType('part')}
                  style={{ ...paymentOptionStyle, borderColor: paymentType === 'part' ? '#DC9666' : '#E1D4C2', backgroundColor: paymentType === 'part' ? '#F4ECE4' : '#fff' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>2 платежі (50%)</div>
                  <div style={{ fontSize: '12px', color: '#6E473B' }}>₴ {totalSum / 2} зараз</div>
                </div>
              </div>
            </div>

            <div style={priceSummaryBoxStyle}>
              <span>До сплати зараз:</span>
              <strong style={{ fontSize: '20px', color: '#291C0E' }}>₴ {payNow}</strong>
            </div>

            <button onClick={handleConfirm} style={confirmBtnStyle}>Підтвердити та забронювати</button>
          </div>
        )}
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(41,28,14,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #E1D4C2' };
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6E473B' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#6E473B', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #BEB5A9', outline: 'none', fontSize: '13px' };
const paymentOptionStyle: React.CSSProperties = { padding: '12px', borderRadius: '12px', border: '2px solid', cursor: 'pointer', textAlign: 'center' };
const priceSummaryBoxStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: '#F4ECE4', borderRadius: '12px', marginBottom: '18px' };
const confirmBtnStyle: React.CSSProperties = { width: '100%', padding: '14px', backgroundColor: '#DC9666', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' };