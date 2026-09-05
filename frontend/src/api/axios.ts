// src/api/axios.ts
import axios from 'axios';
import { storage } from '../services/storage.service';

const isProduction = window.location.hostname !== 'localhost';

const api = axios.create({
  baseURL: isProduction ? 'https://trailsua.pp.ua/api' : 'http://localhost:5238/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = storage.auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = storage.auth.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshUrl = isProduction
            ? 'https://trailsua.pp.ua/api/auth/refresh'
            : 'http://localhost:5238/api/auth/refresh';
          const res = await axios.post(refreshUrl, { refreshToken });
          storage.auth.setTokens(res.data.accessToken, res.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        } catch {
          storage.auth.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;