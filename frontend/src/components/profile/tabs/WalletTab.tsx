import React, { useState } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { useSettings } from '../../../context/SettingsContext';

export const WalletTab: React.FC<{ onNotify: (msg: string) => void }> = ({ onNotify }) => {
  const { balance, expectedPayout, payoutSettings, updatePayoutSettings, withdrawFunds } = useFinance();
  const { formatPrice } = useSettings();

  const [isPayoutDropdownOpen, setIsPayoutDropdownOpen] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('TRAILSUAFRIEND2025');
    onNotify('Реферальний код TRAILSUAFRIEND2025 скопійовано у буфер!');
  };

  const handleWithdraw = () => {
    if (balance <= 0) {
      onNotify('⚠️ На балансі немає доступних коштів для виведення');
      return;
    }
    const amountToWithdraw = Math.min(balance, 5000);
    const success = withdrawFunds(amountToWithdraw);
    if (success) {
      onNotify(`✅ ${formatPrice(amountToWithdraw)} успішно виведено на рахунок IBAN!`);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.welcomeHeader}>
        <h1 style={styles.mainHeadingAlegreya}>Гаманець та Клубні привілеї</h1>
        <p style={styles.subHeadingText}>
          Керуйте балансом, виводьте кошти та переглядайте персональні знижки у Клубі мандрівників TrailsUA.
        </p>
      </header>

      {/* Ряд 1: Баланс + Клуб мандрівників */}
      <div style={styles.twoColsGap24}>
        {/* Баланс */}
        <div style={styles.balanceCard}>
          <div style={styles.cardTopBetween}>
            <span style={styles.metaLabelUppercase}>Поточний баланс</span>
            <WalletBadgeIcon />
          </div>

          <div style={styles.numbersGroup}>
            <div style={styles.hugeBalance}>{formatPrice(balance)}</div>
            <div style={styles.expectedPayoutText}>
              Очікується до виплати: {formatPrice(expectedPayout)} (за резервацію #1893)
            </div>
          </div>

          <div style={styles.balanceActionsRow}>
            <button type="button" onClick={handleWithdraw} style={styles.btnWithdraw}>
              Вивести кошти
            </button>
            <button
              type="button"
              onClick={() => onNotify('Перехід до історії операцій...')}
              style={styles.btnHistory}
            >
              Історія операцій
            </button>
          </div>
        </div>

        {/* Клуб */}
        <div style={styles.loyaltyCard}>
          <div style={styles.cardTopBetween}>
            <span style={styles.metaLabelUppercase}>Клуб мандрівників TrailsUA</span>
            <div style={styles.wolfBadge}>Рівень 4 • Гірський Вовк</div>
          </div>

          <div style={styles.numbersGroup}>
            <div style={styles.discountTitle}>Ваша накопичена знижка: 7%</div>
            <div style={styles.nextLevelNotice}>
              Наступний рівень (10% знижки) після ще 2 бронювань або залучення 1 друга.
            </div>
          </div>

          <div style={styles.progressRow}>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: '80%' }} />
            </div>
            <span style={styles.progressPercent}>80%</span>
          </div>
        </div>
      </div>

      {/* Ряд 2: Запроси друга + Нараховані бонуси */}
      <div style={styles.twoColsGap24}>
        {/* Запроси друга */}
        <div style={styles.referralCard}>
          <h2 style={styles.cardHeaderAlegreya}>Запроси друга — отримай 500 ₴</h2>
          <p style={styles.referralDesc}>
            Поділися кодом з друзями. Вони отримають 300 ₴ на першу поїздку, а ти — 500 ₴ на бонусний рахунок після їх заїзду.
          </p>

          <div style={styles.referralCodeBox}>
            <span style={styles.referralCodeText}>TRAILSUAFRIEND2025</span>
            <button type="button" onClick={handleCopyCode} style={styles.copyBtnText}>
              Копіювати
            </button>
          </div>
        </div>

        {/* Нараховані бонуси */}
        <div style={styles.bonusesCard}>
          <h2 style={styles.cardHeaderAlegreya}>Нараховані бонуси</h2>

          <div style={styles.bonusesListStack}>
            <div style={styles.bonusItemRow}>
              <span style={styles.bonusItemName}>Реферальний бонус (Анна Ш.)</span>
              <strong style={styles.bonusItemSum}>+500.00 ₴</strong>
            </div>
            <div style={styles.lineDivider} />
            <div style={styles.bonusItemRow}>
              <span style={styles.bonusItemName}>Кешбек за відгук #1203</span>
              <strong style={styles.bonusItemSum}>+150.00 ₴</strong>
            </div>
            <div style={styles.lineDivider} />
            <div style={styles.bonusItemRow}>
              <span style={styles.bonusItemName}>Святковий бонус від TrailsUA</span>
              <strong style={styles.bonusItemSum}>+300.00 ₴</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Ряд 3: Налаштування виплат з випадаючим Frame 345 з Figma */}
      <div style={styles.payoutSettingsCard}>
        <h2 style={styles.cardHeaderAlegreya24}>Налаштування виплат</h2>

        <div style={styles.twoColsGap24}>
          <div style={styles.payoutFieldCol}>
            <label style={styles.metaLabelUppercase}>Банківський рахунок (IBAN)</label>
            <div style={styles.ibanBox}>{payoutSettings.iban}</div>
          </div>

          <div style={{ ...styles.payoutFieldCol, position: 'relative' }}>
            <label style={styles.metaLabelUppercase}>Періодичність виплат</label>
            <div
              onClick={() => setIsPayoutDropdownOpen(!isPayoutDropdownOpen)}
              style={styles.payoutDropdownTrigger}
            >
              <span>{payoutSettings.frequency}</span>
              <ChevronDownIcon />
            </div>

            {/* Меню Frame 345 з Figma */}
            {isPayoutDropdownOpen && (
              <div style={styles.frame345DropdownMenu}>
                {(['Щодня', 'Щотижня', 'Щомісяця', 'Щокварталу', 'Щороку'] as const).map((freq) => {
                  const isSelected = freq === payoutSettings.frequency;
                  return (
                    <div
                      key={freq}
                      onClick={() => {
                        updatePayoutSettings({ frequency: freq });
                        setIsPayoutDropdownOpen(false);
                        onNotify(`Періодичність виплат встановлено: ${freq}`);
                      }}
                      style={styles.frame345Row}
                    >
                      {isSelected ? <RadioActiveFigma /> : <RadioInactiveFigma />}
                      <span style={styles.frame345Label}>{freq}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNotify('Налаштування виплат успішно збережено в систему!')}
          style={styles.btnSaveSettings}
        >
          Зберегти налаштування
        </button>
      </div>
    </div>
  );
};

// ======================== SVG ІКОНКИ ========================

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

const WalletBadgeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="15" rx="3" stroke="#DC9666" strokeWidth="2" />
    <circle cx="16" cy="12" r="2" fill="#DC9666" />
    <path d="M2 9h20" stroke="#DC9666" strokeWidth="2" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="#291C0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  welcomeHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mainHeadingAlegreya: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  subHeadingText: {
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
    color: '#6E473B',
    margin: 0,
  },
  twoColsGap24: {
    display: 'flex',
    gap: '24px',
    width: '100%',
  },
  balanceCard: {
    flex: 1,
    padding: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  loyaltyCard: {
    flex: 1,
    padding: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardTopBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabelUppercase: {
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  numbersGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  hugeBalance: {
    color: '#291C0E',
    fontSize: '38px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  pendingPayoutText: {
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  balanceActionsRow: {
    display: 'flex',
    gap: '12px',
    paddingTop: '8px',
  },
  btnWithdraw: {
    padding: '12px 20px',
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
  btnHistory: {
    padding: '12px 20px',
    backgroundColor: 'white',
    borderRadius: '100px',
    border: '1px solid #291C0E',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  wolfBadge: {
    padding: '4px 10px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    color: '#291C0E',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  discountTitle: {
    color: '#291C0E',
    fontSize: '28px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  nextLevelNotice: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '19.5px',
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  progressTrack: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DC9666',
  },
  progressPercent: {
    color: '#291C0E',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  referralCard: {
    flex: 1,
    padding: '28px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bonusesCard: {
    flex: 1,
    padding: '28px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeaderAlegreya: {
    color: '#291C0E',
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  referralDesc: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '19.5px',
    margin: 0,
  },
  referralCodeBox: {
    padding: '12px 16px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralCodeText: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  copyBtnText: {
    background: 'none',
    border: 'none',
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  bonusesListStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bonusItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonusItemName: {
    color: '#291C0E',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  bonusItemSum: {
    color: '#2E7D32',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  lineDivider: {
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  payoutSettingsCard: {
    padding: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  cardHeaderAlegreya24: {
    color: '#291C0E',
    fontSize: '24px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  payoutFieldCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ibanBox: {
    padding: '14px 16px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '10px',
    border: '1px solid #D7C7B1',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  payoutDropdownTrigger: {
    padding: '14px 16px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '10px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    cursor: 'pointer',
  },
  frame345DropdownMenu: {
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
  frame345Row: {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  frame345Label: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  btnSaveSettings: {
    alignSelf: 'flex-start',
    padding: '14px 24px',
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
};