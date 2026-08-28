import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export const RouteDetails: React.FC = () => {
    const { id } = useParams();
    const [route, setRoute] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const response = await api.get(`/routes/${id}`);
                setRoute(response.data);
            } catch (error) {
                console.error("Помилка завантаження маршруту:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [id]);

    if (loading) return <div style={{ padding: '20px' }}>Завантаження...</div>;
    if (!route) return <div style={{ padding: '20px' }}>Маршрут не знайдено.</div>;

    return (
        <div style={{ padding: '20px', width: '60%', minWidth: '800px', textAlign: 'left', position: 'absolute', top: '40px', left: '40px'}}>
            <Link to="/routes" style={{ textDecoration: 'none', color: '#007BFF', marginBottom: '20px', display: 'inline-block' }}>
            ← Назад до списку маршрутів
            </Link>

            <h2 style={{ marginBottom: '20px' }}>{route.title}</h2>

            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <p><strong>Опис:</strong> {route.description}</p>
                <p><strong>Локація:</strong> {route.location}</p>
                <p><strong>Категорія:</strong> {route.categoryName}</p>
                <p><strong>Дистанція (км):</strong> {route.distanceKm}</p>
                <p><strong>Тривалість (год):</strong> {route.durationHours}</p>
                <p><strong>Ціна:</strong> {route.price}</p>
                <p style={{ marginTop: '15px', fontSize: '12px', color: '#555' }}>
                    Автор: {route.authorName} | Створено: {new Date(route.createdAt).toLocaleDateString()} | Оновлено: {route.updatedAt ? new Date(route.updatedAt).toLocaleDateString(): 'Поки не оновлювався'}
                </p>
            </div>
        </div>
    );
};


