import React, { useState } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import type { AppLanguage, AppCurrency } from '../../../services/storage.service';

export const SettingsTab: React.FC<{ onNotify: (msg: string) => void }> = ({ onNotify }) => {
  const { language, setLanguage, currency, setCurrency } = useSettings();

  // Стан випадних списків
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);

  // Стан перемикачів-тоглів
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const LANGUAGES: { id: AppLanguage; label: string }[] = [
    { id: 'UA', label: 'Українська (UA)' },
    { id: 'EN', label: 'English (EN)' },
    { id: 'DE', label: 'Deutsch (DE)' },
    { id: 'PL', label: 'Polski (PL)' },
  ];

  const CURRENCIES: { id: AppCurrency; label: string }[] = [
    { id: 'UAH', label: 'Українська гривня (₴)' },
    { id: 'USD', label: 'Долар США ($)' },
    { id: 'EUR', label: 'Євро (€)' },
    { id: 'PLN', label: 'Польський злотий (zł)' },
  ];

  const currentLangLabel = LANGUAGES.find((l) => l.id === language)?.label || 'Українська (UA)';
  const currentCurrLabel = CURRENCIES.find((c) => c.id === currency)?.label || 'Українська гривня (₴)';

  const handleDeleteAccount = () => {
    if (window.confirm('Ви впевнені, що бажаєте надіслати запит на видалення облікового запису?')) {
      onNotify('Запит на видалення облікового запису передано адміністратору.');
    }
  };

  return (
    <div style={styles.tabContainer}>
      {/* Welcome Section */}
      <header style={styles.welcomeSection}>
        <h1 style={styles.mainTitleAlegreya}>Налаштування профілю</h1>
        <p style={styles.subTitleText}>
          Керуйте сповіщеннями, безпекою, мовою інтерфейсу та конфіденційністю вашого акаунту.
        </p>
      </header>

      {/* 1. settings-card-notifications */}
      <section style={styles.settingsCard}>
        <div style={styles.cardHeaderTitle}>Канали сповіщень</div>

        <div style={styles.togglesList}>
          {/* Email */}
          <div style={styles.toggleItem}>
            <div style={styles.textGroup}>
              <div style={styles.toggleTitle}>Email сповіщення</div>
              <div style={styles.toggleDesc}>Надсилати підтвердження бронювань та новини на пошту</div>
            </div>
            <ToggleSwitch
              checked={emailNotif}
              onChange={() => {
                setEmailNotif(!emailNotif);
                onNotify(`Email-сповіщення ${!emailNotif ? 'увімкнено' : 'вимкнено'}`);
              }}
            />
          </div>

          <div style={styles.dividerLine} />

          {/* SMS */}
          <div style={styles.toggleItem}>
            <div style={styles.textGroup}>
              <div style={styles.toggleTitle}>SMS сповіщення</div>
              <div style={styles.toggleDesc}>Важливі оновлення про заїзд безпосередньо на ваш телефон</div>
            </div>
            <ToggleSwitch
              checked={smsNotif}
              onChange={() => {
                setSmsNotif(!smsNotif);
                onNotify(`SMS-сповіщення ${!smsNotif ? 'увімкнено' : 'вимкнено'}`);
              }}
            />
          </div>

          <div style={styles.dividerLine} />

          {/* Push */}
          <div style={styles.toggleItem}>
            <div style={styles.textGroup}>
              <div style={styles.toggleTitle}>Push-повідомлення в додатку</div>
              <div style={styles.toggleDesc}>Миттєві сповіщення на вашому пристрої про повідомлення від хостів</div>
            </div>
            <ToggleSwitch
              checked={pushNotif}
              onChange={() => {
                setPushNotif(!pushNotif);
                onNotify(`Push-сповіщення ${!pushNotif ? 'увімкнено' : 'вимкнено'}`);
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. settings-card-localization */}
      <section style={styles.settingsCard}>
        <div style={styles.cardHeaderTitle}>Мова та Валюта</div>

        <div style={styles.dropdownsRow}>
          {/* Вибір мови */}
          <div style={{ ...styles.dropdownGroup, position: 'relative' }}>
            <label style={styles.dropdownLabel}>Оберіть мову</label>
            <div
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsCurrOpen(false);
              }}
              style={styles.dropdownField}
            >
              <span style={{ color: '#291C0E', fontSize: '14px', fontWeight: 500 }}>{currentLangLabel}</span>
              <ChevronDownIcon />
            </div>

            {/* Меню Frame 344 з Figma */}
            {isLangOpen && (
              <div style={styles.frame344Dropdown}>
                {LANGUAGES.map((item) => {
                  const isSelected = item.id === language;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setLanguage(item.id);
                        setIsLangOpen(false);
                        onNotify(`Мову інтерфейсу змінено на: ${item.label}`);
                      }}
                      style={styles.menuOptionRow}
                    >
                      {isSelected ? <RadioBoxActiveFigma /> : <RadioBoxInactiveFigma />}
                      <span style={styles.menuOptionLabel}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Базова валюта */}
          <div style={{ ...styles.dropdownGroup, position: 'relative' }}>
            <label style={styles.dropdownLabel}>Базова валюта</label>
            <div
              onClick={() => {
                setIsCurrOpen(!isCurrOpen);
                setIsLangOpen(false);
              }}
              style={styles.dropdownField}
            >
              <span style={{ color: '#291C0E', fontSize: '14px', fontWeight: 500 }}>{currentCurrLabel}</span>
              <ChevronDownIcon />
            </div>

            {/* Меню Frame 346 з Figma */}
            {isCurrOpen && (
              <div style={styles.frame346Dropdown}>
                {CURRENCIES.map((item) => {
                  const isSelected = item.id === currency;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrency(item.id);
                        setIsCurrOpen(false);
                        onNotify(`Базову валюту змінено на: ${item.label}`);
                      }}
                      style={styles.menuOptionRow}
                    >
                      {isSelected ? <RadioBoxActiveFigma /> : <RadioBoxInactiveFigma />}
                      <span style={styles.menuOptionLabel}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. settings-card-privacy */}
      <section style={styles.settingsCard}>
        <div style={styles.cardHeaderTitle}>Конфіденційність</div>
        <div style={styles.toggleItem}>
          <div style={styles.textGroup}>
            <div style={styles.toggleTitle}>Публічний профіль</div>
            <div style={styles.toggleDesc}>
              Дозволити іншим мандрівникам бачити мої залишені відгуки на платформі
            </div>
          </div>
          <ToggleSwitch
            checked={publicProfile}
            onChange={() => {
              setPublicProfile(!publicProfile);
              onNotify(`Публічний профіль ${!publicProfile ? 'увімкнено' : 'приховано'}`);
            }}
          />
        </div>
      </section>

      {/* 4. settings-card-danger */}
      <section style={styles.dangerCard}>
        <div style={styles.dangerTitle}>Небезпечна зона</div>
        <div style={styles.dangerRow}>
          <div style={styles.textGroup}>
            <div style={styles.toggleTitle}>Видалити мій аккаунт</div>
            <div style={styles.toggleDesc}>
              Ця дія є незворотною. Усі ваші бронювання та дані будуть видалені назавжди.
            </div>
          </div>

          <button type="button" onClick={handleDeleteAccount} style={styles.btnDelete}>
            <TrashIcon />
            <span>Видалити аккаунт</span>
          </button>
        </div>
      </section>
    </div>
  );
};

// ======================== УНІВЕРСАЛЬНИЙ ПЕРЕМИКАЧ (ToggleSwitch) ========================

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: '44px',
      height: '24px',
      padding: '2px',
      borderRadius: '12px',
      backgroundColor: checked ? '#DC9666' : '#BEB5A9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: checked ? 'flex-end' : 'flex-start',
      cursor: 'pointer',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '10px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease',
      }}
    />
  </div>
);

// ======================== SVG ІКОНКИ З FIGMA ========================

// Радіобокс активний з Figma
const RadioBoxActiveFigma = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect width="18" height="18" rx="9" fill="#DC9666" />
  </svg>
);

// Радіобокс неактивний з Figma
const RadioBoxInactiveFigma = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" fill="white" stroke="#D7C7B1" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="#6E473B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 4h12M5.33 4V2.67a1.33 1.33 0 0 1 1.34-1.34h2.66a1.33 1.33 0 0 1 1.34 1.34V4M12.67 4v9.33a1.33 1.33 0 0 1-1.34 1.34H4.67a1.33 1.33 0 0 1-1.34-1.34V4"
      stroke="#C62828"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================

const styles: Record<string, React.CSSProperties> = {
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mainTitleAlegreya: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  subTitleText: {
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
    color: '#6E473B',
    margin: 0,
  },
  settingsCard: {
    padding: '28px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardHeaderTitle: {
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
  },
  togglesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toggleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  toggleTitle: {
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  toggleDesc: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  dividerLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  dropdownsRow: {
    display: 'flex',
    gap: '24px',
  },
  dropdownGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dropdownLabel: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  dropdownField: {
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  frame344Dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '6px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  frame346Dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '6px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  menuOptionRow: {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  menuOptionLabel: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
  },
  dangerCard: {
    padding: '28px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #C62828',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dangerTitle: {
    color: '#C62828',
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  dangerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  btnDelete: {
    padding: '12px 20px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '12px',
    border: '1px solid #C62828',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
  },
};