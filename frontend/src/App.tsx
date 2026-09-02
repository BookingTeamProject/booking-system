// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RoutesCatalog } from './pages/RoutesCatalog';
import { RouteCreate } from './pages/RouteCreate';
import { RouteDetails } from './pages/RouteDetails';
import { ProfilePage } from './pages/ProfilePage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { AdminPage } from './pages/AdminPage';
import { FAQPage } from './pages/FAQPage';
import { AboutPage } from './pages/AboutPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailsPage } from './pages/NewsDetailsPage';
import { ContactPage } from './pages/ContactPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

const GOOGLE_CLIENT_ID = '1052530733022-0k6943f8d8fkqh2lp36fm8o5l5fr4ivs.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F2EB' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Главная и каталог */}
              <Route path="/" element={<HomePage />} />
              <Route path="/routes" element={<RoutesCatalog />} />
              <Route path="/routes/create" element={<RouteCreate />} />
              <Route path="/routes/:id" element={<RouteDetails />} />
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* Информационные разделы и акции */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailsPage />} />

              {/* Поддержка, контакты и жалобы */}
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/report-issue" element={<ReportIssuePage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/legal/:docType" element={<LegalPage />} />

              {/* Авторизация и кабинеты */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/select-role" element={<RoleSelectionPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* 404 страница */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;