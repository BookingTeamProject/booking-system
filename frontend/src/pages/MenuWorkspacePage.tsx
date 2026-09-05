// src/pages/MenuWorkspacePage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Імпортуємо розділи
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
  const userRoleBadge = isLandlord ? 'ОРЕНДАР З 2026' : 'ОРЕНДАР З 2025';

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: 'calc(100vh - 90px)', padding: '40px 60px 100px 60px' }}>
      <div style={{ maxWidth: '1720px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* ЛІВИЙ САЙДБАР FIGMA (362px) */}
        <aside style={figmaSidebarContainerStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Міні-картка профілю */}
            <div style={userMiniCardStyle}>
              <img
                src={formatAvatar(user?.avatarUrl)}
                alt="user avatar"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={userNameTextStyle}>{userName}</div>
                <span style={roleBadgeFigmaStyle}>{userRoleBadge}</span>
              </div>
            </div>

            {/* Навігаційний список меню */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              
              {/* Головна хоста */}
              <button
                onClick={() => handleTabChange('home')}
                style={activeTab === 'home' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>🏠</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Головна хоста</span>
              </button>

              {/* Повідомлення (з лічильником 3 з Figma) */}
              <button
                onClick={() => handleTabChange('messages')}
                style={activeTab === 'messages' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>💬</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Повідомлення</span>
                <span style={activeTab === 'messages' ? activeCounterPillStyle : counterPillStyle}>3</span>
              </button>

              {/* Бронювання */}
              <button
                onClick={() => handleTabChange('bookings')}
                style={activeTab === 'bookings' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>📅</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Бронювання</span>
              </button>

              {/* Керування помешканням */}
              <button
                onClick={() => handleTabChange('properties')}
                style={activeTab === 'properties' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>🛏️</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Керування помешканням</span>
              </button>

              {/* Новини */}
              <button
                onClick={() => handleTabChange('news')}
                style={activeTab === 'news' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>📰</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Новини</span>
              </button>

              {/* Контакти */}
              <button
                onClick={() => handleTabChange('contacts')}
                style={activeTab === 'contacts' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>🎧</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Контакти</span>
              </button>

              {/* Обмеження акаунта */}
              <button
                onClick={() => handleTabChange('restrictions')}
                style={activeTab === 'restrictions' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>🛡️</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Обмеження акаунта</span>
              </button>

              {/* Служба підтримки */}
              <button
                onClick={() => handleTabChange('support')}
                style={activeTab === 'support' ? activeSidebarItemStyle : regularSidebarItemStyle}
              >
                <span>❓</span>
                <span style={{ flex: 1, textAlign: 'left' }}>Служба підтримки</span>
              </button>

            </div>
          </div>

          {/* Нижня частина сайдбару з червоними кнопками виходу */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #D7C7B1' }}>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={logoutRedFilledBtnStyle}
            >
              <span>🚪</span>
              <span>Вийти з акаунта</span>
            </button>

            <button
              onClick={() => alert('Запит на видалення акаунта надіслано до служби безпеки.')}
              style={deleteAccountOutlineBtnStyle}
            >
              <span>🗑️</span>
              <span>Видалити акаунт</span>
            </button>
          </div>
        </aside>

        {/* ПРАВА ЧАСТИНА: ВМІСТ РОБОЧОГО ПРОСТОРУ */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'home' && (
            <div style={homeWelcomeCardStyle}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#291C0E', margin: '0 0 12px 0', fontFamily: "'Alegreya', serif" }}>
                Вітаємо у консолі керування, {userName}!
              </h1>
              <p style={{ color: '#6E473B', fontSize: '15px', lineHeight: '24px', marginBottom: '28px' }}>
                Тут зібрані всі інструменти для управління вашими котеджами, перегляду календаря зайнятості та модерації гостей.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div onClick={() => handleTabChange('properties')} style={quickActionBoxStyle}>
                  <span style={{ fontSize: '32px' }}>🛏️</span>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E', marginTop: '8px' }}>Мої помешкання</div>
                  <span style={{ color: '#DC9666', fontSize: '13px' }}>Керування та тарифи →</span>
                </div>
                <div onClick={() => handleTabChange('messages')} style={quickActionBoxStyle}>
                  <span style={{ fontSize: '32px' }}>💬</span>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E', marginTop: '8px' }}>Повідомлення</div>
                  <span style={{ color: '#DC9666', fontSize: '13px' }}>3 нових запити →</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && <HostAccommodationsPage />}
          {activeTab === 'messages' && <MessagesPage />}
          {activeTab === 'bookings' && <TenantBookingsPage />}
          {activeTab === 'news' && <NewsPage />}
          {activeTab === 'contacts' && <ContactPage />}
          {activeTab === 'restrictions' && <AccountStatusPage />}
          {activeTab === 'support' && <FAQPage />}
        </main>

      </div>
    </div>
  );
};

// ======================= СТИЛІ САЙДБАРУ =======================

const figmaSidebarContainerStyle: React.CSSProperties = {
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
};

const userMiniCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const userNameTextStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '15px',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const roleBadgeFigmaStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#DC9666',
  color: 'white',
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  padding: '2px 8px',
  borderRadius: '6px',
  marginTop: '4px',
};

const regularSidebarItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: 'none',
  color: '#6E473B',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const activeSidebarItemStyle: React.CSSProperties = {
  ...regularSidebarItemStyle,
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontWeight: 700,
  boxShadow: '0 4px 14px rgba(220, 150, 102, 0.25)',
};

const counterPillStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: 'white',
  fontSize: '11px',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '12px',
};

const activeCounterPillStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  color: '#DC9666',
  fontSize: '11px',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '12px',
};

const logoutRedFilledBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#C62828',
  color: '#FFFFFF',
  borderRadius: '12px',
  border: 'none',
  fontSize: '14px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
};

const deleteAccountOutlineBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'rgba(198, 40, 40, 0.15)',
  color: '#C62828',
  borderRadius: '12px',
  border: '1px solid #C62828',
  fontSize: '14px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
};

const homeWelcomeCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  padding: '40px',
  boxShadow: '0 4px 20px rgba(41,28,14,0.04)',
};

const quickActionBoxStyle: React.CSSProperties = {
  backgroundColor: '#F7F3EE',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid #D7C7B1',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'transform 0.2s ease',
};