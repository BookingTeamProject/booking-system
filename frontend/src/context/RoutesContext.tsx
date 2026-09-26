import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAppData } from './AppDataContext';
import { useAuth } from './AuthContext';
import type { RouteItem } from '../types';
import { requestError } from '../services/bookings.service';

interface RoutesContextValue {
  routes: RouteItem[];
  favorites: string[];
  loading: boolean;
  toggleFavorite: (id: string) => Promise<void>;
}
const RoutesContext = createContext<RoutesContextValue | null>(null);

export function RoutesProvider({ children }: { children: ReactNode }) {
  const source = useAppData();
  const { user } = useAuth();
  const userId = user?.id;
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => source.subscribeProperties?.(() => {
    setLoading(true);
    setRevision(value => value + 1);
  }), [source]);
  useEffect(() => {
    let active = true;
    Promise.all([source.properties.getAll(), userId ? source.favorites.getMyFavorites() : Promise.resolve([])])
      .then(([properties, favoriteItems]) => {
        if (!active) return;
        setRoutes(properties);
        setFavorites(favoriteItems.map(item => typeof item === 'string' ? item : item.id));
      }).catch(err => { if (active) setError(requestError(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [source, userId, revision]);
  const toggleFavorite = async (id: string) => {
    try {
      const result = await source.favorites.toggle(id);
      setFavorites(items => result.isFavorite ? [...new Set([...items, id])] : items.filter(item => item !== id));
    } catch (err) { setError(requestError(err)); }
  };
  return <RoutesContext.Provider value={{ routes, favorites, loading, toggleFavorite }}>
    {error && <div role="alert" style={{ padding: 12, color: '#a42626' }}>{error} <button onClick={() => { setError(''); setLoading(true); setRevision(v => v + 1); }}>Повторити</button></div>}
    {children}
  </RoutesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRoutes() {
  const context = useContext(RoutesContext);
  if (!context) throw new Error('useRoutes must be used within RoutesProvider');
  return context;
}
