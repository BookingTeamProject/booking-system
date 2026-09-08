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
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="153" height="61" viewBox="0 0 153 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M102.356 34.1455H95.1333V47.2375C95.1333 55.6298 97.103 61.0008 106.295 61.0008C115.487 61.0008 117.457 55.6298 117.457 47.2375V34.1455H110.235V50.9301C110.235 55.6298 106.952 55.6298 106.295 55.6298C105.638 55.6298 102.356 55.6298 102.356 50.9301V34.1455Z" fill="#DC9666"/>
                    <path d="M41.4038 42.873C45.2082 41.1946 53.2918 39.6507 55.1919 46.9013V60.3291H50.5962V57.9794C50.049 58.7627 48.2322 60.3291 45.3433 60.3291C41.7321 60.3291 39.4341 58.3151 39.4341 55.2939C39.4341 52.2727 41.0755 48.5801 49.6108 48.58C49.8297 47.6849 49.4792 45.8945 46.3276 45.8945C43.1764 45.8947 41.4038 47.5732 41.4038 47.5732V42.873ZM49.939 51.9375C48.954 51.7137 46.6563 51.6016 45.3433 52.9443C43.7019 54.6227 44.3588 56.6367 46.6567 56.6367C48.9544 56.6365 49.9389 54.6226 49.939 51.9375Z" fill="#E1D4C2"/>
                    <path d="M25.7739 60.329H31.3548V51.601C32.5511 47.0356 37.9206 46.9013 37.9206 46.9013V41.5303C33.1367 41.5303 31.636 44.2158 31.3548 45.5586V41.5303H25.7739V60.329Z" fill="#E1D4C2"/>
                    <path d="M28.7285 34.1455H7.06152V38.8452H14.9404V60.3294H20.8496V38.8452H28.7285V34.1455Z" fill="#E1D4C2"/>
                    <rect x="59.4502" y="41.5303" width="5.2526" height="18.7987" fill="#E1D4C2"/>
                    <ellipse cx="62.0765" cy="36.831" rx="2.6263" ry="2.68553" fill="#E1D4C2"/>
                    <rect x="69.0234" y="33.2734" width="5.22179" height="27.0285" fill="#E1D4C2"/>
                    <path d="M90.4225 42.873V47.237C89.8754 46.7894 88.1902 45.8943 85.8265 45.8943C82.8719 45.8943 82.2153 47.7703 85.1699 48.5798C88.1245 49.3893 91.7357 50.5939 91.7357 54.9579C91.7357 58.3148 88.7811 60.329 84.3374 60.329C79.8938 60.329 78.3853 59.4338 77.291 58.9862L77.291 54.2865C79.2607 56.3007 86.4831 57.3078 86.4831 54.9579C86.4831 52.2724 77.6193 52.6081 77.6193 47.6627C77.6193 44.2158 80.5739 41.5303 84.5133 41.5303C87.6649 41.5303 89.7659 42.4255 90.4225 42.873Z" fill="#E1D4C2"/>
                    <path d="M143.584 59.6582H136.457L135.049 54.2871H126.842L125.201 59.6582H117.978L126.842 34.1455H135.049L143.584 59.6582ZM127.828 49.5869H134.065L130.782 40.1885L127.828 49.5869Z" fill="#DC9666"/>
                    <path d="M17.6538 21.3902C15.7708 21.0733 5.1 27.8598 0 31.2927C4.83846 29.7083 14.6723 26.4603 15.3 26.1434C15.9277 25.8265 15.5615 28.1239 15.3 29.3122L20.4 25.3512C23.8523 26.3018 25.2385 24.9551 25.5 24.1629C23.6692 23.3707 19.5369 21.707 17.6538 21.3902Z" fill="#E1D4C2"/>
                    <path d="M42.3692 15.8447C40.8 15.8447 26.5462 25.3512 19.6154 30.1044C25.3692 27.5958 37.1123 22.5785 38.0538 22.5785C39.2308 22.5785 34.9154 27.7278 36.0923 27.7278C37.2692 27.7278 42.7615 22.9746 43.5462 22.1824C44.3308 21.3902 43.1538 20.598 44.7231 19.8058C45.9785 19.172 49.4308 21.3902 51 22.5785L53.3538 20.9941C50.3462 19.2776 43.9385 15.8447 42.3692 15.8447Z" fill="#E1D4C2"/>
                    <path d="M131.423 19.0136C132.678 19.0136 146.331 27.4637 153 31.6888C150.646 32.4811 138.485 25.3512 136.523 25.3512C134.954 25.3512 137.438 29.3122 138.877 31.2927C136.785 29.5763 132.365 26.0642 131.423 25.7473C130.246 25.3512 131.815 23.3707 130.638 22.9746C129.697 22.6577 124.231 24.691 121.615 25.7473L119.262 24.1629C122.792 22.4464 130.168 19.0136 131.423 19.0136Z" fill="#E1D4C2"/>
                    <path d="M100.431 24.559C102 24.2421 102.392 21.5222 102.392 20.2019C103.569 21.7863 105.845 25.1135 105.531 25.7473C105.138 26.5395 104.354 25.3512 103.962 25.7473C103.569 26.1434 105.923 27.3317 105.923 28.1239C105.923 28.9161 104.746 27.7278 104.354 28.52C104.04 29.1538 106.054 30.3685 107.1 30.8966H101.215C100.431 30.8966 99.2538 30.8966 100.431 29.3122C101.608 27.7278 100.823 28.1239 100.038 27.7278C99.2538 27.3317 100.823 26.1434 101.608 25.3512C102.235 24.7174 101.085 24.559 100.431 24.559Z" fill="#E1D4C2"/>
                    <path d="M65.9068 11.4868C64.9653 11.1699 49.5607 22.9737 41.9761 28.9153C46.2915 27.727 58.8453 20.201 60.8068 20.201C62.7684 20.201 58.8453 23.7659 58.0607 24.9542C57.2761 26.1425 60.8068 25.3503 60.0222 25.7464C59.2376 26.1425 57.6684 27.3309 58.0607 27.727C58.453 28.1231 57.6684 29.3114 56.4915 30.1036C55.3145 30.8958 69.4376 29.7075 69.8299 29.3114C70.2222 28.9153 68.653 27.3309 67.8684 26.1425C67.0838 24.9542 69.8299 23.7659 69.0453 22.9737C68.2607 22.1815 68.653 21.3893 69.0453 20.9932C69.4376 20.5971 65.9068 13.8634 66.2992 13.0711C66.6915 12.2789 73.3607 19.4088 76.1068 19.8049C78.3038 20.1218 78.5915 19.4088 78.4607 19.0127C74.6684 16.6361 66.8484 11.8036 65.9068 11.4868Z" fill="#E1D4C2"/>
                    <path d="M99.6453 13.4673C103.411 16.6361 120.307 26.1425 128.284 30.4997C105.53 22.9737 97.2915 13.4673 95.7222 13.0711C94.153 12.675 94.153 15.0517 94.153 17.8244C94.153 20.5971 98.8607 20.201 95.7222 20.9932C92.5838 21.7854 92.1915 17.4283 91.4068 20.201C90.6222 22.9737 86.3068 22.9737 87.8761 21.7854C89.1315 20.8348 89.4453 18.7486 89.4453 17.8244C83.4822 21.3101 80.4222 20.069 79.6376 19.0127C83.2992 16.504 91.093 11.3283 92.9761 10.6945C95.3299 9.90231 94.9376 9.50622 99.6453 13.4673Z" fill="#E1D4C2"/>
                    <path d="M79.75 0C82.8648 0 85.3904 2.54948 85.3906 5.69434C85.3906 10.5453 80.7945 16.2402 79.75 16.2402C78.7049 16.239 74.1104 10.5448 74.1104 5.69434C74.1106 2.5496 76.6354 0.000191214 79.75 0ZM79.959 2.53027C78.344 2.53046 77.0352 3.85275 77.0352 5.4834C77.0352 7.11405 78.344 8.43633 79.959 8.43652C81.5741 8.43652 82.8838 7.11417 82.8838 5.4834C82.8838 3.85263 81.5741 2.53027 79.959 2.53027Z" fill="#DC9666"/>
                  </svg>
                </div>
              </Link>

              <p style={footerDescriptionStyle}>
                Надійний український сервіс перевіреного житла. Робимо подорожі рідним краєм доступними, комфортними та незабутніми.
              </p>

              {/* Віджети вибору мови та валюти з Figma */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                
                {/* Мова з динамічним круглим прапором */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    style={flagLanguagePickerStyle}
                    title={`Обрана мова: ${selectedLang}`}
                    aria-label={`Обрана мова: ${selectedLang}`}
                  >
                    {selectedLang === 'UA' && (
                      <div style={roundFlagContainer}>
                        <div style={{ width: '100%', height: '50%', backgroundColor: '#0057B7' }} />
                        <div style={{ width: '100%', height: '50%', backgroundColor: '#FFD700' }} />
                      </div>
                    )}
                    {selectedLang === 'EN' && (
                      <div style={roundFlagContainer}>
                        <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Синє тло */}
                          <rect width="64" height="64" fill="#012169" />
                          {/* Білі діагоналі */}
                          <path d="M-10 -10L74 74M74 -10L-10 74" stroke="#FFFFFF" strokeWidth="12" />
                          {/* Червоні діагоналі */}
                          <path d="M-10 -10L74 74M74 -10L-10 74" stroke="#C8102E" strokeWidth="4" />
                          {/* Білий прямий хрест */}
                          <path d="M32 0V64M0 32H64" stroke="#FFFFFF" strokeWidth="16" />
                          {/* Червоний прямий хрест */}
                          <path d="M32 0V64M0 32H64" stroke="#C8102E" strokeWidth="10" />
                        </svg>
                      </div>
                    )}
                    {selectedLang === 'DE' && (
                      <div style={roundFlagContainer}>
                        <div style={{ width: '100%', height: '33.3%', backgroundColor: '#000000' }} />
                        <div style={{ width: '100%', height: '33.3%', backgroundColor: '#DD0000' }} />
                        <div style={{ width: '100%', height: '33.3%', backgroundColor: '#FFCE00' }} />
                      </div>
                    )}
                    {selectedLang === 'PL' && (
                      <div style={roundFlagContainer}>
                        <div style={{ width: '100%', height: '50%', backgroundColor: '#FFFFFF' }} />
                        <div style={{ width: '100%', height: '50%', backgroundColor: '#DC143C' }} />
                      </div>
                    )}
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
  backgroundColor: 'transparent',
  border: '2px solid #DC9666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '2px'
};

const roundFlagContainer: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const currencyPillButtonStyle: React.CSSProperties = {
  width: '96px',
  height: '50px',
  borderRadius: '50px',
  backgroundColor: 'transparent',
  border: '2px solid #DC9666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#DC9666',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700,
  fontSize: '18px',
  padding: '0'
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