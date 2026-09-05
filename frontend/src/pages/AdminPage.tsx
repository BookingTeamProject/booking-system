import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats] = useState({ totalUsers: 14, activeBookings: 8, totalRevenue: '84,200 ₴' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      // Демо-пользователи если бэкенд пустой
      setUsers([
        { id: '1', firstName: 'Олександр', lastName: 'Петренко', email: 'oleksandr@gmail.com', role: 'User', createdAt: '2026-08-10' },
        { id: '2', firstName: 'Анастасія', lastName: 'Приходько', email: 'anastasia@gmail.com', role: 'Landlord', createdAt: '2026-08-12' },
        { id: '3', firstName: 'Михайло', lastName: 'Романюк', email: 'misha@trails.ua', role: 'Moderator', createdAt: '2026-08-15' },
      ]);
    }
  };

  const handleRoleChange = async (userId: string, newRole: number) => {
    try {
      await api.put(`/admin/users/${userId}/role`, newRole);
      alert('Роль успішно змінено!');
      loadUsers();
    } catch (e) {
      alert('Роль оновлено локально');
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole === 3 ? 'Admin' : newRole === 2 ? 'Moderator' : newRole === 1 ? 'Landlord' : 'User' } : u));
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Ви впевнені, що хочете заблокувати/видалити цього користувача?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 24px 60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#291C0E', fontWeight: 800, margin: 0 }}>🛡️ Адміністративна панель</h1>
          <p style={{ color: '#6E473B', margin: '4px 0 0 0', fontSize: '14px' }}>Керування користувачами, модерацією контенту та аналітикою системи Trails UA.</p>
        </div>
        <span style={{ backgroundColor: '#BA2D2D', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: 700 }}>
          SuperAdmin
        </span>
      </div>

      {/* Метрики системы */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>Усього користувачів</span>
          <strong style={statValStyle}>{users.length || stats.totalUsers}</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>Активні бронювання</span>
          <strong style={statValStyle}>{stats.activeBookings}</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>Оборот платформи</span>
          <strong style={{ ...statValStyle, color: '#059669' }}>{stats.totalRevenue}</strong>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div style={tableCardStyle}>
        <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#291C0E' }}>Список користувачів платформи</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E1D4C2', color: '#6E473B', fontSize: '13px' }}>
              <th style={{ padding: '12px 8px' }}>Користувач</th>
              <th style={{ padding: '12px 8px' }}>Email</th>
              <th style={{ padding: '12px 8px' }}>Поточна роль</th>
              <th style={{ padding: '12px 8px' }}>Змінити роль</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F4ECE4', fontSize: '14px' }}>
                <td style={{ padding: '14px 8px', fontWeight: 600 }}>{u.firstName} {u.lastName}</td>
                <td style={{ padding: '14px 8px', color: '#6E473B' }}>{u.email}</td>
                <td style={{ padding: '14px 8px' }}>
                  <span style={getRoleBadgeStyle(u.role)}>{u.role}</span>
                </td>
                <td style={{ padding: '14px 8px' }}>
                  <select
                    defaultValue={u.role === 'Admin' ? 3 : u.role === 'Moderator' ? 2 : u.role === 'Landlord' ? 1 : 0}
                    onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                    style={selectStyle}
                  >
                    <option value={0}>Орендар (User)</option>
                    <option value={1}>Орендодавець (Landlord)</option>
                    <option value={2}>Модератор</option>
                    <option value={3}>Адміністратор</option>
                  </select>
                </td>
                <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                  <button onClick={() => handleDeleteUser(u.id)} style={deleteBtnStyle}>
                    🗑️ Заблокувати
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const statBoxStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '20px', border: '1px solid #E1D4C2', boxShadow: '0 4px 15px rgba(41,28,14,0.04)' };
const statLabelStyle: React.CSSProperties = { fontSize: '13px', color: '#A78D78', fontWeight: 600 };
const statValStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 800, color: '#291C0E', display: 'block', marginTop: '6px' };
const tableCardStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E1D4C2', boxShadow: '0 4px 18px rgba(41,28,14,0.04)' };
const selectStyle: React.CSSProperties = { padding: '6px 10px', borderRadius: '8px', border: '1px solid #BEB5A9', fontSize: '13px', outline: 'none' };
const deleteBtnStyle: React.CSSProperties = { padding: '6px 12px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' };
const getRoleBadgeStyle = (role: string): React.CSSProperties => ({
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 700,
  backgroundColor: role === 'Admin' ? '#FEE2E2' : role === 'Landlord' ? '#FEF3C7' : '#EFF6FF',
  color: role === 'Admin' ? '#DC2626' : role === 'Landlord' ? '#D97706' : '#2563EB',
});