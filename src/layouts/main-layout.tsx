import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Icon } from '@iconify/react';
import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService, fetchUserProfile } from '../services/authService';

const pages = [
  { name: 'Inicio', path: '/home' },
  { name: 'Servicios', path: '/services' }
];

const settings = [
  { name: 'Mi perfil', path: '/profile' },
  { name: 'Configuración', path: '#' },
  { name: 'Ayuda y soporte', path: '#' },
  { name: 'Cerrar sesión', path: null }
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = React.useState<string>('ornitorrinco.png');
  const [saldo_creditos, setSaldoCreditos] = React.useState<number>(0);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  // Intentar obtener usuario logueado
  const user = authService.getCurrentUser();

  // Cargar datos del usuario (solo si existe)
  React.useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id)
        .then((data) => {
          if (data.foto_url) {
            setAvatarUrl('http://localhost:8001' + data.foto_url);
          }
        })
        .catch(() => setAvatarUrl('ornitorrinco.png'));

      authService
        .getProfile(user.id)
        .then((data) => setSaldoCreditos(data.saldo_creditos ?? 0))
        .catch(() => setSaldoCreditos(0));
    } else {
      // Si no hay usuario, valores de prueba
      setAvatarUrl('ornitorrinco.png');
      setSaldoCreditos(0);
    }
  }, [user?.id]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 
       * Barra de navegación superior
       * Contiene: Logo, menú principal y controles de usuario
       */}
      <AppBar position="fixed" sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'  // Para soporte en Safari
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo Section */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              component={RouterLink}
              to="/home"
            >
              <Icon
                icon="lucide:handshake"
                style={{
                  marginRight: '8px',
                  fontSize: '24px',
                  color: '#000'
                }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 'bold',
                }}
              >
                SkillTrade
              </Typography>
            </Box>


            {/* Navigation Links (Desktop) */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              gap: 2
            }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 'medium',
                    textTransform: 'none',  // Añadido para evitar mayúsculas
                    fontSize: '16px',
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>


            {/* User Menu Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                size="large"
                aria-label="show notifications"
                color="default"
                sx={{ color: '#000' }}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Wallet Button */}
              <Button
                component={RouterLink}
                to="/wallet"
                variant="text"
                startIcon={
                  <Icon
                    icon="lucide:wallet"
                    style={{ fontSize: '20px' }}
                  />
                }
                sx={{
                  color: '#000',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Icon
                    icon="ph:currency-circle-dollar-fill"
                    style={{
                      fontSize: '25px',
                      color: '#1976d2'
                    }}
                  />
                  {saldo_creditos}
                </Typography>
              </Button>

              {/* Avatar and Menu */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Foto de perfil" src={avatarUrl} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting.name === 'Cerrar sesión') {
                        localStorage.removeItem('user'); // o authService.logout();
                        navigate('/login');
                      } else if (setting.path && setting.path !== '#') {
                        navigate(setting.path);
                      } else {
                        alert(`Opción: ${setting.name} (aún no implementada)`);
                      }
                    }}
                  >
                    <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 
       * Contenido principal
       * Área flexible que se expande para llenar el espacio disponible
       */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Eliminar el Container o configurarlo sin padding lateral */}
        <Box sx={{ pt: 8 }}>  {/* Solo padding top para el AppBar */}
          {children}
        </Box>
      </Box>

      {/* 
       * Pie de página
       * Contiene: Información de la empresa, enlaces útiles y redes sociales
       */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* 
             * Sección de información de la empresa
             * Logo, nombre y descripción breve
             */}
            <Grid size={{ md: 3, xs: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Icon
                  icon="lucide:handshake"
                  style={{
                    marginRight: '8px',
                    fontSize: '24px',
                    color: '#000'
                  }}
                />
                <Typography variant="h6" color="text.primary" fontWeight="bold">
                  SkillTrade
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Conectando habilidades y necesidades en tu comunidad.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton aria-label="facebook">
                  <Icon icon="lucide:facebook" />
                </IconButton>
                <IconButton aria-label="twitter">
                  <Icon icon="lucide:twitter" />
                </IconButton>
                <IconButton aria-label="instagram">
                  <Icon icon="lucide:instagram" />
                </IconButton>
              </Stack>
            </Grid>

            {/* 
             * Enlaces de navegación rápida
             * Organizados en categorías para fácil acceso
             */}
            <Grid size={{ md: 3, xs: 6 }}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                Explorar
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="text.secondary" underline="hover">Servicios</Link>
                <Link href="#" color="text.secondary" underline="hover">Categorías</Link>
                <Link href="#" color="text.secondary" underline="hover">Cómo funciona</Link>
              </Stack>
            </Grid>

            {/* 
             * Enlaces de soporte y ayuda
             * Recursos para usuarios
             */}
            <Grid size={{ md: 3, xs: 6 }}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                Soporte
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="text.secondary" underline="hover">Centro de ayuda</Link>
                <Link href="#" color="text.secondary" underline="hover">Contacto</Link>
                <Link href="#" color="text.secondary" underline="hover">FAQ</Link>
              </Stack>
            </Grid>

            {/* 
             * Información legal
             * Enlaces a documentos importantes
             */}
            <Grid size={{ md: 3, xs: 6 }}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="text.secondary" underline="hover">Términos</Link>
                <Link href="#" color="text.secondary" underline="hover">Privacidad</Link>
                <Link href="#" color="text.secondary" underline="hover">Cookies</Link>
              </Stack>
            </Grid>


          </Grid>

          {/* Copyright section */}
          <Box sx={{
            mt: 3,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} SkillTrade. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;