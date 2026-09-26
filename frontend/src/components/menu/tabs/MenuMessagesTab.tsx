import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAppData } from '../../../context/AppDataContext';
import type { ChatMessage } from '../../../data/contracts';
import { requestError, type BookingRecord } from '../../../services/bookings.service';
import '../../bookings/bookings.css';
import { Avatar } from '../../Avatar';

export function MenuMessagesTab() {
  const { user } = useAuth();
  if (!user) return <p>Увійдіть, щоб переглянути повідомлення.</p>;
  return <Messages key={user.id} userId={user.id} canHost={['Landlord', 'Admin', 1, 3].includes(user.role)} />;
}

function Messages({ userId, canHost }: { userId: string; canHost: boolean }) {
  const { bookings, mode } = useAppData();
  const [dialogs, setDialogs] = useState<BookingRecord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, retry] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    Promise.all([bookings.list(false, abort.signal), canHost ? bookings.list(true, abort.signal) : Promise.resolve([])])
      .then(([guest, host]) => {
        if (!abort.signal.aborted) setDialogs([...new Map([...guest, ...host].map(b => [b.id, b])).values()]);
      }).catch(e => { if (!abort.signal.aborted) setError(requestError(e)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [bookings, canHost, revision]);
  const current = dialogs.find(b => b.id === selected);
  return <section className="booking-workspace">
    <div className="booking-toolbar"><h2>Повідомлення</h2><button onClick={() => { setLoading(true); setError(''); retry(n => n + 1); }}>Оновити діалоги</button></div>
    <p>Окремий діалог для кожного бронювання. Доступ мають лише гість та власник житла.</p>
    {mode === 'demo' && <p role="status">Демонстраційна переписка зберігається лише у вашому браузері. Повідомлення не надсилаються іншим людям.</p>}
    {loading && <p role="status">Завантаження…</p>}
    {error && <p role="alert" className="booking-error">{error}</p>}
    {!loading && !error && dialogs.length === 0 && <p>Діалоги з’являться після створення бронювання.</p>}
    <div className="booking-tabs">{dialogs.map(b => <button key={b.id} aria-pressed={selected === b.id} onClick={() => setSelected(b.id)}>
      {b.title} · {b.guestId === userId ? b.hostName : b.guestName}<br />{b.checkIn} — {b.checkOut}
    </button>)}</div>
    {current && <Conversation key={current.id} booking={current} />}
  </section>;
}

function Conversation({ booking }: { booking: BookingRecord }) {
  const { chat } = useAppData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [revision, retry] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    chat.list(booking.id, abort.signal).then(data => { if (!abort.signal.aborted) setMessages(data); })
      .catch(e => { if (!abort.signal.aborted) setError(requestError(e)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [chat, booking.id, revision]);
  const send = async (event: FormEvent) => {
    event.preventDefault();
    if (pending.current || loading || !text.trim()) return;
    pending.current = true; setBusy(true); setError('');
    try {
      const message = await chat.send(booking.id, text);
      setMessages(old => [...old, message]); setText('');
    } catch (e) { setError(requestError(e)); }
    finally { pending.current = false; setBusy(false); }
  };
  return <section className="booking-card" style={{ display: 'block' }} aria-label={`Діалог: ${booking.title}`}>
    <div className="booking-toolbar"><h3>{booking.title}</h3><button disabled={busy || loading} onClick={() => { setLoading(true); setError(''); retry(n => n + 1); }}>Оновити повідомлення</button></div>
    {loading && <p role="status">Завантаження…</p>}
    {error && <p role="alert" className="booking-error">{error}</p>}
    {!loading && !error && messages.length === 0 && <p>Повідомлень ще немає.</p>}
    <ol aria-label="Повідомлення діалогу" style={{ listStyle: 'none', padding: 0, maxHeight: 420, overflowY: 'auto' }}>
      {messages.map(m => <li key={m.id} style={{ padding: 14, marginBottom: 10, background: m.isHost ? '#f4ece4' : '#f6f6f6', borderRadius: 12 }}>
        <div className="chat-sender"><Avatar src={m.senderAvatar} name={m.senderName} size={40} />
          <strong>{m.isHost ? 'Ви' : m.senderName}</strong> <small>{m.time}</small></div>
        <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{m.text}</p>
      </li>)}
    </ol>
    <form onSubmit={send}>
      <label>Повідомлення<textarea value={text} onChange={e => setText(e.target.value)} maxLength={4000} disabled={busy || loading} rows={3} style={{ display: 'block', width: '100%', boxSizing: 'border-box', margin: '10px 0' }} /></label>
      <button type="submit" disabled={busy || loading || !text.trim()}>{busy ? 'Надсилання…' : 'Надіслати'}</button>
    </form>
  </section>;
}
