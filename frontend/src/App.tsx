import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

const GOOGLE_CLIENT_ID = "1052530733022-0k6943f8d8fkqh2lp36fm8o5l5fr4ivs.apps.googleusercontent.com";

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/profile" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f2eb' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Главная */}
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              
              {/* Авторизация: защищена от уже вошедших пользователей */}
              <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
              <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
              
              {/* Профиль */}
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Любой неизвестный адрес -> Красивая 404 из Figma */}
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