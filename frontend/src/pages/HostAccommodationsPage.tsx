import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useRoutes } from '../context/RoutesContext';
import { storage, type HostBookingRequest, type BlacklistGuest } from '../services/storage.service';
import { MOCK_HOST_REQUESTS } from '../data/mockData';
import type { RouteItem } from '../types';

// ======================== SVG ІКОНКИ ========================
const MapPinIcon = ({ color = '#DC9666', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = ({ fill = '#DC9666', size = 14 }: { fill?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const HostAccommodationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLandlord } = useAuth();
  const { formatPrice } = useSettings();
  const { deleteRoute } = useRoutes();

  // Вкладки
  const [activeSubTab, setActiveSubTab] = useState<'properties' | 'current' | 'history' | 'blacklist'>('properties');
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [selectedPropertyForCalendar, setSelectedPropertyForCalendar] = useState<RouteItem | null>(null);

  // Стан даних
  const [properties, setProperties] = useState<RouteItem[]>(() => storage.routes.getCustom());
  const [blacklist, setBlacklist] = useState<BlacklistGuest[]>(() => storage.blacklist.get());
  const [requests, setRequests] = useState<HostBookingRequest[]>(() => MOCK_HOST_REQUESTS);

  // Модалка видалення помешкання
  const [propertyToDelete, setPropertyToDelete] = useState<RouteItem | null>(null);
  const [confirmDeleteCheckbox, setConfirmDeleteCheckbox] = useState(false);

  // Модалка додавання до чорного списку
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [blQuery, setBlQuery] = useState('');
  const [blReason, setBlReason] = useState('Нехтування правилами перебування');
  const [blComment, setBlComment] = useState('');

  // Стан блокування днів календаря
  const [calendarMonth, setCalendarMonth] = useState('Березень 2026');
  const [blockedDays, setBlockedDays] = useState<number[]>([15, 16]);
  const [bookedDays] = useState<number[]>([8, 9, 10]);
  const [selectedDayModal, setSelectedDayModal] = useState<number | null>(null);

  // Дії з заявками
  const handleAcceptRequest = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r)));
    alert('✅ Заявку на бронювання підтверджено!');
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)));
    alert('❌ Заявку відхилено.');
  };

  // Видалення помешкання назавжди
  const handleExecuteDelete = async () => {
    if (!propertyToDelete || !confirmDeleteCheckbox) return;

    // 1. Викликаємо глобальне видалення з контексту!
    await deleteRoute(propertyToDelete.id);

    // 2. Оновлюємо локальний список кабінету
    setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));

    // 3. Закриваємо модалку
    setPropertyToDelete(null);
    setConfirmDeleteCheckbox(false);

    alert('🗑️ Помешкання повністю видалено з бази даних та каталогу!');
  };

  // Чорний список
  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blQuery.trim()) return;
    const updated = storage.blacklist.add({
      name: blQuery.trim(),
      email: `${blQuery.trim().toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      reason: blComment.trim() ? `${blReason}: ${blComment.trim()}` : blReason,
    });
    setBlacklist(updated);
    setIsBlacklistModalOpen(false);
    setBlQuery('');
    setBlComment('');
  };

  const handleRemoveBlacklist = (id: string) => {
    const updated = storage.blacklist.remove(id);
    setBlacklist(updated);
  };

  // Перемикач блокування дня в календарі
  const toggleBlockDay = (day: number) => {
    if (blockedDays.includes(day)) {
      setBlockedDays(blockedDays.filter((d) => d !== day));
    } else {
      setBlockedDays([...blockedDays, day]);
    }
    setSelectedDayModal(null);
  };

  if (!isLandlord) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '60px 40px', border: '1px solid #D7C7B1', textAlign: 'center' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>🏡</span>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#291C0E', margin: '0 0 12px 0', fontFamily: "'Alegreya', serif" }}>
          У вас ще немає активованого кабінету господаря
        </h2>
        <p style={{ color: '#6E473B', fontSize: '15px', maxWidth: '540px', margin: '0 auto 24px auto', lineHeight: '24px' }}>
          Зареєструйте своє перше житло на TrailsUA, щоб отримати доступ до аналітики, заявок гостей, календаря цін та чорного списку.
        </p>
        <button onClick={() => navigate('/routes/create')} style={primaryCtaBtnStyle}>
          Зареєструвати своє помешкання
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. ЗАГОЛОВОК ТА КНОПКА "ДОДАТИ ПОМЕШКАННЯ" */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={headerTitleStyle}>Керування помешканням</h1>
          <p style={headerSubtitleStyle}>
            {isCalendarView
              ? `Календар зайнятості для: ${selectedPropertyForCalendar?.title || 'Котедж'}`
              : 'Консоль керування вашими котеджами та замовленнями'}
          </p>
        </div>

        {isCalendarView ? (
          <button style={saveChangesHeaderBtnStyle} onClick={() => alert('✅ Тарифи та календар збережено!')}>
            Зберегти зміни
          </button>
        ) : (
          <button style={primaryAddBtnStyle} onClick={() => navigate('/routes/create')}>
            <span>+</span>
            <span>Додати помешкання</span>
          </button>
        )}
      </div>

      {/* 2. ТАБ-БАР ІЗ FIGMA */}
      {!isCalendarView && (
        <div style={tabsBarContainerStyle}>
          {[
            { id: 'properties', label: `Мої помешкання (${properties.length})` },
            { id: 'current', label: 'Поточні броні' },
            { id: 'history', label: 'Історія бронювань' },
            { id: 'blacklist', label: `Чорний список (${blacklist.length})` },
          ].map((t) => {
            const active = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                style={{
                  ...tabItemStyle,
                  backgroundColor: active ? '#DC9666' : 'transparent',
                  color: active ? '#FFFFFF' : '#A78D78',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ================= ВАРІАНТ 1: КАЛЕНДАР ПОМЕШКАННЯ ================= */}
      {isCalendarView ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <button
            onClick={() => setIsCalendarView(false)}
            style={backToControlLinkStyle}
          >
            ← Повернутися в керування
          </button>

          <div style={calendarViewGridStyle}>
            {/* Ліва частина: Календар */}
            <div style={calendarContainerBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#291C0E', fontFamily: "'Alegreya', serif" }}>
                  {calendarMonth}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    style={monthArrowBtnStyle}
                    onClick={() => setCalendarMonth(calendarMonth === 'Березень 2026' ? 'Лютий 2026' : 'Березень 2026')}
                  >
                    ‹
                  </button>
                  <button 
                    style={monthArrowBtnStyle}
                    onClick={() => setCalendarMonth(calendarMonth === 'Березень 2026' ? 'Квітень 2026' : 'Березень 2026')}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Заголовки днів тижня */}
              <div style={calendarDaysOfWeekGridStyle}>
                {['Пн', 'Вв', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d) => (
                  <span key={d} style={{ color: '#A78D78', fontSize: '14px', fontWeight: 700 }}>{d}</span>
                ))}
              </div>

              {/* Сітка днів березня */}
              <div style={calendarMonthDaysGridStyle}>
                {/* 2 дні з попереднього місяця */}
                <div style={dayMutedBoxStyle}>23</div>
                <div style={dayMutedBoxStyle}>24</div>

                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isBooked = bookedDays.includes(day);
                  const isBlocked = blockedDays.includes(day);

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDayModal(day)}
                      style={{
                        ...calendarDayCellStyle,
                        backgroundColor: isBlocked
                          ? 'rgba(198, 40, 40, 0.15)'
                          : isBooked
                          ? 'rgba(220, 150, 102, 0.15)'
                          : '#FFFFFF',
                        borderColor: isBlocked ? '#C62828' : isBooked ? '#DC9666' : '#D7C7B1',
                        color: isBlocked ? '#C62828' : isBooked ? '#DC9666' : '#6E473B',
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Легенда */}
              <div style={calendarLegendBarStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#FFFFFF', border: '1px solid #D7C7B1', borderRadius: '4px' }} />
                  <span style={{ fontSize: '14px', color: '#6E473B' }}>Вільні дати</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: 'rgba(220, 150, 102, 0.15)', border: '1px solid #DC9666', borderRadius: '4px' }} />
                  <span style={{ fontSize: '14px', color: '#6E473B' }}>Заброньовано</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: 'rgba(198, 40, 40, 0.15)', border: '1px solid #C62828', borderRadius: '4px' }} />
                  <span style={{ fontSize: '14px', color: '#6E473B' }}>Заблоковано</span>
                </div>
              </div>
            </div>

            {/* Права частина: Налаштування тарифів */}
            <div style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={ratesConfigBoxStyle}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: '0 0 16px 0', fontFamily: "'Alegreya', serif" }}>
                  Встановити ціни
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={fieldSubLabelStyle}>Базова вартість за ніч</label>
                    <input type="text" defaultValue="1,500 ₴" style={rateInputFieldStyle} />
                  </div>
                  <div>
                    <label style={fieldSubLabelStyle}>Вихідні (Пт - Нд)</label>
                    <input type="text" defaultValue="1,800 ₴" style={rateInputFieldStyle} />
                  </div>
                  <div>
                    <label style={fieldSubLabelStyle}>Святкові дні</label>
                    <input type="text" defaultValue="2,500 ₴" style={rateInputFieldStyle} />
                  </div>
                </div>
              </div>

              <div style={ratesConfigBoxStyle}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: '0 0 16px 0', fontFamily: "'Alegreya', serif" }}>
                  Обмеження броні
                </h3>
                <label style={fieldSubLabelStyle}>Мінімальна к-сть ночей для бронювання:</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <div style={activePillOptionStyle}>2 ночі</div>
                  <div style={inactivePillOptionStyle}>3 ночі</div>
                  <div style={inactivePillOptionStyle}>Без обмежень</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ================= ВКЛАДКА 1: МОЇ ПОМЕШКАННЯ ================= */}
          {activeSubTab === 'properties' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* Сітка карток житла */}
              <div style={propertiesGridContainerStyle}>
                {properties.map((p, idx) => (
                  <div key={p.id} style={propertyCardFigmaStyle}>
                    
                    {/* Фото та бейдж */}
                    <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={p.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          ...statusBadgePillStyle,
                          backgroundColor: idx % 2 === 0 ? '#2E7D32' : '#DC9666',
                        }}
                      >
                        {idx % 2 === 0 ? 'Активне' : 'Неактивне'}
                      </span>
                    </div>

                    {/* Тіло картки */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#291C0E', margin: '0 0 6px 0' }}>
                          {p.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPinIcon />
                          <span style={{ fontSize: '14px', color: '#A78D78' }}>{p.location}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B' }}>{formatPrice(p.price)}</span>
                          <span style={{ fontSize: '14px', color: '#A78D78' }}> / ніч</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <StarIcon />
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>{p.averageRating || 4.9}</span>
                        </div>
                      </div>

                      <hr style={cardDividerStyle} />

                      {/* Статистика переглядів та бронювань */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A78D78', fontSize: '14px' }}>
                          <EyeIcon />
                          <span>342 переглядів</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A78D78', fontSize: '14px' }}>
                          <CalendarIcon />
                          <span>12 бронювань</span>
                        </div>
                      </div>

                      {/* Дії над житлом */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <button
                            style={actionBtnBeigeStyle}
                            onClick={() => navigate(`/routes/${p.id}`)}
                          >
                            Редагувати
                          </button>
                          <button
                            style={actionBtnOutlineStyle}
                            onClick={() => navigate(`/routes/${p.id}`)}
                          >
                            Сторінка
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <button
                            style={actionBtnOutlineStyle}
                            onClick={() => {
                              setSelectedPropertyForCalendar(p);
                              setIsCalendarView(true);
                            }}
                          >
                            Календар
                          </button>
                          <button
                            style={actionBtnOutlineStyle}
                            onClick={() => navigate(`/routes/${p.id}`)}
                          >
                            Відгуки
                          </button>
                        </div>

                        <button
                          style={deletePropertyTriggerBtnStyle}
                          onClick={() => setPropertyToDelete(p)}
                        >
                          Видалити помешкання
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Блок "Заявки на бронювання" */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#291C0E', fontFamily: "'Alegreya', serif", margin: 0 }}>
                  Заявки на бронювання
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {requests.map((req) => (
                    <div key={req.id} style={bookingRequestRowStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <img
                          src={req.guestAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                          alt="guest"
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ color: '#6E473B', fontSize: '16px', fontWeight: 700 }}>{req.guestName}</div>
                          <div style={{ color: '#A78D78', fontSize: '14px' }}>
                            Заявка на <strong style={{ color: '#DC9666' }}>{req.propertyTitle}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '36px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ color: '#DC9666', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                            Дати та сума
                          </div>
                          <div style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700 }}>
                            {req.dates} · <span style={{ color: '#DC9666' }}>{formatPrice(req.totalSum)}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button style={declineRequestBtnStyle} onClick={() => handleDeclineRequest(req.id)}>
                            Відхилити
                          </button>
                          <button style={acceptRequestBtnStyle} onClick={() => handleAcceptRequest(req.id)}>
                            Підтвердити
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= ВКЛАДКА 2: ПОТОЧНІ БРОНІ ================= */}
          {activeSubTab === 'current' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { id: 'cb1', title: "Шале 'Карпатська Тиша'", location: 'с. Пилипець, Закарпатська область', dates: '12 Грудня — 18 Грудня, 2026', price: 14200, status: 'Підтверджено' },
                { id: 'cb2', title: "Глемпінг 'Затишний Явір'", location: 'смт. Верховина, Івано-Франківська область', dates: '23 Грудня — 26 Грудня, 2026', price: 5800, status: 'Очікує' },
                { id: 'cb3', title: "Котедж 'Nordic Forest'", location: 'Яремче, Івано-Франківська область', dates: '30 Грудня — 03 Січня, 2027', price: 22000, status: 'Підтверджено' },
              ].map((b) => (
                <div key={b.id} style={bookingManagementCardStyle}>
                  <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80"
                    alt=""
                    style={{ width: '140px', height: '100px', borderRadius: '12px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#6E473B', fontSize: '18px', fontWeight: 700 }}>{b.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A78D78', fontSize: '13px', marginTop: '4px' }}>
                      <MapPinIcon />
                      <span>{b.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A78D78', fontSize: '13px', marginTop: '4px' }}>
                      <CalendarIcon />
                      <span>{b.dates}</span>
                    </div>
                  </div>

                  <div style={{ width: '160px' }}>
                    <div style={{ color: '#A78D78', fontSize: '12px', textTransform: 'uppercase' }}>Орендар</div>
                    <div style={{ color: '#6E473B', fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>Михайло Ш.</div>
                  </div>

                  <div style={{ width: '140px' }}>
                    <span style={{ ...statusBadgePillStyle, position: 'static', backgroundColor: b.status === 'Підтверджено' ? '#2E7D32' : '#DC9666' }}>
                      {b.status}
                    </span>
                  </div>

                  <div style={{ width: '120px', textAlign: 'right' }}>
                    <div style={{ color: '#A78D78', fontSize: '12px' }}>Сума</div>
                    <div style={{ color: '#DC9666', fontSize: '18px', fontWeight: 700 }}>{formatPrice(b.price)}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button style={chatWithClientBtnStyle} onClick={() => navigate('/messages')}>
                      Написати клієнту
                    </button>
                    <button style={cancelBookingRowBtnStyle} onClick={() => alert('Бронювання скасовано')}>
                      Скасувати бронювання
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= ВКЛАДКА 3: ІСТОРІЯ БРОНЮВАНЬ ================= */}
          {activeSubTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { id: 'hb1', title: "Шале 'Карпатська Тиша'", location: 'с. Пилипець', dates: '12 Серпня — 18 Серпня, 2026', price: 12000, status: 'Завершено' },
                { id: 'hb2', title: "Глемпінг 'Затишний Явір'", location: 'смт. Верховина', dates: '23 Липня — 26 Липня, 2026', price: 5550, status: 'Завершено' },
                { id: 'hb3', title: "Котедж 'Nordic Forest'", location: 'Яремче', dates: '10 Червня — 14 Червня, 2026', price: 25200, status: 'Скасовано' },
              ].map((h) => (
                <div key={h.id} style={bookingManagementCardStyle}>
                  <img
                    src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80"
                    alt=""
                    style={{ width: '140px', height: '100px', borderRadius: '12px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#6E473B', fontSize: '18px', fontWeight: 700 }}>{h.title}</div>
                    <div style={{ color: '#A78D78', fontSize: '13px', marginTop: '4px' }}>{h.location}</div>
                    <div style={{ color: '#A78D78', fontSize: '13px', marginTop: '4px' }}>{h.dates}</div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ alignSelf: 'flex-end', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: h.status === 'Завершено' ? 'rgba(46, 125, 50, 0.15)' : 'rgba(198, 40, 40, 0.15)', color: h.status === 'Завершено' ? '#2E7D32' : '#C62828' }}>
                      {h.status}
                    </span>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E' }}>{formatPrice(h.price)}</div>
                    <span style={{ color: '#DC9666', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                      Деталі бронювання →
                    </span>
                  </div>
                </div>
              ))}

              {/* Пагінація з Figma */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ color: '#6E473B', fontSize: '13px' }}>Показано 3 із 12 бронювань</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={paginationSquareBtnStyle}>‹</button>
                  <button style={{ ...paginationSquareBtnStyle, backgroundColor: '#DC9666', color: 'white', borderColor: '#DC9666' }}>1</button>
                  <button style={paginationSquareBtnStyle}>2</button>
                  <button style={paginationSquareBtnStyle}>3</button>
                  <button style={paginationSquareBtnStyle}>›</button>
                </div>
              </div>
            </div>
          )}

          {/* ================= ВКЛАДКА 4: ЧОРНИЙ СПИСОК ================= */}
          {activeSubTab === 'blacklist' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6E473B', fontSize: '14px' }}>Заблоковані користувачі не мають доступу до бронювання ваших об'єктів</span>
                <button style={primaryAddBtnStyle} onClick={() => setIsBlacklistModalOpen(true)}>
                  + Додати до чорного списку
                </button>
              </div>

              {blacklist.length === 0 ? (
                /* СТАН "ПОРОЖНЬО" З FIGMA */
                <div style={emptyBlacklistContainerStyle}>
                  <div style={emptyIconCircleStyle}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <polyline points="16 11 18 13 22 9" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#6E473B', margin: 0, fontFamily: "'Alegreya', serif" }}>
                    Ваш чорний список порожній
                  </h3>
                  <p style={{ color: '#A78D78', fontSize: '14px', maxWidth: '380px', textAlign: 'center', margin: 0 }}>
                    Тут відображатимуться користувачі, яких ви вирішите заблокувати для уникнення проблем у майбутньому.
                  </p>
                </div>
              ) : (
                /* ТАБЛИЦЯ ЧОРНОГО СПИСКУ */
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #D7C7B1', overflow: 'hidden' }}>
                  {blacklist.map((item) => (
                    <div key={item.id} style={blacklistRowItemStyle}>
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ width: '240px' }}>
                        <div style={{ color: '#291C0E', fontSize: '16px', fontWeight: 700 }}>{item.name}</div>
                        <div style={{ color: '#A78D78', fontSize: '13px' }}>Користувач системи</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#A78D78', fontSize: '12px', textTransform: 'uppercase' }}>Причина блокування</div>
                        <div style={{ color: '#6E473B', fontSize: '14px', marginTop: '2px' }}>{item.reason}</div>
                      </div>
                      <div style={{ width: '160px' }}>
                        <div style={{ color: '#A78D78', fontSize: '12px', textTransform: 'uppercase' }}>Дата блокування</div>
                        <div style={{ color: '#6E473B', fontSize: '14px', marginTop: '2px' }}>{item.date || 'Нещодавно'}</div>
                      </div>
                      <button style={unblockRowBtnStyle} onClick={() => handleRemoveBlacklist(item.id)}>
                        Розблокувати
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Інфо-бокс із Figma */}
              <div style={infoNoticeBannerStyle}>
                <span style={{ fontSize: '22px' }}>ℹ️</span>
                <div>
                  <div style={{ color: '#DC9666', fontSize: '15px', fontWeight: 700 }}>Що відбувається після блокування?</div>
                  <div style={{ color: '#DC9666', fontSize: '13px', marginTop: '2px' }}>
                    Заблоковані користувачі не зможуть надсилати вам запити на бронювання, залишати коментарі під вашими оголошеннями та писати вам повідомлення в чаті.
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* ================= МОДАЛКА: ВИДАЛИТИ ПОМЕШКАННЯ НАЗАВЖДИ ================= */}
      {propertyToDelete && (
        <div style={modalBackdropStyle} onClick={() => setPropertyToDelete(null)}>
          <div style={deletePropertyModalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <AlertTriangleIcon />
              <h2 style={{ color: '#C62828', fontSize: '26px', fontFamily: "'Alegreya', serif", fontWeight: 800, margin: 0 }}>
                Увага: Дія незворотна!
              </h2>
            </div>

            <p style={{ color: '#291C0E', fontSize: '16px', lineHeight: '25px', margin: 0 }}>
              Ви збираєтеся повністю видалити помешкання <strong>«{propertyToDelete.title}»</strong> з бази даних TrailsUA. Це призведе до наступних наслідків:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrashIcon />
                <span style={{ color: '#6E473B', fontSize: '15px' }}>Вся інформація про помешкання, включаючи опис та фото, буде стерта.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrashIcon />
                <span style={{ color: '#6E473B', fontSize: '15px' }}>Всі майбутні та поточні замовлення будуть автоматично скасовані.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrashIcon />
                <span style={{ color: '#6E473B', fontSize: '15px' }}>Історія відгуків та оцінки користувачів будуть втрачені.</span>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={confirmDeleteCheckbox}
                onChange={(e) => setConfirmDeleteCheckbox(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#C62828' }}
              />
              <span style={{ color: '#C62828', fontSize: '14px', fontWeight: 700 }}>
                Я розумію всі наслідки і підтверджую видалення помешкання.
              </span>
            </label>

            <hr style={cardDividerStyle} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
              <button style={cancelModalActionBtnStyle} onClick={() => setPropertyToDelete(null)}>
                Скасувати
              </button>
              <button
                style={{
                  ...dangerConfirmDeleteBtnStyle,
                  opacity: confirmDeleteCheckbox ? 1 : 0.5,
                  cursor: confirmDeleteCheckbox ? 'pointer' : 'not-allowed',
                }}
                disabled={!confirmDeleteCheckbox}
                onClick={handleExecuteDelete}
              >
                Видалити назавжди
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= МОДАЛКА: ДОДАТИ ДО ЧОРНОГО СПИСКУ ================= */}
      {isBlacklistModalOpen && (
        <div style={modalBackdropStyle} onClick={() => setIsBlacklistModalOpen(false)}>
          <div style={blacklistAddModalCardStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#291C0E', margin: 0, fontFamily: "'Alegreya', serif" }}>
              Додати до чорного списку
            </h3>

            <form onSubmit={handleAddBlacklist} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={modalInputLabelStyle}>ПОШУК КОРИСТУВАЧА</label>
                <input
                  type="text"
                  required
                  placeholder="Введіть email або ПІБ..."
                  value={blQuery}
                  onChange={(e) => setBlQuery(e.target.value)}
                  style={modalInputFieldStyle}
                />
              </div>

              <div>
                <label style={modalInputLabelStyle}>ПРИЧИНА БЛОКУВАННЯ</label>
                <select
                  value={blReason}
                  onChange={(e) => setBlReason(e.target.value)}
                  style={modalInputFieldStyle}
                >
                  <option value="Нехтування правилами перебування">Нехтування правилами перебування</option>
                  <option value="Пошкодження майна">Пошкодження майна</option>
                  <option value="Порушення тиші у нічний час">Порушення тиші у нічний час</option>
                  <option value="Несплата додаткових послуг">Несплата додаткових послуг</option>
                </select>
              </div>

              <div>
                <label style={modalInputLabelStyle}>ДЕТАЛЬНИЙ КОМЕНТАР</label>
                <textarea
                  rows={3}
                  placeholder="Додайте коментар про інцидент..."
                  value={blComment}
                  onChange={(e) => setBlComment(e.target.value)}
                  style={modalInputFieldStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" style={cancelModalActionBtnStyle} onClick={() => setIsBlacklistModalOpen(false)}>
                  Скасувати
                </button>
                <button type="submit" style={submitBlockActionBtnStyle}>
                  Блокувати користувача
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= МОДАЛКА: ДІЇ З ДНЕМ КАЛЕНДАРЯ ================= */}
      {selectedDayModal && (
        <div style={modalBackdropStyle} onClick={() => setSelectedDayModal(null)}>
          <div style={dayActionModalStyle} onClick={(e) => e.stopPropagation()}>
            {bookedDays.includes(selectedDayModal) ? (
              <>
                <div style={{ color: '#DC9666', fontSize: '20px', fontWeight: 700, fontFamily: "'Alegreya', serif" }}>
                  Ці дні заброньовані ({selectedDayModal} березня)
                </div>
                <div style={{ color: '#6E473B', fontSize: '14px', textAlign: 'center' }}>
                  Гість: <strong>Михайло Шевченко</strong> • Сума: 14,200 ₴
                </div>
                <button style={primaryCtaBtnStyle} onClick={() => { setSelectedDayModal(null); navigate('/messages'); }}>
                  Написати клієнту
                </button>
              </>
            ) : blockedDays.includes(selectedDayModal) ? (
              <>
                <div style={{ color: '#C62828', fontSize: '20px', fontWeight: 700, fontFamily: "'Alegreya', serif" }}>
                  Цей день заблокований ({selectedDayModal} березня)
                </div>
                <div style={{ color: '#6E473B', fontSize: '14px', textAlign: 'center' }}>
                  Бажаєте відкрити цей день для бронювання?
                </div>
                <button style={primaryCtaBtnStyle} onClick={() => toggleBlockDay(selectedDayModal)}>
                  Розблокувати день
                </button>
              </>
            ) : (
              <>
                <div style={{ color: '#C62828', fontSize: '20px', fontWeight: 700, fontFamily: "'Alegreya', serif" }}>
                  Заблокувати {selectedDayModal} березня?
                </div>
                <div style={{ color: '#6E473B', fontSize: '14px', textAlign: 'center' }}>
                  Ніхто з гостей не зможе забронювати цей день після блокування.
                </div>
                <button style={dangerConfirmDeleteBtnStyle} onClick={() => toggleBlockDay(selectedDayModal)}>
                  Заблокувати день
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// ======================= СТИЛІ FIGMA =======================

const headerTitleStyle: React.CSSProperties = {
  fontSize: '32px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 800,
  color: '#291C0E',
  margin: 0,
};

const headerSubtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6E473B',
  margin: '4px 0 0 0',
};

const primaryAddBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '8px',
  border: 'none',
  fontSize: '15px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
};

const saveChangesHeaderBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '8px',
  border: 'none',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
};

const tabsBarContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  borderRadius: '10px',
  border: '1px solid #D7C7B1',
  padding: '4px',
  backgroundColor: '#FFFFFF',
  overflowX: 'auto',
};

const tabItemStyle: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
};

const propertiesGridContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
  gap: '24px',
};

const propertyCardFigmaStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(41,28,14,0.04)',
  display: 'flex',
  flexDirection: 'column',
};

const statusBadgePillStyle: React.CSSProperties = {
  position: 'absolute',
  top: '14px',
  left: '14px',
  color: 'white',
  fontSize: '12px',
  fontWeight: 700,
  padding: '4px 12px',
  borderRadius: '6px',
};

const cardDividerStyle: React.CSSProperties = {
  border: 'none',
  height: '1px',
  backgroundColor: '#D7C7B1',
  margin: 0,
};

const actionBtnBeigeStyle: React.CSSProperties = {
  padding: '10px 14px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  color: '#DC9666',
  borderRadius: '8px',
  border: 'none',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
};

const actionBtnOutlineStyle: React.CSSProperties = {
  padding: '10px 14px',
  backgroundColor: '#FFFFFF',
  color: '#A78D78',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
};

const deletePropertyTriggerBtnStyle: React.CSSProperties = {
  padding: '10px 14px',
  backgroundColor: 'rgba(198, 40, 40, 0.15)',
  color: '#C62828',
  borderRadius: '8px',
  border: 'none',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
};

const bookingRequestRowStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: '1px solid #D7C7B1',
  padding: '20px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
};

const acceptRequestBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '6px',
  border: 'none',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
};

const declineRequestBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: 'rgba(198, 40, 40, 0.15)',
  color: '#C62828',
  borderRadius: '6px',
  border: 'none',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
};

const bookingManagementCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
};

const chatWithClientBtnStyle: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: '#DC9666',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
};

const cancelBookingRowBtnStyle: React.CSSProperties = {
  padding: '8px 14px',
  backgroundColor: 'white',
  border: '1px solid #C62828',
  color: '#C62828',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};

const paginationSquareBtnStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  backgroundColor: 'white',
  border: '1px solid #D7C7B1',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#6E473B',
  cursor: 'pointer',
};

const emptyBlacklistContainerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  padding: '60px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '14px',
};

const emptyIconCircleStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '32px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const blacklistRowItemStyle: React.CSSProperties = {
  padding: '16px 24px',
  borderBottom: '1px solid #D7C7B1',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
};

const unblockRowBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #C62828',
  color: '#C62828',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
};

const infoNoticeBannerStyle: React.CSSProperties = {
  padding: '18px 24px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  borderRadius: '12px',
  border: '1px solid #DC9666',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
};

// КАЛЕНДАР СТИЛІ
const backToControlLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#291C0E',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  padding: 0,
  alignSelf: 'flex-start',
};

const calendarViewGridStyle: React.CSSProperties = {
  display: 'flex',
  gap: '30px',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
};

const calendarContainerBoxStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const monthArrowBtnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '16px',
};

const calendarDaysOfWeekGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
  paddingBottom: '8px',
  borderBottom: '1px solid #F4ECE4',
};

const calendarMonthDaysGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '10px',
};

const dayMutedBoxStyle: React.CSSProperties = {
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.3,
  color: '#A78D78',
  fontSize: '15px',
};

const calendarDayCellStyle: React.CSSProperties = {
  height: '56px',
  borderRadius: '8px',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const calendarLegendBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  paddingTop: '16px',
  borderTop: '1px solid #F4ECE4',
};

const ratesConfigBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '24px',
};

const fieldSubLabelStyle: React.CSSProperties = {
  color: '#A78D78',
  fontSize: '13px',
  display: 'block',
  marginBottom: '6px',
};

const rateInputFieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  fontSize: '15px',
  color: '#6E473B',
  boxSizing: 'border-box',
};

const activePillOptionStyle: React.CSSProperties = {
  padding: '8px 14px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  color: '#DC9666',
  borderRadius: '6px',
  fontWeight: 700,
  fontSize: '13px',
};

const inactivePillOptionStyle: React.CSSProperties = {
  padding: '8px 14px',
  border: '1px solid #D7C7B1',
  color: '#A78D78',
  borderRadius: '6px',
  fontSize: '13px',
};

// МОДАЛКИ
const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(41, 28, 14, 0.45)',
  backdropFilter: 'blur(3px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const deletePropertyModalCardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '820px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '2px solid #C62828',
  padding: '36px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const blacklistAddModalCardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '460px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const dayActionModalStyle: React.CSSProperties = {
  width: '380px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid #D7C7B1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const modalInputLabelStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  display: 'block',
  marginBottom: '6px',
};

const modalInputFieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const cancelModalActionBtnStyle: React.CSSProperties = {
  padding: '12px 20px',
  backgroundColor: 'white',
  border: '1px solid #D7C7B1',
  color: '#A78D78',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const dangerConfirmDeleteBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#C62828',
  color: 'white',
  borderRadius: '8px',
  border: 'none',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const submitBlockActionBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#DC9666',
  color: 'white',
  borderRadius: '8px',
  border: 'none',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const primaryCtaBtnStyle: React.CSSProperties = {
  padding: '14px 28px',
  backgroundColor: '#DC9666',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
};