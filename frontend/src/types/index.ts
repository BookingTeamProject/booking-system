// src/types/index.ts

export type UserRole = 'User' | 'Landlord' | 'Moderator' | 'Admin' | number;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt?: string;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'bathroom' | 'bedroom' | 'kitchen' | 'safety' | 'climate' | 'general';
  icon: string;
}

export interface RouteItem {
  id: string;
  title: string;
  description: string;
  location: string;
  distanceKm: number;
  durationHours: number;
  price: number;
  categoryId: string;
  categoryName: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  averageRating: number;
  reviewsCount?: number;
  imageUrls: string[];
  amenities?: string[];
  maxGuests?: number;
  roomsCount?: number;
  cancellationPolicy?: 'Flexible' | 'Moderate' | 'Strict';
  type?: 'Apartment' | 'House' | 'Chalet' | 'Glamping' | 'Room' | 'Trail';
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  routeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  id: string | number;
  routeId: string;
  title: string;
  location: string;
  imageUrl?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalSum: number;
  paidAmount: number;
  paymentType: 'full' | 'part';
  status: 'Очікує' | 'Підтверджено' | 'Завершено' | 'Скасовано';
  date: string;
}

export interface AccommodationFormData {
  type: string;
  title: string;
  description: string;
  location: string;
  rentalFormat: 'daily' | 'weekly' | 'longterm';
  maxGuests: number;
  roomsCount: number;
  bedsCount: number;
  amenities: string[];
  images: File[];
  imageUrls: string[];
  pricePerNight: number;
  minDays: number;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
}