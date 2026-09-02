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
              {/* Главная */}
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/faq" element={<FAQPage />} />

              {/* Авторизация и регистрация */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/select-role" element={<RoleSelectionPage />} />

              {/* Каталог и объекты */}
              <Route path="/routes" element={<RoutesCatalog />} />
              <Route path="/routes/create" element={<RouteCreate />} />
              <Route path="/routes/:id" element={<RouteDetails />} />

              {/* Личные кабинеты и Админка */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* 404 Fallback */}
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