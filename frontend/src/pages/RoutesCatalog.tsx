import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Route {
  id: number;
  title: string;
  description: string;
  price?: number;
}

export const RoutesCatalog: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
      const fetchRoutes = async () => {
        try {
          setLoading(true);
          const response = await api.get('/routes');
          setRoutes(response.data);
        } catch (err) {
          setError('Не вийшло завантажити маршрути.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchRoutes();
    }, []);

    if (loading) {
      return <div style={{ padding: '20px' }}>Завантаження маршрутів...</div>;
    }

    if (error) {
      return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '40px 20px', width: '100%', maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
            <h2>Каталог маршрутів</h2>

            {/*Кнопка для переходу на сторінку створення маршруту*/}
            <Link
                to="/routes/create"
                style={{ display: 'inline-block', marginBottom: '20px', padding: '10px 15px', backgroundColor: '#059669', color: 'white', textDecoration: 'none', borderRadius: '6px' }}
            >
               + Створити маршрут
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {routes.length === 0 ? (
                    <p>Маршрути не знайдено.</p>
                ) : (
                    routes.map((route) => (
                        <div key={route.id} style={{ border: '1px solid #d1d5db', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{marginTop: '0'}}>{route.title}</h3>
                            <p style={{ color: '#6b7280' }}>{route.description}</p>

                            {/*Посилання на деталі маршруту*/}
                            <Link to={`/routes/${route.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
                                Деталі маршруту
                            </Link>
                          </div>
                          <div style={{ minWidth: '150px', textAlign: 'right'}}>
                            <h3 style={{marginTop: '0', color: '#059669'}}>{route.price ? `${route.price} грн` : 'Ціна не вказана'}</h3>
                          </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};