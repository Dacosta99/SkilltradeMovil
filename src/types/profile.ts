export interface Profile {
    id: string;
    nombre: string;
    correo: string;
    telefono: string;
    fotoUrl?: string; // opcional
    reputacion?: number; // opcional
    direccion?: string; // opcional
    skills?: string[]; // opcional
    saldo_creditos: number;
}