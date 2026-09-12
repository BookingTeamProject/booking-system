// src/components/BookingModal.tsx
import React, { useState, useEffect, useMemo } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeTitle: string;
  pricePerNight: number;
  location: string;
  // Нові пропси для передачі даних з бокової панелі
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  routeTitle,
  pricePerNight,
  location,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [paymentType, setPaymentType] = useState<'full' | 'part'>('full');
  const [isSuccess, setIsSuccess] = useState(false);

  // Коли модалка відкривається, підтягуємо сюди те, що користувач обрав на сторінці
  useEffect(() => {
    if (isOpen) {
      if (initialCheckIn) setCheckIn(initialCheckIn);
      if (initialCheckOut) setCheckOut(initialCheckOut);
      if (initialGuests) setGuests(initialGuests);
      setPaymentType('full');
      setIsSuccess(false);
    }
  }, [isOpen, initialCheckIn, initialCheckOut, initialGuests]);

  // Рахуємо реальні дні та гроші
  const { totalSum, payNow } = useMemo(() => {
    let diffDays = 0;
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    }
    
    const nights = diffDays > 0 ? diffDays : 0;
    let sum = pricePerNight; // Якщо дати не обрані, показуємо хоча б базову ціну за ніч
    
    if (nights > 0) {
      const accommodationTotal = pricePerNight * nights;
      const cleaningFee = 300;
      const serviceFee = 150;
      sum = accommodationTotal + cleaningFee + serviceFee;
    }

    const toPay = paymentType === 'full' ? sum : Math.round(sum / 2);
    
    return { totalSum: sum, payNow: toPay };
  }, [checkIn, checkOut, pricePerNight, paymentType]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Зберігаємо РЕАЛЬНІ дані в історію браузера (поки без бекенду)
    const currentBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    currentBookings.unshift({
      id: Date.now(),
      title: routeTitle,
      location,
      checkIn,
      checkOut,
      guests,
      totalSum,
      paidAmount: payNow,
      paymentType,
      status: 'Підтверджено',
      date: new Date().toLocaleDateString('uk-UA'),
    });
    localStorage.setItem('bookings', JSON.stringify(currentBookings));

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, color: '#291C0E', fontSize: '20px', fontWeight: 800 }}>
            Бронювання житла
          </h3>
          <button onClick={onClose} style={closeBtnStyle}>
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#059669', margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800 }}>
              Бронювання успішно оформлено!
            </h3>
            <p style={{ color: '#6E473B', fontSize: '14px', margin: 0 }}>
              Деталі замовлення додано у ваш особистий кабінет.
            </p>
          </div>
        ) : (
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#291C0E', fontWeight: 700 }}>
              {routeTitle}
            </h4>
            <p style={{ color: '#7a6a5d', fontSize: '13px', margin: '0 0 16px 0' }}>
              📍 {location} • ₴ {pricePerNight} / доба
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Дата заїзду</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Дата виїзду</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Кількість гостей</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                style={inputStyle}
              >
                <option value={1}>1 гість</option>
                <option value={2}>2 гостя</option>
                <option value={3}>3 гостя</option>
                <option value={4}>4+ гостей</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Варіант оплати</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setPaymentType('full')}
                  style={{
                    ...paymentOptionStyle,
                    borderColor: paymentType === 'full' ? '#DC9666' : '#E1D4C2',
                    backgroundColor: paymentType === 'full' ? '#F4ECE4' : '#fff',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#291C0E' }}>1 платіж (100%)</div>
                  <div style={{ fontSize: '12px', color: '#6E473B', marginTop: '2px' }}>₴ {totalSum}</div>
                </div>
                <div
                  onClick={() => setPaymentType('part')}
                  style={{
                    ...paymentOptionStyle,
                    borderColor: paymentType === 'part' ? '#DC9666' : '#E1D4C2',
                    backgroundColor: paymentType === 'part' ? '#F4ECE4' : '#fff',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#291C0E' }}>2 платежі (50%)</div>
                  <div style={{ fontSize: '12px', color: '#6E473B', marginTop: '2px' }}>₴ {payNow} зараз</div>
                </div>
              </div>
            </div>

            <div style={priceSummaryBoxStyle}>
              <span style={{ fontSize: '14px', color: '#6E473B', fontWeight: 600 }}>До сплати зараз:</span>
              <strong style={{ fontSize: '20px', color: '#291C0E', fontWeight: 800 }}>₴ {payNow}</strong>
            </div>

            <button onClick={handleConfirm} style={{...confirmBtnStyle, opacity: (!checkIn || !checkOut) ? 0.5 : 1}} disabled={!checkIn || !checkOut}>
              Підтвердити та забронювати
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(41, 28, 14, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(3px)' };
const modalBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '520px', width: '100%', boxShadow: '0 20px 40px rgba(41, 28, 14, 0.25)', border: '1px solid #E1D4C2' };
const closeBtnStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6E473B', padding: '4px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#6E473B', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #BEB5A9', outline: 'none', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' };
const paymentOptionStyle: React.CSSProperties = { padding: '12px', borderRadius: '12px', border: '2px solid', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' };
const priceSummaryBoxStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#F4ECE4', borderRadius: '14px', marginBottom: '18px', border: '1px solid #E1D4C2' };
const confirmBtnStyle: React.CSSProperties = { width: '100%', padding: '14px', backgroundColor: '#DC9666', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(220, 150, 102, 0.35)' };