import React, { useState } from 'react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: (allDevices: boolean) => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  const [allDevices, setAllDevices] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Червона кругла іконка виходу */}
        <div style={styles.iconCircleRed}>
          <LogOutRedIcon />
        </div>

        {/* Текстовий блок */}
        <div style={styles.textCenterCol}>
          <h2 style={styles.titleAlegreya}>Вийти з акаунта?</h2>
          <p style={styles.descText}>
            Ви впевнені що хочете вийти? Вам потрібно буде увійти знову для доступу до акаунта та керування вашим житлом.
          </p>
        </div>

        {/* Чекбокс: Вийти з усіх пристроїв */}
        <div
          onClick={() => setAllDevices(!allDevices)}
          style={styles.checkboxRow}
        >
          <div style={allDevices ? styles.checkboxBoxActive : styles.checkboxBoxDefault}>
            {allDevices && <CheckIcon />}
          </div>
          <span style={styles.checkboxLabel}>Вийти з усіх пристроїв</span>
        </div>

        {/* Дії */}
        <div style={styles.actionsRow}>
          <button type="button" onClick={onClose} style={styles.btnCancelOutline}>
            Скасувати
          </button>
          <button
            type="button"
            onClick={() => onConfirmLogout(allDevices)}
            style={styles.btnConfirmLogoutSolid}
          >
            Підтвердити вихід
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================== SVG ІКОНКИ ========================

const LogOutRedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M18.6667 8.16667L24.5 14L18.6667 19.8333M24.5 14H10.5M10.5 24.5H5.83333C5.21449 24.5 4.621 24.2542 4.18342 23.8166C3.74583 23.379 3.5 22.7855 3.5 22.1667V5.83333C3.5 5.21449 3.74583 4.621 4.18342 4.18342C4.621 3.74583 5.21449 3.5 5.83333 3.5H10.5"
      stroke="#C62828"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#291C0E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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
    maxWidth: '500px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    boxShadow: '0px 16px 48px rgba(17, 45, 33, 0.30)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    boxSizing: 'border-box',
  },
  iconCircleRed: {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenterCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    textAlign: 'center',
  },
  titleAlegreya: {
    color: '#291C0E',
    fontSize: '24px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    margin: 0,
  },
  descText: {
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '22px',
    margin: 0,
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
    alignSelf: 'flex-start',
  },
  checkboxBoxDefault: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid #6E473B',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  checkboxBoxActive: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid #6E473B',
    backgroundColor: '#DC9666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  checkboxLabel: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 500,
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  btnCancelOutline: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #291C0E',
    color: '#291C0E',
    fontSize: '15px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnConfirmLogoutSolid: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#C62828',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
};