export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'bonus';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
  id_servicio?: string | null;
  counterparty?: {
    id: string;
    name: string;
    avatar: string;
  } | null;
}

export interface ServiceHistoryItem {
  id: string;
  servicio_id?: string | null;
  titulo: string;
  fecha: string;
  estado: string;
  monto: number;
  contraparte?: {
    id: string;
    name: string;
    avatar: string;
  } | null;
}
