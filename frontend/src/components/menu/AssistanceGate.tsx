import { useEffect, useState, type ReactNode } from 'react';
import { useAppData } from '../../context/AppDataContext';
import type { AssistanceSnapshot } from '../../data/contracts';
import { requestError } from '../../services/bookings.service';
import {
  MOCK_CONTACT_OFFICE_INFO,
  MOCK_CONTACT_SUBJECTS,
  MOCK_PLATFORM_RULES,
  MOCK_RESTRICTION_HISTORY,
  MOCK_SUPPORT_CATEGORIES,
  MOCK_SUPPORT_TICKETS,
} from '../../data/mockData';

const previewSnapshot: AssistanceSnapshot = {
  tickets: MOCK_SUPPORT_TICKETS,
  restrictions: MOCK_RESTRICTION_HISTORY,
  categories: MOCK_SUPPORT_CATEGORIES,
  subjects: MOCK_CONTACT_SUBJECTS,
  office: MOCK_CONTACT_OFFICE_INFO,
  rules: MOCK_PLATFORM_RULES,
};

export function AssistanceGate({ children }: { children: (snapshot: AssistanceSnapshot) => ReactNode }) {
  const { assistance } = useAppData();
  const [snapshot, setSnapshot] = useState<AssistanceSnapshot | null>(
    assistance.available ? null : previewSnapshot,
  );
  const [error, setError] = useState('');
  const [revision, retry] = useState(0);
  useEffect(() => {
    let active = true;
    if (assistance.available) {
      assistance.load().then(data => { if (active) setSnapshot(data); })
        .catch(e => { if (active) setError(requestError(e)); });
    }
    return () => { active = false; };
  }, [assistance, revision]);
  if (error) return <p role="alert">{error} <button onClick={() => { setError(''); retry(n => n + 1); }}>Повторити</button></p>;
  if (!snapshot) return <p role="status">Завантаження…</p>;
  return <>
    {assistance.available && <p role="status" style={{ padding: 16, background: '#fff3cd', borderRadius: 12 }}>
      Демонстрація: контакти та історія є прикладами. Звернення зберігаються лише у вашому браузері й не надсилаються операторам. Для вкладень зберігається лише назва файлу.
    </p>}
    {children(snapshot)}
    {!assistance.available && <aside role="note" style={{ marginTop: 28, padding: 18, background: '#fff3cd', color: '#664d03', border: '1px solid #e4c66a', borderRadius: 16 }}>
      <strong>Демонстраційний розділ.</strong> Інтерфейс підтримки, контактів та апеляцій показано для презентації проєкту. Надсилання звернень операторам ще не підключено.
    </aside>}
  </>;
}
