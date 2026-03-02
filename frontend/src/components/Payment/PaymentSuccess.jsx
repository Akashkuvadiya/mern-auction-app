import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Button, Paper, Divider, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const razorpayPaymentId = searchParams.get('razorpay_payment_id');
        const razorpayOrderId = searchParams.get('razorpay_order_id');
        const razorpaySignature = searchParams.get('razorpay_signature');

        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
          setError('Missing payment information. Please try again or contact support.');
          setLoading(false);
          return;
        }

        // Verify the payment with backend
        const response = await axios.post(`http://localhost:5000/api/v1/payment/verify/${transactionId}`, {
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature
        }, {
          withCredentials: true
        });

        setPaymentDetails(response.data.transaction);
        setLoading(false);
      } catch (error) {
        console.error('Payment verification error:', error);
        setError(error.response?.data?.message || 'Failed to verify payment. Please contact support.');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, transactionId]);

  const handleGoToAuctions = () => {
    navigate('/winning-bids');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Verifying your payment...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
          <Typography variant="body1" paragraph>
            We encountered an issue while processing your payment. This doesn't necessarily mean your payment failed.
            Please check your email for confirmation or contact support if your payment was deducted.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleGoToAuctions}
          >
            Go to My Winning Auctions
          </Button>
        </Paper>
      </Container>
    );
  }

  const getAuctionName = () => {
    if (!paymentDetails || !paymentDetails.auction) return 'Auction Item';
    return paymentDetails.auction.title || paymentDetails.auction.itemName || 'Auction Item';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your transaction has been completed successfully
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Payment Details</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">Transaction ID:</Typography>
            <Typography variant="body1">{paymentDetails?._id || transactionId}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">Amount Paid:</Typography>
            <Typography variant="body1">₹{paymentDetails?.amount?.toLocaleString() || '-'}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">Payment ID:</Typography>
            <Typography variant="body1">{paymentDetails?.razorpayPaymentId || searchParams.get('razorpay_payment_id')}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">Item:</Typography>
            <Typography variant="body1">{getAuctionName()}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">Status:</Typography>
            <Typography variant="body1" color="success.main">
              {paymentDetails?.status || 'Successful'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            A confirmation email has been sent to your registered email address.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToAuctions}
            sx={{ mt: 2 }}
          >
            Go to My Winning Auctions
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess; 