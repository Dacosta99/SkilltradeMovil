export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'bonus';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
  counterparty: {
    id: string;
    name: string;
    avatar: string;
  };
}
