import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { routesApi, categoriesApi } from '../services/api.service';
import { syncService } from '../services/sync.service';
import type { RouteItem } from '../types';
import treesBg from '../assets/trees-bg.png';
import birdsBg from '../assets/birds.png';

// ======================== SVG ІКОНКИ З FIGMA ========================

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.33 1.33V4M14.67 2.67H12M7.34 1.88a1.2 1.2 0 0 1 1.32 0l.7 3.7a1.2 1.2 0 0 0 .7.7l3.7.7a1.2 1.2 0 0 1 0 1.32l-3.7.7a1.2 1.2 0 0 0-.7.7l-.7 3.7a1.2 1.2 0 0 1-1.32 0l-.7-3.7a1.2 1.2 0 0 0-.7-.7l-3.7-.7a1.2 1.2 0 0 1 0-1.32l3.7-.7a1.2 1.2 0 0 0 .7-.7l.7-3.7ZM4 13.33a1.33 1.33 0 1 1-2.67 0 1.33 1.33 0 0 1 2.67 0Z"
      stroke="#DC9666"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14 14l-2.89-2.89M12.67 7.33A5.33 5.33 0 1 1 2 7.33a5.33 5.33 0 0 1 10.67 0Z"
      stroke="#6E473B"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M1.98 4.26a3.67 3.67 0 0 1 6.02-.38L8 4.02l-.02-.14a3.67 3.67 0 0 1 6.04.38c.67.97.77 2.29.07 3.48L8 14 1.91 7.74c-.7-1.19-.6-2.51.07-3.48Z"
      stroke="#6E473B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MessageSquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.28 12.28A1.89 1.89 0 0 0 14.67 11.33V3.33A1.33 1.33 0 0 0 13.33 2H2.67A1.33 1.33 0 0 0 1.33 3.33v10.86a.44.44 0 0 0 .81.33l1.47-1.46a1.89 1.89 0 0 1 .94-.4h8.78a1.33 1.33 0 0 0 .95-.38Z"
      stroke="#6E473B"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const PlusCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.33 8h5.34M8 5.33v5.34M14.67 8A6.67 6.67 0 1 1 1.33 8a6.67 6.67 0 0 1 13.34 0Z"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.33 1.33V4M10.67 1.33V4M2 6.67h12M3.33 2.67h9.34A1.33 1.33 0 0 1 14 4v9.33A1.33 1.33 0 0 1 12.67 14.67H3.33A1.33 1.33 0 0 1 2 13.33V4a1.33 1.33 0 0 1 1.33-1.33Z"
      stroke="#DC9666"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.67 8.67V4.67h-4M14.67 4.67L9 10.33l-3.33-3.34L1.33 11.33"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 7.5v3.33M10 14.17h.01M18.11 15 11.44 3.33a1.67 1.67 0 0 0-2.88 0L1.88 15a1.67 1.67 0 0 0 1.45 2.5h13.34A1.67 1.67 0 0 0 18.1 15Z"
      stroke="#DC9666"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 9.33V7M7 4.67h.01M12.83 7A5.83 5.83 0 1 1 1.17 7a5.83 5.83 0 0 1 11.66 0Z"
      stroke="#A78D78"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronRightIcon = ({ color = '#DC9666' }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16l-4-4-4 4M12 12v9" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const CheckIcon = ({ color = '#DC9666', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapPinIcon = ({ color = '#DC9666' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ACCOMMODATION_TYPES = [
  { id: 'apartment', label: 'Квартира', subtitle: 'Окремі апартаменти', icon: '🏢' },
  { id: 'house', label: 'Будинок', subtitle: 'Цілий будинок для гостей', icon: '🏡' },
  { id: 'cottage', label: 'Котедж', subtitle: "Дерев'яний гірський будинок", icon: '🌲' },
  { id: 'chalet', label: 'Шале', subtitle: 'Традиційне альпійське шале', icon: '🛖' },
  { id: 'glamping', label: 'Глемпінг', subtitle: 'Розкішні намети просто неба', icon: '⛺' },
  { id: 'room', label: 'Кімната', subtitle: 'Окрема кімната у житлі', icon: '🚪' },
];

const AMENITIES_BY_CATEGORY = [
  {
    category: 'Ванна кімната',
    items: ['Фен для волосся', 'Засоби гігієни (мило, гель)', 'Гаряча вода'],
  },
  {
    category: 'Спальня та пральня',
    items: ['Шафа для одягу', 'Постільна білизна', 'Замок на дверях спальні', 'Сушильна машина', 'Пральна машина', 'Праска та дошка'],
  },
  {
    category: "Розваги та зв'язок",
    items: ['Телевізор зі стрімінгом', 'Швидкісний Wi-Fi', 'Книги та журнали'],
  },
  {
    category: 'Кухня та їдальня',
    items: ['Кухня з усім приладдям', 'Мікрохвильова піч', 'Плита для готування', 'Холодильник', 'Посуд та столові прибори', 'Духовка', 'Тостер', 'Кавоварка еспресо'],
  },
  {
    category: 'Опалення та кондиціонування',
    items: ['Кондиціонування повітря', 'Центральне опалення'],
  },
  {
    category: 'Безпека',
    items: ['Датчик чадного газу / диму', 'Вогнегасник', 'Аптечка першої допомоги'],
  },
  {
    category: 'Парковка та інше',
    items: ['Безкоштовна парковка', 'Можна з тваринами', 'Не можна шуміти', 'Дозволено курити', 'Приватна тераса або балкон', 'Затишний камін', 'Підходить для вечірок'],
  },
];

export const RouteCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLandlord, switchRole } = useAuth();
  const { formatPrice } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Стан зміни ролі
  const [roleCheckbox, setRoleCheckbox] = useState(false);
  const [roleError, setRoleError] = useState('');

  const [formData, setFormData] = useState({
    type: 'apartment',
    categoryId: '',
    title: '',
    description: '',
    location: '',
    address: '',
    rentalFormat: 'daily' as 'daily' | 'monthly' | 'longterm',
    maxGuests: 1,
    bedroomsCount: 1,
    bathroomsCount: 1,
    amenities: [] as string[],
    mealPlan: 'none' as 'none' | 'breakfast' | 'half' | 'full',
    pricePerNight: 1500,
    minDays: 1,
    cancellationPolicy: 'flexible' as 'flexible' | 'moderate' | 'strict',
    cleaningFee: 0,
    depositFee: 0,
    imageUrls: [] as string[],
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch {
        console.warn('Використано стандартні категорії');
      }
    };
    loadCategories();
  }, []);

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, e.target!.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idxToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idxToRemove),
    }));
  };

  const toggleAmenity = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter((a) => a !== name)
        : [...prev.amenities, name],
    }));
  };

  const handleConfirmRoleChange = async () => {
    if (!roleCheckbox) {
      setRoleError('Будь ласка, поставте галочку про згоду зі зміною умов');
      return;
    }

    setLoading(true);
    setRoleError('');
    try {
      await switchRole('Landlord');
    } catch {
      // Фолбек
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!termsAccepted) {
      alert('Будь ласка, підтвердіть згоду з правилами публікації оголошень.');
      return;
    }

    if (!formData.title.trim()) {
      alert('Будь ласка, вкажіть назву помешкання.');
      setStep(2);
      return;
    }

    if (!formData.location.trim()) {
      alert('Будь ласка, вкажіть населений пункт та область.');
      setStep(1);
      return;
    }

    if (formData.imageUrls.length === 0) {
      alert('⚠️ Будь ласка, додайте щонайменше одну фотографію помешкання.');
      setStep(4);
      return;
    }

    setLoading(true);

    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let targetCategoryId = formData.categoryId;
    const selectedTypeObj = ACCOMMODATION_TYPES.find((t) => t.id === formData.type);

    try {
      const categoriesFromDb = await categoriesApi.getAll();
      if (Array.isArray(categoriesFromDb) && categoriesFromDb.length > 0) {
        const matched = categoriesFromDb.find(
          (c) => c.name.toLowerCase() === selectedTypeObj?.label.toLowerCase()
        );
        targetCategoryId = matched ? matched.id : categoriesFromDb[0].id;
      }
    } catch (e) {
      console.warn('Не вдалося отримати категорії з API:', e);
    }

    if (!guidRegex.test(targetCategoryId)) {
      alert('⚠️ Не вдалося зв’язатися з категоріями в базі даних. Переконайтеся, що бекенд запущено.');
      setLoading(false);
      return;
    }

    const cleanImageUrls = formData.imageUrls.filter((url) => !url.startsWith('data:'));
    const finalImages = cleanImageUrls.length > 0 ? cleanImageUrls : [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    ];

    try {
      const serverResponse = await routesApi.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        price: Number(formData.pricePerNight),
        categoryId: targetCategoryId,
        imageUrls: finalImages,
        amenities: formData.amenities,
      });

      console.log('✅ Успішно збережено в базі даних:', serverResponse);
      syncService.invalidate('routes_');

      const newRouteItem: RouteItem = {
        id: String(serverResponse?.id || Date.now()),
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        price: Number(formData.pricePerNight),
        categoryId: targetCategoryId,
        categoryName: selectedTypeObj?.label || 'Шале',
        authorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Господар' : 'Господар',
        averageRating: 5.0,
        imageUrls: finalImages,
        amenities: formData.amenities,
        createdAt: new Date().toISOString(),
      };

      const local: RouteItem[] = JSON.parse(localStorage.getItem('custom_routes') || '[]');
      local.unshift(newRouteItem);
      localStorage.setItem('custom_routes', JSON.stringify(local));

      alert('🎉 Помешкання успішно зареєстровано та збережено в базі даних!');
      navigate('/host/properties');
    } catch (err: any) {
      console.error('❌ Помилка сервера при публікації:', err);

      const status = err.response?.status;
      const errorData = err.response?.data;

      if (status === 403) {
        alert('⛔ Помилка 403: Ваш акаунт не має ролі "Landlord". Натисніть кнопку зміни ролі на першому кроці.');
      } else if (status === 401) {
        alert('🔒 Помилка 401: Сесія закінчилася. Будь ласка, увійдіть знову.');
        navigate('/login');
      } else if (status === 400) {
        if (errorData?.errors) {
          const firstErrorKey = Object.keys(errorData.errors)[0];
          const firstErrorMsg = errorData.errors[firstErrorKey][0];
          alert(`⚠️ Помилка заповнення (${firstErrorKey}): ${firstErrorMsg}`);
        } else {
          alert(`⚠️ Помилка 400: ${errorData?.message || errorData?.title || 'Некоректні дані форми'}`);
        }
      } else {
        alert(`⚠️ Не вдалося зберегти оголошення (статус ${status || 'Network Error'}). Перевірте підключення до сервера.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 0. ЯКЩО НЕ ХОСТ — ЕКРАН ЗМІНИ РОЛІ
  // =========================================================================
  if (!isLandlord) {
    return (
      <main style={styles.changeRoleWrapper}>
        <div style={styles.changeRoleContainer}>
          <div style={styles.changeRoleCard}>
            <div style={styles.crHeader}>
              <div style={styles.crEyebrow}>
                <SparklesIcon />
                <span style={styles.crEyebrowText}>Реєстрація орендодавця</span>
              </div>
              <h1 style={styles.crMainTitle}>Станьте господарем та здавайте житло</h1>
              <p style={styles.crSubtitle}>
                Вам стануть доступні нові можливості орендодавця, і ви все ще зможете користуватися
                базовими функціями як орендар — шукати та бронювати житло.
              </p>
            </div>

            {roleError && <div style={styles.errorBanner}>{roleError}</div>}

            <div style={styles.crComparisonRow}>
              <div style={styles.crTenantBox}>
                <div style={styles.crTitleRow}>
                  <span style={styles.crTenantTitle}>Орендар</span>
                  <span style={styles.crCurrentBadge}>Поточна роль</span>
                </div>
                <div style={styles.crFeaturesList}>
                  <div style={styles.crFeatureItem}>
                    <SearchIcon />
                    <span>Пошук та бронювання квартир</span>
                  </div>
                  <div style={styles.crFeatureItem}>
                    <HeartIcon />
                    <span>Збереження у список обраного</span>
                  </div>
                  <div style={styles.crFeatureItem}>
                    <MessageSquareIcon />
                    <span>Листування з власниками</span>
                  </div>
                </div>
              </div>

              <div style={styles.crLandlordBox}>
                <div style={styles.crTitleRow}>
                  <span style={styles.crLandlordTitle}>Орендар (Господар)</span>
                  <span style={styles.crNewBadge}>Буде активовано</span>
                </div>
                <div style={styles.crFeaturesList}>
                  <div style={{ ...styles.crFeatureItem, color: '#291C0E', fontWeight: 700 }}>
                    <PlusCircleIcon />
                    <span>Публікація власних об&apos;єктів</span>
                  </div>
                  <div style={{ ...styles.crFeatureItem, color: '#291C0E', fontWeight: 700 }}>
                    <CalendarIcon />
                    <span>Керування календарем зайнятості</span>
                  </div>
                  <div style={{ ...styles.crFeatureItem, color: '#291C0E', fontWeight: 700 }}>
                    <TrendingUpIcon />
                    <span>Стабільний заробіток та аналітика</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.crWarningNotice}>
              <div style={{ paddingTop: '2px' }}>
                <AlertTriangleIcon />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={styles.crWarningTitle}>Зміна робочого інтерфейсу</div>
                <div style={styles.crWarningDesc}>
                  Після активації кабінету Господаря вам стануть доступні нові сторінки: Фінанси,
                  Аналітика, Керування житлом, Календар бронювань та інші. Ваш поточний інтерфейс
                  орендаря залишиться без змін.
                </div>
              </div>
            </div>

            <label
              onClick={() => setRoleCheckbox(!roleCheckbox)}
              style={styles.crCheckboxRow}
            >
              <div
                style={{
                  ...styles.crCheckboxSquare,
                  borderColor: roleCheckbox ? '#DC9666' : '#A78D78',
                  backgroundColor: roleCheckbox ? '#DC9666' : '#FFFFFF',
                }}
              >
                {roleCheckbox && <CheckIcon color="#FFFFFF" size={14} />}
              </div>
              <span style={styles.crCheckboxLabel}>
                Я ознайомлений(-а) зі зміною умов надання послуг та підтверджую активацію кабінету
                Орендодавця
              </span>
            </label>

            <div style={styles.crDivider} />

            <div style={styles.crActionBlock}>
              <div style={styles.crButtonGroup}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={styles.crBtnBack}
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRoleChange}
                  disabled={loading}
                  style={styles.crBtnConfirm}
                >
                  {loading ? 'Активація...' : 'Обрати роль'}
                </button>
              </div>

              <div style={styles.crReassurance}>
                <InfoIcon />
                <span style={styles.crReassuranceText}>
                  Не хвилюйтеся, ви зможете легко повернутися до ролі Орендаря в будь-який момент у
                  налаштуваннях профілю.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // 1. ОСНОВНИЙ ФЛОУ: 6 КРОКІВ РЕЄСТРАЦІЇ ЖИТЛА ДЛЯ ОРЕНДОДАВЦЯ
  // =========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#E1D4C2', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif" }}>

      {/* 1. ГОРИЗОНТАЛЬНИЙ СТЕППЕР З FIGMA */}
      <div style={{ ...styles.stepperBarContainer, zIndex: 50 }}>
        <div style={{ maxWidth: '1720px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 style={{ color: '#291C0E', fontSize: '22px', fontFamily: "'Alegreya', serif", fontWeight: 800, margin: 0 }}>
            Створення нового оголошення
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {[
              { num: 1, label: 'Тип' },
              { num: 2, label: 'Назва' },
              { num: 3, label: 'Зручності' },
              { num: 4, label: 'Фото' },
              { num: 5, label: 'Ціна' },
              { num: 6, label: 'Публікація' },
            ].map((s, idx) => {
              const isPastOrCurrent = step >= s.num;
              return (
                <React.Fragment key={s.num}>
                  {idx > 0 && <ChevronRightIcon color={isPastOrCurrent ? '#DC9666' : '#A78D78'} />}
                  <div
                    onClick={() => setStep(s.num)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      opacity: isPastOrCurrent ? 1 : 0.65,
                    }}
                  >
                    <div
                      style={{
                        ...styles.stepCircle,
                        backgroundColor: isPastOrCurrent ? '#DC9666' : '#A78D78',
                      }}
                    >
                      {s.num}
                    </div>
                    <span style={{ color: isPastOrCurrent ? '#DC9666' : '#A78D78', fontSize: '14px', fontWeight: 700 }}>
                      {s.label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. ТІЛО СТОРІНКИ (Гнучкий контейнер з фоновими ялинками та пташками) */}
      <div style={{ flex: 1, position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ФОНОВІ ЯЛИНКИ ТА ПТАШКИ */}
        <div style={{ position: 'absolute', right: '-20px', bottom: '-140px', zIndex: 0, pointerEvents: 'none', width: '500px' }}>
          <img 
            src={birdsBg} 
            alt="Пташки" 
            style={{ 
              position: 'absolute', 
              right: '300px', 
              top: '-40px', 
              width: '180px',
              opacity: 0.9 
            }} 
          />
          <img src={treesBg} alt="Декоративні ялинки" style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.9 }} />
        </div>

        {/* ОСНОВНИЙ КОНТЕНТ ФОРМИ */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '850px', padding: '48px 40px 60px 40px' }}>
          
          {/* КРОК 1 */}
          {step === 1 && (
            <div style={styles.stepCardMain}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={styles.stepTitle}>Крок 1. Оберіть тип помешкання</h2>
                <p style={styles.stepSubtitle}>Це допоможе мандрівникам знайти ваше житло у відповідній категорії</p>
              </div>

              <div style={styles.typesGrid}>
                {ACCOMMODATION_TYPES.map((t) => {
                  const isSelected = formData.type === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setFormData({ ...formData, type: t.id })}
                      style={{
                        ...styles.typeCardItem,
                        borderColor: isSelected ? '#DC9666' : '#D7C7B1',
                        boxShadow: isSelected ? '0px 6px 18px rgba(220, 150, 102, 0.25)' : 'none',
                      }}
                    >
                      <div style={styles.typeIconBox}>{t.icon}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E', marginTop: '6px' }}>{t.label}</div>
                      <div style={{ fontSize: '13px', color: '#A78D78', marginTop: '2px' }}>{t.subtitle}</div>
                    </div>
                  );
                })}
              </div>

              <hr style={styles.formDivider} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: 0, fontFamily: "'Alegreya', serif" }}>
                  Основна інформація
                </h3>

                <div>
                  <label style={styles.formLabel}>Населений пункт та область *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="наприклад: Яремче, Івано-Франківська область"
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Точна адреса (вулиця, номер будинку)</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="вул. Свободи 12"
                    style={styles.formInput}
                  />
                </div>
              </div>
            </div>
          )}

          {/* КРОК 2 */}
          {step === 2 && (
            <div style={styles.stepCardMain}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={styles.stepTitle}>Крок 2. Назва та формат оренди</h2>
                <p style={styles.stepSubtitle}>Сформулюйте привабливу назву та вкажіть основні умови перебування</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={styles.formLabel}>Коротка назва для пошуку (до 60 символів) *</label>
                  <input
                    type="text"
                    maxLength={60}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Детальний опис для мандрівників</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={styles.formTextarea}
                  />
                </div>
              </div>

              <hr style={styles.formDivider} />

              <div>
                <label style={{ ...styles.formLabel, fontSize: '18px', marginBottom: '14px' }}>Тип здачі в оренду</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                  {[
                    { id: 'daily', title: 'Подобово', sub: 'Для коротких мандрівок' },
                    { id: 'monthly', title: 'Помісячно', sub: 'Оренда на кілька місяців' },
                    { id: 'longterm', title: 'Довгостроково', sub: 'Контракт від 1 року' },
                  ].map((rf) => {
                    const active = formData.rentalFormat === rf.id;
                    return (
                      <div
                        key={rf.id}
                        onClick={() => setFormData({ ...formData, rentalFormat: rf.id as 'daily' | 'monthly' | 'longterm' })}
                        style={{
                          ...styles.rentalFormatBox,
                          borderColor: active ? '#DC9666' : '#D7C7B1',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: active ? '#DC9666' : '#291C0E', fontSize: '16px' }}>{rf.title}</strong>
                          <div style={{ ...styles.radioCircle, borderColor: active ? '#DC9666' : '#D7C7B1', backgroundColor: active ? '#DC9666' : 'white' }} />
                        </div>
                        <span style={{ color: '#A78D78', fontSize: '13px', marginTop: '6px', display: 'block' }}>{rf.sub}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr style={styles.formDivider} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div>
                  <label style={styles.formLabel}>Макс. кількість гостей</label>
                  <div style={styles.stepperContainer}>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, maxGuests: Math.max(1, formData.maxGuests - 1) })}>-</button>
                    <span style={styles.stepperNum}>{formData.maxGuests}</span>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, maxGuests: formData.maxGuests + 1 })}>+</button>
                  </div>
                </div>

                <div>
                  <label style={styles.formLabel}>Кількість спалень</label>
                  <div style={styles.stepperContainer}>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, bedroomsCount: Math.max(1, formData.bedroomsCount - 1) })}>-</button>
                    <span style={styles.stepperNum}>{formData.bedroomsCount}</span>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, bedroomsCount: formData.bedroomsCount + 1 })}>+</button>
                  </div>
                </div>

                <div>
                  <label style={styles.formLabel}>Кількість санвузлів</label>
                  <div style={styles.stepperContainer}>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, bathroomsCount: Math.max(1, formData.bathroomsCount - 1) })}>-</button>
                    <span style={styles.stepperNum}>{formData.bathroomsCount}</span>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, bathroomsCount: formData.bathroomsCount + 1 })}>+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* КРОК 3 */}
          {step === 3 && (
            <div style={styles.stepCardMain}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={styles.stepTitle}>Крок 3. Зручності вашого помешкання</h2>
                <p style={styles.stepSubtitle}>Оберіть усе устаткування та сервіси, які будуть доступні гостям</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {AMENITIES_BY_CATEGORY.map((sec, i) => (
                  <div key={i}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', margin: '0 0 14px 0' }}>{sec.category}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                      {sec.items.map((item) => {
                        const checked = formData.amenities.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => toggleAmenity(item)}
                            style={{
                              ...styles.amenityToggleCard,
                              borderColor: checked ? '#DC9666' : '#D7C7B1',
                              backgroundColor: checked ? 'rgba(220, 150, 102, 0.1)' : '#FFFFFF',
                            }}
                          >
                            <div style={{ ...styles.checkboxSquare, borderColor: checked ? '#DC9666' : '#A78D78', backgroundColor: checked ? '#DC9666' : 'white' }}>
                              {checked && <CheckIcon color="#FFFFFF" size={12} />}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: checked ? 700 : 500, color: '#6E473B' }}>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', margin: '0 0 14px 0' }}>Харчування</h3>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'none', label: 'Без харчування' },
                      { id: 'breakfast', label: 'Сніданок' },
                      { id: 'half', label: 'Напівпансіон' },
                      { id: 'full', label: 'Повний пансіон' },
                    ].map((m) => (
                      <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#6E473B', fontSize: '15px' }}>
                        <input
                          type="radio"
                          name="mealPlan"
                          checked={formData.mealPlan === m.id}
                          onChange={() => setFormData({ ...formData, mealPlan: m.id as 'none' | 'breakfast' | 'half' | 'full' })}
                          style={{ accentColor: '#DC9666' }}
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* КРОК 4 */}
          {step === 4 && (
            <div style={styles.stepCardMain}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={styles.stepTitle}>Крок 4. Світлини вашого помешкання</h2>
                <p style={styles.stepSubtitle}>Завантажте щонайменше 4 якісних фотографій. Перша стане обкладинкою</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => processFiles(e.target.files)}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
                style={{
                  ...styles.photoDropzone,
                  borderColor: isDragging ? '#DC9666' : '#D7C7B1',
                  backgroundColor: isDragging ? 'rgba(220, 150, 102, 0.15)' : '#FFFFFF',
                }}
              >
                <div style={styles.uploadIconCircle}>
                  <UploadCloudIcon />
                </div>
                <div style={{ color: '#DC9666', fontSize: '18px', fontWeight: 700 }}>
                  Перетягніть фото сюди або натисніть для вибору
                </div>
                <span style={{ color: '#A78D78', fontSize: '14px' }}>
                  Рекомендований формат JPG/PNG, мінімум одна світлина
                </span>
              </div>

              <hr style={styles.formDivider} />

              <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', marginBottom: '16px' }}>
                Завантажені світлини ({formData.imageUrls.length})
              </div>

              {formData.imageUrls.length === 0 && (
                <div style={{ color: '#C62828', fontSize: '14px', marginBottom: '16px', fontWeight: 600 }}>
                  ⚠️ Увага: для створення оголошення необхідно додати мінімум одну фотографію.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {formData.imageUrls.map((url, idx) => (
                  <div key={idx} style={styles.uploadedCard}>
                    <img src={url} alt={`Photo ${idx}`} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#6E473B' }}>
                        {idx === 0 ? 'Головна (Обкладинка)' : `Світлина ${idx + 1}`}
                      </span>
                      <button onClick={() => removeImage(idx)} style={styles.deleteCrossBtn} title="Видалити">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* КРОК 5 */}
          {step === 5 && (
            <div style={styles.stepCardMain}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={styles.stepTitle}>Крок 5. Встановлення ціни та умови бронювання</h2>
                <p style={styles.stepSubtitle}>Визначте фінансові умови вашого оголошення та правила скасування замовлень</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={styles.formLabel}>Базова ціна за добу *</label>
                  <div style={styles.priceInputWrapper}>
                    <input
                      type="number"
                      step={50}
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                      style={styles.priceNumberInput}
                    />
                    <span style={{ color: '#A78D78', fontSize: '16px' }}>₴ / доба</span>
                  </div>
                </div>

                <div>
                  <label style={styles.formLabel}>Мінімальний термін оренди (діб)</label>
                  <div style={styles.stepperContainer}>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, minDays: Math.max(1, formData.minDays - 1) })}>-</button>
                    <span style={styles.stepperNum}>{formData.minDays}</span>
                    <button style={styles.stepperBtn} onClick={() => setFormData({ ...formData, minDays: formData.minDays + 1 })}>+</button>
                  </div>
                </div>
              </div>

              <hr style={styles.formDivider} />

              <div>
                <label style={{ ...styles.formLabel, fontSize: '18px', marginBottom: '14px' }}>Політика скасування</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {[
                    { id: 'flexible', title: 'Гнучка', desc: 'Безкоштовне скасування за 24 години до приїзду' },
                    { id: 'moderate', title: 'Помірна', desc: 'Безкоштовне скасування за 5 днів до заїзду' },
                    { id: 'strict', title: 'Сувора', desc: 'Повернення 50% при скасуванні за 14 днів до заїзду' },
                  ].map((p) => {
                    const active = formData.cancellationPolicy === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setFormData({ ...formData, cancellationPolicy: p.id as 'flexible' | 'moderate' | 'strict' })}
                        style={{
                          ...styles.rentalFormatBox,
                          borderColor: active ? '#DC9666' : '#D7C7B1',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: active ? '#DC9666' : '#291C0E', fontSize: '16px' }}>{p.title}</strong>
                          <div style={{ ...styles.radioCircle, borderColor: active ? '#DC9666' : '#D7C7B1', backgroundColor: active ? '#DC9666' : 'white' }} />
                        </div>
                        <span style={{ color: '#A78D78', fontSize: '13px', marginTop: '6px', display: 'block', lineHeight: '18px' }}>
                          {p.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr style={styles.formDivider} />

              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', marginBottom: '16px' }}>Додаткові послуги та збори</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={styles.formLabel}>Плата за прибирання (одноразово)</label>
                    <input
                      type="number"
                      value={formData.cleaningFee}
                      onChange={(e) => setFormData({ ...formData, cleaningFee: Number(e.target.value) })}
                      style={styles.formInput}
                    />
                  </div>
                  <div>
                    <label style={styles.formLabel}>Застава за майно (повертається)</label>
                    <input
                      type="number"
                      value={formData.depositFee}
                      onChange={(e) => setFormData({ ...formData, depositFee: Number(e.target.value) })}
                      style={styles.formInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* КРОК 6 */}
          {step === 6 && (
            <div style={styles.stepCardMain}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={styles.stepTitle}>Крок 6. Перевірка та публікація</h2>
                <p style={styles.stepSubtitle}>Останній крок! Перевірте правильність заповнення та надішліть оголошення</p>
              </div>

              <hr style={styles.formDivider} />

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', marginBottom: '14px' }}>
                    Попередній перегляд картки
                  </div>
                  <div style={styles.previewCardFigma}>
                    <img
                      src={formData.imageUrls[0] || 'https://placehold.co/800x400/E1D4C2/6E473B?text=Немає+фотографії'}
                      alt="Preview Cover"
                      style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPinIcon />
                          <span style={{ fontSize: '14px', color: '#A78D78', fontWeight: 700 }}>{formData.location || 'Локація не вказана'}</span>
                        </div>
                        <span style={styles.previewPillTag}>
                          {ACCOMMODATION_TYPES.find((t) => t.id === formData.type)?.label || 'Шале'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#6E473B', margin: 0 }}>
                        {formData.title || 'Назва помешкання'}
                      </h3>

                      <p style={{ fontSize: '14px', color: '#6E473B', lineHeight: '22px', margin: 0 }}>
                        {formData.description || 'Опис відсутній'}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {formData.amenities.slice(0, 6).map((a) => (
                          <span key={a} style={styles.amenityBadgePreview}>{a}</span>
                        ))}
                      </div>

                      <div style={styles.previewPriceFooter}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>{user?.firstName || 'Господар'} {user?.lastName || ''}</div>
                          <div style={{ fontSize: '12px', color: '#A78D78' }}>Власник оголошення</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '24px', fontWeight: 700, color: '#DC9666' }}>
                            {formatPrice(formData.pricePerNight)}
                          </span>
                          <span style={{ fontSize: '14px', color: '#A78D78' }}>/ доба</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={styles.checklistCardBox}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B' }}>Готовність до публікації</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={styles.checkRowItem}>
                        <div style={styles.greenTickCircle}><CheckIcon color="#DC9666" size={14} /></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Тип помешкання</div>
                          <div style={{ fontSize: '12px', color: '#A78D78' }}>Вибрано {ACCOMMODATION_TYPES.find((t) => t.id === formData.type)?.label}</div>
                        </div>
                      </div>

                      <div style={styles.checkRowItem}>
                        <div style={styles.greenTickCircle}><CheckIcon color="#DC9666" size={14} /></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Назва та опис</div>
                          <div style={{ fontSize: '12px', color: '#A78D78' }}>Вказано назву та опис</div>
                        </div>
                      </div>

                      <div style={styles.checkRowItem}>
                        <div style={styles.greenTickCircle}><CheckIcon color="#DC9666" size={14} /></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Зручності</div>
                          <div style={{ fontSize: '12px', color: '#A78D78' }}>Обрано {formData.amenities.length} позицій</div>
                        </div>
                      </div>

                      <div style={styles.checkRowItem}>
                        <div style={styles.greenTickCircle}><CheckIcon color="#DC9666" size={14} /></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Фотографії</div>
                          <div style={{ fontSize: '12px', color: '#A78D78' }}>Завантажено {formData.imageUrls.length} знімків</div>
                        </div>
                      </div>

                      <div style={styles.checkRowItem}>
                        <div style={styles.greenTickCircle}><CheckIcon color="#DC9666" size={14} /></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Тариф</div>
                          <div style={{ fontSize: '12px', color: '#A78D78' }}>Встановлено ціну {formatPrice(formData.pricePerNight)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.moderationNotice}>
                    <ClockIcon />
                    <span style={{ fontSize: '14px', color: '#DC9666', lineHeight: '20px' }}>
                      Ваше оголошення буде доступне для бронювання мандрівниками після проходження модерації.
                    </span>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      style={{ marginTop: '3px', accentColor: '#DC9666' }}
                    />
                    <span style={{ fontSize: '13px', color: '#6E473B', lineHeight: '20px' }}>
                      Я погоджуюся з <strong style={{ color: '#DC9666', textDecoration: 'underline' }}>Правилами публікації оголошень</strong> та ліцензійною угодою сервісу Trails UA.
                    </span>
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                    <button
                      onClick={handlePublish}
                      disabled={loading}
                      style={styles.publishActionBtn}
                    >
                      {loading ? 'Публікація...' : 'Опублікувати зараз'}
                    </button>

                    <button
                      onClick={() => { alert('Чернетку збережено!'); navigate('/routes'); }}
                      style={styles.saveDraftBtn}
                    >
                      Зберегти як чернетку
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. БІЛА ПАНЕЛЬ НАВІГАЦІЇ */}
      <div style={styles.stickyBottomBar}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#DC9666', fontSize: '15px', fontWeight: 700 }}>Крок</span>
            <div style={styles.stepCounterBadge}>{step} з 6</div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} style={styles.navBackBtn}>
                Назад
              </button>
            )}

            {step < 6 ? (
              <button onClick={() => setStep(step + 1)} style={styles.navNextBtn}>
                Далі
              </button>
            ) : (
              <button onClick={handlePublish} disabled={loading} style={styles.navNextBtn}>
                Зареєструвати помешкання
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================== СТИЛІ ========================

const styles: Record<string, React.CSSProperties> = {
  changeRoleWrapper: {
    minHeight: '100vh',
    backgroundColor: '#E1D4C2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    boxSizing: 'border-box',
    fontFamily: "'Iosevka Charon', 'Manrope', 'DM Sans', sans-serif",
  },
  changeRoleContainer: {
    width: '100%',
    maxWidth: '920px',
    display: 'flex',
    flexDirection: 'column',
  },
  changeRoleCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 8px 32px rgba(41, 28, 14, 0.06)',
    padding: '44px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  crHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  crEyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  crEyebrowText: {
    color: '#DC9666',
    fontSize: '15px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  crMainTitle: {
    fontSize: '36px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    color: '#291C0E',
    margin: 0,
    lineHeight: 1.25,
  },
  crSubtitle: {
    fontSize: '16px',
    color: '#6E473B',
    lineHeight: '24px',
    margin: 0,
  },
  crComparisonRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    width: '100%',
  },
  crTenantBox: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  crLandlordBox: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '2px solid #DC9666',
    boxShadow: '0px 6px 20px rgba(220, 150, 102, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  crTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crTenantTitle: {
    color: '#6E473B',
    fontSize: '20px',
    fontWeight: 700,
  },
  crLandlordTitle: {
    color: '#DC9666',
    fontSize: '20px',
    fontWeight: 700,
  },
  crCurrentBadge: {
    padding: '4px 8px',
    backgroundColor: '#6E473B',
    borderRadius: '6px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  crNewBadge: {
    padding: '4px 8px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderRadius: '6px',
    color: '#2E7D32',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  crFeaturesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  crFeatureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#6E473B',
    fontSize: '14px',
  },
  crWarningNotice: {
    padding: '20px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '12px',
    border: '1px solid #DC9666',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  crWarningTitle: {
    color: '#DC9666',
    fontSize: '16px',
    fontWeight: 700,
  },
  crWarningDesc: {
    color: '#6E473B',
    fontSize: '14px',
    lineHeight: '21px',
  },
  crCheckboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  crCheckboxSquare: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid #A78D78',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  crCheckboxLabel: {
    color: '#291C0E',
    fontSize: '15px',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  crDivider: {
    width: '100%',
    height: '1px',
    backgroundColor: '#D7C7B1',
  },
  crActionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  crButtonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    width: '100%',
  },
  crBtnBack: {
    padding: '14px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1.5px solid #6E473B',
    color: '#6E473B',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  crBtnConfirm: {
    padding: '14px 24px',
    backgroundColor: '#DC9666',
    borderRadius: '12px',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(220, 150, 102, 0.35)',
  },
  crReassurance: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  crReassuranceText: {
    color: '#A78D78',
    fontSize: '13px',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FDE8E8',
    color: '#C62828',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    border: '1px solid #F8B4B4',
  },
  stepperBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #D7C7B1',
    padding: '24px 40px',
    boxSizing: 'border-box',
  },
  stepCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCardMain: {
    backgroundColor: '#E1D4C2',
    borderRadius: '24px',
    border: '1px solid #E1D4C2',
    padding: '36px',
    boxShadow: 'none',
  },
  stepTitle: {
    fontSize: '24px',
    fontFamily: "'Alegreya', serif",
    fontWeight: 800,
    color: '#291C0E',
    margin: '0 0 8px 0',
  },
  stepSubtitle: {
    fontSize: '16px',
    color: '#6E473B',
    margin: 0,
  },
  formDivider: {
    border: 'none',
    height: '1px',
    backgroundColor: '#D7C7B1',
    margin: '28px 0',
  },
  typesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
  },
  typeCardItem: {
    padding: '16px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    transition: 'all 0.2s ease',
  },
  typeIconBox: {
    width: '36px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  formLabel: {
    color: '#6E473B',
    fontSize: '14px',
    fontWeight: 700,
    display: 'block',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    outline: 'none',
    fontSize: '15px',
    color: '#291C0E',
    boxSizing: 'border-box',
  },
  formTextarea: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    outline: 'none',
    fontSize: '15px',
    color: '#291C0E',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  rentalFormatBox: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    cursor: 'pointer',
  },
  radioCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    backgroundColor: '#FFFFFF',
  },
  stepperBtn: {
    width: '32px',
    height: '32px',
    backgroundColor: '#DC9666',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    fontSize: '18px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  stepperNum: {
    color: '#6E473B',
    fontSize: '16px',
    fontWeight: 700,
  },
  amenityToggleCard: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  checkboxSquare: {
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: '2px solid #A78D78',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  photoDropzone: {
    padding: '48px 24px',
    borderRadius: '16px',
    border: '2px dashed #DC9666',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  uploadIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '32px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedCard: {
    borderRadius: '12px',
    border: '1px solid #D7C7B1',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  deleteCrossBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '13px',
    backgroundColor: '#DC9666',
    color: 'white',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    backgroundColor: '#FFFFFF',
  },
  priceNumberInput: {
    border: 'none',
    outline: 'none',
    fontSize: '22px',
    fontWeight: 700,
    color: '#DC9666',
    width: '100%',
  },
  previewCardFigma: {
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 8px 24px rgba(17, 34, 17, 0.05)',
  },
  previewPillTag: {
    padding: '4px 12px',
    borderRadius: '100px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    color: '#DC9666',
    fontSize: '12px',
    fontWeight: 700,
  },
  amenityBadgePreview: {
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    color: '#DC9666',
    fontSize: '13px',
    fontWeight: 500,
  },
  previewPriceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #D7C7B1',
    paddingTop: '14px',
    marginTop: '8px',
  },
  checklistCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  checkRowItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  greenTickCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moderationNotice: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    border: '1px solid #DC9666',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  publishActionBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  saveDraftBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    color: '#DC9666',
    borderRadius: '8px',
    border: '1px solid #DC9666',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  stickyBottomBar: {
    backgroundColor: '#FFFFFF',
    padding: '28px 40px',
    width: '100%',
    zIndex: 2,
    position: 'relative',
    boxSizing: 'border-box',
    borderTop: '1px solid #D7C7B1',
  },
  stepCounterBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    color: '#DC9666',
    fontSize: '14px',
    fontWeight: 700,
  },
  navBackBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid #DC9666',
    backgroundColor: '#FFFFFF',
    color: '#DC9666',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  navNextBtn: {
    padding: '12px 32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#DC9666',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};