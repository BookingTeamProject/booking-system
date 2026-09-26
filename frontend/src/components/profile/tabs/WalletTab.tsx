import { useState } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { useSettings } from '../../../context/SettingsContext';
import { FinanceUnavailable, DemoFinanceNotice } from '../FinanceAvailability';
import type { PayoutSettings } from '../../../data/mockData';
import '../../bookings/bookings.css';

export function WalletTab({ onNotify }: { onNotify: (message: string) => void }) {
  const { available, isDemo, snapshot, loading, busy, error, refresh, withdrawFunds, updatePayoutSettings } = useFinance();
  const { formatPrice } = useSettings();
  const [amount, setAmount] = useState('');
  if (!available) return <FinanceUnavailable />;
  const withdraw = async () => {
    if (await withdrawFunds(Number(amount))) {
      onNotify(isDemo ? 'Тестова операція виконана. Реальні кошти не переказувались.' : 'Запит на виплату прийнято. Статус відображено в історії операцій.');
      setAmount('');
    }
  };
  return <section className="booking-workspace">
    {isDemo && <DemoFinanceNotice />}
    <div className="booking-toolbar"><h1>Гаманець</h1><button disabled={loading || busy} onClick={refresh}>Оновити</button></div>
    {error && <p role="alert" className="booking-error">{error}</p>}
    {loading ? <p role="status">Завантаження…</p> : snapshot && <div className="booking-card">
      <div className="booking-card-body"><h2>Баланс: {formatPrice(snapshot.balance)}</h2>
        <p>Очікується до виплати: {formatPrice(snapshot.expectedPayout)}</p>
        <p>Рахунок: {snapshot.payoutSettings.iban}</p>
        <label>Періодичність виплат <select value={snapshot.payoutSettings.frequency} disabled={busy} onChange={e => void updatePayoutSettings({ frequency: e.target.value as PayoutSettings['frequency'] })}>
          {(['Щодня', 'Щотижня', 'Щомісяця', 'Щокварталу', 'Щороку'] as const).map(frequency => <option key={frequency}>{frequency}</option>)}
        </select></label>
        <div className="booking-actions" style={{ marginTop: 20 }}>
          <label>Сума у UAH <input type="number" min="0.01" max={snapshot.balance} step="0.01" value={amount} disabled={busy} onChange={e => setAmount(e.target.value)} /></label>
          <button disabled={busy || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || Number(amount) > snapshot.balance} onClick={() => void withdraw()}>Вивести кошти</button>
        </div>
      </div>
    </div>}
  </section>;
}
