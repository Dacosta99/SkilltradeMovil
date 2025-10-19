import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
//import { authService } from '../services/authService';
//import { FortOutlined } from '@mui/icons-material';

export default function RegisterPage() {
  const navigate = useNavigate();
  const handleRegister = async (formData: any) => {
  const formDataToSend = new FormData();

  formDataToSend.append("nombres", formData.firstName);
  formDataToSend.append("apellidos", formData.lastName);
  formDataToSend.append("fecha_nacimiento", formData.birthDate);
  formDataToSend.append("correo", formData.email);
  formDataToSend.append("codigo_barrio", formData.neighborhoodCode);
  formDataToSend.append("telefono", formData.phone);
  formDataToSend.append("direccion", formData.location);
  formDataToSend.append("descripcion_habilidades", formData.skills || "");
  formDataToSend.append("contrasena", formData.password);
  formDataToSend.append("confirmar_contrasena", formData.confirmPassword);

  if (formData.profilePhoto) {
    formDataToSend.append("foto", formData.profilePhoto);
  }

  await fetch("http://localhost:8001/users/register", {
    method: "POST",
    body: formDataToSend,
  });

  navigate("/login");
};



  return <RegisterForm onSubmit={handleRegister} />;
}
