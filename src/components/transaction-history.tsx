import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Typography,
  Box
} from '@mui/material';
import { Icon } from '@iconify/react';
import type { Transaction } from '../types/transaction';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Table aria-label="Historial de transacciones">
      <TableHead>
        <TableRow>
          <TableCell>TIPO</TableCell>
          <TableCell>DETALLES</TableCell>
          <TableCell>FECHA</TableCell>
          <TableCell>MONTO</TableCell>
          <TableCell>ESTADO</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    bgcolor:
                      transaction.type === 'received'
                        ? 'success.light'
                        : transaction.type === 'sent'
                        ? 'error.light'
                        : 'primary.light',
                    color:
                      transaction.type === 'received'
                        ? 'success.main'
                        : transaction.type === 'sent'
                        ? 'error.main'
                        : 'primary.main',
                  }}
                >
                  <Icon
                    icon={
                      transaction.type === 'received'
                        ? 'lucide:arrow-down-left'
                        : transaction.type === 'sent'
                        ? 'lucide:arrow-up-right'
                        : 'lucide:gift'
                    }
                    style={{ fontSize: 20 }}
                  />
                </Box>
                <Typography fontWeight={500} textTransform="capitalize">
                  {transaction.type === 'received'
                    ? 'Recibido'
                    : transaction.type === 'sent'
                    ? 'Enviado'
                    : 'Bonificación'}
                </Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={transaction.counterparty.avatar} sx={{ width: 32, height: 32 }} />
                <Box>
                  <Typography fontWeight={500}>{transaction.counterparty.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.description}
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" flexDirection="column">
                <Typography>{formatDate(transaction.date)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {transaction.id.substring(0, 8)}
                </Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Typography
                fontWeight={600}
                color={
                  transaction.type === 'received' || transaction.type === 'bonus'
                    ? 'success.main'
                    : 'error.main'
                }
              >
                {transaction.type === 'received' || transaction.type === 'bonus' ? '+' : '-'}
                <span className="skill-coin">{transaction.amount}</span>
              </Typography>
            </TableCell>
            <TableCell>
              <Chip
                color={
                  transaction.status === 'completed'
                    ? 'success'
                    : transaction.status === 'pending'
                    ? 'warning'
                    : 'error'
                }
                size="small"
                label={
                  transaction.status === 'completed'
                    ? 'Completado'
                    : transaction.status === 'pending'
                    ? 'Pendiente'
                    : 'Cancelado'
                }
                variant="outlined"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};