import { useAppData } from '../../context/AppDataContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { bookingStatusLabels, requestError, type BookingRecord, type BookingStatus } from '../../services/bookings.service';
import './bookings.css';

const isHistory = (booking: BookingRecord) => ['Cancelled', 'Declined', 'Completed'].includes(booking.status) || booking.checkOut <= new Date().toISOString().slice(0, 10);

export function BookingList({ host = false }: { host?: boolean }) {
  const { user } = useAuth();
  // Remount when switching accounts so a previous user's records are never displayed.
  return user ? <BookingListContent key={`${user.id}:${host}`} host={host} /> : <p><Link to="/login">Увійдіть</Link>, щоб переглянути бронювання.</p>;
}

function BookingListContent({ host }: { host: boolean }) {
  const { formatPrice } = useSettings();
  const { bookings: bookingsApi } = useAppData();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [history, setHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookingRecord | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    bookingsApi.list(host, controller.signal).then(setBookings).catch(err => {
      if (!controller.signal.aborted) setError(requestError(err));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [host, revision, bookingsApi]);

  const refresh = () => { setError(''); setLoading(true); setRevision(v => v + 1); };
  const changeStatus = async (booking: BookingRecord, status: BookingStatus) => {
    if (busy) return;
    setBusy(booking.id);
    setError('');
    try {
      const updated = await bookingsApi.changeStatus(booking.id, status, reason.trim() || undefined);
      setBookings(items => items.map(item => item.id === updated.id ? updated : item));
      setCancelTarget(null);
      setReason('');
    } catch (err) { setError(requestError(err)); }
    finally { setBusy(null); }
  };
  const visible = bookings.filter(item => isHistory(item) === history);
  const today = new Date().toISOString().slice(0, 10);

  return <section className="booking-workspace">
    <div className="booking-toolbar">
      <h2>{host ? 'Бронювання ваших помешкань' : 'Мої бронювання'}</h2>
      <button type="button" onClick={refresh} disabled={loading || !!busy}>Оновити</button>
    </div>
    <div className="booking-tabs">
      <button type="button" aria-pressed={!history} onClick={() => setHistory(false)}>Поточні</button>
      <button type="button" aria-pressed={history} onClick={() => setHistory(true)}>Історія</button>
    </div>
    {error && <p role="alert" className="booking-error">{error}</p>}
    {loading ? <p role="status">Завантаження бронювань…</p> : <>
      {!error && visible.length === 0 && <p>У цьому розділі ще немає бронювань.</p>}
      {visible.map(booking => <article key={booking.id} className="booking-card">
        {booking.imageUrl && <img className="booking-thumbnail" src={booking.imageUrl} alt="" />}
        <div className="booking-card-body">
          <h3><Link to={`/routes/${booking.routeId}`}>{booking.title}</Link></h3>
          <p>{booking.location}</p>
          <p>{booking.checkIn} → {booking.checkOut} · Гостей: {booking.guests}</p>
          <p>{host ? `Гість: ${booking.guestName}` : `Господар: ${booking.hostName}`}</p>
          <span className="booking-status">{bookingStatusLabels[booking.status]}</span>
          <details><summary>Деталі вартості · {formatPrice(booking.totalPrice)}</summary>
            <p>За ніч: {formatPrice(booking.pricePerNight)} · Прибирання: {formatPrice(booking.cleaningFee)} · Сервісний збір: {formatPrice(booking.serviceFee)}</p>
            <p>Номер бронювання: {booking.id}</p>
            <p>Онлайн-оплата не проводилась.</p>
            {booking.cancellationReason && <p>Причина: {booking.cancellationReason}</p>}
          </details>
        </div>
        {!isHistory(booking) && booking.checkIn >= today && <div className="booking-actions">
          {host && booking.status === 'Pending' && <button type="button" disabled={!!busy} onClick={() => void changeStatus(booking, 'Confirmed')}>Підтвердити</button>}
          <button type="button" disabled={!!busy} onClick={() => { setCancelTarget(booking); setReason(''); }}>
            {host && booking.status === 'Pending' ? 'Відхилити' : 'Скасувати'}
          </button>
        </div>}
      </article>)}
    </>}
    {cancelTarget && <div className="booking-overlay"><section role="dialog" aria-modal="true" aria-labelledby="cancel-booking-title" className="booking-dialog">
      <h2 id="cancel-booking-title">{host && cancelTarget.status === 'Pending' ? 'Відхилити заявку?' : 'Скасувати бронювання?'}</h2>
      <p>{cancelTarget.title} · {cancelTarget.checkIn} → {cancelTarget.checkOut}</p>
      <label>Причина (необов’язково)<textarea maxLength={1000} value={reason} onChange={e => setReason(e.target.value)} /></label>
      {error && <p role="alert" className="booking-error">{error}</p>}
      <div className="booking-actions">
        <button type="button" disabled={!!busy} onClick={() => void changeStatus(cancelTarget, host && cancelTarget.status === 'Pending' ? 'Declined' : 'Cancelled')}>Підтвердити</button>
        <button type="button" disabled={!!busy} onClick={() => setCancelTarget(null)}>Повернутись</button>
      </div>
    </section></div>}
  </section>;
}
