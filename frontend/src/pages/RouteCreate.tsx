// src/pages/RouteCreate.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { RouteItem } from '../types';

const ACCOMMODATION_TYPES = [
  { id: 'chalet', label: 'Шале', icon: '🛖', desc: 'Автентичний дерев’яний дім' },
  { id: 'house', label: 'Будинок', icon: '🏡', desc: 'Приватний окремий дім' },
  { id: 'glamping', label: 'Глемпінг', icon: '⛺', desc: 'Комфорт серед дикої природи' },
  { id: 'apartment', label: 'Квартира', icon: '🏢', desc: 'Окреме міське житло' },
  { id: 'room', label: 'Кімната', icon: '🛏️', desc: 'Окрема кімната в будинку' },
];

const AMENITIES_LIST = [
  { category: 'Ванна кімната', items: ['Фен для волосся', 'Засоби гігієни', 'Гаряча вода', 'Душова кабіна'] },
  { category: 'Спальня та пральня', items: ['Шафа для одягу', 'Замки на дверях спальні', 'Пральна машина', 'Постільна білизна', 'Праска'] },
  { category: 'Розваги та зв’язок', items: ['Телевізор Smart TV', 'Швидкісний Wi-Fi', 'Книги та настілки'] },
  { category: 'Кухня та їдальня', items: ['Кухня з усім приладдям', 'Холодильник', 'Мікрохвильова піч', 'Посуд та столові прибори', 'Кавоварка', 'Духовка'] },
  { category: 'Опалення та клімат', items: ['Кондиціонер', 'Центральне опалення', 'Камін на дровах', 'Генератор'] },
  { category: 'Безпека', items: ['Датчик диму', 'Вогнегасник', 'Аптечка', 'Відеоспостереження подвір’я'] },
];

const CANCELLATION_POLICIES = {
  flexible: 'Гнучка (100% повернення коштів за 24 год до заїзду)',
  moderate: 'Помірна (100% повернення коштів за 5 днів до заїзду)',
  strict: 'Сувора (50% повернення коштів за 7 днів до заїзду)',
};

export const RouteCreate: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Состояние формы
  const [formData, setFormData] = useState({
    type: 'chalet',
    categoryId: '',
    title: '',
    description: '',
    location: '',
    address: '',
    rentalFormat: 'daily',
    maxGuests: 4,
    roomsCount: 2,
    bedsCount: 3,
    amenities: ['Швидкісний Wi-Fi', 'Гаряча вода', 'Камін на дровах', 'Кухня з усім приладдям'] as string[],
    pricePerNight: 2400,
    minDays: 1,
    cancellationPolicy: 'flexible' as 'flexible' | 'moderate' | 'strict',
    imageUrls: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    ] as string[],
  });

  useEffect(() => {
    // Подтягиваем доступные категории с бэкенда
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, categoryId: res.data[0].id }));
        }
      } catch (e) {
        console.warn('Категорії завантажено локально:', e);
      }
    };
    fetchCategories();
  }, []);

  // Обработка загрузки файлов через File Reader
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const toggleAmenity = (name: string) => {
    if (formData.amenities.includes(name)) {
      setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== name) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, name] });
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    const newRouteItem: RouteItem = {
      id: String(Date.now()),
      title: formData.title || 'Еко-садиба «Затишок лісу» з карпатським чаном',
      description: formData.description || 'Неймовірне автентичне помешкання з терасою та краєвидом на гори.',
      location: formData.location || 'с. Татарів, Івано-Франківська обл.',
      distanceKm: 0,
      durationHours: 0,
      price: formData.pricePerNight,
      categoryId: formData.categoryId || formData.type,
      categoryName: ACCOMMODATION_TYPES.find((t) => t.id === formData.type)?.label || 'Шале',
      authorName: 'Олександр П.',
      averageRating: 5.0,
      imageUrls: formData.imageUrls.length > 0 ? formData.imageUrls : ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
      amenities: formData.amenities,
      maxGuests: formData.maxGuests,
      roomsCount: formData.roomsCount,
      cancellationPolicy: formData.cancellationPolicy === 'flexible' ? 'Flexible' : formData.cancellationPolicy === 'moderate' ? 'Moderate' : 'Strict',
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Отправляем на бэкенд .NET API
      await api.post('/routes', {
        title: newRouteItem.title,
        description: newRouteItem.description,
        location: newRouteItem.location,
        distanceKm: 0,
        durationHours: 0,
        price: newRouteItem.price,
        categoryId: formData.categoryId || (categories.length > 0 ? categories[0].id : '1'),
        imageUrls: newRouteItem.imageUrls,
        amenities: newRouteItem.amenities,
      });
    } catch (err) {
      console.warn('Збережено у локальний каталог (демо):', err);
    } finally {
      // 2. Сохраняем в локальный каталог, чтобы объект СРАЗУ отобразился в поиске и на главной
      const existingLocal: RouteItem[] = JSON.parse(localStorage.getItem('custom_routes') || '[]');
      existingLocal.unshift(newRouteItem);
      localStorage.setItem('custom_routes', JSON.stringify(existingLocal));

      setLoading(false);
      alert('🎉 Помешкання успішно створено та додано до каталогу!');
      navigate('/routes');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px 80px 20px' }}>
      {/* Шапка шагов */}
      <div style={wizardHeaderCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: 0 }}>
            Створення нового оголошення
          </h2>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#DC9666', backgroundColor: '#F4ECE4', padding: '4px 14px', borderRadius: '14px' }}>
            Крок {step} з 6
          </span>
        </div>

        <div style={progressBarTrackStyle}>
          <div style={{ ...progressBarFillStyle, width: `${(step / 6) * 100}%` }} />
        </div>
      </div>

      {/* ШАГ 1: ТИП ПОМЕШКАННЯ */}
      {step === 1 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 1. Оберіть тип помешкання</h3>
          <p style={stepSubtitleStyle}>Це допоможе мандрівникам швидко знайти ваше житло у пошуку.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {ACCOMMODATION_TYPES.map((t) => (
              <div
                key={t.id}
                onClick={() => setFormData({ ...formData, type: t.id })}
                style={{
                  ...typeCardStyle,
                  borderColor: formData.type === t.id ? '#DC9666' : '#E1D4C2',
                  backgroundColor: formData.type === t.id ? '#F4ECE4' : '#FFFFFF',
                }}
              >
                <span style={{ fontSize: '32px' }}>{t.icon}</span>
                <strong style={{ fontSize: '15px', marginTop: '6px', color: '#291C0E' }}>{t.label}</strong>
                <span style={{ fontSize: '11px', color: '#6E473B', marginTop: '4px' }}>{t.desc}</span>
              </div>
            ))}
          </div>

          <h4 style={sectionHeadingStyle}>Локація та адреса</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Населений пункт / Регіон *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="наприклад: с. Татарів, Івано-Франківська область"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Вулиця та номер будинку</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="вул. Незалежності, 14"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* ШАГ 2: НАЗВА ТА ОПИС */}
      {step === 2 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 2. Назва та опис помешкання</h3>
          <p style={stepSubtitleStyle}>Придумайте яскраву назву для приваблення туристів.</p>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Назва оголошення *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Еко-садиба «Затишок лісу» з карпатським чаном"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={labelStyle}>Детальний опис</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Опишіть затишок, панорами гір, близькість до річки чи лісу..."
              style={inputStyle}
            />
          </div>

          <h4 style={sectionHeadingStyle}>Параметри місткості</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Макс. гостей</label>
              <input
                type="number"
                min={1}
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Кількість кімнат</label>
              <input
                type="number"
                min={1}
                value={formData.roomsCount}
                onChange={(e) => setFormData({ ...formData, roomsCount: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Спальних місць</label>
              <input
                type="number"
                min={1}
                value={formData.bedsCount}
                onChange={(e) => setFormData({ ...formData, bedsCount: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* ШАГ 3: ЗРУЧНОСТІ */}
      {step === 3 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 3. Зручності вашого помешкання</h3>
          <p style={stepSubtitleStyle}>Позначте всі доступні елементи комфорту.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {AMENITIES_LIST.map((sec, idx) => (
              <div key={idx}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#6E473B', marginBottom: '10px' }}>{sec.category}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {sec.items.map((item) => {
                    const isChecked = formData.amenities.includes(item);
                    return (
                      <label
                        key={item}
                        style={{
                          ...checkboxCardStyle,
                          borderColor: isChecked ? '#DC9666' : '#E1D4C2',
                          backgroundColor: isChecked ? '#F4ECE4' : '#FFFFFF',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAmenity(item)}
                          style={{ accentColor: '#DC9666' }}
                        />
                        <span style={{ fontSize: '13px', color: '#291C0E', fontWeight: isChecked ? 600 : 400 }}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ШАГ 4: СВІТЛИНИ (ІНТЕРАКТИВНИЙ DRAG & DROP ТА ВИБІР) */}
      {step === 4 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 4. Світлини вашого помешкання</h3>
          <p style={stepSubtitleStyle}>Завантажте фотографії з вашого комп'ютера або перетягніть їх у поле нижче.</p>

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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              ...uploadDropzoneStyle,
              borderColor: isDragging ? '#DC9666' : '#BEB5A9',
              backgroundColor: isDragging ? '#F4ECE4' : '#FAF6F0',
            }}
          >
            <span style={{ fontSize: '42px', marginBottom: '8px' }}>📷</span>
            <strong style={{ fontSize: '15px', color: '#291C0E' }}>
              Перетягніть фото сюди або <span style={{ color: '#DC9666', textDecoration: 'underline' }}>натисніть для вибору</span>
            </strong>
            <span style={{ fontSize: '12px', color: '#6E473B', marginTop: '6px' }}>Підтримуються файли PNG, JPG, JPEG, WEBP</span>
          </div>

          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '24px 0 12px 0', color: '#291C0E' }}>
            Завантажені світлини ({formData.imageUrls.length})
          </h4>

          {formData.imageUrls.length === 0 ? (
            <p style={{ color: '#A78D78', fontSize: '13px' }}>Поки не додано жодного фото.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
              {formData.imageUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative', height: '130px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E1D4C2' }}>
                  <img src={url} alt={`Upload ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {i === 0 && <span style={coverBadgeStyle}>Головне фото</span>}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    style={deletePhotoBtnStyle}
                    title="Видалити фото"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ШАГ 5: ВСТАНОВЛЕННЯ ЦІНИ ТА ПОЛІТИКА СКАСУВАННЯ */}
      {step === 5 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 5. Встановлення ціни та умови бронювання</h3>
          <p style={stepSubtitleStyle}>Визначте вартість за добу та правила скасування замовлення.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Базова ціна за добу (₴) *</label>
              <input
                type="number"
                step={50}
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Мінімальний термін оренди (діб)</label>
              <input
                type="number"
                min={1}
                value={formData.minDays}
                onChange={(e) => setFormData({ ...formData, minDays: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
          </div>

          <h4 style={sectionHeadingStyle}>Політика скасування</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[
              { id: 'flexible', title: 'Гнучка', desc: '100% повернення коштів за 24 години до заїзду' },
              { id: 'moderate', title: 'Помірна', desc: '100% повернення коштів за 5 днів до заїзду' },
              { id: 'strict', title: 'Сувора', desc: '50% повернення коштів за 7 днів до заїзду' },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => setFormData({ ...formData, cancellationPolicy: p.id as any })}
                style={{
                  ...policyCardStyle,
                  borderColor: formData.cancellationPolicy === p.id ? '#DC9666' : '#E1D4C2',
                  backgroundColor: formData.cancellationPolicy === p.id ? '#F4ECE4' : '#FFFFFF',
                }}
              >
                <strong style={{ color: '#291C0E' }}>{p.title}</strong>
                <p style={{ fontSize: '12px', color: '#6E473B', margin: '6px 0 0 0', lineHeight: 1.4 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ШАГ 6: ПЕРЕВІРКА ТА ПУБЛІКАЦІЯ (УКРАИНСКИЙ ПРЕДПРОСМОТР) */}
      {step === 6 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 6. Перевірка та публікація</h3>
          <p style={stepSubtitleStyle}>Перевірте всі деталі оголошення перед фінальною публікацією на платформі Trails UA.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Карточка */}
            <div style={previewCardStyle}>
              <img
                src={formData.imageUrls[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                alt="preview"
                style={{ width: '100%', height: '210px', objectFit: 'cover' }}
              />
              <div style={{ padding: '18px' }}>
                <span style={previewBadgeStyle}>
                  {ACCOMMODATION_TYPES.find((t) => t.id === formData.type)?.label || 'Шале'}
                </span>
                <h4 style={{ fontSize: '17px', margin: '8px 0 4px 0', color: '#291C0E', fontWeight: 800 }}>
                  {formData.title || 'Еко-садиба «Затишок лісу»'}
                </h4>
                <p style={{ fontSize: '13px', color: '#6E473B', margin: '0 0 12px 0' }}>📍 {formData.location || 'Карпати'}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE4', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#A78D78' }}>Вартість за добу:</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E' }}>
                      ₴ {formData.pricePerNight} <span style={{ fontSize: '12px', fontWeight: 400 }}>/ доба</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '10px' }}>
                    ✓ Готово до показу
                  </span>
                </div>
              </div>
            </div>

            {/* Сводка условий на украинском */}
            <div style={{ backgroundColor: '#F4ECE4', borderRadius: '18px', padding: '22px', border: '1px solid #E1D4C2' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#291C0E', fontWeight: 800 }}>
                📋 Деталі розміщення
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#6E473B' }}>
                <div><strong>Тип житла:</strong> {ACCOMMODATION_TYPES.find((t) => t.id === formData.type)?.label}</div>
                <div><strong>Місткість:</strong> до {formData.maxGuests} гостей ({formData.roomsCount} кімн., {formData.bedsCount} спальних місць)</div>
                <div><strong>Обрано зручностей:</strong> {formData.amenities.length} опцій</div>
                <div><strong>Мінімальний термін:</strong> {formData.minDays} доба</div>
                <div style={{ borderTop: '1px solid #E1D4C2', paddingTop: '10px' }}>
                  <strong>Політика скасування:</strong>
                  <div style={{ color: '#291C0E', marginTop: '2px', fontWeight: 600 }}>
                    {CANCELLATION_POLICIES[formData.cancellationPolicy]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Кнопки переключения шагов */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} style={secondaryNavBtnStyle}>
            ← Назад
          </button>
        ) : <div />}

        {step < 6 ? (
          <button onClick={() => setStep(step + 1)} style={primaryNavBtnStyle}>
            Далі →
          </button>
        ) : (
          <button onClick={handlePublish} disabled={loading} style={publishBtnStyle}>
            {loading ? 'Публікація...' : '🚀 Опублікувати помешкання'}
          </button>
        )}
      </div>
    </div>
  );
};

// Стили
const wizardHeaderCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '20px 24px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 15px rgba(41,28,14,0.04)',
  marginBottom: '20px',
};
const progressBarTrackStyle: React.CSSProperties = {
  width: '100%',
  height: '8px',
  backgroundColor: '#F4ECE4',
  borderRadius: '4px',
  overflow: 'hidden',
};
const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: '#DC9666',
  transition: 'width 0.3s ease',
};
const stepContentCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '32px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 6px 20px rgba(41,28,14,0.04)',
};
const stepTitleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#291C0E',
  margin: '0 0 6px 0',
};
const stepSubtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6E473B',
  margin: '0 0 24px 0',
};
const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#291C0E',
  marginBottom: '12px',
};
const typeCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '18px 12px',
  borderRadius: '16px',
  border: '2px solid',
  cursor: 'pointer',
  textAlign: 'center',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: '#6E473B',
  marginBottom: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #BEB5A9',
  outline: 'none',
  fontSize: '14px',
};
const checkboxCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1px solid',
  cursor: 'pointer',
};
const uploadDropzoneStyle: React.CSSProperties = {
  border: '2px dashed #DC9666',
  borderRadius: '18px',
  padding: '40px 20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};
const coverBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: 700,
};
const deletePhotoBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: 'rgba(41,28,14,0.75)',
  color: '#FFFFFF',
  border: 'none',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '11px',
};
const policyCardStyle: React.CSSProperties = {
  padding: '16px',
  borderRadius: '14px',
  border: '2px solid',
  cursor: 'pointer',
};
const previewCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '18px',
  overflow: 'hidden',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
};
const previewBadgeStyle: React.CSSProperties = {
  backgroundColor: '#F4ECE4',
  color: '#DC9666',
  padding: '2px 8px',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: 700,
};
const primaryNavBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '12px 28px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer',
};
const secondaryNavBtnStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  color: '#6E473B',
  border: '1px solid #BEB5A9',
  padding: '12px 24px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};
const publishBtnStyle: React.CSSProperties = {
  backgroundColor: '#059669',
  color: '#FFFFFF',
  padding: '12px 32px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
};