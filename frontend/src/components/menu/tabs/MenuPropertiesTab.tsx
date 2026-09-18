import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import {
  MOCK_HOST_PROPERTIES,
  MOCK_HOST_APPLICATIONS,
  MOCK_BLACKLIST_EXTENDED,
  type HostPropertyItem,
  type HostApplicationItem,
} from '../../../data/mockData';

type PropertySubTab = 'properties' | 'current' | 'history' | 'blacklist';

export const MenuPropertiesTab: React.FC = () => {
  const navigate = useNavigate();
  const { isLandlord } = useAuth();
  const { formatPrice } = useSettings();

  // Вкладки
  const [activeSubTab, setActiveSubTab] = useState<PropertySubTab>('properties');
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [selectedPropertyForCalendar, setSelectedPropertyForCalendar] = useState<HostPropertyItem | null>(null);

  // Стан даних
  const [properties, setProperties] = useState<HostPropertyItem[]>(MOCK_HOST_PROPERTIES);
  const [applications, setApplications] = useState<HostApplicationItem[]>(MOCK_HOST_APPLICATIONS);
  const [blacklist, setBlacklist] = useState(MOCK_BLACKLIST_EXTENDED);
  const [historyPage, setHistoryPage] = useState(1);

  // Модалка видалення помешкання
  const [propertyToDelete, setPropertyToDelete] = useState<HostPropertyItem | null>(null);
  const [confirmDeleteCheckbox, setConfirmDeleteCheckbox] = useState(false);

  // Модалка додавання до чорного списку
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [blQuery, setBlQuery] = useState('');
  const [blReason, setBlReason] = useState('Нехтування правилами перебування');
  const [blComment, setBlComment] = useState('');

  // Календарні стани
  const [calendarMonth, setCalendarMonth] = useState('Березень 2026');
  const [blockedDays, setBlockedDays] = useState<number[]>([15, 16]);
  const [bookedDays] = useState<number[]>([8, 9, 10]);
  const [selectedDayModal, setSelectedDayModal] = useState<number | null>(null);
  const [minNights, setMinNights] = useState<'2 ночі' | '3 ночі' | 'Без обмежень'>('2 ночі');

  // Дії з заявками
  const handleAcceptApp = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    alert('✅ Заявку на бронювання підтверджено!');
  };

  const handleRejectApp = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    alert('❌ Заявку відхилено.');
  };

  // Видалення житла
  const handleConfirmDeleteProperty = () => {
    if (!propertyToDelete || !confirmDeleteCheckbox) return;
    setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
    setPropertyToDelete(null);
    setConfirmDeleteCheckbox(false);
    alert('🗑️ Помешкання повністю видалено з бази даних TrailsUA!');
  };

  // Додавання до чорного списку
  const handleAddBlacklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blQuery.trim()) return;

    const newItem = {
      id: `bl-${Date.now()}`,
      name: blQuery.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      reason: blComment.trim() ? `${blReason}: ${blComment.trim()}` : blReason,
      date: 'Сьогодні',
    };

    setBlacklist([newItem, ...blacklist]);
    setIsBlacklistModalOpen(false);
    setBlQuery('');
    setBlComment('');
    alert('Користувача додано до чорного списку.');
  };

  const handleRemoveFromBlacklist = (id: string) => {
    setBlacklist((prev) => prev.filter((item) => item.id !== id));
    alert('Користувача розблоковано.');
  };

  // =========================================================================
  // СТАН ДЛЯ НЕ-ОРЕНДОДАВЦЯ АБО ЯКЩО НЕМАЄ ЖИТЛА (FIGMA "НІЧОГО НЕ МАЄ")
  // =========================================================================
  if (!isLandlord || properties.length === 0) {
    return (
      <div style={styles.emptyHostContainer}>
        <div style={styles.emptyHostContentCol}>
          <div style={styles.emptyHostIconCircle}>
            <HouseHeaderIcon />
          </div>

          <h2 style={styles.emptyHostTitleAlegreya}>У вас немає зареєстрованих помешкань</h2>
          <p style={styles.emptyHostSubtitle}>
            Ви можете у будь-який час змінити роль та зареєструвати своє нове помешкання, натиснувши кнопку знизу
          </p>

          <button
            type="button"
            onClick={() => navigate('/routes/create')}
            style={styles.btnBecomeHostPrimary}
          >
            Змінити роль та зареєструвати своє помешкання
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 1. ШАПКА РОЗДІЛУ З КНОПКОЮ ДОДАВАННЯ АБО ЗБЕРЕЖЕННЯ */}
      <header style={styles.headerRow}>
        <div style={styles.headerTitlesCol}>
          <h1 style={styles.headingTitleAlegreya}>Керування помешканням</h1>
          <p style={styles.subtitleText}>
            {isCalendarView
              ? `Календар зайнятості для: ${selectedPropertyForCalendar?.title || 'Котедж'}`
              : activeSubTab === 'blacklist'
              ? 'Заблоковані користувачі та обмеження'
              : 'Консоль керування вашими котеджами та замовленнями'}
          </p>
        </div>

        {isCalendarView ? (
          <button
            type="button"
            onClick={() => alert('✅ Зміни в календарі та тарифах збережено!')}
            style={styles.btnAddSolid}
          >
            Зберегти зміни
          </button>
        ) : activeSubTab === 'blacklist' ? (
          <button
            type="button"
            onClick={() => setIsBlacklistModalOpen(true)}
            style={styles.btnAddSolid}
          >
            <PlusIcon />
            <span>Додати до чорного списку</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/routes/create')}
            style={styles.btnAddSolid}
          >
            <PlusIcon />
            <span>Додати помешкання</span>
          </button>
        )}
      </header>

      {/* 2. ТАБ-БАР ІЗ 4 ВКЛАДКАМИ З FIGMA (якщо не режим календаря) */}
      {!isCalendarView && (
        <div style={styles.tabsBarContainer}>
          {[
            { id: 'properties', label: 'Мої помешкання' },
            { id: 'current', label: 'Поточні броні' },
            { id: 'history', label: 'Історія бронювань' },
            { id: 'blacklist', label: 'Чорний список' },
          ].map((t) => {
            const isActive = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveSubTab(t.id as PropertySubTab)}
                style={isActive ? styles.tabBtnActive : styles.tabBtnDefault}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* РЕЖИМ: КАЛЕНДАР ЗАЙНЯТОСТІ ТА НАЛАШТУВАННЯ ТАРИФІВ З FIGMA */}
      {/* ========================================================================= */}
      {isCalendarView ? (
        <div style={styles.calendarModeWrapper}>
          <button
            type="button"
            onClick={() => setIsCalendarView(false)}
            style={styles.backToControlLink}
          >
            <ArrowLeftIcon />
            <span>Повернутися в керування</span>
          </button>

          <div style={styles.calendarLayoutGrid}>
            {/* Ліва частина: Календар */}
            <div style={styles.calendarCard}>
              <div style={styles.monthNavigatorRow}>
                <div style={styles.monthTitleAlegreya}>{calendarMonth}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(calendarMonth === 'Березень 2026' ? 'Лютий 2026' : 'Березень 2026')}
                    style={styles.arrowNavBtn}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth(calendarMonth === 'Березень 2026' ? 'Квітень 2026' : 'Березень 2026')}
                    style={styles.arrowNavBtn}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Заголовки днів тижня */}
              <div style={styles.daysHeaderGrid}>
                {['Пн', 'Вв', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d) => (
                  <span key={d} style={styles.dayOfWeekText}>{d}</span>
                ))}
              </div>

              {/* Сітка днів місяця */}
              <div style={styles.daysCellsGrid}>
                <div style={styles.cellDayMuted}>23</div>
                <div style={styles.cellDayMuted}>24</div>

                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isBooked = bookedDays.includes(day);
                  const isBlocked = blockedDays.includes(day);

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDayModal(day)}
                      style={{
                        ...styles.dayCell,
                        backgroundColor: isBlocked
                          ? 'rgba(198, 40, 40, 0.15)'
                          : isBooked
                          ? 'rgba(220, 150, 102, 0.15)'
                          : '#FFFFFF',
                        border: isBlocked
                          ? '1px solid #C62828'
                          : isBooked
                          ? '1px solid #DC9666'
                          : '1px solid #D7C7B1',
                        color: isBlocked ? '#C62828' : isBooked ? '#DC9666' : '#6E473B',
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Легенда кольорів */}
              <div style={styles.legendBar}>
                <div style={styles.legendItem}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#FFFFFF', border: '1px solid #D7C7B1', borderRadius: '4px' }} />
                  <span>Вільні дати</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: 'rgba(220, 150, 102, 0.15)', border: '1px solid #DC9666', borderRadius: '4px' }} />
                  <span>Заброньовано</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: 'rgba(198, 40, 40, 0.15)', border: '1px solid #C62828', borderRadius: '4px' }} />
                  <span>Заблоковано</span>
                </div>
              </div>
            </div>

            {/* Права частина: Налаштування тарифів (RatesConfig) */}
            <div style={styles.ratesConfigCol}>
              <div style={styles.pricingPanel}>
                <h3 style={styles.panelHeadingAlegreya}>Встановити ціни</h3>
                <div style={styles.formFieldsGap8}>
                  <label style={styles.fieldSubLabel}>Базова вартість за ніч</label>
                  <div style={styles.fakeInputBox}>1,500 ₴</div>
                </div>
                <div style={styles.formFieldsGap8}>
                  <label style={styles.fieldSubLabel}>Вихідні (Пт - Нд)</label>
                  <div style={styles.fakeInputBox}>1,800 ₴</div>
                </div>
                <div style={styles.formFieldsGap8}>
                  <label style={styles.fieldSubLabel}>Святкові дні</label>
                  <div style={styles.fakeInputBox}>2,500 ₴</div>
                </div>
              </div>

              <div style={styles.durationPanel}>
                <h3 style={styles.panelHeadingAlegreya}>Обмеження броні</h3>
                <span style={styles.fieldSubLabel}>Мінімальна к-сть ночей для бронювання:</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {(['2 ночі', '3 ночі', 'Без обмежень'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMinNights(opt)}
                      style={minNights === opt ? styles.pillOptionActive : styles.pillOptionDefault}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* ВКЛАДКА 1: МОЇ ПОМЕШКАННЯ + ЗАЯВКИ НА БРОНЮВАННЯ */}
          {/* ========================================================================= */}
          {activeSubTab === 'properties' && (
            <div style={styles.tabContentCol}>
              {/* Сітка карток житла */}
              <div style={styles.propertiesGrid}>
                {properties.map((prop) => (
                  <div key={prop.id} style={styles.propertyCard}>
                    <div style={styles.cardImageWrapper}>
                      <img src={prop.thumbnail} alt={prop.title} style={styles.cardThumbnailImg} />
                      <div
                        style={{
                          ...styles.statusBadgeOnImg,
                          backgroundColor: prop.isActive ? '#2E7D32' : '#DC9666',
                        }}
                      >
                        {prop.isActive ? 'Активне' : 'Неактивне'}
                      </div>
                    </div>

                    <div style={styles.cardDetailsBody}>
                      <div>
                        <h3 style={styles.propCardTitle}>{prop.title}</h3>
                        <div style={styles.propLocationRow}>
                          <MapPinIcon />
                          <span>{prop.location}</span>
                        </div>
                      </div>

                      <div style={styles.priceRatingRow}>
                        <div>
                          <strong style={{ color: '#6E473B', fontSize: '18px' }}>{formatPrice(prop.pricePerNight)}</strong>
                          <span style={{ color: '#A78D78', fontSize: '14px' }}> / ніч</span>
                        </div>
                        <div style={styles.ratingBadge}>
                          <StarIcon />
                          <span>{prop.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div style={styles.lineDivider} />

                      <div style={styles.statsViewsRow}>
                        <div style={styles.statItemRow}>
                          <EyeIcon />
                          <span>{prop.viewsCount} переглядів</span>
                        </div>
                        <div style={styles.statItemRow}>
                          <CalendarIcon />
                          <span>{prop.bookingsCount} бронювань</span>
                        </div>
                      </div>

                      {/* Кнопки дій з житлом */}
                      <div style={styles.cardActionsCol}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => navigate(`/routes/${prop.id}`)}
                            style={styles.btnActionOrangeTint}
                          >
                            Редагувати
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/routes/${prop.id}`)}
                            style={styles.btnActionOutline}
                          >
                            Сторінка
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPropertyForCalendar(prop);
                              setIsCalendarView(true);
                            }}
                            style={styles.btnActionOutline}
                          >
                            Календар
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/routes/${prop.id}`)}
                            style={styles.btnActionOutline}
                          >
                            Відгуки
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPropertyToDelete(prop)}
                          style={styles.btnDeletePropertyRed}
                        >
                          Видалити помешкання
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Секція: Заявки на бронювання */}
              {applications.length > 0 && (
                <section style={styles.applicationsSection}>
                  <h2 style={styles.applicationsSectionTitleAlegreya}>Заявки на бронювання</h2>
                  <div style={styles.applicationsList}>
                    {applications.map((app) => (
                      <div key={app.id} style={styles.applicationRow}>
                        <div style={styles.guestInfoGroup}>
                          <img src={app.guestAvatar} alt="" style={styles.guestAvatarImg} />
                          <div>
                            <div style={styles.guestNameBold}>{app.guestName}</div>
                            <div style={styles.guestAppForText}>
                              Заявка на <strong style={{ color: '#DC9666' }}>{app.propertyTitle}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={styles.datesAmountActionsRow}>
                          <div style={styles.datesAmountCol}>
                            <span style={styles.datesAmountLabel}>Дати та сума</span>
                            <div style={styles.datesAmountText}>
                              {app.dates} · <strong style={{ color: '#DC9666' }}>{formatPrice(app.totalPrice)}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => handleRejectApp(app.id)}
                              style={styles.btnRejectRed}
                            >
                              Відхилити
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAcceptApp(app.id)}
                              style={styles.btnAcceptSolid}
                            >
                              Підтвердити
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ВКЛАДКА 2: ПОТОЧНІ БРОНІ (ПОСТІЛЬНІ КАРТКИ З ДІЯМИ ПРИЙНЯТИ / ВІДХИЛИТИ) */}
          {/* ========================================================================= */}
          {activeSubTab === 'current' && (
            <div style={styles.bookingsStack}>
              {[
                {
                  id: 'cb-1',
                  title: "Шале 'Карпатська Тиша'",
                  location: 'с. Пилипець, Закарпатська область',
                  dates: '12 Грудня — 18 Грудня, 2026',
                  status: 'Підтверджено',
                  price: 14200,
                  guestRelation: 'Ви',
                },
                {
                  id: 'cb-2',
                  title: "Глемпінг 'Затишний Явір'",
                  location: 'смт. Верховина, Івано-Франківська область',
                  dates: '23 Грудня — 26 Грудня, 2026',
                  status: 'Очікує',
                  price: 5800,
                  guestRelation: 'Ви',
                },
                {
                  id: 'cb-3',
                  title: "Котедж 'Nordic Forest'",
                  location: 'Яремче, Івано-Франківська область',
                  dates: '30 Грудня — 03 Січня, 2027',
                  status: 'Підтверджено',
                  price: 22000,
                  guestRelation: 'Ви',
                },
              ].map((item) => (
                <div key={item.id} style={styles.bookingRowCard}>
                  <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80"
                    alt=""
                    style={styles.bookingThumb140}
                  />

                  <div style={styles.bookingInfoCol}>
                    <h3 style={styles.bookingTitleText}>{item.title}</h3>
                    <div style={styles.bookingMetaRow}>
                      <MapPinIcon />
                      <span>{item.location}</span>
                    </div>
                    <div style={styles.bookingMetaRow}>
                      <CalendarIcon />
                      <span>{item.dates}</span>
                    </div>
                  </div>

                  <div style={{ width: '220px' }}>
                    <span style={styles.metaLabelUppercase}>Орендар</span>
                    <div style={styles.bookingRelationVal}>{item.guestRelation}</div>
                  </div>

                  <div style={{ width: '140px' }}>
                    <span
                      style={
                        item.status === 'Підтверджено'
                          ? styles.statusBadgeConfirmed
                          : styles.statusBadgePending
                      }
                    >
                      {item.status}
                    </span>
                  </div>

                  <div style={styles.bookingPriceCol}>
                    <span style={styles.metaLabelUppercase}>Сума</span>
                    <strong style={{ color: '#DC9666', fontSize: '18px' }}>{formatPrice(item.price)}</strong>
                  </div>

                  <div style={styles.bookingActionsCol}>
                    <button
                      type="button"
                      onClick={() => navigate('/menu?tab=messages')}
                      style={styles.btnContactClientSolid}
                    >
                      <MessageSquareIcon />
                      <span>Написати клієнту</span>
                    </button>

                    {item.status === 'Очікує' ? (
                      <div style={{ display: 'flex', gap: '14px', width: '100%' }}>
                        <button
                          type="button"
                          onClick={() => alert('Бронювання прийнято!')}
                          style={styles.btnAcceptSmall}
                        >
                          Прийняти
                        </button>
                        <button
                          type="button"
                          onClick={() => alert('Бронювання відхилено.')}
                          style={styles.btnDeclineSmall}
                        >
                          Відхилити
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert('Бронювання скасовано.')}
                        style={styles.btnCancelBookingOutline}
                      >
                        Скасувати бронювання
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ВКЛАДКА 3: ІСТОРІЯ БРОНЮВАНЬ З ПАГІНАЦІЄЮ З FIGMA */}
          {activeSubTab === 'history' && (
            <div style={styles.bookingsStack}>
              {[
                {
                  id: 'hb-1',
                  title: "Шале 'Карпатська Тиша'",
                  location: 'с. Пилипець, Закарпатська область',
                  dates: '12 Грудня — 18 Грудня, 2025',
                  status: 'Завершено',
                  price: 12000,
                  guestRelation: 'Ви',
                },
                {
                  id: 'hb-2',
                  title: "Глемпінг 'Затишний Явір'",
                  location: 'смт. Верховина, Івано-Франківська область',
                  dates: '23 Грудня — 26 Грудня, 2025',
                  status: 'Завершено',
                  price: 5550,
                  guestRelation: 'Ви',
                },
                {
                  id: 'hb-3',
                  title: "Котедж 'Nordic Forest'",
                  location: 'Яремче, Івано-Франківська область',
                  dates: '30 Грудня — 03 Січня, 2026',
                  status: 'Скасовано',
                  price: 25200,
                  guestRelation: 'Ви',
                },
              ].map((item) => (
                <div key={item.id} style={styles.bookingRowCard}>
                  <img
                    src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80"
                    alt=""
                    style={styles.bookingThumb140}
                  />

                  <div style={styles.bookingInfoCol}>
                    <h3 style={styles.bookingTitleText}>{item.title}</h3>
                    <div style={styles.bookingMetaRow}>
                      <MapPinIcon />
                      <span>{item.location}</span>
                    </div>
                    <div style={styles.bookingMetaRow}>
                      <CalendarIcon />
                      <span>{item.dates}</span>
                    </div>
                  </div>

                  <div style={{ width: '220px' }}>
                    <span style={styles.metaLabelUppercase}>Орендар</span>
                    <div style={styles.bookingRelationVal}>{item.guestRelation}</div>
                  </div>

                  <div style={styles.historyPriceCol}>
                    <span
                      style={
                        item.status === 'Завершено'
                          ? styles.statusBadgeCompleted
                          : styles.statusBadgeCancelled
                      }
                    >
                      {item.status}
                    </span>
                    <div style={{ color: '#291C0E', fontSize: '18px', fontWeight: 700 }}>
                      {formatPrice(item.price)}
                    </div>
                    <span
                      onClick={() => alert(`Деталі замовлення #${item.id}`)}
                      style={styles.detailsLinkText}
                    >
                      Деталі бронювання →
                    </span>
                  </div>
                </div>
              ))}

              {/* Пагінація з Figma */}
              <div style={styles.paginationBox}>
                <span style={styles.paginationInfoText}>Показано 3 із 12 бронювань</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    style={styles.pageSquareBtn}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryPage(1)}
                    style={historyPage === 1 ? styles.pageSquareActive : styles.pageSquareBtn}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryPage(2)}
                    style={historyPage === 2 ? styles.pageSquareActive : styles.pageSquareBtn}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryPage(3)}
                    style={historyPage === 3 ? styles.pageSquareActive : styles.pageSquareBtn}
                  >
                    3
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryPage((p) => Math.min(3, p + 1))}
                    style={styles.pageSquareBtn}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ВКЛАДКА 4: ЧОРНИЙ СПИСОК З FIGMA */}
          {activeSubTab === 'blacklist' && (
            <div style={styles.tabContentCol}>
              {blacklist.length === 0 ? (
                /* Стан "Порожній чорний список" з Figma */
                <div style={styles.emptyBlacklistBox}>
                  <div style={styles.emptyCheckCircle}>
                    <UserCheckIcon />
                  </div>
                  <div style={styles.emptyBlacklistTitleAlegreya}>Ваш чорний список порожній</div>
                  <div style={styles.emptyBlacklistDesc}>
                    Тут відображатимуться користувачі, яких ви вирішите заблокувати для уникнення проблем у майбутньому.
                  </div>
                </div>
              ) : (
                /* Таблиця заблокованих гостей з Figma */
                <div style={styles.blacklistTableCard}>
                  {blacklist.map((item) => (
                    <div key={item.id} style={styles.blacklistRow}>
                      <img src={item.avatar} alt={item.name} style={styles.blAvatarImg} />
                      <div style={{ width: '260px' }}>
                        <div style={styles.blUserNameText}>{item.name}</div>
                        <div style={styles.blUserSubText}>Користувач системи</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={styles.metaLabelUppercase}>Причина блокування</span>
                        <div style={styles.blReasonDescText}>{item.reason}</div>
                      </div>
                      <div style={{ width: '180px' }}>
                        <span style={styles.metaLabelUppercase}>Дата блокування</span>
                        <div style={styles.blDateText}>{item.date}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromBlacklist(item.id)}
                        style={styles.btnUnblockRedOutline}
                      >
                        Розблокувати
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Інфо-бокс із Figma */}
              <div style={styles.infoBoxBanner}>
                <AlertCircleOrangeIcon />
                <div>
                  <div style={styles.infoBoxHeading}>Що відбувається після блокування?</div>
                  <div style={styles.infoBoxBody}>
                    Заблоковані користувачі не зможуть надсилати вам запити на бронювання, залишати коментарі під вашими оголошеннями та писати вам повідомлення в чаті.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* МОДАЛКА: ВИДАЛИТИ ПОМЕШКАННЯ НАЗАВЖДИ З FIGMA */}
      {/* ========================================================================= */}
      {propertyToDelete && (
        <div style={styles.modalOverlay} onClick={() => setPropertyToDelete(null)}>
          <div style={styles.deleteModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.deleteModalHeader}>
              <AlertTriangleRedIcon />
              <h2 style={styles.deleteModalTitleAlegreya}>Увага: Дія незворотна!</h2>
            </div>

            <p style={styles.deleteModalDescText}>
              Ви збираєтеся повністю видалити помешкання &quot;{propertyToDelete.title}&quot; з бази даних TrailsUA. Це призведе до наступних наслідків:
            </p>

            <div style={styles.deleteChecklistCol}>
              <div style={styles.deleteChecklistItem}>
                <TrashRedIcon />
                <span>Вся інформація про помешкання, включаючи опис та фото, буде стерта.</span>
              </div>
              <div style={styles.deleteChecklistItem}>
                <TrashRedIcon />
                <span>Всі майбутні та поточні замовлення будуть автоматично скасовані.</span>
              </div>
              <div style={styles.deleteChecklistItem}>
                <TrashRedIcon />
                <span>Історія відгуків та оцінки користувачів будуть втрачені.</span>
              </div>
            </div>

            <label style={styles.confirmCheckLabel}>
              <input
                type="checkbox"
                checked={confirmDeleteCheckbox}
                onChange={(e) => setConfirmDeleteCheckbox(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#C62828' }}
              />
              <span style={styles.confirmCheckText}>
                Я розумію всі наслідки і підтверджую видалення помешкання.
              </span>
            </label>

            <div style={styles.lineDivider} />

            <div style={styles.deleteModalBtnsRow}>
              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                style={styles.btnCancelOutline}
              >
                Скасувати
              </button>
              <button
                type="button"
                disabled={!confirmDeleteCheckbox}
                onClick={handleConfirmDeleteProperty}
                style={{
                  ...styles.btnDeleteSolidRed,
                  opacity: confirmDeleteCheckbox ? 1 : 0.4,
                  cursor: confirmDeleteCheckbox ? 'pointer' : 'not-allowed',
                }}
              >
                Видалити назавжди
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* МОДАЛКА: ДОДАТИ ДО ЧОРНОГО СПИСКУ З FIGMA */}
      {/* ========================================================================= */}
      {isBlacklistModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsBlacklistModalOpen(false)}>
          <div style={styles.addBlacklistCard} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.addBlacklistTitleAlegreya}>Додати до чорного списку</h2>

            <form onSubmit={handleAddBlacklistSubmit} style={styles.addBlacklistForm}>
              <div style={styles.formGroupCol}>
                <label style={styles.fieldLabelUppercase}>Пошук користувача</label>
                <div style={styles.inputIconBox}>
                  <SearchIcon />
                  <input
                    type="text"
                    required
                    placeholder="Введіть email або нікнейм..."
                    value={blQuery}
                    onChange={(e) => setBlQuery(e.target.value)}
                    style={styles.pureInput}
                  />
                </div>
              </div>

              <div style={styles.formGroupCol}>
                <label style={styles.fieldLabelUppercase}>Причина блокування</label>
                <select
                  value={blReason}
                  onChange={(e) => setBlReason(e.target.value)}
                  style={styles.selectField}
                >
                  <option value="Нехтування правилами перебування">Нехтування правилами перебування</option>
                  <option value="Пошкодження майна">Пошкодження майна</option>
                  <option value="Регулярні скасування замовлень">Регулярні скасування замовлень</option>
                  <option value="Порушення тиші у нічний час">Порушення тиші у нічний час</option>
                  <option value="Спроба шахрайства">Спроба шахрайства</option>
                </select>
              </div>

              <div style={styles.formGroupCol}>
                <textarea
                  rows={4}
                  placeholder="Додайте детальний коментар про інцидент..."
                  value={blComment}
                  onChange={(e) => setBlComment(e.target.value)}
                  style={styles.textareaField}
                />
              </div>

              <button type="submit" style={styles.btnSubmitBlockPill}>
                Блокувати користувача
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* МОДАЛКИ КЛІКУ НА ДЕНЬ КАЛЕНДАРЯ З FIGMA (Заблокувати / Розблокувати / Заброньовано) */}
      {/* ========================================================================= */}
      {selectedDayModal && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDayModal(null)}>
          <div style={styles.dayClickModalCard} onClick={(e) => e.stopPropagation()}>
            {bookedDays.includes(selectedDayModal) ? (
              /* Модалка: Ці дні заброньовані */
              <>
                <div style={styles.dayModalTitleOrange}>Ці дні заброньовані</div>
                <div style={styles.dayModalGuestDesc}>Ці дні заброньовані користувачем Михайло Шевченко</div>

                <div style={styles.dayModalPriceDatesRow}>
                  <div>
                    <span style={styles.metaLabelUppercase}>Сума</span>
                    <div style={styles.dayModalOrangeText}>14,200 ₴</div>
                  </div>
                  <div>
                    <span style={styles.metaLabelUppercase}>Дати</span>
                    <div style={styles.dayModalOrangeText}>08.03.2026 - 10.03.2026</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDayModal(null);
                    navigate('/menu?tab=messages');
                  }}
                  style={styles.btnActionOrangeFull}
                >
                  <MessageSquareIcon />
                  <span>Написати клієнту</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Перехід до профілю клієнта...')}
                  style={styles.btnActionOrangeFull}
                >
                  Подивитися профіль клієнта
                </button>

                <button
                  type="button"
                  onClick={() => alert('Скаргу надіслано модераторам!')}
                  style={styles.btnReportRedFull}
                >
                  Повідомити про проблему
                </button>
              </>
            ) : blockedDays.includes(selectedDayModal) ? (
              /* Модалка: Ці дні заблоковані -> Розблокувати? */
              <>
                <div style={styles.dayModalTitleRed}>Ці дні заблоковані</div>
                <div style={styles.dayModalMutedDesc}>
                  Бажаєте розблокувати ці дні?<br />
                  Користувачі зможуть забронювати помешкання у ці дні, якщо ви розблокуєте їх
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBlockedDays(blockedDays.filter((d) => d !== selectedDayModal));
                    setSelectedDayModal(null);
                  }}
                  style={styles.btnReportRedFull}
                >
                  Розблокувати
                </button>
              </>
            ) : (
              /* Модалка: Ці дні не заброньовані -> Заблокувати? */
              <>
                <div style={styles.dayModalTitleRed}>Ці дні не заброньовані</div>
                <div style={styles.dayModalMutedDesc}>
                  Бажаєте заблокувати ці дні?<br />
                  Ніхто не зможе забронювати їх після блокування
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBlockedDays([...blockedDays, selectedDayModal]);
                    setSelectedDayModal(null);
                  }}
                  style={styles.btnReportRedFull}
                >
                  Заблокувати
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ======================== SVG ІКОНКИ ========================

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3.33v9.34M3.33 8h9.34" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC9666" stroke="#DC9666" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#291C0E" strokeWidth="2.5">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UserCheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const AlertCircleOrangeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const AlertTriangleRedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrashRedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HouseHeaderIcon = () => (
  <svg width="34" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTitlesCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  headingTitleAlegreya: {
    fontSize: '32px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    color: '#291C0E',
    margin: 0,
  },
  subtitleText: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#6E473B',
    margin: 0,
  },
  btnAddSolid: {
    padding: '14px 24px',
    backgroundColor: '#DC9666',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabsBarContainer: {
    display: 'flex',
    gap: '12px',
    padding: '4px',
    borderRadius: '10px',
    border: '1px solid #D7C7B1',
    backgroundColor: '#FFFFFF',
    overflowX: 'auto',
  },
  tabBtnDefault: {
    padding: '14px 24px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#A78D78',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabBtnActive: {
    padding: '14px 24px',
    borderRadius: '10px',
    border: '1px solid #DC9666',
    backgroundColor: '#DC9666',
    color: 'white',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabContentCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  propertiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImageWrapper: {
    height: '220px',
    position: 'relative',
  },
  cardThumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  statusBadgeOnImg: {
    position: 'absolute',
    left: '16px',
    top: '16px',
    padding: '6px 12px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  cardDetailsBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  propCardTitle: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    margin: '0 0 6px 0',
  },
  propLocationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  priceRatingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  lineDivider: {
    height: '1px',
    backgroundColor: '#D7C7B1',
    width: '100%',
  },
  statsViewsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  cardActionsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btnActionOrangeTint: {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '8px',
    border: 'none',
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnActionOutline: {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnDeletePropertyRed: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '8px',
    border: 'none',
    color: '#C62828',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },

  // ЗАЯВКИ
  applicationsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  applicationsSectionTitleAlegreya: {
    color: '#291C0E',
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    margin: 0,
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  applicationRow: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  guestInfoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  guestAvatarImg: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    objectFit: 'cover',
  },
  guestNameBold: {
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  guestAppForText: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  datesAmountActionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '48px',
    flexWrap: 'wrap',
  },
  datesAmountCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  datesAmountLabel: {
    color: '#DC9666',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  datesAmountText: {
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  btnRejectRed: {
    padding: '10px 16px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '6px',
    border: 'none',
    color: '#C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnAcceptSolid: {
    padding: '10px 16px',
    backgroundColor: '#DC9666',
    borderRadius: '6px',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },

  // ПОТОЧНІ БРОНІ ТА ІСТОРІЯ
  bookingsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bookingRowCard: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  bookingThumb140: {
    width: '140px',
    height: '100px',
    borderRadius: '12px',
    objectFit: 'cover',
  },
  bookingInfoCol: {
    flex: '1 1 240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  bookingTitleText: {
    color: '#6E473B',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    margin: 0,
  },
  bookingMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  metaLabelUppercase: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    textTransform: 'uppercase',
  },
  bookingRelationVal: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  statusBadgeConfirmed: {
    padding: '6px 12px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '99px',
    color: '#2E7D32',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  statusBadgePending: {
    padding: '6px 12px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '99px',
    color: '#DC9666',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  statusBadgeCompleted: {
    padding: '4px 10px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '6px',
    color: '#2E7D32',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  statusBadgeCancelled: {
    padding: '4px 10px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '6px',
    color: '#C62828',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  bookingPriceCol: {
    width: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  bookingActionsCol: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  btnContactClientSolid: {
    width: '200px',
    padding: '12px',
    backgroundColor: '#DC9666',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  btnAcceptSmall: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #2E7D32',
    color: '#2E7D32',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnDeclineSmall: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #C62828',
    color: '#C62828',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnCancelBookingOutline: {
    width: '200px',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #C62828',
    color: '#C62828',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  historyPriceCol: {
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
    marginLeft: 'auto',
  },
  detailsLinkText: {
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  paginationBox: {
    padding: '24px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationInfoText: {
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  pageSquareBtn: {
    width: '36px',
    height: '36px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    color: '#291C0E',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  pageSquareActive: {
    width: '36px',
    height: '36px',
    backgroundColor: '#DC9666',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },

  // ЧОРНИЙ СПИСОК
  blacklistTableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    overflow: 'hidden',
  },
  blacklistRow: {
    padding: '16px 24px',
    borderBottom: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  blAvatarImg: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    objectFit: 'cover',
  },
  blUserNameText: {
    color: '#291C0E',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  blUserSubText: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  blReasonDescText: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    marginTop: '2px',
  },
  blDateText: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    marginTop: '2px',
  },
  btnUnblockRedOutline: {
    padding: '10px 16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #C62828',
    color: '#C62828',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  emptyBlacklistBox: {
    padding: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  emptyCheckCircle: {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBlacklistTitleAlegreya: {
    color: '#6E473B',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  emptyBlacklistDesc: {
    maxWidth: '380px',
    textAlign: 'center',
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '20px',
  },
  infoBoxBanner: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E1D4C2',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  infoBoxHeading: {
    color: '#DC9666',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  infoBoxBody: {
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    marginTop: '4px',
    lineHeight: '19px',
  },

  // КАЛЕНДАР
  calendarModeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  backToControlLink: {
    background: 'none',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    color: '#291C0E',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    alignSelf: 'flex-start',
  },
  calendarLayoutGrid: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  calendarCard: {
    flex: '1 1 500px',
    padding: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  monthNavigatorRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthTitleAlegreya: {
    color: '#291C0E',
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
  },
  arrowNavBtn: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    backgroundColor: 'white',
    color: '#6E473B',
    fontSize: '16px',
    cursor: 'pointer',
  },
  daysHeaderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '16px',
  },
  dayOfWeekText: {
    textAlign: 'center',
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  daysCellsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '16px',
  },
  cellDayMuted: {
    height: '60px',
    opacity: 0.3,
    color: '#A78D78',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    height: '60px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  legendBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #F8F5F0',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  ratesConfigCol: {
    width: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flexShrink: 0,
  },
  pricingPanel: {
    padding: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  durationPanel: {
    padding: '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  panelHeadingAlegreya: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    margin: 0,
  },
  formFieldsGap8: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldSubLabel: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  fakeInputBox: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  pillOptionActive: {
    padding: '10px 14px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '6px',
    border: 'none',
    color: '#DC9666',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  pillOptionDefault: {
    padding: '10px 14px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #D7C7B1',
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    cursor: 'pointer',
  },

  // СТАН "НЕ ОРЕНДОДАВЕЦЬ"
  emptyHostContainer: {
    padding: '60px 40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  emptyHostContentCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    maxWidth: '484px',
    textAlign: 'center',
  },
  emptyHostIconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: '#DC9666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHostTitleAlegreya: {
    color: '#291C0E',
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  emptyHostSubtitle: {
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '22px',
    margin: 0,
  },
  btnBecomeHostPrimary: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#DC9666',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },

  // МОДАЛКИ
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(41, 28, 14, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  deleteModalCard: {
    width: '100%',
    maxWidth: '820px',
    padding: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #C62828',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  deleteModalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  deleteModalTitleAlegreya: {
    color: '#C62828',
    fontSize: '26px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    margin: 0,
  },
  deleteModalDescText: {
    color: '#291C0E',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '25px',
    margin: 0,
  },
  deleteChecklistCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  deleteChecklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  confirmCheckLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  confirmCheckText: {
    color: '#C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  deleteModalBtnsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  btnCancelOutline: {
    padding: '12px 24px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnDeleteSolidRed: {
    padding: '12px 24px',
    backgroundColor: '#C62828',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },

  // ДОДАТИ ДО ЧОРНОГО СПИСКУ МОДАЛКА
  addBlacklistCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  addBlacklistTitleAlegreya: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  addBlacklistForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroupCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldLabelUppercase: {
    color: '#6E473B',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  inputIconBox: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  pureInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
  },
  selectField: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    outline: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    backgroundColor: 'white',
  },
  textareaField: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    outline: 'none',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    resize: 'none',
  },
  btnSubmitBlockPill: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
  },

  // МОДАЛКИ КЛІКУ ПО ДНЯХ
  dayClickModalCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'center',
  },
  dayModalTitleOrange: {
    color: '#DC9666',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  dayModalTitleRed: {
    color: '#C62828',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  dayModalGuestDesc: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  dayModalMutedDesc: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '20px',
  },
  dayModalPriceDatesRow: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
  },
  dayModalOrangeText: {
    color: '#DC9666',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  btnActionOrangeFull: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#DC9666',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  btnReportRedFull: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#C62828',
    borderRadius: '10px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
};