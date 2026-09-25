import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '../context/RoutesContext';
import { useSettings } from '../context/SettingsContext';
import Line4 from '../assets/Line4.png';

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

const ChevronDownIcon = ({ isOpen }: { isOpen?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AMENITY_CATEGORIES = [
  {
    id: 'bathroom',
    title: 'Ванна кімната',
    items: ['Фен для волосся', 'Засоби гігієни (мило, гель)', 'Гаряча вода']
  },
  {
    id: 'bedroom',
    title: 'Спальня та пральня',
    items: ['Шафа для одягу', 'Постільна білизна', 'Замок на дверях спальні', 'Сушильна машина', 'Пральна машина', 'Праска та дошка']
  },
  {
    id: 'entertainment',
    title: "Розваги та зв'язок",
    items: ['Телевізор зі стрімінгом', 'Швидкісний Wi-Fi', 'Книги та журнали']
  },
  {
    id: 'kitchen',
    title: 'Кухня та їдальня',
    items: ['Кухня з усім приладдям', 'Мікрохвильова піч', 'Плита для готування', 'Холодильник', 'Посуд та столові прибори', 'Духовка', 'Тостер', 'Кавоварка еспресо']
  },
  {
    id: 'climate',
    title: 'Опалення та кондиціонування',
    items: ['Кондиціонування повітря', 'Центральне опалення']
  },
  {
    id: 'safety',
    title: 'Безпека',
    items: ['Датчик чадного газу / диму', 'Вогнегасник', 'Аптечка першої допомоги']
  },
  {
    id: 'parking',
    title: 'Парковка та інше',
    items: ['Безкоштовна парковка', 'Можна з тваринами', 'Не можна шуміти', 'Дозволено курити', 'Приватна тераса або балкон', 'Затишний камін', 'Підходить для вечірок']
  }
];

const PROPERTY_TYPES = [
  { id: '170175e1-244a-48fd-85ae-5a2b4519d9de', label: 'Квартира' },
  { id: '1fffbb6d-dfec-4ad5-bcd0-043f75ee6cea', label: 'Будинок' },
  { id: '64b12fbf-bc35-4cba-b089-715310f36525', label: 'Котедж' },
  { id: '3327f17c-70b4-4d57-b861-3c63b6160ea6', label: 'Шале' },
  { id: 'c758fd77-6be4-4a0a-996b-0d5221f86cb2', label: 'Глемпінг' },
  { id: '4f73db3a-3998-40eb-9897-7b8c0a8c68fd', label: 'Кімната' }
];

export const RoutesCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { routes, favorites, toggleFavorite, loading } = useRoutes();
  const { formatPrice, t } = useSettings();

  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(10000); 
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  
  const [openAmenityCategory, setOpenAmenityCategory] = useState<string | null>('bathroom');

  const [sortBy, setSortBy] = useState('recommended');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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
    setMaxPrice(10000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setMinRating(0);
    setSearch('');
  };

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
        selectedTypes.length === 0 || 
        selectedTypes.includes(r.categoryId || '') || 
        selectedTypes.some(selectedId => {
           const typeObj = PROPERTY_TYPES.find(pt => pt.id === selectedId);
           return typeObj && r.categoryName === typeObj.label;
        });
      
      const matchesRating = minRating === 0 || (r.averageRating || 0) >= minRating;

      let matchesAmenities = true;
      if (selectedAmenities.length > 0) {
        let routeAmenities: string[] = [];
        if (Array.isArray(r.amenities)) {
           routeAmenities = r.amenities;
        } else if (typeof r.amenities === 'string') {
            try { routeAmenities = JSON.parse(r.amenities); } 
            catch { routeAmenities = (r.amenities as any).split(',').map((a: string) => a.trim()); }
        }
        matchesAmenities = selectedAmenities.every(a => routeAmenities.includes(a));
      }

      return matchesSearch && matchesPrice && matchesType && matchesRating && matchesAmenities;
    }).sort((a, b) => {
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        return 0; 
    });
  }, [routes, search, minPrice, maxPrice, selectedTypes, minRating, selectedAmenities, sortBy]);

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif", position: 'relative', overflow: 'hidden' }}>
      
      <div style={searchBarSectionStyle}>
        <div style={searchBarContainerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
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
        </div>

        <button style={mapToggleBtnStyle}>
          <MapPinIcon color="#DC9666" size={16} />
          <span>{t('showMap')}</span>
        </button>
      </div>

      <img
        src={Line4}
        alt="Background Line"
        style={{
          position: 'absolute',
          top: '120px',
          left: '30px',
          width: '70vw',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={mainGridContainerStyle}>
        
        <aside style={sidebarFiltersStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#6E473B', margin: 0 }}>{t('filters')}</h2>
            <button onClick={handleResetFilters} style={resetBtnStyle}>
              {t('clearAll')}
            </button>
          </div>

          <hr style={filterDividerStyle} />

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
                max={15000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#DC9666', cursor: 'pointer' }}
              />
            </div>
          </div>

          <hr style={filterDividerStyle} />

          <div>
            <span style={filterSectionTitleStyle}>{t('propertyType')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {PROPERTY_TYPES.map((item) => {
                const checked = selectedTypes.includes(item.id);
                const count = routes.filter(r => r.categoryId === item.id || r.categoryName === item.label).length;
                return (
                  <label key={item.id} style={checkboxRowStyle} onClick={() => toggleType(item.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ ...customCheckboxStyle, borderColor: checked ? '#DC9666' : '#A78D78', backgroundColor: checked ? '#DC9666' : 'white' }}>
                        {checked && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                      </div>
                      <span style={{ fontSize: '14px', color: '#291C0E' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6E473B', fontWeight: 700 }}>{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <hr style={filterDividerStyle} />

          <div>
            <span style={filterSectionTitleStyle}>{t('amenities')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
              {AMENITY_CATEGORIES.map((category) => {
                const isOpen = openAmenityCategory === category.id;
                
                return (
                  <div key={category.id} style={{ border: '1px solid #E1D4C2', borderRadius: '12px', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setOpenAmenityCategory(isOpen ? null : category.id)}
                      style={{ padding: '12px 14px', backgroundColor: isOpen ? '#F4ECE4' : '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>{category.title}</span>
                      <ChevronDownIcon isOpen={isOpen} />
                    </div>
                    
                    {isOpen && (
                      <div style={{ padding: '12px 14px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {category.items.map((amenity) => {
                           const checked = selectedAmenities.includes(amenity);
                           return (
                              <label key={amenity} style={checkboxRowStyle} onClick={() => toggleAmenity(amenity)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ ...customCheckboxStyle, width: '16px', height: '16px', borderRadius: '4px', borderColor: checked ? '#DC9666' : '#BEB5A9', backgroundColor: checked ? '#DC9666' : 'white' }}>
                                    {checked && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
                                  </div>
                                  <span style={{ fontSize: '13px', color: '#291C0E' }}>{amenity}</span>
                                </div>
                              </label>
                           )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <hr style={filterDividerStyle} />

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
        </aside>

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 1 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#6E473B', margin: 0 }}>
                Знайдено {filteredRoutes.length} варіантів
              </h1>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6E473B' }}>{t('sortBy')}</span>
              
              <button
                style={customSortTriggerStyle}
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <span>{currentSortLabel}</span>
                <ChevronDownIcon isOpen={showSortDropdown} />
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

              let parsedAmenities: string[] = [];
              if (Array.isArray(route.amenities) && route.amenities.length > 0) {
                parsedAmenities = route.amenities;
              } else if (typeof route.amenities === 'string') {
                try {
                  parsedAmenities = JSON.parse(route.amenities);
                } catch {
                  parsedAmenities = (route.amenities as any).split(',').map((a: string) => a.trim()).filter((a: string) => a);
                }
              }

              const allTags = parsedAmenities.length > 0 ? parsedAmenities : ['Базові зручності', 'Wi-Fi'];
              const visibleTags = allTags.slice(0, 4);
              const extraTagsCount = allTags.length - 4;

              const realRating = route.averageRating && route.averageRating > 0 ? route.averageRating.toFixed(1) : "0.0";
              const realReviewsCount = route.reviewsCount || 0;

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
                            {realRating}
                          </span>
                          {realReviewsCount > 0 && (
                            <span style={{ fontSize: '11px', color: '#A78D78' }}>({realReviewsCount})</span>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: '14px', color: '#6E473B', lineHeight: '21px', margin: '14px 0 16px 0' }}>
                        {route.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {visibleTags.map((tag) => (
                          <span key={tag} style={amenityChipStyle}>
                            {tag}
                          </span>
                        ))}
                        {extraTagsCount > 0 && (
                          <span style={{ ...amenityChipStyle, backgroundColor: '#F4ECE4', color: '#A78D78' }}>
                            +{extraTagsCount}
                          </span>
                        )}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(route.id);
                          }}
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
  position: 'relative',
  zIndex: 10,
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

const mapToggleBtnStyle: React.CSSProperties = {
  padding: '12px 20px',
  borderRadius: '10px',
  border: '1.5px solid #DC9666',
  backgroundColor: '#FFFFFF',
  color: '#DC9666',
  fontSize: '14px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
};

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

const mainGridContainerStyle: React.CSSProperties = {
  maxWidth: '1560px',
  margin: '0 auto',
  padding: '40px 60px 100px 60px',
  display: 'flex',
  gap: '32px',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
  position: 'relative',
  zIndex: 1,
};

const sidebarFiltersStyle: React.CSSProperties = {
  width: '320px',
  flexShrink: 0,
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  boxShadow: '0 8px 24px rgba(41,28,14,0.06)',
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

const propertyCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  boxShadow: '0 8px 24px rgba(41,28,14,0.06)',
  display: 'flex',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

const propertyImageStyle: React.CSSProperties = {
  width: '300px',
  minHeight: '100%',
  alignSelf: 'stretch',
  objectFit: 'cover',
  flexShrink: 0,
};

const cardContentStyle: React.CSSProperties = {
  flex: 1,
  padding: '20px 24px',
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