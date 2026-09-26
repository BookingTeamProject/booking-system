import { createContext, useContext, useState, type ReactNode } from 'react';
import { dataSources } from '../config/dataSources';
import type { DataSources } from '../data/contracts';
import { useAuth } from './AuthContext';
import { syncService } from '../services/sync.service';

const AppDataContext = createContext<DataSources | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [revision, setRevision] = useState(0);
  const reset = () => {
    dataSources.resetDemo?.();
    syncService.invalidate();
    setRevision(value => value + 1);
  };
  return <AppDataContext.Provider value={dataSources} key={`${user?.id || 'anonymous'}:${revision}`}>
    {dataSources.mode === 'demo' && <aside role="status" style={{ padding: '10px 24px', background: '#fff3cd', color: '#664d03' }}>
      Деморежим каталогу, бронювань, обраного, відгуків, переписки, звернень і фінансів: ці дані зберігаються лише у браузері. Акаунт та інші розділи працюють окремо.
      <button type="button" onClick={reset} style={{ marginLeft: 12 }}>Скинути демодані</button>
    </aside>}
    {children}
  </AppDataContext.Provider>;
}

// This module intentionally exposes its Provider and hook as the public Context API.
// eslint-disable-next-line react-refresh/only-export-components
export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
}
