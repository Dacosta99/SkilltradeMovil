import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Avatar,
  Button,
  Divider,
  Chip,
  TextField,
  Box,
  Typography,
  Grid
} from '@mui/material';
import { Icon } from '@iconify/react';
import type { Profile } from '../types/profile';
import { authService } from '../services/authService';
import { ServiceCard } from '../components/service-card-profile';
import { ReviewCard } from '../components/review-card-profile';
import { fetchProfileServicesFromAPI } from '../services/catalogService';
import ServiceModal from '../components/service-modal';
//import { fetchReviewsFromAPI } from '../services/reviewService';

export const ProfilePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const API_URL = 'http://localhost:8001';
  const [isEditing, setIsEditing] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [profileData, setProfileData] = React.useState<any>(null);
  const [perfil, setPerfil] = React.useState<Profile>({
  id: user?.id || '',
  nombre: '',
  correo: '',
  telefono: '',
  fotoUrl: '',
  reputacion: 0,
  direccion: '',
  skills: ['Diseño gráfico', 'Marketing digital', 'Redes sociales', 'Fotografía'],//falta impllementar en la bd
  saldo_creditos: 0,
});

  React.useEffect(() => {
  if (!user) return;

  authService.getProfile(user.id).then(data => {
    setPerfil({
      id: user.id,
      nombre: data.nombre_completo || '',
      correo: data.correo || '',
      telefono: data.telefono || '',
      fotoUrl: API_URL + data.foto_url,
      reputacion: data.reputacion || 0,
      direccion: data.direccion || '',
      skills: ['Diseño gráfico', 'Marketing digital', 'Redes sociales', 'Fotografía'],//falta impllementar en la bd
      saldo_creditos: data.saldo_creditos || '',
    });
  }).catch(err => {
    console.error('Error al cargar el perfil:', err);
  });
}, [user?.id]);


  const [userServices, setUserServices] = React.useState<any[]>([]);
  const [userReviews, setUserReviews] = React.useState<any[]>([]);

  React.useEffect(() => {
  if (!user) return;

  const fetchAllReviews = async () => {
    try {
      // 1) Traer todos tus servicios
      const services = await fetchProfileServicesFromAPI(user.id);
      setUserServices(services);

      // 2) Para cada servicio, pedir sus reseñas
      const allReviews = await Promise.all(
        services.map(async (service: any) => {
          const res = await fetch(`http://localhost:8003/reviews/service/${service.id}`);
          if (!res.ok) throw new Error(`Error reviews para servicio ${service.id}`);
          const reviews = await res.json();

          // 3) Para cada review, puedes traer info del autor si quieres
          const reviewsWithAuthor = await Promise.all(
            reviews.map(async (review: any) => {
              const authorRes = await fetch(`http://localhost:8001/users/${review.reviewer_id}/nombre_foto`);
              if (!authorRes.ok) throw new Error('Error autor');
              const author = await authorRes.json();
              return {
                id: review.id,
                serviceId: review.service_id,
                serviceTitle: service.titulo,
                rating: review.rating,
                comment: review.comment,
                date: review.created_at,
                author: {
                  id: review.reviewer_id,
                  name: author.nombre_completo,
                  avatar: "http://localhost:8001" + author.foto_url,
                },
              };
            })
          );

          return reviewsWithAuthor;
        })
      );

      // 4) Flatten: combina todas las listas
      const flatReviews = allReviews.flat();
      setUserReviews(flatReviews);
    } catch (err) {
      console.error('Error al cargar las reseñas:', err);
    }
  };

  fetchAllReviews();
}, [user?.id]);

  // Estado para controlar el modal de nuevo servicio
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Función para agregar un nuevo servicio
  const handleCreateService = (newService: any) => {
    setUserServices(prev => [...prev, newService]);
    setIsModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  return (
    <Box maxWidth="lg" mx="auto" px={4} py={8} pb={16}>
      <Grid container spacing={4}>
        <Grid size={{md:4,xs:12}}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Avatar
                  src={perfil.fotoUrl} 
                  sx={{ width: 128, height: 128, mb: 2 }}
                />
                {isEditing ? (
                  <TextField
                    label="Nombre"
                    value={perfil.nombre}
                    onChange={e => handleInputChange('name', e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography variant="h5" fontWeight="bold" mb={2}>{perfil.nombre}</Typography>
                )}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Icon icon="lucide:star" style={{ color: '#FFC107' }} />
                  <Typography fontWeight="medium">{perfil.reputacion}</Typography>
                  <Typography color="text.secondary">(32 reseñas)</Typography>
                </Box>
                <Box display="flex" gap={1} mb={3}>
                  <Chip color="success" label="Verificado" size="small" />
                  <Chip color="primary" label={<span className="skill-coin">{user?.balance || 0}</span>} size="small" />
                </Box>
                {!isEditing && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Icon icon="lucide:edit-3" />}
                    onClick={() => setIsEditing(true)}
                    sx={{ mb: 3 }}
                  >
                    Editar perfil
                  </Button>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              {isEditing ? (
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Email"
                    type="email"
                    value={perfil.correo}
                    onChange={e => handleInputChange('email', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Teléfono"
                    value={perfil.telefono}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Ubicación"
                    value={perfil.direccion}
                    onChange={e => handleInputChange('location', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Icon icon="lucide:map-pin" style={{ color: '#888', marginRight: 8 }} />
                      )
                    }}
                  />
                  <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveProfile}
                    >
                      Guardar cambios
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography fontWeight="bold" mb={1}>Información de contacto</Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Icon icon="lucide:mail" style={{ color: '#888' }} />
                        <Typography>{perfil.correo}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Icon icon="lucide:phone" style={{ color: '#888' }} />
                        <Typography>{perfil.telefono}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Icon icon="lucide:map-pin" style={{ color: '#888' }} />
                        <Typography>{perfil.direccion}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" mb={1}>Habilidades</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {perfil.skills?.map((skill, idx) => (
                        <Chip key={idx} label={skill} variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{md:8,xs:12}}>
          <Box>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="Mis servicios" />
              <Tab label="Reseñas" />
              <Tab label="Historial" />
            </Tabs>
            {tabValue === 0 && (
              <Card sx={{ mt: 2 }}>
                <CardHeader
                  title={<Typography variant="h6">Servicios activos</Typography>}
                  action={
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<Icon icon="lucide:plus" />} 
                      onClick={() => setIsModalOpen(true)}
                    >
                      Nuevo servicio
                    </Button>
                  }
                />
                <CardContent>
                  {userServices.length > 0 ? (
                    <Grid container spacing={2}>
                      {userServices.map((service) => (
                        <Grid size={{md:6,xs:12}} key={service.id}>
                          <ServiceCard service={service} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box textAlign="center" py={6}>
                      <Icon icon="lucide:package" style={{ fontSize: 48, color: '#bbb', marginBottom: 16 }} />
                      <Typography variant="h6" mb={2}>No tienes servicios publicados</Typography>
                      <Typography color="text.secondary" mb={3}>
                        Comparte tus habilidades con la comunidad y empieza a ganar SkillCoins.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<Icon icon="lucide:plus" />} 
                        onClick={() => setIsModalOpen(true)}
                      >
                        Publicar un servicio
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
            {tabValue === 1 && (
              <Card sx={{ mt: 2 }}>
                <CardHeader title={<Typography variant="h6">Reseñas recibidas</Typography>} />
                <CardContent>
                  {userReviews.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                      {userReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </Box>
                  ) : (
                    <Box textAlign="center" py={6}>
                      <Icon icon="lucide:message-square" style={{ fontSize: 48, color: '#bbb', marginBottom: 16 }} />
                      <Typography variant="h6" mb={2}>Aún no tienes reseñas</Typography>
                      <Typography color="text.secondary">
                        Las reseñas aparecerán aquí cuando los usuarios valoren tus servicios.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
            {tabValue === 2 && (
              <Card sx={{ mt: 2 }}>
                <CardHeader title={<Typography variant="h6">Historial de servicios</Typography>} />
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={4}>
                    <Box border={1} borderColor="divider" borderRadius={2} overflow="hidden">
                      <Box bgcolor="grey.100" p={2} borderBottom={1} borderColor="divider">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight="bold">Servicios contratados</Typography>
                          <Chip size="small" label="3 servicios" />
                        </Box>
                      </Box>
                      <Box p={2}>
                        <Box display="flex" flexDirection="column" gap={2}>
                          {[1, 2, 3].map((item) => (
                            <Box key={item} display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="background.paper" borderRadius={2} border={1} borderColor="divider">
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${item + 10}`} sx={{ width: 40, height: 40 }} />
                                <Box>
                                  <Typography fontWeight="medium">Clases de guitarra</Typography>
                                  <Typography variant="caption" color="text.secondary">12 de junio, 2023</Typography>
                                </Box>
                              </Box>
                              <Chip color="success" size="small" label="Completado" />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    <Box border={1} borderColor="divider" borderRadius={2} overflow="hidden">
                      <Box bgcolor="grey.100" p={2} borderBottom={1} borderColor="divider">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight="bold">Servicios prestados</Typography>
                          <Chip size="small" label="5 servicios" />
                        </Box>
                      </Box>
                      <Box p={2}>
                        <Box display="flex" flexDirection="column" gap={2}>
                          {[1, 2, 3, 4, 5].map((item) => (
                            <Box key={item} display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="background.paper" borderRadius={2} border={1} borderColor="divider">
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${item + 5}`} sx={{ width: 40, height: 40 }} />
                                <Box>
                                  <Typography fontWeight="medium">Diseño de logo</Typography>
                                  <Typography variant="caption" color="text.secondary">3 de mayo, 2023</Typography>
                                </Box>
                              </Box>
                              <Chip color="success" size="small" label="Completado" />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
      {/* Modal para crear un nuevo servicio */}
      <ServiceModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateService} />
    </Box>
  );
};