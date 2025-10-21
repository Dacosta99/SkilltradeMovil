import type { Service, ServiceProfile } from '../types/service';
import { categories } from '../data/categories';
import { AUTH_SERVICE_BASE_URL } from './authService';

export const CATALOG_SERVICE_BASE_URL = 'https://serviciopublicaroferta-509f2fe03a28.herokuapp.com';

export const buildCatalogUrl = (path: string) => `${CATALOG_SERVICE_BASE_URL}${path}`;

export async function fetchServicesFromAPI(): Promise<Service[]> {
    const response = await fetch(buildCatalogUrl('/ofertas')); 
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error('Error al obtener los servicios');
    }

    return data.map((oferta: any): Service => ({
        id: oferta._id,
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        costo: oferta.costo,
        imagen: oferta.imagen_url
        ? `${CATALOG_SERVICE_BASE_URL}${oferta.imagen_url}`
        : '', // fallback si no hay imagen
        ubicacion: oferta.ubicacion,
        categoria: categories.find(c => c.id === oferta.categoria) || categories[0],
        proveedor: {
        id: oferta.cliente_id,
        nombre: oferta.cliente_nombre,
        avatar: oferta.cliente_foto_url
        ? `${AUTH_SERVICE_BASE_URL}${oferta.cliente_foto_url}`
        : '',
        rating: oferta.cliente_reputacion || 0.0,
        },
        createdAt: oferta.created_at,
    }));
}

export async function createServiceInAPI(service: {
    titulo: string;
    descripcion: string;
    categoria: string;
    ubicacion: string;
    costo: number;
    cliente_id: string;
    cliente_nombre: string;
    imagen: File; // opcional, si vas a usar imagen como URL por ahora
    }): Promise<any> {
    const formData = new FormData();
    formData.append('titulo', service.titulo);
    formData.append('descripcion', service.descripcion);
    formData.append('categoria', service.categoria);
    formData.append('ubicacion', service.ubicacion);
    formData.append('costo', String(service.costo));
    formData.append('cliente_id', service.cliente_id);
    formData.append('cliente_nombre', service.cliente_nombre);

    if (service.imagen) {
        formData.append('imagen', service.imagen);
    }

    const response = await fetch(buildCatalogUrl('/ofertas'), {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al crear la oferta');
    }

    return await response.json();
    }

    export async function fetchProfileServicesFromAPI(cliente_id: string) {
    const url = new URL(buildCatalogUrl(`/ofertas/cliente/${cliente_id}`));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Error al obtener los servicios');

    const data = await res.json();

    return data.map((oferta: any): ServiceProfile=> ({
        id: oferta._id,
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        costo: oferta.costo,
        imagen: oferta.imagen_url ? `${CATALOG_SERVICE_BASE_URL}${oferta.imagen_url}` : '',
        ubicacion: oferta.ubicacion,
        categoria: categories.find(c => c.id === oferta.categoria) || categories[0],
        createdAt: oferta.created_at,
        visible: oferta.visible,
    }));
}

export async function updateServiceVisibilityInAPI(serviceId: string): Promise<ServiceProfile> {
    const response = await fetch(buildCatalogUrl(`/ofertas/${serviceId}/visibility`), {
        method: 'PATCH',
        body: new URLSearchParams({ visible: String(false) }),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar la visibilidad del servicio');
    }

    return await response.json();
}
