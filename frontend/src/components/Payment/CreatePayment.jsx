import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { CreditCard, LocalShipping, CheckCircle, ArrowBack } from '@mui/icons-material';

const CreatePayment = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [auction, setAuction] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    // Get auction details
    const fetchData = async () => {
      try {
        // First, get auction details
        const auctionResponse = await axios.get(`http://localhost:5000/api/v1/auctionitem/auction/${auctionId}`, {
          withCredentials: true
        });
        
        setAuction(auctionResponse.data.auctionItem);
        
        // Then create payment transaction
        const paymentResponse = await axios.post(`http://localhost:5000/api/v1/payment/create/${auctionId}`, {}, {
          withCredentials: true
        });

        if (paymentResponse.data.success) {
          setTransactionId(paymentResponse.data.transaction._id);
          
          // Redirect to payment page
          navigate(`/payment/${paymentResponse.data.transaction._id}`);
        } else {
          setError(paymentResponse.data.message || 'Failed to create payment transaction');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || 'An error occurred while processing your request');
        setLoading(false);
      }
    };

    fetchData();
  }, [auctionId, navigate]);

  const handleBack = () => {
    navigate('/winning-bids');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>Creating your payment...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Back to Winning Auctions
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }}>Redirecting to payment...</Typography>
    </Container>
  );
};

export default CreatePayment; 