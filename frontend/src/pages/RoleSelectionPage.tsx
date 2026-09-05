import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = async (roleNum: number) => {
    try {
      // Обновляем роль пользователя
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        user.role = roleNum === 1 ? 'Landlord' : 'User';
        localStorage.setItem('user', JSON.stringify(user));
      }
      navigate('/profile');
    } catch (e) {
      navigate('/profile');
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏔️ TrailsUA</div>
        <h2 style={{ fontSize: '26px', color: '#291C0E', fontWeight: 800, marginBottom: '8px' }}>Оберіть вашу роль</h2>
        <p style={{ color: '#6E473B', fontSize: '14px', marginBottom: '32px' }}>
          Як ви плануєте використовувати платформу Trails UA?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Роль: Орендар */}
          <div style={roleBoxStyle} onClick={() => handleSelectRole(0)}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎒</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E', margin: '0 0 8px 0' }}>Орендар</h3>
            <p style={{ color: '#7a6a5d', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              Шукайте затишне житло в Карпатах, бронюйте шале та відкривайте незабутні туристичні маршрути.
            </p>
            <button style={roleBtnStyle}>Продовжити як орендар</button>
          </div>

          {/* Роль: Орендодавець */}
          <div style={roleBoxStyle} onClick={() => handleSelectRole(1)}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏡</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#291C0E', margin: '0 0 8px 0' }}>Орендодавець</h3>
            <p style={{ color: '#7a6a5d', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              Здавайте власні будиночки, глемпінги або створюйте авторські туристичні маршрути та екскурсії.
            </p>
            <button style={{ ...roleBtnStyle, backgroundColor: '#6E473B' }}>Стати орендодавцем</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const wrapperStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '40px 20px', backgroundColor: '#f7f2eb' };
const cardStyle: React.CSSProperties = { maxWidth: '800px', width: '100%', backgroundColor: '#F4ECE4', borderRadius: '24px', padding: '40px', textAlign: 'center', border: '2px solid #E1D4C2', boxShadow: '0 10px 30px rgba(41,28,14,0.06)' };
const roleBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #E1D4C2', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(41,28,14,0.04)' };
const roleBtnStyle: React.CSSProperties = { marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#DC9666', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' };