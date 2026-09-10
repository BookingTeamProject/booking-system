import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import type { RouteItem, Booking } from '../../../types';

export const AccountTab: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLandlord } = useAuth();
  const { formatPrice } = useSettings();

  const [favorites, setFavorites] = useState<RouteItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myProperties, setMyProperties] = useState<RouteItem[]>([]);

  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('fav_ids') || '[]');
      setFavorites(savedFavs);

      const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      setBookings(savedBookings);

      const savedProps = JSON.parse(localStorage.getItem('custom_routes') || '[]');
      setMyProperties(savedProps);
    } catch {
      // Ігноруємо помилки парсингу локального сховища
    }
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : isLandlord
    ? 'Анастасія Приходько'
    : 'Олександр Коваленко';

  const displayGreeting = user?.firstName || (isLandlord ? 'Анастасія' : 'Олександре');
  const displayPhone = user?.phoneNumber || '+380 (67) 123-45-67';
  const displayEmail = user?.email || (isLandlord ? 'MariA_OrendA@gmail.com' : 'Oleksandr_Kov28@gmail.com');
  const displayAvatar = user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80';

  // =========================================================================
  // 1. ВАРІАНТ ДЛЯ ОРЕНДОДАВЦЯ (ХОСТА) З FIGMA
  // =========================================================================
  if (isLandlord) {
    return (
      <div style={styles.tabContainer}>
        {/* Заголовок привітання */}
        <header style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>Вітаємо, {displayGreeting}!</h1>
          <div style={styles.welcomeSubtitle}>
            Ваш особистий кабінет TrailsUA. Керуйте вашими подорожами та налаштуваннями.
          </div>
        </header>

        {/* Верхній ряд: Картка профілю хоста + Як зв'язатись зі мною */}
        <div style={styles.rowTwoCols}>
          <div style={styles.userMainCard}>
            <div style={styles.userHeaderRow}>
              <img src={displayAvatar} alt={displayName} style={styles.avatar72} />
              <div style={styles.userInfoCol}>
                <div style={styles.nameBadgeRow}>
                  <div style={styles.userNameText}>{displayName}</div>
                  <div style={styles.superhostBadge}>
                    <AwardIcon />
                    <span>Суперхост</span>
                  </div>
                </div>

                <div style={styles.starsMetaRow}>
                  <StarIcon />
                  <span style={styles.starsNumber}>4.92</span>
                  <span style={styles.reviewsCount}>(124 відгуки)</span>
                </div>

                <div style={styles.bioTextBold}>Якщо маєте питання, пишіть мені :)</div>
              </div>
            </div>

            <div style={styles.dividerLine} />

            <div style={styles.statsThreeCols}>
              <div style={styles.statCol}>
                <div style={styles.statLabel}>Оголошень</div>
                <div style={styles.statValue}>
                  {myProperties.length > 0 ? `${myProperties.length} активних об'єктів` : '6 активних об\'єктів'}
                </div>
              </div>
              <div style={styles.statCol}>
                <div style={styles.statLabel}>Член платформи</div>
                <div style={styles.statValue}>З жовтня 2020</div>
              </div>
              <div style={styles.statCol}>
                <div style={styles.statLabel}>Середня зайнятість</div>
                <div style={{ ...styles.statValue, color: '#2E7D32' }}>88% за цей місяць</div>
              </div>
            </div>
          </div>

          <div style={styles.contactCard}>
            <div style={styles.cardHeadingAlegreya}>Як зв’язатись зі мною?</div>
            <div style={styles.contactFieldsWrap}>
              <div style={styles.contactGroup}>
                <div style={styles.contactLabel}>Номер телефону</div>
                <div style={styles.contactValue}>{displayPhone}</div>
              </div>
              <div style={styles.contactGroup}>
                <div style={styles.contactLabel}>Email</div>
                <div style={styles.contactValue}>{displayEmail}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Секція: Оголошення хоста */}
        <section style={styles.propertiesSection}>
          <div style={styles.sectionHeaderTitle}>Оголошення</div>
          <div style={styles.propertiesGrid}>
            {/* Оголошення 1 */}
            <div style={styles.propertyCard}>
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
                alt=""
                style={styles.propertyImg}
              />
              <div style={styles.propertyBody}>
                <div style={styles.propertyCardTitle}>Затишний лофт біля Золотих Воріт</div>
                <div style={styles.propertyPriceRow}>
                  <div style={styles.propertyPriceText}>{formatPrice(2100)} / ніч</div>
                  <div style={styles.propertyOccText}>Зайнятість: 92%</div>
                </div>
                <div style={styles.dividerLine} />
                <div style={styles.propertyFooterRow}>
                  <div style={styles.activeBadge}>Активне</div>
                  <div style={styles.updatedText}>Оновлено вчора</div>
                </div>
              </div>
            </div>

            {/* Оголошення 2 */}
            <div style={styles.propertyCard}>
              <img
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80"
                alt=""
                style={styles.propertyImg}
              />
              <div style={styles.propertyBody}>
                <div style={styles.propertyCardTitle}>Панорамна студія з власною терасою</div>
                <div style={styles.propertyPriceRow}>
                  <div style={styles.propertyPriceText}>{formatPrice(1850)} / ніч</div>
                  <div style={styles.propertyOccText}>Зайнятість: 85%</div>
                </div>
                <div style={styles.dividerLine} />
                <div style={styles.propertyFooterRow}>
                  <div style={styles.activeBadge}>Активне</div>
                  <div style={styles.updatedText}>Оновлено 3 дні тому</div>
                </div>
              </div>
            </div>

            {/* Оголошення 3 */}
            <div style={styles.propertyCard}>
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
                alt=""
                style={styles.propertyImg}
              />
              <div style={styles.propertyBody}>
                <div style={styles.propertyCardTitle}>Карпатське шале з джакузі</div>
                <div style={styles.propertyPriceRow}>
                  <div style={styles.propertyPriceText}>{formatPrice(4500)} / ніч</div>
                  <div style={{ ...styles.propertyOccText, color: '#DC9666' }}>Зайнятість: 60%</div>
                </div>
                <div style={styles.dividerLine} />
                <div style={styles.propertyFooterRow}>
                  <div style={styles.pendingBadge}>Оновлення</div>
                  <div style={styles.updatedText}>В очікуванні фото</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Нижній ряд: Найближчі резервації + Останні відгуки гостей */}
        <div style={styles.rowTwoCols}>
          {/* Найближчі резервації */}
          <div style={styles.halfCard}>
            <div style={styles.cardTitleBar}>
              <div style={styles.cardHeaderTitle}>Найближчі резервації</div>
              <button onClick={() => navigate('/menu?tab=properties')} style={styles.seeAllLinkBtn}>
                Увесь список (8)
              </button>
            </div>

            <div style={styles.reservationsList}>
              <div style={styles.reservationItem}>
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" alt="" style={styles.guestAvatar40} />
                <div style={styles.guestInfoCol}>
                  <div style={styles.guestName}>Ірина Мельник</div>
                  <div style={styles.reservationMeta}>Лофт Золоті Ворота • 20–24 Травня</div>
                </div>
                <div style={styles.priceNightsCol}>
                  <div style={styles.guestIncomePlus}>+8 400 ₴</div>
                  <div style={styles.nightsCount}>4 ночі</div>
                </div>
              </div>

              <div style={styles.dividerLine} />

              <div style={styles.reservationItem}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="" style={styles.guestAvatar40} />
                <div style={styles.guestInfoCol}>
                  <div style={styles.guestName}>Андрій Мороз</div>
                  <div style={styles.reservationMeta}>Карпатське шале • 28 Травня–2 Червня</div>
                </div>
                <div style={styles.priceNightsCol}>
                  <div style={styles.guestIncomePlus}>+22 500 ₴</div>
                  <div style={styles.nightsCount}>5 ночей</div>
                </div>
              </div>
            </div>
          </div>

          {/* Останні відгуки гостей */}
          <div style={styles.halfCard}>
            <div style={styles.cardTitleBar}>
              <div style={styles.cardHeaderTitle}>Останні відгуки гостей</div>
              <button onClick={() => navigate('/menu?tab=properties')} style={styles.seeAllLinkBtn}>
                Подивитися усі відгуки (23)
              </button>
            </div>

            <div style={styles.reviewsList}>
              <div style={styles.reviewBlock}>
                <div style={styles.reviewHeaderRow}>
                  <div style={styles.reviewerInfo}>
                    <div style={styles.reviewerName}>Дмитро</div>
                    <div style={styles.reviewDate}>Вчора</div>
                  </div>
                  <FiveStarsRow />
                </div>
                <div style={styles.reviewText}>
                  Чудове місце! Марія була неймовірно гостинною. Квартира чиста, простора та в самому центрі.
                </div>
              </div>

              <div style={styles.dividerLine} />

              <div style={styles.reviewBlock}>
                <div style={styles.reviewHeaderRow}>
                  <div style={styles.reviewerInfo}>
                    <div style={styles.reviewerName}>Олена</div>
                    <div style={styles.reviewDate}>3 дні тому</div>
                  </div>
                  <FiveStarsRow />
                </div>
                <div style={styles.reviewText}>
                  Тераса — це щось неймовірне! Вечірній вид на старе місто запам&apos;ятається надовго. Обов&apos;язково повернемося.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ВАРІАНТ ДЛЯ ОРЕНДАРЯ (ТУРИСТА / МАНДРІВНИКА) З FIGMA
  // =========================================================================
  return (
    <div style={styles.tabContainer}>
      {/* Заголовок привітання */}
      <header style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Вітаємо, {displayGreeting}!</h1>
        <div style={styles.welcomeSubtitle}>
          Ваш особистий кабінет TrailsUA. Керуйте вашими подорожами та налаштуваннями.
        </div>
      </header>

      {/* Верхній ряд: Картка профілю орендаря + Як зв'язатись зі мною */}
      <div style={styles.rowTwoCols}>
        <div style={styles.userMainCard}>
          <div style={styles.userHeaderRow}>
            <img src={displayAvatar} alt={displayName} style={styles.avatar72} />
            <div style={styles.userInfoCol}>
              <div style={styles.nameBadgeRow}>
                <div style={styles.userNameText}>{displayName}</div>
                <div style={styles.verifiedBadge}>
                  <CheckCircleIcon />
                  <span>Верифікований</span>
                </div>
              </div>

              <div style={styles.starsMetaRow}>
                <StarIcon />
                <span style={styles.starsNumber}>4.92</span>
                <span style={styles.reviewsCount}>(124 відгуки)</span>
              </div>

              <div style={styles.bioTextBold}>Завжди на зв’язку!</div>
            </div>
          </div>

          <div style={styles.dividerLine} />

          <div style={styles.statsThreeCols}>
            <div style={styles.statCol}>
              <div style={styles.statLabel}>Загалом поїздок</div>
              <div style={styles.statValue}>
                {bookings.length > 0 ? `${bookings.length} бронювань` : '18 бронювань'}
              </div>
            </div>
            <div style={styles.statCol}>
              <div style={styles.statLabel}>Дата реєстрації</div>
              <div style={styles.statValue}>14 Березня 2022</div>
            </div>
            <div style={styles.statCol}>
              <div style={styles.statLabel}>Рейтинг</div>
              <div style={{ ...styles.statValue, color: '#2E7D32' }}>Добрий орендар</div>
            </div>
          </div>
        </div>

        <div style={styles.contactCard}>
          <div style={styles.cardHeadingAlegreya}>Як зв’язатись зі мною?</div>
          <div style={styles.contactFieldsWrap}>
            <div style={styles.contactGroup}>
              <div style={styles.contactLabel}>Номер телефону</div>
              <div style={styles.contactValue}>{displayPhone}</div>
            </div>
            <div style={styles.contactGroup}>
              <div style={styles.contactLabel}>Email</div>
              <div style={styles.contactValue}>{displayEmail}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Секція: Відгуки орендаря (на всю ширину з Figma) */}
      <div style={styles.fullWidthCard}>
        <div style={styles.cardTitleBar}>
          <div style={styles.cardHeaderTitle}>Відгуки орендаря</div>
          <button onClick={() => alert('Усі відгуки')} style={styles.seeAllLinkBtn}>
            Подивитися усі відгуки (23)
          </button>
        </div>

        <div style={styles.reviewsList}>
          <div style={styles.reviewBlock}>
            <div style={styles.reviewHeaderRow}>
              <div style={styles.reviewerInfo}>
                <div style={styles.reviewerName}>{displayName}</div>
                <div style={styles.reviewDate}>Вчора</div>
              </div>
              <FiveStarsRow />
            </div>
            <div style={styles.reviewText}>
              Чудове місце! Марія була неймовірно гостинною. Квартира чиста, простора та в самому центрі.
            </div>
          </div>

          <div style={styles.dividerLine} />

          <div style={styles.reviewBlock}>
            <div style={styles.reviewHeaderRow}>
              <div style={styles.reviewerInfo}>
                <div style={styles.reviewerName}>{displayName}</div>
                <div style={styles.reviewDate}>3 дні тому</div>
              </div>
              <FiveStarsRow />
            </div>
            <div style={styles.reviewText}>
              Тераса — це щось неймовірне! Вечірній вид на старе місто запам&apos;ятається надовго. Обов&apos;язково повернемося.
            </div>
          </div>
        </div>
      </div>

      {/* Нижній ряд: Збережені помешкання + Попередні поїздки */}
      <div style={styles.rowTwoCols}>
        {/* Збережені помешкання */}
        <div style={styles.halfCard}>
          <div style={styles.cardTitleBar}>
            <div style={styles.cardHeaderTitle}>Збережені помешкання</div>
            <button onClick={() => navigate('/favorites')} style={styles.seeAllLinkBtn}>
              Усі збережені ({favorites.length > 0 ? favorites.length : 12})
            </button>
          </div>

          <div style={styles.savedGrid}>
            <div onClick={() => navigate('/routes')} style={styles.savedItemCard}>
              <img
                src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80"
                alt="Лофт з панорамним видом"
                style={styles.savedImg120}
              />
              <div style={styles.savedCardText}>
                <div style={styles.savedPropTitle}>Лофт з панорамним видом</div>
                <div style={styles.savedPropPrice}>Львів • {formatPrice(1500)}</div>
              </div>
            </div>

            <div onClick={() => navigate('/routes')} style={styles.savedItemCard}>
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
                alt="Вілла біля Чорного моря"
                style={styles.savedImg120}
              />
              <div style={styles.savedCardText}>
                <div style={styles.savedPropTitle}>Вілла біля Чорного моря</div>
                <div style={styles.savedPropPrice}>Одеса • {formatPrice(4000)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Попередні поїздки */}
        <div style={styles.halfCard}>
          <div style={styles.cardHeaderTitle}>Попередні поїздки</div>

          <div style={styles.tripsListCol}>
            <div style={styles.tripItemRow}>
              <img
                src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=120&q=80"
                alt=""
                style={styles.tripImg48}
              />
              <div style={styles.tripTextCol}>
                <div style={styles.tripMainTitle}>Затишний арт-лофт біля Ратуші</div>
                <div style={styles.tripSubDate}>Львів • Березень 2025</div>
              </div>
              <div style={styles.tripScoreRow}>
                <StarIcon width={14} height={14} />
                <span style={styles.tripScoreNumber}>5.0</span>
              </div>
            </div>

            <div style={styles.tripItemRow}>
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=120&q=80"
                alt=""
                style={styles.tripImg48}
              />
              <div style={styles.tripTextCol}>
                <div style={styles.tripMainTitle}>Студія біля Аркадії з терасою</div>
                <div style={styles.tripSubDate}>Одеса • Серпень 2024</div>
              </div>
              <div style={styles.tripScoreRow}>
                <StarIcon width={14} height={14} />
                <span style={styles.tripScoreNumber}>4.8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================== SVG ІКОНКИ З FIGMA ========================

// 5 зірочок з Figma
const FiveStarsRow: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map((idx) => (
      <svg key={idx} width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M10 9.54L6 7.44L2 9.54L2.76 5.09L-0.47 1.94L4.04 1.29L6 -2.76L7.96 1.29L12.47 1.94L9.24 5.09L10 9.54Z"
          transform="translate(1, 1)"
          stroke="#DC9666"
          strokeWidth="1.5"
          fill="#DC9666"
        />
      </svg>
    ))}
  </div>
);

// Іконка однієї зірочки
const StarIcon: React.FC<{ width?: number; height?: number }> = ({ width = 14, height = 14 }) => (
  <svg width={width} height={height} viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1.17L8.8 4.82L12.83 5.41L9.91 8.25L10.6 12.26L7 10.37L3.4 12.26L4.09 8.25L1.17 5.41L5.2 4.82L7 1.17Z"
      stroke="#DC9666"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Іконка нагороди з Figma для суперхоста
const AwardIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="4.5" r="3" stroke="white" strokeWidth="1.6" />
    <path d="M3.5 7L2.5 11L6 9.5L9.5 11L8.5 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Іконка верифікації з Figma для орендаря
const CheckCircleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="5" stroke="#DC9666" strokeWidth="1.6" />
    <path d="M3.5 6L5.2 7.7L8.5 4.3" stroke="#DC9666" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ======================== СТИЛІ FIGMA ========================

const styles: Record<string, React.CSSProperties> = {
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  welcomeTitle: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  welcomeSubtitle: {
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  rowTwoCols: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    width: '100%',
  },
  userMainCard: {
    flex: '1 1 0',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
  },
  userHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatar72: {
    width: '72px',
    height: '72px',
    borderRadius: '36px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  userInfoCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  nameBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userNameText: {
    color: '#291C0E',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  superhostBadge: {
    padding: '4px 8px',
    backgroundColor: '#DC9666',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  verifiedBadge: {
    padding: '4px 8px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#DC9666',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  starsMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  starsNumber: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  reviewsCount: {
    color: '#6E473B',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  bioTextBold: {
    color: '#291C0E',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  dividerLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  statsThreeCols: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  statValue: {
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  contactCard: {
    width: '407px',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  cardHeadingAlegreya: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
  },
  contactFieldsWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  contactGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  contactLabel: {
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  contactValue: {
    color: '#291C0E',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  propertiesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  sectionHeaderTitle: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
  },
  propertiesGrid: {
    display: 'flex',
    gap: '30px',
    width: '100%',
  },
  propertyCard: {
    flex: '1 1 0',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  propertyImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
  },
  propertyBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  propertyCardTitle: {
    color: '#291C0E',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  propertyPriceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  propertyPriceText: {
    color: '#DC9666',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  propertyOccText: {
    color: '#2E7D32',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  propertyFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeBadge: {
    padding: '4px 8px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '6px',
    color: '#2E7D32',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  pendingBadge: {
    padding: '4px 8px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '6px',
    color: '#DC9666',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  updatedText: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  halfCard: {
    flex: '1 1 0',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
  },
  fullWidthCard: {
    width: '100%',
    padding: '24px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxSizing: 'border-box',
  },
  cardTitleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    color: '#291C0E',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
  },
  seeAllLinkBtn: {
    background: 'none',
    border: 'none',
    color: '#DC9666',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
  },
  reservationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reservationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  guestAvatar40: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    objectFit: 'cover',
  },
  guestInfoCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  guestName: {
    color: '#291C0E',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  reservationMeta: {
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  priceNightsCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  guestIncomePlus: {
    color: '#2E7D32',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  nightsCount: {
    color: '#A78D78',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  reviewHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  reviewerName: {
    color: '#291C0E',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  reviewDate: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  reviewText: {
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
    lineHeight: '22px',
  },
  savedGrid: {
    display: 'flex',
    gap: '16px',
  },
  savedItemCard: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer',
  },
  savedImg120: {
    width: '100%',
    height: '120px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  savedCardText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  savedPropTitle: {
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  savedPropPrice: {
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  tripsListCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tripItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '12px',
  },
  tripImg48: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  tripTextCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  tripMainTitle: {
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  tripSubDate: {
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 400,
  },
  tripScoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  tripScoreNumber: {
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
};