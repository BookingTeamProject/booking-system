import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { routesApi, categoriesApi } from '../services/api.service';
import { syncService } from '../services/sync.service';
import type { RouteItem } from '../types';

// ======================== SVG ІКОНКИ ========================
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

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const MapPinIcon = ({ color = '#DC9666' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Конфігурація типів житла з Figma
const ACCOMMODATION_TYPES = [
  { id: 'apartment', label: 'Квартира', subtitle: 'Окремі апартаменти', icon: '🏢' },
  { id: 'house', label: 'Будинок', subtitle: 'Цілий будинок для гостей', icon: '🏡' },
  { id: 'cottage', label: 'Котедж', subtitle: "Дерев'яний гірський будинок", icon: '🌲' },
  { id: 'chalet', label: 'Шале', subtitle: 'Традиційне альпійське шале', icon: '🛖' },
  { id: 'glamping', label: 'Глемпінг', subtitle: 'Розкішні намети просто неба', icon: '⛺' },
  { id: 'room', label: 'Кімната', subtitle: 'Окрема кімната у житлі', icon: '🚪' },
];

// Категорії зручностей з Figma
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
  const [roleSwitchConfirmed, setRoleSwitchConfirmed] = useState(false);

  // Стан форми
  const [formData, setFormData] = useState({
    type: 'chalet',
    categoryId: '',
    title: 'Панорамне шале з гарячим чаном над хмарами',
    description: "Сучасний дерев'яний котедж у затишному куточку Яремче. Панорамні вікна з виглядом на Чорногірський хребет. На терасі встановлено просторий чан на дровах з джерельною водою. Всередині є камін, обладнана кухня та дві окремі спальні. Ідеальне місце для відновлення сил.",
    location: 'Яремче, Івано-Франківська область',
    address: 'вул. Свободи 12',
    rentalFormat: 'daily' as 'daily' | 'monthly' | 'longterm',
    maxGuests: 4,
    bedroomsCount: 2,
    bathroomsCount: 1,
    amenities: [
      'Автентичний чан',
      'Тераса',
      'Wi-Fi',
      'Камін',
      'Барбекю',
      'Краєвид на гори',
      'Швидкісний Wi-Fi',
      'Кухня з усім приладдям',
      'Гаряча вода',
    ],
    mealPlan: 'none' as 'none' | 'breakfast' | 'half' | 'full',
    pricePerNight: 3500,
    minDays: 1,
    cancellationPolicy: 'flexible' as 'flexible' | 'moderate' | 'strict',
    cleaningFee: 500,
    depositFee: 2000,
    imageUrls: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    ] as string[],
  });

  useEffect(() => {
    // Підвантажуємо категорії з бекенду або кешу
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (e) {
        console.warn('Використано стандартні категорії');
      }
    };
    loadCategories();
  }, []);

  // Обробка файлів
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

  const handleRoleUpgrade = async () => {
    setLoading(true);
    try {
      await switchRole('Landlord');
      setRoleSwitchConfirmed(true);
      alert('🎉 Вітаємо! Ви стали орендодавцем. Тепер заповніть дані вашого житла.');
    } catch {
      setRoleSwitchConfirmed(true);
    } finally {
      setLoading(false);
    }
  };

  // Публікація оголошення
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

    setLoading(true);

    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let targetCategoryId = formData.categoryId;
    const selectedTypeObj = ACCOMMODATION_TYPES.find((t) => t.id === formData.type);

    // 1. Гарантуємо отримання реального Guid категорії з БД за назвою
    try {
      const categoriesFromDb = await categoriesApi.getAll();
      if (Array.isArray(categoriesFromDb) && categoriesFromDb.length > 0) {
        // Шукаємо категорію, що відповідає вибраному типу житла
        const matched = categoriesFromDb.find(
          (c) => c.name.toLowerCase() === selectedTypeObj?.label.toLowerCase()
        );
        targetCategoryId = matched ? matched.id : categoriesFromDb[0].id;
      }
    } catch (e) {
      console.warn('Не вдалося отримати категорії з API:', e);
    }

    // 2. Якщо Guid все одно не валідний
    if (!guidRegex.test(targetCategoryId)) {
      alert('⚠️ Помилка: Не вдалося знайти категорію житла в базі даних. Переконайтеся, що бекенд запущено.');
      setLoading(false);
      return;
    }

    // 3. Запобігаємо передачі гігантських Base64 файлів, якщо вони не завантажені на сховище
    const cleanImageUrls = formData.imageUrls.filter((url) => !url.startsWith('data:'));
    const finalImages = cleanImageUrls.length > 0 ? cleanImageUrls : [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    ];

    try {
      // 4. Відправляємо на бекенд C# ASP.NET Core
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

      // Скидаємо кеш, щоб каталог одразу підтягнув нове житло
      syncService.invalidate('routes_');

      // 5. Оновлюємо локальний список оголошень для офлайн-доступу
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
        // Якщо сервер повернув детальні помилки валідації
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

  // 0. ПЕРЕВІРКА РОЛІ (FIGMA "Хочеш змінити роль?")
  if (!isLandlord && !roleSwitchConfirmed) {
    return (
      <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', padding: '60px 20px', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif" }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/profile')}
            style={backToProfileLinkStyle}
          >
            ← Назад до профілю
          </button>

          <div style={roleSwitchCardStyle}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <SparklesIcon />
                <span style={{ color: '#DC9666', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Реєстрація орендодавця
                </span>
              </div>
              <h1 style={roleCardHeadingStyle}>Станьте господарем та здавайте житло</h1>
              <p style={{ color: '#A78D78', fontSize: '16px', lineHeight: '24px', margin: '12px 0 0 0' }}>
                Вам стануть доступні нові можливості орендодавця, і ви все ще зможете користуватися базовими функціями як орендар — шукати та бронювати житло.
              </p>
            </div>

            {/* Порівняння карток ролей */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>
              {/* Орендар (поточна) */}
              <div style={roleBoxRegularStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#6E473B' }}>Орендар</span>
                  <span style={currentRoleBadgeStyle}>Поточна роль</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div style={featureCheckRowStyle}><span>🔍</span> Пошук та бронювання житла</div>
                  <div style={featureCheckRowStyle}><span>🤍</span> Збереження у список обраного</div>
                  <div style={featureCheckRowStyle}><span>💬</span> Листування з власниками</div>
                </div>
              </div>

              {/* Господар (активується) */}
              <div style={roleBoxActiveStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#DC9666' }}>Господар</span>
                  <span style={newRoleBadgeStyle}>Буде активовано</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  <div style={{ ...featureCheckRowStyle, color: '#291C0E', fontWeight: 700 }}><span>➕</span> Публікація власних об'єктів</div>
                  <div style={{ ...featureCheckRowStyle, color: '#291C0E', fontWeight: 700 }}><span>📅</span> Керування календарем зайнятості</div>
                  <div style={{ ...featureCheckRowStyle, color: '#291C0E', fontWeight: 700 }}><span>📈</span> Стабільний заробіток та аналітика</div>
                </div>
              </div>
            </div>

            {/* Попередження */}
            <div style={warningNoticeBoxStyle}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <div style={{ color: '#DC9666', fontSize: '16px', fontWeight: 700 }}>Зміна робочого інтерфейсу</div>
                <div style={{ color: '#DC9666', fontSize: '14px', lineHeight: '20px', marginTop: '4px' }}>
                  Після активації кабінету Господаря вам стануть доступні нові сторінки: Фінанси, Аналітика, Керування житлом та Календар.
                </div>
              </div>
            </div>

            {/* Підтвердження */}
            <button
              onClick={handleRoleUpgrade}
              disabled={loading}
              style={confirmRoleBtnStyle}
            >
              {loading ? 'Активація...' : 'Підтвердити зміну ролі та продовжити'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif" }}>
      
      {/* 1. ГОРИЗОНТАЛЬНИЙ СТЕППЕР З FIGMA */}
      <div style={stepperBarContainerStyle}>
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
                        ...stepCircleStyle,
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

      {/* 2. ТІЛО СТОРІНКИ (КРОКИ) */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px 140px 40px' }}>
        
        {/* ================= КРОК 1: ТИП ПОМЕШКАННЯ ================= */}
        {step === 1 && (
          <div style={stepCardMainStyle}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={stepTitleStyle}>Крок 1. Оберіть тип помешкання</h2>
              <p style={stepSubtitleStyle}>Це допоможе мандрівникам знайти ваше житло у відповідній категорії</p>
            </div>

            <div style={typesGridStyle}>
              {ACCOMMODATION_TYPES.map((t) => {
                const isSelected = formData.type === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setFormData({ ...formData, type: t.id })}
                    style={{
                      ...typeCardItemStyle,
                      borderColor: isSelected ? '#DC9666' : '#D7C7B1',
                      boxShadow: isSelected ? '0px 6px 18px rgba(220, 150, 102, 0.25)' : 'none',
                    }}
                  >
                    <div style={typeIconBoxStyle}>{t.icon}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E', marginTop: '6px' }}>{t.label}</div>
                    <div style={{ fontSize: '13px', color: '#A78D78', marginTop: '2px' }}>{t.subtitle}</div>
                  </div>
                );
              })}
            </div>

            <hr style={formDividerStyle} />

            {/* Локація */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: 0, fontFamily: "'Alegreya', serif" }}>
                Основна інформація
              </h3>

              <div>
                <label style={formLabelStyle}>Населений пункт та область *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="наприклад: Яремче, Івано-Франківська область"
                  style={formInputStyle}
                />
              </div>

              <div>
                <label style={formLabelStyle}>Точна адреса (вулиця, номер будинку)</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="вул. Свободи 12"
                  style={formInputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= КРОК 2: НАЗВА ТА ФОРМАТ ================= */}
        {step === 2 && (
          <div style={stepCardMainStyle}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={stepTitleStyle}>Крок 2. Назва та формат оренди</h2>
              <p style={stepSubtitleStyle}>Сформулюйте привабливу назву та вкажіть основні умови перебування</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={formLabelStyle}>Коротка назва для пошуку (до 50 символів) *</label>
                <input
                  type="text"
                  maxLength={60}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={formInputStyle}
                />
              </div>

              <div>
                <label style={formLabelStyle}>Детальний опис для мандрівників</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={formTextareaStyle}
                />
              </div>
            </div>

            <hr style={formDividerStyle} />

            {/* Формат оренди */}
            <div>
              <label style={{ ...formLabelStyle, fontSize: '18px', marginBottom: '14px' }}>Тип здачі в оренду</label>
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
                      onClick={() => setFormData({ ...formData, rentalFormat: rf.id as any })}
                      style={{
                        ...rentalFormatBoxStyle,
                        borderColor: active ? '#DC9666' : '#D7C7B1',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: active ? '#DC9666' : '#291C0E', fontSize: '16px' }}>{rf.title}</strong>
                        <div style={{ ...radioCircleStyle, borderColor: active ? '#DC9666' : '#D7C7B1', backgroundColor: active ? '#DC9666' : 'white' }} />
                      </div>
                      <span style={{ color: '#A78D78', fontSize: '13px', marginTop: '6px', display: 'block' }}>{rf.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr style={formDividerStyle} />

            {/* Степпери параметрів */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div>
                <label style={formLabelStyle}>Макс. кількість гостей</label>
                <div style={stepperContainerStyle}>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, maxGuests: Math.max(1, formData.maxGuests - 1) })}>-</button>
                  <span style={stepperNumStyle}>{formData.maxGuests}</span>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, maxGuests: formData.maxGuests + 1 })}>+</button>
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Кількість спалень</label>
                <div style={stepperContainerStyle}>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, bedroomsCount: Math.max(1, formData.bedroomsCount - 1) })}>-</button>
                  <span style={stepperNumStyle}>{formData.bedroomsCount}</span>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, bedroomsCount: formData.bedroomsCount + 1 })}>+</button>
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Кількість санвузлів</label>
                <div style={stepperContainerStyle}>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, bathroomsCount: Math.max(1, formData.bathroomsCount - 1) })}>-</button>
                  <span style={stepperNumStyle}>{formData.bathroomsCount}</span>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, bathroomsCount: formData.bathroomsCount + 1 })}>+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= КРОК 3: ЗРУЧНОСТІ ================= */}
        {step === 3 && (
          <div style={stepCardMainStyle}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={stepTitleStyle}>Крок 3. Зручності вашого помешкання</h2>
              <p style={stepSubtitleStyle}>Оберіть усе устаткування та сервіси, які будуть доступні гостям</p>
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
                            ...amenityToggleCardStyle,
                            borderColor: checked ? '#DC9666' : '#D7C7B1',
                            backgroundColor: checked ? 'rgba(220, 150, 102, 0.1)' : '#FFFFFF',
                          }}
                        >
                          <div style={{ ...checkboxSquareStyle, borderColor: checked ? '#DC9666' : '#A78D78', backgroundColor: checked ? '#DC9666' : 'white' }}>
                            {checked && <CheckIcon color="#FFFFFF" size={12} />}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: checked ? 700 : 500, color: '#6E473B' }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Харчування */}
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
                        onChange={() => setFormData({ ...formData, mealPlan: m.id as any })}
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

        {/* ================= КРОК 4: ФОТО ================= */}
        {step === 4 && (
          <div style={stepCardMainStyle}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={stepTitleStyle}>Крок 4. Світлини вашого помешкання</h2>
              <p style={stepSubtitleStyle}>Завантажте щонайменше 4 якісних фотографій. Перша стане обкладинкою</p>
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
                ...photoDropzoneStyle,
                borderColor: isDragging ? '#DC9666' : '#D7C7B1',
                backgroundColor: isDragging ? 'rgba(220, 150, 102, 0.15)' : '#FFFFFF',
              }}
            >
              <div style={uploadIconCircleStyle}>
                <UploadCloudIcon />
              </div>
              <div style={{ color: '#DC9666', fontSize: '18px', fontWeight: 700 }}>
                Перетягніть фото сюди або натисніть для вибору
              </div>
              <span style={{ color: '#A78D78', fontSize: '14px' }}>
                Рекомендований формат JPG/PNG, мінімум 1920x1080px
              </span>
            </div>

            <hr style={formDividerStyle} />

            <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', marginBottom: '16px' }}>
              Завантажені світлини ({formData.imageUrls.length})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {formData.imageUrls.map((url, idx) => (
                <div key={idx} style={uploadedCardStyle}>
                  <img src={url} alt={`Photo ${idx}`} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#6E473B' }}>
                      {idx === 0 ? 'Головна (Обкладинка)' : `Світлина ${idx + 1}`}
                    </span>
                    <button onClick={() => removeImage(idx)} style={deleteCrossBtnStyle} title="Видалити">
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= КРОК 5: ЦІНА ================= */}
        {step === 5 && (
          <div style={stepCardMainStyle}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={stepTitleStyle}>Крок 5. Встановлення ціни та умови бронювання</h2>
              <p style={stepSubtitleStyle}>Визначте фінансові умови вашого оголошення та правила скасування замовлень</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={formLabelStyle}>Базова ціна за добу *</label>
                <div style={priceInputWrapperStyle}>
                  <input
                    type="number"
                    step={50}
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                    style={priceNumberInputStyle}
                  />
                  <span style={{ color: '#A78D78', fontSize: '16px' }}>₴ / доба</span>
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Мінімальний термін оренди (діб)</label>
                <div style={stepperContainerStyle}>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, minDays: Math.max(1, formData.minDays - 1) })}>-</button>
                  <span style={stepperNumStyle}>{formData.minDays}</span>
                  <button style={stepperBtnStyle} onClick={() => setFormData({ ...formData, minDays: formData.minDays + 1 })}>+</button>
                </div>
              </div>
            </div>

            <hr style={formDividerStyle} />

            {/* Політика скасування */}
            <div>
              <label style={{ ...formLabelStyle, fontSize: '18px', marginBottom: '14px' }}>Політика скасування</label>
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
                      onClick={() => setFormData({ ...formData, cancellationPolicy: p.id as any })}
                      style={{
                        ...rentalFormatBoxStyle,
                        borderColor: active ? '#DC9666' : '#D7C7B1',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: active ? '#DC9666' : '#291C0E', fontSize: '16px' }}>{p.title}</strong>
                        <div style={{ ...radioCircleStyle, borderColor: active ? '#DC9666' : '#D7C7B1', backgroundColor: active ? '#DC9666' : 'white' }} />
                      </div>
                      <span style={{ color: '#A78D78', fontSize: '13px', marginTop: '6px', display: 'block', lineHeight: '18px' }}>
                        {p.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr style={formDividerStyle} />

            {/* Додаткові збори */}
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', marginBottom: '16px' }}>Додаткові послуги та збори</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={formLabelStyle}>Плата за прибирання (одноразово)</label>
                  <input
                    type="number"
                    value={formData.cleaningFee}
                    onChange={(e) => setFormData({ ...formData, cleaningFee: Number(e.target.value) })}
                    style={formInputStyle}
                  />
                </div>
                <div>
                  <label style={formLabelStyle}>Застава за майно (повертається)</label>
                  <input
                    type="number"
                    value={formData.depositFee}
                    onChange={(e) => setFormData({ ...formData, depositFee: Number(e.target.value) })}
                    style={formInputStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= КРОК 6: ПУБЛІКАЦІЯ ================= */}
        {step === 6 && (
          <div style={stepCardMainStyle}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={stepTitleStyle}>Крок 6. Перевірка та публікація</h2>
              <p style={stepSubtitleStyle}>Останній крок! Перевірте правильність заповнення та надішліть оголошення</p>
            </div>

            <hr style={formDividerStyle} />

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
              {/* Попередній перегляд картки */}
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B', marginBottom: '14px' }}>
                  Попередній перегляд картки
                </div>
                <div style={previewCardFigmaStyle}>
                  <img
                    src={formData.imageUrls[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview Cover"
                    style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPinIcon />
                        <span style={{ fontSize: '14px', color: '#A78D78', fontWeight: 700 }}>{formData.location}</span>
                      </div>
                      <span style={previewPillTagStyle}>
                        {ACCOMMODATION_TYPES.find((t) => t.id === formData.type)?.label || 'Шале'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#6E473B', margin: 0 }}>
                      {formData.title}
                    </h3>

                    <p style={{ fontSize: '14px', color: '#6E473B', lineHeight: '22px', margin: 0 }}>
                      {formData.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {formData.amenities.slice(0, 6).map((a) => (
                        <span key={a} style={amenityBadgePreviewStyle}>{a}</span>
                      ))}
                    </div>

                    <div style={previewPriceFooterStyle}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>{user?.firstName || 'Ярослав'} {user?.lastName || 'К.'}</div>
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

              {/* Чек-лист готовності */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={checklistCardBoxStyle}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E473B' }}>Готовність до публікації</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={checkRowItemStyle}>
                      <div style={greenTickCircleStyle}><CheckIcon color="#DC9666" size={14} /></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Тип помешкання</div>
                        <div style={{ fontSize: '12px', color: '#A78D78' }}>Вибрано {ACCOMMODATION_TYPES.find((t) => t.id === formData.type)?.label}</div>
                      </div>
                    </div>

                    <div style={checkRowItemStyle}>
                      <div style={greenTickCircleStyle}><CheckIcon color="#DC9666" size={14} /></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Назва та опис</div>
                        <div style={{ fontSize: '12px', color: '#A78D78' }}>Вказано локальну назву та детальне резюме</div>
                      </div>
                    </div>

                    <div style={checkRowItemStyle}>
                      <div style={greenTickCircleStyle}><CheckIcon color="#DC9666" size={14} /></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Зручності</div>
                        <div style={{ fontSize: '12px', color: '#A78D78' }}>Обрано {formData.amenities.length} позицій</div>
                      </div>
                    </div>

                    <div style={checkRowItemStyle}>
                      <div style={greenTickCircleStyle}><CheckIcon color="#DC9666" size={14} /></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Фотографії</div>
                        <div style={{ fontSize: '12px', color: '#A78D78' }}>Завантажено {formData.imageUrls.length} знімків</div>
                      </div>
                    </div>

                    <div style={checkRowItemStyle}>
                      <div style={greenTickCircleStyle}><CheckIcon color="#DC9666" size={14} /></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B' }}>Тариф</div>
                        <div style={{ fontSize: '12px', color: '#A78D78' }}>Встановлено ціну {formatPrice(formData.pricePerNight)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Повідомлення про модерацію */}
                <div style={moderationNoticeStyle}>
                  <ClockIcon />
                  <span style={{ fontSize: '14px', color: '#DC9666', lineHeight: '20px' }}>
                    Ваше оголошення буде доступне для бронювання мандрівниками після проходження швидкої модерації (до 24 годин).
                  </span>
                </div>

                {/* Чекбокс ліцензії */}
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
                    style={publishActionBtnStyle}
                  >
                    {loading ? 'Публікація...' : 'Опублікувати зараз'}
                  </button>

                  <button
                    onClick={() => { alert('Чернетку збережено!'); navigate('/routes'); }}
                    style={saveDraftBtnStyle}
                  >
                    Зберегти як чернетку
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. ФІКСОВАНА ПЛАШКА НАВІГАЦІЇ ВНИЗУ (STICKY BOTTOM) */}
      <div style={stickyBottomBarStyle}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#DC9666', fontSize: '15px', fontWeight: 700 }}>Крок</span>
            <div style={stepCounterBadgeStyle}>{step} з 6</div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} style={navBackBtnStyle}>
                Назад
              </button>
            )}

            {step < 6 ? (
              <button onClick={() => setStep(step + 1)} style={navNextBtnStyle}>
                Далі
              </button>
            ) : (
              <button onClick={handlePublish} disabled={loading} style={navNextBtnStyle}>
                Зареєструвати помешкання
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

// ======================= СТИЛІ FIGMA =======================

const stepperBarContainerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D7C7B1',
  padding: '24px 40px',
  boxSizing: 'border-box',
};

const stepCircleStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '12px',
  color: 'white',
  fontSize: '12px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const stepCardMainStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  padding: '36px',
  boxShadow: '0px 8px 24px rgba(41, 28, 14, 0.04)',
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: '28px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 800,
  color: '#291C0E',
  margin: '0 0 8px 0',
};

const stepSubtitleStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#6E473B',
  margin: 0,
};

const formDividerStyle: React.CSSProperties = {
  border: 'none',
  height: '1px',
  backgroundColor: '#D7C7B1',
  margin: '28px 0',
};

const typesGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '20px',
};

const typeCardItemStyle: React.CSSProperties = {
  padding: '24px 20px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'all 0.2s ease',
};

const typeIconBoxStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
};

const formLabelStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '14px',
  fontWeight: 700,
  display: 'block',
  marginBottom: '8px',
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  outline: 'none',
  fontSize: '15px',
  color: '#291C0E',
  boxSizing: 'border-box',
};

const formTextareaStyle: React.CSSProperties = {
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
};

const rentalFormatBoxStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: '1px solid #D7C7B1',
  cursor: 'pointer',
};

const radioCircleStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  border: '2px solid',
};

const stepperContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  backgroundColor: '#FFFFFF',
};

const stepperBtnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  backgroundColor: '#DC9666',
  color: 'white',
  borderRadius: '6px',
  border: 'none',
  fontSize: '18px',
  fontWeight: 700,
  cursor: 'pointer',
};

const stepperNumStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '16px',
  fontWeight: 700,
};

const amenityToggleCardStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #D7C7B1',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
};

const checkboxSquareStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  borderRadius: '6px',
  border: '2px solid #A78D78',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const photoDropzoneStyle: React.CSSProperties = {
  padding: '48px 24px',
  borderRadius: '16px',
  border: '2px dashed #DC9666',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  textAlign: 'center',
};

const uploadIconCircleStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '32px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const uploadedCardStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: '1px solid #D7C7B1',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
};

const deleteCrossBtnStyle: React.CSSProperties = {
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
};

const priceInputWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 14px',
  borderRadius: '8px',
  border: '1px solid #D7C7B1',
  backgroundColor: '#FFFFFF',
};

const priceNumberInputStyle: React.CSSProperties = {
  border: 'none',
  outline: 'none',
  fontSize: '22px',
  fontWeight: 700,
  color: '#DC9666',
  width: '100%',
};

const previewCardFigmaStyle: React.CSSProperties = {
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 8px 24px rgba(17, 34, 17, 0.05)',
};

const previewPillTagStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: '100px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  color: '#DC9666',
  fontSize: '12px',
  fontWeight: 700,
};

const amenityBadgePreviewStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  color: '#DC9666',
  fontSize: '13px',
  fontWeight: 500,
};

const previewPriceFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #D7C7B1',
  paddingTop: '14px',
  marginTop: '8px',
};

const checklistCardBoxStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const checkRowItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const greenTickCircleStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '12px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const moderationNoticeStyle: React.CSSProperties = {
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  border: '1px solid #DC9666',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const publishActionBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '8px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const saveDraftBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#FFFFFF',
  color: '#DC9666',
  borderRadius: '8px',
  border: '1px solid #DC9666',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const stickyBottomBarStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#FFFFFF',
  borderTop: '1px solid #D7C7B1',
  padding: '16px 40px',
  boxSizing: 'border-box',
  zIndex: 100,
};

const stepCounterBadgeStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  color: '#DC9666',
  fontSize: '14px',
  fontWeight: 700,
};

const navBackBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: '1px solid #DC9666',
  backgroundColor: '#FFFFFF',
  color: '#DC9666',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
};

const navNextBtnStyle: React.CSSProperties = {
  padding: '12px 32px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
};

// СТИЛІ ЕКРАНУ ЗМІНИ РОЛІ
const backToProfileLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#C62828',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  marginBottom: '20px',
  display: 'inline-flex',
};

const roleSwitchCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
};

const roleCardHeadingStyle: React.CSSProperties = {
  fontSize: '34px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 800,
  color: '#291C0E',
  margin: '8px 0 0 0',
};

const roleBoxRegularStyle: React.CSSProperties = {
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #D7C7B1',
  backgroundColor: '#FFFFFF',
};

const roleBoxActiveStyle: React.CSSProperties = {
  padding: '24px',
  borderRadius: '16px',
  border: '2px solid #DC9666',
  backgroundColor: '#FFFFFF',
};

const currentRoleBadgeStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: '6px',
  backgroundColor: '#6E473B',
  color: 'white',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
};

const newRoleBadgeStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: '6px',
  backgroundColor: 'rgba(46, 125, 50, 0.15)',
  color: '#2E7D32',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
};

const featureCheckRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  color: '#6E473B',
};

const warningNoticeBoxStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: '12px',
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  border: '1px solid #DC9666',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
};

const confirmRoleBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '12px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
};