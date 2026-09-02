// src/pages/MenuWorkspacePage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Импортируем компоненты содержимого
import { MessagesPage } from './MessagesPage';
import { TenantBookingsPage } from './TenantBookingsPage';
import { HostAccommodationsPage } from './HostAccommodationsPage';
import { NewsPage } from './NewsPage';
import { ContactPage } from './ContactPage';
import { AccountStatusPage } from './AccountStatusPage';
import { FAQPage } from './FAQPage';

const formatAvatar = (url?: string | null): string => {
  if (!url) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&q=80';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = window.location.hostname !== 'localhost' ? 'https://trailsua.pp.ua' : 'http://localhost:5238';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export type MenuTab =
  | 'home'
  | 'messages'
  | 'bookings'
  | 'properties'
  | 'news'
  | 'contacts'
  | 'restrictions'
  | 'support';

export const MenuWorkspacePage: React.FC = () => {
  const { user, isLandlord, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') as MenuTab;
  const [activeTab, setActiveTab] = useState<MenuTab>(tabParam || (isLandlord ? 'properties' : 'messages'));

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabKey: MenuTab) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Олександр Петренко' : 'Олександр Петренко';
  const userRoleBadge = isLandlord ? 'ОРЕНДОДАВЕЦЬ З 2026' : 'ОРЕНДАР З 2025';

  return (
    <div style={{ maxWidth: '1440px', margin: '30px auto', padding: '0 24px 80px 24px', display: 'flex', gap: '32px' }}>
      {/* ЛЕВЫЙ САЙДБАР (ТОЧНО КАК НА СКРИНШОТЕ FIGMA) */}
      <aside style={sidebarWrapperStyle}>
        {/* Карточка пользователя сверху */}
        <div style={userCardStyle}>
          <img
            src={formatAvatar(user?.avatarUrl)}
            alt="avatar"
            style={avatarStyle}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&q=80';
            }}
          />
          <div>
            <div style={userNameStyle}>{userName}</div>
            <span style={roleBadgeStyle}>{userRoleBadge}</span>
          </div>
        </div>

        {/* Вертикальный список вкладок */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
          {/* 1. Головна хоста / кабінету */}
          <button
            onClick={() => handleTabChange('home')}
            style={activeTab === 'home' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>🏠</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{isLandlord ? 'Головна хоста' : 'Огляд акаунта'}</span>
          </button>

          {/* 2. Повідомлення (з бейджем) */}
          <button
            onClick={() => handleTabChange('messages')}
            style={activeTab === 'messages' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>💬</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Повідомлення</span>
            <span style={activeTab === 'messages' ? activeBadgeCounterStyle : badgeCounterStyle}>1</span>
          </button>

          {/* 3. Бронювання */}
          <button
            onClick={() => handleTabChange('bookings')}
            style={activeTab === 'bookings' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>📅</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Бронювання</span>
          </button>

          {/* 4. Керування помешканням */}
          <button
            onClick={() => handleTabChange('properties')}
            style={activeTab === 'properties' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>🛏️</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Керування помешканням</span>
          </button>

          {/* 5. Новини */}
          <button
            onClick={() => handleTabChange('news')}
            style={activeTab === 'news' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>📰</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Новини</span>
          </button>

          {/* 6. Контакти */}
          <button
            onClick={() => handleTabChange('contacts')}
            style={activeTab === 'contacts' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>🎧</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Контакти</span>
          </button>

          {/* 7. Обмеження акаунта */}
          <button
            onClick={() => handleTabChange('restrictions')}
            style={activeTab === 'restrictions' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Обмеження акаунта</span>
          </button>

          {/* 8. Служба підтримки */}
          <button
            onClick={() => handleTabChange('support')}
            style={activeTab === 'support' ? activeMenuItemStyle : menuItemStyle}
          >
            <span style={{ fontSize: '18px' }}>❓</span>
            <span style={{ flex: 1, textAlign: 'left' }}>Служба підтримки</span>
          </button>
        </div>

        {/* Кнопка выхода внизу */}
        <div style={{ marginTop: '28px', borderTop: '1px solid #E1D4C2', paddingTop: '16px' }}>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={logoutBtnStyle}
          >
            <span>🚪</span>
            <span>Вийти з акаунта</span>
          </button>
        </div>
      </aside>

      {/* ПРАВАЯ ЧАСТЬ: СОДЕРЖИМОЕ ВЫБРАННОЙ ВКЛАДКИ */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {activeTab === 'home' && (
          <div style={contentCardBoxStyle}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#291C0E', margin: '0 0 12px 0' }}>
              Вітаємо у робочому просторі Trails UA, {userName}!
            </h1>
            <p style={{ color: '#6E473B', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Оберіть потрібний розділ у бічному меню ліворуч для перегляду повідомлень, керування бронями або редагування житла.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div onClick={() => handleTabChange('messages')} style={quickActionCardStyle}>
                <span style={{ fontSize: '28px' }}>💬</span>
                <strong style={{ fontSize: '15px', color: '#291C0E', marginTop: '6px' }}>Повідомлення</strong>
                <span style={{ fontSize: '12px', color: '#DC9666' }}>1 нове повідомлення</span>
              </div>
              <div onClick={() => handleTabChange('bookings')} style={quickActionCardStyle}>
                <span style={{ fontSize: '28px' }}>📅</span>
                <strong style={{ fontSize: '15px', color: '#291C0E', marginTop: '6px' }}>Бронювання</strong>
                <span style={{ fontSize: '12px', color: '#059669' }}>Активні заїзди</span>
              </div>
              <div onClick={() => handleTabChange('properties')} style={quickActionCardStyle}>
                <span style={{ fontSize: '28px' }}>🛏️</span>
                <strong style={{ fontSize: '15px', color: '#291C0E', marginTop: '6px' }}>Мої помешкання</strong>
                <span style={{ fontSize: '12px', color: '#6E473B' }}>Керування та ціни</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && <MessagesPage />}
        {activeTab === 'bookings' && <TenantBookingsPage />}
        {activeTab === 'properties' && <HostAccommodationsPage />}
        {activeTab === 'news' && <NewsPage />}
        {activeTab === 'contacts' && <ContactPage />}
        {activeTab === 'restrictions' && <AccountStatusPage />}
        {activeTab === 'support' && <FAQPage />}
      </main>
    </div>
  );
};

// Стили
const sidebarWrapperStyle: React.CSSProperties = {
  width: '300px',
  flexShrink: 0,
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '20px 16px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 6px 24px rgba(41,28,14,0.04)',
  height: 'fit-content',
};

const userCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  backgroundColor: '#FFFFFF',
  borderRadius: '18px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 2px 10px rgba(41,28,14,0.04)',
};

const avatarStyle: React.CSSProperties = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  objectFit: 'cover',
};

const userNameStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 800,
  color: '#291C0E',
  marginBottom: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px',
};

const roleBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontSize: '10px',
  fontWeight: 800,
  padding: '3px 8px',
  borderRadius: '8px',
  letterSpacing: '0.4px',
};

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  border: 'none',
  background: 'transparent',
  borderRadius: '14px',
  color: '#291C0E',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const activeMenuItemStyle: React.CSSProperties = {
  ...menuItemStyle,
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontWeight: 700,
  boxShadow: '0 4px 14px rgba(220,150,102,0.3)',
};

const badgeCounterStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontSize: '11px',
  fontWeight: 700,
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const activeBadgeCounterStyle: React.CSSProperties = {
  ...badgeCounterStyle,
  backgroundColor: '#FFFFFF',
  color: '#DC9666',
};

const logoutBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 14px',
  border: 'none',
  background: 'transparent',
  borderRadius: '12px',
  color: '#DC2626',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
};

const contentCardBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '36px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 20px rgba(41,28,14,0.04)',
};

const quickActionCardStyle: React.CSSProperties = {
  backgroundColor: '#FAF5EE',
  borderRadius: '16px',
  padding: '22px 18px',
  border: '1px solid #E1D4C2',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
};