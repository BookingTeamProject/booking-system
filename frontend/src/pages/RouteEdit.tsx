import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { routesApi, categoriesApi } from '../services/api.service';
import { syncService } from '../services/sync.service';
import treesBg from '../assets/trees-bg.png';
import birdsBg from '../assets/birds.png';

// ======================== SVG ІКОНКИ ========================
// (Ті самі, що і в RouteCreate)
const ChevronRightIcon = ({ color = '#DC9666' }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const UploadCloudIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l-4-4-4 4M12 12v9" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
);
const CheckIcon = ({ color = '#DC9666', size = 14 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const MapPinIcon = ({ color = '#DC9666' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
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
  { category: 'Ванна кімната', items: ['Фен для волосся', 'Засоби гігієни (мило, гель)', 'Гаряча вода'] },
  { category: 'Спальня та пральня', items: ['Шафа для одягу', 'Постільна білизна', 'Замок на дверях спальні', 'Сушильна машина', 'Пральна машина', 'Праска та дошка'] },
  { category: "Розваги та зв'язок", items: ['Телевізор зі стрімінгом', 'Швидкісний Wi-Fi', 'Книги та журнали'] },
  { category: 'Кухня та їдальня', items: ['Кухня з усім приладдям', 'Мікрохвильова піч', 'Плита для готування', 'Холодильник', 'Посуд та столові прибори', 'Духовка', 'Тостер', 'Кавоварка еспресо'] },
  { category: 'Опалення та кондиціонування', items: ['Кондиціонування повітря', 'Центральне опалення'] },
  { category: 'Безпека', items: ['Датчик чадного газу / диму', 'Вогнегасник', 'Аптечка першої допомоги'] },
  { category: 'Парковка та інше', items: ['Безкоштовна парковка', 'Можна з тваринами', 'Не можна шуміти', 'Дозволено курити', 'Приватна тераса або балкон', 'Затишний камін', 'Підходить для вечірок'] },
];

export const RouteEdit: React.FC = () => {
  const { id } = useParams(); // Отримуємо ID з URL
  const navigate = useNavigate();
  const { user, isLandlord } = useAuth();
  const { formatPrice } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

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

  // Завантажуємо існуючі дані маршруту
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const routeData = await routesApi.getById(id);
        const cats = await categoriesApi.getAll();
        
        let typeId = 'apartment';
        if (routeData.categoryId && Array.isArray(cats)) {
          const matchedCat = cats.find(c => c.id === routeData.categoryId);
          if (matchedCat) {
            const matchedType = ACCOMMODATION_TYPES.find(t => t.label.toLowerCase() === matchedCat.name.toLowerCase());
            if (matchedType) typeId = matchedType.id;
          }
        }

        setFormData({
          ...formData,
          type: typeId,
          categoryId: routeData.categoryId || '',
          title: routeData.title || '',
          description: routeData.description || '',
          location: routeData.location || '',
          pricePerNight: routeData.price || 0,
          amenities: Array.isArray(routeData.amenities) ? routeData.amenities : [],
          imageUrls: Array.isArray(routeData.imageUrls) ? routeData.imageUrls : [],
        });
      } catch (error) {
        console.error('Помилка завантаження маршруту:', error);
        alert('Не вдалося завантажити дані для редагування.');
        navigate('/profile');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

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

  const handleUpdate = async () => {
    if (!formData.title.trim() || !formData.location.trim()) {
      alert('Будь ласка, заповніть обов\'язкові поля (назва, локація).');
      return;
    }

    setLoading(true);
    let targetCategoryId = formData.categoryId;

    try {
      const cats = await categoriesApi.getAll();
      const selectedTypeObj = ACCOMMODATION_TYPES.find((t) => t.id === formData.type);
      if (Array.isArray(cats) && cats.length > 0) {
        const matched = cats.find((c) => c.name.toLowerCase() === selectedTypeObj?.label.toLowerCase());
        if (matched) targetCategoryId = matched.id;
      }
    } catch (e) {
      console.warn('Не вдалося оновити категорію:', e);
    }

    const finalImages = formData.imageUrls.length > 0 ? formData.imageUrls : [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'
];

    try {
      await routesApi.update(id!, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        price: Number(formData.pricePerNight),
        categoryId: targetCategoryId,
        imageUrls: finalImages,
        amenities: formData.amenities,
      });

      // ====================================================
      // АВТОМАТИЧНА ЧИСТКА КЕШУ (ЩОБ БЕЗ F12 І МИЛИЦЬ)
      // Видаляємо всі збережені дані браузера, ОКРІМ токена авторизації та юзера.
      // Тепер Головна сторінка БУДЕ ЗМУШЕНА стягнути свіжі дані з бекенду.
      // ====================================================
      Object.keys(localStorage).forEach(key => {
        const k = key.toLowerCase();
        if (!k.includes('token') && !k.includes('user') && !k.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
      syncService.invalidate('routes_');

      alert('✅ Помешкання успішно оновлено!');
      
      // Повне перезавантаження сторінки з переходом в меню
      window.location.href = '/menu?tab=properties';
      
    } catch (err: any) {
      console.error('Помилка оновлення:', err);
      alert('⚠️ Не вдалося оновити оголошення. Перевірте консоль.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLandlord) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>У вас немає доступу до цієї сторінки.</div>;
  }

  if (initialLoading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Завантаження даних помешкання...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#E1D4C2', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif" }}>
      
      {/* СТЕППЕР */}
      <div style={styles.stepperBarContainer}>
        <div style={{ maxWidth: '1720px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 style={{ color: '#291C0E', fontSize: '22px', fontFamily: "'Alegreya', serif", fontWeight: 800, margin: 0 }}>
            Редагування оголошення
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {[
              { num: 1, label: 'Тип' }, { num: 2, label: 'Назва' }, { num: 3, label: 'Зручності' },
              { num: 4, label: 'Фото' }, { num: 5, label: 'Ціна' }, { num: 6, label: 'Публікація' },
            ].map((s, idx) => {
              const isPastOrCurrent = step >= s.num;
              return (
                <React.Fragment key={s.num}>
                  {idx > 0 && <ChevronRightIcon color={isPastOrCurrent ? '#DC9666' : '#A78D78'} />}
                  <div onClick={() => setStep(s.num)} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: isPastOrCurrent ? 1 : 0.65 }}>
                    <div style={{ ...styles.stepCircle, backgroundColor: isPastOrCurrent ? '#DC9666' : '#A78D78' }}>{s.num}</div>
                    <span style={{ color: isPastOrCurrent ? '#DC9666' : '#A78D78', fontSize: '14px', fontWeight: 700 }}>{s.label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ position: 'absolute', right: '-20px', bottom: '-140px', zIndex: 0, pointerEvents: 'none', width: '500px' }}>
          <img src={birdsBg} alt="Пташки" style={{ position: 'absolute', right: '300px', top: '-40px', width: '180px', opacity: 0.9 }} />
          <img src={treesBg} alt="Декоративні ялинки" style={{ width: '100%', opacity: 0.9 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '850px', padding: '48px 40px 60px 40px' }}>
          
          {/* КРОК 1 */}
          {step === 1 && (
            <div style={styles.stepCardMain}>
              <h2 style={styles.stepTitle}>Крок 1. Оберіть тип помешкання</h2>
              <div style={styles.typesGrid}>
                {ACCOMMODATION_TYPES.map((t) => (
                  <div key={t.id} onClick={() => setFormData({ ...formData, type: t.id })}
                    style={{ ...styles.typeCardItem, borderColor: formData.type === t.id ? '#DC9666' : '#D7C7B1', boxShadow: formData.type === t.id ? '0px 6px 18px rgba(220, 150, 102, 0.25)' : 'none' }}>
                    <div style={styles.typeIconBox}>{t.icon}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E', marginTop: '6px' }}>{t.label}</div>
                  </div>
                ))}
              </div>
              <hr style={styles.formDivider} />
              <label style={styles.formLabel}>Населений пункт та область *</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={styles.formInput} />
            </div>
          )}

          {/* КРОК 2 */}
          {step === 2 && (
            <div style={styles.stepCardMain}>
              <h2 style={styles.stepTitle}>Крок 2. Назва та опис</h2>
              <label style={styles.formLabel}>Коротка назва (до 60 символів) *</label>
              <input type="text" maxLength={60} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{...styles.formInput, marginBottom: '20px'}} />
              <label style={styles.formLabel}>Детальний опис</label>
              <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={styles.formTextarea} />
            </div>
          )}

          {/* КРОК 3 */}
          {step === 3 && (
            <div style={styles.stepCardMain}>
              <h2 style={styles.stepTitle}>Крок 3. Зручності</h2>
              {AMENITIES_BY_CATEGORY.map((sec, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6E473B', marginBottom: '10px' }}>{sec.category}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {sec.items.map((item) => (
                      <div key={item} onClick={() => toggleAmenity(item)} style={{ ...styles.amenityToggleCard, borderColor: formData.amenities.includes(item) ? '#DC9666' : '#D7C7B1' }}>
                        <div style={{ ...styles.checkboxSquare, backgroundColor: formData.amenities.includes(item) ? '#DC9666' : 'white' }}>
                          {formData.amenities.includes(item) && <CheckIcon color="#FFFFFF" size={12} />}
                        </div>
                        <span style={{ fontSize: '14px', color: '#6E473B' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* КРОК 4 */}
          {step === 4 && (
            <div style={styles.stepCardMain}>
              <h2 style={styles.stepTitle}>Крок 4. Фотографії</h2>
              <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => processFiles(e.target.files)} />
              <div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }} style={{ ...styles.photoDropzone, borderColor: isDragging ? '#DC9666' : '#D7C7B1', backgroundColor: isDragging ? 'rgba(220, 150, 102, 0.15)' : '#FFFFFF' }}>
                <UploadCloudIcon />
                <div style={{ color: '#DC9666', fontWeight: 700 }}>Додати фотографії</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                {formData.imageUrls.map((url, idx) => (
                  <div key={idx} style={styles.uploadedCard}>
                    <img src={url} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(idx)} style={{ width: '100%', padding: '8px', border: 'none', backgroundColor: '#FEE2E2', color: '#C62828', cursor: 'pointer' }}>Видалити</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* КРОК 5 */}
          {step === 5 && (
            <div style={styles.stepCardMain}>
              <h2 style={styles.stepTitle}>Крок 5. Ціна</h2>
              <label style={styles.formLabel}>Базова ціна за добу *</label>
              <div style={styles.priceInputWrapper}>
                <input type="number" step={50} value={formData.pricePerNight} onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })} style={styles.priceNumberInput} />
                <span style={{ color: '#A78D78' }}>₴ / доба</span>
              </div>
            </div>
          )}

          {/* КРОК 6 */}
          {step === 6 && (
            <div style={styles.stepCardMain}>
              <h2 style={styles.stepTitle}>Крок 6. Перевірка та збереження</h2>
              <div style={styles.previewCardFigma}>
                <img src={formData.imageUrls[0] || 'https://placehold.co/800x400/E1D4C2/6E473B?text=Немає+фото'} alt="Preview" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#291C0E' }}>{formData.title || 'Без назви'}</h3>
                  <div style={{ color: '#6E473B', fontSize: '14px', marginBottom: '10px' }}><MapPinIcon /> {formData.location}</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#DC9666' }}>{formatPrice(formData.pricePerNight)} / доба</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <div style={styles.stickyBottomBar}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={styles.stepCounterBadge}>Крок {step} з 6</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {step > 1 && <button onClick={() => setStep(step - 1)} style={styles.navBackBtn}>Назад</button>}
            {step < 6 ? (
              <button onClick={() => setStep(step + 1)} style={styles.navNextBtn}>Далі</button>
            ) : (
              <button onClick={handleUpdate} disabled={loading} style={styles.navNextBtn}>
                {loading ? 'Збереження...' : 'Зберегти зміни'}
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
  stepperBarContainer: { backgroundColor: '#FFFFFF', borderBottom: '1px solid #D7C7B1', padding: '24px 40px', zIndex: 50 },
  stepCircle: { width: '24px', height: '24px', borderRadius: '12px', color: 'white', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepCardMain: { backgroundColor: '#E1D4C2', borderRadius: '24px', border: '1px solid #E1D4C2', padding: '36px' },
  stepTitle: { fontSize: '24px', fontFamily: "'Alegreya', serif", fontWeight: 800, color: '#291C0E', margin: '0 0 16px 0' },
  formDivider: { border: 'none', height: '1px', backgroundColor: '#D7C7B1', margin: '24px 0' },
  typesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' },
  typeCardItem: { padding: '16px 14px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #D7C7B1', cursor: 'pointer' },
  typeIconBox: { width: '36px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(220, 150, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  formLabel: { color: '#6E473B', fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: '8px' },
  formInput: { width: '100%', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #D7C7B1', outline: 'none', fontSize: '15px', color: '#291C0E', boxSizing: 'border-box' },
  formTextarea: { width: '100%', padding: '14px 16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #D7C7B1', outline: 'none', fontSize: '15px', color: '#291C0E', boxSizing: 'border-box', fontFamily: 'inherit' },
  amenityToggleCard: { padding: '10px', borderRadius: '12px', border: '1px solid #D7C7B1', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', backgroundColor: '#FFFFFF' },
  checkboxSquare: { width: '20px', height: '20px', borderRadius: '6px', border: '2px solid #A78D78', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  photoDropzone: { padding: '30px', borderRadius: '16px', border: '2px dashed #DC9666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer' },
  uploadedCard: { borderRadius: '12px', border: '1px solid #D7C7B1', overflow: 'hidden', backgroundColor: '#FFFFFF' },
  priceInputWrapper: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #D7C7B1', backgroundColor: '#FFFFFF' },
  priceNumberInput: { border: 'none', outline: 'none', fontSize: '22px', fontWeight: 700, color: '#DC9666', width: '100%' },
  previewCardFigma: { borderRadius: '16px', border: '1px solid #D7C7B1', overflow: 'hidden', backgroundColor: '#FFFFFF' },
  stickyBottomBar: { backgroundColor: '#FFFFFF', padding: '24px 40px', zIndex: 2, position: 'relative', borderTop: '1px solid #D7C7B1' },
  stepCounterBadge: { padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(220, 150, 102, 0.15)', color: '#DC9666', fontWeight: 700 },
  navBackBtn: { padding: '12px 24px', borderRadius: '8px', border: '1px solid #DC9666', backgroundColor: '#FFFFFF', color: '#DC9666', fontWeight: 700, cursor: 'pointer' },
  navNextBtn: { padding: '12px 32px', borderRadius: '8px', border: 'none', backgroundColor: '#DC9666', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' },
};