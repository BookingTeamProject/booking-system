import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PromotionItem {
  id: string;
  routeId: string;
  title: string;
  region: 'all' | 'carpathians' | 'lviv' | 'odesa';
  location: string;
  discount: string;
  validUntil: string;
  couponCode: string;
  imageUrl: string;
}

const PROMOTIONS_DATA: PromotionItem[] = [
  {
    id: 'p1',
    routeId: '1',
    title: "Колиба 'Два Потоки'",
    region: 'carpathians',
    location: 'Яремче, Карпати',
    discount: '-20%',
    validUntil: '30 Червня 2026',
    couponCode: 'YAREMCHE20',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    routeId: '2',
    title: 'Пентхаус з видом на Оперу',
    region: 'lviv',
    location: 'Львів, Центр',
    discount: '-15%',
    validUntil: '15 Липня 2026',
    couponCode: 'LVIV15',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    routeId: '3',
    title: 'Villa Sunset & Sea Pool',
    region: 'odesa',
    location: 'Одеса, Фонтан',
    discount: '-25%',
    validUntil: '10 Червня 2026',
    couponCode: 'ODESSASEA',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p4',
    routeId: '4',
    title: 'Глемпінг «Купол у Хмарах»',
    region: 'carpathians',
    location: 'Верховина, Карпати',
    discount: '-20%',
    validUntil: '31 Серпня 2026',
    couponCode: 'SKYGLAMP',
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p5',
    routeId: '5',
    title: 'Старовинна садиба біля Ратуші',
    region: 'lviv',
    location: 'Львівщина, Жовква',
    discount: '-10%',
    validUntil: '20 Липня 2026',
    couponCode: 'OLDLVIV10',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p6',
    routeId: '1',
    title: 'Будинок «Морський Бриз»',
    region: 'odesa',
    location: 'Одещина, Затока',
    discount: '-30%',
    validUntil: '25 Червня 2026',
    couponCode: 'SEABREEZE',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
];

export const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'carpathians' | 'lviv' | 'odesa'>('all');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Копіювання промокоду в буфер обміну
  const handleCopyCoupon = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // Підписка на розсилку
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Будь ласка, введіть коректну електронну адресу.');
      return;
    }
    setIsSubscribed(true);
    setEmailInput('');
  };

  // Фільтрація карток
  const filteredPromos = PROMOTIONS_DATA.filter((item) =>
    selectedRegion === 'all' ? true : item.region === selectedRegion
  );

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif" }}>
      <div style={{ maxWidth: '1725px', margin: '0 auto', padding: '30px 40px 100px 40px' }}>
        
        {/* 1. HERO БАННЕР З FIGMA */}
        <div style={heroBannerContainerStyle}>
          <div style={heroContentBoxStyle}>
            <div style={heroBadgeStyle}>СЕЗОННА ПРОПОЗИЦІЯ</div>
            <h1 style={heroTitleStyle}>Карпатське літо: Знижки до -25%</h1>
            <p style={heroSubtextStyle}>
              Відчуйте літній затишок гір. Бронюйте верифіковані дерев’яні зруби та котеджі в Яремче, Микуличині чи Верховині за спеціальними цінами.
            </p>
          </div>
        </div>

        {/* 2. СЕКЦІЯ: АКТИВНІ ПРОПОЗИЦІЇ + ТАБИ РЕГІОНІВ */}
        <div style={{ marginTop: '56px', marginBottom: '32px' }}>
          <div style={sectionHeaderRowStyle}>
            <h2 style={sectionTitleStyle}>Активні пропозиції</h2>

            {/* Таби регіонів */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Усі регіони' },
                { id: 'carpathians', label: 'Карпати' },
                { id: 'lviv', label: 'Львівщина' },
                { id: 'odesa', label: 'Одещина' },
              ].map((tab) => {
                const isActive = selectedRegion === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedRegion(tab.id as any)}
                    style={{
                      ...regionTabBtnStyle,
                      backgroundColor: isActive ? '#DC9666' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#291C0E',
                      borderColor: isActive ? '#DC9666' : '#D7C7B1',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Сітка карток акцій */}
          <div style={promoCardsGridStyle}>
            {filteredPromos.map((promo) => {
              const isCopied = copiedCoupon === promo.couponCode;

              return (
                <div
                  key={promo.id}
                  style={promoCardStyle}
                  onClick={() => navigate(`/routes/${promo.routeId}`)}
                >
                  {/* Фото з бейджем знижки */}
                  <div style={{ ...promoPhotoWrapStyle, backgroundImage: `url(${promo.imageUrl})` }}>
                    <div style={discountTagStyle}>
                      {promo.discount}
                    </div>
                  </div>

                  {/* Тіло картки */}
                  <div style={promoBodyStyle}>
                    <div>
                      <div style={locationLabelStyle}>{promo.location}</div>
                      <h3 style={promoTitleStyle}>{promo.title}</h3>
                      <div style={validUntilStyle}>Діє до {promo.validUntil}</div>
                    </div>

                    {/* Блок купона */}
                    <div style={couponWrapStyle} onClick={(e) => e.stopPropagation()}>
                      <span style={couponCodeTextStyle}>{promo.couponCode}</span>
                      <button
                        style={{
                          ...copyBtnStyle,
                          color: isCopied ? '#059669' : '#DC9666',
                        }}
                        onClick={(e) => handleCopyCoupon(promo.couponCode, e)}
                      >
                        {isCopied ? 'СКОПІЙОВАНО! ✓' : 'КОПІЮВАТИ'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. БАННЕР РОЗСИЛКИ "ОТРИМУЙТЕ СЕКРЕТНІ ЗНИЖКИ" */}
        <div style={newsletterBannerStyle}>
          <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={newsletterTitleStyle}>Отримуйте секретні знижки</h3>
            <p style={newsletterDescriptionStyle}>
              Ми надсилаємо ексклюзивні пропозиції з обмеженим терміном дії лише для підписників нашої розсилки.
            </p>
          </div>

          {isSubscribed ? (
            <div style={subscribedSuccessBoxStyle}>
              🎉 Дякуємо! Ви успішно підписалися на секретні знижки.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={newsletterFormStyle}>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Введіть ваш Email"
                style={newsletterInputStyle}
              />
              <button type="submit" style={newsletterSubmitBtnStyle}>
                Підписатися
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

// ======================= СТИЛІ FIGMA =======================

const heroBannerContainerStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '400px',
  borderRadius: '32px',
  overflow: 'hidden',
  position: 'relative',
  backgroundImage:
    'linear-gradient(0deg, rgba(44, 27, 2, 0.55) 0%, rgba(44, 27, 2, 0.55) 100%), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1725&q=85)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  padding: '64px',
  boxSizing: 'border-box',
};

const heroContentBoxStyle: React.CSSProperties = {
  maxWidth: '740px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const heroBadgeStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: 700,
  padding: '6px 14px',
  borderRadius: '8px',
  letterSpacing: '0.05em',
  marginBottom: '18px',
};

const heroTitleStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '52px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  lineHeight: '58px',
  margin: '0 0 16px 0',
};

const heroSubtextStyle: React.CSSProperties = {
  color: '#FFFFFF',
  opacity: 0.9,
  fontSize: '16px',
  lineHeight: '26px',
  margin: 0,
  fontWeight: 400,
};

const sectionHeaderRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '28px',
};

const sectionTitleStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '36px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  margin: 0,
};

const regionTabBtnStyle: React.CSSProperties = {
  padding: '8px 22px',
  borderRadius: '100px',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
  border: '1px solid',
  transition: 'all 0.2s ease',
};

const promoCardsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '24px',
};

const promoCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #D7C7B1',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 4px 16px rgba(41, 28, 14, 0.04)',
};

const promoPhotoWrapStyle: React.CSSProperties = {
  width: '100%',
  height: '220px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  padding: '16px',
  boxSizing: 'border-box',
};

const discountTagStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '12px',
  padding: '6px 14px',
  fontSize: '16px',
  fontWeight: 700,
  display: 'inline-block',
};

const promoBodyStyle: React.CSSProperties = {
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
  gap: '16px',
};

const locationLabelStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: '6px',
};

const promoTitleStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '24px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  margin: '0 0 8px 0',
};

const validUntilStyle: React.CSSProperties = {
  color: '#A78D78',
  fontSize: '13px',
};

const couponWrapStyle: React.CSSProperties = {
  backgroundColor: 'rgba(220, 150, 102, 0.15)',
  borderRadius: '12px',
  border: '1px solid #D7C7B1',
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const couponCodeTextStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '15px',
  fontWeight: 700,
  letterSpacing: '0.05em',
};

const copyBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  cursor: 'pointer',
  padding: 0,
};

// БАННЕР РОЗСИЛКИ
const newsletterBannerStyle: React.CSSProperties = {
  backgroundColor: '#6E473B',
  borderRadius: '32px',
  padding: '36px 48px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '24px',
  marginTop: '60px',
  boxSizing: 'border-box',
};

const newsletterTitleStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '32px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  margin: 0,
};

const newsletterDescriptionStyle: React.CSSProperties = {
  color: '#E1D4C2',
  fontSize: '15px',
  lineHeight: '22px',
  margin: 0,
};

const newsletterFormStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

const newsletterInputStyle: React.CSSProperties = {
  width: '280px',
  height: '46px',
  borderRadius: '100px',
  backgroundColor: '#FFFFFF',
  border: 'none',
  outline: 'none',
  padding: '0 20px',
  fontSize: '14px',
  color: '#291C0E',
};

const newsletterSubmitBtnStyle: React.CSSProperties = {
  height: '46px',
  padding: '0 28px',
  borderRadius: '100px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  border: 'none',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const subscribedSuccessBoxStyle: React.CSSProperties = {
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  padding: '12px 24px',
  borderRadius: '100px',
  fontSize: '14px',
  fontWeight: 700,
};