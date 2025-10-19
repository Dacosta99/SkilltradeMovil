import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Avatar,
    Stack // Nuevo componente para manejar el espaciado entre botones
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'; // Nuevo import para navegación

type Props = {
    onSubmit: (username: string, password: string) => void;
};

export default function LoginForm({ onSubmit }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para navegación

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={6} sx={{ p: 4, width: 350 }}>
                <Box textAlign="center" mb={2}>
                    <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography variant="h5" mt={1}>
                        Iniciar Sesión
                    </Typography>
                </Box>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(username, password);
                    }}
                >
                    <TextField
                        label="Correo Electrónico"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Stack spacing={2} mt={2}> {/* Contenedor para los botones */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            
                        >
                            Entrar
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/register')} // Navegación a /register
                        >
                            Crear Cuenta
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}