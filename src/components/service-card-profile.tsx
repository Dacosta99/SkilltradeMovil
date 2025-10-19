import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import type { ServiceProfile } from '../types/service';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Icon } from '@iconify/react';
import { updateServiceVisibilityInAPI } from '../services/catalogService'; 

interface ServiceCardProps {
  service: ServiceProfile;
}

const CardMediaWrapper = styled('div')({
  position: 'relative',
});

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  fontWeight: 'bold',
}));

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Handlers de ejemplo (pueden ser reemplazados por props si se requiere lógica real)
  const handleDelete = async () => {
    const updated = await updateServiceVisibilityInAPI(service.id);
    alert('Servicio ocultado: ' + service.titulo);
    if (!updated) {
      alert('Error al ocultar el servicio');
      return;
    }
    //recargar la pagina o actualizar el estado del componente
    window.location.reload();
};

  const handleComplete = () => {
    // Lógica para marcar como completado
    alert('Servicio completado: ' + service.titulo);
  };
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMediaWrapper>
        <CardMedia
          component="img"
          height="194"
          image={service.imagen}
          alt={service.titulo}
        />
        <PriceChip label={service.costo} color="primary" />
      </CardMediaWrapper>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Chip size="small" label={service.categoria.nombre} sx={{ mr: 1, backgroundColor: service.categoria.color }} />
          <Box display="flex" alignItems="center" color="text.secondary">
            <LocationOnIcon sx={{ mr: 0.5, fontSize: 'small' }} />
            <Typography variant="body2">{service.ubicacion}</Typography>
          </Box>
        </Box>
        <Link component={RouterLink} to={`/services/${service.id}`} underline="none">
          <Typography variant="h6" component="h3">
            {service.titulo}
          </Typography>
        </Link>
        <Typography variant="body2" color="text.secondary">
          {service.descripcion}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderTop: '1px solid #eee' }}>
      </Box>
      {/* Botones de acción en la parte inferior */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 2, pb: 2 }}>
            <Button size="small" color="error" variant="outlined" onClick={handleDelete} sx={{ minWidth: 0, px: 1 }}>
              <Icon icon="lucide:trash" />
            </Button>
        <Button size="small" color="success" variant="outlined" onClick={handleComplete} sx={{ minWidth: 0, px: 1 }}>
          <Icon icon="lucide:check-circle" />
        </Button>
      </Box>
    </Card>
  );
};