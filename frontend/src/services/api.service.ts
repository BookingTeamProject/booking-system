// Compatibility facade: existing consumers also use the centrally selected repositories.
export * from './http-api.service';
import { dataSources } from '../config/dataSources';
import type { BookingStatus } from './bookings.service';
export const routesApi = dataSources.properties;
// Compatibility facade for the detailed dashboard screens. The implementation
// still comes from the single centrally selected demo/live repository.
export const bookingsApi = {
  getMyBookings: () => dataSources.bookings.list(false),
  getHostRequests: () => dataSources.bookings.list(true),
  updateStatus: (id: string, status: BookingStatus, reason?: string) =>
    dataSources.bookings.changeStatus(id, status, reason),
};
export const categoriesApi = dataSources.categories;
export const favoriteApi = dataSources.favorites;
export const reviewApi = dataSources.reviews;
