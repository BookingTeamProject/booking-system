// src/pages/NewsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppData } from '../context/AppDataContext';

export const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { news } = useAppData();

  return (
    <div style={{ backgroundColor: '#E1D4C2', minHeight: '100vh', paddingTop: '30px' }}>
      
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#291C0E', margin: '0 0 10px 0' }}>
            📖 Блог та корисні статті
          </h1>
          <p style={{ color: '#6E473B', fontSize: '15px' }}>
            Натхнення, авторські маршрути, поради щодо вибору житла та секретні локації України.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {news.map((art) => (
            <div key={art.id} style={articleCardStyle} onClick={() => navigate(`/news/${art.id}`)}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img src={art.thumbnail} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#DC9666', fontWeight: 700, marginBottom: '8px' }}>
                    <span>{art.category}</span>
                    <span style={{ color: '#A78D78', fontWeight: 400 }}>{art.readTime}</span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#291C0E', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    {art.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6E473B', lineHeight: 1.6, margin: 0 }}>
                    {art.excerpt}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F4ECE4', paddingTop: '14px', marginTop: '16px', fontSize: '12px', color: '#A78D78' }}>
                  <span>✍️ {art.author}</span>
                  <span>📅 {art.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

const articleCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '22px',
  overflow: 'hidden',
  border: '1px solid #E1D4C2',
  boxShadow: '0 6px 20px rgba(41,28,14,0.05)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
};