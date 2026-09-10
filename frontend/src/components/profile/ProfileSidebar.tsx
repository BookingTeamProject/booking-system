import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ProfileTabKey } from '../../pages/ProfilePage';

interface ProfileSidebarProps {
  activeTab: ProfileTabKey;
  onSelectTab: (tab: ProfileTabKey) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onSelectTab }) => {
  const navigate = useNavigate();
  const { user, isLandlord, logout } = useAuth();

  return (
    <aside style={styles.sidebarCard}>
      {/* Інформація про користувача */}
      <div style={styles.userHeader}>
        <img
          src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80'}
          alt="Avatar"
          style={styles.avatar}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={styles.userName}>
            {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Користувач' : 'Олександр Коваленко'}
          </div>
          <div style={styles.userRole}>
            {isLandlord ? 'Орендодавець (Хост)' : 'Орендар (Мандрівник)'}
          </div>
        </div>
      </div>

      <nav style={styles.navStack}>
        {/* 1. Редагувати профіль */}
        <button
          type="button"
          onClick={() => onSelectTab('edit')}
          style={activeTab === 'edit' ? styles.itemActive : styles.itemDefault}
        >
          <UserIcon active={activeTab === 'edit'} />
          <span>Редагувати профіль</span>
        </button>

        {/* 2. Обліковий запис */}
        <button
          type="button"
          onClick={() => onSelectTab('account')}
          style={activeTab === 'account' ? styles.itemActive : styles.itemDefault}
        >
          <HomeIcon active={activeTab === 'account'} />
          <span>Обліковий запис</span>
        </button>

        {/* 3. Платежі */}
        <button
          type="button"
          onClick={() => onSelectTab('payments')}
          style={activeTab === 'payments' ? styles.itemActive : styles.itemDefault}
        >
          <CreditCardIcon active={activeTab === 'payments'} />
          <span>Платежі</span>
        </button>

        {/* 4. Гаманець та клуб */}
        <button
          type="button"
          onClick={() => onSelectTab('wallet')}
          style={activeTab === 'wallet' ? styles.itemActive : styles.itemDefault}
        >
          <WalletIcon active={activeTab === 'wallet'} />
          <span>Гаманець та клуб</span>
        </button>

        {/* ========================================================================= */}
        {/* ХОСТ-ПАНЕЛЬ (ВКЛЮЧАЮЧИ "МЕНЮ МОЇХ ПОМЕШКАНЬ", ФІНАНСИ ТА АНАЛІТИКУ) */}
        {/* ========================================================================= */}
        {isLandlord && (
          <>
            <div style={styles.sectionDividerLabel}>ХОСТ-ПАНЕЛЬ</div>

            <button
              type="button"
              onClick={() => navigate('/menu?tab=properties')}
              style={styles.hostMenuBtn}
            >
              <PropertiesIcon />
              <span>Керування помешканнями</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('finance')}
              style={activeTab === 'finance' ? styles.itemActive : styles.itemDefault}
            >
              <CoinsIcon active={activeTab === 'finance'} />
              <span>Фінанси</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('analytics')}
              style={activeTab === 'analytics' ? styles.itemActive : styles.itemDefault}
            >
              <BarChartIcon active={activeTab === 'analytics'} />
              <span>Аналітика</span>
            </button>
          </>
        )}

        <div style={styles.sectionDividerLabel}>НАЛАШТУВАННЯ</div>
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          style={activeTab === 'settings' ? styles.itemActive : styles.itemDefault}
        >
          <SettingsIcon active={activeTab === 'settings'} />
          <span>Налаштування</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('security')}
          style={activeTab === 'security' ? styles.itemActive : styles.itemDefault}
        >
          <ShieldIcon active={activeTab === 'security'} />
          <span>Безпека</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('legal')}
          style={activeTab === 'legal' ? styles.itemActive : styles.itemDefault}
        >
          <FileTextIcon active={activeTab === 'legal'} />
          <span>Правова інформація</span>
        </button>

        {!isLandlord && (
          <button type="button" onClick={() => navigate('/routes/create')} style={styles.becomeHostBtn}>
            🏡 Здати житло в оренду
          </button>
        )}

        <button type="button" onClick={logout} style={styles.logoutBtn}>
          <LogOutIcon />
          <span>Вийти</span>
        </button>
      </nav>
    </aside>
  );
};

// ======================== SVG ІКОНКИ ========================

const UserIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12.67 14v-1.33A2.67 2.67 0 0 0 10 10H6a2.67 2.67 0 0 0-2.67 2.67V14M10.67 4.67a2.67 2.67 0 1 1-5.34 0 2.67 2.67 0 0 1 5.34 0Z" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 14V8.67a.67.67 0 0 0-.67-.67H6.67a.67.67 0 0 0-.67.67V14M2 6.67l5.14-4a1.33 1.33 0 0 1 1.72 0l5.14 4V12.67a1.33 1.33 0 0 1-1.33 1.33H3.33a1.33 1.33 0 0 1-1.33-1.33V6.67Z" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CreditCardIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.33 6.67h13.34M2.67 3.33h10.66a1.33 1.33 0 0 1 1.34 1.34v6.66a1.33 1.33 0 0 1-1.34 1.34H2.67a1.33 1.33 0 0 1-1.34-1.34V4.67a1.33 1.33 0 0 1 1.34-1.34Z" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WalletIcon = ({ active }: { active: boolean }) => (
  <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
    <path d="M14.88 12V15a.75.75 0 0 1-.75.75H3.54A1.42 1.42 0 0 1 2.13 14.25V3.75A1.42 1.42 0 0 1 3.54 2.25h9.21a.75.75 0 0 1 .75.75v2.25M2.13 3.75A1.42 1.42 0 0 1 3.54 5.25h10.63a.75.75 0 0 1 .75.75V9M14.88 9h-2.13A1.42 1.42 0 0 0 11.33 10.5a1.42 1.42 0 0 0 1.42 1.5h2.13" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PropertiesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#6E473B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="9 22 9 12 15 12 15 22" stroke="#6E473B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CoinsIcon = ({ active }: { active: boolean }) => (
  <svg width="17" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="9" r="7" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" />
    <path d="M15 15h6v6h-6z" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" />
  </svg>
);

const BarChartIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3.75 15.75V11.25M9 15.75V6.75M14.25 15.75V2.25" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SettingsIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" />
    <path d="M8 1.33v1.34M8 13.33v1.34M1.33 8h1.34M13.33 8h1.34" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8.23 14.63a9.7 9.7 0 0 0 5.1-6V4a.67.67 0 0 0-.66-.67c-1.34 0-3-.8-4.16-1.81a.7.7 0 0 0-1.02 0C6.33 2.53 4.67 3.33 3.33 3.33a.67.67 0 0 0-.66.67V8.67a9.7 9.7 0 0 0 5.11 5.96.67.67 0 0 0 .45 0Z" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FileTextIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" />
    <polyline points="14 2 14 8 20 8" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" />
    <line x1="16" y1="13" x2="8" y2="13" stroke={active ? 'white' : '#291C0E'} strokeWidth="2" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10.67 4.67 14 8l-3.33 3.33M14 8H6M6 14H3.33a1.33 1.33 0 0 1-1.33-1.33V3.33a1.33 1.33 0 0 1 1.33-1.33H6" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const styles: Record<string, React.CSSProperties> = {
  sidebarCard: {
    width: '270px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    padding: '20px 14px',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flexShrink: 0,
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '14px',
    borderBottom: '1px solid #D7C7B1',
  },
  avatar: {
    width: '46px',
    height: '46px',
    borderRadius: '23px',
    objectFit: 'cover',
    border: '2px solid #DC9666',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#291C0E',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userRole: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#DC9666',
    marginTop: '2px',
  },
  navStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemDefault: {
    width: '100%',
    padding: '11px 14px',
    background: 'none',
    border: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#6E473B',
    cursor: 'pointer',
    textAlign: 'left',
  },
  itemActive: {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: '#DC9666',
    border: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#FFFFFF',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 4px 12px rgba(220, 150, 102, 0.25)',
  },
  sectionDividerLabel: {
    fontSize: '10px',
    fontWeight: 800,
    color: '#A78D78',
    letterSpacing: '0.5px',
    padding: '10px 14px 2px 14px',
  },
  hostMenuBtn: {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: 'rgba(220, 150, 102, 0.12)',
    border: '1px solid #DC9666',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#6E473B',
    cursor: 'pointer',
    textAlign: 'left',
  },
  becomeHostBtn: {
    marginTop: '10px',
    padding: '11px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    border: '1.5px solid #DC9666',
    borderRadius: '12px',
    color: '#DC9666',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  logoutBtn: {
    marginTop: '10px',
    padding: '11px 14px',
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#C62828',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};