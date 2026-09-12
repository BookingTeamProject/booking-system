import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BookingModal } from '../components/BookingModal';
import { useSettings } from '../context/SettingsContext';
import { useRoutes } from '../context/RoutesContext';
import type { RouteItem, Review } from '../types';
import Line5 from '../assets/Line5.png';

// Підключення реальної карти
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ======================== SVG ІКОНКИ З FIGMA ========================
const MapPinIcon = ({ color = '#DC9666', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = ({ fill = '#DC9666', size = 16 }: { fill?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78D78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#291C0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Іконки зручностей
const AmenityIcons: Record<string, React.ReactNode> = {
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  wifi: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  kitchen: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  tv: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  ),
  car: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  wash: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  paw: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E473B" strokeWidth="2">
      <circle cx="12" cy="17" r="4" />
      <circle cx="6" cy="10" r="2" />
      <circle cx="18" cy="10" r="2" />
      <circle cx="9" cy="6" r="2" />
      <circle cx="15" cy="6" r="2" />
    </svg>
  ),
};

const customMapIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="background-color: #DC9666; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0px 6px 14px rgba(0,0,0,0.15);">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
             <circle cx="12" cy="10" r="3"></circle>
           </svg>
         </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Карта з локацією
const LocationMap = ({ locationStr }: { locationStr: string }) => {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationStr)}&countrycodes=ua`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setCoords([48.449, 24.555]);
        }
      })
      .catch(() => setCoords([48.449, 24.555]));
  }, [locationStr]);

  if (!coords) return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E473B' }}>Завантаження карти...</div>;

  return (
    <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=m&hl=uk&gl=UA&x={x}&y={y}&z={z}"
        attribution='&copy; Google Maps'
      />
      <Marker position={coords} icon={customMapIcon}>
        <Popup>{locationStr}</Popup>
      </Marker>
    </MapContainer>
  );
};

export const RouteDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useSettings();
  const { favorites, toggleFavorite } = useRoutes();

  const [route, setRoute] = useState<RouteItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // СТЕЙТИ ДЛЯ КАЛЬКУЛЯТОРА
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const isFavorite = id ? favorites.includes(id) : false;

  useEffect(() => {
    fetchRouteDetails();
    fetchReviews();
  }, [id]);

  const fetchRouteDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/routes/${id}`);
      if (res.data) {
        const raw = res.data;
        const mapped: RouteItem = {
          id: raw.id,
          title: raw.title,
          description: raw.description,
          location: raw.location,
          price: raw.price || 0,
          categoryId: raw.categoryId,
          categoryName: raw.category?.name || raw.categoryName || '',
          authorName: raw.user ? `${raw.user.firstName || ''} ${raw.user.lastName || ''}`.trim() : raw.authorName || 'Невідомий господар',
          averageRating: raw.averageRating || 0,
          reviewsCount: raw.reviewsCount || 0,
          imageUrls: (() => {
            if (Array.isArray(raw.imageUrls) && raw.imageUrls.length > 0) {
              return raw.imageUrls.map((img: any) => (typeof img === 'string' ? img : img.url));
            }
            if (Array.isArray(raw.images) && raw.images.length > 0) {
              return raw.images.map((img: any) => (typeof img === 'string' ? img : img.url));
            }
            return [];
          })(),
          amenities: (() => {
            if (Array.isArray(raw.amenities)) return raw.amenities;
            if (typeof raw.amenities === 'string') {
              try {
                return JSON.parse(raw.amenities);
              } catch {
                return raw.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a); 
              }
            }
            return [];
          })(),
          createdAt: raw.createdAt || new Date().toISOString(),
        };
        setRoute(mapped);
      }
    } catch (error) {
      console.error("Помилка завантаження помешкання", error);
      setRoute(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    const localKey = `reviews_${id}`;
    const localSaved: Review[] = JSON.parse(localStorage.getItem(localKey) || '[]');

    try {
      const res = await api.get(`/review/route/${id}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        const backendReviews: Review[] = res.data.map((r: any) => ({
          id: r.id,
          routeId: r.routeId || id,
          userId: r.userId,
          userName: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() : r.userName || 'Мандрівник',
          rating: r.rating || 5,
          comment: r.text || r.comment || '',
          createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('uk-UA') : 'Нещодавно',
        }));
        setReviews([...localSaved, ...backendReviews]);
      } else {
        setReviews(localSaved);
      }
    } catch (error) {
      console.error("Помилка завантаження відгуків", error);
      setReviews(localSaved);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newReviewObj: Review = {
      id: String(Date.now()),
      routeId: id || '1',
      userId: 'me',
      userName: 'Миша',
      rating: Number(newRating),
      comment: newComment.trim(),
      createdAt: 'Щойно',
    };

    try {
      await api.post('/review', {
        routeId: id,
        rating: Number(newRating),
        text: newComment.trim(),
      });
    } catch {
      console.warn('Відгук збережено локально');
    }

    const localKey = `reviews_${id}`;
    const existing: Review[] = JSON.parse(localStorage.getItem(localKey) || '[]');
    existing.unshift(newReviewObj);
    localStorage.setItem(localKey, JSON.stringify(existing));

    setReviews([newReviewObj, ...reviews]);
    setNewComment('');
  };

  const calculatedRating = useMemo(() => {
    if (reviews.length === 0) return route?.averageRating || 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews, route]);

  // ДИНАМІЧНА МАТЕМАТИКА
  const calculatedNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [checkIn, checkOut]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#6E473B' }}>Завантаження помешкання...</div>;
  }

  if (!route) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Помешкання не знайдено</h2>
        <Link to="/routes" style={{ color: '#DC9666', fontWeight: 700 }}>
          ← Повернутися до пошуку
        </Link>
      </div>
    );
  }

  const routeImgs = route.imageUrls && route.imageUrls.length > 0 ? route.imageUrls : [];
  
  const pricePerNight = route.price || 0;
  const accommodationTotal = pricePerNight * calculatedNights;
  const cleaningFee = calculatedNights > 0 ? 300 : 0;
  const serviceFee = calculatedNights > 0 ? 150 : 0;
  const grandTotal = accommodationTotal + cleaningFee + serviceFee;

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif", position: 'relative', overflow: 'hidden' }}>
      
      <img
        src={Line5}
        alt="Background Line"
        style={{
          position: 'absolute',
          top: '200px',
          right: '0px',
          width: '110vw',
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: '1720px', margin: '0 auto', padding: '24px 40px 120px 40px', position: 'relative', zIndex: 1 }}>
        
        <div style={breadcrumbsRowStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/routes" style={breadcrumbLinkStyle}>
              ← Пошук житла
            </Link>
            <span style={{ color: '#6E473B' }}>/</span>
            <span style={{ color: '#A78D78', fontSize: '15px' }}>{route.title}</span>
          </div>

          <button
            onClick={() => id && toggleFavorite(id)}
            style={favoriteBtnTopStyle}
          >
            {isFavorite ? '❤️ В обраному' : '🤍 Зберегти в обране'}
          </button>
        </div>

        <div style={{ position: 'relative', marginTop: '20px', marginBottom: '40px' }}>
          {routeImgs.length > 0 ? (
            <div style={galleryContainerStyle}>
              <div style={mainPhotoBoxStyle}>
                <img src={routeImgs[0]} alt="Main" style={imageFillStyle} />
              </div>

              {routeImgs.length > 1 && (
                <div style={subGridPhotosStyle}>
                  {routeImgs.slice(1, 5).map((img, idx) => (
                    <div key={idx} style={subPhotoBoxStyle}>
                      <img src={img} alt={`Sub ${idx + 1}`} style={imageFillStyle} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ ...galleryContainerStyle, backgroundColor: '#E1D4C2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#6E473B', fontSize: '18px', fontWeight: 700 }}>Немає фотографій</span>
            </div>
          )}

          {routeImgs.length > 5 && (
            <button style={showAllPhotosBtnStyle}>
              <span style={{ fontSize: '15px' }}>⊞</span>
              <span>Показати всі фото ({routeImgs.length})</span>
            </button>
          )}
        </div>

        <div style={twoColumnLayoutContainerStyle}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <div>
              <h1 style={propertyTitleStyle}>{route.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPinIcon color="#DC9666" size={16} />
                  <span style={{ color: '#6E473B', fontSize: '16px' }}>{route.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StarIcon fill="#DC9666" size={16} />
                  <span style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700 }}>
                    {calculatedRating}
                  </span>
                  <span style={{ color: '#6E473B', fontSize: '14px' }}>
                    ({reviews.length} відгуків)
                  </span>
                </div>
              </div>
            </div>

            <hr style={separatorLineStyle} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Host"
                style={hostAvatarStyle}
              />
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#291C0E', fontWeight: 700 }}>
                  Господар: {route.authorName}
                </h3>
                <div style={{ color: '#6E473B', fontSize: '14px' }}>
                  На платформі з 2026 року
                </div>
              </div>
            </div>

            <hr style={separatorLineStyle} />

            <div style={figmaWhiteCardStyle}>
              <h2 style={cardHeadingStyle}>Про цю квартиру</h2>
              <div style={aboutTextStyle}>
                {route.description || 'Опис відсутній.'}
              </div>
            </div>

            <hr style={separatorLineStyle} />

            {route.amenities && route.amenities.length > 0 && (
              <>
                <div style={figmaWhiteCardStyle}>
                  <h2 style={cardHeadingStyle}>Зручності</h2>
                  <div style={amenitiesGridStyle}>
                    {route.amenities.map((amenity, idx) => {
                      let icon = AmenityIcons.lock;
                      if (amenity.toLowerCase().includes('wi-fi')) icon = AmenityIcons.wifi;
                      if (amenity.toLowerCase().includes('кухня')) icon = AmenityIcons.kitchen;
                      if (amenity.toLowerCase().includes('телевізор')) icon = AmenityIcons.tv;
                      if (amenity.toLowerCase().includes('парков')) icon = AmenityIcons.car;
                      if (amenity.toLowerCase().includes('пральна')) icon = AmenityIcons.wash;
                      if (amenity.toLowerCase().includes('тваринами')) icon = AmenityIcons.paw;

                      return (
                        <div key={idx} style={amenityPillStyle}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>
                          <span style={{ color: '#6E473B', fontSize: '15px', fontWeight: 700 }}>
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr style={separatorLineStyle} />
              </>
            )}

            <div style={figmaWhiteCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={cardHeadingStyle}>Карта</h2>
                <span style={{ color: '#A78D78', fontSize: '16px', fontWeight: 700 }}>
                  {route.location}
                </span>
              </div>
              <div style={detailsMapViewportStyle}>
                <LocationMap locationStr={route.location} />
              </div>
            </div>

            <hr style={separatorLineStyle} />

            <div style={figmaWhiteCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={cardHeadingStyle}>Відгуки</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarIcon fill="#DC9666" size={20} />
                  <span style={{ color: '#6E473B', fontSize: '18px', fontWeight: 700 }}>
                    {calculatedRating} · {reviews.length} відгуків
                  </span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} style={reviewItemCardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={reviewAvatarCircleStyle}>
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ color: '#6E473B', fontSize: '16px', fontWeight: 700 }}>
                              {rev.userName}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A78D78', fontSize: '13px' }}>
                          <span>{rev.createdAt}</span>
                        </div>
                      </div>
                      <div style={{ color: '#A78D78', fontSize: '15px', lineHeight: '24px', marginTop: '6px' }}>
                        {rev.comment}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#A78D78', fontSize: '15px' }}>Поки що немає відгуків. Будьте першими!</div>
              )}

              <div style={{ marginTop: '28px', backgroundColor: '#F8F5F0', padding: '20px', borderRadius: '16px', border: '1px solid #D7C7B1' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#291C0E' }}>Залишити відгук про житло</h4>
                <form onSubmit={handleAddReview}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#6E473B', fontWeight: 600 }}>Ваша оцінка:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #D7C7B1', outline: 'none' }}
                    >
                      <option value={5}>5 ⭐⭐⭐⭐⭐ (Відмінно)</option>
                      <option value={4}>4 ⭐⭐⭐⭐ (Добре)</option>
                      <option value={3}>3 ⭐⭐⭐ (Нормально)</option>
                      <option value={2}>2 ⭐⭐ (Погано)</option>
                      <option value={1}>1 ⭐ (Жахливо)</option>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Поділіться враженнями про помешкання..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D7C7B1', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
                  />

                  <button type="submit" style={submitReviewBtnStyle}>
                    Надіслати відгук
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div style={{ width: '407px', flexShrink: 0, position: 'sticky', top: '24px' }}>
            <div style={bookingStickyCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
                <div>
                  <span style={{ color: '#291C0E', fontSize: '28px', fontWeight: 700 }}>
                    {formatPrice(pricePerNight)}
                  </span>
                  <span style={{ color: '#A78D78', fontSize: '16px' }}> / ніч</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <StarIcon fill="#DC9666" size={16} />
                  <span style={{ color: '#6E473B', fontSize: '14px', fontWeight: 700 }}>
                    {calculatedRating}
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={inputSubLabelStyle}>ЗАЇЗД</span>
                    <div style={dateBoxStyle}>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={dateInputStyle} />
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={inputSubLabelStyle}>ВИЇЗД</span>
                    <div style={dateBoxStyle}>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={dateInputStyle} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={inputSubLabelStyle}>КІЛЬКІСТЬ ГОСТЕЙ</span>
                  <div style={guestsSelectBoxStyle}>
                    <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} style={guestsInputStyle}>
                      <option value={1}>1 гість</option>
                      <option value={2}>2 гостя</option>
                      <option value={3}>3 гостя</option>
                      <option value={4}>4+ гостей</option>
                    </select>
                  </div>
                </div>
              </div>

              {calculatedNights > 0 ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={costBreakdownRowStyle}>
                    <span style={{ color: '#A78D78' }}>{formatPrice(pricePerNight)} × {calculatedNights} ночі</span>
                    <span style={{ color: '#291C0E', fontWeight: 700 }}>{formatPrice(accommodationTotal)}</span>
                  </div>
                  <div style={costBreakdownRowStyle}>
                    <span style={{ color: '#A78D78' }}>Прибирання</span>
                    <span style={{ color: '#291C0E', fontWeight: 700 }}>{formatPrice(cleaningFee)}</span>
                  </div>
                  <div style={costBreakdownRowStyle}>
                    <span style={{ color: '#A78D78' }}>Сервісний збір платформи</span>
                    <span style={{ color: '#291C0E', fontWeight: 700 }}>{formatPrice(serviceFee)}</span>
                  </div>
                  <hr style={separatorLineStyle} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#291C0E', fontSize: '18px', fontWeight: 700 }}>Всього</span>
                    <span style={{ color: '#DC9666', fontSize: '24px', fontWeight: 700 }}>{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#A78D78', fontSize: '14px', textAlign: 'center', margin: '10px 0' }}>
                  Оберіть дати, щоб побачити точний розрахунок
                </div>
              )}

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <button
                  style={{ ...btnBookPrimaryStyle, opacity: calculatedNights > 0 ? 1 : 0.5 }}
                  onClick={() => setIsBookingOpen(true)}
                  disabled={calculatedNights === 0}
                >
                  Забронювати помешкання
                </button>
                <span style={{ color: '#A78D78', fontSize: '13px' }}>
                  {calculatedNights === 0 ? "Оберіть дати для бронювання" : "На цьому етапі кошти не списуються"}
                </span>
              </div>

              <hr style={separatorLineStyle} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                <AlertTriangleIcon />
                <button
                  onClick={() => navigate('/report-issue')}
                  style={reportIssueBtnStyle}
                >
                  Повідомити про проблему
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        routeTitle={route.title}
        pricePerNight={pricePerNight}
        location={route.location}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialGuests={guests}
      />
    </div>
  );
};

// ======================= СТИЛІ FIGMA =======================

const breadcrumbsRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 0',
  flexWrap: 'wrap',
  gap: '12px',
};

const breadcrumbLinkStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '16px',
  fontWeight: 700,
  textDecoration: 'none',
};

const favoriteBtnTopStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #D7C7B1',
  borderRadius: '12px',
  padding: '8px 16px',
  color: '#DC9666',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
};

const galleryContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  height: '560px',
  borderRadius: '24px',
  overflow: 'hidden',
};

const mainPhotoBoxStyle: React.CSSProperties = {
  flex: '1.4',
  height: '100%',
  borderRadius: '20px',
  overflow: 'hidden',
};

const subGridPhotosStyle: React.CSSProperties = {
  flex: '1',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr',
  gap: '16px',
  height: '100%',
};

const subPhotoBoxStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
};

const imageFillStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const showAllPhotosBtnStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '24px',
  right: '24px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #291C0E',
  borderRadius: '8px',
  padding: '10px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#291C0E',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
};

const twoColumnLayoutContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start',
};

const propertyTitleStyle: React.CSSProperties = {
  fontSize: '38px',
  fontWeight: 800,
  color: '#291C0E',
  margin: '0',
  fontFamily: "'Alegreya', serif, sans-serif",
};

const separatorLineStyle: React.CSSProperties = {
  border: 'none',
  height: '1px',
  backgroundColor: '#D7C7B1',
  margin: '0',
  width: '100%',
};

const hostAvatarStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #DC9666',
};

const figmaWhiteCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  padding: '28px',
  boxShadow: '0px 8px 20px -10px rgba(0, 0, 0, 0.04)',
};

const cardHeadingStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#291C0E',
  margin: '0 0 18px 0',
};

const aboutTextStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '16px',
  lineHeight: '28px',
  fontWeight: 400,
};

const amenitiesGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginBottom: '20px',
};

const amenityPillStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  backgroundColor: '#FFFFFF',
};

const showAllAmenitiesBtnStyle: React.CSSProperties = {
  padding: '12px 22px',
  backgroundColor: '#DC9666',
  borderRadius: '999px',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  boxShadow: '0px 6px 16px -8px rgba(0, 0, 0, 0.1)',
};

const detailsMapViewportStyle: React.CSSProperties = {
  height: '380px',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid #D7C7B1',
  position: 'relative',
};

const reviewItemCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '18px',
  border: '1px solid #D7C7B1',
  padding: '18px',
};

const reviewAvatarCircleStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#D7C7B1',
  color: '#6E473B',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '16px',
};

const submitReviewBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
};

const bookingStickyCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #D7C7B1',
  padding: '28px',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: '22px',
};

const inputSubLabelStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
};

const dateBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 14px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
};

const guestsSelectBoxStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  backgroundColor: '#FFFFFF',
};

const costBreakdownRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '15px',
};

const btnBookPrimaryStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '10px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0px 4px 14px rgba(220, 150, 102, 0.3)',
};

const reportIssueBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#C62828',
  fontSize: '14px',
  fontWeight: 700,
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
};

const dateInputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#6E473B',
  fontWeight: 700,
  width: '100%',
  fontFamily: 'inherit',
  fontSize: '14px',
  cursor: 'pointer'
};

const guestsInputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#6E473B',
  fontWeight: 700,
  width: '100%',
  fontFamily: 'inherit',
  fontSize: '14px',
  cursor: 'pointer'
};