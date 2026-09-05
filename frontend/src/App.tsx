// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { RoutesProvider } from './context/RoutesContext';
import { SettingsProvider } from './context/SettingsContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const lazyRetry = (importFn: () => Promise<any>) =>
  lazy(() =>
    importFn().catch(() => {
      // Якщо чанк не знайдено (після нової збірки), просто оновлюємо сторінку на свіжу версію
      window.location.reload();
      return new Promise(() => {});
    })
  );

// Лінивий імпорт сторінок (код кожної сторінки завантажується лише при переході)
const HomePage = lazyRetry(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const FavoritesPage = lazyRetry(() => import('./pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const LoginPage = lazyRetry(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazyRetry(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const RoutesCatalog = lazyRetry(() => import('./pages/RoutesCatalog').then(m => ({ default: m.RoutesCatalog })));
const RouteCreate = lazyRetry(() => import('./pages/RouteCreate').then(m => ({ default: m.RouteCreate })));
const RouteDetails = lazyRetry(() => import('./pages/RouteDetails').then(m => ({ default: m.RouteDetails })));
const ProfilePage = lazyRetry(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const RoleSelectionPage = lazyRetry(() => import('./pages/RoleSelectionPage').then(m => ({ default: m.RoleSelectionPage })));
const AdminPage = lazyRetry(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const FAQPage = lazyRetry(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const AboutPage = lazyRetry(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PromotionsPage = lazyRetry(() => import('./pages/PromotionsPage').then(m => ({ default: m.PromotionsPage })));
const NewsPage = lazyRetry(() => import('./pages/NewsPage').then(m => ({ default: m.NewsPage })));
const NewsDetailsPage = lazyRetry(() => import('./pages/NewsDetailsPage').then(m => ({ default: m.NewsDetailsPage })));
const ContactPage = lazyRetry(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const ReportIssuePage = lazyRetry(() => import('./pages/ReportIssuePage').then(m => ({ default: m.ReportIssuePage })));
const LegalPage = lazyRetry(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));

// Меню кабінету з сайдбаром
const MenuWorkspacePage = lazyRetry(() => import('./pages/MenuWorkspacePage').then(m => ({ default: m.MenuWorkspacePage })));
const HostAccommodationsPage = lazyRetry(() => import('./pages/HostAccommodationsPage').then(m => ({ default: m.HostAccommodationsPage })));
const MessagesPage = lazyRetry(() => import('./pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const TenantBookingsPage = lazyRetry(() => import('./pages/TenantBookingsPage').then(m => ({ default: m.TenantBookingsPage })));
const AccountStatusPage = lazyRetry(() => import('./pages/AccountStatusPage').then(m => ({ default: m.AccountStatusPage })));
const NotFoundPage = lazyRetry(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const GOOGLE_CLIENT_ID = '1052530733022-0k6943f8d8fkqh2lp36fm8o5l5fr4ivs.apps.googleusercontent.com';

// Акуратний індикатор завантаження сторінки
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#DC9666', fontSize: '18px', fontWeight: 700, fontFamily: "'Iosevka Charon', sans-serif" }}>
    Завантаження...
  </div>
);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <SettingsProvider>
          <RoutesProvider>
            <Router>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F2EB' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                  {/* Suspense перехоплює завантаження чанка кожної сторінки */}
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Головна та каталог */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/routes" element={<RoutesCatalog />} />
                      <Route path="/routes/create" element={<RouteCreate />} />
                      <Route path="/routes/:id" element={<RouteDetails />} />
                      <Route path="/favorites" element={<FavoritesPage />} />

                      {/* Розділ "☰ Меню" */}
                      <Route path="/menu" element={<MenuWorkspacePage />} />
                      <Route path="/messages" element={<MessagesPage />} />
                      <Route path="/my-bookings" element={<TenantBookingsPage />} />
                      <Route path="/host/properties" element={<HostAccommodationsPage />} />
                      <Route path="/host/accommodations" element={<HostAccommodationsPage />} />
                      <Route path="/account-status" element={<AccountStatusPage />} />

                      {/* Інформаційні сторінки та акції */}
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/promotions" element={<PromotionsPage />} />
                      <Route path="/news" element={<NewsPage />} />
                      <Route path="/news/:id" element={<NewsDetailsPage />} />

                      {/* Підтримка та юридичні документи */}
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/report-issue" element={<ReportIssuePage />} />
                      <Route path="/legal" element={<LegalPage />} />
                      <Route path="/legal/:docType" element={<LegalPage />} />

                      {/* Авторизація та кабінети */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/select-role" element={<RoleSelectionPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/admin" element={<AdminPage />} />

                      {/* 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Router>
          </RoutesProvider>
        </SettingsProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;