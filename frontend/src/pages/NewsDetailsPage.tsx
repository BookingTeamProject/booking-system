import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import {
  MOCK_BLOG_POSTS,
  MOCK_POPULAR_ARTICLES,
  type BlogPost,
} from '../data/mockData';

export const NewsDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useSettings();

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const article: BlogPost =
    MOCK_BLOG_POSTS.find((p) => p.id === id) || MOCK_BLOG_POSTS[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    alert('🎉 Дякуємо! Ви підписалися на секретні маршрути.');
    setNewsletterEmail('');
  };

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', fontFamily: "'Iosevka Charon', sans-serif" }}>
      
      {/* 1. ПОЛОВИННИЙ HERO-БАННЕР СТАТТІ З FIGMA */}
      <div
        style={{
          ...styles.articleHero,
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 100%), url(${article.heroImage})`,
        }}
      >
        <div style={styles.heroMetaWrap}>
          <div style={styles.categoryBadgeTag}>Приховані Перлини</div>
          <h1 style={styles.articleHeroTitleAlegreya}>{article.title}</h1>

          <div style={styles.authorDateReadRow}>
            <div style={styles.authorFlex}>
              <img src={article.authorAvatar} alt={article.author} style={styles.authorAvatar32} />
              <span style={styles.authorNameText}>{article.author}</span>
            </div>

            <div style={styles.metaDividerLine} />
            <div style={styles.pubDateText}>{article.date}</div>
            <div style={styles.metaDividerLine} />

            <div style={styles.readTimeFlex}>
              <ClockIcon />
              <span style={styles.pubDateText}>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ТІЛО СТОРІНКИ: ОСНОВНИЙ ТЕКСТ + ПРАВИЙ САЙДБАР З FIGMA */}
      <div style={styles.articleBodyContainer}>
        {/* ЛІВА КОЛОНКА З ТЕКСТОМ СТАТТІ (1283px) */}
        <div style={styles.mainContentColumn}>
          {/* Вступний абзац */}
          <p style={styles.introParagraph}>{article.excerpt}</p>
          <div style={styles.horizontalDivider} />

          {/* Секція 1 */}
          <section style={styles.articleSection}>
            <h2 style={styles.subheadAlegreya}>1. Атмосфера без натовпів</h2>
            <p style={styles.bodyText}>
              Щоб відчути справжні Карпати, варто уникати популярних туристичних точок. Замість цього
              оберіть невеликі села, де місцеві мешканці із задоволенням підкажуть найзатишніші колиби
              та домашні садиби. Тут ви скуштуєте автентичні страви — банош із бринзою, грибну юшку
              чи запашний трав’яний чай. Вечір можна провести біля каміну, слухаючи історії про гірські
              легенди та традиції. Такий початок подорожі подарує відчуття справжньої гостинності й тепла.
            </p>
          </section>

          {/* Вбудована фотографія з підписом */}
          <div style={styles.inlineImageBlock}>
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
              alt="Карпатський притулок"
              style={styles.inlineImg}
            />
            <div style={styles.imageCaptionText}>
              Затишний дерев&apos;яний притулок на схилі у золотавих променях ранкового сонця.
            </div>
          </div>

          {/* Цитата в рамці (Pull Quote) */}
          <div style={styles.pullQuoteBox}>
            <div style={styles.quoteTextItalic}>
              «Гори не люблять поспіху. Вони відкривають свою справжню красу та таємні стежки лише тим
              мандрівникам, хто вміє зупинитися і слухати шепіт осіннього вітру.»
            </div>
          </div>

          {/* Секція 2 */}
          <section style={styles.articleSection}>
            <h2 style={styles.subheadAlegreya}>2. Дикі стежки Чорногори</h2>
            <p style={styles.bodyText}>
              Другий день присвятіть активному відпочинку. Вирушайте на менш відомі маршрути Чорногори,
              де відкриваються панорамні краєвиди без туристичного шуму. Тут ви знайдете дикі стежки,
              кришталеві потоки та мальовничі полонини, які дарують відчуття свободи й пригоди. Похід
              можна завершити на вершині з видом на гірські хребти, а після — повернутися до колиби,
              щоб відновити сили смачними стравами та теплим прийомом господарів.
            </p>
          </section>

          <div style={styles.horizontalDivider} />

          {/* Блок "Забронювати затишок поруч" (3 картки житла) */}
          <section style={styles.relatedDestinationsSection}>
            <h2 style={styles.relatedTitleAlegreya}>Забронювати затишок поруч</h2>

            <div style={styles.relatedCardsRow}>
              {[
                {
                  id: 'rel-1',
                  title: 'Шале у Карпатах',
                  location: 'Яремче, Україна',
                  price: 2628,
                  img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80',
                },
                {
                  id: 'rel-2',
                  title: 'Апартаменти Left',
                  location: 'Івано-Франківськ, Україна',
                  price: 4732,
                  img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=500&q=80',
                },
                {
                  id: 'rel-3',
                  title: 'Котедж Amalia',
                  location: 'Чернівці, Україна',
                  price: 3496,
                  img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80',
                },
              ].map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => navigate('/routes')}
                  style={styles.destCard}
                >
                  <img src={dest.img} alt={dest.title} style={styles.destImg} />
                  <div style={styles.destBody}>
                    <div style={styles.destTitleText}>{dest.title}</div>
                    <div style={styles.destLocText}>{dest.location}</div>
                    <div style={styles.destPriceText}>{formatPrice(dest.price)}</div>
                    <span style={styles.destLinkDetails}>Дивитися деталі →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ПРАВИЙ САЙДБАР З FIGMA (407px) */}
        <aside style={styles.articleRightSidebar}>
          {/* Віджет "Популярне зараз" */}
          <div style={styles.popularArticlesWidget}>
            <h3 style={styles.widgetTitleAlegreya}>Популярне зараз</h3>
            <div style={styles.horizontalDivider} />

            <div style={styles.popularListCol}>
              {MOCK_POPULAR_ARTICLES.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && <div style={styles.horizontalDivider} />}
                  <div
                    onClick={() => navigate('/news/1')}
                    style={styles.popularItemRow}
                  >
                    <img src={item.thumbnail} alt={item.title} style={styles.popularThumb80} />
                    <div style={styles.popularTextCol}>
                      <span style={styles.popularTagPill}>{item.tag}</span>
                      <span style={styles.popularHeadline}>{item.title}</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Віджет розсилки "ЛИСТИ З ДОРІГ" */}
          <div style={styles.newsletterWidgetBox}>
            <div style={styles.newsWidgetTag}>ЛИСТИ З ДОРІГ</div>
            <h3 style={styles.newsWidgetTitleAlegreya}>Отримуйте секретні маршрути першими</h3>
            <p style={styles.newsWidgetDesc}>
              Раз на тиждень ділимося унікальними локаціями та промокодами на проживання.
            </p>

            <form onSubmit={handleNewsletterSubmit} style={styles.newsWidgetForm}>
              <input
                type="email"
                required
                placeholder="Ваш e-mail"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={styles.newsWidgetInput}
              />
              <button type="submit" style={styles.newsWidgetBtnSubmit}>
                Підписатися
              </button>
            </form>
          </div>

          {/* Промо-банер "ОСІННЯ ВТЕЧА -20%" */}
          <div style={styles.promoBannerSquare}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={styles.promoTagWhite}>ОСІННЯ ВТЕЧА</span>
              <h3 style={styles.promoHeadlineWhite}>Знижки до -20% на затишні будиночки</h3>
            </div>

            <button
              type="button"
              onClick={() => navigate('/routes')}
              style={styles.btnBookNowWhite}
            >
              Забронювати зараз
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

// SVG Іконка годинника
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const styles: Record<string, React.CSSProperties> = {
  articleHero: {
    width: '100%',
    minHeight: '520px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '60px 40px',
    boxSizing: 'border-box',
  },
  heroMetaWrap: {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  categoryBadgeTag: {
    padding: '6px 14px',
    backgroundColor: '#DC9666',
    borderRadius: '4px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  articleHeroTitleAlegreya: {
    color: '#FFFFFF',
    fontSize: '48px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    lineHeight: '56px',
    margin: 0,
    maxWidth: '1000px',
  },
  authorDateReadRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  authorFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  authorAvatar32: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    objectFit: 'cover',
  },
  authorNameText: {
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
  },
  metaDividerLine: {
    width: '16px',
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  pubDateText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '15px',
  },
  readTimeFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  articleBodyContainer: {
    maxWidth: '1720px',
    margin: '0 auto',
    padding: '48px 40px 100px 40px',
    display: 'flex',
    gap: '40px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  mainContentColumn: {
    flex: '1 1 800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
  },
  introParagraph: {
    color: '#6E473B',
    fontSize: '18px',
    lineHeight: '28px',
    margin: 0,
    fontWeight: 400,
  },
  horizontalDivider: {
    height: '1px',
    backgroundColor: '#D7C7B1',
    width: '100%',
  },
  articleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  subheadAlegreya: {
    color: '#291C0E',
    fontSize: '32px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  bodyText: {
    color: '#6E473B',
    fontSize: '17px',
    lineHeight: '28px',
    margin: 0,
  },
  inlineImageBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  inlineImg: {
    width: '100%',
    height: '460px',
    borderRadius: '16px',
    objectFit: 'cover',
  },
  imageCaptionText: {
    textAlign: 'center',
    color: '#6E473B',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  pullQuoteBox: {
    padding: '24px 30px',
    backgroundColor: '#6E473B',
    borderRadius: '16px',
    border: '2px solid #DC9666',
  },
  quoteTextItalic: {
    color: '#FFFFFF',
    fontSize: '20px',
    fontStyle: 'italic',
    lineHeight: '28px',
  },
  relatedDestinationsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  relatedTitleAlegreya: {
    color: '#291C0E',
    fontSize: '28px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  relatedCardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  destCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid #D7C7B1',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(41,28,14,0.04)',
    display: 'flex',
    flexDirection: 'column',
  },
  destImg: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  destBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  destTitleText: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#6E473B',
  },
  destLocText: {
    fontSize: '14px',
    color: '#A78D78',
  },
  destPriceText: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#DC9666',
    marginTop: '6px',
  },
  destLinkDetails: {
    color: '#6E473B',
    fontSize: '14px',
    fontWeight: 700,
    marginTop: '4px',
  },

  // ПРАВИЙ САЙДБАР
  articleRightSidebar: {
    width: '407px',
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
    flexShrink: 0,
  },
  popularArticlesWidget: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  widgetTitleAlegreya: {
    fontSize: '22px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  popularListCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  popularItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
  },
  popularThumb80: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  popularTextCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  popularTagPill: {
    color: '#DC9666',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  popularHeadline: {
    color: '#6E473B',
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: '20px',
  },
  newsletterWidgetBox: {
    padding: '28px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  newsWidgetTag: {
    color: '#DC9666',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  newsWidgetTitleAlegreya: {
    color: '#291C0E',
    fontSize: '24px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  newsWidgetDesc: {
    color: '#6E473B',
    fontSize: '14px',
    lineHeight: '20px',
    margin: 0,
  },
  newsWidgetForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '6px',
  },
  newsWidgetInput: {
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    fontSize: '14px',
    color: '#291C0E',
    outline: 'none',
  },
  newsWidgetBtnSubmit: {
    padding: '14px',
    backgroundColor: '#DC9666',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  promoBannerSquare: {
    height: '340px',
    padding: '32px',
    borderRadius: '16px',
    backgroundImage:
      'linear-gradient(0deg, rgba(27, 46, 36, 0.75) 0%, rgba(27, 46, 36, 0.5) 100%), url(https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
  },
  promoTagWhite: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  promoHeadlineWhite: {
    color: 'white',
    fontSize: '26px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    lineHeight: '32px',
    margin: 0,
  },
  btnBookNowWhite: {
    padding: '12px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: 'none',
    color: '#291C0E',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};