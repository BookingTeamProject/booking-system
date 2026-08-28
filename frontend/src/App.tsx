import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RoutesCatalog } from './pages/RoutesCatalog';
import { RouteCreate } from './pages/RouteCreate';
import { RouteDetails } from './pages/RouteDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/routes/create" element={<RouteCreate />} />
        <Route path="/routes" element={<RoutesCatalog />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/routes/:id" element={<RouteDetails />} />
      </Routes>
    </Router>
  );
}

export default App;