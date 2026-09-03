import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '../context/RoutesContext';
import { useSettings } from '../context/SettingsContext';

// ======================== SVG ІКОНКИ ========================
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MapPinIcon = ({ color = '#DC9666', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = ({ fill = '#DC9666', size = 13 }: { fill?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#DC9666' : 'none'} stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const RoutesCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { routes, favorites, toggleFavorite, loading } = useRoutes();
  const { formatPrice, t } = useSettings();

  // Стейт пошуку
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [roomsCount, setRoomsCount] = useState<number>(1);

  // Сортування (Figma Frame 341)
  const [sortBy, setSortBy] = useState('recommended');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Модалки та поповери
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Стейт вибору гостей
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Стейт вибору дат
  const [startDate, setStartDate] = useState<number>(12);
  const [endDate, setEndDate] = useState<number>(18);
  const [activeMonth, setActiveMonth] = useState<'dec' | 'jan'>('dec');

  const sortOptions = [
    { id: 'recommended', label: 'Рекомендовані' },
    { id: 'newest', label: 'Найсвіжіші' },
    { id: 'popular', label: 'Популярні' },
    { id: 'price_desc', label: 'Спочатку дорожчі' },
    { id: 'price_asc', label: 'Спочатку дешевші' },
  ];

  const currentSortLabel = sortOptions.find((o) => o.id === sortBy)?.label || 'Рекомендовані';

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setMinPrice(500);
    setMaxPrice(6000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setMinRating(0);
    setRoomsCount(1);
    setSearch('');
  };

  const handleDateClick = (day: number, month: 'dec' | 'jan') => {
    setActiveMonth(month);
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(day);
    } else if (day >= startDate) {
      setEndDate(day);
    } else {
      setStartDate(day);
    }
  };

  // Фільтрація
  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query);

      const p = r.price || 0;
      const matchesPrice = p >= minPrice && p <= maxPrice;
      const matchesType =
        selectedTypes.length === 0 || (r.categoryId && selectedTypes.includes(r.categoryId));
      const matchesRating = minRating === 0 || (r.averageRating || 0) >= minRating;

      return matchesSearch && matchesPrice && matchesType && matchesRating;
    });
  }, [routes, search, minPrice, maxPrice, selectedTypes, minRating]);

  return (
    <div style={{ backgroundColor: '#F8F5F0', minHeight: '100vh', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif", position: 'relative' }}>
      
      {/* 1. ВЕРХНІЙ ПОШУКОВИЙ БАР (FIGMA) */}
      <div style={searchBarSectionStyle}>
        <div style={searchBarContainerStyle}>
          {/* Поле 1: Напрямок */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1.2 }}>
            <SearchIcon />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <span style={searchLabelStyle}>{t('destination')}</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Карпати, Україна"
                style={searchInputStyle}
              />
            </div>
          </div>

          <div style={verticalDividerStyle} />

          {/* Поле 2: Дати (клікабельно -> відкриває календар) */}
          <div
            style={{ display: 'flex', flexDirection: 'column', flex: 1, cursor: 'pointer', position: 'relative' }}
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setShowGuestsPicker(false);
            }}
          >
            <span style={searchLabelStyle}>{t('dates')}</span>
            <span style={searchValueStyle}>
              {startDate} – {endDate} {activeMonth === 'dec' ? 'грудня' : 'січня'}
            </span>

            {/* ПОПОВЕР КАЛЕНДАРЯ (FIGMA ДАТИ ПОЇЗДКИ) */}
            {showDatePicker && (
              <div
                style={datePickerPopoverStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#6E473B', marginBottom: '16px' }}>
                  Дати поїздки
                </div>

                <div style={doubleCalendarBoxStyle}>
                  {/* Місяць 1: Грудень 2026 */}
                  <div style={{ flex: 1 }}>
                    <div style={calendarMonthTitleStyle}>Грудень 2026</div>
                    <div style={weekHeaderStyle}>
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d) => (
                        <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#6E473B' }}>
                          {d}
                        </div>
                      ))}
                    </div>
                    <div style={daysGridStyle}>
                      {/* Порожні дні до 1 грудня (вівторок) */}
                      <div style={{ height: '34px' }} />
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const isSelected = day === startDate || day === endDate;
                        const inRange = day > startDate && day < endDate;
                        return (
                          <button
                            key={day}
                            onClick={() => handleDateClick(day, 'dec')}
                            style={{
                              ...daySquareStyle,
                              backgroundColor: isSelected ? '#DC9666' : inRange ? 'rgba(220, 150, 102, 0.15)' : 'white',
                              color: isSelected ? 'white' : inRange ? '#DC9666' : '#6E473B',
                              fontWeight: isSelected || inRange ? 700 : 500,
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Місяць 2: Січень 2027 */}
                  <div style={{ flex: 1 }}>
                    <div style={calendarMonthTitleStyle}>Січень 2027</div>
                    <div style={weekHeaderStyle}>
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d) => (
                        <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#6E473B' }}>
                          {d}
                        </div>
                      ))}
                    </div>
                    <div style={daysGridStyle}>
                      {/* Порожні дні до 1 січня (п'ятниця) */}
                      <div style={{ height: '34px' }} />
                      <div style={{ height: '34px' }} />
                      <div style={{ height: '34px' }} />
                      <div style={{ height: '34px' }} />
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <button
                          key={day}
                          onClick={() => handleDateClick(day, 'jan')}
                          style={daySquareStyle}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  style={saveActionBtnStyle}
                  onClick={() => setShowDatePicker(false)}
                >
                  Зберегти
                </button>
              </div>
            )}
          </div>

          <div style={verticalDividerStyle} />

          {/* Поле 3: Гості (клікабельно -> відкриває степпери людей) */}
          <div
            style={{ display: 'flex', flexDirection: 'column', flex: 1, cursor: 'pointer', position: 'relative' }}
            onClick={() => {
              setShowGuestsPicker(!showGuestsPicker);
              setShowDatePicker(false);
            }}
          >
            <span style={searchLabelStyle}>{t('guests')}</span>
            <span style={searchValueStyle}>
              {adults + children} гостя {infants > 0 ? `(${infants} нем.)` : ''}
            </span>

            {/* ПОПОВЕР КІЛЬКОСТІ ЛЮДЕЙ (FIGMA) */}
            {showGuestsPicker && (
              <div
                style={guestsPickerPopoverStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#6E473B', marginBottom: '8px' }}>
                  Кількість людей
                </div>
                <hr style={filterDividerStyle} />

                {/* Дорослі */}
                <div style={stepperRowStyle}>
                  <div>
                    <div style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700 }}>Дорослі</div>
                    <div style={{ color: '#6E473B', fontSize: '12px' }}>Вік 13+</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      style={circleMinusBtnStyle}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#6E473B' }}>{adults}</span>
                    <button
                      style={circlePlusBtnStyle}
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr style={filterDividerStyle} />

                {/* Діти */}
                <div style={stepperRowStyle}>
                  <div>
                    <div style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700 }}>Діти</div>
                    <div style={{ color: '#6E473B', fontSize: '12px' }}>Вік 2–12</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      style={circleMinusBtnStyle}
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#6E473B' }}>{children}</span>
                    <button
                      style={circlePlusBtnStyle}
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr style={filterDividerStyle} />

                {/* Немовлята */}
                <div style={stepperRowStyle}>
                  <div>
                    <div style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700 }}>Немовлята</div>
                    <div style={{ color: '#6E473B', fontSize: '12px' }}>До 2 років</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      style={circleMinusBtnStyle}
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#6E473B' }}>{infants}</span>
                    <button
                      style={circlePlusBtnStyle}
                      onClick={() => setInfants(infants + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr style={filterDividerStyle} />

                <button
                  style={saveActionBtnStyle}
                  onClick={() => setShowGuestsPicker(false)}
                >
                  Зберегти
                </button>
              </div>
            )}
          </div>

          <button style={searchSubmitBtnStyle}>
            <ArrowRightIcon />
          </button>
        </div>

        {/* Кнопка "Показати мапу" */}
        <button style={mapToggleBtnStyle} onClick={() => setShowMapModal(true)}>
          <MapPinIcon color="#DC9666" size={16} />
          <span>{t('showMap')}</span>
        </button>
      </div>

      {/* 2. МОДАЛЬНЕ ВІКНО КАРТИ (FIGMA MAP-CARD) */}
      {showMapModal && (
        <div style={modalBackdropStyle} onClick={() => setShowMapModal(false)}>
          <div style={mapCardModalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ color: '#291C0E', fontSize: '30px', fontWeight: 700 }}>Карта</div>
              
              {/* Пошук на карті */}
              <div style={mapSearchBoxStyle}>
                <MapPinIcon color="#6E473B" size={18} />
                <input
                  type="text"
                  placeholder="Введіть локацію..."
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '15px', color: '#6E473B' }}
                />
              </div>

              {/* Червона кнопка закриття як у Figma */}
              <button style={closeRedBtnStyle} onClick={() => setShowMapModal(false)}>
                ✕
              </button>
            </div>

            {/* В'юпорт карти з пінами */}
            <div style={mapViewportStyle}>
              {/* Фонова карта */}
              <div style={mapCanvasStyle}>
                {/* Піни садиб */}
                <div style={{ ...mapPinIconWrapperStyle, left: '20%', top: '35%' }}>
                  <MapPinIcon color="#FFFFFF" size={18} />
                </div>
                <div style={{ ...mapLocationChipStyle, left: '12%', top: '44%' }}>
                  <MapPinIcon color="#A78D78" size={14} />
                  <span>Яремче, Івано-Франківська обл.</span>
                </div>

                <div style={{ ...mapPinIconWrapperStyle, left: '55%', top: '25%' }}>
                  <MapPinIcon color="#FFFFFF" size={18} />
                </div>
                <div style={{ ...mapLocationChipStyle, left: '46%', top: '34%' }}>
                  <MapPinIcon color="#A78D78" size={14} />
                  <span>Верховина, Карпати</span>
                </div>

                <div style={{ ...mapPinIconWrapperStyle, left: '78%', top: '60%' }}>
                  <MapPinIcon color="#FFFFFF" size={18} />
                </div>
                <div style={{ ...mapLocationChipStyle, left: '70%', top: '70%' }}>
                  <MapPinIcon color="#A78D78" size={14} />
                  <span>Синевирська Поляна, Закарпаття</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ГОЛОВНА СІТКА: ФІЛЬТРИ + СПИСОК ЖИТЛА */}
      <div style={mainGridContainerStyle}>
        
        {/* ЛІВА КОЛОНКА: ФІЛЬТРИ */}
        <aside style={sidebarFiltersStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#6E473B', margin: 0 }}>{t('filters')}</h2>
            <button onClick={handleResetFilters} style={resetBtnStyle}>
              {t('clearAll')}
            </button>
          </div>

          <hr style={filterDividerStyle} />

          {/* Ціна */}
          <div>
            <span style={filterSectionTitleStyle}>{t('pricePerNight')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <div style={priceBoxStyle}>
                <span style={{ fontSize: '11px', color: '#6E473B' }}>від</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#291C0E' }}>{formatPrice(minPrice)}</span>
              </div>
              <span style={{ color: '#6E473B' }}>—</span>
              <div style={priceBoxStyle}>
                <span style={{ fontSize: '11px', color: '#6E473B' }}>до</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#291C0E' }}>{formatPrice(maxPrice)}</span>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#DC9666', cursor: 'pointer' }}
              />
            </div>
          </div>

          <hr style={filterDividerStyle} />

          {/* Тип помешкання */}
          <div>
            <span style={filterSectionTitleStyle}>{t('propertyType')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {[
                { id: 'chalet', label: 'Шале та котеджі', count: 15 },
                { id: 'glamping', label: 'Купольні глемпінги', count: 8 },
                { id: 'trail', label: 'Піші маршрути', count: 6 },
              ].map((item) => {
                const checked = selectedTypes.includes(item.id);
                return (
                  <label key={item.id} style={checkboxRowStyle} onClick={() => toggleType(item.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ ...customCheckboxStyle, borderColor: checked ? '#DC9666' : '#A78D78', backgroundColor: checked ? '#DC9666' : 'white' }}>
                        {checked && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                      </div>
                      <span style={{ fontSize: '14px', color: '#291C0E' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6E473B', fontWeight: 700 }}>{item.count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <hr style={filterDividerStyle} />

          {/* Зручності */}
          <div>
            <span style={filterSectionTitleStyle}>{t('amenities')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {[
                { id: 'chan', label: 'Еко-чан / Гаряча бочка', count: 19 },
                { id: 'kitchen', label: 'Власна кухня', count: 31 },
                { id: 'sauna', label: 'Баня / Сауна на дровах', count: 14 },
                { id: 'terrace', label: 'Панорамна тераса', count: 28 },
              ].map((item) => {
                const checked = selectedAmenities.includes(item.id);
                return (
                  <label key={item.id} style={checkboxRowStyle} onClick={() => toggleAmenity(item.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ ...customCheckboxStyle, borderColor: checked ? '#DC9666' : '#A78D78', backgroundColor: checked ? '#DC9666' : 'white' }}>
                        {checked && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                      </div>
                      <span style={{ fontSize: '14px', color: '#291C0E' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6E473B', fontWeight: 700 }}>{item.count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <hr style={filterDividerStyle} />

          {/* Рейтинг */}
          <div>
            <span style={filterSectionTitleStyle}>{t('rating')}</span>
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              {[5, 4, 3].map((val) => {
                const active = minRating === val;
                return (
                  <button
                    key={val}
                    onClick={() => setMinRating(active ? 0 : val)}
                    style={{
                      ...ratingPillStyle,
                      backgroundColor: active ? '#DC9666' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#291C0E',
                      borderColor: active ? '#DC9666' : '#D7C7B1',
                    }}
                  >
                    <span>{val}</span>
                    <StarIcon fill={active ? '#FFFFFF' : '#DC9666'} />
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={filterDividerStyle} />

          {/* Кімнати */}
          <div>
            <span style={filterSectionTitleStyle}>{t('roomsCount')}</span>
            <div style={counterBoxStyle}>
              <button style={counterBtnStyle} onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}>-</button>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#6E473B' }}>{roomsCount}</span>
              <button style={counterBtnStyle} onClick={() => setRoomsCount(roomsCount + 1)}>+</button>
            </div>
          </div>
        </aside>

        {/* СПИСОК РЕЗУЛЬТАТІВ */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#6E473B', margin: 0 }}>
                Знайдено {filteredRoutes.length} варіантів
              </h1>
              <span style={destinationBadgeStyle}>Карпати · 2026</span>
            </div>

            {/* КАСТОМНИЙ СЕЛЕКТОР СОРТУВАННЯ (FRAME 341) */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6E473B' }}>{t('sortBy')}</span>
              
              <button
                style={customSortTriggerStyle}
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <span>{currentSortLabel}</span>
                <ChevronDownIcon />
              </button>

              {showSortDropdown && (
                <div style={sortDropdownMenuStyle}>
                  {sortOptions.map((opt) => {
                    const isCurrent = sortBy === opt.id;
                    return (
                      <div
                        key={opt.id}
                        style={sortMenuItemStyle}
                        onClick={() => {
                          setSortBy(opt.id);
                          setShowSortDropdown(false);
                        }}
                      >
                        <div style={sortRadioOuterStyle}>
                          {isCurrent && <div style={sortRadioInnerStyle} />}
                        </div>
                        <span style={{ color: '#DC9666', fontSize: '14px', fontWeight: 700 }}>
                          {opt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div style={messageBoxStyle}>Завантаження варіантів...</div>
          ) : filteredRoutes.length === 0 ? (
            <div style={messageBoxStyle}>
              <h3 style={{ color: '#6E473B', margin: '0 0 8px 0' }}>{t('notFound')}</h3>
            </div>
          ) : (
            filteredRoutes.map((route) => {
              const nights = 7;
              const isFav = favorites.includes(route.id);
              const calculatedTotal = (route.price || 0) * nights;

              return (
                <div key={route.id} style={propertyCardStyle}>
                  <img
                    src={route.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=700&q=80'}
                    alt={route.title}
                    style={propertyImageStyle}
                  />

                  <div style={cardContentStyle}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#291C0E', margin: '0 0 6px 0' }}>
                            {route.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPinIcon size={14} color="#DC9666" />
                            <span style={{ fontSize: '13px', color: '#A78D78' }}>{route.location}</span>
                          </div>
                        </div>

                        <div style={ratingBadgeStyle}>
                          <StarIcon size={14} fill="#DC9666" />
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#DC9666' }}>
                            {route.averageRating || 4.9}
                          </span>
                          <span style={{ fontSize: '11px', color: '#A78D78' }}>({route.reviewsCount || 12})</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '14px', color: '#6E473B', lineHeight: '21px', margin: '14px 0 16px 0' }}>
                        {route.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(route.amenities && route.amenities.length > 0
                          ? route.amenities
                          : ['Еко-чан', 'Кухня', 'Гірський вид', 'Wi-Fi']
                        ).map((tag) => (
                          <span key={tag} style={amenityChipStyle}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={cardBottomRowStyle}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '22px', fontWeight: 700, color: '#DC9666' }}>
                            {formatPrice(route.price || 0)}
                          </span>
                          <span style={{ fontSize: '13px', color: '#A78D78' }}>{t('perNight')}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6E473B', marginTop: '2px' }}>
                          {t('totalFor')} {formatPrice(calculatedTotal)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          style={favoriteBtnStyle}
                          onClick={() => toggleFavorite(route.id)}
                          title="В обране"
                        >
                          <HeartIcon filled={isFav} />
                        </button>

                        <button
                          style={detailsBtnStyle}
                          onClick={() => navigate(`/routes/${route.id}`)}
                        >
                          {t('details')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

// ======================= СТИЛІ FIGMA =======================

const searchBarSectionStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D7C7B1',
  padding: '24px 60px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
  boxSizing: 'border-box',
};

const searchBarContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: '1px solid #D7C7B1',
  padding: '8px 10px 8px 20px',
  gap: '18px',
  flex: '1',
  maxWidth: '960px',
  position: 'relative',
};

const searchLabelStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.05em',
};

const searchValueStyle: React.CSSProperties = {
  color: '#A78D78',
  fontSize: '15px',
  fontWeight: 700,
};

const searchInputStyle: React.CSSProperties = {
  border: 'none',
  outline: 'none',
  color: '#A78D78',
  fontSize: '15px',
  fontWeight: 700,
  background: 'transparent',
  padding: 0,
  width: '100%',
};

const verticalDividerStyle: React.CSSProperties = {
  width: '1px',
  height: '32px',
  backgroundColor: '#D7C7B1',
};

const searchSubmitBtnStyle: React.CSSProperties = {
  width: '42px',
  height: '42px',
  backgroundColor: '#DC9666',
  borderRadius: '8px',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const mapToggleBtnStyle: React.CSSProperties = {
  padding: '12px 20px',
  borderRadius: '10px',
  border: '1.5px solid #DC9666',
  backgroundColor: 'transparent',
  color: '#DC9666',
  fontSize: '14px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
};

// ПОПОВЕР КАЛЕНДАРЯ
const datePickerPopoverStyle: React.CSSProperties = {
  position: 'absolute',
  top: '56px',
  left: '-60px',
  width: '580px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '24px',
  boxShadow: '0px 10px 30px rgba(41, 28, 14, 0.12)',
  zIndex: 100,
};

const doubleCalendarBoxStyle: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '16px',
};

const calendarMonthTitleStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '15px',
  fontWeight: 700,
  marginBottom: '12px',
};

const weekHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const daysGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
};

const daySquareStyle: React.CSSProperties = {
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  background: 'transparent',
  fontSize: '13px',
};

const saveActionBtnStyle: React.CSSProperties = {
  width: '100%',
  height: '42px',
  backgroundColor: '#DC9666',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 700,
  marginTop: '16px',
  cursor: 'pointer',
};

// ПОПОВЕР ГОСТЕЙ
const guestsPickerPopoverStyle: React.CSSProperties = {
  position: 'absolute',
  top: '56px',
  right: '0',
  width: '320px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '20px',
  boxShadow: '0px 10px 30px rgba(41, 28, 14, 0.12)',
  zIndex: 100,
};

const stepperRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
};

const circleMinusBtnStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  border: '1px solid #D7C7B1',
  backgroundColor: 'white',
  color: '#6E473B',
  fontSize: '18px',
  fontWeight: 700,
  cursor: 'pointer',
};

const circlePlusBtnStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#DC9666',
  color: 'white',
  fontSize: '18px',
  fontWeight: 700,
  cursor: 'pointer',
};

// МОДАЛКА КАРТИ
const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(41, 28, 14, 0.45)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};

const mapCardModalStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '1240px',
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  padding: '24px',
  boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const mapSearchBoxStyle: React.CSSProperties = {
  width: '420px',
  height: '48px',
  borderRadius: '20px',
  border: '1px solid #D7C7B1',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  gap: '10px',
};

const closeRedBtnStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  backgroundColor: '#C62828',
  borderRadius: '50%',
  color: 'white',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const mapViewportStyle: React.CSSProperties = {
  width: '100%',
  height: '460px',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid #D7C7B1',
  position: 'relative',
};

const mapCanvasStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#EAE5DB',
  backgroundImage: 'radial-gradient(#D7C7B1 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  position: 'relative',
};

const mapPinIconWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  width: '34px',
  height: '34px',
  backgroundColor: '#DC9666',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
};

const mapLocationChipStyle: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  borderRadius: '20px',
  border: '1px solid #D7C7B1',
  padding: '6px 14px',
  fontSize: '12px',
  fontWeight: 700,
  color: '#A78D78',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
};

// СОРТУВАННЯ (FRAME 341)
const customSortTriggerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #D7C7B1',
  borderRadius: '8px',
  color: '#DC9666',
  fontWeight: 700,
  fontSize: '13px',
  padding: '8px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
};

const sortDropdownMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '40px',
  right: 0,
  width: '190px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  boxShadow: '0px 8px 24px rgba(41, 28, 14, 0.12)',
  zIndex: 110,
  overflow: 'hidden',
};

const sortMenuItemStyle: React.CSSProperties = {
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
};

const sortRadioOuterStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '1px solid #D7C7B1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const sortRadioInnerStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#DC9666',
};

// ГОЛОВНА СІТКА
const mainGridContainerStyle: React.CSSProperties = {
  maxWidth: '1560px',
  margin: '0 auto',
  padding: '40px 60px 100px 60px',
  display: 'flex',
  gap: '32px',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
};

const sidebarFiltersStyle: React.CSSProperties = {
  width: '360px',
  flexShrink: 0,
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  boxSizing: 'border-box',
};

const filterSectionTitleStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '15px',
  fontWeight: 700,
};

const filterDividerStyle: React.CSSProperties = {
  border: 'none',
  height: '1px',
  backgroundColor: 'rgba(220, 150, 102, 0.2)',
  margin: '0',
};

const resetBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#C62828',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  padding: 0,
};

const priceBoxStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  display: 'flex',
  flexDirection: 'column',
};

const checkboxRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
};

const customCheckboxStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  borderRadius: '6px',
  border: '2px solid #A78D78',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const ratingPillStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 14px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
};

const counterBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid #D7C7B1',
  borderRadius: '8px',
  padding: '6px 8px',
  marginTop: '12px',
};

const counterBtnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  backgroundColor: '#DC9666',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '18px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const destinationBadgeStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 700,
};

const propertyCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  display: 'flex',
  overflow: 'hidden',
  minHeight: '280px',
  boxSizing: 'border-box',
};

const propertyImageStyle: React.CSSProperties = {
  width: '360px',
  height: '100%',
  minHeight: '280px',
  objectFit: 'cover',
  flexShrink: 0,
};

const cardContentStyle: React.CSSProperties = {
  flex: 1,
  padding: '24px 28px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const ratingBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  padding: '6px 10px',
  borderRadius: '8px',
};

const amenityChipStyle: React.CSSProperties = {
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  color: '#DC9666',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 700,
};

const cardBottomRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  borderTop: '1px solid rgba(220, 150, 102, 0.15)',
  paddingTop: '16px',
  marginTop: '16px',
};

const favoriteBtnStyle: React.CSSProperties = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  border: '1px solid #D7C7B1',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const detailsBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
};

const messageBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '60px 20px',
  textAlign: 'center',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
};