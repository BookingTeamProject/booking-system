// src/pages/RouteCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ACCOMMODATION_TYPES = [
  { id: 'apartment', label: 'Квартира', icon: '🏢', desc: 'Окреме міське житло' },
  { id: 'house', label: 'Будинок', icon: '🏡', desc: 'Приватний окремий дім' },
  { id: 'chalet', label: 'Шале', icon: '🛖', desc: 'Автентичний дерев’яний дім' },
  { id: 'glamping', label: 'Глемпінг', icon: '⛺', desc: 'Комфорт серед дикої природи' },
  { id: 'room', label: 'Кімната', icon: '🛏️', desc: 'Окрема кімната в будинку' },
];

const AMENITIES_LIST = [
  { category: 'Ванна кімната', items: ['Фен для волосся', 'Засоби гігієни', 'Гаряча вода', 'Душова кабіна'] },
  { category: 'Спальня та пральня', items: ['Шафа для одягу', 'Замки на дверях спальні', 'Пральна машина', 'Постільна білизна', 'Сушарка для одягу', 'Праска та дошка'] },
  { category: 'Розваги та зв’язок', items: ['Телевізор зі Smart TV', 'Швидкісний Wi-Fi', 'Книги та настілки'] },
  { category: 'Кухня та їдальня', items: ['Кухня з усім приладдям', 'Холодильник', 'Тостер', 'Мікрохвильова піч', 'Посуд та столові прибори', 'Кавоварка / еспресо', 'Духовка'] },
  { category: 'Опалення та клімат', items: ['Кондиціонер (холод / тепло)', 'Центральне опалення', 'Камін на дровах', 'Генератор'] },
  { category: 'Безпека', items: ['Датчик чадного газу / диму', 'Вогнегасник', 'Аптечка першої допомоги', 'Відеоспостереження території'] },
];

export const RouteCreate: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Состояние формы
  const [formData, setFormData] = useState({
    type: 'chalet',
    title: '',
    description: '',
    location: '',
    address: '',
    rentalFormat: 'daily',
    maxGuests: 4,
    roomsCount: 2,
    bedsCount: 3,
    amenities: ['Швидкісний Wi-Fi', 'Гаряча вода', 'Камін на дровах'] as string[],
    pricePerNight: 2400,
    minDays: 1,
    cancellationPolicy: 'flexible',
    imageUrls: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    ],
  });

  const toggleAmenity = (name: string) => {
    if (formData.amenities.includes(name)) {
      setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== name) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, name] });
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // Отправляем payload на бэкенд C# Web API
      await api.post('/routes', {
        title: formData.title || 'Еко-садиба в Карпатах',
        description: formData.description || 'Чудове затишне помешкання серед лісу.',
        location: formData.location || 'Яремче, Івано-Франківська область',
        distanceKm: 0,
        durationHours: 0,
        price: formData.pricePerNight,
        categoryId: 'ecotourism-cabin',
        imageUrls: formData.imageUrls,
        amenities: formData.amenities,
      });

      alert('🎉 Помешкання успішно опубліковано!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Помешкання створено локально (демо режим для диплома).');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px 8px 20px' }}>
      {/* Прогресс-бар шагов */}
      <div style={wizardHeaderCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#291C0E', margin: 0 }}>
            Створення нового оголошення
          </h2>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#DC9666', backgroundColor: '#F4ECE4', padding: '4px 12px', borderRadius: '12px' }}>
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
          <p style={stepSubtitleStyle}>Це допоможе мандрівникам знайти ваше житло у відповідній категорії.</p>

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

          <h4 style={sectionHeadingStyle}>Основна локація</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Населений пункт / Регіон</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="наприклад: с. Татарів, Івано-Франківська область"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Точна адреса (буде доступна гостю лише після бронювання)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="вул. Шевченка, 12"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* ШАГ 2: НАЗВА ТА ФОРМАТ */}
      {step === 2 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 2. Назва та формат оренди</h3>
          <p style={stepSubtitleStyle}>Придумайте коротку та привабливу назву, що підкреслить атмосферу.</p>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Назва оголошення (до 60 символів)</label>
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
              placeholder="Опишіть краєвид, прилеглі туристичні стежки, тишу та атмосферу..."
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
          <h3 style={stepTitleStyle}>Крок 3. Зручності вашого котеджу</h3>
          <p style={stepSubtitleStyle}>Оберіть усі доступні елементи комфорту для мандрівників.</p>

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

      {/* ШАГ 4: СВІТЛИНИ */}
      {step === 4 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 4. Світлини вашого помешкання</h3>
          <p style={stepSubtitleStyle}>Завантажте щонайменше 3 якісні фотографії. Гарні світлини збільшують перегляди у 4 рази.</p>

          <div style={uploadDropzoneStyle}>
            <span style={{ fontSize: '42px', marginBottom: '8px' }}>📸</span>
            <strong>Перетягніть фото сюди або натисніть для вибору</strong>
            <span style={{ fontSize: '12px', color: '#A78D78', marginTop: '4px' }}>Підтримуються JPG, PNG, WEBP до 10MB</span>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '20px 0 12px 0', color: '#291C0E' }}>
            Завантажені світлини ({formData.imageUrls.length})
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
            {formData.imageUrls.map((url, i) => (
              <div key={i} style={{ position: 'relative', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E1D4C2' }}>
                <img src={url} alt={`Upload ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === 0 && <span style={coverBadgeStyle}>Головне фото</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ШАГ 5: ЦІНА ТА ПОЛІТИКА */}
      {step === 5 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 5. Встановлення ціни та умови бронювання</h3>
          <p style={stepSubtitleStyle}>Визначте вартість за добу та правила скасування замовлення.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Базова ціна за добу (₴)</label>
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
              { id: 'moderate', title: 'Помірна', desc: '100% повернення за 5 днів до заїзду' },
              { id: 'strict', title: 'Сувора', desc: '50% повернення за 7 днів до заїзду' },
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
                <strong>{p.title}</strong>
                <p style={{ fontSize: '12px', color: '#6E473B', margin: '6px 0 0 0' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ШАГ 6: ПЕРЕВІРКА ТА ПУБЛІКАЦІЯ */}
      {step === 6 && (
        <div style={stepContentCardStyle}>
          <h3 style={stepTitleStyle}>Крок 6. Перевірка та публікація</h3>
          <p style={stepSubtitleStyle}>Перегляньте, як ваше оголошення бачитимуть гості на платформі Trails UA.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Карточка превью */}
            <div style={previewCardStyle}>
              <img src={formData.imageUrls[0]} alt="preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <span style={previewBadgeStyle}>{formData.type.toUpperCase()}</span>
                <h4 style={{ fontSize: '16px', margin: '8px 0 4px 0', color: '#291C0E' }}>
                  {formData.title || 'Еко-садиба «Затишок лісу»'}
                </h4>
                <p style={{ fontSize: '13px', color: '#6E473B', margin: '0 0 10px 0' }}>📍 {formData.location || 'Карпати'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE4', paddingTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#A78D78' }}>Ціна:</span>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E' }}>₴ {formData.pricePerNight} <span style={{ fontSize: '12px', fontWeight: 400 }}>/ доба</span></div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>Готово до публікації</span>
                </div>
              </div>
            </div>

            {/* Сводка по условиям */}
            <div style={{ backgroundColor: '#F4ECE4', borderRadius: '16px', padding: '20px', border: '1px solid #E1D4C2' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#291C0E' }}>Специфікація об’єкта</h4>
              <ul style={{ fontSize: '13px', color: '#6E473B', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
                <li>Місткість: до {formData.maxGuests} гостей ({formData.roomsCount} кімнати)</li>
                <li>Обрано зручностей: {formData.amenities.length} позицій</li>
                <li>Політика скасування: {formData.cancellationPolicy}</li>
                <li>Мінімальний термін: {formData.minDays} доба</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Кнопки навигации визарда */}
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

// Стили визарда
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
  transition: 'all 0.2s',
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
  padding: '36px 20px',
  textAlign: 'center',
  backgroundColor: '#F4ECE4',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
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