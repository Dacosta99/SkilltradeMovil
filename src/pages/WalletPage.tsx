import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Avatar,
  Box,
  Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import { TransactionHistory } from '../components/transaction-history';
import { transactions } from '../data/transactions';
import { authService } from '../services/authService';

export const WalletPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [transferAmount, setTransferAmount] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [transferNote, setTransferNote] = React.useState('');
  const [tabValue, setTabValue] = React.useState('all');

  const handleTransfer = () => {
    // Aquí iría la lógica real de transferencia
    setIsDialogOpen(false);
    setTransferAmount('');
    setSelectedUser(null);
    setTransferNote('');
  };

  const users = [
    { name: 'Carlos Mendoza', id: 'user1', avatar: 'ornitorrinco.png' },
    { name: 'Ana Martínez', id: 'user2', avatar: 'ornitorrinco.png' },
    { name: 'Roberto Sánchez', id: 'user3', avatar: 'ornitorrinco.png' },
    { name: 'Laura Gómez', id: 'user4', avatar: 'ornitorrinco.png' },
    { name: 'Miguel Fernández', id: 'user5', avatar: 'ornitorrinco.png' },
  ];

  return (
    <Box maxWidth="lg" mx="auto" px={4} py={8} pb={16}>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', lg: '1fr 2fr' }} gap={4}>
        <Box>
          <Card sx={{ mb: 4 }}>
            <CardHeader title={<Typography variant="h5" fontWeight="bold">Mi Monedero</Typography>} sx={{ pb: 0 }} />
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" py={4}>
                <Typography variant="h3" color="primary" fontWeight="bold" mb={1}>
                  <span className="skill-coin">{user?.balance}</span>
                </Typography>
                <Typography color="text.secondary" mb={3}>Balance actual</Typography>
                <Box display="flex" gap={2} width="100%">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Icon icon="lucide:send" />}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Transferir
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Icon icon="lucide:plus" />}
                  >
                    Obtener más
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'success.light', color: 'success.main' }}>
                      <Icon icon="lucide:arrow-down-left" />
                    </Box>
                    <Typography>Ingresos</Typography>
                  </Box>
                  <Typography fontWeight={600} color="success.main">
                    <span className="skill-coin">350</span>
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'error.light', color: 'error.main' }}>
                      <Icon icon="lucide:arrow-up-right" />
                    </Box>
                    <Typography>Gastos</Typography>
                  </Box>
                  <Typography fontWeight={600} color="error.main">
                    <span className="skill-coin">100</span>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={<Typography variant="h6" fontWeight="bold">Actividad reciente</Typography>} sx={{ pb: 0 }} />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                {transactions.slice(0, 3).map((transaction) => (
                  <Box key={transaction.id} display="flex" alignItems="center" gap={2}>
                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor:
                      transaction.type === 'received' ? 'success.light' : transaction.type === 'sent' ? 'error.light' : 'primary.light',
                      color:
                        transaction.type === 'received' ? 'success.main' : transaction.type === 'sent' ? 'error.main' : 'primary.main',
                    }}>
                      <Icon
                        icon={
                          transaction.type === 'received'
                            ? 'lucide:arrow-down-left'
                            : transaction.type === 'sent'
                            ? 'lucide:arrow-up-right'
                            : 'lucide:gift'
                        }
                      />
                    </Box>
                    <Box flexGrow={1}>
                      <Typography fontWeight={500}>{transaction.description}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(transaction.date).toLocaleDateString('es-ES')}
                      </Typography>
                    </Box>
                    <Typography fontWeight={600} color={transaction.type === 'received' || transaction.type === 'bonus' ? 'success.main' : 'error.main'}>
                      {transaction.type === 'received' || transaction.type === 'bonus' ? '+' : '-'}
                      <span className="skill-coin">{transaction.amount}</span>
                    </Typography>
                  </Box>
                ))}
                <Button variant="text" color="primary" fullWidth endIcon={<Icon icon="lucide:chevron-right" />}>Ver todo</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardHeader title={<Typography variant="h6" fontWeight="bold">Historial de transacciones</Typography>} />
            <CardContent>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} aria-label="Transacciones">
                <Tab value="all" label="Todas" />
                <Tab value="received" label="Recibidas" />
                <Tab value="sent" label="Enviadas" />
                <Tab value="bonus" label="Bonificaciones" />
              </Tabs>
              <Box mt={2}>
                {tabValue === 'all' && <TransactionHistory transactions={transactions} />}
                {tabValue === 'received' && <TransactionHistory transactions={transactions.filter(t => t.type === 'received')} />}
                {tabValue === 'sent' && <TransactionHistory transactions={transactions.filter(t => t.type === 'sent')} />}
                {tabValue === 'bonus' && <TransactionHistory transactions={transactions.filter(t => t.type === 'bonus')} />}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Transferir SkillCoins</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <Autocomplete
              options={users}
              getOptionLabel={option => option.name}
              value={selectedUser}
              onChange={(_, value) => setSelectedUser(value)}
              renderOption={(props, option) => (
                <Box component="li" {...props} display="flex" alignItems="center" gap={2}>
                  <Avatar src={option.avatar} sx={{ width: 24, height: 24 }} />
                  <Typography>{option.name}</Typography>
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Destinatario" placeholder="Buscar usuario" />}
            />
            <TextField
              type="number"
              label="Cantidad"
              placeholder="0"
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
              InputProps={{ startAdornment: <span className="skill-coin"></span> }}
              helperText={`Balance disponible: ${user?.balance} SkillCoins`}
            />
            <TextField
              label="Concepto (opcional)"
              placeholder="Ej: Pago por clases de piano"
              value={transferNote}
              onChange={e => setTransferNote(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="error">Cancelar</Button>
          <Button
            onClick={handleTransfer}
            color="primary"
            variant="contained"
            disabled={!selectedUser || !transferAmount || parseInt(transferAmount) <= 0 || parseInt(transferAmount) > (user?.balance || 0)}
          >
            Transferir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};