import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { requestError } from '../services/bookings.service';
import '../components/bookings/bookings.css';
import './admin.css';

interface Account { id: string; email: string; firstName: string; lastName: string; role: string; createdAt: string; isSystemAdmin: boolean; isBlocked: boolean; isDeleted: boolean }
interface Page { items: Account[]; total: number; page: number; pageSize: number }
interface Statistics { users: number; guests: number; hosts: number; blocked: number; deleted: number; registeredThisMonth: number; properties: number; bookings: number; activeBookings: number; cancelledBookings: number; reviews: number }
const roles = ['User', 'Landlord', 'Moderator', 'Admin'];
const roleNames = ['Гість', 'Власник', 'Модератор', 'Адміністратор'];
type Action = { account: Account; kind: 'role' | 'block' | 'delete' | 'restore'; role?: number; label: string };

export function AdminPage() {
  const { user } = useAuth();
  if (!user) return <section className="admin-page"><h1>Адміністрування</h1><Link to="/login">Увійдіть до акаунта адміністратора</Link></section>;
  if (user.role !== 'Admin' && user.role !== 3) return <section className="admin-page"><h1>Доступ заборонено</h1><p>Потрібна роль адміністратора.</p></section>;
  return <AdminWorkspace key={user.id} userId={user.id} />;
}

function AdminWorkspace({ userId }: { userId: string }) {
  const [query, setQuery] = useState({ search: '', role: '', status: 'active', page: 1 });
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<Page | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [revision, refresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [action, setAction] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  useEffect(() => {
    const abort = new AbortController();
    Promise.all([
      api.get<Page>('/admin/users', { params: { ...query, role: query.role || undefined }, signal: abort.signal }),
      api.get<Statistics>('/admin/statistics', { signal: abort.signal }),
    ]).then(([users, stats]) => { if (!abort.signal.aborted) { setResult(users.data); setStatistics(stats.data); } })
      .catch(e => { if (!abort.signal.aborted) { setResult(null); setStatistics(null); setError(requestError(e)); } })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [query, revision]);
  const changeQuery = (next: typeof query) => { setLoading(true); setError(''); setQuery(next); };
  const find = (event: FormEvent) => { event.preventDefault(); changeQuery({ ...query, search: search.trim(), page: 1 }); };
  const execute = async () => {
    if (!action || pending.current) return;
    pending.current = true; setBusy(true); setError(''); setNotice('');
    try {
      const path = `/admin/users/${action.account.id}`;
      if (action.kind === 'role') await api.put(`${path}/role`, action.role);
      else if (action.kind === 'block') await api.put(`${path}/blocked`, !action.account.isBlocked);
      else if (action.kind === 'delete') await api.delete(path);
      else await api.post(`${path}/restore`);
      setNotice('Зміни збережено. Попередні сесії користувача відкликано.');
      setAction(null); setLoading(true); refresh(n => n + 1);
    } catch (e) { setError(requestError(e)); }
    finally { pending.current = false; setBusy(false); }
  };
  const metrics: [string, keyof Statistics][] = [['Акаунти', 'users'], ['Гості', 'guests'], ['Власники', 'hosts'], ['Заблоковані', 'blocked'], ['Видалені', 'deleted'], ['Нові за місяць (UTC)', 'registeredThisMonth'], ['Помешкання', 'properties'], ['Бронювання', 'bookings'], ['Активні бронювання', 'activeBookings'], ['Скасовані', 'cancelledBookings'], ['Відгуки', 'reviews']];
  return <section className="admin-page booking-workspace">
    <div className="booking-toolbar"><h1>Адміністративна панель</h1><button disabled={loading || busy} onClick={() => { setLoading(true); setError(''); refresh(n => n + 1); }}>Оновити</button></div>
    <p>Статистика з бази даних. Онлайн-платежі не виконуються.</p>
    {error && <p role="alert" className="booking-error">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {loading && <p role="status">Завантаження…</p>}
    {statistics && <div className="admin-metrics">{metrics.map(([label, key]) => <article key={key}><span>{label}</span><strong>{statistics[key]}</strong></article>)}</div>}
    <form className="admin-filters" onSubmit={find}>
      <label>Пошук за ім’ям, email або ID<input value={search} onChange={e => setSearch(e.target.value)} maxLength={150} /></label>
      <label>Роль<select value={query.role} onChange={e => changeQuery({ ...query, role: e.target.value, page: 1 })}><option value="">Усі ролі</option>{roles.map((role, i) => <option key={role} value={i}>{roleNames[i]}</option>)}</select></label>
      <label>Стан<select value={query.status} onChange={e => changeQuery({ ...query, status: e.target.value, page: 1 })}><option value="active">Активні</option><option value="blocked">Заблоковані</option><option value="deleted">Видалені</option><option value="all">Усі</option></select></label>
      <button type="submit">Знайти</button>
    </form>
    {!loading && result && <><p>Знайдено: {result.total}</p><div className="admin-accounts">{result.items.map(account => {
      const protectedAccount = account.isSystemAdmin || account.id === userId;
      return <article className="admin-account" key={account.id}>
        <div><h2>{account.firstName} {account.lastName}</h2><p>{account.email}</p><small>{account.id}</small><p>Реєстрація: {new Date(account.createdAt).toLocaleDateString('uk-UA')}</p></div>
        <div><p>{account.isSystemAdmin ? 'Головний адміністратор' : roleNames[roles.indexOf(account.role)]}</p><p>{account.isDeleted ? 'Видалений' : account.isBlocked ? 'Заблокований' : 'Активний'}</p>
          <label>Роль користувача<select aria-label={`Роль ${account.email}`} value={roles.indexOf(account.role)} disabled={protectedAccount || account.isDeleted || busy} onChange={e => setAction({ account, kind: 'role', role: Number(e.target.value), label: `Змінити роль на «${roleNames[Number(e.target.value)]}»` })}>{roles.map((role, i) => <option key={role} value={i}>{roleNames[i]}</option>)}</select></label>
          <div className="booking-actions">{account.isDeleted ? <button disabled={protectedAccount || busy} onClick={() => setAction({ account, kind: 'restore', label: 'Відновити акаунт' })}>Відновити</button> : <>
            <button disabled={protectedAccount || busy} onClick={() => setAction({ account, kind: 'block', label: account.isBlocked ? 'Розблокувати акаунт' : 'Заблокувати акаунт' })}>{account.isBlocked ? 'Розблокувати' : 'Заблокувати'}</button>
            <button disabled={protectedAccount || busy} onClick={() => setAction({ account, kind: 'delete', label: 'Видалити акаунт' })}>Видалити</button></>}
          </div>
        </div>
      </article>;
    })}</div><div className="booking-toolbar"><button disabled={query.page === 1} onClick={() => changeQuery({ ...query, page: query.page - 1 })}>Назад</button><span>Сторінка {query.page}</span><button disabled={query.page * result.pageSize >= result.total} onClick={() => changeQuery({ ...query, page: query.page + 1 })}>Далі</button></div></>}
    {action && <div className="booking-overlay"><section role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title" className="booking-dialog">
      <h2 id="admin-confirm-title">{action.label}?</h2><p>{action.account.email}</p><p>Поточні сесії буде відкликано. Видалення закриває доступ і зберігає історію бронювань; акаунт можна відновити.</p>
      {error && <p role="alert">{error}</p>}<div className="booking-actions"><button autoFocus disabled={busy} onClick={() => setAction(null)}>Скасувати</button><button disabled={busy} onClick={execute}>{busy ? 'Збереження…' : 'Підтвердити'}</button></div>
    </section></div>}
  </section>;
}
