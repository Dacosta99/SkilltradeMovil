import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { authService } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      await authService.login(username, password);
      navigate('/home');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}