import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  // stage: 1 - вибір ролі (Орендар чи Орендодавець), 2 - підтвердження/пропозиція додати житло
  const [stage, setStage] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Користувач обрав Орендаря (User)
  const handleSelectTenant = async () => {
    setIsSubmitting(true);
    try {
      await switchRole('User');
      navigate('/profile');
    } catch {
      navigate('/profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Користувач обрав Орендодавця (Landlord) -> переходимо до екрана помешкання з Figma
  const handleSelectLandlordInitiate = async () => {
    setIsSubmitting(true);
    try {
      await switchRole('Landlord');
      setStage(2); // Перехід на екран "Бажаєте зареєструвати своє помешкання?"
    } catch {
      setStage(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Перехід безпосередньо у Меню хоста для додавання помешкання
  const handleGoToRegisterProperty = () => {
    navigate('/menu?tab=properties');
  };

  // 4. Пропустити та перейти у профіль
  const handleSkipToProfile = () => {
    navigate('/profile');
  };

  return (
    <main style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* ЛОГОТИП ТА ШАПКА КАРТКИ */}
        <div style={styles.logoBadge}>
          <span style={styles.mountainIcon}>🏔️</span>
          <span style={styles.brandTitle}>Trails UA</span>
        </div>

        {stage === 1 ? (
          /* ЕКРАН 1 З FIGMA: "Оберіть вашу роль" */
          <div style={styles.contentWrap}>
            <header style={styles.headerArea}>
              <h1 style={styles.mainHeading}>Оберіть вашу роль</h1>
              <p style={styles.subHeading}>Як ви хочете використовувати Trails UA?</p>
            </header>

            <div style={styles.cardsGrid}>
              {/* КАРТКА 1: ОРЕНДАР (МАНДРІВНИК) */}
              <div style={styles.roleCard}>
                <div style={styles.iconCircle}>
                  <LuggageIcon />
                </div>

                <div style={styles.cardInfo}>
                  <h2 style={styles.cardTitle}>Орендар</h2>
                  <p style={styles.cardDesc}>
                    Шукайте та бронюйте унікальне затишне житло для відпочинку та подорожей
                    Україною. Відкривайте неймовірні природні локації Карпат, Чорного моря та
                    лісових заповідників.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSelectTenant}
                  disabled={isSubmitting}
                  style={styles.primaryButton}
                >
                  Продовжити як орендар
                </button>
              </div>

              {/* КАРТКА 2: ОРЕНДОДАВЕЦЬ (ХОСТ) */}
              <div style={styles.roleCard}>
                <div style={styles.iconCircle}>
                  <HousePlugIcon />
                </div>

                <div style={styles.cardInfo}>
                  <h2 style={styles.cardTitle}>Орендодавець</h2>
                  <p style={styles.cardDesc}>
                    Здавайте власні котеджі, купольні глемпінги або садиби в оренду. Отримуйте
                    стабільний дохід, керуйте календарем бронювань та спілкуйтеся з гостями надійно
                    та зручно.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSelectLandlordInitiate}
                  disabled={isSubmitting}
                  style={styles.outlineButton}
                >
                  Стати орендодавцем
                </button>
              </div>
            </div>

            <footer style={styles.footerHint}>
              Ви зможете змінити роль у будь-який момент у налаштуваннях вашого профілю
            </footer>
          </div>
        ) : (
          /* ЕКРАН 2 З FIGMA: "Бажаєте зареєструвати своє помешкання?" */
          <div style={styles.contentWrap}>
            <header style={styles.headerArea}>
              <h1 style={styles.mainHeading}>Бажаєте зареєструвати своє помешкання?</h1>
              <p style={styles.subHeading}>
                Якщо ви зараз не хочете зареєстровувати помешкання, ви можете зробити це пізніше
              </p>
            </header>

            <div style={styles.singleCardWrapper}>
              <div style={{ ...styles.roleCard, maxWidth: '640px' }}>
                <div style={styles.iconCircle}>
                  <HousePlugIcon />
                </div>

                <div style={styles.cardInfo}>
                  <h2 style={styles.cardTitle}>Зареєструвати своє помешкання</h2>
                  <p style={styles.cardDesc}>
                    Додайте свою квартиру, будинок чи апартаменти на наш сайт та отримайте нових
                    гостей без зайвих клопотів. Простий інтерфейс, швидке розміщення оголошення та
                    прозора система бронювання допоможуть вам легко керувати орендою й збільшити дохід.
                  </p>
                </div>

                <div style={styles.actionButtonGroup}>
                  <button
                    type="button"
                    onClick={handleGoToRegisterProperty}
                    style={styles.primaryButton}
                  >
                    Зареєструвати своє помешкання
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipToProfile}
                    style={styles.outlineButton}
                  >
                    Пропустити
                  </button>
                </div>
              </div>
            </div>

            <footer style={styles.footerHint}>
              Керування житлом, календарем та бронюваннями буде доступно в меню кабінету
            </footer>
          </div>
        )}
      </div>
    </main>
  );
};

// SVG ІКОНКА ВАЛІЗИ З FIGMA
const LuggageIcon: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 30C8.2 30 7.44 29.68 6.88 29.12C6.32 28.56 6 27.8 6 27V12C6 11.2 6.32 10.44 6.88 9.88C7.44 9.32 8.2 9 9 9H27C27.8 9 28.56 9.32 29.12 9.88C29.68 10.44 30 11.2 30 12V27C30 27.8 29.68 28.56 29.12 29.12C28.56 29.68 27.8 30 27 30M12 27V6C12 5.2 12.32 4.44 12.88 3.88C13.44 3.32 14.2 3 15 3H21C21.8 3 22.56 3.32 23.12 3.88C23.68 4.44 24 5.2 24 6V27"
      stroke="#291C0E"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

// SVG ІКОНКА БУДИНКУ З FIGMA
const HousePlugIcon: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 18V13.5M21 18V13.5M12.75 31.5H7.5C6.7 31.5 5.94 31.18 5.38 30.62C4.82 30.06 4.5 29.3 4.5 28.5V15C4.5 14.13 4.96 13.34 5.56 12.71L16.06 3.71C17.15 2.76 18.85 2.76 19.94 3.71L30.44 12.71C31.04 13.34 31.5 14.13 31.5 15V28.5C31.5 29.3 31.18 30.06 30.62 30.62C30.06 31.18 29.3 31.5 28.5 31.5H21V25.5H15V31.5"
      stroke="#291C0E"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#E1D4C2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    boxSizing: 'border-box',
    fontFamily: "'Iosevka Charon', 'Manrope', 'DM Sans', sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '36px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#DC9666',
    padding: '12px 28px',
    borderRadius: '16px',
    boxShadow: '0 6px 18px rgba(220, 150, 102, 0.25)',
  },
  mountainIcon: {
    fontSize: '22px',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#FFFFFF',
    fontFamily: "'Alegreya', Georgia, serif",
    letterSpacing: '0.5px',
  },
  contentWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
  headerArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '12px',
    maxWidth: '780px',
  },
  mainHeading: {
    fontSize: '38px',
    fontWeight: 800,
    fontFamily: "'Alegreya', Georgia, serif",
    color: '#291C0E',
    margin: 0,
    lineHeight: 1.2,
  },
  subHeading: {
    fontSize: '18px',
    color: '#6E473B',
    margin: 0,
    lineHeight: 1.5,
  },
  cardsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    width: '100%',
  },
  singleCardWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  roleCard: {
    flex: '1 1 440px',
    maxWidth: '540px',
    backgroundColor: '#FFFFFF',
    borderRadius: '28px',
    padding: '44px 38px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '24px',
    boxShadow: '0 12px 32px rgba(41, 28, 14, 0.08)',
    border: '1.5px solid #D7C7B1',
    boxSizing: 'border-box',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  iconCircle: {
    width: '76px',
    height: '76px',
    borderRadius: '38px',
    backgroundColor: 'rgba(220, 150, 102, 0.18)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardTitle: {
    fontSize: '28px',
    fontWeight: 700,
    fontFamily: "'Alegreya', Georgia, serif",
    color: '#291C0E',
    margin: 0,
  },
  cardDesc: {
    fontSize: '15px',
    color: '#6E473B',
    lineHeight: 1.6,
    margin: 0,
  },
  primaryButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(220, 150, 102, 0.3)',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  outlineButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    color: '#DC9666',
    border: '2px solid #DC9666',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  actionButtonGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerHint: {
    fontSize: '14px',
    color: '#6E473B',
    textAlign: 'center',
    opacity: 0.85,
  },
};