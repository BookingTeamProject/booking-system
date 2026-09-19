import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  MOCK_CONTACT_OFFICE_INFO,
  MOCK_CONTACT_SUBJECTS,
} from '../../../data/mockData';

export const MenuContactsTab: React.FC = () => {
  const { user } = useAuth();

  // Стан форми
  const [name, setName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Олександр Шевченко'
  );
  const [email, setEmail] = useState(user?.email || 'alex@example.com');
  const [subject, setSubject] = useState(MOCK_CONTACT_SUBJECTS[0]);
  const [message, setMessage] = useState(
    "Вітаю! Хотів дізнатися деталі щодо раннього заїзду в апартаменти 'Leopolis Aura' у Львові. Дякую!"
  );

  // Стан відкриття випадаючого списку Frame 352 з Figma
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSent(true);
    setTimeout(() => {
      alert('🎉 Ваше повідомлення успішно надіслано до служби турботи TrailsUA! Ми зв’яжемося з вами найближчим часом.');
      setIsSent(false);
      setMessage('');
    }, 400);
  };

  return (
    <div style={styles.container}>
      {/* 1. ЗАГОЛОВОК СТОРІНКИ З FIGMA */}
      <header style={styles.welcomeSection}>
        <h1 style={styles.mainTitleAlegreya}>Зв&apos;яжіться з нами</h1>
        <p style={styles.subtitleText}>
          Маєте питання щодо бронювання чи співпраці? Наша команда завжди готова допомогти.
        </p>
      </header>

      {/* 2. ГОЛОВНИЙ РЯД: ЛІВА ІНФОРМАЦІЙНА ЧАСТИНА + ПРАВА ФОРМА */}
      <div style={styles.contentRow}>
        {/* ЛІВА КОЛОНКА: 4 КАРТКИ (2х2) ТА КАРТА ОФІСУ */}
        <div style={styles.leftCol}>
          {/* Сітка 4 карток */}
          <div style={styles.infoCardsGrid}>
            {/* 1. Адреса офісу */}
            <div style={styles.infoCard}>
              <div style={styles.iconCircle20}>
                <MapPinIcon />
              </div>
              <div style={styles.infoCardTitle}>Адреса офісу</div>
              <div style={styles.infoCardSub}>{MOCK_CONTACT_OFFICE_INFO.address}</div>
            </div>

            {/* 2. Контактні телефони */}
            <div style={styles.infoCard}>
              <div style={styles.iconCircle20}>
                <PhoneIcon />
              </div>
              <div style={styles.infoCardTitle}>Контактні телефони</div>
              <div style={styles.infoCardSub}>
                {MOCK_CONTACT_OFFICE_INFO.phones.map((p) => (
                  <div key={p}>{p}</div>
                ))}
              </div>
            </div>

            {/* 3. Електронна пошта */}
            <div style={styles.infoCard}>
              <div style={styles.iconCircle20}>
                <MailIcon />
              </div>
              <div style={styles.infoCardTitle}>Електронна пошта</div>
              <div style={styles.infoCardSub}>
                {MOCK_CONTACT_OFFICE_INFO.emails.map((m) => (
                  <div key={m}>{m}</div>
                ))}
              </div>
            </div>

            {/* 4. Графік роботи */}
            <div style={styles.infoCard}>
              <div style={styles.iconCircle20}>
                <ClockIcon />
              </div>
              <div style={styles.infoCardTitle}>Графік роботи</div>
              <div style={styles.infoCardSub}>
                Пн - Пт: 09:00 - 19:00<br />
                Сб - Нд: 10:00 - 16:00
              </div>
            </div>
          </div>

          {/* Інтерактивний блок карти з бейджем із Figma */}
          <div style={styles.mapContainer}>
            <div style={styles.mapBadge}>Офіс TrailsUA на карті</div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: ФОРМА "НАДІСЛАТИ ПОВІДОМЛЕННЯ" (553px з Figma) */}
        <form onSubmit={handleSubmit} style={styles.formCardBox}>
          <h2 style={styles.formTitleAlegreya}>Надіслати повідомлення</h2>

          {/* Поле 1: Ваше ім'я */}
          <div style={styles.formFieldGroup}>
            <label style={styles.fieldLabelTerracotta}>Ваше ім&apos;я</label>
            <div style={styles.inputContainer}>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Олександр Шевченко"
                style={styles.pureInput}
              />
            </div>
          </div>

          {/* Поле 2: Електронна адреса */}
          <div style={styles.formFieldGroup}>
            <label style={styles.fieldLabelTerracotta}>Електронна адреса</label>
            <div style={styles.inputContainer}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                style={styles.pureInput}
              />
            </div>
          </div>

          {/* Поле 3: Тема звернення + ТОЧНЕ МЕНЮ Frame 352 З FIGMA */}
          <div style={{ ...styles.formFieldGroup, position: 'relative' }}>
            <label style={styles.fieldLabelTerracotta}>Тема звернення</label>
            
            {/* Тригер випадного списку */}
            <div
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              style={styles.selectTriggerBox}
            >
              <span style={styles.selectValueText}>{subject}</span>
              <div style={styles.chevronWrap}>
                <ChevronDownIcon />
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ТОЧНЕ МЕНЮ Frame 352 З FIGMA З РАДІО-БОКСАМИ */}
            {/* ========================================================================= */}
            {isSubjectDropdownOpen && (
              <div style={styles.frame352DropdownMenu}>
                {MOCK_CONTACT_SUBJECTS.map((item) => {
                  const isSelected = item === subject;
                  return (
                    <div
                      key={item}
                      onClick={() => {
                        setSubject(item);
                        setIsSubjectDropdownOpen(false);
                      }}
                      style={styles.frame352OptionRow}
                    >
                      {isSelected ? <RadioActiveFigma /> : <RadioInactiveFigma />}
                      <span style={styles.frame352OptionText}>{item}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Поле 4: Повідомлення */}
          <div style={styles.formFieldGroup}>
            <label style={styles.fieldLabelTerracotta}>Повідомлення</label>
            <div style={styles.textareaContainer}>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введіть ваше повідомлення..."
                style={styles.pureTextarea}
              />
            </div>
          </div>

          {/* Кнопка відправки */}
          <button type="submit" disabled={isSent} style={styles.btnSubmitPill}>
            {isSent ? 'Надсилання...' : 'Надіслати повідомлення'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ======================== SVG ІКОНКИ З FIGMA ========================

const RadioActiveFigma = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect width="18" height="18" rx="9" fill="#DC9666" />
  </svg>
);

const RadioInactiveFigma = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" fill="white" stroke="#D7C7B1" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 18.3333C13.3333 14.1667 16.6667 11.3038 16.6667 8.33333C16.6667 4.65144 13.6819 1.66667 10 1.66667C6.3181 1.66667 3.33333 4.65144 3.33333 8.33333C3.33333 11.3038 6.66667 14.1667 10 18.3333Z"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M18.3333 14.1V16.6C18.3343 16.8321 18.2847 17.0617 18.188 17.2727C18.0913 17.4836 17.95 17.6709 17.7744 17.8208C17.5988 17.9708 17.3931 18.0797 17.1721 18.1396C16.951 18.1995 16.7199 18.2089 16.495 18.1675C13.9317 17.7029 11.4727 16.619 9.325 14.9917C7.32759 13.5042 5.65999 11.6366 4.375 9.425C2.94648 7.04306 2.0152 4.33129 1.66667 1.49167C1.63051 1.23847 1.65063 0.980644 1.72559 0.736502C1.80054 0.492359 1.92858 0.267885 2.10051 0.0790899C2.27244 -0.109705 2.48419 -0.258284 2.72081 -0.356262C2.95743 -0.454239 3.2132 -0.499313 3.47 -0.4875H5.97C6.37683 -0.491507 6.77259 -0.347573 7.08638 -0.0814985C7.40018 0.184576 7.61053 0.554479 7.68 0.9625C7.81 1.775 8.04 2.57 8.365 3.325C8.49079 3.6133 8.52844 3.93333 8.47352 4.24434C8.4186 4.55535 8.27344 4.84379 8.055 5.075L6.995 6.25C8.18844 8.6186 9.8814 10.5116 12.25 11.705L13.425 10.645C13.6562 10.4266 13.9446 10.2814 14.2557 10.2265C14.5667 10.1716 14.8867 10.2092 15.175 10.335C15.93 10.66 16.725 10.89 17.5375 11.02C17.9507 11.0901 18.3248 11.3045 18.5928 11.6234C18.8608 11.9424 19.0041 12.3444 19 12.755V14.1Z"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(0.5, 1)"
    />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="3.33333" width="16" height="13.3333" rx="2" stroke="#DC9666" strokeWidth="2" />
    <path d="M2.5 4.16667L10 10.8333L17.5 4.16667" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="#DC9666" strokeWidth="2" />
    <polyline points="10 5 10 10 13.33 11.67" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6E473B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
    width: '100%',
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  mainTitleAlegreya: {
    fontSize: '32px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  subtitleText: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#6E473B',
    margin: 0,
  },
  contentRow: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '1 1 500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  infoCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  infoCard: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxSizing: 'border-box',
    minHeight: '136px',
  },
  iconCircle20: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardTitle: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  infoCardSub: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '19px',
  },
  mapContainer: {
    width: '100%',
    height: '260px',
    padding: '16px',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    boxSizing: 'border-box',
  },
  mapBadge: {
    padding: '8px 16px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    color: '#6E473B',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  formCardBox: {
    width: '553px',
    padding: '32px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  formTitleAlegreya: {
    color: '#6E473B',
    fontSize: '28px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  formFieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  },
  fieldLabelTerracotta: {
    color: '#DC9666',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  inputContainer: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
  },
  pureInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    backgroundColor: 'transparent',
  },
  selectTriggerBox: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  selectValueText: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  chevronWrap: {
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame352DropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '6px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '360px',
    overflowY: 'auto',
    padding: '8px 0',
  },
  frame352OptionRow: {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  frame352OptionText: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  textareaContainer: {
    width: '100%',
    height: '120px',
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
  },
  pureTextarea: {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    backgroundColor: 'transparent',
    lineHeight: '20px',
  },
  btnSubmitPill: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#DC9666',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
    borderRadius: '100px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
  },
};