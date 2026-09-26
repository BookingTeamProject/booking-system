// Compatibility facade: existing consumers also use the centrally selected repositories.
export * from './http-api.service';
import { dataSources } from '../config/dataSources';
export const routesApi = dataSources.properties;
export const categoriesApi = dataSources.categories;
export const favoriteApi = dataSources.favorites;
export const reviewApi = dataSources.reviews;
