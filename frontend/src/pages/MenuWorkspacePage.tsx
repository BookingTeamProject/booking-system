// src/pages/MenuWorkspacePage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Сайдбар
import { MenuSidebar } from '../components/menu/MenuSidebar';

// Модульні вкладки з компонентами меню
import { MenuBookingsTab } from '../components/menu/tabs/MenuBookingsTab';
import { MenuPropertiesTab } from '../components/menu/tabs/MenuPropertiesTab';
import { MenuMessagesTab } from '../components/menu/tabs/MenuMessagesTab';
import { MenuNewsTab } from '../components/menu/tabs/MenuNewsTab';
import { MenuContactsTab } from '../components/menu/tabs/MenuContactsTab';
import { MenuRestrictionsTab } from '../components/menu/tabs/MenuRestrictionsTab';
import { MenuSupportTab } from '../components/menu/tabs/MenuSupportTab';

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
  const { user, isLandlord } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') as MenuTab;
  const [activeTab, setActiveTab] = useState<MenuTab>(tabParam || (isLandlord ? 'properties' : 'bookings'));

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabKey: MenuTab) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const userName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Олександр Петренко'
    : 'Олександр Петренко';

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: 'calc(100vh - 90px)', padding: '40px 60px 100px 60px' }}>
      <div style={{ maxWidth: '1720px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* ЛІВИЙ САЙДБАР FIGMA (362px) */}
        <MenuSidebar activeTab={activeTab} onTabChange={handleTabChange} />

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

          {/* Підключення правильних модульних вкладок */}
          {activeTab === 'bookings' && <MenuBookingsTab />}
          {activeTab === 'properties' && <MenuPropertiesTab />}
          {activeTab === 'messages' && <MenuMessagesTab />}
          {activeTab === 'news' && <MenuNewsTab />}
          {activeTab === 'contacts' && <MenuContactsTab />}
          {activeTab === 'restrictions' && <MenuRestrictionsTab />}
          {activeTab === 'support' && <MenuSupportTab />}
        </main>

      </div>
    </div>
  );
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