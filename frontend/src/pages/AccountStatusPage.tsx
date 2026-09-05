// src/pages/AccountStatusPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AccountStatusPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'status' | 'delete'>('status');
  const [deleteReason, setDeleteReason] = useState('Більше не планую подорожувати');

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Ви дійсно бажаєте безповоротно видалити ваш обліковий запис?')) {
      logout();
      alert('Обліковий запис успішно видалено.');
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px 80px 20px' }}>
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #E1D4C2', paddingBottom: '10px', marginBottom: '28px' }}>
        <button style={tab === 'status' ? activeTabStyle : tabStyle} onClick={() => setTab('status')}>
          🛡️ Статус та обмеження акаунта
        </button>
        <button style={tab === 'delete' ? activeTabStyle : tabStyle} onClick={() => setTab('delete')}>
          🗑️ Видалення облікового запису
        </button>
      </div>

      {tab === 'status' && (
        <div style={cardBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>✅</span>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: 0 }}>
                Статус акаунта: Активний та Верифікований
              </h2>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>Жодних обмежень не застосовано</span>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#6E473B', lineHeight: 1.6, margin: 0 }}>
            Ваш профіль пройшов перевірку безпеки Trails UA. Ви маєте повний доступ до бронювання житла, додавання відгуків та отримання кешбеку.
          </p>
        </div>
      )}

      {tab === 'delete' && (
        <div style={cardBoxStyle}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#DC2626', margin: '0 0 8px 0' }}>
            Видалити обліковий запис
          </h2>
          <p style={{ fontSize: '13px', color: '#6E473B', marginBottom: '20px' }}>
            Ця дія є незворотною. Усі ваші накопичені знижки, бонуси та історія поїздок будуть видалені назавжди.
          </p>

          <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#6E473B' }}>Вкажіть причину видалення:</label>
            <select value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} style={selectStyle}>
              <option value="Більше не планую подорожувати">Більше не планую подорожувати</option>
              <option value="Створюю новий акаунт">Створюю новий акаунт</option>
              <option value="Проблеми з сервісом">Проблеми з роботою сайту</option>
            </select>
            <button type="submit" style={dangerDeleteBtnStyle}>
              Безповоротно видалити акаунт
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const cardBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid #E1D4C2', boxShadow: '0 4px 18px rgba(41,28,14,0.04)' };
const tabStyle: React.CSSProperties = { padding: '10px 18px', border: 'none', background: 'none', fontSize: '14px', fontWeight: 600, color: '#6E473B', cursor: 'pointer', borderRadius: '10px' };
const activeTabStyle: React.CSSProperties = { ...tabStyle, backgroundColor: '#DC9666', color: '#FFFFFF', fontWeight: 700 };
const selectStyle: React.CSSProperties = { padding: '12px', borderRadius: '12px', border: '1px solid #BEB5A9', fontSize: '14px', outline: 'none' };
const dangerDeleteBtnStyle: React.CSSProperties = { backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '13px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '10px' };