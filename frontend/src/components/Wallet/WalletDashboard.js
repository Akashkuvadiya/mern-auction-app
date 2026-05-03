import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  AccountBalanceWallet,
  AccountBalance,
  AttachMoney,
  ArrowUpward,
  ArrowDownward,
  Receipt,
  Info,
  AccessTime
} from '@mui/icons-material';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wallet-tabpanel-${index}`}
      aria-labelledby={`wallet-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WalletDashboard = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferMethod, setTransferMethod] = useState('BankTransfer');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/payment/wallet');
      setWalletData(response.data.wallet);
      setError('');
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError(error.response?.data?.message || 'Failed to load wallet information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleWithdrawOpen = () => {
    setWithdrawDialogOpen(true);
    setWithdrawAmount('');
    setTransferMethod('BankTransfer');
    setWithdrawError('');
    setWithdrawSuccess(false);
  };

  const handleWithdrawClose = () => {
    setWithdrawDialogOpen(false);
    if (withdrawSuccess) {
      fetchWalletData(); // Refresh wallet data if withdrawal was successful
    }
  };

  const handleWithdrawSubmit = async () => {
    // Validate amount
    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      setWithdrawError('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > walletData.balance) {
      setWithdrawError(`Insufficient funds. Your available balance is $ ${walletData.balance.toLocaleString()}`);
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError('');

    try {
      await axios.post('/api/v1/payment/withdraw', {
        amount: parseFloat(withdrawAmount),
        transferMethod
      });
      
      setWithdrawSuccess(true);
      setWithdrawError('');
    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawError(error.response?.data?.message || 'Failed to process withdrawal. Please try again later.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const getStatusChipProps = (status) => {
    switch(status) {
      case 'Completed':
        return { color: 'success', icon: <AttachMoney fontSize="small" /> };
      case 'Failed':
        return { color: 'error', icon: <Info fontSize="small" /> };
      case 'Pending':
        return { color: 'warning', icon: <AccessTime fontSize="small" /> };
      case 'Processing':
        return { color: 'info', icon: <ArrowUpward fontSize="small" /> };
      default:
        return { color: 'default', icon: <Info fontSize="small" /> };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading wallet information...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={fetchWalletData}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Wallet
      </Typography>
      
      <Grid container spacing={4}>
        {/* Wallet Balance Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h6">Wallet Balance</Typography>
            </Box>
            
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              $ {walletData?.balance?.toLocaleString() || '0'}
            </Typography>
            
            <Button 
              variant="contained" 
              fullWidth
              onClick={handleWithdrawOpen}
              sx={{ 
                mt: 2, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Withdraw Funds
            </Button>
          </Paper>
        </Grid>

        {/* Transaction Stats */}
        <Grid item xs={12} md={6} lg={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Receipt sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Transaction Overview</Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 1, bgcolor: 'rgba(63, 81, 181, 0.08)' }}>
                  <ArrowDownward sx={{ color: 'success.main', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Total Received</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                    $ {walletData?.transactions?.reduce((sum, t) => sum + t.amount, 0)?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 1, bgcolor: 'rgba(63, 81, 181, 0.08)' }}>
                  <ArrowUpward sx={{ color: 'error.main', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Total Withdrawn</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                    $ {walletData?.completedWithdrawals?.reduce((sum, w) => sum + (w.status === 'Completed' ? w.amount : 0), 0)?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, borderRadius: 1, bgcolor: 'rgba(63, 81, 181, 0.08)' }}>
                  <AccountBalance sx={{ color: 'warning.main', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Pending Withdrawals</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                    $ {walletData?.pendingWithdrawals?.reduce((sum, w) => sum + w.amount, 0)?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Transactions & Withdrawals Tabs */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Transaction History" />
              <Tab label="Withdrawal History" />
              <Tab label="Pending Withdrawals" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              {walletData?.transactions?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Auction Item</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Commission</TableCell>
                        <TableCell>Net Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {walletData.transactions.map((transaction) => {
                        const netAmount = transaction.amount - (transaction.commission?.amount || 0);
                        return (
                          <TableRow key={transaction._id}>
                            <TableCell>
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{transaction.auction?.itemName || 'Unknown Item'}</TableCell>
                            <TableCell>$ {transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>$ {(transaction.commission?.amount || 0).toLocaleString()}</TableCell>
                            <TableCell>$ {netAmount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Chip 
                                label={transaction.status} 
                                color={transaction.status === 'Settled' ? 'success' : 'primary'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No transactions found.
                </Typography>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {walletData?.completedWithdrawals?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Transfer Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {walletData.completedWithdrawals.map((withdrawal) => {
                        const { color, icon } = getStatusChipProps(withdrawal.status);
                        return (
                          <TableRow key={withdrawal._id}>
                            <TableCell>
                              {new Date(withdrawal.updatedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>$ {withdrawal.amount.toLocaleString()}</TableCell>
                            <TableCell>{withdrawal.transferMethod}</TableCell>
                            <TableCell>
                              <Chip 
                                icon={icon}
                                label={withdrawal.status} 
                                color={color}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{withdrawal.remarks || '-'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No withdrawal history found.
                </Typography>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              {walletData?.pendingWithdrawals?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date Requested</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Transfer Method</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {walletData.pendingWithdrawals.map((withdrawal) => {
                        const { color, icon } = getStatusChipProps(withdrawal.status);
                        return (
                          <TableRow key={withdrawal._id}>
                            <TableCell>
                              {new Date(withdrawal.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>$ {withdrawal.amount.toLocaleString()}</TableCell>
                            <TableCell>{withdrawal.transferMethod}</TableCell>
                            <TableCell>
                              <Chip 
                                icon={icon}
                                label={withdrawal.status} 
                                color={color}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No pending withdrawals.
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Withdraw Dialog */}
      <Dialog 
        open={withdrawDialogOpen} 
        onClose={handleWithdrawClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          {withdrawSuccess ? (
            <Alert severity="success" sx={{ my: 2 }}>
              Your withdrawal request has been submitted successfully. The funds will be transferred to your account shortly.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                Available Balance: <strong>$ {walletData?.balance?.toLocaleString() || '0'}</strong>
              </Typography>
              
              <TextField
                autoFocus
                margin="dense"
                label="Amount to Withdraw"
                type="number"
                fullWidth
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                error={!!withdrawError}
                helperText={withdrawError}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <FormControl fullWidth variant="outlined">
                <Select
                  value={transferMethod}
                  onChange={(e) => setTransferMethod(e.target.value)}
                >
                  <MenuItem value="BankTransfer">Bank Transfer</MenuItem>
                  <MenuItem value="RazorpayTransfer">Razorpay Transfer</MenuItem>
                  <MenuItem value="PayPalTransfer">PayPal Transfer</MenuItem>
                </Select>
                <FormHelperText>Select transfer method</FormHelperText>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWithdrawClose}>
            {withdrawSuccess ? 'Close' : 'Cancel'}
          </Button>
          {!withdrawSuccess && (
            <Button 
              onClick={handleWithdrawSubmit} 
              variant="contained"
              disabled={withdrawLoading}
              startIcon={withdrawLoading ? <CircularProgress size={20} /> : null}
            >
              Withdraw
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletDashboard; 