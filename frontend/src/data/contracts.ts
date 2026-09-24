import type { BookingRecord, BookingRequest, BookingQuote, BookingStatus, UnavailableRange } from '../services/bookings.service';
import type { CreateRouteDto, CategoryDto, CreateReviewDto } from '../services/http-api.service';
import type { RouteItem, Review } from '../types';
import type { FinancialTransaction, PayoutSettings, SupportTicketItem, RestrictionHistoryItem, ContactOfficeInfo } from './mockData';

export interface SupportRequest {
  category: string; description: string; bookingCode: string;
  priority: string; contactMethod: string; attachmentName: string | null;
}
export interface ContactRequest { name: string; email: string; subject: string; message: string }
export interface AssistanceSnapshot {
  tickets: SupportTicketItem[];
  restrictions: RestrictionHistoryItem[];
  categories: string[];
  subjects: string[];
  office: ContactOfficeInfo;
  rules: { id: string; title: string; description: string }[];
}
export interface AssistanceRepository {
  available: boolean;
  load(): Promise<AssistanceSnapshot>;
  submitTicket(request: SupportRequest): Promise<SupportTicketItem[]>;
  submitAppeal(text: string): Promise<RestrictionHistoryItem[]>;
  submitContact(request: ContactRequest): Promise<void>;
}

export type DataMode = 'demo' | 'live';
export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string | null;
  text: string;
  time: string;
  /** Legacy API name: true means sent by the current user. */
  isHost: boolean;
}
export interface ChatRepository {
  list(dialogId: string, signal?: AbortSignal): Promise<ChatMessage[]>;
  send(dialogId: string, text: string): Promise<ChatMessage>;
}
export interface BookingRepository {
  list(host?: boolean, signal?: AbortSignal): Promise<BookingRecord[]>;
  quote(data: BookingRequest, signal?: AbortSignal): Promise<BookingQuote>;
  create(data: BookingRequest): Promise<BookingRecord>;
  unavailable(routeId: string, signal?: AbortSignal): Promise<UnavailableRange[]>;
  changeStatus(id: string, status: BookingStatus, reason?: string): Promise<BookingRecord>;
}
export interface PropertyRepository {
  getAll(params?: { search?: string; categoryId?: string; maxPrice?: number }): Promise<RouteItem[]>;
  getMine(signal?: AbortSignal): Promise<RouteItem[]>;
  getById(id: string): Promise<RouteItem>;
  create(dto: CreateRouteDto): Promise<RouteItem>;
  update(id: string, dto: Partial<CreateRouteDto>): Promise<RouteItem>;
  delete(id: string): Promise<unknown>;
}
export interface FinanceSnapshot {
  balance: number;
  expectedPayout: number;
  transactions: FinancialTransaction[];
  payoutSettings: PayoutSettings;
  kpi: { totalRevenue: number; monthRevenue: number; totalCommission: number; pendingPayouts: number };
}
export interface FinanceRepository {
  available: boolean;
  load(signal?: AbortSignal): Promise<FinanceSnapshot>;
  withdraw(amount: number): Promise<FinanceSnapshot>;
  updatePayoutSettings(settings: Partial<PayoutSettings>): Promise<FinanceSnapshot>;
}
export interface DataSources {
  news: ReadonlyArray<import('./articles').BlogPost>;
  assistance: AssistanceRepository;
  chat: ChatRepository;
  mode: DataMode;
  bookings: BookingRepository;
  properties: PropertyRepository;
  categories: {
    getAll(): Promise<CategoryDto[]>;
    getById(id: string): Promise<CategoryDto>;
    create(dto: { name: string; description?: string }): Promise<CategoryDto>;
    update(id: string, dto: { name: string; description?: string }): Promise<CategoryDto>;
    delete(id: string): Promise<unknown>;
  };
  favorites: {
    getMyFavorites(): Promise<RouteItem[] | string[]>;
    toggle(routeId: string): Promise<{ isFavorite: boolean; message: string }>;
  };
  reviews: {
    getByRouteId(routeId: string): Promise<Review[]>;
    addReview(dto: CreateReviewDto): Promise<Review>;
  };
  finance: FinanceRepository;
  resetDemo?: () => void;
  subscribeProperties?: (listener: () => void) => () => void;
}
