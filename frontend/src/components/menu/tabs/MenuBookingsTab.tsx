import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../../context/SettingsContext';
import {
  MOCK_MENU_BOOKINGS,
  CANCELLATION_REASONS,
  type MenuBookingItem,
} from '../../../data/mockData';

export const MenuBookingsTab: React.FC = () => {
  const navigate = useNavigate();
  const { formatPrice } = useSettings();

  const [subTab, setSubTab] = useState<'current' | 'history'>('current');
  const [bookings, setBookings] = useState<MenuBookingItem[]>(MOCK_MENU_BOOKINGS);
  const [currentPage, setCurrentPage] = useState(1);

  // Модальні вікна
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<MenuBookingItem | null>(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<MenuBookingItem | null>(null);
  const [chosenReason, setChosenReason] = useState<string>(CANCELLATION_REASONS[0]);

  // Фільтрація списку
  const displayedBookings = bookings.filter((b) => (subTab === 'current' ? !b.isHistory : b.isHistory));

  // Підтвердження скасування
  const handleExecuteCancel = () => {
    if (!selectedBookingForCancel) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBookingForCancel.id
          ? { ...b, status: 'Скасовано', isHistory: true }
          : b
      )
    );

    setSelectedBookingForCancel(null);
    setSelectedBookingForDetails(null);
    alert('Бронювання успішно скасовано.');
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Адресу скопійовано в буфер обміну!');
  };

  return (
    <div style={styles.container}>
      {/* Шапка розділу */}
      <header style={styles.welcomeSection}>
        <h1 style={styles.headingTitle}>
          {subTab === 'current' ? 'Бронювання' : 'Історія бронювань'}
        </h1>
        <p style={styles.subtitleText}>
          {subTab === 'current'
            ? 'Керуйте поточними та запланованими поїздками. Переглядайте статус та деталі вашого відпочинку.'
            : 'Переглядайте та керуйте своїми минулими та скасованими поїздками.'}
        </p>
      </header>

      {/* Перемикач вкладок із Figma */}
      <div style={styles.tabsRow}>
        <button
          type="button"
          onClick={() => {
            setSubTab('current');
            setCurrentPage(1);
          }}
          style={subTab === 'current' ? styles.tabActiveBtn : styles.tabOutlineBtn}
        >
          Поточні броні
        </button>

        <button
          type="button"
          onClick={() => {
            setSubTab('history');
            setCurrentPage(1);
          }}
          style={subTab === 'history' ? styles.tabActiveBtn : styles.tabOutlineBtn}
        >
          Історія бронювань
        </button>
      </div>

      {/* Список карток бронювань */}
      <div style={styles.bookingsStack}>
        {displayedBookings.map((item) => (
          <div key={item.id} style={styles.bookingCard}>
            <img src={item.thumbnail} alt={item.propertyTitle} style={styles.propertyThumbnail} />

            {/* Інфо про помешкання */}
            <div style={styles.cardInfoCol}>
              <h3 style={styles.propertyNameTitle}>{item.propertyTitle}</h3>

              <div style={styles.metaRow}>
                <MapPinIcon />
                <span style={styles.metaText}>{item.location}</span>
              </div>

              <div style={styles.metaRow}>
                <CalendarMiniIcon />
                <span style={styles.metaText}>{item.dates}</span>
              </div>
            </div>

            {/* Зв'язок */}
            <div style={styles.cardRelationsCol}>
              <span style={styles.relationLabel}>{item.relationLabel}</span>
              <strong style={styles.relationName}>{item.relationName}</strong>
            </div>

            {/* ВАРІАНТ ДЛЯ ПОТОЧНИХ БРОНЕЙ */}
            {subTab === 'current' ? (
              <>
                <div style={styles.cardStatusCol}>
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

                <div style={styles.cardPriceCol}>
                  <span style={styles.priceLabel}>Сума</span>
                  <strong style={styles.priceValue}>{formatPrice(item.totalPrice)}</strong>
                </div>

                <div style={styles.actionsCol}>
                  <button
                    type="button"
                    onClick={() => navigate('/menu?tab=messages')}
                    style={styles.btnContactHost}
                  >
                    <MessageSquareWhiteIcon />
                    <span>Написати хосту</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBookingForCancel(item)}
                    style={styles.btnCancelBooking}
                  >
                    Скасувати бронювання
                  </button>
                </div>
              </>
            ) : (
              /* ВАРІАНТ ДЛЯ ІСТОРІЇ БРОНЮВАНЬ З FIGMA */
              <div style={styles.historyPriceActionCol}>
                <span
                  style={
                    item.status === 'Завершено'
                      ? styles.statusBadgeCompleted
                      : styles.statusBadgeCancelled
                  }
                >
                  {item.status}
                </span>

                <div style={styles.historyPriceText}>{formatPrice(item.totalPrice)}</div>

                <button
                  type="button"
                  onClick={() => setSelectedBookingForDetails(item)}
                  style={styles.detailsLinkBtn}
                >
                  <span>Деталі бронювання</span>
                  <ArrowRightMiniIcon />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Пагінація з Figma (тільки для історії) */}
      {subTab === 'history' && (
        <div style={styles.paginationCard}>
          <div style={styles.paginationText}>Показано 3 із 12 бронювань</div>
          <div style={styles.pagesGroup}>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={styles.pageArrowBtn}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              style={currentPage === 1 ? styles.pageNumberActive : styles.pageNumberDefault}
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              style={currentPage === 2 ? styles.pageNumberActive : styles.pageNumberDefault}
            >
              2
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              style={currentPage === 3 ? styles.pageNumberActive : styles.pageNumberDefault}
            >
              3
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              style={styles.pageArrowBtn}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. МОДАЛКА: ДЕТАЛІ БРОНЮВАННЯ З FIGMA */}
      {/* ========================================================================= */}
      {selectedBookingForDetails && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedBookingForDetails(null)}>
          <div style={styles.detailsModalBox} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={styles.modalHeaderRow}>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetails(null)}
                style={styles.backCircleBtn}
              >
                <ArrowLeftIcon />
              </button>
              <h2 style={styles.modalHeaderTitleAlegreya}>Деталі бронювання</h2>
              <button
                type="button"
                onClick={() => alert('Посилання на бронювання скопійовано!')}
                style={styles.shareCircleBtn}
              >
                <ShareIcon />
              </button>
            </div>

            <div style={styles.lineDivider} />

            {/* Hero фото з бейджем статусу та блок назви */}
            <div style={styles.detailsHeroSection}>
              <div
                style={{
                  ...styles.detailsHeroImg,
                  backgroundImage: `url(${selectedBookingForDetails.thumbnail})`,
                }}
              >
                <div style={styles.statusBadgeGreenHero}>
                  <div style={styles.smallWhiteDot} />
                  <span>{selectedBookingForDetails.status}</span>
                </div>
              </div>

              <div style={styles.detailsTitleCol}>
                <div style={styles.propertyTypeKicker}>{selectedBookingForDetails.propertyType}</div>
                <h3 style={styles.propertyTitleAlegreya}>{selectedBookingForDetails.propertyTitle}</h3>

                {/* Картка господаря */}
                <div style={styles.hostCardBox}>
                  <img
                    src={selectedBookingForDetails.hostAvatar}
                    alt={selectedBookingForDetails.hostName}
                    style={styles.hostAvatar44}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={styles.hostNameBold}>{selectedBookingForDetails.hostName}</div>
                    <div style={styles.hostRatingSub}>
                      Супергосподар • {selectedBookingForDetails.hostRating} ({selectedBookingForDetails.hostReviewsCount} відгуків)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBookingForDetails(null);
                      navigate('/menu?tab=messages');
                    }}
                    style={styles.msgHostCircleBtn}
                    title="Написати повідомлення"
                  >
                    <MessageSquareDarkIcon />
                  </button>
                </div>

                {/* Картка адреси */}
                <div style={styles.addressCardBox}>
                  <div style={styles.addressTitle}>Адреса помешкання</div>
                  <div style={styles.addressText}>{selectedBookingForDetails.address}</div>
                  <button
                    type="button"
                    onClick={() => handleCopyAddress(selectedBookingForDetails.address)}
                    style={styles.copyAddressBtn}
                  >
                    <CopyIcon />
                    <span>Скопіювати адресу</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.lineDivider} />

            {/* Дати та гості */}
            <div style={styles.datesGuestsBox}>
              <div style={styles.checkDatesRow}>
                <div style={{ flex: 1 }}>
                  <div style={styles.checkMetaLabel}>Заїзд</div>
                  <div style={styles.checkDateBold}>{selectedBookingForDetails.checkInDate}</div>
                  <div style={styles.checkTimeMuted}>{selectedBookingForDetails.checkInTime}</div>
                </div>

                <div style={styles.verticalDivider} />

                <div style={{ flex: 1 }}>
                  <div style={styles.checkMetaLabel}>Виїзд</div>
                  <div style={styles.checkDateBold}>{selectedBookingForDetails.checkOutDate}</div>
                  <div style={styles.checkTimeMuted}>{selectedBookingForDetails.checkOutTime}</div>
                </div>
              </div>

              <div style={styles.lineDivider} />

              <div style={styles.guestsRow}>
                <UserIcon />
                <span style={styles.guestsTextBold}>
                  Проживання для {selectedBookingForDetails.guestsCount} гостей
                </span>
              </div>
            </div>

            {/* Код підтвердження */}
            <div style={styles.confirmationCodeBox}>
              <span style={styles.confirmCodeLabel}>Код підтвердження</span>
              <strong style={styles.confirmCodeValue}>{selectedBookingForDetails.confirmationCode}</strong>
            </div>

            {/* Деталі ціни */}
            <div style={styles.pricingCardBox}>
              <div style={styles.pricingHeading}>Деталі ціни</div>
              <div style={styles.priceBreakdownList}>
                <div style={styles.spaceApart}>
                  <span style={styles.breakdownItem}>
                    {formatPrice(selectedBookingForDetails.basePricePerNight)} х {selectedBookingForDetails.nightsCount} ночей
                  </span>
                  <span style={styles.breakdownItemVal}>
                    {formatPrice(selectedBookingForDetails.basePricePerNight * selectedBookingForDetails.nightsCount)}
                  </span>
                </div>
                <div style={styles.spaceApart}>
                  <span style={styles.breakdownItem}>Прибирання</span>
                  <span style={styles.breakdownItemVal}>{formatPrice(selectedBookingForDetails.cleaningFee)}</span>
                </div>
                <div style={styles.spaceApart}>
                  <span style={styles.breakdownItem}>Сервісний збір Trails UA</span>
                  <span style={styles.breakdownItemVal}>{formatPrice(selectedBookingForDetails.serviceFee)}</span>
                </div>
              </div>

              <div style={styles.lineDivider} />

              <div style={styles.spaceApart}>
                <span style={styles.totalPaidLabel}>Всього оплачено</span>
                <span style={styles.totalPaidVal}>{formatPrice(selectedBookingForDetails.totalPrice)}</span>
              </div>
            </div>

            {/* Нижні дії */}
            <div style={styles.detailsModalBottomTray}>
              <button
                type="button"
                onClick={() => {
                  setSelectedBookingForDetails(null);
                  navigate('/menu?tab=messages');
                }}
                style={styles.btnContactHostModal}
              >
                Зв&apos;язатись з господарем
              </button>

              {selectedBookingForDetails.status !== 'Скасовано' && (
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedBookingForDetails;
                    setSelectedBookingForDetails(null);
                    setSelectedBookingForCancel(target);
                  }}
                  style={styles.btnCancelModalOutline}
                >
                  Скасувати бронювання
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. МОДАЛКА: СКАСУВАННЯ БРОНЮВАННЯ З FIGMA */}
      {/* ========================================================================= */}
      {selectedBookingForCancel && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedBookingForCancel(null)}>
          <div style={styles.cancelModalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeaderRow}>
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                style={styles.backCircleBtn}
              >
                <ArrowLeftIcon />
              </button>
              <h2 style={styles.modalHeaderTitleAlegreya}>Скасувати бронювання</h2>
            </div>

            <div style={styles.cancelModalBody}>
              {/* Empathy Card */}
              <div style={styles.empathyCard}>
                <div style={styles.empathyTitle}>Нам шкода, що ви скасовуєте</div>
                <div style={styles.empathyDesc}>
                  Ми розуміємо, що плани можуть змінюватися. Давайте допоможемо вам скасувати бронювання
                  швидко та відповідно до умов господаря.
                </div>
              </div>

              {/* Property Summary */}
              <div style={styles.propertySummaryCard}>
                <img
                  src={selectedBookingForCancel.thumbnail}
                  alt=""
                  style={styles.summaryThumb80}
                />
                <div style={styles.summaryTextCol}>
                  <div style={styles.summaryTitle}>{selectedBookingForCancel.propertyTitle}</div>
                  <div style={styles.summaryLocation}>{selectedBookingForCancel.location}</div>
                  <div style={styles.summaryMetaRow}>
                    <span>{selectedBookingForCancel.dates}</span>
                    <span style={styles.smallDotSeparator}>•</span>
                    <span>{selectedBookingForCancel.guestsCount} гостей</span>
                  </div>
                </div>
              </div>

              {/* Policy Card (Червоний блок) */}
              <div style={styles.policyCardRed}>
                <div style={styles.policyHeaderRow}>
                  <AlertCircleRedIcon />
                  <span style={styles.policyHeadingText}>Правила скасування для цього житла</span>
                </div>
                <div style={styles.policyTextDesc}>
                  Безкоштовне скасування доступне до 12 жовтня, 14:00. Після цього моменту стягується
                  плата у розмірі 50% вартості першої доби проживання.
                </div>
              </div>

              {/* Вибір причини скасування (Радіо-список з Figma) */}
              <div style={styles.reasonSectionCol}>
                <div style={styles.reasonSectionTitleAlegreya}>Оберіть причину скасування</div>

                <div style={styles.reasonsListStack}>
                  {CANCELLATION_REASONS.map((reason) => {
                    const isSelected = chosenReason === reason;
                    return (
                      <div
                        key={reason}
                        onClick={() => setChosenReason(reason)}
                        style={styles.reasonRowItem}
                      >
                        <div style={isSelected ? styles.radioSelectedCircle : styles.radioUnselectedCircle} />
                        <span style={{ ...styles.reasonLabelText, fontWeight: isSelected ? 700 : 500 }}>
                          {reason}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Нижні дії підтвердження скасування */}
            <div style={styles.cancelModalBottomTray}>
              <button
                type="button"
                onClick={handleExecuteCancel}
                style={styles.btnConfirmCancelRed}
              >
                Скасувати бронювання
              </button>

              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                style={styles.btnBackOutlineBrown}
              >
                Повернутись назад
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ======================== SVG ІКОНКИ ========================

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z"
      stroke="#A78D78"
      strokeWidth="1.5"
    />
    <path
      d="M8 14.6667C10.6667 11.3333 13.3333 9.04306 13.3333 6.66667C13.3333 3.72115 10.9455 1.33333 8 1.33333C5.05448 1.33333 2.66667 3.72115 2.66667 6.66667C2.66667 9.04306 5.33333 11.3333 8 14.6667Z"
      stroke="#A78D78"
      strokeWidth="1.5"
    />
  </svg>
);

const CalendarMiniIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3.33333" width="12" height="10.6667" rx="2" stroke="#A78D78" strokeWidth="1.5" />
    <line x1="5.33333" y1="1.33333" x2="5.33333" y2="4" stroke="#A78D78" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10.6667" y1="1.33333" x2="10.6667" y2="4" stroke="#A78D78" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="6.66667" x2="14" y2="6.66667" stroke="#A78D78" strokeWidth="1.5" />
  </svg>
);

const MessageSquareWhiteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.3333 10.6667C13.3333 11.0348 13.0348 11.3333 12.6667 11.3333H4L1.33333 14V3.33333C1.33333 2.96514 1.63181 2.66667 2 2.66667H12.6667C13.0348 2.66667 13.3333 2.96514 13.3333 3.33333V10.6667Z"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MessageSquareDarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M15 12C15 12.5523 14.5523 13 14 13H4.5L1.5 16V3C1.5 2.44772 1.94772 2 2.5 2H14C14.5523 2 15 2.44772 15 3V12Z"
      stroke="#291C0E"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightMiniIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M4.5 2.5L8 6L4.5 9.5" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3.33301L3.33203 8.00021L8 12.6674M3.33203 8.00021H12.6664" stroke="#A78D78" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78D78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78D78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AlertCircleRedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
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
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  headingTitle: {
    fontSize: '32px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  subtitleText: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#A78D78',
    margin: 0,
  },
  tabsRow: {
    display: 'flex',
    gap: '30px',
  },
  tabActiveBtn: {
    width: '261px',
    padding: '12px 20px',
    backgroundColor: '#DC9666',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center',
  },
  tabOutlineBtn: {
    width: '261px',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    border: '2px solid #A78D78',
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'center',
  },
  bookingsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bookingCard: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 16px rgba(41,28,14,0.04)',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
  },
  propertyThumbnail: {
    width: '140px',
    height: '100px',
    borderRadius: '12px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  cardInfoCol: {
    flex: '1 1 240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  propertyNameTitle: {
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    color: '#6E473B',
    margin: 0,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaText: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  cardRelationsCol: {
    width: '220px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  relationLabel: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    textTransform: 'uppercase',
  },
  relationName: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  cardStatusCol: {
    width: '140px',
    display: 'flex',
    alignItems: 'center',
  },
  statusBadgeConfirmed: {
    padding: '6px 14px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '99px',
    color: '#2E7D32',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  statusBadgePending: {
    padding: '6px 14px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '99px',
    color: '#DC9666',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  cardPriceCol: {
    width: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  priceLabel: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  priceValue: {
    color: '#DC9666',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  actionsCol: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0,
  },
  btnContactHost: {
    width: '100%',
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
  btnCancelBooking: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #C62828',
    color: '#C62828',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  historyPriceActionCol: {
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    marginLeft: 'auto',
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
  historyPriceText: {
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    color: '#291C0E',
  },
  detailsLinkBtn: {
    background: 'none',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
  },
  paginationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '24px 28px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationText: {
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  pagesGroup: {
    display: 'flex',
    gap: '8px',
  },
  pageArrowBtn: {
    width: '36px',
    height: '36px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#291C0E',
  },
  pageNumberDefault: {
    width: '36px',
    height: '36px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    color: '#291C0E',
  },
  pageNumberActive: {
    width: '36px',
    height: '36px',
    backgroundColor: '#DC9666',
    borderRadius: '8px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    color: 'white',
  },

  // МОДАЛКИ СТИЛІ
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(41, 28, 14, 0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  detailsModalBox: {
    width: '100%',
    maxWidth: '963px',
    maxHeight: '90vh',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
  },
  cancelModalBox: {
    width: '100%',
    maxWidth: '1058px',
    maxHeight: '90vh',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
  },
  modalHeaderRow: {
    height: '56px',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #D7C7B1',
    flexShrink: 0,
  },
  backCircleBtn: {
    padding: '8px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #A78D78',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  shareCircleBtn: {
    padding: '8px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalHeaderTitleAlegreya: {
    color: '#291C0E',
    fontSize: '18px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    margin: 0,
  },
  lineDivider: {
    height: '1px',
    backgroundColor: '#D7C7B1',
    width: '100%',
  },
  verticalDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#D7C7B1',
  },
  detailsHeroSection: {
    display: 'flex',
    gap: '24px',
    padding: '20px',
    flexWrap: 'wrap',
  },
  detailsHeroImg: {
    width: '440px',
    height: '240px',
    borderRadius: '16px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'flex-start',
  },
  statusBadgeGreenHero: {
    padding: '6px 12px',
    backgroundColor: '#2E7D32',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'white',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  smallWhiteDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
  },
  detailsTitleCol: {
    flex: '1 1 360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  propertyTypeKicker: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  propertyTitleAlegreya: {
    color: '#291C0E',
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    margin: 0,
  },
  hostCardBox: {
    padding: '14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  hostAvatar44: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    objectFit: 'cover',
  },
  hostNameBold: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  hostRatingSub: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  msgHostCircleBtn: {
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  addressCardBox: {
    padding: '14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  addressTitle: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  addressText: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  copyAddressBtn: {
    background: 'none',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#DC9666',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    marginTop: '4px',
  },
  datesGuestsBox: {
    margin: '20px',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  checkDatesRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  checkMetaLabel: {
    color: '#6E473B',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  checkDateBold: {
    color: '#291C0E',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    marginTop: '2px',
  },
  checkTimeMuted: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  guestsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  guestsTextBold: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  confirmationCodeBox: {
    margin: '0 20px 20px 20px',
    padding: '14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmCodeLabel: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  confirmCodeValue: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  pricingCardBox: {
    margin: '0 20px 20px 20px',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pricingHeading: {
    color: '#291C0E',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  priceBreakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  breakdownItem: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  breakdownItemVal: {
    color: '#291C0E',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 500,
  },
  totalPaidLabel: {
    color: '#291C0E',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  totalPaidVal: {
    color: '#DC9666',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  spaceApart: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsModalBottomTray: {
    padding: '16px 24px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  btnContactHostModal: {
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
  btnCancelModalOutline: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #C62828',
    color: '#C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },

  // СКАСУВАННЯ МОДАЛКА
  cancelModalBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  empathyCard: {
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  empathyTitle: {
    color: '#291C0E',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  empathyDesc: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '20px',
  },
  propertySummaryCard: {
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  summaryThumb80: {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    objectFit: 'cover',
  },
  summaryTextCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryTitle: {
    color: '#291C0E',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  summaryLocation: {
    color: '#6E473B',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  summaryMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  smallDotSeparator: {
    fontSize: '14px',
  },
  policyCardRed: {
    padding: '16px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderRadius: '16px',
    border: '1px solid #C62828',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  policyHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  policyHeadingText: {
    color: '#C62828',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  policyTextDesc: {
    color: '#C62828',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '19px',
  },
  reasonSectionCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reasonSectionTitleAlegreya: {
    color: '#291C0E',
    fontSize: '15px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  reasonsListStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  reasonRowItem: {
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  radioSelectedCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '9px',
    border: '5px solid #C62828',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  radioUnselectedCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '9px',
    border: '2px solid #D7C7B1',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  reasonLabelText: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  cancelModalBottomTray: {
    padding: '16px 24px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  btnConfirmCancelRed: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#C62828',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnBackOutlineBrown: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #6E473B',
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
};