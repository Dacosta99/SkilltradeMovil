import type { Transaction, ServiceHistoryItem } from '../types/transaction';

export const TRANSACTIONS_SERVICE_BASE_URL =
  'https://transacciones-api-40c39ea620a5.herokuapp.com';

export const buildTransactionsUrl = (path: string) =>
  `${TRANSACTIONS_SERVICE_BASE_URL}${path}`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = 'Error al comunicarse con transacciones';
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch (err) {
      // ignore parse errors
    }
    throw new Error(detail);
  }
  return response.json();
}

export const transactionsService = {
  async getBalance(userId: string): Promise<number> {
    const response = await fetch(buildTransactionsUrl(`/api/saldo/${userId}`));
    const data = await handleResponse<{ saldo: number }>(response);
    return data.saldo ?? 0;
  },

  async getHistory(userId: string): Promise<Transaction[]> {
    const response = await fetch(
      buildTransactionsUrl(`/api/transacciones/historial/${userId}`)
    );
    const data = await handleResponse<any[]>(response);
    return data.map((tx) => ({
      ...tx,
      status:
        tx.status === 'completado'
          ? 'completed'
          : tx.status === 'pendiente'
          ? 'pending'
          : tx.status === 'cancelado'
        ? 'cancelled'
        : tx.status ?? 'completed',
    }));
  },

  async getServiceHistory(
    userId: string
  ): Promise<{ contratados: ServiceHistoryItem[]; prestados: ServiceHistoryItem[] }> {
    const response = await fetch(
      buildTransactionsUrl(`/api/transacciones/servicios/${userId}`)
    );
    return handleResponse<{
      contratados: ServiceHistoryItem[];
      prestados: ServiceHistoryItem[];
    }>(response);
  },

  async requestService(payload: {
    servicio_id: string;
    comprador_id: string;
    proveedor_id: string;
    monto: number;
    descripcion?: string;
  }) {
    const response = await fetch(
      buildTransactionsUrl('/api/transacciones/servicio/solicitar'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    return handleResponse<any>(response);
  },

  async getPendingServiceRequests(proveedorId: string) {
    const response = await fetch(
      buildTransactionsUrl(`/api/transacciones/servicio/pendientes/${proveedorId}`)
    );
    return handleResponse<ServiceHistoryItem[]>(response);
  },

  async acceptServiceRequest(transaccionId: string, proveedorId: string) {
    const response = await fetch(
      buildTransactionsUrl(`/api/transacciones/servicio/${transaccionId}/aceptar`),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proveedor_id: proveedorId }),
      }
    );
    return handleResponse<ServiceHistoryItem>(response);
  },
};
