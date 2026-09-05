// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 24px 80px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#291C0E' }}>📬 Зв'яжіться з нашою командою</h1>
        <p style={{ color: '#6E473B', fontSize: '15px' }}>
          Ми завжди раді відповісти на ваші запитання або допомогти з бронюванням 24/7.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '36px', alignItems: 'start' }}>
        {/* Контактные данные */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid #E1D4C2' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E', marginBottom: '20px' }}>
            Контактна інформація
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '14px', color: '#6E473B' }}>
            <div>
              <strong>📞 Гаряча лінія турботи:</strong>
              <div style={{ color: '#291C0E', fontWeight: 700, marginTop: '2px' }}>+380 (800) 500-24-07</div>
            </div>
            <div>
              <strong>✉️ Електронна пошта:</strong>
              <div style={{ color: '#291C0E', fontWeight: 700, marginTop: '2px' }}>support@trailsua.pp.ua</div>
            </div>
            <div>
              <strong>📍 Головний офіс:</strong>
              <div style={{ color: '#291C0E', marginTop: '2px' }}>м. Івано-Франківськ, вул. Незалежності, 42</div>
            </div>
            <div>
              <strong>⏰ Графік підтримки:</strong>
              <div style={{ color: '#059669', fontWeight: 700, marginTop: '2px' }}>Цілодобово 24/7 без вихідних</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid #F4ECE4', paddingTop: '18px' }}>
            <Link to="/report-issue" style={{ color: '#DC2626', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
              ⚠️ Повідомити про технічну проблему або скаргу →
            </Link>
          </div>
        </div>

        {/* Форма сообщения */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', border: '1px solid #E1D4C2' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E', marginBottom: '16px' }}>
            Надіслати нам повідомлення
          </h3>

          {sent && (
            <div style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
              ✓ Ваше повідомлення успішно надіслано! Ми зв'яжемося з вами найближчим часом.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Ваше ім'я</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Олександр" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email для відповіді</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Текст повідомлення</label>
              <textarea rows={4} required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Опишіть ваше запитання..." style={inputStyle} />
            </div>
            <button type="submit" style={submitBtnStyle}>Надіслати листа</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#6E473B', marginBottom: '5px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1px solid #BEB5A9', outline: 'none', fontSize: '14px' };
const submitBtnStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' };