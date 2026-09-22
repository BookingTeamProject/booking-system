// src/components/BookingModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axios';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  routeTitle: string;
  pricePerNight: number;
  location: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  routeId,
  routeTitle,
  pricePerNight,
  location,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [paymentType, setPaymentType] = useState<'full' | 'part'>('full');
  const [isSuccess, setIsSuccess] = useState(false);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialCheckIn) setStartDate(new Date(initialCheckIn));
      if (initialCheckOut) setEndDate(new Date(initialCheckOut));
      if (initialGuests) setGuests(initialGuests);
      setPaymentType('full');
      setIsSuccess(false);

      const fetchUnavailableDates = async () => {
        if (!routeId) return;
        setIsLoadingDates(true);
        try {
          const response = await api.get(`/Bookings/route/${routeId}/unavailable-dates`);
          const datesToExclude: Date[] = [];
          
          response.data.forEach((booking: any) => {
            let currentDate = new Date(booking.start);
            const bookingEndDate = new Date(booking.end);
            while (currentDate <= bookingEndDate) {
              datesToExclude.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
          setExcludedDates(datesToExclude);
        } catch (error) {
          console.error('Помилка завантаження зайнятих дат', error);
        } finally {
          setIsLoadingDates(false);
        }
      };

      fetchUnavailableDates();
    }
  }, [isOpen, routeId, initialCheckIn, initialCheckOut, initialGuests]);

  const { totalSum, payNow } = useMemo(() => {
    let diffDays = 0;
    if (startDate && endDate) {
      diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    }
    
    const nights = diffDays > 0 ? diffDays : 0;
    let sum = pricePerNight;
    
    if (nights > 0) {
      const accommodationTotal = pricePerNight * nights;
      const cleaningFee = 300;
      const serviceFee = 150;
      sum = accommodationTotal + cleaningFee + serviceFee;
    }

    const toPay = paymentType === 'full' ? sum : Math.round(sum / 2);
    return { totalSum: sum, payNow: toPay };
  }, [startDate, endDate, pricePerNight, paymentType]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!startDate || !endDate || !routeId) return;

    try {
      await api.post('/Bookings', {
        routeId: routeId,
        checkIn: startDate.toISOString(),
        checkOut: endDate.toISOString(),
        totalPrice: totalSum,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(`Помилка: ${error.response.data.message}`);
      } else {
        alert('Сталася помилка при бронюванні. Спробуйте пізніше.');
      }
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, color: '#291C0E', fontSize: '20px', fontWeight: 800 }}>
            Бронювання житла
          </h3>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#059669', margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800 }}>
              Бронювання успішно оформлено!
            </h3>
            <p style={{ color: '#6E473B', fontSize: '14px', margin: 0 }}>
              Деталі замовлення додано у ваш особистий кабінет. Хост вже отримав заявку.
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
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  excludeDates={excludedDates}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Оберіть дату"
                  customInput={<input style={inputStyle} disabled={isLoadingDates} />}
                />
              </div>
              <div>
                <label style={labelStyle}>Дата виїзду</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  excludeDates={excludedDates}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Оберіть дату"
                  customInput={<input style={inputStyle} disabled={isLoadingDates || !startDate} />}
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

            <button 
              onClick={handleConfirm} 
              style={{ ...confirmBtnStyle, opacity: (!startDate || !endDate) ? 0.5 : 1 }} 
              disabled={!startDate || !endDate}
            >
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