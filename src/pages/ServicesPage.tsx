import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  Container
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { ServiceCard } from '../components/service-card.tsx';
import { ServiceFilter } from '../components/service-filter.tsx';
import { fetchServicesFromAPI } from '../services/catalogService';
import type { Service } from '../types/service.ts';
import ServiceModal from '../components/service-modal';

export const ServicesPage: React.FC = () => {
  // Estado para los servicios filtrados que se mostrarán en la página
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para loading
  // Estado para la página actual de la paginación
  const [currentPage, setCurrentPage] = React.useState(1);
  // Estado para los filtros aplicados
  const [filters, setFilters] = React.useState({
    searchTerm: '',
    category: '',
    priceRange: '',
    location: '',
  });
  // Estado para controlar la visibilidad del modal de creación de servicio
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Número de servicios a mostrar por página
  const servicesPerPage = 8;
  // Índice del último servicio a mostrar en la página actual
  const indexOfLastService = currentPage * servicesPerPage;
  // Índice del primer servicio a mostrar en la página actual
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  // Servicios que se mostrarán en la página actual
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  // Número total de páginas para la paginación
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  useEffect(() => {
    setLoading(true);
    fetchServicesFromAPI().then((data) => {
      setFilteredServices(data);
      setAllServices(data);
      setLoading(false); // Cuando termina de cargar, cambia loading a false
    });
  }, []);

  // Función para manejar el cambio de filtros desde el componente ServiceFilter
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    // Aplicar los filtros a la lista de servicios
    let results = [...allServices];

    // Filtrar por término de búsqueda en título o descripción
    if (newFilters.searchTerm) {
      results = results.filter(service =>
        service.titulo.toLowerCase().includes(newFilters.searchTerm.toLowerCase()) ||
        service.descripcion.toLowerCase().includes(newFilters.searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (newFilters.category) {
      results = results.filter(service => service.categoria.id === newFilters.category);
    }

    // Filtrar por rango de precio
    if (newFilters.priceRange) {
      const [min, max] = newFilters.priceRange.split('-');
      if (max) {
        results = results.filter(service =>
          service.costo >= parseInt(min) && service.costo <= parseInt(max)
        );
      } else {
        // Caso para "200+" (mayor o igual a 200)
        results = results.filter(service => service.costo >= parseInt(min.replace('+', '')));
      }
    }

    // Filtrar por ubicación
    if (newFilters.location) {
      results = results.filter(service =>
        service.ubicacion.toLowerCase().includes(newFilters.location.toLowerCase())
      );
    }

    setFilteredServices(results);
    setCurrentPage(1); // Reiniciar a la primera página cuando cambian los filtros
  };

  // Función para agregar un nuevo servicio a la lista (cuando se crea desde el modal)
  const handleCreateService = (newService: Service) => {
    // Actualiza ambos estados: todos los servicios y los filtrados
    const updatedAllServices = [...allServices, newService];
    setAllServices(updatedAllServices);

    // Aplica los filtros actuales al nuevo listado
    let results = [...updatedAllServices];

    if (filters.searchTerm) {
      results = results.filter(service =>
        service.titulo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        service.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.category) {
      results = results.filter(service => service.categoria.id === filters.category);
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      if (max) {
        results = results.filter(service =>
          service.costo >= parseInt(min) && service.costo <= parseInt(max)
        );
      } else {
        results = results.filter(service => service.costo >= parseInt(min.replace('+', '')));
      }
    }
    if (filters.location) {
      results = results.filter(service =>
        service.ubicacion.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredServices(results);
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
      {/* Contenedor principal de la página de servicios */}
      <Box sx={{ maxWidth: '1300px', margin: '0 auto', py: '20px', px: 0,  }}>
        {/* Encabezado y botón para ofrecer un nuevo servicio */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          marginBottom: '24px'
        }}>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Servicios disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explora {filteredServices.length} servicios en tu comunidad
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
              borderRadius: '12px',
            }}
            onClick={() => setIsModalOpen(true)} // Abre el modal al hacer clic
          >
            Ofrecer un servicio
          </Button>
        </Box>

        {/* Filtros de búsqueda y filtrado */}
        <ServiceFilter onFilterChange={handleFilterChange} />

        {/* Mostrar loading mientras se cargan los servicios */}
        {loading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Cargando servicios...
            </Typography>
          </Box>
        ) : filteredServices.length > 0 ? (
          <>
            {/* Grid de tarjetas de servicios */}
            <Grid container spacing={3} sx={{ mt: '32px' }}>
              {currentServices.map((service) => (
                <Grid size={{md:3,xs:6}} key={service.id}>
                  <ServiceCard service={service} />
                </Grid>
              ))}
            </Grid>

            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '32px' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                showFirstButton
                showLastButton
                color="primary"
              />
            </Box>
          </>
        ) : (
          // Mensaje cuando no hay servicios que coincidan con los filtros
          <Card sx={{ mt: '32px' }}>
            <CardContent sx={{ py: '48px', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: '16px' }}>
                <SearchOffIcon sx={{ fontSize: '60px', color: 'text.disabled' }} />
              </Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: '8px' }}>
                No se encontraron servicios
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: '24px' }}>
                No hay servicios que coincidan con los filtros seleccionados.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleFilterChange({
                  searchTerm: '',
                  category: '',
                  priceRange: '',
                  location: '',
                })}
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
      {/* Modal para crear un nuevo servicio */}
      <ServiceModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateService} />
    </Container>
  );
};

export default ServicesPage;