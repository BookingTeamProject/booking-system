// src/pages/ReportIssuePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('booking');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      alert('Скаргу зареєстровано! Служба безпеки перевірить деталі.');
      navigate('/');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px 80px 20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '36px', border: '1px solid #E1D4C2', boxShadow: '0 8px 24px rgba(41,28,14,0.06)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#291C0E', margin: '0 0 8px 0' }}>
          ⚠️ Повідомити про проблему або скаргу
        </h1>
        <p style={{ color: '#6E473B', fontSize: '14px', marginBottom: '24px' }}>
          Опишіть ситуацію, якщо ви зіткнулися з невідповідністю помешкання, проблемами з оплатою або недобросовісним господарем.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#059669' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
            <h3>Дякуємо! Скарга прийнята в обробку.</h3>
          </div>
        ) : (
          <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6E473B', marginBottom: '6px' }}>
                Категорія звернення
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #BEB5A9', outline: 'none' }}>
                <option value="booking">Проблема з бронюванням / заселенням</option>
                <option value="payment">Питання щодо оплати та повернення коштів</option>
                <option value="fake">Невідповідність фотографій або опису житла</option>
                <option value="tech">Технічна помилка на сайті</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6E473B', marginBottom: '6px' }}>
                Детальний опис проблеми
              </label>
              <textarea rows={5} required value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Вкажіть номер бронювання або назву помешкання..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #BEB5A9', outline: 'none', fontSize: '14px' }} />
            </div>

            <button type="submit" style={{ backgroundColor: '#DC2626', color: '#FFFFFF', padding: '13px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Надіслати скаргу модераторам
            </button>
          </form>
        )}
      </div>
    </div>
  );
};