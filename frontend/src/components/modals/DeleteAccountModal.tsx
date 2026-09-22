import React, { useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (reason: string) => void;
  userEmail?: string;
}

const REASONS = [
  'Більше не подорожую',
  'Важко користуватися сайтом',
  'Знайшов іншу платформу',
];

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  userEmail = '',
}) => {
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [typedEmail, setTypedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Кнопка активується, якщо введено валідний email користувача
  const isEmailMatching = userEmail
    ? typedEmail.trim().toLowerCase() === userEmail.trim().toLowerCase()
    : typedEmail.trim().includes('@');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailMatching) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmDelete(selectedReason);
    }, 400);
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div style={styles.headerTextCol}>
          <h2 style={styles.titleRedAlegreya}>Видалити обліковий запис</h2>
          <p style={styles.subtitleMuted}>
            Нам шкода, що ви вирішили покинути TrailsUA. Будь ласка, ознайомтеся з деталями перед продовженням.
          </p>
        </div>

        {/* Червоний банер попередження */}
        <div style={styles.warningRedBox}>
          <div style={styles.warningHeaderRow}>
            <AlertTriangleIcon />
            <span style={styles.warningTitleText}>Це рішення є незворотним</span>
          </div>
          <p style={styles.warningDescText}>
            Видаливши свій акаунт, ви назавжди втратите доступ до поточних бронювань, історії поїздок,
            відгуків від хостів та ваших накопичених бонусів у гаманці TrailsUA.
          </p>
        </div>

        {/* Блок утримання з подарунком 500 ₴ */}
        <div style={styles.retentionGiftCard}>
          <div style={styles.retentionTitle}>Залишайтеся з нами та отримайте подарунок!</div>
          <div style={styles.retentionDesc}>
            Якщо ви залишите акаунт активним, ми нарахуємо <strong style={{ color: '#291C0E' }}>500 ₴</strong> на ваше наступне карпатське бронювання.
          </div>
        </div>

        {/* Вибір причини */}
        <div style={styles.reasonsContainer}>
          <label style={styles.sectionLabel}>Оберіть причину видалення акаунту:</label>
          <div style={styles.reasonsOptionsRow}>
            {REASONS.map((r) => {
              const isSelected = selectedReason === r;
              return (
                <div
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  style={{
                    ...styles.reasonCard,
                    borderColor: isSelected ? '#DC9666' : '#D7C7B1',
                    backgroundColor: isSelected ? 'rgba(220, 150, 102, 0.08)' : '#FFFFFF',
                  }}
                >
                  <span
                    style={{
                      ...styles.reasonCardText,
                      color: isSelected ? '#291C0E' : '#A78D78',
                      fontWeight: isSelected ? 700 : 400,
                    }}
                  >
                    {r}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Підтвердження введенням email */}
          <div style={styles.emailConfirmCol}>
            <label style={styles.sectionLabel}>Для підтвердження введіть ваш email ({userEmail || 'ваш email'}):</label>
            <div style={styles.inputBox}>
              <input
                type="email"
                required
                placeholder="Введіть email адресу..."
                value={typedEmail}
                onChange={(e) => setTypedEmail(e.target.value)}
                style={styles.pureInput}
              />
            </div>
          </div>
        </div>

        {/* Нижні дії */}
        <div style={styles.bottomActionsRow}>
          <button
            type="button"
            disabled={!isEmailMatching || isSubmitting}
            onClick={handleSubmit}
            style={{
              ...styles.btnDeletePermanent,
              opacity: isEmailMatching ? 1 : 0.4,
              cursor: isEmailMatching ? 'pointer' : 'not-allowed',
            }}
          >
            {isSubmitting ? 'Видалення...' : 'Видалити назавжди'}
          </button>

          <button type="button" onClick={onClose} style={styles.btnCancelOutline}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

const AlertTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke="#C62828"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="12" y1="9" x2="12" y2="13" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const styles: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(41, 28, 14, 0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modalCard: {
    width: '100%',
    maxWidth: '960px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxSizing: 'border-box',
    maxHeight: '92vh',
    overflowY: 'auto',
  },
  headerTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  titleRedAlegreya: {
    color: '#C62828',
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  subtitleMuted: {
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    margin: 0,
  },
  warningRedBox: {
    padding: '20px 24px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '20px',
    border: '2px solid #C62828',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  warningHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  warningTitleText: {
    color: '#C62828',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  warningDescText: {
    color: '#C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '21px',
    margin: 0,
  },
  retentionGiftCard: {
    padding: '20px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  retentionTitle: {
    color: '#6E473B',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  retentionDesc: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '20px',
  },
  reasonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  sectionLabel: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  reasonsOptionsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  reasonCard: {
    flex: '1 1 240px',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #D7C7B1',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
  },
  reasonCardText: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  emailConfirmCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
  },
  inputBox: {
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '2px solid #D7C7B1',
    boxSizing: 'border-box',
  },
  pureInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
  },
  bottomActionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '6px',
  },
  btnDeletePermanent: {
    padding: '14px 32px',
    backgroundColor: '#C62828',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
  },
  btnCancelOutline: {
    padding: '14px 32px',
    backgroundColor: 'white',
    borderRadius: '100px',
    border: '1px solid #6E473B',
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
};