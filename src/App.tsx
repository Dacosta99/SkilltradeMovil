import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import MainLayout from './layouts/main-layout';
import ServicesPage from './pages/ServicesPage.tsx';
import { ServiceDetailPage } from './pages/ServiceDetail.tsx';
import { ProfilePage } from './pages/ProfilePage';
import { WalletPage } from './pages/WalletPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirige / al home directamente */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route
          path="/home"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/services"
          element={
            <MainLayout>
              <ServicesPage />
            </MainLayout>
          }
        />

        <Route
          path="/services/:id"
          element={
            <MainLayout>
              <ServiceDetailPage />
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />

        <Route
          path="/wallet"
          element={
            <MainLayout>
              <WalletPage />
            </MainLayout>
          }
        />

        {/* Si la ruta no existe, redirige al home */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
