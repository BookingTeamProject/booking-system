import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const PaymentsTab: React.FC<{ onNotify: (msg: string) => void }> = ({ onNotify }) => {
  const { user } = useAuth();

  // Стан для перегляду: список карток чи екран додавання нової картки
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Поля форми нової картки
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify(`Картку •••• ${cardNumber.slice(-4) || '8892'} успішно збережено!`);
    setIsAddingCard(false);
    setCardNumber('');
    setCardExp('');
    setCardCvv('');
    setCardHolder('');
  };

  // =========================================================================
  // ЕКРАН 1: ДОДАТИ НОВУ КАРТКУ (ТОЧНИЙ МАКЕТ З FIGMA)
  // =========================================================================
  if (isAddingCard) {
    return (
      <div style={styles.container}>
        {/* Кнопка скасування */}
        <button type="button" onClick={() => setIsAddingCard(false)} style={styles.backRedBtn}>
          <ArrowLeftRedIcon />
          <span>Не додавати картку</span>
        </button>

        <div style={styles.addCardContent}>
          <h1 style={styles.mainTitleAlegreya}>Додайте нову картку</h1>

          {/* ExpressPay: Google Pay / Apple Pay */}
          <div style={styles.expressPayRow}>
            <button type="button" style={styles.expressBtn}>
              <div style={styles.gPayCircle} />
              <span style={styles.expressBtnText}>Google Pay</span>
            </button>
            <button type="button" style={styles.expressBtn}>
              <AppleIcon />
              <span style={styles.expressBtnText}>Apple Pay</span>
            </button>
          </div>

          {/* Розділювач "або картою" */}
          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>або картою</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Форма реквізитів картки */}
          <form onSubmit={handleSaveCard} style={styles.cardFormCard}>
            <div style={styles.formHeaderRow}>
              <span style={styles.formHeaderTitle}>Кредитна або дебетова карта</span>
              <CreditCardMiniIcon />
            </div>

            <div style={styles.formFieldsStack}>
              <div>
                <label style={styles.fieldLabel}>Номер карти</label>
                <div style={styles.inputBoxHighlight}>
                  <input
                    type="text"
                    required
                    placeholder="4441 •••• •••• 8892"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={styles.pureHighlightInput}
                  />
                </div>
              </div>

              <div style={styles.twoCols}>
                <div style={{ flex: 1 }}>
                  <label style={styles.fieldLabel}>Термін дії</label>
                  <div style={styles.inputBoxHighlight}>
                    <input
                      type="text"
                      required
                      placeholder="08 / 29"
                      maxLength={5}
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      style={styles.pureHighlightInput}
                    />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.fieldLabel}>CVV / CVC</label>
                  <div style={styles.inputBoxHighlight}>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={styles.pureHighlightInput}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={styles.fieldLabel}>Ім&apos;я власника карти</label>
                <div style={styles.inputBoxHighlight}>
                  <input
                    type="text"
                    required
                    placeholder="IVAN HORBATYI"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    style={styles.pureHighlightInput}
                  />
                </div>
              </div>
            </div>

            <div style={styles.formFooterRow}>
              <div style={styles.encryptionBox}>
                <LockIcon />
                <span>Ваші платіжні дані надійно захищені шифруванням</span>
              </div>

              <button type="submit" style={styles.btnSaveCardAction}>
                <span>Зберегти нову картку</span>
                <ArrowRightIcon />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ЕКРАН 2: ПЛАТЕЖІ ТА ОПЛАТА (БЕЗ ДУБЛЮЮЧИХ КНОПОК ЗВЕРХУ)
  // =========================================================================
  return (
    <div style={styles.container}>
      <header style={styles.headerArea}>
        <h1 style={styles.mainTitleAlegreya}>Платежі та Оплата</h1>
        <p style={styles.subTitleText}>
          Керуйте вашими збереженими картками та переглядайте повну історію транзакцій на платформі.
        </p>
      </header>

      {/* Секція збережених карток */}
      <section style={styles.sectionBlock}>
        <h2 style={styles.sectionHeading22}>Збережені картки</h2>

        <div style={styles.cardsGrid}>
          {/* Visa Gold */}
          <div style={styles.paymentCardVisa}>
            <div style={styles.cardBetweenRow}>
              <span style={styles.cardBrandTitle}>Visa Gold</span>
              <CreditCardChipIcon />
            </div>
            <div style={styles.cardNumberLarge}>•••• •••• •••• 5682</div>
            <div style={styles.cardBetweenRow}>
              <div>
                <div style={styles.metaSmallLabel}>Власник картки</div>
                <div style={styles.metaWhiteVal}>
                  {user?.firstName ? `${user.firstName.toUpperCase()} ${user.lastName?.toUpperCase() || ''}` : 'OLEKSANDR PETRENKO'}
                </div>
              </div>
              <div>
                <div style={styles.metaSmallLabel}>Термін дії</div>
                <div style={styles.metaWhiteVal}>09 / 28</div>
              </div>
            </div>
          </div>

          {/* Mastercard Black */}
          <div style={styles.paymentCardMastercard}>
            <div style={styles.cardBetweenRow}>
              <span style={styles.cardBrandTitle}>Mastercard Black</span>
              <CreditCardChipIcon />
            </div>
            <div style={styles.cardNumberLarge}>•••• •••• •••• 1204</div>
            <div style={styles.cardBetweenRow}>
              <div>
                <div style={styles.metaSmallLabel}>Власник картки</div>
                <div style={styles.metaWhiteVal}>
                  {user?.firstName ? `${user.firstName.toUpperCase()} ${user.lastName?.toUpperCase() || ''}` : 'OLEKSANDR PETRENKO'}
                </div>
              </div>
              <div>
                <div style={styles.metaSmallLabel}>Термін дії</div>
                <div style={styles.metaWhiteVal}>12 / 29</div>
              </div>
            </div>
          </div>

          {/* Кнопка "Додати нову картку" */}
          <button type="button" onClick={() => setIsAddingCard(true)} style={styles.addCardSlotBtn}>
            <div style={styles.plusIconBadge}>
              <PlusIcon />
            </div>
            <span style={styles.addCardLabelText}>Додати нову картку</span>
          </button>
        </div>
      </section>

      {/* Секція: Історія транзакцій */}
      <section style={styles.sectionBlock}>
        <h2 style={styles.sectionHeading22}>Історія транзакцій</h2>

        <div style={styles.tableCard}>
          <div style={styles.tableHeadRow}>
            <div style={{ width: '180px' }}>Дата</div>
            <div style={{ flex: 1 }}>Опис платежу</div>
            <div style={{ width: '160px' }}>Сума</div>
            <div style={{ width: '140px' }}>Статус</div>
          </div>

          <div style={styles.tableDataRow}>
            <div style={{ width: '180px', color: '#291C0E', fontSize: '14px' }}>28 Січ, 2026</div>
            <div style={{ flex: 1, color: '#291C0E', fontSize: '14px', fontWeight: 500 }}>
              Бронювання Колиба &quot;Два Потоки&quot;
            </div>
            <div style={{ width: '160px', color: '#291C0E', fontSize: '14px', fontWeight: 700 }}>
              -18,400 ₴
            </div>
            <div style={{ width: '140px' }}>
              <span style={styles.statusBadgeSuccess}>Успішно</span>
            </div>
          </div>

          <div style={styles.tableDataRow}>
            <div style={{ width: '180px', color: '#291C0E', fontSize: '14px' }}>12 Гру, 2025</div>
            <div style={{ flex: 1, color: '#291C0E', fontSize: '14px', fontWeight: 500 }}>
              Повернення коштів — Chalet &quot;Eco-Smerika&quot;
            </div>
            <div style={{ width: '160px', color: '#2E7D32', fontSize: '14px', fontWeight: 700 }}>
              +8,900 ₴
            </div>
            <div style={{ width: '140px' }}>
              <span style={styles.statusBadgeSuccess}>Повернено</span>
            </div>
          </div>

          <div style={styles.tableDataRow}>
            <div style={{ width: '180px', color: '#291C0E', fontSize: '14px' }}>05 Жов, 2025</div>
            <div style={{ flex: 1, color: '#291C0E', fontSize: '14px', fontWeight: 500 }}>
              Послуга страхування подорожі TrailsCare
            </div>
            <div style={{ width: '160px', color: '#291C0E', fontSize: '14px', fontWeight: 700 }}>
              -1,200 ₴
            </div>
            <div style={{ width: '140px' }}>
              <span style={styles.statusBadgeSuccess}>Успішно</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ======================== SVG ІКОНКИ ========================

const ArrowLeftRedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 13l-5-5 5-5" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 9h10M10 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CreditCardChipIcon = () => (
  <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
    <rect x="1" y="1" width="30" height="22" rx="4" stroke="white" strokeWidth="2" />
    <line x1="1" y1="8" x2="31" y2="8" stroke="white" strokeWidth="2" />
    <circle cx="8" cy="16" r="2" fill="white" />
  </svg>
);

const CreditCardMiniIcon = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect x="1" y="1" width="30" height="18" rx="3" stroke="#6E473B" strokeWidth="2" />
    <line x1="1" y1="6" x2="31" y2="6" stroke="#6E473B" strokeWidth="2" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 4v12M4 10h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="2" stroke="#A78D78" strokeWidth="1.8" />
    <path d="M5 7V4.5a3 3 0 0 1 6 0V7" stroke="#A78D78" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#6E473B">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.01-.49 2.63-1.24z" />
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
  headerArea: {
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
  sectionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeading22: {
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  cardsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  paymentCardVisa: {
    flex: '1 1 320px',
    padding: '24px',
    backgroundColor: '#6E473B',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    color: 'white',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
  },
  paymentCardMastercard: {
    flex: '1 1 320px',
    padding: '24px',
    backgroundColor: '#291C0E',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    color: 'white',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
  },
  cardBetweenRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrandTitle: {
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  cardNumberLarge: {
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    letterSpacing: '1.5px',
  },
  metaSmallLabel: {
    fontSize: '10px',
    fontFamily: "'Iosevka Charon', sans-serif",
    opacity: 0.6,
  },
  metaWhiteVal: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    marginTop: '2px',
  },
  addCardSlotBtn: {
    flex: '1 1 320px',
    minHeight: '190px',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px dashed #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
  },
  plusIconBadge: {
    width: '40px',
    height: '40px',
    backgroundColor: '#DC9666',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardLabelText: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    color: '#291C0E',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    overflow: 'hidden',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeadRow: {
    padding: '16px 24px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderBottom: '1px solid #D7C7B1',
    display: 'flex',
    color: '#291C0E',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  tableDataRow: {
    padding: '16px 24px',
    borderBottom: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
  },
  statusBadgeSuccess: {
    padding: '4px 10px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '100px',
    border: '1px solid #2E7D32',
    color: '#2E7D32',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },

  // СТИЛІ ФОРМИ ДОДАВАННЯ КАРТКИ
  backRedBtn: {
    background: 'none',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#C62828',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    alignSelf: 'flex-start',
  },
  addCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    maxWidth: '1137px',
  },
  expressPayRow: {
    display: 'flex',
    gap: '30px',
  },
  expressBtn: {
    flex: 1,
    height: '56px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  gPayCircle: {
    width: '16px',
    height: '16px',
    backgroundColor: '#6E473B',
    borderRadius: '8px',
  },
  expressBtnText: {
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  dividerText: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  cardFormCard: {
    padding: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formHeaderTitle: {
    color: '#6E473B',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  formFieldsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldLabel: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    marginBottom: '8px',
    display: 'block',
  },
  inputBoxHighlight: {
    height: '52px',
    padding: '0 16px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  pureHighlightInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'none',
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  twoCols: {
    display: 'flex',
    gap: '30px',
  },
  formFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  encryptionBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  btnSaveCardAction: {
    padding: '16px 32px',
    backgroundColor: '#DC9666',
    borderRadius: '16px',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
};