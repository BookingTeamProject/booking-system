import { useEffect, useState, type ReactNode } from 'react';
import { useAppData } from '../../context/AppDataContext';
import type { AssistanceSnapshot } from '../../data/contracts';
import { requestError } from '../../services/bookings.service';

export function AssistanceGate({ children }: { children: (snapshot: AssistanceSnapshot) => ReactNode }) {
  const { assistance } = useAppData();
  const [snapshot, setSnapshot] = useState<AssistanceSnapshot | null>(null);
  const [error, setError] = useState('');
  const [revision, retry] = useState(0);
  useEffect(() => {
    let active = true;
    if (assistance.available) assistance.load().then(data => { if (active) setSnapshot(data); })
      .catch(e => { if (active) setError(requestError(e)); });
    return () => { active = false; };
  }, [assistance, revision]);
  if (!assistance.available) return <section><h2>Сервіс звернень ще не реалізовано</h2>
    <p>Підтримка, контактна форма та апеляції доступні як демонстраційні сценарії. У цьому режимі звернення не приймаються.</p></section>;
  if (error) return <p role="alert">{error} <button onClick={() => { setError(''); retry(n => n + 1); }}>Повторити</button></p>;
  if (!snapshot) return <p role="status">Завантаження…</p>;
  return <><p role="status" style={{ padding: 16, background: '#fff3cd', borderRadius: 12 }}>
    Демонстрація: контакти та історія є прикладами. Звернення зберігаються лише у вашому браузері й не надсилаються операторам. Для вкладень зберігається лише назва файлу.
  </p>{children(snapshot)}</>;
}
