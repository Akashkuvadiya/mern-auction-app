import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  ArrowForward,
  AttachMoney,
  ReceiptLong,
  AccountBalance
} from '@mui/icons-material';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
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

const PaymentManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [transactionDetailOpen, setTransactionDetailOpen] = useState(false);
  const [withdrawalDetailOpen, setWithdrawalDetailOpen] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState('');
  const [withdrawalRemarks, setWithdrawalRemarks] = useState('');
  const [razorpayPayoutId, setRazorpayPayoutId] = useState('');
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, [tabValue, page, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tabValue === 0) {
        // Fetch transactions
        const response = await axios.get(`/api/v1/payment/transactions?page=${page}&status=${filterStatus}`);
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } else {
        // Fetch withdrawals
        const response = await axios.get(`/api/v1/payment/withdrawals?page=${page}&status=${filterStatus}`);
        setWithdrawals(response.data.withdrawals);
        setTotalPages(response.data.totalPages);
      }
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
    setFilterStatus('');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(1);
  };

  const handleOpenTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailOpen(true);
  };

  const handleCloseTransactionDetail = () => {
    setTransactionDetailOpen(false);
  };

  const handleOpenWithdrawalDetail = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setWithdrawalStatus('');
    setWithdrawalRemarks('');
    setRazorpayPayoutId('');
    setWithdrawalDetailOpen(true);
  };

  const handleCloseWithdrawalDetail = () => {
    setWithdrawalDetailOpen(false);
  };

  const handleSettlePayment = async (transactionId) => {
    try {
      setLoading(true);
      await axios.post(`/api/v1/payment/settle/${transactionId}`);
      fetchData();
      handleCloseTransactionDetail();
      alert('Payment settled successfully');
    } catch (error) {
      console.error('Error settling payment:', error);
      alert(error.response?.data?.message || 'Failed to settle payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async () => {
    if (!withdrawalStatus) {
      alert('Please select a status');
      return;
    }

    setProcessingWithdrawal(true);
    try {
      await axios.post(`/api/v1/payment/process-withdrawal/${selectedWithdrawal._id}`, {
        status: withdrawalStatus,
        remarks: withdrawalRemarks,
        razorpayPayoutId: razorpayPayoutId,
      });
      
      fetchData();
      handleCloseWithdrawalDetail();
      alert('Withdrawal processed successfully');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert(error.response?.data?.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  const getStatusChip = (status) => {
    let color = 'default';
    let icon = null;

    switch (status) {
      case 'Pending':
        color = 'warning';
        break;
      case 'Processing':
        color = 'info';
        break;
      case 'Approved':
      case 'Completed':
      case 'Settled':
        color = 'success';
        icon = <CheckCircle fontSize="small" />;
        break;
      case 'Failed':
        color = 'error';
        icon = <Cancel fontSize="small" />;
        break;
      default:
        color = 'default';
    }

    return (
      <Chip 
        label={status} 
        color={color}
        size="small"
        icon={icon}
      />
    );
  };

  if (loading && page === 1 && transactions.length === 0 && withdrawals.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Payment Management
      </Typography>

      <Grid container spacing={4}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ReceiptLong sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h6">Total Transactions</Typography>
                  </Box>
                  <Typography variant="h4">
                    {transactions.length > 0 ? transactions.length : '—'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h6">Amount Processed</Typography>
                  </Box>
                  <Typography variant="h4">
                    ${transactions.reduce((sum, t) => sum + (t.status === 'Settled' ? t.amount : 0), 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalance sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h6">Pending Withdrawals</Typography>
                  </Box>
                  <Typography variant="h4">
                    {withdrawals.filter(w => w.status === 'Pending').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Tabs and Filters */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Transactions" />
                <Tab label="Withdrawals" />
              </Tabs>
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={handleStatusFilterChange}
                  label="Filter Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {tabValue === 0 ? (
                    <>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Settled">Settled</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>
            </Box>

            {/* Transactions Tab */}
            <TabPanel value={tabValue} index={0}>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              
              {transactions.length > 0 ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Auction Item</TableCell>
                          <TableCell>Bidder</TableCell>
                          <TableCell>Auctioneer</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction._id}>
                            <TableCell>
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{transaction.auction?.itemName || '—'}</TableCell>
                            <TableCell>{transaction.bidder?.userName || '—'}</TableCell>
                            <TableCell>{transaction.auctioneer?.userName || '—'}</TableCell>
                            <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusChip(transaction.status)}</TableCell>
                            <TableCell>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenTransactionDetail(transaction)}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              {transaction.status === 'Approved' && (
                                <Tooltip title="Settle Payment">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleSettlePayment(transaction._id)}
                                  >
                                    <ArrowForward fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={handlePageChange} 
                      color="primary" 
                    />
                  </Box>
                </>
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  No transactions found.
                </Typography>
              )}
            </TabPanel>

            {/* Withdrawals Tab */}
            <TabPanel value={tabValue} index={1}>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              
              {withdrawals.length > 0 ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Auctioneer</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Transfer Method</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {withdrawals.map((withdrawal) => (
                          <TableRow key={withdrawal._id}>
                            <TableCell>
                              {new Date(withdrawal.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{withdrawal.user?.userName || '—'}</TableCell>
                            <TableCell>${withdrawal.amount.toLocaleString()}</TableCell>
                            <TableCell>{withdrawal.transferMethod}</TableCell>
                            <TableCell>{getStatusChip(withdrawal.status)}</TableCell>
                            <TableCell>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenWithdrawalDetail(withdrawal)}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={handlePageChange} 
                      color="primary" 
                    />
                  </Box>
                </>
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                  No withdrawals found.
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={transactionDetailOpen}
        onClose={handleCloseTransactionDetail}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent dividers>
          {selectedTransaction && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Transaction ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedTransaction._id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Typography variant="body1" gutterBottom>
                    {getStatusChip(selectedTransaction.status)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                  <Typography variant="body1" gutterBottom>${selectedTransaction.amount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Auction Item</Typography>
                  <Typography variant="body1" gutterBottom>{selectedTransaction.auction?.itemName || '—'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Bidder</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTransaction.bidder?.userName || '—'}
                    {selectedTransaction.bidder?.email && <Typography variant="caption" display="block">{selectedTransaction.bidder.email}</Typography>}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Auctioneer</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedTransaction.auctioneer?.userName || '—'}
                    {selectedTransaction.auctioneer?.email && <Typography variant="caption" display="block">{selectedTransaction.auctioneer.email}</Typography>}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Commission Rate</Typography>
                  <Typography variant="body1" gutterBottom>{(selectedTransaction.commission?.rate || 0.05) * 100}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Commission Amount</Typography>
                  <Typography variant="body1" gutterBottom>
                    ${((selectedTransaction.commission?.amount) || (selectedTransaction.amount * 0.05)).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Payment Reference</Typography>
                  <Typography variant="body1" gutterBottom>{selectedTransaction.paymentReference || '—'}</Typography>
                </Grid>
                {selectedTransaction.razorpayPaymentId && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Razorpay Payment ID</Typography>
                    <Typography variant="body1" gutterBottom>{selectedTransaction.razorpayPaymentId}</Typography>
                  </Grid>
                )}
              </Grid>
              
              {selectedTransaction.status === 'Approved' && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    This payment has been approved and is ready to be settled to the auctioneer's wallet.
                  </Alert>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => handleSettlePayment(selectedTransaction._id)}
                  >
                    Settle Payment to Auctioneer
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransactionDetail}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Withdrawal Detail Dialog */}
      <Dialog
        open={withdrawalDetailOpen}
        onClose={handleCloseWithdrawalDetail}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Withdrawal Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedWithdrawal && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Withdrawal ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedWithdrawal._id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedWithdrawal.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Typography variant="body1" gutterBottom>
                    {getStatusChip(selectedWithdrawal.status)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                  <Typography variant="body1" gutterBottom>${selectedWithdrawal.amount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">User</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedWithdrawal.user?.userName || '—'}
                    {selectedWithdrawal.user?.email && <Typography variant="caption" display="block">{selectedWithdrawal.user.email}</Typography>}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Transfer Method</Typography>
                  <Typography variant="body1" gutterBottom>{selectedWithdrawal.transferMethod}</Typography>
                </Grid>
                
                {/* Show transfer details based on method */}
                {selectedWithdrawal.transferMethod === 'BankTransfer' && selectedWithdrawal.transferDetails?.bankTransfer && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Bank Details</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Account Name</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedWithdrawal.transferDetails.bankTransfer.accountName || '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Account Number</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedWithdrawal.transferDetails.bankTransfer.accountNumber || '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedWithdrawal.transferDetails.bankTransfer.bankName || '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">IFSC Code</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedWithdrawal.transferDetails.bankTransfer.ifscCode || '—'}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {selectedWithdrawal.transferMethod === 'RazorpayTransfer' && selectedWithdrawal.transferDetails?.razorpayTransfer && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Razorpay Details</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Account ID</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedWithdrawal.transferDetails.razorpayTransfer.accountId || '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Contact ID</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedWithdrawal.transferDetails.razorpayTransfer.contactId || '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Fund Account ID</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedWithdrawal.transferDetails.razorpayTransfer.fundAccountId || '—'}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {selectedWithdrawal.status === 'Pending' && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Process Withdrawal</Typography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Update Status</InputLabel>
                      <Select
                        value={withdrawalStatus}
                        onChange={(e) => setWithdrawalStatus(e.target.value)}
                        label="Update Status"
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      label="Remarks"
                      variant="outlined"
                      value={withdrawalRemarks}
                      onChange={(e) => setWithdrawalRemarks(e.target.value)}
                      sx={{ mb: 2 }}
                      multiline
                      rows={2}
                    />
                    
                    {selectedWithdrawal.transferMethod === 'RazorpayTransfer' && (
                      <TextField
                        fullWidth
                        label="Razorpay Payout ID"
                        variant="outlined"
                        value={razorpayPayoutId}
                        onChange={(e) => setRazorpayPayoutId(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    )}
                    
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleProcessWithdrawal}
                      disabled={processingWithdrawal || !withdrawalStatus}
                      startIcon={processingWithdrawal ? <CircularProgress size={20} /> : null}
                    >
                      {processingWithdrawal ? 'Processing...' : 'Update Withdrawal Status'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawalDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentManagement; 