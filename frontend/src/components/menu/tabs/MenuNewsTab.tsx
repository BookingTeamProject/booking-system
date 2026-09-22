import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BLOG_POSTS  } from '../../../data/mockData';

export const MenuNewsTab: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Усі статті');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [emailInput, setEmailInput] = useState<string>('');

  const featuredPost = MOCK_BLOG_POSTS[0];

  const categoriesList = [
    { label: 'Усі статті', count: 24 },
    { label: 'Подорожі', count: 12 },
    { label: 'Поради', count: 6 },
    { label: 'Оновлення платформи', count: 4 },
    { label: 'Регіони України', count: 8 },
  ];

  const filteredPosts = MOCK_BLOG_POSTS.slice(1).filter((post) => {
    if (selectedCategory === 'Усі статті') return true;
    if (selectedCategory === 'Оновлення платформи') return post.category === 'Оновлення';
    return post.category === selectedCategory;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    alert('🎉 Дякуємо за підписку на новини TrailsUA!');
    setEmailInput('');
  };

  return (
    <div style={styles.container}>
      {/* 1. ЗАГОЛОВОК СТОРІНКИ З ТЕРАКОТОВОЮ ЛІНІЄЮ */}
      <header style={styles.headerBlock}>
        <h1 style={styles.mainHeadingAlegreya}>Блог та корисні статті</h1>
        <div style={styles.terracottaBar} />
      </header>

      {/* 2. ГОЛОВНА СТАТТЯ (FEATURED HERO CARD) З FIGMA */}
      <div
        onClick={() => navigate(`/news/${featuredPost.id}`)}
        style={styles.featuredCard}
      >
        <img
          src={featuredPost.thumbnail}
          alt={featuredPost.title}
          style={styles.featuredThumbImg}
        />

        <div style={styles.featuredBodyCol}>
          <div style={styles.featuredMetaGroup}>
            <div style={styles.tagPill}>{featuredPost.category}</div>
            <h2 style={styles.featuredTitleAlegreya}>{featuredPost.title}</h2>
            <p style={styles.featuredDescText}>{featuredPost.excerpt}</p>
          </div>

          <div style={styles.featuredFooterRow}>
            <span style={styles.metaTimeText}>{featuredPost.date} • {featuredPost.readTime}</span>
            <span style={styles.readArticleLink}>Читати статтю →</span>
          </div>
        </div>
      </div>

      {/* 3. ОСНОВНИЙ РОЗДІЛ: САЙДБАР КАТЕГОРІЙ + СІТКА СТАТЕЙ */}
      <div style={styles.layoutSplit}>
        {/* Лівий блок: Категорії та Промо для хостів */}
        <aside style={styles.sidebarCol}>
          {/* Панель категорій */}
          <div style={styles.categoryPanelCard}>
            <h3 style={styles.categoryPanelTitle}>Категорії</h3>
            <div style={styles.categoriesStack}>
              {categoriesList.map((cat) => {
                const isActive = selectedCategory === cat.label;
                return (
                  <div
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    style={styles.catItemRow}
                  >
                    <span
                      style={{
                        ...styles.catLabelText,
                        color: isActive ? '#DC9666' : '#6E473B',
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {cat.label}
                    </span>
                    <span style={styles.catCountBadge}>{cat.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Промо-банер "Маєте власне житло?" */}
          <div style={styles.promoBannerCard}>
            <h3 style={styles.promoTitleAlegreya}>Маєте власне житло?</h3>
            <p style={styles.promoDescText}>
              Додайте його на TrailsUA та почніть приймати мандрівників вже сьогодні.
            </p>
            <button
              type="button"
              onClick={() => navigate('/routes/create')}
              style={styles.btnBecomeHostPill}
            >
              Стати господарем
            </button>
          </div>
        </aside>

        {/* Правий блок: Сітка карток статей + Пагінація */}
        <div style={styles.postsSectionCol}>
          <div style={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/news/${post.id}`)}
                style={styles.postCard}
              >
                <img src={post.thumbnail} alt={post.title} style={styles.postThumbImg} />

                <div style={styles.postCardBody}>
                  <div style={styles.postTagPill}>{post.category}</div>
                  <h3 style={styles.postTitleAlegreya}>{post.title}</h3>
                  <p style={styles.postDescText}>{post.excerpt}</p>

                  <div style={styles.cardDividerLine} />

                  <div style={styles.postFooterMeta}>
                    {post.date.split(',')[0]} • {post.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагінація з Figma */}
          <div style={styles.paginationRow}>
            {[1, 2, 3].map((num) => {
              const isCurrent = currentPage === num;
              return (
                <div
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  style={isCurrent ? styles.pageNumActive : styles.pageNumDefault}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. БАННЕР РОЗСИЛКИ НОВИН З FIGMA */}
      <div style={styles.newsletterBanner}>
        <div style={styles.newsletterTextCol}>
          <h2 style={styles.newsletterHeadingAlegreya}>Будьте в курсі новин подорожей</h2>
          <p style={styles.newsletterSubText}>
            Щотижня ми ділимося автентичними знахідками та секретними локаціями по всій Україні. Жодного спаму.
          </p>
        </div>

        <form onSubmit={handleSubscribe} style={styles.newsletterForm}>
          <input
            type="email"
            required
            placeholder="Ваш Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            style={styles.newsletterInput}
          />
          <button type="submit" style={styles.btnSubscribePill}>
            Підписатися
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
    width: '100%',
  },
  headerBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mainHeadingAlegreya: {
    fontSize: '44px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
    margin: 0,
  },
  terracottaBar: {
    width: '320px',
    height: '6px',
    backgroundColor: '#DC9666',
    borderRadius: '50px',
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '32px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    display: 'flex',
    cursor: 'pointer',
    minHeight: '380px',
    flexWrap: 'wrap',
  },
  featuredThumbImg: {
    flex: '1 1 480px',
    height: '380px',
    objectFit: 'cover',
  },
  featuredBodyCol: {
    flex: '1 1 480px',
    padding: '36px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '20px',
    boxSizing: 'border-box',
  },
  featuredMetaGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  tagPill: {
    padding: '4px 14px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    color: 'white',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  featuredTitleAlegreya: {
    fontSize: '32px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#6E473B',
    lineHeight: '38px',
    margin: 0,
  },
  featuredDescText: {
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#A78D78',
    lineHeight: '25px',
    margin: 0,
  },
  featuredFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #D7C7B1',
  },
  metaTimeText: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  readArticleLink: {
    color: '#DC9666',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  layoutSplit: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  sidebarCol: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flexShrink: 0,
  },
  categoryPanelCard: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  categoryPanelTitle: {
    color: '#6E473B',
    fontSize: '18px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    margin: 0,
  },
  categoriesStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  catItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px 0',
  },
  catLabelText: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  catCountBadge: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif",
  },
  promoBannerCard: {
    padding: '24px',
    backgroundColor: '#6E473B',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  promoTitleAlegreya: {
    color: 'white',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  promoDescText: {
    color: 'white',
    opacity: 0.9,
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: '19px',
    margin: 0,
  },
  btnBecomeHostPill: {
    padding: '8px 16px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginTop: '6px',
  },
  postsSectionCol: {
    flex: '1 1 500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07), 0px 2px 6px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  postThumbImg: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  postCardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    justifyContent: 'space-between',
  },
  postTagPill: {
    padding: '2px 8px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '4px',
    color: '#DC9666',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    alignSelf: 'flex-start',
  },
  postTitleAlegreya: {
    color: '#6E473B',
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
    lineHeight: '24px',
  },
  postDescText: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '19px',
    margin: 0,
  },
  cardDividerLine: {
    height: '1px',
    backgroundColor: '#D7C7B1',
    width: '100%',
  },
  postFooterMeta: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  pageNumActive: {
    width: '40px',
    height: '40px',
    backgroundColor: '#DC9666',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  pageNumDefault: {
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    color: '#291C0E',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  newsletterBanner: {
    padding: '36px 48px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '2px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  },
  newsletterTextCol: {
    maxWidth: '540px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  newsletterHeadingAlegreya: {
    color: '#6E473B',
    fontSize: '28px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    margin: 0,
  },
  newsletterSubText: {
    color: '#A78D78',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '21px',
    margin: 0,
  },
  newsletterForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  newsletterInput: {
    width: '260px',
    height: '46px',
    padding: '0 18px',
    backgroundColor: '#FFFFFF',
    borderRadius: '100px',
    border: '1px solid #D7C7B1',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
    outline: 'none',
  },
  btnSubscribePill: {
    height: '46px',
    padding: '0 26px',
    backgroundColor: '#DC9666',
    borderRadius: '100px',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0px 10px 24px -8px rgba(194, 65, 12, 0.20)',
  },
};