import { useAppData } from '../../../context/AppDataContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import { BookingList } from '../../bookings/BookingList';
import { requestError } from '../../../services/bookings.service';
import { syncService } from '../../../services/sync.service';
import { storage } from '../../../services/storage.service';
import type { RouteItem } from '../../../types';
import '../../bookings/bookings.css';

export function LivePropertiesTab() {
  const { user, isLandlord } = useAuth();
  if (!user) return <p><Link to="/login">Увійдіть</Link>, щоб керувати помешканнями.</p>;
  if (!isLandlord && user.role !== 'Admin') return <p><Link to="/change-role">Стати орендодавцем</Link></p>;
  return <PropertiesContent key={user.id} />;
}

function PropertiesContent() {
  const { formatPrice } = useSettings();
  const { properties: routesApi } = useAppData();
  const [properties, setProperties] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'properties' | 'bookings'>('properties');
  const [deleteTarget, setDeleteTarget] = useState<RouteItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    routesApi.getMine(controller.signal).then(setProperties)
      .catch(err => { if (!controller.signal.aborted) setError(requestError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision, routesApi]);

  const deleteProperty = async () => {
    if (!deleteTarget || busy) return;
    setBusy(true); setError('');
    try {
      await routesApi.delete(deleteTarget.id);
      storage.routes.removeCustom(deleteTarget.id);
      syncService.invalidate('routes_');
      setProperties(items => items.filter(item => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) { setError(requestError(err)); }
    finally { setBusy(false); }
  };

  return <section className="booking-workspace">
    <div className="booking-toolbar"><h1>Керування помешканнями</h1><Link className="property-action-link property-action-link--primary" to="/routes/create">＋ Додати помешкання</Link></div>
    <div className="booking-tabs">
      <button type="button" aria-pressed={tab === 'properties'} onClick={() => setTab('properties')}>Мої помешкання</button>
      <button type="button" aria-pressed={tab === 'bookings'} onClick={() => setTab('bookings')}>Заявки та бронювання</button>
    </div>
    {tab === 'bookings' ? <BookingList host /> : <>
      <button type="button" disabled={loading || busy} onClick={() => { setLoading(true); setError(''); setRevision(v => v + 1); }}>Оновити</button>
      {error && <p role="alert" className="booking-error">{error}</p>}
      {loading ? <p role="status">Завантаження помешкань…</p> : <>
        {!error && !properties.length && <p>Додайте перше помешкання, щоб отримувати заявки на бронювання.</p>}
        {properties.map(property => <article key={property.id} className="booking-card">
          {property.imageUrls[0] && <img className="booking-thumbnail" src={property.imageUrls[0]} alt="" />}
          <div className="booking-card-body"><h3><Link to={`/routes/${property.id}`}>{property.title}</Link></h3>
            <p>{property.location}</p><p>{formatPrice(property.price)} / ніч · До {property.maxGuests} гостей</p>
          </div>
          <div className="booking-actions"><Link className="property-action-link" to={`/routes/edit/${property.id}`} aria-label={`Редагувати ${property.title}`}>✎ Редагувати</Link>
            <button type="button" onClick={() => setDeleteTarget(property)}>Видалити</button></div>
        </article>)}
      </>}
    </>}
    {deleteTarget && <div className="booking-overlay"><section role="dialog" aria-modal="true" aria-labelledby="delete-property-title" className="booking-dialog">
      <h2 id="delete-property-title">Видалити «{deleteTarget.title}»?</h2><p>Помешкання з історією бронювань видалити не можна.</p>
      {error && <p role="alert" className="booking-error">{error}</p>}
      <div className="booking-actions"><button type="button" disabled={busy} onClick={() => void deleteProperty()}>Видалити</button>
        <button type="button" disabled={busy} onClick={() => setDeleteTarget(null)}>Повернутись</button></div>
    </section></div>}
  </section>;
}
