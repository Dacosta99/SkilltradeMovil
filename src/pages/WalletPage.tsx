import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
  Typography,
  Grid,
  Container,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Icon } from '@iconify/react';
import { TransactionHistory } from '../components/transaction-history';
import { authService } from '../services/authService';
import { transactionsService } from '../services/transactionsService';
import type { Transaction } from '../types/transaction';

export const WalletPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [transferAmount, setTransferAmount] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [transferNote, setTransferNote] = React.useState('');
  const [tabValue, setTabValue] = React.useState('all');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [balance, setBalance] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    if (!user?.id) return;

    const loadWallet = async () => {
      try {
        setLoading(true);
        const [saldo, history] = await Promise.all([
          transactionsService.getBalance(user.id),
          transactionsService.getHistory(user.id)
        ]);
        setBalance(saldo);
        setTransactions(history);
      } catch (err) {
        console.error('Error al cargar el monedero', err);
        setBalance(0);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, [user?.id]);

  const totalIngresos = transactions
    .filter(t => t.type === 'received' || t.type === 'bonus')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGastos = transactions
    .filter(t => t.type === 'sent')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleTransfer = () => {
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
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
      <Box sx={{ maxWidth: '1300px', margin: '0 auto', py: { xs: 2, sm: 4, md: 6 } }}>
        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title={<Typography variant="h5" fontWeight="bold">Mi Monedero</Typography>}
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" py={isXs ? 2 : 4}>
                    <Typography variant={isXs ? 'h4' : 'h3'} color="primary" fontWeight="bold" mb={1}>
                      <span className="skill-coin">{balance}</span>
                    </Typography>
                    <Typography color="text.secondary" mb={2}>Balance actual</Typography>

                    <Box
                      display="flex"
                      gap={2}
                      width="100%"
                      flexDirection={isXs ? 'column' : 'row'}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<Icon icon="lucide:send" />}
                        onClick={() => setIsDialogOpen(true)}
                        size={isXs ? 'medium' : 'large'}
                      >
                        Transferir
                      </Button>

                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        startIcon={<Icon icon="lucide:plus" />}
                        size={isXs ? 'medium' : 'large'}
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
                        <span className="skill-coin">{totalIngresos}</span>
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
                        <span className="skill-coin">{totalGastos}</span>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title={<Typography variant="h6" fontWeight="bold">Actividad reciente</Typography>} sx={{ pb: 0 }} />
                <CardContent>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {loading ? (
                      <Typography color="text.secondary">Cargando actividad...</Typography>
                    ) : transactions.length === 0 ? (
                      <Typography color="text.secondary">Sin movimientos recientes</Typography>
                    ) : (
                      transactions.slice(0, 3).map((transaction) => (
                        <Box key={transaction.id} display="flex" alignItems="center" gap={2}>
                          <Box sx={{
                            p: 1,
                            borderRadius: '50%',
                            bgcolor:
                              transaction.type === 'received' ? 'success.light' :
                              transaction.type === 'sent' ? 'error.light' : 'primary.light',
                            color:
                              transaction.type === 'received' ? 'success.main' :
                              transaction.type === 'sent' ? 'error.main' : 'primary.main',
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

                          <Box flexGrow={1} minWidth={0}>
                            <Typography fontWeight={500} noWrap>{transaction.description}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(transaction.date).toLocaleDateString('es-ES')}
                            </Typography>
                          </Box>

                          <Typography fontWeight={600} color={transaction.type === 'received' || transaction.type === 'bonus' ? 'success.main' : 'error.main'}>
                            {transaction.type === 'received' || transaction.type === 'bonus' ? '+' : '-'}
                            <span className="skill-coin">{transaction.amount}</span>
                          </Typography>
                        </Box>
                      ))
                    )}

                    <Button variant="text" color="primary" fullWidth endIcon={<Icon icon="lucide:chevron-right" />}>Ver todo</Button>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardHeader title={<Typography variant="h6" fontWeight="bold">Historial de transacciones</Typography>} />
              <CardContent>
                <Tabs
                  value={tabValue}
                  onChange={(_, v) => setTabValue(v)}
                  aria-label="Transacciones"
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                >
                  <Tab value="all" label="Todas" />
                  <Tab value="received" label="Recibidas" />
                  <Tab value="sent" label="Enviadas" />
                  <Tab value="bonus" label="Bonificaciones" />
                </Tabs>

                <Box mt={2} sx={{
                  maxHeight: { xs: '55vh', sm: '65vh', md: '70vh' },
                  overflowY: 'auto',
                  pr: 1
                }}>
                  {loading ? (
                    <Typography color="text.secondary">Cargando historial...</Typography>
                  ) : (
                    <>
                      {tabValue === 'all' && <TransactionHistory transactions={transactions} />}
                      {tabValue === 'received' && <TransactionHistory transactions={transactions.filter(t => t.type === 'received')} />}
                      {tabValue === 'sent' && <TransactionHistory transactions={transactions.filter(t => t.type === 'sent')} />}
                      {tabValue === 'bonus' && <TransactionHistory transactions={transactions.filter(t => t.type === 'bonus')} />}
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Transferir SkillCoins</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Autocomplete
              options={users}
              getOptionLabel={option => option.name}
              value={selectedUser}
              onChange={(_, value) => setSelectedUser(value)}
              renderOption={(props, option) => (
                <Box component="li" {...props} display="flex" alignItems="center" gap={2}>
                  <Avatar src={option.avatar} sx={{ width: 28, height: 28 }} />
                  <Typography noWrap>{option.name}</Typography>
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
              InputProps={{ startAdornment: <span className="skill-coin" /> }}
              helperText={`Balance disponible: ${balance} SkillCoins`}
            />

            <TextField
              label="Concepto (opcional)"
              placeholder="Ej: Pago por clases de piano"
              value={transferNote}
              onChange={e => setTransferNote(e.target.value)}
              multiline
              rows={isXs ? 2 : 3}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="error">Cancelar</Button>
          <Button
            onClick={handleTransfer}
            color="primary"
            variant="contained"
            disabled={!selectedUser || !transferAmount || parseInt(transferAmount) <= 0 || parseInt(transferAmount) > (balance || 0)}
          >
            Transferir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletPage;
