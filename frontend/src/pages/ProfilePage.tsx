import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { AccountTab } from '../components/profile/tabs/AccountTab';
import { EditProfileTab } from '../components/profile/tabs/EditProfileTab';
import { PaymentsTab } from '../components/profile/tabs/PaymentsTab';
import { WalletTab } from '../components/profile/tabs/WalletTab';
import { FinanceTab } from '../components/profile/tabs/FinanceTab';
import { AnalyticsTab } from '../components/profile/tabs/AnalyticsTab';
import { SettingsTab } from '../components/profile/tabs/SettingsTab';
import { SecurityTab } from '../components/profile/tabs/SecurityTab';
import { LegalTab } from '../components/profile/tabs/LegalTab';
import { useAuth } from '../context/AuthContext';

export type ProfileTabKey =
  | 'account'
  | 'edit'
  | 'payments'
  | 'wallet'
  | 'finance'
  | 'analytics'
  | 'settings'
  | 'security'
  | 'legal';

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLandlord } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const currentTab = (searchParams.get('tab') as ProfileTabKey) || 'account';

  const handleTabChange = (tab: ProfileTabKey, sub?: string) => {
    const nextParams: Record<string, string> = { tab };
    if (sub) nextParams.sub = sub;
    setSearchParams(nextParams);
    setFeedbackMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Сайдбар з навігацією */}
        <ProfileSidebar activeTab={currentTab} onSelectTab={handleTabChange} />

        {/* Контент активної вкладки */}
        <div style={styles.contentArea}>
          {feedbackMessage && <div style={styles.feedbackBanner}>{feedbackMessage}</div>}

          {currentTab === 'account' && <AccountTab />}
          {currentTab === 'edit' && <EditProfileTab onNotify={setFeedbackMessage} />}
          {currentTab === 'payments' && <PaymentsTab onNotify={setFeedbackMessage} />}
          {currentTab === 'wallet' && <WalletTab onNotify={setFeedbackMessage} />}
          {currentTab === 'finance' && isLandlord && <FinanceTab />}
          {currentTab === 'analytics' && isLandlord && <AnalyticsTab />}
          {currentTab === 'settings' && <SettingsTab onNotify={setFeedbackMessage} />}
          {currentTab === 'security' && <SecurityTab onNotify={setFeedbackMessage} />}
          {currentTab === 'legal' && <LegalTab />}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#E1D4C2',
    padding: '40px 24px 80px 24px',
    boxSizing: 'border-box',
    fontFamily: "'Iosevka Charon', 'Manrope', 'DM Sans', sans-serif",
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: 0,
  },
  feedbackBanner: {
    padding: '14px 20px',
    backgroundColor: '#ECFDF5',
    color: '#059669',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: 700,
    border: '1px solid #A7F3D0',
  },
};