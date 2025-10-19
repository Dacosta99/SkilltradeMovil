import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Container
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';
import { ServiceCard } from '../components/service-card';
import { categories } from '../data/categories';
import { useEffect, useState } from 'react';
import { fetchServicesFromAPI } from '../services/catalogService';
import ServiceModal from '../components/service-modal';
import type { Service } from '../types/service';
import Autocomplete from '@mui/material/Autocomplete';

export default function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState({ term: '', location: '' });
  const [quickResults, setQuickResults] = useState<Service[]>([]);

  const popularCategories = categories;

  // Función para cerrar sesión y redirigir al login
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Evita warning hasta que handleLogout se use realmente
  void handleLogout;

  // Función para manejar la creación de un nuevo servicio desde el modal
  const handleCreateService = (newService: Service) => {
    console.log('Nuevo servicio creado:', newService);
    setIsModalOpen(false);
  };

  // Búsqueda reactiva SOLO para la sección de búsqueda rápida
  useEffect(() => {
    const fetchAndFilter = async () => {
      const allServices = await fetchServicesFromAPI();
      const filtered = allServices.filter(service => {
        const matchesTerm = quickSearch.term
          ? ((service.titulo || '').toLowerCase().includes(quickSearch.term.toLowerCase()) ||
            (service.descripcion || '').toLowerCase().includes(quickSearch.term.toLowerCase()))
          : true;
        const matchesLocation = quickSearch.location
          ? (service.ubicacion || '').toLowerCase().includes(quickSearch.location.toLowerCase())
          : true;
        return matchesTerm && matchesLocation;
      });
      setQuickResults(filtered);
    };

    if (quickSearch.term || quickSearch.location) {
      fetchAndFilter();
    } else {
      setQuickResults([]);
    }
  }, [quickSearch.term, quickSearch.location]);

  // El submit solo previene el reload y redirige si hay coincidencia exacta
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = quickResults.find(
      s => s.titulo.trim().toLowerCase() === quickSearch.term.trim().toLowerCase()
    );
    if (match) {
      navigate(`/services/${match.id}`);
    }
  };

  useEffect(() => {
    fetchServicesFromAPI().then((data) => {
      setFeaturedServices(data.slice(0, 4)); // Mostrar primeros 4
    });
  }, []);

  return (
    <>
      {/* Sección principal (Hero) */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        py: 8,
        background: 'linear-gradient(to right, #1E3A8A, #1E40AF)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Intercambia habilidades y servicios en tu comunidad
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Conecta con personas cercanas, comparte lo que sabes hacer y recibe ayuda en lo que necesitas. 
                Una economía colaborativa basada en el intercambio justo.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  component={RouterLink}
                  to="/services"
                  variant="contained"
                  size="large"
                  sx={{
                    fontWeight: 'medium',
                    textTransform: 'none',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    color: '#333',
                    '&:hover': { backgroundColor: '#e9e9e9', color: '#000' }
                  }}
                >
                  Explorar servicios
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    textTransform: 'none',
                    borderRadius: '12px',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                  onClick={() => setIsModalOpen(true)}
                  startIcon={<Icon icon="lucide:plus" />}
                >
                  Ofrecer un servicio
                </Button>
              </Box>
            </Grid>
            <Grid size={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="home.png"
                alt="SkillTrade Community"
                sx={{ borderRadius: 2, boxShadow: 3, width: '100%' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Sección de búsqueda rápida */}
      <Box sx={{ py: 4, px: 2 }}>
        <Container maxWidth="md" sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
          <Card sx={{ boxShadow: 3, borderRadius: '12px' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                ¿Qué servicio estás buscando?
              </Typography>
              <form onSubmit={handleQuickSearch}>
                <Grid container spacing={2}>
                  <Grid size={7}>
                    <Autocomplete
                      freeSolo
                      options={[...new Set(quickResults.map(s => s.titulo))]}
                      inputValue={quickSearch.term}
                      onInputChange={(_, value) => setQuickSearch(q => ({ ...q, term: value }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="Clases de piano, reparación de bicicletas..."
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon icon="lucide:search" />
                              </InputAdornment>
                            ),
                            sx: {
                              height: '48px',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '12px',
                              '& fieldset': { borderRadius: '12px' }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={3}>
                    <Autocomplete
                      freeSolo
                      options={[...new Set(quickResults.map(s => s.ubicacion))]}
                      inputValue={quickSearch.location}
                      onInputChange={(_, value) => setQuickSearch(q => ({ ...q, location: value }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="Ubicación"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon icon="lucide:map-pin" />
                              </InputAdornment>
                            ),
                            sx: {
                              height: '48px',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '12px',
                              '& fieldset': { borderRadius: '12px' }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      type="submit"
                      sx={{
                        height: '48px',
                        borderRadius: '12px',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#e0e0e0', color: '#000' }
                      }}
                    >
                      Buscar
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {quickResults.length === 0 && (quickSearch.term || quickSearch.location) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron servicios que coincidan con la búsqueda.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Sección de explicación */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              ¿Cómo funciona SkillTrade?
            </Typography>
            <Typography color="text.secondary" maxWidth="sm" mx="auto">
              Una plataforma simple que conecta personas con habilidades y necesidades.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: 'lucide:user-plus',
                title: 'Crea tu perfil',
                description: 'Regístrate y comparte tus habilidades, experiencia y los servicios que puedes ofrecer a tu comunidad.'
              },
              {
                icon: 'lucide:briefcase',
                title: 'Ofrece o busca servicios',
                description: 'Publica los servicios que ofreces o busca entre los disponibles aquello que necesitas.'
              },
              {
                icon: 'lucide:repeat',
                title: 'Intercambia y crece',
                description: 'Utiliza nuestra moneda virtual para intercambiar servicios, construir tu reputación y fortalecer tu comunidad.'
              }
            ].map((item, index) => (
              <Grid size={{ md: 4, xs: 12 }} key={index}>
                <Card sx={{ minHeight: 255, borderRadius: '5%', py: 0.1 }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: '#E0E7FF',
                        color: '#4F46E5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      <Icon icon={item.icon} fontSize={24} />
                    </Box>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography color="text.secondary">{item.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Sección de servicios destacados */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Servicios destacados
            </Typography>
            <Button
              component={RouterLink}
              to="/services"
              variant="text"
              color="primary"
              endIcon={<Icon icon="lucide:arrow-right" />}
            >
              Ver todos
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredServices.map((service) => (
              <Grid size={{ xs: 6, md: 3 }} key={service.id}>
                <ServiceCard service={service} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Sección de categorías */}
      <Box sx={{ py: 6, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Explora por categorías
          </Typography>
          <Grid container spacing={2} sx={{ py: 3 }}>
            {popularCategories.slice(0, 6).map((category) => (
              <Grid
                sx={{ backgroundColor: '#fff', minHeight: '150px', borderRadius: '12px' }}
                size={{ md: 2, xs: 6 }}
                key={category.id}
              >
                <Button
                  component={RouterLink}
                  to={`/services?category=${category.id}`}
                  fullWidth
                  sx={{
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textTransform: 'none',
                    color: 'text.primary'
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: `${category.color || 'primary'}.light`,
                      color: `${category.color || 'primary'}.main`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1
                    }}
                  >
                    <Icon icon={category.icon} fontSize={20} />
                  </Box>
                  <Typography>{category.nombre}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA final */}
      <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            ¿Listo para unirte a nuestra comunidad?
          </Typography>
          <Typography sx={{ mb: 4, opacity: 0.9 }} maxWidth="600px" mx="auto">
            Comienza a intercambiar servicios, conoce a personas con intereses similares y construye una comunidad más fuerte y colaborativa.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                fontWeight: 'medium',
                textTransform: 'none',
                borderRadius: '12px',
                backgroundColor: '#fff',
                color: '#333',
                '&:hover': { backgroundColor: '#e9e9e9', color: '#000' }
              }}
              component={RouterLink}
              to={user ? '/profile' : '/register'}
            >
              {user ? 'Ver mi perfil' : 'Crear una cuenta'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                textTransform: 'none',
                borderRadius: '12px',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
              component={RouterLink}
              to="/services"
            >
              Explorar servicios
            </Button>
          </Box>
        </Container>

        {/* Modal para crear un nuevo servicio */}
        <ServiceModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateService}
        />
      </Box>
    </>
  );
}
