import React, { useState } from 'react';
import api from '../../../api/axios';

export const SecurityTab: React.FC<{ onNotify: (msg: string) => void }> = ({ onNotify }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Новий пароль та підтвердження не співпадають');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль повинен містити щонайменше 6 символів');
      return;
    }

    setLoading(true);
    try {
      await api.post('/user/change-password', {
        currentPassword: oldPassword,
        newPassword: newPassword,
      });

      onNotify('Пароль успішно змінено!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || 'Помилка зміни пароля. Перевірте поточний пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1Alegreya}>Безпека та пароль</h1>
        <p style={styles.subText}>Керуйте безпекою доступу до вашого облікового запису TrailsUA.</p>
      </header>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.securityGrid}>
        {/* Картка 1: Зміна пароля */}
        <section style={styles.cardBox}>
          <h2 style={styles.h2Alegreya}>Зміна пароля</h2>

          <form onSubmit={handleChangePassword} style={styles.formStack}>
            <div>
              <label style={styles.fieldLabel}>Поточний пароль</label>
              <div style={styles.inputPassWrapper}>
                <input
                  type={showOldPass ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Введіть старий пароль"
                  style={styles.purePassInput}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  style={styles.eyeToggleBtn}
                >
                  <EyeIcon open={showOldPass} />
                </button>
              </div>
            </div>

            <div>
              <label style={styles.fieldLabel}>Новий пароль</label>
              <div style={styles.inputPassWrapper}>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Щонайменше 6 символів"
                  style={styles.purePassInput}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  style={styles.eyeToggleBtn}
                >
                  <EyeIcon open={showNewPass} />
                </button>
              </div>
            </div>

            <div>
              <label style={styles.fieldLabel}>Підтвердити новий пароль</label>
              <div style={styles.inputPassWrapper}>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторіть новий пароль"
                  style={styles.purePassInput}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={styles.eyeToggleBtn}
                >
                  <EyeIcon open={showConfirmPass} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Збереження...' : 'Оновити пароль'}
            </button>
          </form>
        </section>

        {/* Картка 2: Двофакторна автентифікація та сесії */}
        <div style={styles.sideSecurityCol}>
          <section style={styles.cardBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ ...styles.h2Alegreya, margin: 0 }}>Двофакторна автентифікація</h2>
                <div style={styles.hintText}>Додатковий захист входу за допомогою SMS-коду</div>
              </div>
              <div
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  onNotify(`2FA ${!twoFactorEnabled ? 'активовано' : 'вимкнено'}`);
                }}
                style={twoFactorEnabled ? styles.toggleOn : styles.toggleOff}
              >
                <div style={styles.toggleKnob} />
              </div>
            </div>
          </section>

          <section style={styles.cardBox}>
            <h2 style={styles.h2Alegreya}>Активні сесії</h2>
            <div style={styles.sessionItem}>
              <span style={{ fontSize: '20px' }}>💻</span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#291C0E', fontSize: '14px' }}>Chrome на macOS (Поточна сесія)</strong>
                <div style={{ color: '#2E7D32', fontSize: '12px' }}>● Онлайн • Київ, Україна</div>
              </div>
            </div>

            <div style={styles.sessionItem}>
              <span style={{ fontSize: '20px' }}>📱</span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#291C0E', fontSize: '14px' }}>TrailsUA App на iPhone 15</strong>
                <div style={{ color: '#A78D78', fontSize: '12px' }}>Активно 2 години тому</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNotify('Всі інші сесії успішно завершено!')}
              style={styles.terminateSessionsBtn}
            >
              Завершити всі інші сесії
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

// Іконка ока
const EyeIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2" strokeLinecap="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  h1Alegreya: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  subText: {
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#6E473B',
    margin: 0,
  },
  securityGrid: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    padding: '32px',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    flex: 1,
  },
  sideSecurityCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  h2Alegreya: {
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  formStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 600,
    color: '#6E473B',
    marginBottom: '6px',
  },
  inputPassWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    border: '1px solid #D7C7B1',
    backgroundColor: '#FFFFFF',
    paddingRight: '10px',
  },
  purePassInput: {
    width: '100%',
    padding: '12px 14px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    borderRadius: '10px',
  },
  eyeToggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    padding: '14px 28px',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginTop: '6px',
  },
  hintText: {
    fontSize: '13px',
    color: '#A78D78',
    marginTop: '4px',
  },
  toggleOn: {
    width: '44px',
    height: '24px',
    padding: '2px',
    borderRadius: '12px',
    backgroundColor: '#DC9666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  toggleOff: {
    width: '44px',
    height: '24px',
    padding: '2px',
    borderRadius: '12px',
    backgroundColor: '#BEB5A9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  toggleKnob: {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #F8F5F0',
  },
  terminateSessionsBtn: {
    background: 'none',
    border: 'none',
    color: '#C62828',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
    marginTop: '8px',
  },
  errorBanner: {
    padding: '12px 16px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid #F8B4B4',
  },
};