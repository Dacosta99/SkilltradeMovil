import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import { categories } from '../data/categories';
import type { Service } from '../types/service';
import { createServiceInAPI } from '../services/catalogService';
import { authService, AUTH_SERVICE_BASE_URL } from '../services/authService';

interface CreateServiceModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (service: Service) => void;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ open, onClose, onCreate }) => {
  // Estado para almacenar los datos del nuevo servicio a crear
  const [newService, setNewService] = useState<Omit<Service, 'id' | 'proveedor' | 'createdAt'>>({
    titulo: '',
    descripcion: '',
    costo: 0,
    imagen: '',
    ubicacion: '',
    categoria: categories[0],
  });

  // Estado para almacenar el archivo subido
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);


  // Maneja los cambios en los campos del formulario
  const handleInputChange = (field: keyof Omit<Service, 'id' | 'proveedor' | 'createdAt'>, value: any) => {
    setNewService({ ...newService, [field]: value });
  };

  // Maneja la subida de la imagen y la convierte a base64 para previsualización
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file); // Guarda el archivo original
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewService(prev => ({ ...prev, imagen: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Función para crear el servicio y llamar al callback del padre
  const handleCreateService = async () => {
  // Validación básica de campos
  if (!newService.titulo || !newService.descripcion || !newService.costo || !newService.ubicacion || !newService.categoria) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    alert('Debes estar logueado para crear servicios');
    return;
  }

  try {
    if (!uploadedFile) {
      alert('Por favor, sube una imagen para el servicio.');
      return;
    }
    const created = await createServiceInAPI({
      titulo: newService.titulo,
      descripcion: newService.descripcion,
      categoria: newService.categoria.id,
      ubicacion: newService.ubicacion,
      costo: newService.costo,
      cliente_id: currentUser.id,
      cliente_nombre: currentUser.nombre,
      imagen: uploadedFile,
    });

    // Actualiza el estado del padre
    onCreate({
      ...newService,
      id: created._id,
      createdAt: created.created_at,
      proveedor: {
        id: created.cliente_id,
        nombre: created.cliente_nombre,
        avatar: created.cliente_foto_url
          ? `${AUTH_SERVICE_BASE_URL}${created.cliente_foto_url}`
          : '',
        rating: created.cliente_reputacion || 0.0,
      },
    });

      onClose();
    } catch (error) {
      alert('Ocurrió un error al crear el servicio.');
      console.error(error);
    }
  };

  const textFieldStyle = {
    InputProps: {
      sx: {
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        height: '48px',
        '& fieldset': {
          borderRadius: '12px',
        }
      }
    }
  };

  const descriptionTextFieldStyle = {
    InputProps: {
      sx: {
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        '& fieldset': {
          borderRadius: '12px',
        }
      }
    }
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {/* Título del modal */}
      <DialogTitle>Ofrecer un nuevo servicio</DialogTitle>
      <DialogContent>
        {/* Formulario para ingresar los datos del servicio */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Campo para el título */}
          <TextField
            label="Título del servicio"
            placeholder="Ej: Clases de guitarra para principiantes"
            value={newService.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            fullWidth
            {...textFieldStyle}
          />
          {/* Campo para la descripción */}
          <TextField
            label="Descripción"
            placeholder="Describe tu servicio en detalle"
            multiline
            rows={4}
            value={newService.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            fullWidth
            {...descriptionTextFieldStyle}
          />
          {/* Campo para el precio */}
          <TextField
            label="Precio (SkillCoins)"
            placeholder="Ej: 50"
            type="number"
            value={newService.costo}
            onChange={(e) => handleInputChange('costo', parseInt(e.target.value))}
            fullWidth
            {...textFieldStyle}
          />
          {/* Selector de categoría */}
          <FormControl fullWidth>
            <InputLabel id="category-label">Categoría</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={newService.categoria.id}
              label="Categoría"
              onChange={(e) => {
                const selectedCategory = categories.find(cat => cat.id === e.target.value);
                if (selectedCategory) {
                  handleInputChange('categoria', selectedCategory);
                }
              }}
              {...selectStyle}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Campo para la ubicación */}
          <TextField
            label="Ubicación"
            placeholder="Ej: Bogotá, Chapinero"
            value={newService.ubicacion}
            onChange={(e) => handleInputChange('ubicacion', e.target.value)}
            fullWidth
            {...textFieldStyle}
          />
          {/* Campo para la URL de la imagen */}
          <TextField
            label="Imagen URL"
            placeholder="Ej: URL de la imagen"
            value={newService.imagen}
            onChange={(e) => handleInputChange('imagen', e.target.value)}
            fullWidth
            {...textFieldStyle}
            InputProps={{
              ...textFieldStyle.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <Button component="label" size="small" sx={{ minWidth: 0, p: 0 }}>
                    Subir
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          {/* Previsualización de la imagen subida */}
          {newService.imagen && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <img
                src={newService.imagen}
                alt="Previsualización"
                style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, border: '1px solid #eee' }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      {/* Botones de acción del modal */}
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleCreateService} variant="contained" color="primary">
          Crear servicio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceModal;
