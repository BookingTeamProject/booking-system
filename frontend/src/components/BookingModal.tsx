import { useAppData } from '../context/AppDataContext';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { requestError, type BookingQuote, type BookingRecord, type UnavailableRange } from '../services/bookings.service';
import './bookings/bookings.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  routeTitle: string;
  pricePerNight: number;
  location: string;
  maxGuests?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export function BookingModal(props: BookingModalProps) {
  const { user } = useAuth();
  return props.isOpen ? <BookingForm key={`${props.routeId}:${user?.id || 'guest'}`} {...props} /> : null;
}

function BookingForm({ onClose, routeId, routeTitle, location, maxGuests = 4, initialCheckIn = '', initialCheckOut = '', initialGuests = 1 }: BookingModalProps) {
  const { user } = useAuth();
  const { formatPrice } = useSettings();
  const { bookings: bookingsApi } = useAppData();
  const [checkIn, setCheckIn] = useState(initialCheckIn.slice(0, 10));
  const [checkOut, setCheckOut] = useState(initialCheckOut.slice(0, 10));
  const [guests, setGuests] = useState(Math.min(maxGuests, Math.max(1, initialGuests)));
  const [ranges, setRanges] = useState<UnavailableRange[] | null>(null);
  const [datesError, setDatesError] = useState('');
  const [quoteState, setQuoteState] = useState<{ key: string; quote?: BookingQuote; error?: string } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [created, setCreated] = useState<BookingRecord | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const validDates = checkIn >= today && checkOut > checkIn;
  const overlaps = ranges?.some(range => range.start < checkOut && checkIn < range.end);
  const canQuote = !!user && validDates && ranges !== null && !overlaps;
  const quoteKey = `${routeId}:${checkIn}:${checkOut}:${guests}`;
  const currentQuote = quoteState?.key === quoteKey ? quoteState : null;

  useEffect(() => {
    const controller = new AbortController();
    bookingsApi.unavailable(routeId, controller.signal).then(setRanges).catch(err => {
      if (!controller.signal.aborted) setDatesError(requestError(err));
    });
    return () => controller.abort();
  }, [routeId, bookingsApi]);

  useEffect(() => {
    if (!canQuote) return;
    const controller = new AbortController();
    bookingsApi.quote({ routeId, checkIn, checkOut, guests }, controller.signal)
      .then(quote => setQuoteState({ key: quoteKey, quote }))
      .catch(err => { if (!controller.signal.aborted) setQuoteState({ key: quoteKey, error: requestError(err) }); });
    return () => controller.abort();
  }, [canQuote, routeId, checkIn, checkOut, guests, quoteKey, bookingsApi]);

  const confirm = async () => {
    if (submitting.current || !canQuote || !currentQuote?.quote) return;
    submitting.current = true;
    setBusy(true); setError('');
    try {
      setCreated(await bookingsApi.create({ routeId, checkIn, checkOut, guests }));
    } catch (err) { setError(requestError(err)); }
    finally { submitting.current = false; setBusy(false); }
  };

  return <div className="booking-overlay"><section role="dialog" aria-modal="true" aria-labelledby="booking-title" className="booking-dialog">
    <div className="booking-toolbar"><h2 id="booking-title">Бронювання житла</h2><button type="button" aria-label="Закрити" disabled={busy} onClick={onClose}>✕</button></div>
    <h3>{routeTitle}</h3><p>{location}</p>
    {!user ? <p><Link to="/login" onClick={onClose}>Увійдіть</Link>, щоб забронювати помешкання.</p> : created ? <div role="status">
      <h3>Заявку на бронювання створено</h3><p>Очікуйте підтвердження господаря. Вартість: {formatPrice(created.totalPrice)}.</p>
      <p>Кошти не списувалися.</p><Link to="/menu?tab=bookings" onClick={onClose}>Переглянути мої бронювання →</Link>
    </div> : <>
      <label>Дата заїзду<input autoFocus type="date" min={today} value={checkIn} disabled={busy} onChange={e => setCheckIn(e.target.value)} /></label>
      <label>Дата виїзду<input type="date" min={checkIn || today} value={checkOut} disabled={busy} onChange={e => setCheckOut(e.target.value)} /></label>
      <label>Кількість гостей<select value={guests} disabled={busy} onChange={e => setGuests(Number(e.target.value))}>
        {Array.from({ length: maxGuests }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
      </select></label>
      {ranges === null && !datesError && <p role="status">Перевіряємо доступність…</p>}
      {!!ranges?.length && <details><summary>Зайняті періоди</summary>{ranges.map(range => <p key={`${range.start}:${range.end}`}>{range.start} → {range.end} (дата виїзду вільна)</p>)}</details>}
      {datesError && <p role="alert" className="booking-error">{datesError} Закрийте вікно та спробуйте ще раз.</p>}
      {checkIn && checkOut && !validDates && <p role="alert" className="booking-error">Виїзд має бути пізніше за заїзд, а заїзд — не в минулому.</p>}
      {validDates && overlaps && <p role="alert" className="booking-error">Період перетинається з іншим бронюванням.</p>}
      {canQuote && !currentQuote && <p role="status">Розраховуємо вартість…</p>}
      {canQuote && currentQuote?.error && <p role="alert" className="booking-error">{currentQuote.error}</p>}
      {canQuote && currentQuote?.quote && <div className="booking-price">
        <p>{currentQuote.quote.nights} ночей × {formatPrice(currentQuote.quote.pricePerNight)}</p>
        <p>Прибирання: {formatPrice(currentQuote.quote.cleaningFee)}</p><p>Сервісний збір: {formatPrice(currentQuote.quote.serviceFee)}</p>
        <strong>Разом: {formatPrice(currentQuote.quote.totalPrice)}</strong>
      </div>}
      <p>Онлайн-оплата поки недоступна. Заявку має підтвердити господар.</p>
      {error && <p role="alert" className="booking-error">{error}</p>}
      <button className="booking-primary" type="button" disabled={busy || !canQuote || !currentQuote?.quote} onClick={() => void confirm()}>{busy ? 'Зберігаємо…' : 'Надіслати заявку'}</button>
    </>}
  </section></div>;
}
