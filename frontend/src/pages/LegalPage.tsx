// src/pages/LegalPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const LegalPage: React.FC = () => {
  const { docType } = useParams<{ docType?: string }>();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cancellation' | 'consent' | 'cookie'>(
    (docType as any) || 'privacy'
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 24px 80px 24px', display: 'flex', gap: '30px' }}>
      {/* Боковое меню юридических документов */}
      <div style={sidebarStyle}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#291C0E', padding: '16px 14px 10px 14px', margin: 0 }}>
          ЗМІСТ ДОКУМЕНТУ
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 8px 14px 8px' }}>
          <button style={activeTab === 'privacy' ? activeDocBtnStyle : docBtnStyle} onClick={() => setActiveTab('privacy')}>
            1. Політика конфіденційності
          </button>
          <button style={activeTab === 'terms' ? activeDocBtnStyle : docBtnStyle} onClick={() => setActiveTab('terms')}>
            2. Умови користування
          </button>
          <button style={activeTab === 'cancellation' ? activeDocBtnStyle : docBtnStyle} onClick={() => setActiveTab('cancellation')}>
            3. Політика скасування
          </button>
          <button style={activeTab === 'consent' ? activeDocBtnStyle : docBtnStyle} onClick={() => setActiveTab('consent')}>
            4. Згода на обробку даних
          </button>
          <button style={activeTab === 'cookie' ? activeDocBtnStyle : docBtnStyle} onClick={() => setActiveTab('cookie')}>
            5. Політика файлів cookie
          </button>
        </div>
      </div>

      {/* Текст документа */}
      <div style={docContentBoxStyle}>
        {activeTab === 'privacy' && (
          <div>
            <h1 style={docHeaderStyle}>Політика конфіденційності</h1>
            <p style={updateDateStyle}>Останнє оновлення: 15 серпня 2026 року</p>
            <div style={textParagraphStyle}>
              <h3>1. Загальні положення</h3>
              <p>Ця Політика конфіденційності регулює порядок збору, обробки, використання та захисту персональних даних користувачів платформи «Trails UA». Ми поважаємо ваше право на приватність та захищаємо ваші дані відповідно до Закону України «Про захист персональних даних» та стандартів GDPR.</p>
              <h3>2. Які дані ми збираємо</h3>
              <p>Ми збираємо ваше ім'я, номер телефону, email, історію бронювань та платіжні дані, необхідні для успішного заселення у помешкання або отримання авторського маршруту.</p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <h1 style={docHeaderStyle}>Умови користування сервісом</h1>
            <p style={updateDateStyle}>Останнє оновлення: 01 серпня 2026 року</p>
            <div style={textParagraphStyle}>
              <h3>1. Прийняття умов</h3>
              <p>Реєструючись на платформі Trails UA, ви підтверджуєте досягнення 18-річного віку та повну згоду з правилами безпечного проживання у садибах.</p>
              <h3>2. Відповідальність сторін</h3>
              <p>Орендодавець зобов'язується надати помешкання у стані, заявленому в оголошенні, а орендар — дотримуватись правил пожежної безпеки та тиші.</p>
            </div>
          </div>
        )}

        {activeTab === 'cancellation' && (
          <div>
            <h1 style={docHeaderStyle}>Політика скасування та повернення коштів</h1>
            <p style={updateDateStyle}>Останнє оновлення: 10 серпня 2026 року</p>
            <div style={textParagraphStyle}>
              <h3>1. Гнучка політика (Flexible)</h3>
              <p>100% повернення коштів при скасуванні не пізніше ніж за 24 години до дати заїзду.</p>
              <h3>2. Помірна політика (Moderate)</h3>
              <p>100% повернення коштів за 5 днів до заїзду (за вирахуванням сервісного збору 5%).</p>
              <h3>3. Сувора політика (Strict)</h3>
              <p>50% повернення коштів при скасуванні за 7 днів до заїзду.</p>
            </div>
          </div>
        )}

        {activeTab === 'consent' && (
          <div>
            <h1 style={docHeaderStyle}>Згода на обробку персональних даних</h1>
            <div style={textParagraphStyle}>
              <p>Користувач надає беззастережну згоду сервісу Trails UA на збір, систематизацію та збереження персональних даних виключно з метою надання туристичних послуг та зв'язку з господарями.</p>
            </div>
          </div>
        )}

        {activeTab === 'cookie' && (
          <div>
            <h1 style={docHeaderStyle}>Політика використання файлів Cookie</h1>
            <div style={textParagraphStyle}>
              <p>Ми використовуємо необхідні, аналітичні та маркетингові cookie для збереження ваших авторизаційних сесій та надання персоналізованих рекомендацій житла в Карпатах.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const sidebarStyle: React.CSSProperties = {
  width: '300px',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 4px 18px rgba(41,28,14,0.04)',
  height: 'fit-content',
};
const docBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: 'none',
  background: 'none',
  textAlign: 'left',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#6E473B',
  cursor: 'pointer',
};
const activeDocBtnStyle: React.CSSProperties = {
  ...docBtnStyle,
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontWeight: 700,
};
const docContentBoxStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '36px',
  border: '1px solid #E1D4C2',
  boxShadow: '0 6px 20px rgba(41,28,14,0.04)',
};
const docHeaderStyle: React.CSSProperties = { fontSize: '26px', fontWeight: 800, color: '#291C0E', margin: '0 0 6px 0' };
const updateDateStyle: React.CSSProperties = { fontSize: '13px', color: '#A78D78', marginBottom: '24px' };
const textParagraphStyle: React.CSSProperties = { fontSize: '14px', color: '#291C0E', lineHeight: 1.8 };