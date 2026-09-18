import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { MenuTab } from '../../pages/MenuWorkspacePage';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import { DeleteAccountModal } from '../modals/DeleteAccountModal';

interface MenuSidebarProps {
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
}

const formatAvatar = (url?: string | null): string => {
  if (!url) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&q=80';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = window.location.hostname !== 'localhost' ? 'https://trailsua.pp.ua' : 'http://localhost:5238';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const MenuSidebar: React.FC<MenuSidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, isLandlord, logout } = useAuth();
  const navigate = useNavigate();

  // Стани відкриття модалок із Figma
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const userName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Олександр Петренко'
    : 'Олександр Петренко';

  const userRoleBadge = isLandlord ? 'Господар з 2026' : 'Орендар з 2025';

  // Підтвердження виходу
  const handleConfirmLogout = (_allDevices: boolean) => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  // Підтвердження видалення акаунта
  const handleConfirmDelete = (_reason: string) => {
    setIsDeleteModalOpen(false);
    logout();
    alert('Запит на видалення облікового запису успішно прийнято в обробку.');
    navigate('/');
  };

  return (
    <>
      <aside style={styles.sidebarContainer}>
        {/* ВЕРХНЯ ЧАСТИНА: МІНІ-КАРТКА ТА НАВІГАЦІЯ */}
        <div style={styles.topSection}>
          {/* Міні-картка користувача з Figma */}
          <div style={styles.userMiniCard}>
            <img
              src={formatAvatar(user?.avatarUrl)}
              alt="Аватар користувача"
              style={styles.userAvatarImg}
            />
            <div style={styles.userInfoCol}>
              <div style={styles.userNameText}>{userName}</div>
              <span style={styles.roleBadgePill}>{userRoleBadge}</span>
            </div>
          </div>

          {/* Список навігації */}
          <nav style={styles.navList}>
            {/* 1. Головна хоста */}
            <button
              type="button"
              onClick={() => onTabChange('home')}
              style={activeTab === 'home' ? styles.navItemActive : styles.navItemDefault}
            >
              <HomeIcon active={activeTab === 'home'} />
              <span style={styles.navLabel}>Головна хоста</span>
            </button>

            {/* 2. Повідомлення (з лічильником 3) */}
            <button
              type="button"
              onClick={() => onTabChange('messages')}
              style={activeTab === 'messages' ? styles.navItemActive : styles.navItemDefault}
            >
              <MessageSquareIcon active={activeTab === 'messages'} />
              <span style={styles.navLabel}>Повідомлення</span>
              <span style={activeTab === 'messages' ? styles.counterBadgeActive : styles.counterBadgeDefault}>
                3
              </span>
            </button>

            {/* 3. Бронювання */}
            <button
              type="button"
              onClick={() => onTabChange('bookings')}
              style={activeTab === 'bookings' ? styles.navItemActive : styles.navItemDefault}
            >
              <CalendarIcon active={activeTab === 'bookings'} />
              <span style={styles.navLabel}>Бронювання</span>
            </button>

            {/* 4. Керування помешканням */}
            <button
              type="button"
              onClick={() => onTabChange('properties')}
              style={activeTab === 'properties' ? styles.navItemActive : styles.navItemDefault}
            >
              <BedIcon active={activeTab === 'properties'} />
              <span style={styles.navLabel}>Керування помешканням</span>
            </button>

            {/* 5. Новини */}
            <button
              type="button"
              onClick={() => onTabChange('news')}
              style={activeTab === 'news' ? styles.navItemActive : styles.navItemDefault}
            >
              <NewspaperIcon active={activeTab === 'news'} />
              <span style={styles.navLabel}>Новини</span>
            </button>

            {/* 6. Контакти */}
            <button
              type="button"
              onClick={() => onTabChange('contacts')}
              style={activeTab === 'contacts' ? styles.navItemActive : styles.navItemDefault}
            >
              <HeadsetIcon active={activeTab === 'contacts'} />
              <span style={styles.navLabel}>Контакти</span>
            </button>

            {/* 7. Обмеження акаунта */}
            <button
              type="button"
              onClick={() => onTabChange('restrictions')}
              style={activeTab === 'restrictions' ? styles.navItemActive : styles.navItemDefault}
            >
              <ShieldAlertIcon active={activeTab === 'restrictions'} />
              <span style={styles.navLabel}>Обмеження акаунта</span>
            </button>

            {/* 8. Служба підтримки */}
            <button
              type="button"
              onClick={() => onTabChange('support')}
              style={activeTab === 'support' ? styles.navItemActive : styles.navItemDefault}
            >
              <HelpCircleIcon active={activeTab === 'support'} />
              <span style={styles.navLabel}>Служба підтримки</span>
            </button>
          </nav>
        </div>

        {/* НИЖНЯ ЧАСТИНА: ДВІ ЧЕРВОНІ КНОПКИ З FIGMA */}
        <div style={styles.bottomSection}>
          <div style={styles.dividerLine} />

          {/* Вийти з акаунта */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            style={styles.btnLogoutSolid}
          >
            <LogOutIcon />
            <span>Вийти з акаунта</span>
          </button>

          {/* Видалити аккаунт */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            style={styles.btnDeleteOutline}
          >
            <TrashIcon />
            <span>Видалити аккаунт</span>
          </button>
        </div>
      </aside>

      {/* МОДАЛЬНІ ВІКНА З FIGMA */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        userEmail={user?.email}
      />
    </>
  );
};

// ======================== SVG ІКОНКИ З FIGMA ========================

const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M2.25 7.5L9 2.25L15.75 7.5V15C15.75 15.4142 15.4142 15.75 15 15.75H3C2.58579 15.75 2.25 15.4142 2.25 15V7.5Z"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MessageSquareIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M15.5 12.5C15.5 13.0523 15.0523 13.5 14.5 13.5H4.5L1.5 16.5V3.5C1.5 2.94772 1.94772 2.5 2.5 2.5H14.5C15.0523 2.5 15.5 2.94772 15.5 3.5V12.5Z"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect
      x="2.25"
      y="3.75"
      width="13.5"
      height="12"
      rx="2"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
    />
    <line x1="6" y1="1.5" x2="6" y2="4.5" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="1.5" x2="12" y2="4.5" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
    <line x1="2.25" y1="7.5" x2="15.75" y2="7.5" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" />
  </svg>
);

const BedIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M1.5 3V15M1.5 9H16.5M16.5 9V15M16.5 9C16.5 7.34315 15.1569 6 13.5 6H7.5C5.84315 6 4.5 7.34315 4.5 9M4.5 6V4.5"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NewspaperIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M14.25 15.75H3.75C2.92157 15.75 2.25 15.0784 2.25 14.25V3.75C2.25 2.92157 2.92157 2.25 3.75 2.25H12L15.75 6V14.25C15.75 15.0784 15.0784 15.75 14.25 15.75Z"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="5.25" y1="6.75" x2="9.75" y2="6.75" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
    <line x1="5.25" y1="9.75" x2="12.75" y2="9.75" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
    <line x1="5.25" y1="12.75" x2="12.75" y2="12.75" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HeadsetIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M2.25 9V8.25C2.25 4.52208 5.27208 1.5 9 1.5C12.7279 1.5 15.75 4.52208 15.75 8.25V9M2.25 9H4.5C5.32843 9 6 9.67157 6 10.5V13.5C6 14.3284 5.32843 15 4.5 15H3C2.58579 15 2.25 14.6642 2.25 14.25V9ZM15.75 9H13.5C12.6716 9 12 9.67157 12 10.5V13.5C12 14.3284 12.6716 15 13.5 15H15C15.4142 15 15.75 14.6642 15.75 14.25V9Z"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldAlertIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 1.5L2.25 4.5V9C2.25 13.125 5.1375 16.275 9 16.5C12.8625 16.275 15.75 13.125 15.75 9V4.5L9 1.5Z"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="9" y1="6" x2="9" y2="9.75" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="12.75" r="0.75" fill={active ? '#FFFFFF' : '#291C0E'} />
  </svg>
);

const HelpCircleIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="6.75" stroke={active ? '#FFFFFF' : '#291C0E'} strokeWidth="2" />
    <path
      d="M6.8175 7.125C6.9894 6.6363 7.3287 6.2241 7.7754 5.9616C8.2221 5.6991 8.7471 5.6031 9.2577 5.6907C9.7683 5.7783 10.2315 6.0438 10.5651 6.4401C10.8987 6.8364 11.0811 7.338 11.0805 7.8562C11.0805 9.3187 8.8875 10.05 8.8875 10.05M9 12.75H9.0075"
      stroke={active ? '#FFFFFF' : '#291C0E'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LogOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75M12 12.75L15.75 9L12 5.25M15.75 9H6.75"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M2.25 4.5H15.75M6 4.5V3C6 2.58579 6.33579 2.25 6.75 2.25H11.25C11.6642 2.25 12 2.58579 12 3V4.5M14.25 4.5V15C14.25 15.4142 13.9142 15.75 13.5 15.75H4.5C4.08579 15.75 3.75 15.4142 3.75 15V4.5"
      stroke="#C62828"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ======================== СТИЛІ САЙДБАРУ ========================

const styles: Record<string, React.CSSProperties> = {
  sidebarContainer: {
    width: '362px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    padding: '30px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '880px',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  userMiniCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatarImg: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    objectFit: 'cover',
  },
  userInfoCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userNameText: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  roleBadgePill: {
    display: 'inline-block',
    backgroundColor: '#DC9666',
    color: 'white',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '6px',
    alignSelf: 'flex-start',
  },
  navList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  navItemDefault: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: 'none',
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#DC9666',
    borderRadius: '12px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 4px 14px rgba(220, 150, 102, 0.25)',
  },
  navLabel: {
    flex: 1,
  },
  counterBadgeDefault: {
    backgroundColor: '#DC9666',
    color: 'white',
    fontSize: '11px',
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '12px',
  },
  counterBadgeActive: {
    backgroundColor: '#FFFFFF',
    color: '#DC9666',
    fontSize: '11px',
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '12px',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '32px',
  },
  dividerLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  btnLogoutSolid: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#C62828',
    color: '#FFFFFF',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
  },
  btnDeleteOutline: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    color: '#C62828',
    borderRadius: '12px',
    border: '1px solid #C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
  },
};