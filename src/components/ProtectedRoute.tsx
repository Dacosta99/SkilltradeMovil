import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Asegúrate de que isAuthenticated es una función y retorna un booleano
  const isAuthenticated =
    typeof authService.isAuthenticated === 'function'
      ? authService.isAuthenticated()
      : false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
