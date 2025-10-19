import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import MainLayout from './layouts/main-layout';
import ServicesPage from './pages/ServicesPage.tsx';
import { ServiceDetailPage } from './pages/ServiceDetail.tsx';
//import ProtectedRoute from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { WalletPage } from './pages/WalletPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={<Navigate to="/login" />} />
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;