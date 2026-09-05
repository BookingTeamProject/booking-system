// src/pages/NewsDetailsPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_ARTICLES } from './NewsPage';

export const NewsDetailsPage: React.FC = () => {
  const { id } = useParams();
  const article = BLOG_ARTICLES.find((a) => a.id === id) || BLOG_ARTICLES[0];

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px 80px 20px' }}>
      <Link to="/news" style={{ color: '#6E473B', textDecoration: 'none', fontSize: '13px', fontWeight: 700, marginBottom: '20px', display: 'inline-block' }}>
        ← Назад до списку статей
      </Link>

      <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC9666', backgroundColor: '#F4ECE4', padding: '4px 12px', borderRadius: '10px' }}>
        {article.category}
      </span>

      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#291C0E', margin: '14px 0', lineHeight: 1.3 }}>
        {article.title}
      </h1>

      <div style={{ display: 'flex', gap: '16px', color: '#A78D78', fontSize: '13px', marginBottom: '24px' }}>
        <span>✍️ {article.author}</span>
        <span>•</span>
        <span>📅 {article.date}</span>
        <span>•</span>
        <span>⏳ {article.readTime}</span>
      </div>

      <div style={{ height: '380px', borderRadius: '24px', overflow: 'hidden', marginBottom: '32px' }}>
        <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ color: '#291C0E', fontSize: '16px', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p>
          Карпати — це не просто географічний регіон, це особливий стан душі. Щороку тисячі мандрівників відкривають для себе автентичні стежки, що пролягають смерековими лісами, полонинами та скелястими вершинами Чорногори і Ґорґан.
        </p>

        <div style={{ backgroundColor: '#F4ECE4', padding: '24px', borderRadius: '18px', borderLeft: '4px solid #DC9666' }}>
          <strong style={{ fontSize: '17px', color: '#291C0E', display: 'block', marginBottom: '6px' }}>
            Порада від команди Trails UA:
          </strong>
          <span style={{ fontSize: '14px', color: '#6E473B' }}>
            Бронюйте житло з чаном заздалегідь — у вихідні дні попит зростає на 80%. Найкращий час для релаксу в чані — після заходу сонця під відкритим карпатським небом.
          </span>
        </div>

        <p>
          Обираючи помешкання на платформі Trails UA, ви підтримуєте місцевих господарів та отримуєте перевірений сервіс із гарантією затишку та чистоти.
        </p>
      </div>
    </div>
  );
};