// src/pages/MessagesPage.tsx
import React from 'react';
import { MenuMessagesTab } from '../components/menu/tabs/MenuMessagesTab';

export const MessagesPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: 'calc(100vh - 90px)', padding: '40px 60px 100px 60px' }}>
      <div style={{ maxWidth: '1720px', margin: '0 auto' }}>
        <MenuMessagesTab />
      </div>
    </div>
  );
};