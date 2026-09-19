// src/pages/AccountStatusPage.tsx
import React from 'react';
import { MenuRestrictionsTab } from '../components/menu/tabs/MenuRestrictionsTab';

export const AccountStatusPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <MenuRestrictionsTab />
      </div>
    </div>
  );
};