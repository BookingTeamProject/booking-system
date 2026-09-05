// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { storage, checkIsLandlord } from '../services/storage.service';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLandlord: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => Promise<void>;
  switchRole: (newRole: 'Landlord' | 'User') => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => storage.auth.getToken());
  const [user, setUser] = useState<User | null>(() => storage.user.get());

  useEffect(() => {
    if (!token) return;

    const syncWithServer = async () => {
      try {
        const res = await api.get('/user/me');
        if (res.data) {
          const savedRole = storage.role.get();
          const merged: User = {
            ...res.data,
            role: savedRole || res.data.role || user?.role || 'User',
            avatarUrl: res.data.avatarUrl || user?.avatarUrl || '',
          };
          setUser(merged);
          storage.user.set(merged);
        }
      } catch (err) {
        console.warn('Сервер недоступний, використовуємо збережений профіль:', err);
      }
    };

    syncWithServer();
  }, [token]);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    storage.auth.setTokens(accessToken, refreshToken);
    storage.user.set(userData);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    storage.auth.clear();
    setToken(null);
    setUser(null);
  };

  const updateUser = async (fields: Partial<User>) => {
    if (!user) return;
    const updated = storage.user.update(fields) || { ...user, ...fields };
    setUser(updated);

    try {
      await api.put('/user/profile', {
        firstName: updated.firstName,
        lastName: updated.lastName,
        phoneNumber: updated.phoneNumber,
        avatarUrl: updated.avatarUrl,
      });
    } catch (e) {
      console.warn('Профіль оновлено локально:', e);
    }
  };

  const switchRole = async (newRole: 'Landlord' | 'User') => {
    if (!user) return;

    try {
      if (newRole === 'Landlord') {
        // 1. Викликаємо новий ендпоінт бекенда
        const res = await api.post('/user/become-landlord');

        // 2. Якщо бекенд повернув нові токени — миттєво зберігаємо їх
        if (res.data?.accessToken) {
          storage.auth.setTokens(res.data.accessToken, res.data.refreshToken);
          setToken(res.data.accessToken);
        } else {
          // Якщо токени не прийшли, робимо тихий refresh через стандартний ендпоінт
          const oldRefresh = storage.auth.getRefreshToken();
          const oldToken = storage.auth.getToken();
          if (oldRefresh) {
            const refreshRes = await api.post('/auth/refresh', { token: oldToken, refreshToken: oldRefresh });
            if (refreshRes.data?.accessToken) {
              storage.auth.setTokens(refreshRes.data.accessToken, refreshRes.data.refreshToken);
              setToken(refreshRes.data.accessToken);
            }
          }
        }
      }

      // 3. Оновлюємо стейт користувача в React
      storage.role.set(newRole);
      const updatedUser: User = { ...user, role: newRole };
      setUser(updatedUser);
      storage.user.set(updatedUser);

      console.log('✅ Роль успішно змінено на Landlord, токен оновлено!');
    } catch (err) {
      console.error('Помилка при зміні ролі:', err);
      // Локальний фолбек
      storage.role.set(newRole);
      const updatedUser: User = { ...user, role: newRole };
      setUser(updatedUser);
      storage.user.set(updatedUser);
    }
  };

  const updateAvatar = async (file: File) => {
    if (!user) return;

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      let finalUrl = base64;

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/user/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.avatarUrl || typeof res.data === 'string') {
          finalUrl = res.data.avatarUrl || res.data;
        }
      } catch (err) {
        console.warn('Аватар збережено в локальний кеш:', err);
      }

      await updateUser({ avatarUrl: finalUrl });
    };
    reader.readAsDataURL(file);
  };

  // Исправлено: безопасное сравнение роли без TS2367
  const isLandlord = checkIsLandlord(user?.role);

  return (
    <AuthContext.Provider value={{ user, token, isLandlord, login, logout, updateUser, switchRole, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};