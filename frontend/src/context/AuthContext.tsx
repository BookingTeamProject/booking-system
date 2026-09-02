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
    const roleNum = newRole === 'Landlord' ? 1 : 0;
    storage.role.set(newRole);

    const updated: User = { ...user, role: newRole };
    setUser(updated);
    storage.user.set(updated);

    try {
      if (user.id) {
        await api.put(`/admin/users/${user.id}/role`, roleNum);
      }
    } catch {
      try {
        await api.put('/user/profile', { ...updated, role: roleNum });
      } catch (err) {
        console.warn('Роль збережено локально:', err);
      }
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