// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api.service';

// SVG іконка Google (точно як у LoginPage)
const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// SVG іконка ока для показу пароля (точно як у LoginPage)
const EyeIcon = ({ show }: { show: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" fill="#DC9666" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Звичайна реєстрація
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    if (password.length < 6) {
      setError('Пароль повинен містити щонайменше 6 символів');
      return;
    }

    setLoading(true);
    try {
      const email = authMode === 'email' ? identifier.trim() : `${identifier.replace(/\D/g, '')}@trails.ua`;
      const res = await authApi.register({
        email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: 'User',
      });

      login(res.user, res.accessToken, res.refreshToken);
      navigate('/select-role');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка при реєстрації. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Реєстрація / Вхід через Google з захистом від надсилання undefined
  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setError('Не вдалося отримати токен Google');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authApi.googleAuth({
        idToken: credentialResponse.credential,
      });

      login(res.user, res.accessToken, res.refreshToken);
      navigate('/select-role');
    } catch (err: any) {
      console.error('Помилка реєстрації через Google:', err);
      setError(err.response?.data?.message || 'Помилка авторизації Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageBackgroundStyle}>
      <div style={layoutContainerStyle}>
        
        {/* ЛІВА ЧАСТИНА: ТОЧНО ТАКІ САМІ 3 ШАРИ, ЯК У LOGINPAGE */}
        <div style={leftVisualColumnStyle}>
          <div style={layeredBackBrownStyle} />
          <div style={layeredMiddleOrangeStyle} />
          <div style={layeredTopImageWrapperStyle}>
            <img
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85"
              alt="TrailsUA Nature Cabin"
              style={leftImageStyle}
            />
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: ФОРМА РЕЄСТРАЦІЇ */}
        <div style={rightFormColumnStyle}>
          <div style={{ maxWidth: '699px', width: '100%', margin: '0 auto' }}>
            
            {/* Заголовок "Реєстрація" */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={headingTitleStyle}>Реєстрація</h1>
              <div style={orangeTitleUnderlineStyle} />
            </div>

            {error && <div style={errorAlertBoxStyle}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Ім'я та Прізвище в один ряд */}
              <div style={{ display: 'flex', gap: '14px', width: '100%' }}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ім’я..."
                  required
                  style={{ ...customFigmaInputStyle, flex: 1 }}
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Прізвище..."
                  required
                  style={{ ...customFigmaInputStyle, flex: 1 }}
                />
              </div>

              {/* Email / Номер телефону */}
              {authMode === 'phone' ? (
                <div style={{ display: 'flex', gap: '14px', width: '100%' }}>
                  <div style={phonePrefixBoxStyle}>
                    <span style={{ fontSize: '18px' }}>🇺🇦</span>
                    <span style={{ fontWeight: 700, color: '#6E473B', fontSize: '16px' }}>+380</span>
                  </div>
                  <input
                    type="tel"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Номер телефону..."
                    required
                    style={{ ...customFigmaInputStyle, flex: 1 }}
                  />
                </div>
              ) : (
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email..."
                  required
                  style={customFigmaInputStyle}
                />
              )}

              {/* Пароль з іконкою ока */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль..."
                  required
                  style={{ ...customFigmaInputStyle, paddingRight: '56px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeButtonWrapperStyle}
                  tabIndex={-1}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>

              {/* Підтвердити пароль з іконкою ока */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Підтвердити пароль..."
                  required
                  style={{ ...customFigmaInputStyle, paddingRight: '56px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={eyeButtonWrapperStyle}
                  tabIndex={-1}
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>

              {/* Перемикач способу реєстрації */}
              <div style={{ textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'email' ? 'phone' : 'email');
                    setIdentifier('');
                    setError('');
                  }}
                  style={switchModeLinkStyle}
                >
                  {authMode === 'email'
                    ? 'Зареєструватись за допомогою номера телефона'
                    : 'Зареєструватись за допомогою email'}
                </button>
              </div>

              {/* Дисклеймер умов */}
              <div style={disclaimerStyle}>
                Вибираючи «Зареєструватися», ви погоджуєтеся з{' '}
                <Link to="/legal?sub=terms" style={disclaimerLinkStyle}>
                  Умовами надання послуг
                </Link>{' '}
                та приймаєте умови{' '}
                <Link to="/legal?sub=privacy" style={disclaimerLinkStyle}>
                  Політики конфіденційності
                </Link>.
              </div>

              {/* Кнопка "Зареєструватись" */}
              <button
                type="submit"
                disabled={loading}
                style={mainRegisterBtnStyle}
              >
                {loading ? 'Реєстрація...' : 'Зареєструватись'}
              </button>
            </form>

            {/* Розділювач "або" */}
            <div style={orDividerWrapperStyle}>
              <div style={orLineStyle} />
              <span style={orTextStyle}>або</span>
              <div style={orLineStyle} />
            </div>

            {/* Кнопка переходу на "Вхід" */}
            <Link to="/login" style={loginOutlineBtnStyle}>
              Вхід
            </Link>

            {/* КНОПКА GOOGLE LOGIN (Точна фірмова рамка із LoginPage) */}
            <div style={googleButtonContainerStyle}>
              <div style={googleFigmaCustomBtnStyle}>
                <GoogleIcon />
                <span>Увійти за допомогою Google</span>
              </div>

              <div style={googleHiddenOverlayStyle}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Помилка авторизації Google')}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  width="400"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// ======================= СТИЛІ FIGMA (1-В-1 ДО LOGINPAGE) =======================

const pageBackgroundStyle: React.CSSProperties = {
  backgroundColor: '#E1D4C2',
  minHeight: 'calc(100vh - 90px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Iosevka Charon', 'Manrope', sans-serif",
  overflow: 'hidden',
};

const layoutContainerStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  minHeight: '880px',
  boxSizing: 'border-box',
};

const leftVisualColumnStyle: React.CSSProperties = {
  flex: '1',
  position: 'relative',
  display: 'flex',
  minHeight: '880px',
};

const layeredBackBrownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#6E473B',
  borderTopRightRadius: '50px',
  borderBottomRightRadius: '50px',
};

const layeredMiddleOrangeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '-25px',
  width: '100%',
  height: '100%',
  backgroundColor: '#DC9666',
  borderTopRightRadius: '50px',
  borderBottomRightRadius: '50px',
};

const layeredTopImageWrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '96%',
  height: '100%',
  borderTopRightRadius: '50px',
  borderBottomRightRadius: '50px',
  overflow: 'hidden',
  boxShadow: '0 16px 36px rgba(41, 28, 14, 0.25)',
};

const leftImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const rightFormColumnStyle: React.CSSProperties = {
  flex: '1.2',
  padding: '50px 40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const headingTitleStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '56px',
  fontFamily: "'Alegreya', Georgia, serif",
  fontStyle: 'italic',
  fontWeight: 900,
  textTransform: 'uppercase',
  margin: '0',
  letterSpacing: '1px',
};

const orangeTitleUnderlineStyle: React.CSSProperties = {
  width: '240px',
  height: '7px',
  backgroundColor: '#DC9666',
  borderRadius: '50px',
  margin: '10px auto 0 auto',
};

const customFigmaInputStyle: React.CSSProperties = {
  width: '100%',
  height: '60px',
  backgroundColor: '#E1D4C2',
  borderRadius: '10px',
  outline: '4px solid #A78D78',
  border: 'none',
  padding: '0 20px',
  fontSize: '18px',
  fontFamily: "'Iosevka Charon', sans-serif",
  color: '#291C0E',
  boxSizing: 'border-box',
};

const phonePrefixBoxStyle: React.CSSProperties = {
  height: '60px',
  backgroundColor: '#E1D4C2',
  borderRadius: '10px',
  outline: '4px solid #A78D78',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
};

const eyeButtonWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  right: '18px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
};

const switchModeLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#6E473B',
  fontSize: '15px',
  fontStyle: 'italic',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
  fontFamily: 'inherit',
};

const disclaimerStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '13px',
  lineHeight: 1.5,
  margin: '2px 0',
  fontFamily: 'inherit',
};

const disclaimerLinkStyle: React.CSSProperties = {
  color: '#DC9666',
  fontStyle: 'italic',
  fontWeight: 700,
  textDecoration: 'underline',
};

const mainRegisterBtnStyle: React.CSSProperties = {
  width: '100%',
  height: '60px',
  backgroundColor: '#DC9666',
  borderRadius: '15px',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '24px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 6px 16px rgba(220, 150, 102, 0.4)',
  marginTop: '4px',
};

const orDividerWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  margin: '20px 0',
};

const orLineStyle: React.CSSProperties = {
  flex: 1,
  height: '6px',
  backgroundColor: '#DC9666',
  borderRadius: '10px',
};

const orTextStyle: React.CSSProperties = {
  color: '#DC9666',
  fontSize: '24px',
  fontWeight: 700,
};

const loginOutlineBtnStyle: React.CSSProperties = {
  width: '100%',
  height: '60px',
  backgroundColor: '#E1D4C2',
  borderRadius: '15px',
  border: '4px solid #6E473B',
  color: '#6E473B',
  fontSize: '24px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  boxSizing: 'border-box',
  marginBottom: '16px',
};

const errorAlertBoxStyle: React.CSSProperties = {
  backgroundColor: '#FEE2E2',
  border: '1px solid #EF4444',
  color: '#DC2626',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '18px',
  textAlign: 'center',
};

const googleButtonContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '60px',
  borderRadius: '15px',
  overflow: 'hidden',
  cursor: 'pointer',
};

const googleFigmaCustomBtnStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#E1D4C2',
  borderRadius: '15px',
  border: '4px solid #6E473B',
  color: '#6E473B',
  fontSize: '20px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  boxSizing: 'border-box',
  pointerEvents: 'none',
};

const googleHiddenOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'scale(2.5)',
  transformOrigin: 'center center',
};