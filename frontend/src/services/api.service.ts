// src/services/api.service.ts
import api from '../api/axios';
import type { RouteItem, User, Review } from '../types';

// ================= DTOs ДЛЯ ЗАПИТІВ =================
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string | number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface GoogleAuthDto {
  idToken: string;
}

export interface RefreshTokenDto {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
}

export interface CreateReviewDto {
  routeId: string;
  rating: number;
  text: string;
}

export interface CreateRouteDto {
  title: string;
  description: string;
  location: string;
  price: number;
  categoryId?: string;
  imageUrls?: string[];
  amenities?: string[];
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ================= МОДУЛІ API =================

// 1. AuthController (api/auth)
export const authApi = {
  register: (dto: RegisterDto) => api.post<AuthResponse>('/auth/register', dto).then((r) => r.data),
  login: (dto: LoginDto) => api.post<AuthResponse>('/auth/login', dto).then((r) => r.data),
  googleAuth: (dto: GoogleAuthDto) => api.post<AuthResponse>('/auth/google', dto).then((r) => r.data),
  refresh: (dto: RefreshTokenDto) => api.post<AuthResponse>('/auth/refresh', dto).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
};

// 2. UserController (api/user)
export const userApi = {
  getProfile: () => api.get<User>('/user/me').then((r) => r.data),
  updateProfile: (dto: UpdateProfileDto) => api.put<User>('/user/profile', dto).then((r) => r.data),
  changePassword: (dto: ChangePasswordDto) => api.post('/user/change-password', dto).then((r) => r.data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ avatarUrl: string; message: string }>('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
};

// 3. RoutesController (api/routes)
export const routesApi = {
  getAll: (params?: { search?: string; categoryId?: string; maxPrice?: number }) =>
    api.get<RouteItem[]>('/routes', { params }).then((r) => r.data),
  getById: (id: string) => api.get<RouteItem>(`/routes/${id}`).then((r) => r.data),
  create: (dto: CreateRouteDto) => api.post<RouteItem>('/routes', dto).then((r) => r.data),
  update: (id: string, dto: Partial<CreateRouteDto>) => api.put<RouteItem>(`/routes/${id}`, dto).then((r) => r.data),
  delete: (id: string) => api.delete(`/routes/${id}`).then((r) => r.data),
};

// 4. CategoriesController (api/categories)
export const categoriesApi = {
  getAll: () => api.get<CategoryDto[]>('/categories').then((r) => r.data),
  getById: (id: string) => api.get<CategoryDto>(`/categories/${id}`).then((r) => r.data),
  create: (dto: { name: string; description?: string }) => api.post<CategoryDto>('/categories', dto).then((r) => r.data),
  update: (id: string, dto: { name: string; description?: string }) => api.put<CategoryDto>(`/categories/${id}`, dto).then((r) => r.data),
  delete: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
};

// 5. FavoriteController (api/favorite)
export const favoriteApi = {
  getMyFavorites: () => api.get<RouteItem[] | string[]>('/favorite').then((r) => r.data),
  toggle: (routeId: string) =>
    api.post<{ isFavorite: boolean; message: string }>(`/favorite/${routeId}`).then((r) => r.data),
};

// 6. ReviewController (api/review)
export const reviewApi = {
  getByRouteId: (routeId: string) => api.get<Review[]>(`/review/route/${routeId}`).then((r) => r.data),
  addReview: (dto: CreateReviewDto) => api.post<Review>('/review', dto).then((r) => r.data),
};

// 7. AdminController (api/admin)
export const adminApi = {
  getAllUsers: () => api.get<any[]>('/admin/users').then((r) => r.data),
  changeRole: (userId: string, newRole: number | string) =>
    api.put(`/admin/users/${userId}/role`, newRole).then((r) => r.data),
  getModerationDashboard: () => api.get('/admin/moderation/dashboard').then((r) => r.data),
};