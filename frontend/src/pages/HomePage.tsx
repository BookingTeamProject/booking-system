// src/pages/HomePage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '../context/RoutesContext';

interface DisplayRouteItem {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrls: string[];
  categoryName?: string;
  averageRating?: number;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { routes, favorites, toggleFavorite, loading } = useRoutes();

  // --- Стан полів пошуку ---
  const [locationQuery, setLocationQuery] = useState('');
  const [datesQuery, setDatesQuery] = useState('12 груд. - 18 груд. 2026');
  const [guestsQuery, setGuestsQuery] = useState('1 Кімната / 2 Гостя');

  // --- Стан відкриття випадних модалок пошуку ---
  const [locationOpen, setLocationOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  // --- Стан степерів гостей і кімнат ---
  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);

  // --- Стан вибраних дат у календарі ---
  const [selectedStartDay, setSelectedStartDay] = useState<number>(12);
  const [selectedEndDay, setSelectedEndDay] = useState<number>(18);

  // --- Підписка на email ---
  const [emailSub, setEmailSub] = useState('');
  const [subDone, setSubDone] = useState(false);

  // Рефи для кліку за межі
  const locationRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const recentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollRecent = (direction: 'left' | 'right') => {
    if (recentScrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      recentScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSaveGuests = () => {
    const totalGuests = adultsCount + childrenCount;
    setGuestsQuery(`${roomsCount} ${roomsCount === 1 ? 'Кімната' : 'Кімнати'} / ${totalGuests} ${totalGuests === 1 ? 'Гість' : 'Гостя'}`);
    setGuestsOpen(false);
  };

  const handleSaveDates = () => {
    setDatesQuery(`${selectedStartDay} груд. - ${selectedEndDay} груд. 2026`);
    setCalendarOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationQuery) params.append('location', locationQuery);
    navigate(`/routes?${params.toString()}`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubDone(true);
      setTimeout(() => setSubDone(false), 4500);
      setEmailSub('');
    }
  };

  // 8 готелів точно з макета Figma
  const popularHotelsMock: DisplayRouteItem[] = [
    {
      id: '201',
      title: 'Апартаменти біля Мост-Сіті',
      location: 'Дніпро, Україна',
      price: 7428,
      imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '202',
      title: 'Воскресенська 27-2',
      location: 'Дніпро, Україна',
      price: 3558,
      imageUrls: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '203',
      title: 'Шарікофф',
      location: 'Харків, Україна',
      price: 2628,
      imageUrls: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '204',
      title: 'Amalia',
      location: 'Чернівці, Україна',
      price: 3496,
      imageUrls: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '205',
      title: 'GIL apartments',
      location: 'Ужгород, Україна',
      price: 5000,
      imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '206',
      title: 'Апартаменти Left',
      location: 'Івано-Франківськ, Україна',
      price: 4732,
      imageUrls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '207',
      title: 'Апартаменти Аркадія з терасою',
      location: 'Одеса, Україна',
      price: 6038,
      imageUrls: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '208',
      title: 'Appart Kamanina',
      location: 'Одеса, Україна',
      price: 2500,
      imageUrls: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80']
    }
  ];

  // 4 картки для блоку "Ви нещодавно шукали"
  const recentItemsMock: DisplayRouteItem[] = [
    {
      id: '101',
      title: 'Bv Apartaments Chess',
      location: 'Львів, Україна',
      price: 4700,
      imageUrls: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '102',
      title: 'Апартаменти Left',
      location: 'Івано-Франківськ, Україна',
      price: 4732,
      imageUrls: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '103',
      title: 'Апартаменти Loft 22',
      location: 'Івано-Франківськ, Україна',
      price: 3144,
      imageUrls: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '104',
      title: 'Апартаменти Аркадія з терасою',
      location: 'Одеса, Україна',
      price: 6038,
      imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80']
    }
  ];

  // Підключення даних із контексту RoutesContext (використання routes)
  const displayPopularHotels: DisplayRouteItem[] = routes && routes.length > 0
    ? routes.slice(0, 8).map(r => ({
        id: String(r.id),
        title: r.title,
        location: r.location,
        price: r.price,
        imageUrls: r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80']
      }))
    : popularHotelsMock;

  const displayRecentItems: DisplayRouteItem[] = routes && routes.length > 0
    ? routes.slice(0, 4).map(r => ({
        id: String(r.id),
        title: r.title,
        location: r.location,
        price: r.price,
        imageUrls: r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls : ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80']
      }))
    : recentItemsMock;

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;700&family=Manrope:wght@700&display=swap');
          
          .trails-home-root * { box-sizing: border-box; }
          .custom-scrollbar::-webkit-scrollbar { display: none; }
          .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .figma-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
          .figma-card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 16px 32px rgba(41, 28, 14, 0.12) !important;
          }
          .star-rating { color: #DC9666; font-size: 16px; letter-spacing: 2px; }
          @media (max-width: 1024px) {
            .hero-flex-box { flex-direction: column !important; }
            .hero-img-box { width: 100% !important; height: 340px !important; }
            .deals-flex-box { flex-direction: column !important; }
          }
          @media (max-width: 768px) {
            .search-inputs-grid { grid-template-columns: 1fr !important; }
            .features-grid-box { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .features-grid-box { grid-template-columns: 1fr !important; }
          }
        `}
      </style>

      <div className="trails-home-root" style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
        
        {/* ================= 1. HERO BANNER ================= */}
        <section style={heroOuterCardStyle}>
          
          <div className="hero-flex-box" style={{ display: 'flex', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ flex: 1.2 }}>
              <h1 style={heroMainTitleStyle}>
                ЗНАЙДІТЬ СВІЙ<br />
                <span style={{ color: '#DC9666' }}>ІДЕАЛЬНИЙ</span> ВІДПОЧИНОК
              </h1>
              <p style={heroSubTitleStyle}>
                Бронюйте затишні будиночки в мальовничих місцях України ❤️
              </p>
            </div>

            {/* Картинка шале у багатошаровій рамці з Figma */}
            <div className="hero-img-box" style={heroImageFrameStyle}>
              <div style={heroImageBackdrop1} />
              <div style={heroImageBackdrop2} />
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
                alt="Українські Карпати - Будиночок"
                style={heroImageStyle}
              />
            </div>
          </div>

          {/* ПОШУКОВИЙ ВІДЖЕТ FIGMA З ІНТЕРАКТИВНИМИ ВИПАДНИМИ ВІКНАМИ */}
          <div style={{ marginTop: '36px', position: 'relative', zIndex: 10 }}>
            
            {/* Ярлик вкладки "Пошук помешкання" */}
            <div style={searchTabPillStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Пошук помешкання</span>
            </div>

            <form onSubmit={handleSearchSubmit} style={searchContainerCardStyle}>
              <div className="search-inputs-grid" style={searchFieldsGridStyle}>
                
                {/* 1. ПОЛЕ ЛОКАЦІЇ + СПЛИВАЮЧЕ ВІКНО FIGMA "МІСЦЕ ПЕРЕБУВАННЯ" */}
                <div ref={locationRef} style={{ position: 'relative' }}>
                  <div
                    onClick={() => setLocationOpen(!locationOpen)}
                    style={searchFieldBoxStyle}
                  >
                    <label style={searchFieldLabelStyle}>Куди ви їдете?</label>
                    <div style={searchInputWrapperStyle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span style={{ color: locationQuery ? '#291C0E' : '#6E473B', fontSize: '15px', fontWeight: 600 }}>
                        {locationQuery || 'Введіть локацію'}
                      </span>
                    </div>
                  </div>

                  {/* Спливаюче вікно локації з тегами */}
                  {locationOpen && (
                    <div style={figmaLocationModalStyle}>
                      <div style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
                        Місце перебування
                      </div>
                      <input
                        type="text"
                        placeholder="Введіть локацію..."
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        style={locationModalInputStyle}
                        autoFocus
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '14px 0 18px 0' }}>
                        {['Карпати', 'Львів', 'Одеса', 'Дніпро', 'Буковель', 'Київ'].map((tag) => (
                          <div
                            key={tag}
                            onClick={() => setLocationQuery(tag)}
                            style={{
                              ...suggestionPillStyle,
                              backgroundColor: locationQuery === tag ? '#DC9666' : '#FFFFFF',
                              color: locationQuery === tag ? '#FFFFFF' : '#A78D78'
                            }}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setLocationOpen(false)}
                        style={saveModalButtonStyle}
                      >
                        Зберегти
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. ПОЛЕ ДАТ + СПЛИВАЮЧИЙ ДВОМІСЯЧНИЙ КАЛЕНДАР FIGMA */}
                <div ref={calendarRef} style={{ position: 'relative' }}>
                  <div
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    style={searchFieldBoxStyle}
                  >
                    <label style={searchFieldLabelStyle}>Введіть дати</label>
                    <div style={searchInputWrapperStyle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span style={{ color: '#291C0E', fontSize: '15px', fontWeight: 600 }}>
                        {datesQuery}
                      </span>
                    </div>
                  </div>

                  {/* Спливаючий подвійний календар */}
                  {calendarOpen && (
                    <div style={figmaCalendarModalStyle}>
                      <div style={{ color: '#6E473B', fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
                        Дати поїздки
                      </div>

                      <div style={{ display: 'flex', gap: '24px', border: '1px solid #D7C7B1', borderRadius: '16px', padding: '16px' }}>
                        {/* Місяць 1: Грудень 2026 */}
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
                            Грудень 2026
                          </div>
                          <div style={calendarDaysOfWeekRow}>
                            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Нд</span>
                          </div>
                          <div style={calendarDaysGrid}>
                            <span /><span /><span /><span /><span /><span />
                            {[...Array(31)].map((_, i) => {
                              const day = i + 1;
                              const isStart = day === selectedStartDay;
                              const isEnd = day === selectedEndDay;
                              const inRange = day > selectedStartDay && day < selectedEndDay;

                              return (
                                <div
                                  key={day}
                                  onClick={() => {
                                    if (day < selectedStartDay) {
                                      setSelectedStartDay(day);
                                    } else {
                                      setSelectedEndDay(day);
                                    }
                                  }}
                                  style={{
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '13px',
                                    fontWeight: isStart || isEnd ? 700 : 500,
                                    cursor: 'pointer',
                                    backgroundColor: isStart || isEnd ? '#DC9666' : inRange ? 'rgba(220, 150, 102, 0.18)' : 'transparent',
                                    color: isStart || isEnd ? '#FFFFFF' : '#6E473B',
                                    borderRadius: isStart || isEnd ? '8px' : 0
                                  }}
                                >
                                  {day}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Місяць 2: Січень 2027 */}
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
                            Січень 2027
                          </div>
                          <div style={calendarDaysOfWeekRow}>
                            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Нд</span>
                          </div>
                          <div style={calendarDaysGrid}>
                            <span /><span /><span /><span />
                            {[...Array(31)].map((_, i) => (
                              <div
                                key={i + 1}
                                style={{
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '13px',
                                  color: '#6E473B',
                                  cursor: 'pointer'
                                }}
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveDates}
                        style={{ ...saveModalButtonStyle, marginTop: '16px' }}
                      >
                        Зберегти
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. КІМНАТИ ТА ГОСТІ + СПЛИВАЮЧЕ ВІКНО ЗІ СТЕПЕРАМИ */}
                <div ref={guestsRef} style={{ position: 'relative' }}>
                  <div
                    onClick={() => setGuestsOpen(!guestsOpen)}
                    style={searchFieldBoxStyle}
                  >
                    <label style={searchFieldLabelStyle}>Кімнати та гості</label>
                    <div style={searchInputWrapperStyle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span style={{ color: '#291C0E', fontSize: '15px', fontWeight: 600 }}>
                        {guestsQuery}
                      </span>
                    </div>
                  </div>

                  {/* Спливаюче вікно зі степерами */}
                  {guestsOpen && (
                    <div style={figmaGuestsModalStyle}>
                      <div style={guestSectionHeaderStyle}>Кількість кімнат</div>
                      <div style={modalDividerStyle} />

                      {/* Степер кімнат */}
                      <div style={stepperRowStyle}>
                        <span style={stepperLabelStyle}>Кімнати</span>
                        <div style={stepperActionsStyle}>
                          <button
                            type="button"
                            onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                            style={minusBtnStyle}
                          >
                            -
                          </button>
                          <span style={stepperValueStyle}>{roomsCount}</span>
                          <button
                            type="button"
                            onClick={() => setRoomsCount(roomsCount + 1)}
                            style={plusBtnStyle}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={modalDividerStyle} />
                      <div style={guestSectionHeaderStyle}>Кількість людей</div>
                      <div style={modalDividerStyle} />

                      {/* Дорослі */}
                      <div style={stepperRowStyle}>
                        <div>
                          <div style={stepperLabelStyle}>Дорослі</div>
                          <div style={stepperSubStyle}>Вік 13+</div>
                        </div>
                        <div style={stepperActionsStyle}>
                          <button
                            type="button"
                            onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                            style={minusBtnStyle}
                          >
                            -
                          </button>
                          <span style={stepperValueStyle}>{adultsCount}</span>
                          <button
                            type="button"
                            onClick={() => setAdultsCount(adultsCount + 1)}
                            style={plusBtnStyle}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={modalDividerStyle} />

                      {/* Діти */}
                      <div style={stepperRowStyle}>
                        <div>
                          <div style={stepperLabelStyle}>Діти</div>
                          <div style={stepperSubStyle}>Вік 2–12</div>
                        </div>
                        <div style={stepperActionsStyle}>
                          <button
                            type="button"
                            onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                            style={minusBtnStyle}
                          >
                            -
                          </button>
                          <span style={stepperValueStyle}>{childrenCount}</span>
                          <button
                            type="button"
                            onClick={() => setChildrenCount(childrenCount + 1)}
                            style={plusBtnStyle}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={modalDividerStyle} />

                      {/* Немовлята */}
                      <div style={stepperRowStyle}>
                        <div>
                          <div style={stepperLabelStyle}>Немовлята</div>
                          <div style={stepperSubStyle}>До 2 років</div>
                        </div>
                        <div style={stepperActionsStyle}>
                          <button
                            type="button"
                            onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                            style={minusBtnStyle}
                          >
                            -
                          </button>
                          <span style={stepperValueStyle}>{infantsCount}</span>
                          <button
                            type="button"
                            onClick={() => setInfantsCount(infantsCount + 1)}
                            style={plusBtnStyle}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={modalDividerStyle} />

                      <button
                        type="button"
                        onClick={handleSaveGuests}
                        style={saveModalButtonStyle}
                      >
                        Зберегти
                      </button>
                    </div>
                  )}
                </div>

                {/* Кнопка пошуку */}
                <button type="submit" style={searchSubmitBtnStyle}>
                  Пошук
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ================= 2. ЧОМУ МИ? ================= */}
        <section style={{ margin: '70px 0', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={sectionHeaderTitleStyle}>ЧОМУ МИ?</h2>
            <div style={orangePillDividerStyle} />
          </div>

          <div className="features-grid-box" style={featuresGridStyle}>
            <div className="figma-card-hover" style={featureCardItemStyle}>
              <div style={featureCircleIconStyle}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 style={featureItemHeadingStyle}>Перевірені<br />помешкання</h3>
            </div>

            <div className="figma-card-hover" style={featureCardItemStyle}>
              <div style={featureCircleIconStyle}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <h3 style={featureItemHeadingStyle}>Підтримка<br />24/7</h3>
            </div>

            <div className="figma-card-hover" style={featureCardItemStyle}>
              <div style={featureCircleIconStyle}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 style={featureItemHeadingStyle}>Безпечне<br />бронювання</h3>
            </div>

            <div className="figma-card-hover" style={featureCardItemStyle}>
              <div style={featureCircleIconStyle}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                </svg>
              </div>
              <h3 style={featureItemHeadingStyle}>Відпочинок, що<br />залишає спогади</h3>
            </div>
          </div>
        </section>

      </div>

      {/* ================= 3. ВИ НЕЩОДАВНО ШУКАЛИ ================= */}
      <section style={darkSectionWrapperStyle}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ ...sectionHeaderTitleStyle, color: '#E1D4C2' }}>
              ВИ НЕЩОДАВНО ШУКАЛИ
            </h2>
            <div style={{ ...orangePillDividerStyle, width: '280px', margin: '10px auto 0 auto' }} />
          </div>

          <div
            ref={recentScrollRef}
            className="custom-scrollbar"
            style={horizontalCarouselTrackStyle}
          >
            {displayRecentItems.map((item) => (
              <div
                key={item.id}
                className="figma-card-hover"
                onClick={() => navigate(`/routes/${item.id}`)}
                style={recentCardItemStyle}
              >
                <div style={{ width: '100%', height: '190px', position: 'relative' }}>
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '36px', borderTopRightRadius: '36px' }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    style={cardHeartBadgeStyle}
                  >
                    {favorites.includes(item.id) ? '❤️' : '🤍'}
                  </button>
                </div>

                <div style={{ padding: '16px 20px 20px 20px' }}>
                  <div className="star-rating">★★★★★</div>
                  <h4 style={recentCardTitleStyle}>{item.title}</h4>
                  <span style={recentCardLocationStyle}>{item.location}</span>

                  <div style={recentCardFooterPriceRow}>
                    <span style={{ fontSize: '26px', fontWeight: 900, color: '#DC9666', fontStyle: 'italic' }}>
                      ₴ {item.price.toLocaleString()}
                    </span>
                    <span style={recentDetailsLinkStyle}>Дивитися деталі</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '28px' }}>
            <button
              onClick={() => handleScrollRecent('left')}
              style={carouselCenterNavBtnStyle}
            >
              ←
            </button>
            <button
              onClick={() => handleScrollRecent('right')}
              style={carouselCenterNavBtnStyle}
            >
              →
            </button>
          </div>

        </div>
      </section>

      {/* ================= 4. АКЦІЇ ДЛЯ ВАС ================= */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '70px 20px' }}>
        <section className="deals-flex-box" style={dealsSectionContainerStyle}>
          
          <div style={{ flex: 1, minHeight: '380px', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80"
              alt="Знижки на відпочинок"
              style={dealsImageStyle}
            />
          </div>

          <div style={{ flex: 1.15, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ ...sectionHeaderTitleStyle, textAlign: 'left', margin: 0 }}>АКЦІЇ ДЛЯ ВАС</h2>
              <div style={{ ...orangePillDividerStyle, margin: '8px 0 0 0', width: '220px' }} />
            </div>

            <div style={dealsListCardWrapperStyle}>
              <div onClick={() => navigate('/promotions')} className="figma-card-hover" style={dealItemRowStyle}>
                <div style={dealPercentBadgeStyle}>%</div>
                <div style={{ flex: 1 }}>
                  <div style={dealItemTitleStyle}>Знижка 20% на Колиба &apos;Два Потоки&apos;</div>
                  <div style={dealItemTagStyle}>ЯРЕМЧЕ, КАРПАТИ</div>
                </div>
                <div style={dealChevronStyle}>›</div>
              </div>

              <div style={dealDividerLineStyle} />

              <div onClick={() => navigate('/promotions')} className="figma-card-hover" style={dealItemRowStyle}>
                <div style={{ ...dealPercentBadgeStyle, backgroundColor: '#6E473B' }}>%</div>
                <div style={{ flex: 1 }}>
                  <div style={dealItemTitleStyle}>Знижка 15% на Пентхаус з видом на Оперу</div>
                  <div style={dealItemTagStyle}>ЛЬВІВ, ЦЕНТР</div>
                </div>
                <div style={dealChevronStyle}>›</div>
              </div>

              <div style={dealDividerLineStyle} />

              <div onClick={() => navigate('/promotions')} className="figma-card-hover" style={dealItemRowStyle}>
                <div style={dealPercentBadgeStyle}>%</div>
                <div style={{ flex: 1 }}>
                  <div style={dealItemTitleStyle}>Знижка 25% на Villa Sunset &amp; Sea Pool</div>
                  <div style={dealItemTagStyle}>ОДЕСА, ФОНТАН</div>
                </div>
                <div style={dealChevronStyle}>›</div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button onClick={() => navigate('/promotions')} style={viewAllDealsBtnStyle}>
                Дивитися всі акції
              </button>
            </div>
          </div>

        </section>
      </div>

      {/* ================= 5. ПОПУЛЯРНІ ГОТЕЛІ (8 КАРТОК) ================= */}
      <section style={darkSectionWrapperStyle}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ ...sectionHeaderTitleStyle, color: '#E1D4C2' }}>
              ПОПУЛЯРНІ ГОТЕЛІ
            </h2>
            <div style={{ ...orangePillDividerStyle, width: '320px', margin: '10px auto 0 auto' }} />
          </div>

          {/* Використання loading зі стану useRoutes */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#E1D4C2', fontSize: '18px' }}>
              Завантаження помешкань...
            </div>
          ) : (
            <div style={popularGridStyle}>
              {displayPopularHotels.map((item) => (
                <div
                  key={item.id}
                  className="figma-card-hover"
                  onClick={() => navigate(`/routes/${item.id}`)}
                  style={recentCardItemStyle}
                >
                  <div style={{ width: '100%', height: '190px', position: 'relative' }}>
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '36px', borderTopRightRadius: '36px' }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      style={cardHeartBadgeStyle}
                    >
                      {favorites.includes(item.id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div style={{ padding: '16px 20px 20px 20px' }}>
                    <div className="star-rating">★★★★★</div>
                    <h4 style={recentCardTitleStyle}>{item.title}</h4>
                    <span style={recentCardLocationStyle}>{item.location}</span>

                    <div style={recentCardFooterPriceRow}>
                      <span style={{ fontSize: '26px', fontWeight: 900, color: '#DC9666', fontStyle: 'italic' }}>
                        ₴ {item.price.toLocaleString()}
                      </span>
                      <span style={recentDetailsLinkStyle}>Дивитися деталі</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button onClick={() => navigate('/routes')} style={recommendationsBtnStyle}>
              Перейти до рекомендацій
            </button>
          </div>

        </div>
      </section>

      {/* ================= 6. БУДЬТЕ В КУРСІ НАЙКРАЩИХ ПРОПОЗИЦІЙ! ================= */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 20px 40px 20px' }}>
        <section style={newsletterContainerCardStyle}>
          <div>
            <h2 style={newsletterHeaderTitleStyle}>БУДЬТЕ В КУРСІ НАЙКРАЩИХ ПРОПОЗИЦІЙ!</h2>
            <div style={{ ...orangePillDividerStyle, margin: '10px 0 16px 0', width: '380px' }} />
            <p style={newsletterSubTitleStyle}>
              Підписатися на рекламу
            </p>
          </div>

          {subDone ? (
            <div style={newsletterSuccessBoxStyle}>
              ✓ Дякуємо за підписку! Спеціальний промокод надіслано на вашу пошту.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '16px', maxWidth: '850px' }}>
              <input
                type="email"
                required
                placeholder="Ваш email..."
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                style={newsletterEmailInputStyle}
              />
              <button type="submit" style={newsletterSubmitBtnStyle}>
                Підписатись
              </button>
            </form>
          )}
        </section>
      </div>

    </div>
  );
};

// ==========================================
// СТИЛІ FIGMA
// ==========================================

const heroOuterCardStyle: React.CSSProperties = {
  backgroundColor: '#D7C7B1',
  borderRadius: '40px',
  padding: '44px 40px 32px 40px',
  outline: '8px solid #A78D78',
  position: 'relative',
  boxShadow: '0 18px 40px rgba(41, 28, 14, 0.08)'
};

const heroMainTitleStyle: React.CSSProperties = {
  fontFamily: "'Alegreya', Georgia, serif",
  fontSize: 'clamp(32px, 4.2vw, 54px)',
  fontWeight: 900,
  color: '#291C0E',
  textTransform: 'uppercase',
  lineHeight: 1.15,
  margin: '0 0 16px 0'
};

const heroSubTitleStyle: React.CSSProperties = {
  fontFamily: "'Alegreya', Georgia, serif",
  fontSize: 'clamp(18px, 1.8vw, 24px)',
  fontWeight: 500,
  color: '#6E473B',
  lineHeight: 1.4,
  margin: 0
};

const heroImageFrameStyle: React.CSSProperties = {
  flex: 1,
  height: '360px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const heroImageBackdrop1: React.CSSProperties = {
  position: 'absolute',
  width: '95%',
  height: '95%',
  backgroundColor: '#6E473B',
  borderRadius: '36px',
  transform: 'rotate(-3deg)',
  top: '8px',
  left: '12px'
};

const heroImageBackdrop2: React.CSSProperties = {
  position: 'absolute',
  width: '95%',
  height: '95%',
  backgroundColor: '#DC9666',
  borderRadius: '36px',
  transform: 'rotate(2.5deg)',
  top: '-4px',
  left: '-4px'
};

const heroImageStyle: React.CSSProperties = {
  position: 'relative',
  width: '95%',
  height: '95%',
  borderRadius: '36px',
  objectFit: 'cover',
  zIndex: 2,
  boxShadow: '0 10px 30px rgba(41, 28, 14, 0.2)'
};

const searchTabPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#E1D4C2',
  padding: '10px 22px',
  borderRadius: '16px 16px 0 0',
  border: '3px solid #6E473B',
  borderBottom: 'none',
  fontFamily: "'Alegreya', Georgia, serif",
  fontWeight: 900,
  fontSize: '18px',
  color: '#6E473B'
};

const searchContainerCardStyle: React.CSSProperties = {
  backgroundColor: '#E1D4C2',
  borderRadius: '24px',
  borderTopLeftRadius: '0',
  border: '4px solid #6E473B',
  padding: '18px 24px',
  boxShadow: '0 12px 24px rgba(41, 28, 14, 0.1)'
};

const searchFieldsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.1fr 1fr auto',
  gap: '16px',
  alignItems: 'center'
};

const searchFieldBoxStyle: React.CSSProperties = {
  backgroundColor: '#D7C7B1',
  borderRadius: '16px',
  border: '2px solid #A78D78',
  padding: '10px 16px',
  cursor: 'pointer'
};

const searchFieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#6E473B',
  fontFamily: "'Iosevka Charon', sans-serif",
  marginBottom: '2px'
};

const searchInputWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const searchSubmitBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '16px',
  padding: '16px 36px',
  fontSize: '20px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif",
  cursor: 'pointer',
  boxShadow: '0 6px 14px rgba(220, 150, 102, 0.4)'
};

const sectionHeaderTitleStyle: React.CSSProperties = {
  fontFamily: "'Alegreya', Georgia, serif",
  fontSize: 'clamp(28px, 3.2vw, 42px)',
  fontWeight: 900,
  fontStyle: 'italic',
  textTransform: 'uppercase',
  color: '#291C0E',
  margin: 0,
  letterSpacing: '0.8px'
};

const orangePillDividerStyle: React.CSSProperties = {
  width: '180px',
  height: '8px',
  backgroundColor: '#DC9666',
  borderRadius: '50px',
  margin: '8px auto 0 auto'
};

const featuresGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '24px'
};

const featureCardItemStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '40px',
  border: '2px solid #D7C7B1',
  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.06)',
  padding: '44px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '20px'
};

const featureCircleIconStyle: React.CSSProperties = {
  width: '110px',
  height: '110px',
  borderRadius: '50%',
  backgroundColor: '#DC9666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 18px rgba(220, 150, 102, 0.35)'
};

const featureItemHeadingStyle: React.CSSProperties = {
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '22px',
  fontWeight: 700,
  color: '#6E473B',
  margin: 0,
  lineHeight: 1.25
};

const darkSectionWrapperStyle: React.CSSProperties = {
  backgroundColor: '#6E473B',
  padding: '65px 0',
  borderRadius: '36px',
  margin: '40px 0'
};

const horizontalCarouselTrackStyle: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  overflowX: 'auto',
  padding: '12px 6px 20px 6px'
};

const recentCardItemStyle: React.CSSProperties = {
  minWidth: '310px',
  backgroundColor: '#FFFFFF',
  borderRadius: '36px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
};

const cardHeartBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  borderRadius: '50%',
  width: '38px',
  height: '38px',
  cursor: 'pointer',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
};

const recentCardTitleStyle: React.CSSProperties = {
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '19px',
  fontWeight: 700,
  color: '#6E473B',
  margin: '6px 0 4px 0',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const recentCardLocationStyle: React.CSSProperties = {
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '14px',
  color: '#A78D78',
  fontWeight: 500,
  display: 'block',
  marginBottom: '14px'
};

const recentCardFooterPriceRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #F4ECE4',
  paddingTop: '10px'
};

const recentDetailsLinkStyle: React.CSSProperties = {
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: '#6E473B'
};

const carouselCenterNavBtnStyle: React.CSSProperties = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  backgroundColor: '#6E473B',
  border: '2px solid #DC9666',
  color: '#DC9666',
  fontSize: '20px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const dealsSectionContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '40px',
  alignItems: 'center'
};

const dealsImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  maxHeight: '480px',
  borderRadius: '40px',
  objectFit: 'cover',
  boxShadow: '0 16px 36px rgba(41, 28, 14, 0.15)',
  border: '3px solid #D7C7B1'
};

const dealsListCardWrapperStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '36px',
  border: '2px solid #D7C7B1',
  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.06)',
  padding: '24px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const dealItemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  cursor: 'pointer',
  padding: '6px 8px',
  borderRadius: '16px'
};

const dealPercentBadgeStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontSize: '28px',
  fontWeight: 900,
  fontFamily: "'Alegreya', Georgia, serif",
  fontStyle: 'italic',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const dealItemTitleStyle: React.CSSProperties = {
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: '#6E473B',
  marginBottom: '4px'
};

const dealItemTagStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#A78D78'
};

const dealChevronStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#6E473B'
};

const dealDividerLineStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#D7C7B1',
  width: '100%'
};

const viewAllDealsBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '16px',
  padding: '16px 36px',
  fontSize: '18px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif",
  cursor: 'pointer',
  boxShadow: '0 6px 16px rgba(220, 150, 102, 0.35)'
};

const popularGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '24px'
};

const recommendationsBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '16px',
  padding: '16px 40px',
  fontSize: '20px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif",
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(220, 150, 102, 0.4)'
};

const newsletterContainerCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '40px',
  border: '3px solid #D7C7B1',
  boxShadow: '0 12px 30px rgba(41, 28, 14, 0.06)',
  padding: '48px 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const newsletterHeaderTitleStyle: React.CSSProperties = {
  fontFamily: "'Alegreya', Georgia, serif",
  fontSize: 'clamp(26px, 3vw, 38px)',
  fontWeight: 900,
  fontStyle: 'italic',
  textTransform: 'uppercase',
  color: '#291C0E',
  margin: 0
};

const newsletterSubTitleStyle: React.CSSProperties = {
  fontFamily: "'Iosevka Charon', sans-serif",
  fontSize: '20px',
  fontWeight: 700,
  color: '#6E473B',
  margin: 0
};

const newsletterEmailInputStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '2px solid #D7C7B1',
  padding: '16px 20px',
  fontSize: '18px',
  fontFamily: "'Iosevka Charon', sans-serif",
  color: '#291C0E',
  outline: 'none'
};

const newsletterSubmitBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '16px',
  padding: '16px 36px',
  fontSize: '20px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif",
  cursor: 'pointer',
  boxShadow: '0 6px 14px rgba(220, 150, 102, 0.4)'
};

const newsletterSuccessBoxStyle: React.CSSProperties = {
  backgroundColor: '#E8F5E9',
  border: '2px solid #81C784',
  color: '#2E7D32',
  padding: '16px 20px',
  borderRadius: '16px',
  fontSize: '18px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif"
};

// ==========================================
// СТИЛІ МОДАЛЬНИХ ВІКОН ПОШУКУ З FIGMA
// ==========================================

const figmaLocationModalStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 12px)',
  left: 0,
  width: '540px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  boxShadow: '0 16px 36px rgba(0,0,0,0.18)',
  padding: '24px',
  zIndex: 1000
};

const locationModalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: '1.5px solid #D7C7B1',
  outline: 'none',
  fontSize: '15px',
  fontFamily: "'Iosevka Charon', sans-serif",
  color: '#6E473B'
};

const suggestionPillStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '20px',
  border: '1px solid #D7C7B1',
  fontSize: '13px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif",
  cursor: 'pointer'
};

const figmaCalendarModalStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 12px)',
  left: '-100px',
  width: '612px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  boxShadow: '0 16px 36px rgba(0,0,0,0.18)',
  padding: '20px',
  zIndex: 1000
};

const calendarDaysOfWeekRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
  color: '#6E473B',
  fontSize: '12px',
  fontWeight: 700,
  fontFamily: "'Iosevka Charon', sans-serif",
  marginBottom: '8px'
};

const calendarDaysGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
  fontFamily: "'Iosevka Charon', sans-serif"
};

const figmaGuestsModalStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 12px)',
  right: 0,
  width: '280px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  boxShadow: '0 16px 36px rgba(0,0,0,0.18)',
  padding: '20px',
  zIndex: 1000
};

const guestSectionHeaderStyle: React.CSSProperties = {
  color: '#DC9666',
  fontSize: '15px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700
};

const modalDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#D7C7B1',
  margin: '12px 0'
};

const stepperRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const stepperLabelStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '15px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700
};

const stepperSubStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '12px',
  fontFamily: "'Iosevka Charon', sans-serif",
  opacity: 0.8
};

const stepperActionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const minusBtnStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D7C7B1',
  color: '#6E473B',
  fontSize: '18px',
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const plusBtnStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  backgroundColor: '#DC9666',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '18px',
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const stepperValueStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '16px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700,
  minWidth: '18px',
  textAlign: 'center'
};

const saveModalButtonStyle: React.CSSProperties = {
  width: '100%',
  height: '42px',
  backgroundColor: '#DC9666',
  borderRadius: '8px',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '15px',
  fontFamily: "'Iosevka Charon', sans-serif",
  fontWeight: 700,
  cursor: 'pointer'
};