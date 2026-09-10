import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ChangeRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmRoleChange = async () => {
    if (!confirmedCheckbox) {
      setError('Будь ласка, підтвердіть згоду за допомогою чекбоксу');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Викликає бекенд /api/user/become-landlord та оновлює токен у рантаймі
      await switchRole('Landlord');
      // Одразу скеровуємо на реєстрацію нового помешкання
      navigate('/routes/create');
    } catch (err: unknown) {
      console.error('Помилка активації ролі:', err);
      // Локальний перехід у разі збою мережі
      navigate('/routes/create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        {/* КАРТКА ПІДТВЕРДЖЕННЯ З FIGMA */}
        <section style={styles.card}>
          {/* HEADER BLOCK */}
          <div style={styles.headerBlock}>
            <div style={styles.eyebrowRow}>
              <SparklesIcon />
              <span style={styles.eyebrowText}>Реєстрація орендодавця</span>
            </div>
            <h1 style={styles.mainTitle}>Станьте господарем та здавайте житло</h1>
            <p style={styles.mainSubtitle}>
              Вам стануть доступні нові можливості орендодавця, і ви все ще зможете користуватися
              базовими функціями як орендар — шукати та бронювати житло.
            </p>
          </div>

          {error && <div style={styles.errorBanner}>{error}</div>}

          {/* ПОРІВНЯННЯ РОЛЕЙ (Орендар vs Господар) */}
          <div style={styles.roleComparisonRow}>
            {/* КАРТКА 1: ПОТОЧНА РОЛЬ (ОРЕНДАР) */}
            <div style={styles.tenantBox}>
              <div style={styles.roleTitleRow}>
                <span style={styles.tenantTitle}>Орендар</span>
                <span style={styles.currentBadge}>Поточна роль</span>
              </div>
              <div style={styles.featuresList}>
                <div style={styles.featureItem}>
                  <SearchIcon />
                  <span style={styles.featureText}>Пошук та бронювання квартир</span>
                </div>
                <div style={styles.featureItem}>
                  <HeartIcon />
                  <span style={styles.featureText}>Збереження у список обраного</span>
                </div>
                <div style={styles.featureItem}>
                  <MessageSquareIcon />
                  <span style={styles.featureText}>Листування з власниками</span>
                </div>
              </div>
            </div>

            {/* КАРТКА 2: НОВА РОЛЬ (ОРЕНДАР-ГОСПОДАР) */}
            <div style={styles.landlordBox}>
              <div style={styles.roleTitleRow}>
                <span style={styles.landlordTitle}>Орендар (Господар)</span>
                <span style={styles.newBadge}>Буде активовано</span>
              </div>
              <div style={styles.featuresList}>
                <div style={styles.featureItem}>
                  <PlusCircleIcon />
                  <span style={{ ...styles.featureText, color: '#291C0E', fontWeight: 700 }}>
                    Публікація власних об&apos;єктів
                  </span>
                </div>
                <div style={styles.featureItem}>
                  <CalendarIcon />
                  <span style={{ ...styles.featureText, color: '#291C0E', fontWeight: 700 }}>
                    Керування календарем зайнятості
                  </span>
                </div>
                <div style={styles.featureItem}>
                  <TrendingUpIcon />
                  <span style={{ ...styles.featureText, color: '#291C0E', fontWeight: 700 }}>
                    Стабільний заробіток та аналітика
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ПОПЕРЕДЖЕННЯ З FIGMA */}
          <div style={styles.warningNotice}>
            <div style={{ paddingTop: '2px' }}>
              <AlertTriangleIcon />
            </div>
            <div style={styles.warningContent}>
              <div style={styles.warningTitle}>Зміна робочого інтерфейсу</div>
              <div style={styles.warningDesc}>
                Після активації кабінету Господаря вам стануть доступні нові сторінки: Фінанси,
                Аналітика, Керування житлом, Календар бронювань та інші. Ваш поточний інтерфейс
                орендаря залишиться без змін.
              </div>
            </div>
          </div>

          {/* ЧЕКБОКС ЗГОДИ */}
          <label
            onClick={() => setConfirmedCheckbox(!confirmedCheckbox)}
            style={styles.checkboxContainer}
          >
            <div
              style={{
                ...styles.checkboxBox,
                borderColor: confirmedCheckbox ? '#DC9666' : '#A78D78',
                backgroundColor: confirmedCheckbox ? '#DC9666' : '#FFFFFF',
              }}
            >
              {confirmedCheckbox && <CheckIcon />}
            </div>
            <span style={styles.checkboxLabel}>
              Я ознайомлений(-а) зі зміною умов надання послуг та підтверджую активацію кабінету
              Орендодавця
            </span>
          </label>

          <div style={styles.dividerLine} />

          {/* ДІЇ */}
          <div style={styles.actionBlock}>
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={styles.btnBack}
              >
                Скасувати
              </button>

              <button
                type="button"
                onClick={handleConfirmRoleChange}
                disabled={loading}
                style={styles.btnConfirm}
              >
                {loading ? 'Активація...' : 'Обрати роль'}
              </button>
            </div>

            <div style={styles.reassuranceNote}>
              <InfoIcon />
              <span style={styles.noteText}>
                Не хвилюйтеся, ви зможете легко повернутися до ролі Орендаря в будь-який момент у
                налаштуваннях профілю.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

// ======================== SVG ІКОНКИ З FIGMA ========================

const SparklesIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.33 1.33V4M14.67 2.67H12M7.34 1.88a1.2 1.2 0 0 1 1.32 0l.7 3.7a1.2 1.2 0 0 0 .7.7l3.7.7a1.2 1.2 0 0 1 0 1.32l-3.7.7a1.2 1.2 0 0 0-.7.7l-.7 3.7a1.2 1.2 0 0 1-1.32 0l-.7-3.7a1.2 1.2 0 0 0-.7-.7l-3.7-.7a1.2 1.2 0 0 1 0-1.32l3.7-.7a1.2 1.2 0 0 0 .7-.7l.7-3.7ZM4 13.33a1.33 1.33 0 1 1-2.67 0 1.33 1.33 0 0 1 2.67 0Z"
      stroke="#DC9666"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14 14l-2.89-2.89M12.67 7.33A5.33 5.33 0 1 1 2 7.33a5.33 5.33 0 0 1 10.67 0Z"
      stroke="#6E473B"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M1.98 4.26a3.67 3.67 0 0 1 6.02-.38L8 4.02l-.02-.14a3.67 3.67 0 0 1 6.04.38c.67.97.77 2.29.07 3.48L8 14 1.91 7.74c-.7-1.19-.6-2.51.07-3.48Z"
      stroke="#6E473B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MessageSquareIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.28 12.28A1.89 1.89 0 0 0 14.67 11.33V3.33A1.33 1.33 0 0 0 13.33 2H2.67A1.33 1.33 0 0 0 1.33 3.33v10.86a.44.44 0 0 0 .81.33l1.47-1.46a1.89 1.89 0 0 1 .94-.4h8.78a1.33 1.33 0 0 0 .95-.38Z"
      stroke="#6E473B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const PlusCircleIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.33 8h5.34M8 5.33v5.34M14.67 8A6.67 6.67 0 1 1 1.33 8a6.67 6.67 0 0 1 13.34 0Z"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.33 1.33V4M10.67 1.33V4M2 6.67h12M3.33 2.67h9.34A1.33 1.33 0 0 1 14 4v9.33A1.33 1.33 0 0 1 12.67 14.67H3.33A1.33 1.33 0 0 1 2 13.33V4a1.33 1.33 0 0 1 1.33-1.33Z"
      stroke="#DC9666"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const TrendingUpIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.67 8.67V4.67h-4M14.67 4.67L9 10.33l-3.33-3.34L1.33 11.33"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AlertTriangleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 7.5v3.33M10 14.17h.01M18.11 15 11.44 3.33a1.67 1.67 0 0 0-2.88 0L1.88 15a1.67 1.67 0 0 0 1.45 2.5h13.34A1.67 1.67 0 0 0 18.1 15Z"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const InfoIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 9.33V7M7 4.67h.01M12.83 7A5.83 5.83 0 1 1 1.17 7a5.83 5.83 0 0 1 11.66 0Z"
      stroke="#A78D78"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#E1D4C2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    boxSizing: 'border-box',
    fontFamily: "'Iosevka Charon', 'Manrope', 'DM Sans', sans-serif",
  },
  contentContainer: {
    width: '100%',
    maxWidth: '920px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 8px 32px rgba(41, 28, 14, 0.06)',
    padding: '44px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  headerBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  eyebrowRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  eyebrowText: {
    color: '#DC9666',
    fontSize: '15px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    color: '#291C0E',
    margin: 0,
    lineHeight: 1.25,
  },
  mainSubtitle: {
    fontSize: '16px',
    color: '#6E473B',
    lineHeight: '24px',
    margin: 0,
  },
  errorBanner: {
    backgroundColor: '#FDE8E8',
    color: '#C62828',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    border: '1px solid #F8B4B4',
  },
  roleComparisonRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    width: '100%',
  },
  tenantBox: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  landlordBox: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '2px solid #DC9666',
    boxShadow: '0px 6px 20px rgba(220, 150, 102, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  roleTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tenantTitle: {
    color: '#6E473B',
    fontSize: '20px',
    fontWeight: 700,
  },
  landlordTitle: {
    color: '#DC9666',
    fontSize: '20px',
    fontWeight: 700,
  },
  currentBadge: {
    padding: '4px 8px',
    backgroundColor: '#6E473B',
    borderRadius: '6px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  newBadge: {
    padding: '4px 8px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '6px',
    color: '#2E7D32',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  featureText: {
    color: '#6E473B',
    fontSize: '14px',
  },
  warningNotice: {
    padding: '20px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '12px',
    border: '1px solid #DC9666',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  warningContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  warningTitle: {
    color: '#DC9666',
    fontSize: '16px',
    fontWeight: 700,
  },
  warningDesc: {
    color: '#6E473B',
    fontSize: '14px',
    lineHeight: '21px',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkboxBox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid #A78D78',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  checkboxLabel: {
    color: '#291C0E',
    fontSize: '15px',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  dividerLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  actionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    width: '100%',
  },
  btnBack: {
    padding: '14px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1.5px solid #6E473B',
    color: '#6E473B',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnConfirm: {
    padding: '14px 24px',
    backgroundColor: '#DC9666',
    borderRadius: '12px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(220, 150, 102, 0.35)',
  },
  reassuranceNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  noteText: {
    color: '#A78D78',
    fontSize: '13px',
    textAlign: 'center',
  },
};