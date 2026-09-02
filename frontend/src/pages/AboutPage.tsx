// src/pages/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1380px', margin: '30px auto', padding: '0 24px 80px 24px' }}>
      {/* 1. HERO СЕКЦИЯ */}
      <div style={heroSectionStyle}>
        <div style={{ flex: 1.2 }}>
          <span style={badgeStyle}>ПРО TRAILS UA</span>
          <h1 style={heroHeadingStyle}>
            МИ ВІДКРИВАЄМО<br />УКРАЇНУ ДЛЯ ВАС
          </h1>
          <p style={heroSubStyle}>
            Trails UA — це платформа свідомого українського туризму. Ми об’єднуємо мандрівників, які прагнуть справжнього відпочинку, з гостинними господарями унікальних садиб та авторами туристичних стежок по всій країні.
          </p>
          <Link to="/routes" style={primaryBtnStyle}>
            Досліджувати маршрути →
          </Link>
        </div>

        <div style={{ flex: 1, height: '340px', borderRadius: '24px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
            alt="Mountains cabin"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 2. СТАТИСТИКА */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <strong style={statNumStyle}>12.0k+</strong>
          <span style={statLabelStyle}>Задоволених мандрівників</span>
        </div>
        <div style={statCardStyle}>
          <strong style={statNumStyle}>175+</strong>
          <span style={statLabelStyle}>Перевірених садиб та шале</span>
        </div>
        <div style={statCardStyle}>
          <strong style={statNumStyle}>25+</strong>
          <span style={statLabelStyle}>Курортних регіонів України</span>
        </div>
        <div style={statCardStyle}>
          <strong style={statNumStyle}>4.98</strong>
          <span style={statLabelStyle}>Середній рейтинг гостинності</span>
        </div>
      </div>

      {/* 3. НАША ІСТОРІЯ ТА ЦІННОСТІ */}
      <div style={{ margin: '60px 0' }}>
        <h2 style={sectionTitleStyle}>НА ЧОМУ БАЗУЄТЬСЯ TRAILS UA</h2>
        <div style={valuesGridStyle}>
          <div style={valueCardStyle}>
            <div style={iconCircleStyle}>🌲</div>
            <h3 style={valueTitleStyle}>Автентичність</h3>
            <p style={valueDescStyle}>
              Кожне помешкання проходить перевірку на атмосферу, зручності та щиру карпатську гостинність.
            </p>
          </div>
          <div style={valueCardStyle}>
            <div style={iconCircleStyle}>🛡️</div>
            <h3 style={valueTitleStyle}>Безпека та Прозорість</h3>
            <p style={valueDescStyle}>
              Захищені платежі, гарантія заселення та чесні відгуки безпосередньо від гостей після перебування.
            </p>
          </div>
          <div style={valueCardStyle}>
            <div style={iconCircleStyle}>🤝</div>
            <h3 style={valueTitleStyle}>Підтримка Громад</h3>
            <p style={valueDescStyle}>
              Ми підтримуємо локальних гідів, крафтових господарів та розвиток внутрішнього українського туризму.
            </p>
          </div>
        </div>
      </div>

      {/* 4. КОМАНДА ПРОЄКТУ (FIGMA) */}
      <div style={{ margin: '60px 0' }}>
        <h2 style={sectionTitleStyle}>ЛЮДИ, ЯКІ СТВОРЮЮТЬ МАГІЮ</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { name: 'Максим Ковальчук', role: 'Засновник & Керівник проєкту', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
            { name: 'Анна Петренко', role: 'Головний дизайнер Trails UA', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
            { name: 'Дмитро Шевченко', role: 'Senior Full-Stack Розробник', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
            { name: 'Софія Бойко', role: 'Керівник турботи про клієнтів 24/7', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
          ].map((m, idx) => (
            <div key={idx} style={teamCardStyle}>
              <img src={m.img} alt={m.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #DC9666', marginBottom: '14px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#291C0E', margin: '0 0 4px 0' }}>{m.name}</h4>
              <span style={{ fontSize: '12px', color: '#6E473B', fontWeight: 600 }}>{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const heroSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
  backgroundColor: '#E1D4C2',
  borderRadius: '28px',
  padding: '44px 36px',
};
const badgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '1px',
  color: '#DC9666',
  backgroundColor: '#F4ECE4',
  padding: '4px 10px',
  borderRadius: '10px',
  display: 'inline-block',
  marginBottom: '10px',
};
const heroHeadingStyle: React.CSSProperties = {
  fontSize: '34px',
  fontWeight: 800,
  color: '#291C0E',
  lineHeight: 1.2,
  margin: '0 0 16px 0',
};
const heroSubStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#6E473B',
  lineHeight: 1.6,
  marginBottom: '24px',
};
const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '12px 24px',
  borderRadius: '14px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 700,
  display: 'inline-block',
};
const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
  margin: '40px 0',
};
const statCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '24px',
  textAlign: 'center',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 16px rgba(41,28,14,0.04)',
};
const statNumStyle: React.CSSProperties = {
  fontSize: '36px',
  fontWeight: 800,
  color: '#DC9666',
  display: 'block',
  marginBottom: '4px',
};
const statLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#6E473B',
  fontWeight: 600,
};
const sectionTitleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#291C0E',
  textAlign: 'center',
  marginBottom: '28px',
};
const valuesGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
};
const valueCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '22px',
  padding: '30px 24px',
  border: '1px solid #E1D4C2',
  textAlign: 'center',
};
const iconCircleStyle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#F4ECE4',
  fontSize: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px auto',
};
const valueTitleStyle: React.CSSProperties = {
  fontSize: '17px',
  fontWeight: 800,
  color: '#291C0E',
  marginBottom: '8px',
};
const valueDescStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#6E473B',
  lineHeight: 1.6,
  margin: 0,
};
const teamCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '28px 20px',
  textAlign: 'center',
  border: '1px solid #E1D4C2',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};