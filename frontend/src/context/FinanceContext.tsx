import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAppData } from './AppDataContext';
import type { FinanceSnapshot } from '../data/contracts';
import type { PayoutSettings } from '../data/mockData';
import { requestError } from '../services/bookings.service';

interface FinanceContextValue {
  available: boolean;
  isDemo: boolean;
  loading: boolean;
  busy: boolean;
  error: string;
  snapshot: FinanceSnapshot | null;
  refresh: () => void;
  withdrawFunds: (amount: number) => Promise<boolean>;
  updatePayoutSettings: (settings: Partial<PayoutSettings>) => Promise<boolean>;
}
const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { finance, mode } = useAppData();
  const [snapshot, setSnapshot] = useState<FinanceSnapshot | null>(null);
  const [loading, setLoading] = useState(finance.available);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!finance.available) return;
    const controller = new AbortController();
    finance.load(controller.signal).then(data => {
      if (!controller.signal.aborted) setSnapshot(data);
    }).catch(err => { if (!controller.signal.aborted) setError(requestError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [finance, revision]);

  const perform = async (operation: () => Promise<FinanceSnapshot>) => {
    if (!finance.available || busyRef.current || loading) return false;
    busyRef.current = true; setBusy(true); setError('');
    try { setSnapshot(await operation()); return true; }
    catch (err) { setError(requestError(err)); return false; }
    finally { busyRef.current = false; setBusy(false); }
  };
  return <FinanceContext.Provider value={{ available: finance.available, isDemo: mode === 'demo', snapshot, loading, busy, error,
    refresh: () => { if (!busyRef.current) { setLoading(true); setError(''); setRevision(v => v + 1); } },
    withdrawFunds: amount => perform(() => finance.withdraw(amount)),
    updatePayoutSettings: settings => perform(() => finance.updatePayoutSettings(settings)),
  }}>{children}</FinanceContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
