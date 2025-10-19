import { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    Link,
} from '@mui/material';

type FormData = {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    neighborhoodCode: string;
    phone: string;
    password: string;
    confirmPassword: string;
    location: string;
    skills?: string;
    profilePhoto?: File | null;
};

type Props = {
    onSubmit: (formData: FormData) => void;
};

export default function RegisterForm({ onSubmit }: Props) {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        birthDate: '',
        email: '',
        neighborhoodCode: '',
        phone: '',
        password: '',
        confirmPassword: '',
        location: '',
        skills: '',
        profilePhoto: null, 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        onSubmit(formData);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={6} sx={{ p: 4, maxWidth: 700, width: '100%' }}>
                <Box textAlign="center" mb={2}>
                    <Typography variant="h5">Registro</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid size={4}>
                            <TextField label="Nombre" name="firstName" fullWidth size="small" required value={formData.firstName} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Apellido" name="lastName" fullWidth size="small" required value={formData.lastName} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Fecha de nacimiento" name="birthDate" type="date" InputLabelProps={{ shrink: true }} fullWidth size="small" required value={formData.birthDate} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Correo electrónico" name="email" type="email" fullWidth required value={formData.email} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Código de barrio" name="neighborhoodCode" fullWidth required value={formData.neighborhoodCode} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Número de teléfono" name="phone" fullWidth required value={formData.phone} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Contraseña" name="password" type="password" fullWidth required value={formData.password} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Confirmar contraseña" name="confirmPassword" type="password" fullWidth required value={formData.confirmPassword} onChange={handleChange} />
                        </Grid>
                        <Grid size={4}>
                            <TextField label="Ubicación" name="location" fullWidth required value={formData.location} onChange={handleChange} />
                        </Grid>
                        <Grid size={12}>
                            <TextField label="Habilidades (opcional)" name="skills" fullWidth value={formData.skills} onChange={handleChange} multiline />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                label="Foto de perfil (opcional)"
                                name="profilePhoto"
                                type="file"
                                fullWidth
                                inputProps={{ accept: 'image/*' }}
                                onChange={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    const file = input.files ? input.files[0] : null;
                                    setFormData(prev => ({ ...prev, profilePhoto: file }));
                                }}
                                InputLabelProps={{ shrink: true }}
                            /></Grid>
                    </Grid>

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                        Registrarse
                    </Button>
                </form>
                <Typography variant="body2">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" underline="hover">
                        Inicia sesión aquí
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
