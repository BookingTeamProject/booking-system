import { BLOG_POSTS } from './articles';
import api from '../api/axios';
import { bookingsApi } from '../services/bookings.service';
import { routesApi, categoriesApi, favoriteApi, reviewApi } from '../services/http-api.service';
import type { RouteItem } from '../types';
import type { DataSources, FinanceRepository, ChatMessage } from './contracts';

const unavailable = async (): Promise<never> => { throw new Error('Платіжний сервіс ще не підключено.'); };
export const unavailableFinance: FinanceRepository = {
  available: false, load: unavailable, withdraw: unavailable, updatePayoutSettings: unavailable,
};

export function createLiveDataSources(finance: FinanceRepository = unavailableFinance): DataSources {
  return {
    news: BLOG_POSTS,
    assistance: {
      available: false,
      load: async () => { throw new Error('Сервіс підтримки ще не реалізовано.'); },
      submitTicket: async () => { throw new Error('Сервіс підтримки ще не реалізовано.'); },
      submitAppeal: async () => { throw new Error('Сервіс апеляцій ще не реалізовано.'); },
      submitContact: async () => { throw new Error('Сервіс звернень ще не реалізовано.'); },
    },
    chat: {
      list: (id, signal) => api.get<ChatMessage[]>(`/chat/${encodeURIComponent(id)}`, { signal }).then(r => r.data),
      send: (dialogId, text) => api.post<ChatMessage>('/chat/send', { dialogId, text }).then(r => r.data),
    },
    mode: 'live', bookings: bookingsApi,
    properties: { ...routesApi, getMine: signal => api.get<RouteItem[]>('/routes/mine', { signal }).then(r => r.data) },
    categories: categoriesApi, favorites: favoriteApi, reviews: reviewApi, finance,
  };
}
