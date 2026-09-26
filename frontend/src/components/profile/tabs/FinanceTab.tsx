import { useFinance } from '../../../context/FinanceContext';
import { useSettings } from '../../../context/SettingsContext';
import { FinanceUnavailable, DemoFinanceNotice } from '../FinanceAvailability';
import '../../bookings/bookings.css';

export function FinanceTab() {
  const { available, isDemo, snapshot, loading, error, busy, refresh } = useFinance();
  const { formatPrice } = useSettings();
  if (!available) return <FinanceUnavailable />;
  return <section className="booking-workspace">
    {isDemo && <DemoFinanceNotice />}
    <div className="booking-toolbar"><h1>Фінансова аналітика</h1><button disabled={loading || busy} onClick={refresh}>Оновити</button></div>
    {error && <p role="alert" className="booking-error">{error}</p>}
    {loading ? <p role="status">Завантаження…</p> : snapshot && <>
      <div className="booking-card">
        <div><p>Загальний дохід</p><strong>{formatPrice(snapshot.kpi.totalRevenue)}</strong></div>
        <div><p>Дохід за місяць</p><strong>{formatPrice(snapshot.kpi.monthRevenue)}</strong></div>
        <div><p>Комісія</p><strong>{formatPrice(snapshot.kpi.totalCommission)}</strong></div>
        <div><p>Очікувані виплати</p><strong>{formatPrice(snapshot.kpi.pendingPayouts)}</strong></div>
      </div>
      <h2>Історія операцій</h2>
      {!snapshot.transactions.length && <p>Операцій ще немає.</p>}
      {snapshot.transactions.map(tx => <article key={tx.id} className="booking-card">
        <div className="booking-card-body"><h3>{tx.title}</h3><p>{tx.date} · {tx.status}</p></div>
        <strong>{formatPrice(tx.amount)}</strong>
      </article>)}
    </>}
  </section>;
}
