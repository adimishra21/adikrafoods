import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, TextField, CircularProgress, Alert, Stepper, Step, StepLabel, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const steps = ['Delivery Information', 'Payment', 'Review Order'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cart');
      setCartItems(response.data.cartItems || []);
      calculateTotal(response.data.cartItems || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items. Please try again later.');
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setTotalPrice(total);
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({
      ...deliveryInfo,
      [name]: value,
    });
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        deliveryAddress: `${deliveryInfo.streetAddress}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zipCode}`,
        customerName: deliveryInfo.fullName,
        customerPhone: deliveryInfo.phoneNumber,
        paymentMethod: 'CARD', // Assuming card payment for now
      };
      
      const response = await api.post('/api/orders', orderData);
      
      setLoading(false);
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate>
            <Typography variant="h6" gutterBottom>
              Delivery Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  value={deliveryInfo.fullName}
                  onChange={handleDeliveryInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  value={deliveryInfo.phoneNumber}
                  onChange={handleDeliveryInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="streetAddress"
                  label="Street Address"
                  name="streetAddress"
                  value={deliveryInfo.streetAddress}
                  onChange={handleDeliveryInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  value={deliveryInfo.city}
                  onChange={handleDeliveryInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State"
                  name="state"
                  value={deliveryInfo.state}
                  onChange={handleDeliveryInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  required
                  fullWidth
                  id="zipCode"
                  label="Zip Code"
                  name="zipCode"
                  value={deliveryInfo.zipCode}
                  onChange={handleDeliveryInfoChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box component="form" noValidate>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="cardNumber"
                  label="Card Number"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nameOnCard"
                  label="Name on Card"
                  name="nameOnCard"
                  value={paymentInfo.nameOnCard}
                  onChange={handlePaymentInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="expiryDate"
                  label="Expiry Date (MM/YY)"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handlePaymentInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="cvv"
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentInfoChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 3 }}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>
                    {item.quantity} x {item.name}
                  </Typography>
                  <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery Fee:</Typography>
                <Typography>$2.99</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${(totalPrice + 2.99).toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Delivery Information
            </Typography>
            <Typography>{deliveryInfo.fullName}</Typography>
            <Typography>{deliveryInfo.phoneNumber}</Typography>
            <Typography>{deliveryInfo.streetAddress}</Typography>
            <Typography>
              {deliveryInfo.city}, {deliveryInfo.state} {deliveryInfo.zipCode}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Payment Information
            </Typography>
            <Typography>Card ending in {paymentInfo.cardNumber.slice(-4)}</Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading && activeStep !== 2) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Checkout
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 2, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
              disabled={loading}
            >
              {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
            </Button>
            {loading && activeStep === steps.length - 1 && (
              <CircularProgress size={24} sx={{ ml: 2 }} />
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout; 