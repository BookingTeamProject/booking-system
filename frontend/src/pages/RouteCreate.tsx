import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export const RouteCreate: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFromData] = useState({
      title: '',
      description: '',
      location: '',
      distanceKm: 0,
      durationHours: 0,
      price: 0,
      categoryId: "a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab"
});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFromData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/routes', formData);
            navigate('/routes');
        } catch (error) {
            console.error(error);
            alert('Помилка створення маршруту.');
        }
    };

    return (
        <div style={{ padding: '20px', width: '60%', minWidth: '800px', textAlign: 'left', position: 'absolute', top: '40px', left: '40px'}}>
            <h2>Створення маршруту</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input name="title" type="text" placeholder="Назва маршруту" onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <textarea name="description" placeholder="Опис маршруту" onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }} />
        
              <input name="location" placeholder="Локація" onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />

              <label style={{ display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#555' }}>
                Категорія:
                <select name="categoryId" onChange={handleChange} required style={{ padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab">Пішохідний</option>
                  <option value="b7fea096-79c4-42be-84a4-7093db017b2d">Велосипедний</option>
                  <option value="4dc91d9e-9009-4695-8009-d5ad1a227ce0">Автомобільний</option>
                </select>
              </label>

            <div style={{ display: 'flex', gap: '15px' }}>
                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#555' }}>
                    Дистанція (км):
                    <input name="distanceKm" type="number" step="0.1" onChange={handleChange} required style={{ padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </label>

                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#555' }}>
                    Тривалість (години):
                    <input name="durationHours" type="number" onChange={handleChange} required style={{ padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </label>

                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', fontSize: '14px', color: '#555' }}>
                    Ціна (грн):
                    <input name="price" type="number" step="0.01" onChange={handleChange} required style={{ padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </label>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px'}}>
                <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Зберегти
                </button>

                <Link to="/routes" style={{ padding: '12px 24px', backgroundColor: '#e5e7eb', color: '#374151', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', textAlign: 'center' }}>
                  Скасувати
                </Link>
            </div>
        </form>
    </div>
    );
};
