// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formatAvatar = (url?: string | null): string => {
  if (!url) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = window.location.hostname !== 'localhost' ? 'https://trailsua.pp.ua' : 'http://localhost:5238';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const Navbar: React.FC = () => {
  const { user, isLandlord, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('UA');

  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (p: string) => location.pathname === p;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={headerRootStyle}>
      <div style={headerOuterBar}>
        <div style={headerInnerContent}>
          
          {/* ЛОГОТИП TRAILS UA */}
          <Link to="/" style={logoContainerStyle}>
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

          <div style={verticalSeparatorStyle} />

          {/* НАВІГАЦІЯ */}
          <nav style={desktopNavStyle}>
            {/* Головна */}
            <Link to="/" style={isActive('/') ? navItemActiveStyle : navItemStyle}>
              <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12H4.4303V23H22.0718V11.56H25.0121L13.2511 1L1 12Z" stroke={isActive('/') ? '#DC9666' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.0049 23V15H16.0074V23" stroke={isActive('/') ? '#DC9666' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Головна</span>
            </Link>

            <div style={verticalSeparatorStyle} />

            {/* МЕНЮ (ПОВНИЙ СПИСОК З 7 ПУНКТІВ ТА ТОЧНИМИ SVG З FIGMA) */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button onClick={() => setMenuDropdownOpen(!menuDropdownOpen)} style={navDropdownButtonStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ width: '18px', height: '2px', backgroundColor: '#FFFFFF', borderRadius: '1px' }} />
                  <div style={{ width: '18px', height: '2px', backgroundColor: '#FFFFFF', borderRadius: '1px' }} />
                  <div style={{ width: '18px', height: '2px', backgroundColor: '#FFFFFF', borderRadius: '1px' }} />
                </div>
                <span>Меню</span>
              </button>

              {menuDropdownOpen && (
                <div style={figmaFullMenuDropdownStyle}>
                  {/* 1. Повідомлення */}
                  <Link to="/messages" onClick={() => setMenuDropdownOpen(false)} style={dropdownRowStyle}>
                    <div style={dropdownIconBoxStyle}>
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                        <path d="M21.6192 18.7374C21.863 18.5005 22 18.1791 22 17.844V10.2634C22 9.92835 21.863 9.60699 21.6192 9.37005C21.3754 9.13311 21.0448 9 20.7 9H10.3C9.95522 9 9.62456 9.13311 9.38076 9.37005C9.13696 9.60699 9 9.92835 9 10.2634V20.5515C9.00001 20.6402 9.02708 20.7269 9.0778 20.8007C9.12851 20.8744 9.20058 20.9319 9.2849 20.9659C9.36922 20.9998 9.462 21.0087 9.55152 20.9914C9.64103 20.9741 9.72326 20.9314 9.7878 20.8687L11.2191 19.4776C11.4628 19.2407 11.7934 19.1075 12.1382 19.1074H20.7C21.0448 19.1074 21.3754 18.9743 21.6192 18.7374Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1 }}>Повідомлення</span>
                    <span style={dropdownChevronStyle}>›</span>
                  </Link>

                  <div style={dropdownDividerStyle} />

                  {/* 2. Бронювання */}
                  <Link to="/profile" onClick={() => setMenuDropdownOpen(false)} style={dropdownRowStyle}>
                    <div style={dropdownIconBoxStyle}>
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                        <path d="M12.6111 9V11.4M18.3889 9V11.4M9 13.8H22M10.4444 10.2H20.5556C21.3533 10.2 22 10.7373 22 11.4V19.8C22 20.4627 21.3533 21 20.5556 21H10.4444C9.6467 21 9 20.4627 9 19.8V11.4C9 10.7373 9.6467 10.2 10.4444 10.2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1 }}>Бронювання</span>
                    <span style={dropdownChevronStyle}>›</span>
                  </Link>

                  <div style={dropdownDividerStyle} />

                  {/* 3. Керування помешканням */}
                  {/* 3. Керування помешканням */}
                  <Link to="/menu?tab=properties" onClick={() => setMenuDropdownOpen(false)} style={dropdownRowStyle}>
                    <div style={dropdownIconBoxStyle}>
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                        <path d="M9 9V21M9 12H20.7C21.0448 12 21.3754 12.158 21.6192 12.4393C21.863 12.7206 22 13.1022 22 13.5V21M9 18.75H22M11.6 12V18.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1 }}>Керування помешканням</span>
                    <span style={dropdownChevronStyle}>›</span>
                  </Link>

                  <div style={dropdownDividerStyle} />

                  {/* 4. Новини */}
                  <Link to="/news" onClick={() => setMenuDropdownOpen(false)} style={dropdownRowStyle}>
                    <div style={dropdownIconBoxStyle}>
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                        <path d="M17.45 19.2H14.2M19.4 16.4H14.2M10.3 22H20.7C21.0448 22 21.3754 21.8525 21.6192 21.5899C21.863 21.3274 22 20.9713 22 20.6V9.4C22 9.0287 21.863 8.6726 21.6192 8.41005C21.3754 8.1475 21.0448 8 20.7 8H12.9C12.5552 8 12.2246 8.1475 11.9808 8.41005C11.737 8.6726 11.6 9.0287 11.6 9.4V20.6C11.6 20.9713 11.463 21.3274 11.2192 21.5899C10.9754 21.8525 10.6448 22 10.3 22ZM10.3 22C9.95522 22 9.62456 21.8525 9.38076 21.5899C9.13696 21.3274 9 20.9713 9 20.6V14.3C9 13.9287 9.13696 13.5726 9.38076 13.3101C9.62456 13.0475 9.95522 12.9 10.3 12.9H11.6M14.85 10.8H18.75C19.109 10.8 19.4 11.1134 19.4 11.5V12.9C19.4 13.2866 19.109 13.6 18.75 13.6H14.85C14.491 13.6 14.2 13.2866 14.2 12.9V11.5C14.2 11.1134 14.491 10.8 14.85 10.8Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1 }}>Новини</span>
                    <span style={dropdownChevronStyle}>›</span>
                  </Link>

                  <div style={dropdownDividerStyle} />

                  {/* 5. Контакти */}
                  <Link to="/contact" onClick={() => setMenuDropdownOpen(false)} style={dropdownRowStyle}>
                    <div style={dropdownIconBoxStyle}>
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                        <path d="M9 14.3H11.1667C11.5498 14.3 11.9172 14.4475 12.188 14.7101C12.4589 14.9726 12.6111 15.3287 12.6111 15.7V17.8C12.6111 18.1713 12.4589 18.5274 12.188 18.7899C11.9172 19.0525 11.5498 19.2 11.1667 19.2H10.4444C10.0614 19.2 9.69395 19.0525 9.42307 18.7899C9.15218 18.5274 9 18.1713 9 17.8V14.3ZM9 14.3C9 13.4727 9.16813 12.6534 9.49478 11.8891C9.82144 11.1247 10.3002 10.4302 10.9038 9.84523C11.5074 9.26022 12.2239 8.79616 13.0126 8.47956C13.8012 8.16295 14.6464 8 15.5 8C16.3536 8 17.1988 8.16295 17.9874 8.47956C18.7761 8.79616 19.4926 9.26022 20.0962 9.84523C20.6998 10.4302 21.1786 11.1247 21.5052 11.8891C21.8319 12.6534 22 13.4727 22 14.3M22 14.3V17.8M22 14.3H19.8333C19.4502 14.3 19.0828 14.4475 18.812 14.7101C18.5411 14.9726 18.3889 15.3287 18.3889 15.7V17.8C18.3889 18.1713 18.5411 18.5274 18.812 18.7899C19.0828 19.0525 19.4502 19.2 19.8333 19.2H20.5556C20.9386 19.2 21.306 19.0525 21.5769 18.7899C21.8478 18.5274 22 18.1713 22 17.8M22 17.8V19.2C22 19.9426 21.6956 20.6548 21.1539 21.1799C20.6121 21.705 19.8773 22 19.1111 22H15.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1 }}>Контакти</span>
                    <span style={dropdownChevronStyle}>›</span>
                  </Link>

                  <div style={dropdownDividerStyle} />

                  {/* 6. Обмеження акаунта */}
                  <Link to="/legal" onClick={() => setMenuDropdownOpen(false)} style={dropdownRowStyle}>
                    <div style={dropdownIconBoxStyle}>
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                        <path d="M15.5 12.1993V14.9988M15.5 17.7984H15.5069M21 15.699C21 19.1984 18.5938 20.9481 15.7338 21.963C15.584 22.0146 15.4213 22.0122 15.2731 21.956C12.4062 20.9481 10 19.1984 10 15.699V10.7998C10 10.6142 10.0724 10.4362 10.2014 10.305C10.3303 10.1737 10.5052 10.1 10.6875 10.1C12.0625 10.1 13.7812 9.2601 14.9775 8.19628C15.1232 8.0696 15.3084 8 15.5 8C15.6916 8 15.8768 8.0696 16.0225 8.19628C17.2256 9.2671 18.9375 10.1 20.3125 10.1C20.4948 10.1 20.6697 10.1737 20.7986 10.305C20.9276 10.4362 21 10.6142 21 10.7998V15.699Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1 }}>Обмеження акаунта</span>
                    <span style={dropdownChevronStyle}>›</span>
                  </Link>

                  <div style={dropdownDividerStyle} />

                  {/* 7. Служба підтримки */}
                  <Link to="/faq" onClick={() => setMenuDropdownOpen(false)} style={dropdownRowStyle}>
                    <div style={dropdownIconBoxStyle}>
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                        <path d="M13.6084 13.0497C13.7612 12.6153 14.0628 12.249 14.4599 12.0157C14.8569 11.7823 15.3237 11.697 15.7776 11.7749C16.2314 11.8528 16.6431 12.0887 16.9397 12.441C17.2363 12.7933 17.3986 13.2392 17.3979 13.6997C17.3979 14.9997 15.4479 15.6497 15.4479 15.6497M15.5 18.25H15.5065M22 15C22 18.5899 19.0899 21.5 15.5 21.5C11.9101 21.5 9 18.5899 9 15C9 11.4101 11.9101 8.5 15.5 8.5C19.0899 8.5 22 11.4101 22 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span style={{ flex: 1 }}>Служба підтримки</span>
                    <span style={dropdownChevronStyle}>›</span>
                  </Link>
                </div>
              )}
            </div>

            <div style={verticalSeparatorStyle} />

            {/* Про нас */}
            <Link to="/about" style={isActive('/about') ? navItemActiveStyle : navItemStyle}>
              <svg width="22" height="18" viewBox="0 0 26 22" fill="none">
                <path d="M17.1081 21V18.7778C17.1081 17.599 16.6232 16.4686 15.7601 15.6351C14.897 14.8016 13.7264 14.3333 12.5058 14.3333H5.60232C4.38171 14.3333 3.21109 14.8016 2.34799 15.6351C1.48489 16.4686 1 17.599 1 18.7778V21M17.1081 1.14214C18.095 1.38922 18.9691 1.94577 19.593 2.72444C20.2169 3.5031 20.5555 4.4598 20.5555 5.44437C20.5555 6.42893 20.2169 7.38563 19.593 8.1643C18.9691 8.94296 18.095 9.49951 17.1081 9.74659M24.0116 20.9999V18.7776C24.0108 17.7929 23.6714 16.8363 23.0467 16.058C22.4219 15.2797 21.5472 14.7238 20.5599 14.4776M13.6564 5.44444C13.6564 7.89904 11.5959 9.88889 9.05406 9.88889C6.51227 9.88889 4.45174 7.89904 4.45174 5.44444C4.45174 2.98985 6.51227 1 9.05406 1C11.5959 1 13.6564 2.98985 13.6564 5.44444Z" stroke={isActive('/about') ? '#DC9666' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Про нас</span>
            </Link>

            <div style={verticalSeparatorStyle} />

            {/* Акції */}
            <Link to="/promotions" style={isActive('/promotions') ? navItemActiveStyle : navItemStyle}>
              <svg width="22" height="21" viewBox="0 0 28 27" fill="none">
                <path d="M15.2229 1L1 14.9423L11.7898 26L26.0126 12.0577V1H15.2229Z" stroke={isActive('/promotions') ? '#DC9666' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <ellipse cx="17.01" cy="4" rx="2.00101" ry="2" stroke={isActive('/promotions') ? '#DC9666' : '#FFFFFF'} strokeWidth="2"/>
              </svg>
              <span>Акції</span>
            </Link>

            <div style={verticalSeparatorStyle} />

            {/* Підтримка */}
            <Link to="/faq" style={isActive('/faq') ? navItemActiveStyle : navItemStyle}>
              <svg width="20" height="22" viewBox="0 0 22 26" fill="none">
                <path d="M1 11.8H4.33501C4.92468 11.8 5.4902 12.0529 5.90716 12.5029C6.32411 12.953 6.55836 13.5635 6.55836 14.2V17.8C6.55836 18.4365 6.32411 19.047 5.90716 19.4971C5.4902 19.9471 4.92468 20.2 4.33501 20.2H3.22334C2.63368 20.2 2.06816 19.9471 1.6512 19.4971C1.23424 19.047 1 18.4365 1 17.8V11.8ZM1 11.8C1 10.3817 1.25879 8.97734 1.76159 7.66702C2.26439 6.3567 3.00135 5.16612 3.93041 4.16325C4.85946 3.16037 5.96241 2.36485 7.17628 1.8221C8.39015 1.27935 9.69116 1 11.005 1C12.3189 1 13.6199 1.27935 14.8338 1.8221C16.0477 2.36485 17.1506 3.16037 18.0797 4.16325C19.0087 5.16612 19.7457 6.3567 20.2485 7.66702C20.7513 8.97734 21.0101 10.3817 21.0101 11.8M21.0101 11.8V17.8M21.0101 11.8H17.6751C17.0854 11.8 16.5199 12.0529 16.1029 12.5029C15.686 12.953 15.4517 13.5635 15.4517 14.2V17.8C15.4517 18.4365 15.686 19.047 16.1029 19.4971C16.5199 19.9471 17.0854 20.2 17.6751 20.2H18.7867C19.3764 20.2 19.9419 19.9471 20.3589 19.4971C20.7758 19.047 21.0101 18.4365 21.0101 17.8M21.0101 17.8V20.2C21.0101 21.473 20.5416 22.6939 19.7077 23.5941C18.8738 24.4943 17.7427 25 16.5634 25H11.005" stroke={isActive('/faq') ? '#DC9666' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Підтримка</span>
            </Link>
          </nav>

          <div style={verticalSeparatorStyle} />

          {/* ПРАВА ЧАСТИНА */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Кнопка "Зареєструвати своє помешкання" */}
            <Link to={isLandlord ? "/routes/create" : "/menu?tab=properties"} style={ctaHouseButtonStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width="22" height="11" viewBox="0 0 26 13" fill="none">
                  <path d="M1.5 11.5L12.5055 1.5L23.5111 11.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="16" height="12" viewBox="0 0 19 15" fill="none">
                  <path d="M1.5 1.5V13.5H7.10282V7.5H11.9052V13.5H17.5081V1.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Зареєструвати своє помешкання</span>
            </Link>

            <div style={verticalSeparatorStyle} />

            {/* Мова з радіо-індикатором з вашого файлу */}
            <div ref={langRef} style={{ position: 'relative' }}>
              <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} style={langBadgePillStyle}>
                <span style={{ fontSize: '16px' }}>🌐</span>
                <span style={{ fontWeight: 700, fontSize: '16px', color: '#FFFFFF' }}>{selectedLang}</span>
                <svg width="10" height="6" viewBox="0 0 12 7" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2"/>
                </svg>
              </button>

              {langDropdownOpen && (
                <div style={figmaLanguageDropdownModalStyle}>
                  {[
                    { code: 'UA', title: 'Українська (UA)' },
                    { code: 'EN', title: 'English (EN)' },
                    { code: 'DE', title: 'Deutsch (DE)' },
                    { code: 'PL', title: 'Polski (PL)' }
                  ].map((l) => (
                    <div
                      key={l.code}
                      onClick={() => {
                        setSelectedLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      style={langRadioRowStyle}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '9px',
                          backgroundColor: selectedLang === l.code ? '#DC9666' : '#6E473B',
                          border: selectedLang === l.code ? 'none' : '1px solid #D7C7B1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ color: 'white', fontSize: '14px', fontFamily: "'Iosevka Charon', sans-serif" }}>
                        {l.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={verticalSeparatorStyle} />

            {/* ПРОФІЛЬ КОРИСТУВАЧА ТА ПОВНЕ МЕНЮ КАБІНЕТУ З FIGMA */}
            {user ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={userProfileButtonStyle}
                >
                  <img
                    src={formatAvatar(user.avatarUrl)}
                    alt="Аватар"
                    style={userAvatarStyle}
                  />
                  <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                    <div style={userNameTextStyle}>
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Анастасія Приходько'}
                    </div>
                    <div style={userRoleTextStyle}>
                      {isLandlord ? 'орендодавець' : 'особистий кабінет'}
                    </div>
                  </div>
                  <svg width="10" height="6" viewBox="0 0 12 7" fill="none">
                    <path d="M1.5 1.5L6 5.5L10.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div style={figmaFullCabinetDropdownStyle}>
                    {/* 1. Обліковий запис */}
                    <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} style={dropdownRowStyle}>
                      <div style={dropdownIconBoxStyle}>
                        <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                          <path d="M20.3344 21V19.6667C20.3344 18.9594 20.0534 18.2811 19.5533 17.781C19.0531 17.281 18.3748 17 17.6674 17H13.667C12.9596 17 12.2813 17.281 11.7811 17.781C11.281 18.2811 11 18.9594 11 19.6667V21M18.3342 11.6667C18.3342 13.1394 17.1401 14.3333 15.6672 14.3333C14.1943 14.3333 13.0002 13.1394 13.0002 11.6667C13.0002 10.1939 14.1943 9 15.6672 9C17.1401 9 18.3342 10.1939 18.3342 11.6667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ flex: 1 }}>Обліковий запис</span>
                      <span style={dropdownChevronStyle}>›</span>
                    </Link>

                    <div style={dropdownDividerStyle} />

                    {/* 2. Платежі */}
                    <Link to="/profile?tab=payments" onClick={() => setProfileDropdownOpen(false)} style={dropdownRowStyle}>
                      <div style={dropdownIconBoxStyle}>
                        <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                          <path d="M9 14.3337H22.3344M10.3334 11H21.001C21.7374 11 22.3344 11.597 22.3344 12.3335V19.0009C22.3344 19.7374 21.7374 20.3344 21.001 20.3344H10.3334C9.597 20.3344 9 19.7374 9 19.0009V12.3335C9 11.597 9.597 11 10.3334 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ flex: 1 }}>Платежі</span>
                      <span style={dropdownChevronStyle}>›</span>
                    </Link>

                    <div style={dropdownDividerStyle} />

                    {/* 3. Фінанси */}
                    <Link to="/profile?tab=finance" onClick={() => setProfileDropdownOpen(false)} style={dropdownRowStyle}>
                      <div style={dropdownIconBoxStyle}>
                        <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                          <path d="M21.75 18V21C21.75 21.1989 21.6754 21.3897 21.5425 21.5303C21.4097 21.671 21.2295 21.75 21.0417 21.75H10.4167C10.0409 21.75 9.68061 21.592 9.41493 21.3107C9.14926 21.0294 9 20.6478 9 20.25V9.75C9 9.35218 9.14926 8.97064 9.41493 8.68934C9.68061 8.40804 10.0409 8.25 10.4167 8.25H19.625C19.8129 8.25 19.993 8.32902 20.1259 8.46967C20.2587 8.61032 20.3333 8.80109 20.3333 9V11.25M9 9.75C9 10.1478 9.14926 10.5294 9.41493 10.8107C9.68061 11.092 10.0409 11.25 10.4167 11.25H21.0417C21.2295 11.25 21.4097 11.329 21.5425 11.4697C21.6754 11.6103 21.75 11.8011 21.75 12V15M21.75 15H19.625C19.2493 15 18.8889 15.158 18.6233 15.4393C18.3576 15.7206 18.2083 16.1022 18.2083 16.5C18.2083 16.8978 18.3576 17.2794 18.6233 17.5607C18.8889 17.842 19.2493 18 19.625 18H21.75M21.75 15C21.9379 15 22.118 15.079 22.2509 15.2197C22.3837 15.3603 22.4583 15.5511 22.4583 15.75V17.25C22.4583 17.4489 22.3837 17.6397 22.2509 17.7803C22.118 17.921 21.9379 18 21.75 18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ flex: 1 }}>Фінанси</span>
                      <span style={dropdownChevronStyle}>›</span>
                    </Link>

                    <div style={dropdownDividerStyle} />

                    {/* 4. Аналітика */}
                    <Link to="/profile?tab=analytics" onClick={() => setProfileDropdownOpen(false)} style={dropdownRowStyle}>
                      <div style={dropdownIconBoxStyle}>
                        <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                          <path d="M10 21.25V16.75M15.2506 21.25V12.25M20.5012 21.25V7.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ flex: 1 }}>Аналітика</span>
                      <span style={dropdownChevronStyle}>›</span>
                    </Link>

                    <div style={dropdownDividerStyle} />

                    {/* 5. Налаштування */}
                    <Link to="/profile?tab=settings" onClick={() => setProfileDropdownOpen(false)} style={dropdownRowStyle}>
                      <div style={dropdownIconBoxStyle}>
                        <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                          <path d="M13.4182 10.2576C13.455 9.87116 13.6345 9.51229 13.9216 9.25112C14.2088 8.98994 14.5831 8.84521 14.9712 8.84521C15.3594 8.84521 15.7337 8.98994 16.0208 9.25112C16.308 9.51229 16.4875 9.87116 16.5242 10.2576C16.5463 10.5072 16.6282 10.7479 16.763 10.9592C16.8978 11.1704 17.0815 11.3461 17.2985 11.4714C17.5156 11.5966 17.7597 11.6677 18.01 11.6787C18.2604 11.6896 18.5097 11.6401 18.7369 11.5343C19.0896 11.3741 19.4894 11.3509 19.8582 11.4693C20.2271 11.5876 20.5388 11.8389 20.7326 12.1743C20.9264 12.5098 20.9884 12.9053 20.9067 13.284C20.8249 13.6626 20.6052 13.9973 20.2902 14.2229C20.0852 14.3668 19.9178 14.558 19.8022 14.7803C19.6866 15.0026 19.6263 15.2494 19.6263 15.4999C19.6263 15.7505 19.6866 15.9973 19.8022 16.2196C19.9178 16.4419 20.0852 16.633 20.2902 16.7769C20.6052 17.0025 20.8249 17.3372 20.9067 17.7159C20.9884 18.0945 20.9264 18.4901 20.7326 18.8255C20.5388 19.161 20.2271 19.4123 19.8582 19.5306C19.4894 19.6489 19.0896 19.6257 18.7369 19.4656C18.5097 19.3598 18.2604 19.3102 18.01 19.3212C17.7597 19.3321 17.5156 19.4032 17.2985 19.5285C17.0815 19.6537 16.8978 19.8294 16.763 20.0407C16.6282 20.252 16.5463 20.4926 16.5242 20.7423C16.4875 21.1287 16.308 21.4876 16.0208 21.7487C15.7337 22.0099 15.3594 22.1546 14.9712 22.1546C14.5831 22.1546 14.2088 22.0099 13.9216 21.7487C13.6345 21.4876 13.455 21.1287 13.4182 20.7423C13.3962 20.4925 13.3143 20.2518 13.1795 20.0404C13.0447 19.8291 12.8609 19.6533 12.6437 19.5281C12.4266 19.4028 12.1824 19.3317 11.932 19.3209C11.6815 19.31 11.4321 19.3596 11.2049 19.4656C10.8522 19.6257 10.4525 19.6489 10.0836 19.5306C9.71469 19.4123 9.40302 19.161 9.20923 18.8255C9.01544 18.4901 8.95338 18.0945 9.03515 17.7159C9.11691 17.3372 9.33664 17.0025 9.65157 16.7769C9.85665 16.633 10.0241 16.4419 10.1396 16.2196C10.2552 15.9973 10.3155 15.7505 10.3155 15.4999C10.3155 15.2494 10.2552 15.0026 10.1396 14.7803C10.0241 14.558 9.85665 14.3668 9.65157 14.2229C9.33708 13.9972 9.11774 13.6627 9.03617 13.2843C8.95461 12.9058 9.01665 12.5106 9.21023 12.1754C9.40381 11.8402 9.71511 11.5889 10.0836 11.4704C10.4522 11.3519 10.8516 11.3747 11.2042 11.5343C11.4314 11.6401 11.6807 11.6896 11.9311 11.6787C12.1815 11.6677 12.4255 11.5966 12.6426 11.4714C12.8597 11.3461 13.0434 11.1704 13.1781 10.9592C13.3129 10.7479 13.3948 10.5072 13.4169 10.2576M16.9707 15.5002C16.9707 16.6047 16.0753 17.5002 14.9707 17.5002C13.8661 17.5002 12.9707 16.6047 12.9707 15.5002C13.8661 14.3956 13.8661 13.5002 14.9707 13.5002C16.0753 13.5002 16.9707 14.3956 16.9707 15.5002Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ flex: 1 }}>Налаштування</span>
                      <span style={dropdownChevronStyle}>›</span>
                    </Link>

                    <div style={dropdownDividerStyle} />

                    {/* 6. Безпека */}
                    <Link to="/profile?tab=security" onClick={() => setProfileDropdownOpen(false)} style={dropdownRowStyle}>
                      <div style={dropdownIconBoxStyle}>
                        <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                          <path d="M15.5594 21.6328C18.3325 20.6661 20.6656 18.9993 20.6656 15.6659V10.9991C20.6656 10.8223 20.5954 10.6527 20.4704 10.5277C20.3453 10.4026 20.1758 10.3324 19.999 10.3324C18.6658 10.3324 17.006 9.53904 15.8394 8.519C15.6982 8.39833 15.5185 8.33203 15.3328 8.33203C15.1471 8.33203 14.9674 8.39833 14.8262 8.519C13.6663 9.53237 11.9998 10.3324 10.6666 10.3324C10.4898 10.3324 10.3203 10.4026 10.1952 10.5277C10.0702 10.6527 10 10.8223 10 10.9991V15.6659C10 18.9993 12.3331 20.6661 15.1128 21.6261C15.2565 21.6796 15.4142 21.682 15.5594 21.6328Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ flex: 1 }}>Безпека</span>
                      <span style={dropdownChevronStyle}>›</span>
                    </Link>

                    <div style={dropdownDividerStyle} />

                    {/* 7. Вийти з акаунта */}
                    <div
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/login');
                      }}
                      style={{ ...dropdownRowStyle, color: '#DC9666', fontWeight: 700 }}
                    >
                      <div style={dropdownIconBoxStyle}>
                        <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                          <path d="M19.5556 10.5556L24 15L19.5556 19.4444M24 15H13.3333M13.3333 23H9.77778C9.30628 23 8.8541 22.8127 8.5207 22.4793C8.1873 22.1459 8 21.6937 8 21.2222V8.77778C8 8.30628 8.1873 7.8541 8.5207 7.5207C8.8541 7.1873 9.30628 7 9.77778 7H13.3333" stroke="#DC9666" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ flex: 1 }}>Вийти з акаунта</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login" style={authOutlineBtnStyle}>Увійти</Link>
                <Link to="/register" style={authFillBtnStyle}>Реєстрація</Link>
              </div>
            )}

            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} style={mobileBurgerBtnStyle}>
              {mobileNavOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

// ==========================================
// СТИЛІ NAVBAR (100% WIDTH)
// ==========================================

const headerRootStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  width: '100%',
  backgroundColor: '#E1D4C2'
};

const headerOuterBar: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  backgroundColor: '#6E473B',
  borderBottomLeftRadius: '39px',
  borderBottomRightRadius: '39px',
  borderBottom: '4px solid #DC9666',
  outline: '4px solid #D7C7B1',
  boxShadow: '0 10px 30px rgba(41, 28, 14, 0.2)'
};

const headerInnerContent: React.CSSProperties = {
  maxWidth: '1820px',
  margin: '0 auto',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const logoContainerStyle: React.CSSProperties = {
  textDecoration: 'none',
  display: 'inline-flex'
};

const verticalSeparatorStyle: React.CSSProperties = {
  width: '1px',
  height: '24px',
  backgroundColor: '#DC9666',
  opacity: 0.7
};

const desktopNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px'
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: '15px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 500
};

const navItemActiveStyle: React.CSSProperties = {
  ...navItemStyle,
  color: '#DC9666',
  fontWeight: 700
};

const navDropdownButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#FFFFFF',
  fontSize: '15px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 500,
  cursor: 'pointer',
  padding: 0
};

const ctaHouseButtonStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  borderRadius: '29px',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontFamily: "'Alegreya', Georgia, serif",
  fontWeight: 800,
  fontSize: '15px',
  boxShadow: '0 4px 14px rgba(220, 150, 102, 0.35)'
};

const langBadgePillStyle: React.CSSProperties = {
  backgroundColor: '#6E473B',
  borderRadius: '26px',
  border: '2px solid #DC9666',
  padding: '4px 10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontFamily: "'Iosevka Charon', sans-serif"
};

const userProfileButtonStyle: React.CSSProperties = {
  backgroundColor: '#6E473B',
  borderRadius: '31px',
  border: '2px solid #DC9666',
  padding: '4px 12px 4px 4px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer'
};

const userAvatarStyle: React.CSSProperties = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  border: '2px solid #DC9666',
  objectFit: 'cover'
};

const userNameTextStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif",
  maxWidth: '160px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const userRoleTextStyle: React.CSSProperties = {
  color: '#D7C7B1',
  fontSize: '12px',
  fontFamily: "'Iosevka Charon', sans-serif"
};

const figmaFullMenuDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 14px)',
  left: 0,
  width: '304px',
  backgroundColor: '#6E473B',
  borderRadius: '10px',
  border: '2px solid #DC9666',
  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
  padding: '16px 10px',
  zIndex: 1000
};

const figmaFullCabinetDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 14px)',
  right: 0,
  width: '240px',
  backgroundColor: '#6E473B',
  borderRadius: '10px',
  border: '2px solid #DC9666',
  boxShadow: '0 14px 32px rgba(0,0,0,0.35)',
  padding: '16px 10px',
  zIndex: 1000
};

const figmaLanguageDropdownModalStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 14px)',
  right: 0,
  width: '180px',
  backgroundColor: '#6E473B',
  borderRadius: '8px',
  border: '2px solid #DC9666',
  boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
  padding: '10px 0',
  zIndex: 1000
};

const langRadioRowStyle: React.CSSProperties = {
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer'
};

const dropdownRowStyle: React.CSSProperties = {
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: '15px',
  fontFamily: "'Iosevka Charon', sans-serif",
  cursor: 'pointer'
};

const dropdownIconBoxStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: '7px',
  backgroundColor: 'rgba(41, 28, 14, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const dropdownChevronStyle: React.CSSProperties = {
  color: '#E1D4C2',
  fontSize: '18px',
  fontWeight: 700
};

const dropdownDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#DC9666',
  margin: '4px 10px',
  opacity: 0.6
};

const authOutlineBtnStyle: React.CSSProperties = {
  color: '#FFFFFF',
  border: '2px solid #DC9666',
  padding: '8px 18px',
  borderRadius: '20px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif"
};

const authFillBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '8px 18px',
  borderRadius: '20px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif"
};

const mobileBurgerBtnStyle: React.CSSProperties = {
  display: 'none',
  background: 'none',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '26px',
  cursor: 'pointer'
};