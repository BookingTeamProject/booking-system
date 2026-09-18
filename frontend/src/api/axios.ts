// src/api/axios.ts
import axios, { type AxiosRequestConfig } from 'axios';
import { storage } from '../services/storage.service';

const isProduction = window.location.hostname !== 'localhost';

// Динамічний базовий URL: автоматично підлаштовується під поточний протокол і порт
const getBaseUrl = (): string => {
  if (isProduction) {
    return 'https://trailsua.pp.ua/api';
  }
  // Якщо сайт роздається бекендом, використовуємо його поточний origin
  return `${window.location.origin}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додавання токена до кожного запиту
api.interceptors.request.use((config) => {
  const token = storage.auth.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Черга для паралельних запитів під час оновлення токена
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Якщо сервер просто вимкнений (Ctrl + C) — НЕ чіпати сесію і НЕ викидати на /login
    if (!error.response) {
      console.warn('Сервер тимчасово недоступний. Сесію збережено.');
      return Promise.reject(error);
    }

    // Перевіряємо помилку 401 (крім самих запитів логіну/рефрешу)
    const isAuthRequest =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/register');

    if (error.response.status === 401 && !originalRequest._retry && !isAuthRequest) {
      const refreshToken = storage.auth.getRefreshToken();

      // Якщо рефреш токена взагалі немає
      if (!refreshToken) {
        storage.auth.clear();
        return Promise.reject(error);
      }

      // Якщо оновлення вже йде іншим паралельним запитом — стаємо в чергу
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshEndpoint = `${getBaseUrl()}/auth/refresh`;
        const res = await axios.post(refreshEndpoint, { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = res.data;
        storage.auth.setTokens(accessToken, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        storage.auth.clear();

        // Перенаправляємо на логін тільки якщо користувач не на сторінці реєстрації чи логіну
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;