import React, { useState } from 'react';
import {
  MOCK_SUPPORT_CATEGORIES,
  MOCK_SUPPORT_TICKETS,
  type SupportTicketItem,
} from '../../../data/mockData';

type PriorityLevel = 'Низький' | 'Середній' | 'Високий';
type ContactMethod = 'email' | 'phone';

export const MenuSupportTab: React.FC = () => {
  // Стан форми
  const [category, setCategory] = useState<string>(MOCK_SUPPORT_CATEGORIES[0]);
  const [bookingCode, setBookingCode] = useState('TR-9482-UA');
  const [priority, setPriority] = useState<PriorityLevel>('Низький');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [description, setDescription] = useState(
    'Блокується оновлення дати або некоректно показує вільні дні після скасування бронювання...'
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Стан випадаючого меню категорій Frame 342 з Figma
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Список тікетів
  const [tickets, setTickets] = useState<SupportTicketItem[]>(MOCK_SUPPORT_TICKETS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Обробка файлу
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket: SupportTicketItem = {
        id: `st-${Date.now()}`,
        ticketNumber: `#${Math.floor(10000 + Math.random() * 90000)}`,
        category: category,
        title: description.slice(0, 42) + (description.length > 42 ? '...' : ''),
        dateText: 'Створено: Сьогодні',
        status: 'В роботі',
      };

      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setDescription('');
      setSelectedFileName(null);
      alert('🎉 Ваше звернення зареєстровано! Оператор служби турботи TrailsUA зв’яжеться з вами.');
    }, 400);
  };

  return (
    <div style={styles.container}>
      {/* 1. ШАПКА РОЗДІЛУ З FIGMA */}
      <header style={styles.pageHeader}>
        <div style={styles.headerTitlesCol}>
          <h1 style={styles.headingAlegreya}>Повідомити про проблему</h1>
          <p style={styles.subtitleText}>
            Надішліть запит до служби підтримки TrailsUA. Ми допоможемо вирішити будь-яку проблему
          </p>
        </div>

        <div style={styles.headerMetaRow}>
          <div style={styles.iconBoxSquare} title="Сповіщення">
            <BellIcon />
          </div>
          <div style={styles.langBadgePill}>UA</div>
        </div>
      </header>

      {/* 2. ГОЛОВНИЙ ДВОКОЛОНКОВИЙ ЛЕЙАУТ (FormSplit з Figma) */}
      <div style={styles.formSplitRow}>
        {/* ЛІВА КОЛОНКА: ФОРМА "СТВОРИТИ НОВЕ ЗВЕРНЕННЯ" */}
        <form onSubmit={handleSendTicket} style={styles.formPanelCard}>
          <h2 style={styles.cardTitleAlegreya}>Створити нове звернення</h2>

          <div style={styles.inputGridCol}>
            {/* РЯД 1: Категорія + Код бронювання */}
            <div style={styles.formTwoColsRow}>
              {/* Категорія + Меню Frame 342 з Figma */}
              <div style={{ ...styles.fieldCol, position: 'relative' }}>
                <label style={styles.fieldLabelUppercase}>Категорія звернення</label>
                <div
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  style={styles.selectTriggerBox}
                >
                  <span style={styles.selectValueText}>{category}</span>
                  <ChevronDownIcon />
                </div>

                {/* ========================================================================= */}
                {/* ТОЧНЕ ВИПАДАЮЧЕ МЕНЮ Frame 342 З FIGMA */}
                {/* ========================================================================= */}
                {isCategoryDropdownOpen && (
                  <div style={styles.frame342DropdownMenu}>
                    {MOCK_SUPPORT_CATEGORIES.map((item) => {
                      const isSelected = item === category;
                      return (
                        <div
                          key={item}
                          onClick={() => {
                            setCategory(item);
                            setIsCategoryDropdownOpen(false);
                          }}
                          style={styles.frame342OptionRow}
                        >
                          {isSelected ? <RadioActiveFigma /> : <RadioInactiveFigma />}
                          <span style={styles.frame342OptionText}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Код бронювання */}
              <div style={styles.fieldCol}>
                <label style={styles.fieldLabelUppercase}>Код бронювання (опціонально)</label>
                <div style={styles.inputContainerBox}>
                  <input
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    placeholder="TR-9482-UA"
                    style={styles.pureInput}
                  />
                </div>
              </div>
            </div>

            {/* РЯД 2: Пріоритет + Бажаний спосіб зв'язку */}
            <div style={styles.formTwoColsRow}>
              {/* Пріоритет проблеми */}
              <div style={styles.fieldCol}>
                <label style={styles.fieldLabelUppercase}>Пріоритет проблеми</label>
                <div style={styles.priorityChoicesRow}>
                  {/* Низький */}
                  <button
                    type="button"
                    onClick={() => setPriority('Низький')}
                    style={
                      priority === 'Низький'
                        ? styles.btnPriorityLowActive
                        : styles.btnPriorityLowDefault
                    }
                  >
                    Низький
                  </button>

                  {/* Середній */}
                  <button
                    type="button"
                    onClick={() => setPriority('Середній')}
                    style={
                      priority === 'Середній'
                        ? styles.btnPriorityMediumActive
                        : styles.btnPriorityMediumDefault
                    }
                  >
                    Середній
                  </button>

                  {/* Високий */}
                  <button
                    type="button"
                    onClick={() => setPriority('Високий')}
                    style={
                      priority === 'Високий'
                        ? styles.btnPriorityHighActive
                        : styles.btnPriorityHighDefault
                    }
                  >
                    Високий
                  </button>
                </div>
              </div>

              {/* Бажаний спосіб зв'язку */}
              <div style={styles.fieldCol}>
                <label style={styles.fieldLabelUppercase}>Бажаний спосіб зв&apos;язку</label>
                <div style={styles.contactChoicesRow}>
                  <button
                    type="button"
                    onClick={() => setContactMethod('email')}
                    style={
                      contactMethod === 'email'
                        ? styles.contactChoiceActive
                        : styles.contactChoiceDefault
                    }
                  >
                    <MailIcon active={contactMethod === 'email'} />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactMethod('phone')}
                    style={
                      contactMethod === 'phone'
                        ? styles.contactChoiceActive
                        : styles.contactChoiceDefault
                    }
                  >
                    <PhoneIcon active={contactMethod === 'phone'} />
                    <span>Телефон</span>
                  </button>
                </div>
              </div>
            </div>

            {/* РЯД 3: Детальний опис проблеми */}
            <div style={styles.fieldCol}>
              <label style={styles.fieldLabelUppercase}>Детальний опис проблеми</label>
              <div style={styles.textareaContainerBox}>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишіть ситуацію..."
                  style={styles.pureTextarea}
                />
              </div>
            </div>

            {/* РЯД 4: Скріншоти / Докази (DashedUploadBox з Figma) */}
            <div style={styles.fieldCol}>
              <label style={styles.fieldLabelUppercase}>Скріншоти / Докази</label>
              <label style={styles.dashedUploadBox}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <div style={styles.uploadCloudIconWrap}>
                  <UploadCloudIcon />
                </div>
                <div style={styles.uploadTitleText}>
                  {selectedFileName || 'Перетягніть файли сюди або натисніть для завантаження'}
                </div>
                <span style={styles.uploadSubtitleMuted}>Підтримуються PNG, JPG до 10MB</span>
              </label>
            </div>
          </div>

          {/* Кнопки дій форми */}
          <div style={styles.formActionsRow}>
            <button type="submit" disabled={isSubmitting} style={styles.btnSubmitSolidPill}>
              {isSubmitting ? 'Надсилання...' : 'Надіслати запит'}
            </button>
            <button
              type="button"
              onClick={() => {
                setDescription('');
                setSelectedFileName(null);
              }}
              style={styles.btnCancelOutlinePill}
            >
              Скасувати
            </button>
          </div>
        </form>

        {/* ПРАВА КОЛОНКА: ОСТАННІ ЗВЕРНЕННЯ (RecentTicketsPanel з Figma 407px) */}
        <aside style={styles.recentTicketsPanel}>
          <h3 style={styles.ticketsPanelTitleAlegreya}>Останні звернення</h3>

          <div style={styles.ticketsStackList}>
            {tickets.map((t) => (
              <div key={t.id} style={styles.ticketCardBox}>
                <div style={styles.ticketHeaderBetween}>
                  <span style={styles.ticketNumberMeta}>
                    {t.ticketNumber} • {t.category}
                  </span>
                  <span
                    style={
                      t.status === 'Вирішено'
                        ? styles.statusBadgeResolved
                        : styles.statusBadgeInProgress
                    }
                  >
                    {t.status}
                  </span>
                </div>

                <div style={styles.ticketTitleText}>{t.title}</div>
                <div style={styles.ticketDateText}>{t.dateText}</div>
              </div>
            ))}
          </div>
        </aside>
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

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke="#291C0E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#291C0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#291C0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MailIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2.5" width="14" height="11" rx="2" stroke={active ? '#FFFFFF' : '#DC9666'} strokeWidth="1.8" />
    <path d="M2 3.5L8 8.5L14 3.5" stroke={active ? '#FFFFFF' : '#DC9666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.67 11.28v2a1.33 1.33 0 0 1-1.45 1.33 13.2 13.2 0 0 1-5.74-2.04 13 13 0 0 1-4-4A13.2 13.2 0 0 1 1.44 2.8 1.33 1.33 0 0 1 2.76 1.33h2A1.33 1.33 0 0 1 6.1 2.48a8.56 8.56 0 0 0 .47 1.87 1.33 1.33 0 0 1-.3 1.41L5.14 6.9a10.67 10.67 0 0 0 4 4l1.14-1.13a1.33 1.33 0 0 1 1.41-.3 8.56 8.56 0 0 0 1.87.47 1.33 1.33 0 0 1 1.11 1.34z"
      stroke={active ? '#FFFFFF' : '#DC9666'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M16 16l-4-4-4 4M12 12v9" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '24px',
    borderBottom: '1px solid #D7C7B1',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTitlesCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1 1 400px',
  },
  headingAlegreya: {
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
  headerMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBoxSquare: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  langBadgePill: {
    padding: '8px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  formSplitRow: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'wrap',
  },
  formPanelCard: {
    flex: '1 1 600px',
    padding: '32px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxSizing: 'border-box',
  },
  cardTitleAlegreya: {
    color: '#291C0E',
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  inputGridCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formTwoColsRow: {
    display: 'flex',
    gap: '20px',
    width: '100%',
    flexWrap: 'wrap',
  },
  fieldCol: {
    flex: '1 1 240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldLabelUppercase: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  selectTriggerBox: {
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  selectValueText: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  frame342DropdownMenu: {
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
    maxHeight: '340px',
    overflowY: 'auto',
    padding: '6px 0',
  },
  frame342OptionRow: {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  frame342OptionText: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  inputContainerBox: {
    padding: '12px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
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
  priorityChoicesRow: {
    display: 'flex',
    gap: '8px',
  },
  btnPriorityLowDefault: {
    flex: 1,
    padding: '10px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #2E7D32',
    color: '#2E7D32',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnPriorityLowActive: {
    flex: 1,
    padding: '10px 14px',
    backgroundColor: '#2E7D32',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)',
  },
  btnPriorityMediumDefault: {
    flex: 1,
    padding: '10px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #DC9666',
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnPriorityMediumActive: {
    flex: 1,
    padding: '10px 14px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(220, 150, 102, 0.25)',
  },
  btnPriorityHighDefault: {
    flex: 1,
    padding: '10px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #C62828',
    color: '#C62828',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnPriorityHighActive: {
    flex: 1,
    padding: '10px 14px',
    backgroundColor: '#C62828',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(198, 40, 40, 0.25)',
  },
  contactChoicesRow: {
    display: 'flex',
    gap: '8px',
  },
  contactChoiceDefault: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #DC9666',
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  contactChoiceActive: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(220, 150, 102, 0.25)',
  },
  textareaContainerBox: {
    padding: '14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
    minHeight: '140px',
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
    lineHeight: '22px',
  },
  dashedUploadBox: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '2px dashed #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  uploadCloudIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitleText: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textAlign: 'center',
  },
  uploadSubtitleMuted: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  formActionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px',
  },
  btnSubmitSolidPill: {
    padding: '14px 32px',
    backgroundColor: '#DC9666',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnCancelOutlinePill: {
    padding: '14px 32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #D7C7B1',
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
  },
  recentTicketsPanel: {
    width: '407px',
    padding: '24px',
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
  ticketsPanelTitleAlegreya: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  ticketsStackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  ticketCardBox: {
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  ticketHeaderBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketNumberMeta: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  statusBadgeInProgress: {
    padding: '3px 8px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '100px',
    color: '#DC9666',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  statusBadgeResolved: {
    padding: '3px 8px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '100px',
    color: '#2E7D32',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  ticketTitleText: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  ticketDateText: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
};