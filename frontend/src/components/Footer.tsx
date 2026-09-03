// src/components/Footer.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('UAH');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('UA');
  const [langOpen, setLangOpen] = useState(false);

  return (
    <footer style={footerRootStyle}>
      {/* Декоративна верхня хвиляста пунктирна лінія з Figma */}
      <div style={footerDashedLineWrapper}>
        <svg width="100%" height="160" viewBox="0 0 1920 233" fill="none" preserveAspectRatio="none">
          <path
            d="M-31 166.889C-8.5 171.222 37.1 171.389 39.5 137.389C42.5 94.8886 -13.5 102.889 13 68.3886C39.5 33.8886 108 35.8886 124.5 91.3886C141 146.889 271.998 122.991 311.5 81.388C358.5 31.8877 514.5 -0.61261 541 45.388C567.5 91.3886 657.5 157.386 764 112.887C870.5 68.3886 889 6.38684 1025 25.8874C1161 45.388 1170.5 112.887 1259 112.887C1347.5 112.887 1393 104.378 1441.5 51.3874C1490 -1.60004 1618 -16.1126 1664.5 32.8874C1711 81.8874 1752.5 124.886 1798 118.887C1843.5 112.887 1807.5 56.8867 1844.5 39.3867C1881.5 21.8867 1940.5 58.8867 1905 97.8867C1869.5 136.887 1868 186.387 1926.5 215.387C1973.3 238.587 2009.67 228.387 2022 220.387"
            stroke="#6E473B"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="20 20"
          />
        </svg>
      </div>

      {/* Повноширинне коричневе тіло футера з подвійним скругленим краєм */}
      <div style={footerFullWidthBody}>
        <div style={footerInnerContainer}>
          
          <div style={footerMainGrid}>
            
            {/* КОЛОНКА 1: ОРИГІНАЛЬНИЙ ЛОГОТИП TRAILS UA + ВІДЖЕТИ ВАЛЮТИ ТА МОВИ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '340px' }}>
              
              {/* Логотип */}
              <div style={{ position: 'relative', width: '200px', height: '62px' }}>
                <svg width="200" height="21" viewBox="0 0 200 21" fill="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path d="M23.0769 7.27268C20.6154 6.8571 6.66667 15.7575 0 20.2596C6.32479 18.1817 19.1795 13.922 20 13.5064C20.8205 13.0909 20.3419 16.1038 20 17.6623L26.6667 12.4675C31.1795 13.7142 32.9915 11.948 33.3333 10.909C30.9402 9.87008 25.5385 7.68826 23.0769 7.27268Z" fill="#E1D4C2"/>
                  <path d="M55.3846 0C53.3333 0 34.7009 12.4675 25.641 18.7012C33.1624 15.4112 48.5128 8.83113 49.7436 8.83113C51.2821 8.83113 45.641 15.5844 47.1795 15.5844C48.718 15.5844 55.8974 9.35061 56.9231 8.31165C57.9487 7.2727 56.4103 6.23374 58.4615 5.19478C60.1026 4.36362 64.6154 7.2727 66.6667 8.83113L69.7436 6.75322C65.812 4.50215 57.4359 0 55.3846 0Z" fill="#E1D4C2"/>
                  <path d="M171.795 4.15583C173.436 4.15583 191.282 15.238 200 20.7791C196.923 21.8181 181.026 12.4675 178.462 12.4675C176.41 12.4675 179.658 17.6623 181.538 20.2597C178.803 18.0086 173.026 13.4025 171.795 12.987C170.256 12.4675 172.308 9.87009 170.769 9.35061C169.538 8.93503 162.393 11.6017 158.974 12.987L155.897 10.909C160.513 8.65797 170.154 4.15583 171.795 4.15583Z" fill="#E1D4C2"/>
                </svg>
                {/* Пін локації */}
                <svg width="15" height="22" viewBox="0 0 15 22" fill="none" style={{ position: 'absolute', top: '-18px', left: '96px' }}>
                  <path d="M7.37305 0C11.4446 0.000262997 14.7451 3.34426 14.7451 7.46875C14.745 13.8299 8.73926 21.2971 7.37305 21.2988C6.00776 21.2988 0.000160238 13.8306 0 7.46875C0 3.3441 3.30126 0 7.37305 0ZM7.64551 3.31934C5.53421 3.31934 3.82227 5.0527 3.82227 7.19141C3.82231 9.33008 5.53424 11.0635 7.64551 11.0635C9.75663 11.0633 11.4677 9.32997 11.4678 7.19141C11.4678 5.0528 9.75666 3.31951 7.64551 3.31934Z" fill="#DC9666"/>
                </svg>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', position: 'absolute', top: '20px', left: 0 }}>
                  <span style={{ color: '#E1D4C2', fontSize: '32px', fontWeight: 900, fontFamily: "'Alegreya', Georgia, serif", letterSpacing: '0.5px' }}>
                    Trails
                  </span>
                  <span style={{ color: '#DC9666', fontSize: '32px', fontWeight: 900, fontFamily: "'Alegreya', Georgia, serif" }}>
                    UA
                  </span>
                </div>
              </div>

              <p style={footerDescriptionStyle}>
                Надійний український сервіс перевіреного житла. Робимо подорожі рідним краєм доступними, комфортними та незабутніми.
              </p>

              {/* Віджети вибору мови та валюти з Figma */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                
                {/* Мова з круглим прапором України */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    style={flagLanguagePickerStyle}
                    title={`Обрана мова: ${selectedLang}`}
                    aria-label={`Обрана мова: ${selectedLang}`}
                  >
                    <div style={roundFlagContainer}>
                      <div style={{ width: '100%', height: '50%', backgroundColor: '#006EB5' }} />
                      <div style={{ width: '100%', height: '50%', backgroundColor: '#FEC300' }} />
                    </div>
                  </button>

                  {langOpen && (
                    <div style={footerDropdownMenuCardStyle}>
                      {[
                        { code: 'UA', title: 'Українська (UA)' },
                        { code: 'EN', title: 'English (EN)' },
                        { code: 'DE', title: 'Deutsch (DE)' },
                        { code: 'PL', title: 'Polski (PL)' }
                      ].map((l) => {
                        const isSelected = selectedLang === l.code;
                        return (
                          <div
                            key={l.code}
                            onClick={() => {
                              setSelectedLang(l.code);
                              setLangOpen(false);
                            }}
                            style={footerDropdownItemStyle}
                          >
                            <div
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: isSelected ? '#DC9666' : '#FFFFFF',
                                border: isSelected ? 'none' : '1px solid #D7C7B1',
                                flexShrink: 0
                              }}
                            />
                            <span>{l.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Валюта UAH з Figma */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setCurrencyOpen(!currencyOpen)}
                    style={currencyPillButtonStyle}
                    title={`Обрана валюта: ${selectedCurrency}`}
                    aria-label={`Обрана валюта: ${selectedCurrency}`}
                  >
                    <span>{selectedCurrency}</span>
                  </button>

                  {currencyOpen && (
                    <div style={footerDropdownMenuCardStyle}>
                      {[
                        { code: 'UAH', title: 'Українська гривня (₴)' },
                        { code: 'USD', title: 'Долар США ($)' },
                        { code: 'EUR', title: 'Євро (€)' },
                        { code: 'PLN', title: 'Польський злотий (zł)' }
                      ].map((c) => {
                        const isSelected = selectedCurrency === c.code;
                        return (
                          <div
                            key={c.code}
                            onClick={() => {
                              setSelectedCurrency(c.code);
                              setCurrencyOpen(false);
                            }}
                            style={footerDropdownItemStyle}
                          >
                            <div
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: isSelected ? '#DC9666' : '#FFFFFF',
                                border: isSelected ? 'none' : '1px solid #D7C7B1',
                                flexShrink: 0
                              }}
                            />
                            <span>{c.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* КОЛОНКА 2: ОСНОВНІ ОПЦІЇ */}
            <div style={footerNavColumnStyle}>
              <h4 style={footerColTitleStyle}>Основні опції</h4>
              <Link to="/" style={footerNavLinkStyle}>Головна</Link>
              <Link to="/about" style={footerNavLinkStyle}>Про нас</Link>
              <Link to="/promotions" style={footerNavLinkStyle}>Акції</Link>
              <Link to="/faq" style={footerNavLinkStyle}>Підтримка</Link>
              <Link to="/routes/create" style={footerNavLinkStyle}>Зареєструвати своє помешкання</Link>
            </div>

            {/* КОЛОНКА 3: НАПРЯМКИ */}
            <div style={footerNavColumnStyle}>
              <h4 style={footerColTitleStyle}>Напрямки</h4>
              <Link to="/routes?location=Львів" style={footerNavLinkStyle}>Львів</Link>
              <Link to="/routes?location=Одеса" style={footerNavLinkStyle}>Одеса</Link>
              <Link to="/routes?location=Буковель" style={footerNavLinkStyle}>Буковель</Link>
              <Link to="/routes?location=Київ" style={footerNavLinkStyle}>Київ</Link>
              <Link to="/routes?location=Карпати" style={footerNavLinkStyle}>Карпати</Link>
              <Link to="/routes?location=Івано-Франківськ" style={footerNavLinkStyle}>Івано-Франківськ</Link>
              <Link to="/routes?location=Ужгород" style={footerNavLinkStyle}>Ужгород</Link>
            </div>

            {/* КОЛОНКА 4: МЕНЮ */}
            <div style={footerNavColumnStyle}>
              <h4 style={footerColTitleStyle}>Меню</h4>
              <Link to="/messages" style={footerNavLinkStyle}>Повідомлення</Link>
              <Link to="/profile" style={footerNavLinkStyle}>Бронювання</Link>
              <Link to="/routes" style={footerNavLinkStyle}>Керування помешканням</Link>
              <Link to="/news" style={footerNavLinkStyle}>Новини</Link>
              <Link to="/contact" style={footerNavLinkStyle}>Контакти</Link>
              <Link to="/legal" style={footerNavLinkStyle}>Обмеження акаунта</Link>
              <Link to="/faq" style={footerNavLinkStyle}>Служба підтримки</Link>
            </div>

            {/* КОЛОНКА 5: ОСОБИСТИЙ КАБІНЕТ ТА 4 КНОПКИ СОЦМЕРЕЖ З FIGMA */}
            <div style={footerNavColumnStyle}>
              <h4 style={footerColTitleStyle}>Особистий кабінет</h4>
              <Link to="/profile" style={footerNavLinkStyle}>Обліковий запис</Link>
              <Link to="/profile?tab=payments" style={footerNavLinkStyle}>Платежі</Link>
              <Link to="/profile?tab=finance" style={footerNavLinkStyle}>Фінанси</Link>
              <Link to="/profile?tab=analytics" style={footerNavLinkStyle}>Аналітика</Link>
              <Link to="/profile?tab=settings" style={footerNavLinkStyle}>Налаштування</Link>
              <Link to="/profile?tab=security" style={footerNavLinkStyle}>Безпека</Link>

              {/* 4 ОРИГІНАЛЬНІ КРУГЛІ КНОПКИ СОЦМЕРЕЖ З FIGMA */}
              <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
                
                {/* 1. YouTube (Play) */}
                <a href="https://youtube.com" target="_blank" rel="noreferrer" style={socialCircleButtonStyle} title="YouTube">
                  <div style={socialInnerCircle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#DC9666">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </a>

                {/* 2. X (Twitter) */}
                <a href="https://x.com" target="_blank" rel="noreferrer" style={socialCircleButtonStyle} title="X">
                  <div style={socialInnerCircle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC9666">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                </a>

                {/* 3. TikTok (Оригінальна SVG нота) */}
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" style={socialCircleButtonStyle} title="TikTok">
                  <div style={socialInnerCircle}>
                    <svg width="22" height="22" viewBox="0 0 50 50" fill="none">
                      <path d="M28.4336 11.731C28.6024 13.5271 30.2195 17.103 35.3506 17.103V20.772C34.1977 21.1796 31.2005 21.3094 28.4336 18.5708V30.7358C28.4338 30.7557 28.4346 30.7755 28.4346 30.7954C28.4346 34.5771 25.3378 37.6428 21.5176 37.6431C17.6971 37.6431 14.5996 34.5773 14.5996 30.7954C14.5998 27.0143 17.6961 23.9488 21.5156 23.9478V27.3726C19.6056 27.3726 18.0569 28.9057 18.0566 30.7964C18.0566 32.6873 19.6054 34.2202 21.5156 34.2202C23.4258 34.2201 24.9746 32.6873 24.9746 30.7964C24.9746 30.7137 24.9707 30.6315 24.9648 30.5503H24.9746V11.7212H28.4336V11.731Z" fill="#DC9666"/>
                    </svg>
                  </div>
                </a>

                {/* 4. Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noreferrer" style={socialCircleButtonStyle} title="Instagram">
                  <div style={socialInnerCircle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </div>
                </a>

              </div>

            </div>

          </div>

          {/* Помаранчева роздільна лінія з Figma */}
          <div style={footerOrangeDividerStyle} />

          {/* Копірайт */}
          <div style={footerCopyrightStyle}>
            Авторські права © 2016—2026 «TrailsUA». Усі права захищено.
          </div>

        </div>
      </div>
    </footer>
  );
};

// ==========================================
// СТИЛІ FOOTER (FIGMA 100% WIDTH ADAPTIVE)
// ==========================================

const footerRootStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#E1D4C2',
  position: 'relative',
  overflow: 'hidden'
};

const footerDashedLineWrapper: React.CSSProperties = {
  width: '100%',
  overflow: 'hidden',
  lineHeight: 0
};

const footerFullWidthBody: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#6E473B',
  borderTopLeftRadius: '40px',
  borderTopRightRadius: '40px',
  borderTop: '6px solid #DC9666',
  padding: '60px 0 28px 0',
  boxShadow: '0 -14px 40px rgba(41, 28, 14, 0.2)'
};

const footerInnerContainer: React.CSSProperties = {
  maxWidth: '1820px',
  margin: '0 auto',
  padding: '0 40px'
};

const footerMainGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.3fr 1fr 1fr 1fr 1.1fr',
  gap: '40px'
};

const footerDescriptionStyle: React.CSSProperties = {
  color: '#E1D4C2',
  fontSize: '15px',
  lineHeight: 1.65,
  fontFamily: "'Iosevka Charon', sans-serif"
};

const flagLanguagePickerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#DC9666',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0
};

const roundFlagContainer: React.CSSProperties = {
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const currencyPillButtonStyle: React.CSSProperties = {
  width: '96px',
  height: '50px',
  borderRadius: '50px',
  backgroundColor: '#DC9666',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#DC9666',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700,
  fontSize: '18px',
  padding: '2px'
};

const footerDropdownMenuCardStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 10px)',
  left: 0,
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: '2px solid #D7C7B1',
  boxShadow: '0 10px 26px rgba(0, 0, 0, 0.25)',
  padding: '8px 0',
  minWidth: '220px',
  zIndex: 100
};

const footerDropdownItemStyle: React.CSSProperties = {
  padding: '10px 16px',
  color: '#6E473B',
  fontSize: '14px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const footerNavColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const footerColTitleStyle: React.CSSProperties = {
  color: '#DC9666',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  margin: '0 0 10px 0'
};

const footerNavLinkStyle: React.CSSProperties = {
  color: '#E1D4C2',
  textDecoration: 'none',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '15px',
  lineHeight: 1.4,
  opacity: 0.95
};

const socialCircleButtonStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#DC9666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none'
};

const socialInnerCircle: React.CSSProperties = {
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  backgroundColor: '#6E473B',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const footerOrangeDividerStyle: React.CSSProperties = {
  height: '6px',
  backgroundColor: '#DC9666',
  borderRadius: '50px',
  margin: '48px 0 24px 0'
};

const footerCopyrightStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#E1D4C2',
  fontSize: '14px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 500
};