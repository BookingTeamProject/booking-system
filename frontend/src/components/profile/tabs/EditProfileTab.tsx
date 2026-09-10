import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const EditProfileTab: React.FC<{ onNotify: (msg: string) => void }> = ({ onNotify }) => {
  const { user, updateUser, updateAvatar } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState('Завжди на зв’язку!');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser({ firstName, lastName, phoneNumber });
      onNotify('Дані успішно збережено!');
    } catch {
      onNotify('Помилка оновлення даних на сервері');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await updateAvatar(e.target.files[0]);
      onNotify('Фотографію успішно оновлено!');
    }
  };

  return (
    <div style={styles.tabContainer}>
      <header style={styles.titleSection}>
        <h1 style={styles.mainHeading}>Редагувати профіль</h1>
        <p style={styles.subHeading}>Оновіть свою інформацію, щоб подорожі проходили ще комфортніше.</p>
      </header>

      <div style={styles.formVerificationRow}>
        {/* ========================================================================= */}
        {/* КАРТКА З ФОРМОЮ: ТОЧНА КОПІЯ PersonalFormCard З FIGMA */}
        {/* ========================================================================= */}
        <section style={styles.personalFormCard}>
          <div style={styles.cardHeaderTitle}>Основна інформація</div>

          {/* photo-upload */}
          <div style={styles.photoUpload}>
            <div style={styles.photoFrame}>
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
                alt="Current Photo"
                style={styles.currentPhoto}
              />
              <label style={styles.photoOverlay} title="Завантажити нове фото">
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                <CameraIconFigma />
              </label>
            </div>

            <div style={styles.uploadAction}>
              <label style={styles.btnUpload}>
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                Завантажити нове фото
              </label>
              <div style={styles.jpgPngHint}>JPG або PNG. Максимум 5MB.</div>
            </div>
          </div>

          {/* inputs-grid */}
          <form onSubmit={handleSubmit} style={styles.inputsGrid}>
            {/* row-1: Ім'я та Прізвище */}
            <div style={styles.rowInputs}>
              <div style={styles.fieldItem}>
                <label style={styles.inputLabel}>Ім’я</label>
                <div style={styles.inputBox}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Олександр"
                    required
                    style={styles.pureInput}
                  />
                </div>
              </div>

              <div style={styles.fieldItem}>
                <label style={styles.inputLabel}>Прізвище</label>
                <div style={styles.inputBox}>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Коваленко"
                    required
                    style={styles.pureInput}
                  />
                </div>
              </div>
            </div>

            {/* row-2: Email з бейджем та Телефон */}
            <div style={styles.rowInputs}>
              <div style={styles.fieldItem}>
                <label style={styles.inputLabel}>Електронна адреса</label>
                <div style={styles.inputBoxEmail}>
                  <input
                    type="email"
                    value={user?.email || 'Oleksandr_Kov28@gmail.com'}
                    disabled
                    style={styles.pureInputDisabled}
                  />
                  <div style={styles.verifiedBadge}>
                    <CheckVerifiedIcon />
                    <span style={styles.verifiedText}>Підтверджено</span>
                  </div>
                </div>
              </div>

              <div style={styles.fieldItem}>
                <label style={styles.inputLabel}>Номер телефону</label>
                <div style={styles.inputBox}>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+380 (67) 123-45-67"
                    style={styles.pureInput}
                  />
                </div>
              </div>
            </div>

            {/* row-3: Опис (Біо) */}
            <div style={styles.rowInputs}>
              <div style={styles.fieldItem}>
                <label style={styles.inputLabel}>Опис</label>
                <div style={styles.inputBox}>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Завжди на зв’язку!"
                    style={styles.pureInput}
                  />
                </div>
              </div>
            </div>

            {/* save-action */}
            <div style={styles.saveAction}>
              <button type="submit" disabled={loading} style={styles.btnSave}>
                {loading ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </form>
        </section>

        {/* ========================================================================= */}
        {/* ПРАВА ПАНЕЛЬ: ВЕРИФІКАЦІЯ ОСОБИСТОСТІ (ЗАЛИШЕНА БЕЗ ЗМІН) */}
        {/* ========================================================================= */}
        <section style={styles.verificationCard}>
          <div style={styles.cardHeaderTitle}>Верифікація особистості</div>
          <div style={styles.verificationDesc}>
            Підтвердьте свою особу для безпечного бронювання та підвищення довіри серед хостів.
          </div>

          <div style={styles.verificationStatus}>
            <div style={styles.successIconBox}>
              <ShieldIconSuccess />
            </div>
            <div style={styles.statusTextCol}>
              <div style={styles.statusConfirmedTitle}>Особу підтверджено</div>
              <div style={styles.statusConfirmedSub}>Документи верифіковано через Дія</div>
            </div>
          </div>

          <div style={styles.infoPoints}>
            <div style={styles.pointRow}>
              <CheckOrangeIcon />
              <div style={styles.pointText}>Швидше бронювання у топ-хостів</div>
            </div>
            <div style={styles.pointRow}>
              <CheckOrangeIcon />
              <div style={styles.pointText}>Доступ до преміальних помешкань</div>
            </div>
            <div style={styles.pointRow}>
              <CheckOrangeIcon />
              <div style={styles.pointText}>Збільшений ліміт страхування</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// ======================== SVG ІКОНКИ З FIGMA ========================

// Камера з Figma (Vector з точними координатами)
const CameraIconFigma = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M12.5164 3.56932C12.2581 3.4153 11.963 3.33398 11.6624 3.33398H8.3346C8.03422 3.33397 7.73942 3.41511 7.48138 3.56882C7.22333 3.72254 7.01162 3.94311 6.86865 4.20723L6.46111 4.96049C6.31813 5.2246 6.10643 5.44518 5.84838 5.5989C5.59033 5.75261 5.29554 5.83375 4.99516 5.83373H3.33086C2.8888 5.83373 2.46484 6.00931 2.15226 6.32184C1.83967 6.63437 1.66406 7.05825 1.66406 7.50023V14.9995C1.66406 15.4415 1.83967 15.8653 2.15226 16.1779C2.46484 16.4904 2.8888 16.666 3.33086 16.666H16.6653C17.1073 16.666 17.5313 16.4904 17.8439 16.1779C18.1565 15.8653 18.3321 15.4415 18.3321 14.9995V7.50023C18.3321 7.05825 18.1565 6.63437 17.8439 6.32184C17.5313 6.00931 17.1073 5.83373 16.6653 5.83373H15.001C14.7003 5.83374 14.4052 5.75242 14.147 5.59839C13.8887 5.44437 13.677 5.22337 13.5342 4.95882L13.1291 4.2089C12.9863 3.94435 12.7746 3.72335 12.5164 3.56932Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Галочка у зеленому бейджі з Figma
const CheckVerifiedIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M8.33397 2.5L3.75109 7.083L1.66797 4.99982" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ShieldIconSuccess = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8.23 14.63a9.7 9.7 0 0 0 5.1-6V4a.67.67 0 0 0-.66-.67c-1.34 0-3-.8-4.16-1.81a.7.7 0 0 0-1.02 0C6.33 2.53 4.67 3.33 3.33 3.33a.67.67 0 0 0-.66.67V8.67a9.7 9.7 0 0 0 5.11 5.96.67.67 0 0 0 .45 0Z" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckOrangeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M10 3L4.5 8.5L2 6" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mainHeading: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  subHeading: {
    fontSize: '16px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 400,
    color: '#6E473B',
    margin: 0,
  },
  formVerificationRow: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    width: '100%',
  },
  personalFormCard: {
    flex: '1 1 0',
    padding: '32px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    boxSizing: 'border-box',
  },
  cardHeaderTitle: {
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
  },
  photoUpload: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  photoFrame: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
  },
  currentPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80px',
    height: '80px',
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  uploadAction: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  btnUpload: {
    padding: '8px 16px',
    backgroundColor: '#DC9666',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-block',
  },
  jpgPngHint: {
    color: '#6E473B',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  inputsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  rowInputs: {
    display: 'flex',
    gap: '16px',
    width: '100%',
  },
  fieldItem: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
  },
  inputBox: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
  },
  inputBoxEmail: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  pureInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  pureInputDisabled: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  verifiedBadge: {
    padding: '2px 8px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
  },
  verifiedText: {
    color: '#2E7D32',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
  },
  saveAction: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '12px',
  },
  btnSave: {
    padding: '14px 28px',
    backgroundColor: '#DC9666',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
    borderRadius: '12px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },

  // СТИЛІ КАРТКИ ВЕРИФІКАЦІЇ
  verificationCard: {
    width: '407px',
    padding: '28px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  verificationDesc: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
    lineHeight: '19.5px',
  },
  verificationStatus: {
    padding: '16px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '16px',
    border: '1px solid #2E7D32',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  successIconBox: {
    width: '32px',
    height: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statusConfirmedTitle: {
    color: '#2E7D32',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
  },
  statusConfirmedSub: {
    color: '#2E7D32',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  infoPoints: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pointRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pointText: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
};