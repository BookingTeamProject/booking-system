import React, { useState } from 'react';
import {
  MOCK_RESTRICTION_HISTORY,
  MOCK_PLATFORM_RULES,
  type RestrictionHistoryItem,
} from '../../../data/mockData';

export const MenuRestrictionsTab: React.FC = () => {
  const [appealText, setAppealText] = useState('');
  const [historyList, setHistoryList] = useState<RestrictionHistoryItem[]>(MOCK_RESTRICTION_HISTORY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry: RestrictionHistoryItem = {
        id: `rh-${Date.now()}`,
        date: 'Сьогодні',
        type: 'Апеляція модератору',
        reason: appealText.trim(),
        status: 'На розгляді',
      };

      setHistoryList([newEntry, ...historyList]);
      setAppealText('');
      setIsSubmitting(false);
      alert('📩 Вашу апеляцію успішно надіслано! Служба модерації TrailsUA розгляне її протягом 24 годин.');
    }, 500);
  };

  return (
    <div style={styles.container}>
      {/* 1. ЗАГОЛОВОК СТОРІНКИ З FIGMA */}
      <header style={styles.pageHeader}>
        <div style={styles.headerTitlesCol}>
          <h1 style={styles.headingAlegreya}>Обмеження акаунта</h1>
          <p style={styles.subtitleText}>
            Переглядайте статус вашого профілю, правила платформи та подавайте апеляції
          </p>
        </div>

        <div style={styles.headerMetaRow}>
          <div style={styles.bellIconBox} title="Сповіщення безпеки">
            <BellIcon />
          </div>
          <div style={styles.langPillBadge}>UA</div>
        </div>
      </header>

      {/* 2. КАРТКА АКТИВНОГО СТАТУСУ (ActiveStatusCard з Figma) */}
      <div style={styles.activeStatusCard}>
        <div style={styles.statusBadgeCircle}>
          <LockIconRed />
        </div>

        <div style={styles.statusInfoCol}>
          <div style={styles.statusTitleRow}>
            <h2 style={styles.statusTitleText}>Статус акаунта: Обмежено тимчасово</h2>
            <div style={styles.activeBadgeRedPill}>Активно</div>
          </div>

          <div style={styles.statusReasonText}>
            <strong style={{ color: '#291C0E' }}>Причина: </strong>
            <span>Низький відсоток вчасних відповідей на запити бронювання (менше 75%).</span>
          </div>

          <div style={styles.statusExpireText}>
            Термін дії обмеження: до 28 Лютого, 2026 (Залишилось 12 днів)
          </div>
        </div>
      </div>

      {/* 3. ДВОКОЛОНКОВИЙ ЛЕЙАУТ З FIGMA */}
      <div style={styles.twoColLayout}>
        {/* ЛІВА КОЛОНКА: АПЕЛЯЦІЯ ТА ІСТОРІЯ ОБМЕЖЕНЬ */}
        <div style={styles.leftCol}>
          {/* Картка подання апеляції */}
          <form onSubmit={handleSendAppeal} style={styles.appealCard}>
            <h3 style={styles.cardHeaderAlegreya}>Подати апеляцію</h3>
            <p style={styles.cardDescMuted}>
              Якщо ви вважаєте, що обмеження було накладено помилково, або ви вже усунули проблему
              (наприклад, налаштували сповіщення), опишіть деталі нижче. Наш модератор розгляне запит протягом 24 годин.
            </p>

            <div style={styles.formGroupCol}>
              <label style={styles.inputLabelUppercase}>Пояснення ситуації</label>
              <div style={styles.textareaContainer}>
                <textarea
                  rows={4}
                  required
                  placeholder="Опишіть ваші аргументи для зняття обмежень..."
                  value={appealText}
                  onChange={(e) => setAppealText(e.target.value)}
                  style={styles.pureTextarea}
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.btnSubmitAppeal}>
              {isSubmitting ? 'Надсилання...' : 'Надіслати апеляцію'}
            </button>
          </form>

          {/* Картка історії обмежень */}
          <div style={styles.historyCard}>
            <h3 style={styles.cardHeaderAlegreya}>Історія обмежень</h3>

            <div style={styles.tableContainer}>
              {/* Шапка таблиці */}
              <div style={styles.tableHeaderRow}>
                <div style={{ width: '130px' }}>ДАТА</div>
                <div style={{ width: '170px' }}>ТИП ОБМЕЖЕННЯ</div>
                <div style={{ flex: 1 }}>ПРИЧИНА</div>
                <div style={{ width: '110px', textAlign: 'right' }}>СТАТУС</div>
              </div>

              {/* Рядки історії */}
              {historyList.map((item) => (
                <div key={item.id} style={styles.tableDataRow}>
                  <div style={{ width: '130px', color: '#291C0E', fontSize: '13px', fontWeight: 700 }}>
                    {item.date}
                  </div>
                  <div style={{ width: '170px', color: '#291C0E', fontSize: '13px' }}>
                    {item.type}
                  </div>
                  <div style={{ flex: 1, color: '#A78D78', fontSize: '13px', lineHeight: '18px' }}>
                    {item.reason}
                  </div>
                  <div style={{ width: '110px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: item.status === 'На розгляді' ? '#DC9666' : '#6E473B' }}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: ПРАВИЛА ПЛАТФОРМИ TRAILS UA (407px з Figma) */}
        <aside style={styles.rightCol}>
          <div style={styles.rulesCardDark}>
            <h3 style={styles.rulesTitleTerracotta}>Правила платформи TrailsUA</h3>
            <p style={styles.rulesDescWhite}>
              Ці норми створені для підтримки високих стандартів гостинності в Україні.
            </p>

            <div style={styles.rulesStack}>
              {MOCK_PLATFORM_RULES.map((rule) => (
                <div key={rule.id} style={styles.ruleWhiteItemCard}>
                  <div style={styles.ruleHeaderRow}>
                    <div style={styles.smallTerracottaDot} />
                    <strong style={styles.ruleTitleText}>{rule.title}</strong>
                  </div>
                  <p style={styles.ruleBodyText}>{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// ======================== SVG ІКОНКИ З FIGMA ========================

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

const LockIconRed = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#C62828" strokeWidth="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
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
  bellIconBox: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  langPillBadge: {
    padding: '8px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  activeStatusCard: {
    padding: '28px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  statusBadgeCircle: {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusInfoCol: {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statusTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  statusTitleText: {
    fontSize: '22px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  activeBadgeRedPill: {
    padding: '4px 10px',
    backgroundColor: '#C62828',
    borderRadius: '100px',
    color: 'white',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  statusReasonText: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#A78D78',
    lineHeight: '20px',
  },
  statusExpireText: {
    color: '#C62828',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    marginTop: '2px',
  },
  twoColLayout: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '1 1 600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  appealCard: {
    padding: '28px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardHeaderAlegreya: {
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  cardDescMuted: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '21px',
    margin: 0,
  },
  formGroupCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  inputLabelUppercase: {
    color: '#6E473B',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  textareaContainer: {
    padding: '14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
  },
  pureTextarea: {
    width: '100%',
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    backgroundColor: 'transparent',
    lineHeight: '21px',
  },
  btnSubmitAppeal: {
    width: '220px',
    padding: '14px 20px',
    backgroundColor: '#DC9666',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  historyCard: {
    padding: '28px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeaderRow: {
    display: 'flex',
    paddingBottom: '10px',
    borderBottom: '1px solid #D7C7B1',
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  tableDataRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #F8F5F0',
  },
  rightCol: {
    width: '407px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flexShrink: 0,
  },
  rulesCardDark: {
    padding: '28px',
    backgroundColor: '#6E473B',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  rulesTitleTerracotta: {
    color: '#DC9666',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  rulesDescWhite: {
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '19px',
    margin: 0,
  },
  rulesStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '6px',
  },
  ruleWhiteItemCard: {
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  ruleHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  smallTerracottaDot: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#DC9666',
  },
  ruleTitleText: {
    color: '#DC9666',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  ruleBodyText: {
    color: '#6E473B',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '18px',
    margin: 0,
  },
};