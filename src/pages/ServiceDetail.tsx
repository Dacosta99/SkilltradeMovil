// ServiceDetail.tsx
// Página de detalle de un servicio individual en la plataforma SkillTrade
// Muestra información detallada del servicio, proveedor, reseñas y permite contactar al proveedor

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  Grid
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import AlertCircleIcon from '@mui/icons-material/ReportProblem';
import MapPinIcon from '@mui/icons-material/Room';
import ClockIcon from '@mui/icons-material/AccessTime';
import MessageIcon from '@mui/icons-material/Message';
//import BookmarkIcon from '@mui/icons-material/Bookmark';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//import ShieldCheckIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
//import { styled } from '@mui/material/styles';
import { ReviewCard } from '../components/review-card';
import { fetchServicesFromAPI } from '../services/catalogService';
import ReviewModal from '../components/review-modal';
import { authService, fetchUserPublications, AUTH_SERVICE_BASE_URL } from '../services/authService';
import {
  fetchReviewsByServiceWithAuthors,
  createReviewWithAuthorInfo
} from '../services/reviewService';



// Componente principal de la página de detalle de servicio
export const ServiceDetailPage: React.FC = () => {
  // Obtiene el parámetro 'id' de la URL
  const { id } = useParams<{ id: string }>();
  // Estado para controlar la apertura del modal de contacto
  const [open, setOpen] = React.useState(false);
  // Estado para el mensaje a enviar al proveedor

  // Estado para la lista de servicios (se usa para buscar el servicio por id)
  const [services, setServices] = React.useState<any[]>([]);
  // Estado de carga
  const [loading, setLoading] = React.useState(true);
  // Estado de error
  const [error, setError] = React.useState<string | null>(null);
  // Estado para el tab seleccionado: 0 = Descripción, 1 = Reseñas
  const [tabValue, setTabValue] = React.useState(0);
  // Estado para el modal de agregar reseña
  const [openReview, setOpenReview] = React.useState(false);
  // Estado para las reseñas
  const [localReviews, setLocalReviews] = React.useState<any[]>([]);
  // Estado para la información del proveedor
  const [providerInfo, setProviderInfo] = React.useState<any>(null);

  // Efecto para cargar las reseñas del servicio al montar el componente
  React.useEffect(() => {
    if (!id) return;

    const loadReviews = async () => {
      try {
        const reviewsWithAuthors = await fetchReviewsByServiceWithAuthors(id);
        setLocalReviews(reviewsWithAuthors);
      } catch (error) {
        console.error('Error cargando reseñas:', error);
        setLocalReviews([]);
      }
    };

    loadReviews();
  }, [id]);

  // Efecto para cargar los servicios al montar el componente
  React.useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServicesFromAPI();
        setServices(data);
      } catch (error) {
        setError('Error al obtener los servicios');
        console.error('Error cargando servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Busca el servicio correspondiente al id de la URL
  const service = services.find(s => s.id === id);

  // Efecto para cargar información del proveedor cuando se encuentra el servicio
  React.useEffect(() => {
    if (!service) return;

    const loadProviderInfo = async () => {
      try {
        const data = await fetchUserPublications(service.proveedor.id);
        setProviderInfo(data);
      } catch (error) {
        console.error('Error al traer info del proveedor:', error);
        setProviderInfo(null);
      }
    };

    loadProviderInfo();
  }, [service]);

  // Funciones para abrir/cerrar el modal de contacto
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Función para manejar el envío de mensaje al proveedor


  // Función para agregar una nueva reseña
  const handleAddReview = async (review: { rating: number; comment: string }) => {
    if (!id) return;

    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const reviewData = {
        service_id: id,
        reviewer_id: currentUser.id,
        rating: review.rating,
        comment: review.comment,
      };

      // Usar la función del servicio para crear la reseña con información del autor
      const newReviewWithAuthor = await createReviewWithAuthorInfo(reviewData);
      
      // Agregar la nueva reseña al estado local
      setLocalReviews((prev) => [newReviewWithAuthor, ...prev]);
    } catch (error) {
      console.error('Error enviando reseña:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Muestra pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <Box sx={{ maxWidth: '7xl', mx: 'auto', px: 4, py: 16, textAlign: 'center' }}>
        <Typography variant="h6">Cargando servicio...</Typography>
      </Box>
    );
  }

  // Muestra mensaje de error si no se encuentra el servicio o hay error de carga
  if (error || !service) {
    return (
      <Box sx={{ maxWidth: '7xl', mx: 'auto', px: 4, py: 16, textAlign: 'center' }}>
        <AlertCircleIcon sx={{ fontSize: '5rem', color: 'red', mx: 'auto', mb: 4 }} />
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Servicio no encontrado
        </Typography>
        <Typography variant="body1" sx={{ color: 'grey.600', mb: 6 }}>
          {error || 'El servicio que estás buscando no existe o ha sido eliminado.'}
        </Typography>
        <Button component={Link} to="/services" variant="contained" color="primary">
          Ver todos los servicios
        </Button>
      </Box>
    );
  }

  // Render principal de la página de detalle
  return (
    <Box sx={{ maxWidth: '7xl', mx: 'auto', px: 4, py: 8, pb: 16 }}>
      <Grid container spacing={3}>
        {/* Columna principal: información del servicio */}
        <Grid size={{md:8,xs:12}}>
          <Box sx={{ mb: 6 }}>
            {/* Encabezado: categoría, ubicación y fecha */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip label={service.categoria.nombre} color="primary" variant="outlined" />
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'grey.600', fontSize: '0.875rem' }}>
                <MapPinIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                <span>{service.ubicacion || 'Ubicación no disponible'}</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'grey.600', fontSize: '0.875rem' }}>
                <ClockIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                <span>Publicado hace {Math.floor(Math.random() * 7) + 1} días</span>
              </Box>
            </Box>
            {/* Título del servicio */}
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>{service.titulo}</Typography>
            {/* Imagen principal del servicio */}
            <Box sx={{ position: 'relative', borderRadius: 'lg', overflow: 'hidden', mb: 3 }}>
              <img
                src={service.imagen}
                alt={service.titulo}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
              {/* Precio sobre la imagen */}
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Chip
                  label={`$${service.costo}`}
                  color="primary"
                  variant="filled"
                  size="medium"
                  sx={{ fontWeight: 'semibold', fontSize: 'lg' }}
                />
              </Box>
            </Box>
            {/* Tabs para descripción y reseñas */}
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="Descripción" />
              <Tab label={`Reseñas (${localReviews.length})`} />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              {/* Sección de descripción y características */}
              {tabValue === 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'semibold', mb: 2 }}>Acerca de este servicio</Typography>
                    {/* Solo la descripción real del servicio, sin texto de ejemplo ni bullets fijos */}
                    <Typography variant="body2" sx={{ color: 'grey.700', whiteSpace: 'pre-line' }}>
                      {service.descripcion}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    {/* Lista de "¿Qué incluye?" */}
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2 }}>¿Qué incluye?</Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {/* Cada item describe un beneficio del servicio */}
                      <Grid size={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'success.100', color: 'success.main' }}>
                            <CheckIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Sesión personalizada</Typography>
                            <Typography variant="caption" sx={{ color: 'grey.600' }}>Adaptada a tus necesidades específicas</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'success.100', color: 'success.main' }}>
                            <CheckIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Materiales incluidos</Typography>
                            <Typography variant="caption" sx={{ color: 'grey.600' }}>Todo lo necesario para el servicio</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'success.100', color: 'success.main' }}>
                            <CheckIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Seguimiento posterior</Typography>
                            <Typography variant="caption" sx={{ color: 'grey.600' }}>Soporte después del servicio</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'success.100', color: 'success.main' }}>
                            <CheckIcon />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Horario flexible</Typography>
                            <Typography variant="caption" sx={{ color: 'grey.600' }}>Adaptado a tu disponibilidad</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    {/* Sección de ubicación */}
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2 }}>Ubicación</Typography>
                    <Box sx={{ bgcolor: 'grey.100', borderRadius: 'lg', p: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MapPinIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>{service.ubicacion}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'grey.600', mb: 2 }}>
                        El proveedor puede desplazarse hasta 5 km de esta ubicación.
                      </Typography>
                      <Box sx={{ height: '200px', bgcolor: 'grey.200', borderRadius: 'lg', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>Mapa de ubicación</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
              {/* Sección de reseñas y calificaciones solo si tabValue === 1 */}
              {tabValue === 1 && (
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                      <Button variant="contained" color="primary" onClick={() => setOpenReview(true)}>
                        Agregar reseña
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 3 }}>
                      {/* Calificación promedio y barras de porcentaje */}
                      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'grey.100', borderRadius: 'lg' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>4.8</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <StarIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                          <StarIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                          <StarIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                          <StarIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                          <StarHalfIcon sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'grey.600' }}>{localReviews.length} reseñas</Typography>
                      </Box>
                      {/* Barras de porcentaje de calificaciones */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ width: 96 }}>5 estrellas</Typography>
                            <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 'full', overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', bgcolor: 'success.main', width: '75%' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'grey.600', width: 64 }}>75%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ width: 96 }}>4 estrellas</Typography>
                            <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 'full', overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', bgcolor: 'success.main', width: '20%' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'grey.600', width: 64 }}>20%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ width: 96 }}>3 estrellas</Typography>
                            <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 'full', overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', bgcolor: 'warning.main', width: '5%' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'grey.600', width: 64 }}>5%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ width: 96 }}>2 estrellas</Typography>
                            <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 'full', overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', bgcolor: 'error.main', width: '0%' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'grey.600', width: 64 }}>0%</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ width: 96 }}>1 estrella</Typography>
                            <Box sx={{ flexGrow: 1, height: 8, bgcolor: 'grey.200', borderRadius: 'full', overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', bgcolor: 'error.main', width: '0%' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'grey.600', width: 64 }}>0%</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    {/* Lista de reseñas del servicio */}
                    <Box>
                      {localReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        </Grid>
        {/* Columna lateral: información del proveedor y acciones */}
        <Grid size={{md:4,xs:12}}>
          <Card sx={{ position: 'sticky', top: 32 }}>
            <CardHeader title={<Typography variant="h6" component="h2" sx={{ fontWeight: 'semibold' }}>Proveedor del servicio</Typography>} sx={{ pb: 0 }} />
            <CardContent>
              {/* Avatar y nombre del proveedor */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={providerInfo ? `${AUTH_SERVICE_BASE_URL}${providerInfo.foto_url}` : ''}
                  sx={{ width: 200, height: 200, mb: 2 }}
                  variant="circular"
                />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold' }}>
                  {providerInfo?.nombre_completo || 'Nombre no disponible'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <StarIcon sx={{ color: 'warning.main', fontSize: '1rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {providerInfo?.reputacion?.toFixed(1) ?? '0.0'}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'grey.600' }}>
                  Miembro desde {new Date().getFullYear() - Math.floor(Math.random() * 3) - 1}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Características del proveedor */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{mb:3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                  <span>Identidad verificada</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ClockIcon sx={{ color: 'success.main' }} />
                  <span>Responde en menos de 2 horas</span>
                </Box>
              </Box>
              {/* Acciones: contactar, guardar, reportar */}
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleOpen}
                  startIcon={<MessageIcon />}
                  sx={{ mb: 1 }}
                >
                  Contactar
                </Button>
                <Button
                  variant="text"
                  color="error"
                  fullWidth
                  startIcon={<FlagIcon />}
                >
                  Reportar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Modal para contactar al proveedor */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Contactar a {providerInfo?.nombre_completo}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Puedes contactar directamente:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            📞 Teléfono: {providerInfo?.telefono || 'No disponible'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            📧 Correo: {providerInfo?.correo || 'No disponible'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'grey.600', fontSize: '0.75rem' }}>
            <InfoIcon />
            <Typography>
              Al contactar, aceptas las normas de comunicación de SkillTrade.
            </Typography>
          </Box>
        </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
      <ReviewModal open={openReview} onClose={() => setOpenReview(false)} onSubmit={handleAddReview} />
    </Box>
  );
};
