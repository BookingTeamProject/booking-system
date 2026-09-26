// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { AUTH_SESSION_CLEARED_EVENT, storage, checkIsLandlord } from '../services/storage.service';
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
  const [user, setUser] = useState<User | null>(() => storage.auth.getToken() ? storage.user.get() : null);

  useEffect(() => {
    const clearSession = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, clearSession);
  }, []);

  useEffect(() => {
    if (!token) return;
    const abort = new AbortController();

    const syncWithServer = async () => {
      try {
        const res = await api.get<User>('/user/me', { signal: abort.signal });
        if (res.data && !abort.signal.aborted) {
          const merged: User = {
            ...res.data,
            role: res.data.role ?? 'User',
            avatarUrl: res.data.avatarUrl || '',
          };
          setUser(merged);
          storage.user.set(merged);
        }
      } catch (err) {
        console.warn('Сервер недоступний, використовуємо збережений профіль:', err);
      }
    };

    syncWithServer();
    return () => abort.abort();
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

  const saveUser = (updated: User) => {
    // An old request must not replace a newly signed-in account.
    if (storage.user.get()?.id !== updated.id) return;
    storage.user.set(updated);
    setUser(updated);
  };

  const updateUser = async (fields: Partial<User>) => {
    if (!user) throw new Error('Потрібно увійти.');
    const updated = { ...user, ...fields };
    const response = await api.put<User>('/user/profile', {
      firstName: updated.firstName, lastName: updated.lastName,
      phoneNumber: updated.phoneNumber, avatarUrl: updated.avatarUrl,
    });
    saveUser(response.data);
  };

  const switchRole = async (newRole: 'Landlord' | 'User') => {
    if (!user) throw new Error('Потрібно увійти.');
    // Choosing the guest journey does not revoke a host's existing permissions.
    if (newRole === 'User') return;
    const accountId = user.id;
    const response = await api.post<{ accessToken?: string; refreshToken?: string }>('/user/become-landlord');
    if (storage.user.get()?.id !== accountId) return;
    if (!response.data.accessToken || !response.data.refreshToken)
      throw new Error('Роль оновлена, але сесію не вдалося оновити. Увійдіть повторно.');
    storage.auth.setTokens(response.data.accessToken, response.data.refreshToken);
    setToken(response.data.accessToken);
    const profile = await api.get<User>('/user/me');
    saveUser(profile.data);
  };

  const updateAvatar = async (file: File) => {
    if (!user) throw new Error('Потрібно увійти.');
    const accountId = user.id;
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/user/avatar', formData);
    if (storage.user.get()?.id !== accountId) return;
    const profile = await api.get<User>('/user/me');
    saveUser(profile.data);
  };

  // Исправлено: безопасное сравнение роли без TS2367
  const isLandlord = checkIsLandlord(user?.role);

  return (
    <AuthContext.Provider value={{ user, token, isLandlord, login, logout, updateUser, switchRole, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

// Provider and hook intentionally share this Context module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
