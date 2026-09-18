// src/pages/ContactPage.tsx
import React from 'react';
import { MenuContactsTab } from '../components/menu/tabs/MenuContactsTab';

export const ContactPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <MenuContactsTab />
      </div>
    </div>
  );
};