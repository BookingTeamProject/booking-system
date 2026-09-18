import React, { useState } from 'react';

// ======================== SVG ІКОНКИ ========================
const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC9666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78D78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ======================== ДАНІ FAQ ========================
const FAQ_CATEGORIES = [
  {
    title: 'Загальні питання',
    faqs: [
      { q: 'Що таке TrailsUA і як це працює?', a: 'TrailsUA – це український сервіс для оренди автентичного житла. Ми поєднуємо мандрівників, які шукають унікальний досвід відпочинку, з перевіреними хостами в різних куточках України.' },
      { q: 'Як здійснюється верифікація помешкань?', a: 'Кожне помешкання проходить ручну модерацію нашими спеціалістами. Ми перевіряємо фотографії, документи на право власності та реальні координати житла.' },
      { q: 'Чи є якась прихована комісія?', a: 'Ні, ми працюємо максимально прозоро. Усі податки та збори вже включені у фінальну ціну, яку ви бачите на етапі бронювання.' }
    ]
  },
  {
    title: 'Бронювання',
    faqs: [
      { q: 'Як забронювати колибу або апартаменти?', a: "Оберіть вподобане житло, вкажіть дати та кількість гостей, після чого натисніть кнопку 'Забронювати'. Хост отримає сповіщення і підтвердить заявку протягом 2 годин." },
      { q: 'Які правила скасування бронювання?', a: 'Правила скасування встановлюються господарями: гнучкі (повернення за 24 години), помірні (за 5 днів) або суворі.' },
      { q: "Чи можу я зв'язатися з господарем до бронювання?", a: 'Так, ви можете скористатися вбудованим чатом на сторінці помешкання, щоб уточнити деталі зручностей або заселення.' }
    ]
  },
  {
    title: 'Оплата',
    faqs: [
      { q: 'Які способи оплати підтримуються?', a: 'Ми приймаємо картки будь-яких українських та закордонних банків, а також оплату через Apple Pay, Google Pay та Приват24.' },
      { q: 'Чи безпечно оплачувати через платформу?', a: 'Оплати захищені міжнародними стандартами безпеки. Ваші кошти заморожуються на транзитному рахунку і передаються хосту лише наступного дня після вашого успішного заселення.' },
      { q: 'Як отримати квитанцію про оплату?', a: "Квитанція автоматично надсилається на ваш Email одразу після транзакції, а також зберігається у вкладці 'Платежі' в особистому кабінеті." }
    ]
  },
  {
    title: 'Для хостів',
    faqs: [
      { q: 'Скільки коштує розміщення оголошення?', a: 'Розміщення оголошення абсолютно безкоштовне. Ми беремо лише комісію з успішних завершених бронювань (до 3%).' },
      { q: 'Які вимоги до житла для публікації?', a: 'Головна вимога — автентичність або унікальне розташування, високий рівень чистоти та наявність базових зручностей.' },
      { q: 'Як я буду отримувати виплати?', a: 'Кошти надходять на вашу гривневу банківську карту або рахунок ФОП протягом 24 годин після заселення гостя.' }
    ]
  },
  {
    title: 'Безпека',
    faqs: [
      { q: 'Що робити, якщо опис житла не відповідає дійсності?', a: 'Якщо при заселенні ви виявили значні невідповідності, терміново зв`яжіться з нашою підтримкою протягом перших 24 годин. Ми безкоштовно знайдемо альтернативу або повернемо 100% коштів.' },
      { q: 'Чи застраховане майно господарів?', a: 'Так, TrailsUA надає безкоштовну програму страхування майна хостів на суму до 500,000 ₴ від непередбачених пошкоджень під час перебування гостей.' },
      { q: 'Як працює служба безпеки під час військового стану?', a: 'Ми співпрацюємо з ДСНС та додаємо маркування про наявність укриттів поруч із кожним помешканням, а також надаємо мапу безпечних маршрутів.' }
    ]
  }
];

export const FAQPage: React.FC = () => {
  // Зберігаємо категорію та індекс відкритого запитання (формат: "categoryIndex-faqIndex")
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (categoryId: number, faqId: number) => {
    const id = `${categoryId}-${faqId}`;
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', fontFamily: "'Iosevka Charon', 'Manrope', sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px 100px 20px' }}>
        
        {/* HERO СЕКЦІЯ ТА ПОШУК */}
        <div style={heroSectionStyle}>
          <div style={iconWrapperStyle}>
            <MapPinIcon />
          </div>
          <h1 style={titleStyle}>Часті питання</h1>
          
          <div style={searchWrapperStyle}>
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Шукати в базі знань..." 
              style={searchInputStyle} 
            />
          </div>
        </div>

        {/* ОСНОВНИЙ КОНТЕНТ (ЛІВА ТА ПРАВА КОЛОНКИ) */}
        <div style={mainContentStyle}>
          
          {/* ЛІВА КОЛОНКА (КАТЕГОРІЇ ТА FAQ) */}
          <div style={leftColumnStyle}>
            {FAQ_CATEGORIES.map((category, catIdx) => (
              <div key={catIdx} style={{ marginBottom: '40px' }}>
                <h2 style={categoryTitleStyle}>{category.title}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {category.faqs.map((faq, faqIdx) => {
                    const isOpen = openId === `${catIdx}-${faqIdx}`;
                    
                    return (
                      <div 
                        key={faqIdx} 
                        style={faqCardStyle(isOpen)} 
                        onClick={() => toggleFaq(catIdx, faqIdx)}
                      >
                        <div style={faqHeaderStyle}>
                          <h4 style={faqQuestionStyle}>{faq.q}</h4>
                          <span style={faqIconStyle(isOpen)}>{isOpen ? '−' : '+'}</span>
                        </div>
                        {isOpen && (
                          <div style={faqAnswerStyle}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ПРАВА КОЛОНКА (САПОРТ-КАРТКА) */}
          <div style={rightColumnStyle}>
            <div style={supportCardStyle}>
              <div style={supportIconWrapperStyle}>
                <PhoneIcon />
              </div>
              <h3 style={supportCardTitleStyle}>Потрібна допомога?</h3>
              <p style={supportCardTextStyle}>
                Не знайшли відповіді на своє питання? Напишіть нам, і ми з радістю допоможемо вам вирішити будь-яку проблему.
              </p>
              <button style={supportBtnStyle}>
                Написати в сапорт
              </button>

              <div style={supportDividerStyle} />
              
              <div style={supportMetaStyle}>
                <span style={supportMetaLabelStyle}>Середній час відповіді:</span>
                <span style={supportMetaValueStyle}>2 хвилини</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// ======================= СТИЛІ =======================

const heroSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: '60px',
};

const iconWrapperStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  backgroundColor: '#F4ECE4',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  boxShadow: '0 4px 15px rgba(41,28,14,0.04)',
};

const titleStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '48px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 900,
  margin: '0 0 32px 0',
};

const searchWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: '100px',
  padding: '16px 24px',
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 8px 24px rgba(41, 28, 14, 0.05)',
  gap: '12px',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: '16px',
  color: '#291C0E',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
};

const mainContentStyle: React.CSSProperties = {
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start',
};

const leftColumnStyle: React.CSSProperties = {
  flex: 1,
};

const rightColumnStyle: React.CSSProperties = {
  width: '380px',
  position: 'sticky',
  top: '40px',
};

const categoryTitleStyle: React.CSSProperties = {
  color: '#6E473B',
  fontSize: '24px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 700,
  margin: '0 0 24px 0',
};

const faqCardStyle = (isOpen: boolean): React.CSSProperties => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  padding: '24px 32px',
  border: isOpen ? '2px solid #DC9666' : '2px solid #FFFFFF',
  boxShadow: '0 8px 24px rgba(41, 28, 14, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

const faqHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const faqQuestionStyle: React.CSSProperties = {
  color: '#291C0E',
  fontSize: '18px',
  fontWeight: 800,
  margin: 0,
};

const faqIconStyle = (isOpen: boolean): React.CSSProperties => ({
  color: isOpen ? '#DC9666' : '#A78D78',
  fontSize: '24px',
  fontWeight: 400,
  lineHeight: 1,
  transition: 'color 0.2s',
});

const faqAnswerStyle: React.CSSProperties = {
  marginTop: '16px',
  color: '#6E473B',
  fontSize: '15px',
  lineHeight: '1.6',
};

// Сапорт Картка
const supportCardStyle: React.CSSProperties = {
  backgroundColor: '#6E473B',
  borderRadius: '32px',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 16px 40px rgba(41, 28, 14, 0.1)',
};

const supportIconWrapperStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  backgroundColor: '#DC9666',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
};

const supportCardTitleStyle: React.CSSProperties = {
  color: '#E1D4C2',
  fontSize: '28px',
  fontFamily: "'Alegreya', serif",
  fontWeight: 800,
  margin: '0 0 16px 0',
};

const supportCardTextStyle: React.CSSProperties = {
  color: '#D7C7B1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px 0',
};

const supportBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#DC9666',
  color: '#FFFFFF',
  borderRadius: '16px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  marginBottom: '32px',
  boxShadow: '0 8px 24px rgba(220, 150, 102, 0.3)',
};

const supportDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#8B5A4B',
  width: '100%',
  marginBottom: '24px',
};

const supportMetaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const supportMetaLabelStyle: React.CSSProperties = {
  color: '#A78D78',
  fontSize: '14px',
};

const supportMetaValueStyle: React.CSSProperties = {
  color: '#DC9666',
  fontSize: '16px',
  fontWeight: 800,
};