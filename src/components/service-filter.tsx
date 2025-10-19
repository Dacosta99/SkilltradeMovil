import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Chip,
  Button,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import { categories } from '../data/categories.ts';

interface ServiceFilterProps {
  onFilterChange: (filters: any) => void;
}

export const ServiceFilter: React.FC<ServiceFilterProps> = ({ onFilterChange }) => {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = React.useState('');
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  // Estado para el rango de precio seleccionado
  const [priceRange, setPriceRange] = React.useState<string>('');
  // Estado para la ubicación ingresada
  const [location, setLocation] = React.useState<string>('');
  // Estado para los filtros activos (para mostrar chips)
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  // Maneja el cambio en el campo de búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters({ searchTerm: value });
  };

  // Maneja el cambio en la categoría seleccionada
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    if (value && !activeFilters.includes('category')) {
      setActiveFilters([...activeFilters, 'category']);
    } else if (!value && activeFilters.includes('category')) {
      setActiveFilters(activeFilters.filter(f => f !== 'category'));
    }

    applyFilters({ category: value });
  };

  // Maneja el cambio en el rango de precio seleccionado
  const handlePriceChange = (value: string) => {
    setPriceRange(value);

    if (value && !activeFilters.includes('price')) {
      setActiveFilters([...activeFilters, 'price']);
    } else if (!value && activeFilters.includes('price')) {
      setActiveFilters(activeFilters.filter(f => f !== 'price'));
    }

    applyFilters({ priceRange: value });
  };

  // Maneja el cambio en la ubicación ingresada
  const handleLocationChange = (value: string) => {
    setLocation(value);

    if (value && !activeFilters.includes('location')) {
      setActiveFilters([...activeFilters, 'location']);
    } else if (!value && activeFilters.includes('location')) {
      setActiveFilters(activeFilters.filter(f => f !== 'location'));
    }

    applyFilters({ location: value });
  };

  // Aplica los filtros y notifica al componente padre
  const applyFilters = (newFilters: any) => {
    onFilterChange({
      searchTerm: newFilters.searchTerm !== undefined ? newFilters.searchTerm : searchTerm,
      category: newFilters.category !== undefined ? newFilters.category : selectedCategory,
      priceRange: newFilters.priceRange !== undefined ? newFilters.priceRange : priceRange,
      location: newFilters.location !== undefined ? newFilters.location : location,
    });
  };

  // Limpia todos los filtros y estados
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange('');
    setLocation('');
    setActiveFilters([]);
    onFilterChange({
      searchTerm: '',
      category: '',
      priceRange: '',
      location: '',
    });
  };


  const selectStyle = {
    sx: {
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      height: '48px',
      '& fieldset': {
        borderRadius: '12px',
      }
    }
  };

  return (
    <Box sx={{ padding: 2, borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #eee', backgroundColor: 'background.paper' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Campo de búsqueda */}
        <TextField
          label="Buscar servicios"
          placeholder="Clases de piano, reparación de bicicletas..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              height: '48px',  // Altura estándar del botón grande
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              '& fieldset': {
                borderRadius: '12px',
              }
            }
          }}
          fullWidth

          variant="outlined"
        />

        {/* Filtros de categoría, precio y ubicación */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
          {/* Selector de categoría */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="category-label">Categoría</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              label="Categoría"
              {...selectStyle}
            >
              <MenuItem value="">
                <em>Ninguna</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nombre}
                </MenuItem>
              ))}

            </Select>
          </FormControl>

          {/* Selector de rango de precio */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="price-range-label">Rango de precio</InputLabel>
            <Select
              labelId="price-range-label"
              id="price-range-select"
              value={priceRange}
              onChange={(e) => handlePriceChange(e.target.value)}
              label="Rango de precio"
              {...selectStyle}
            >
              <MenuItem value="">
                <em>Ninguno</em>
              </MenuItem>
              <MenuItem value="0-50">0 - 50 SkillCoins</MenuItem>
              <MenuItem value="50-100">50 - 100 SkillCoins</MenuItem>
              <MenuItem value="100-200">100 - 200 SkillCoins</MenuItem>
              <MenuItem value="200+">200+ SkillCoins</MenuItem>
            </Select>
          </FormControl>

          {/* Campo de ubicación */}
          <TextField
            label="Ubicación"
            placeholder="Ciudad o barrio"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                height: '48px',  // Altura estándar del botón grande
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                '& fieldset': {
                  borderRadius: '12px',
                }
              }
            }}
            fullWidth
            variant="outlined"
          />
        </Box>

        {/* Chips de filtros activos y botón para limpiar */}
        {activeFilters.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mt: 2, gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', marginRight: 1 }}>Filtros activos:</Typography>
            {selectedCategory && (
              <Chip
                label={categories.find(c => c.id === selectedCategory)?.nombre || 'Categoría'}
                onDelete={() => handleCategoryChange('')}
                color="primary"
                size="small"
              />
            )}
            {priceRange && (
              <Chip
                label={
                  priceRange === '0-50' ? '0 - 50 SkillCoins' :
                    priceRange === '50-100' ? '50 - 100 SkillCoins' :
                      priceRange === '100-200' ? '100 - 200 SkillCoins' :
                        '200+ SkillCoins'
                }
                onDelete={() => handlePriceChange('')}
                color="primary"
                size="small"
              />
            )}
            {location && (
              <Chip
                label={location}
                onDelete={() => handleLocationChange('')}
                color="primary"
                size="small"
              />
            )}
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
            >
              Limpiar filtros
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};