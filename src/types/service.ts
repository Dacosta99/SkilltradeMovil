export interface Service {
  id: string;
  titulo: string;
  descripcion: string;
  costo: number;
  imagen: string;
  ubicacion: string;
  categoria: any;
  proveedor: {
    id: string;
    nombre: string;
    avatar: string;
    rating: number;
  };
  createdAt?: string;
  visible?: boolean; 
}

export interface ServiceProfile {
  id: string;
  titulo: string;
  descripcion: string;
  costo: number;
  imagen: string;
  ubicacion: string;
  categoria: any;
  createdAt?: string;
  visible?: boolean; 
}