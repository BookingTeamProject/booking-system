import React from 'react';
import type { MenuTab } from '../../../pages/MenuWorkspacePage';

interface MenuDashboardTabProps {
  userName: string;
  onTabChange: (tab: MenuTab) => void;
}

export const MenuDashboardTab: React.FC<MenuDashboardTabProps> = ({ userName, onTabChange }) => {
  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Вітаємо у консолі керування, {userName}!</h1>
      <p style={styles.desc}>
        Тут зібрані всі інструменти для управління вашими котеджами, перегляду календаря зайнятості та модерації гостей.
      </p>

      <div style={styles.grid}>
        <div onClick={() => onTabChange('properties')} style={styles.actionBox}>
          <span style={{ fontSize: '36px' }}>🛏️</span>
          <div style={styles.boxTitle}>Мої помешкання</div>
          <span style={styles.linkText}>Керування та тарифи →</span>
        </div>

        <div onClick={() => onTabChange('messages')} style={styles.actionBox}>
          <span style={{ fontSize: '36px' }}>💬</span>
          <div style={styles.boxTitle}>Повідомлення</div>
          <span style={styles.linkText}>3 нових діалоги →</span>
        </div>

        <div onClick={() => onTabChange('bookings')} style={styles.actionBox}>
          <span style={{ fontSize: '36px' }}>📅</span>
          <div style={styles.boxTitle}>Бронювання</div>
          <span style={styles.linkText}>Переглянути замовлення →</span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(41,28,14,0.04)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#291C0E',
    margin: '0 0 12px 0',
    fontFamily: "'Alegreya', serif",
  },
  desc: {
    color: '#6E473B',
    fontSize: '15px',
    lineHeight: '24px',
    marginBottom: '28px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  actionBox: {
    backgroundColor: '#F8F5F0',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #D7C7B1',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    transition: 'transform 0.2s ease',
  },
  boxTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#291C0E',
    margin: '12px 0 4px 0',
  },
  linkText: {
    color: '#DC9666',
    fontSize: '13px',
    fontWeight: 700,
  },
};