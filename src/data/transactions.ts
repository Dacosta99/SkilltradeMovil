import type { Transaction } from '../types/transaction';

export const transactions: Transaction[] = [
  {
    id: 'tx-001',
    type: 'received',
    amount: 50,
    date: '2023-06-15T14:30:00Z',
    description: 'Pago por clases de diseño gráfico',
    status: 'completed',
    counterparty: {
      id: 'user5',
      name: 'Miguel Fernández',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=6'
    }
  },
  {
    id: 'tx-002',
    type: 'sent',
    amount: 80,
    date: '2023-06-10T10:15:00Z',
    description: 'Reparación de ordenador',
    status: 'completed',
    counterparty: {
      id: 'user2',
      name: 'Ana Martínez',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=3'
    }
  },
  {
    id: 'tx-003',
    type: 'bonus',
    amount: 100,
    date: '2023-06-01T09:00:00Z',
    description: 'Bonificación por registro',
    status: 'completed',
    counterparty: {
      id: 'system',
      name: 'SkillTrade',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1'
    }
  },
  {
    id: 'tx-004',
    type: 'received',
    amount: 65,
    date: '2023-05-28T16:45:00Z',
    description: 'Pago por sesión de fotografía',
    status: 'completed',
    counterparty: {
      id: 'user7',
      name: 'Javier Torres',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=8'
    }
  },
  {
    id: 'tx-005',
    type: 'sent',
    amount: 45,
    date: '2023-05-20T11:30:00Z',
    description: 'Clases de yoga',
    status: 'completed',
    counterparty: {
      id: 'user6',
      name: 'Elena Ruiz',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=7'
    }
  },
  {
    id: 'tx-006',
    type: 'received',
    amount: 120,
    date: '2023-05-15T14:00:00Z',
    description: 'Diseño de logo para cliente',
    status: 'completed',
    counterparty: {
      id: 'user8',
      name: 'Carmen Díaz',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=9'
    }
  },
  {
    id: 'tx-007',
    type: 'sent',
    amount: 60,
    date: '2023-05-10T09:15:00Z',
    description: 'Clases de inglés',
    status: 'completed',
    counterparty: {
      id: 'user8',
      name: 'Carmen Díaz',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=9'
    }
  },
  {
    id: 'tx-008',
    type: 'received',
    amount: 90,
    date: '2023-05-05T15:30:00Z',
    description: 'Consultoría de marketing digital',
    status: 'completed',
    counterparty: {
      id: 'user9',
      name: 'Pablo Moreno',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=10'
    }
  },
  {
    id: 'tx-009',
    type: 'bonus',
    amount: 50,
    date: '2023-05-01T10:00:00Z',
    description: 'Bonificación por primera reseña',
    status: 'completed',
    counterparty: {
      id: 'system',
      name: 'SkillTrade',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1'
    }
  },
  {
    id: 'tx-010',
    type: 'sent',
    amount: 70,
    date: '2023-04-28T14:45:00Z',
    description: 'Reparación de bicicleta',
    status: 'completed',
    counterparty: {
      id: 'user9',
      name: 'Pablo Moreno',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=10'
    }
  }
];
