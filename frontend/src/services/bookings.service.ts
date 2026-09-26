import axios from 'axios';
import api from '../api/axios';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Declined' | 'Completed';
export interface BookingRequest {
  routeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
export interface BookingQuote {
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
}
export interface BookingRecord extends BookingRequest, Omit<BookingQuote, 'nights'> {
  id: string;
  title: string;
  location: string;
  imageUrl: string | null;
  guestId: string;
  guestName: string;
  hostId: string;
  hostName: string;
  status: BookingStatus;
  cancellationReason: string | null;
}
export interface UnavailableRange { start: string; end: string }

export const bookingsApi = {
  quote: (data: BookingRequest, signal?: AbortSignal) => api.post<BookingQuote>('/bookings/quote', data, { signal }).then(r => r.data),
  create: (data: BookingRequest) => api.post<BookingRecord>('/bookings', data).then(r => r.data),
  list: (host = false, signal?: AbortSignal) => api.get<BookingRecord[]>(host ? '/bookings/host' : '/bookings/my', { signal }).then(r => r.data),
  unavailable: (routeId: string, signal?: AbortSignal) => api.get<UnavailableRange[]>(`/bookings/route/${routeId}/unavailable-dates`, { signal }).then(r => r.data),
  changeStatus: (id: string, status: BookingStatus, reason?: string) =>
    api.put<BookingRecord>(`/bookings/${id}/status`, { status, reason }).then(r => r.data),
};

export function requestError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return 'Увійдіть до облікового запису.';
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
  }
  if (error instanceof Error && !axios.isAxiosError(error)) return error.message;
  return 'Не вдалося виконати запит. Спробуйте ще раз.';
}

export const bookingStatusLabels: Record<BookingStatus, string> = {
  Pending: 'Очікує підтвердження', Confirmed: 'Підтверджено',
  Cancelled: 'Скасовано', Declined: 'Відхилено', Completed: 'Завершено',
};
