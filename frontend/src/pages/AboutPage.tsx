import React from 'react';
import { useNavigate } from 'react-router-dom';

// ======================== SVG ІКОНКИ ========================
const MapPinIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const HomeIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UsersIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#291C0E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CompassIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif" }}>
      <div style={{ maxWidth: '1720px', margin: '0 auto', padding: '30px 40px 100px 40px' }}>
        
        {/* 1. HERO СЕКЦІЯ (ФІГМА: СТИЛІЗОВАНА РАМКА ТА ГАСЛО) */}
        <div style={heroWrapperStyle}>
          <div style={{ flex: '1.1', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 2 }}>
            <h1 style={heroBigTitleStyle}>
              Ми відкриваємо Україну для вас
            </h1>
            <p style={heroSubtextStyle}>
              TrailsUA - це не просто сервіс бронювання. Наша місія - зробити туризм безпечним та затишним, щоб кожен міг з комфортом побачити ще незвідані куточки нашої прекрасної країни.
            </p>
          </div>

          {/* Багатошарове фото шале зі зміщенням рамок */}
          <div style={heroPhotoWrapperStyle}>
            <div style={photoLayerBackStyle} />
            <div style={photoLayerMiddleStyle} />
            <div style={photoLayerTopStyle}>
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
                alt="Carpathian House"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* 2. ПОКАЗНИКИ ТА ДОСЯГНЕННЯ (3 КАРТКИ З FIGMA) */}
        <div style={milestonesRowStyle}>
          {/* Картка 1 */}
          <div style={milestoneCardStyle}>
            <div style={milestoneIconCircleStyle}>
              <MapPinIcon />
            </div>
            <div>
              <div style={milestoneNumberStyle}>120</div>
              <div style={milestoneLabelStyle}>локацій</div>
            </div>
          </div>

          {/* Картка 2 */}
          <div style={milestoneCardStyle}>
            <div style={milestoneIconCircleStyle}>
              <HomeIcon />
            </div>
            <div>
              <div style={milestoneNumberStyle}>175</div>
              <div style={milestoneLabelStyle}>помешкань</div>
            </div>
          </div>

          {/* Картка 3 */}
          <div style={milestoneCardStyle}>
            <div style={milestoneIconCircleStyle}>
              <UsersIcon />
            </div>
            <div>
              <div style={milestoneNumberStyle}>25</div>
              <div style={milestoneLabelStyle}>партнерів</div>
            </div>
          </div>
        </div>

        {/* 3. НАША ІСТОРІЯ */}
        <div style={storySectionStyle}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={sectionPreTitleStyle}>Наша історія</span>
            <h2 style={storyTitleStyle}>
              Як любов до Карпатських гір створила велику спільноту
            </h2>
            <p style={storyParagraphStyle}>
              Усе почалося з кількох подорожей у пошуках автентичних гуцульських хат. Ми хотіли відчути справжню тишу та єднання з природою. Коли ми зрозуміли, як важко самостійно знайти і забронювати такі місця, народилась ідея створити TrailsUA.
            </p>
            <p style={storyParagraphStyle}>
              Сьогодні ми єднаємо тисячі господарів та мандрівників по всій Україні, створюючи умови для екологічного та усвідомленого відпочинку з максимальною автентикою та затишком.
            </p>
          </div>

          <div style={{ flex: 1, height: '420px', borderRadius: '32px', overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80"
              alt="Our Story"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 4. НАШІ ЦІННОСТІ (ТЕМНИЙ БЛОК #6E473B) */}
        <div style={valuesSectionDarkStyle}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={sectionPreTitleStyle}>Наші цінності</span>
            <h2 style={valuesHeadingLightStyle}>На чому базується TrailsUA</h2>
          </div>

          <div style={valuesCardsRowStyle}>
            {/* Цінність 1 */}
            <div style={valueCardLightStyle}>
              <div style={valueIconBoxStyle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#291C0E" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <h3 style={valueCardTitleStyle}>Автентичність</h3>
              <p style={valueCardDescStyle}>
                Ми ретельно відбираємо помешкання, що мають унікальний локальний характер, історію та відображають регіональні традиції архітектури та побуту.
              </p>
            </div>

            {/* Цінність 2 */}
            <div style={valueCardLightStyle}>
              <div style={valueIconBoxStyle}>
                <ShieldIcon />
              </div>
              <h3 style={valueCardTitleStyle}>Безпека</h3>
              <p style={valueCardDescStyle}>
                Кожен хост проходить обов'язкову верифікацію нашою командою, а всі транзакції захищені. Ми піклуємось про спокійний сон наших мандрівників.
              </p>
            </div>

            {/* Цінність 3 */}
            <div style={valueCardLightStyle}>
              <div style={valueIconBoxStyle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#291C0E" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <h3 style={valueCardTitleStyle}>Підтримка громад</h3>
              <p style={valueCardDescStyle}>
                Спрямовуємо зусилля на розвиток віддалених туристичних локацій, залучаємо локальний бізнес та сприяємо збереженню культурної спадщини.
              </p>
            </div>
          </div>
        </div>

        {/* 5. НАША КОМАНДА */}
        <div style={{ marginTop: '70px', marginBottom: '70px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            <span style={sectionPreTitleStyle}>Наша команда</span>
            <h2 style={teamHeadingStyle}>Люди, які створюють магію</h2>
          </div>

          <div style={teamGridStyle}>
            {[
              {
                name: 'Максим Ковальчук',
                role: 'Співзасновник / СЕО',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
              },
              {
                name: 'Олена Петренко',
                role: 'Директор з розвитку',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
              },
              {
                name: 'Дмитро Смирнов',
                role: 'Керівник сервісу підтримки',
                img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
              },
              {
                name: 'Софія Бойко',
                role: 'Куратор автентичного житла',
                img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
              },
            ].map((member, idx) => (
              <div key={idx} style={teamCardStyle}>
                <div style={teamCardPhotoWrapperStyle}>
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={teamMemberNameStyle}>{member.name}</div>
                  <div style={teamMemberRoleStyle}>{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. ПАРТНЕРИ (#6E473B) */}
        <div style={partnersBannerStyle}>
          <span style={sectionPreTitleStyle}>Наші надійні партнери</span>
          <div style={partnersListStyle}>
            <span>Дія.Бізнес</span>
            <span>Карпатський Фонд</span>
            <span>Visit Ukraine</span>
            <span>Спілка Хостів</span>
            <span>U-Travel</span>
          </div>
        </div>

        {/* 7. ФІНАЛЬНИЙ СЕКЦІЙНИЙ CTA-БАННЕР З КОМПАСОМ */}
        <div style={finalCtaBannerStyle}>
          {/* Кругла іконка компаса на верхній грані */}
          <div style={compassIconWrapperStyle}>
            <CompassIcon />
          </div>

          <h2 style={ctaHeadingStyle}>
            Готові розпочати свою наступну автентичну історію?
          </h2>
          <p style={ctaSubtextStyle}>
            Приєднуйтесь до нашої великої спільноти мандрівників та хостів. Знайдіть своє ідеальне місце сили вже сьогодні.
          </p>

          <button
            style={ctaActionBtnStyle}
            onClick={() => navigate('/routes')}
          >
            Приєднуйтесь до TrailsUA
          </button>
        </div>

      </div>
    </div>
  );
};

// ======================= СТИЛІ FIGMA =======================

const heroWrapperStyle: React.CSSProperties = {
  backgroundColor: '#D7C7B1',
  borderRadius: '40px',
  outline: '12px solid #6E473B',
  padding: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '40px',
  marginBottom: '60px',
  boxSizing: 'border-box',
};

const heroBigTitleStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '48px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 900,
  textTransform: 'uppercase',
  lineHeight: '1.2',
  margin: 0,
};

const heroSubtextStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '22px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 500,
  lineHeight: '32px',
  margin: 0,
};

const heroPhotoWrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '560px',
  height: '380px',
  flexShrink: 0,
};

const photoLayerBackStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: '16px',
  left: '16px',
  backgroundColor: '#E1D4C2',
  borderRadius: '36px',
};

const photoLayerMiddleStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: '8px',
  left: '8px',
  backgroundColor: '#DC9666',
  borderRadius: '36px',
};

const photoLayerTopStyle: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: '0',
  left: '0',
  borderRadius: '36px',
  overflow: 'hidden',
  border: '3px solid #6E473B',
};

// ПОКАЗНИКИ
const milestonesRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '24px',
  marginBottom: '64px',
};

const milestoneCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  outline: '2px solid #E7D8C5',
  padding: '36px 32px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.06)',
};

const milestoneIconCircleStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  backgroundColor: '#DC9666',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const milestoneNumberStyle: React.CSSProperties = {
  color: '#DC9666',
  fontSize: '76px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  lineHeight: '1',
};

const milestoneLabelStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '22px',
  fontWeight: 700,
};

// ІСТОРІЯ
const storySectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '50px',
  marginBottom: '70px',
};

const sectionPreTitleStyle: React.CSSProperties = {
  color: '#DC9666',
  fontSize: '15px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const storyTitleStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '40px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  lineHeight: '48px',
  margin: 0,
};

const storyParagraphStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '16px',
  lineHeight: '26px',
  margin: 0,
};

// ЦІННОСТІ
const valuesSectionDarkStyle: React.CSSProperties = {
  backgroundColor: '#6E473B',
  borderRadius: '36px',
  padding: '70px 60px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  marginBottom: '70px',
};

const valuesHeadingLightStyle: React.CSSProperties = {
  color: '#E1D4C2',
  fontSize: '46px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  margin: 0,
};

const valuesCardsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
};

const valueCardLightStyle: React.CSSProperties = {
  backgroundColor: '#E1D4C2',
  borderRadius: '24px',
  outline: '1px solid #D7C7B1',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const valueIconBoxStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  backgroundColor: '#DC9666',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const valueCardTitleStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '24px',
  fontWeight: 700,
  margin: 0,
};

const valueCardDescStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '14px',
  lineHeight: '22px',
  margin: 0,
};

// КОМАНДА
const teamHeadingStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '46px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  margin: 0,
};

const teamGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '24px',
};

const teamCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  outline: '2px solid #D7C7B1',
  overflow: 'hidden',
  boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
};

const teamCardPhotoWrapperStyle: React.CSSProperties = {
  width: '100%',
  height: '260px',
  overflow: 'hidden',
};

const teamMemberNameStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '4px',
};

const teamMemberRoleStyle: React.CSSProperties = {
  color: '#DC9666',
  fontSize: '14px',
  fontWeight: 700,
};

// ПАРТНЕРИ
const partnersBannerStyle: React.CSSProperties = {
  backgroundColor: '#6E473B',
  borderRadius: '24px',
  padding: '48px 40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '28px',
  marginBottom: '70px',
};

const partnersListStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '48px',
  flexWrap: 'wrap',
  color: '#E1D4C2',
  fontSize: '26px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
};

// ФІНАЛЬНИЙ CTA
const finalCtaBannerStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#DC9666',
  borderRadius: '32px',
  padding: '64px 40px 50px 40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '16px',
  boxShadow: '0px 18px 40px -12px rgba(0, 0, 0, 0.1)',
};

const compassIconWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-28px',
  width: '56px',
  height: '56px',
  backgroundColor: '#6E473B',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0px 10px 22px -10px rgba(0, 0, 0, 0.15)',
};

const ctaHeadingStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '38px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  margin: 0,
  maxWidth: '800px',
};

const ctaSubtextStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '16px',
  maxWidth: '620px',
  margin: '0 0 16px 0',
};

const ctaActionBtnStyle: React.CSSProperties = {
  padding: '16px 36px',
  backgroundColor: '#6E473B',
  color: '#FFFFFF',
  borderRadius: '100px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.3)',
};