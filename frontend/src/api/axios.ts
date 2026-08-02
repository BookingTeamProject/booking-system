import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5238/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем JWT токен в заголовок каждого запроса
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;