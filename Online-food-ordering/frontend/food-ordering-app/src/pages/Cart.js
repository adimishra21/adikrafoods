import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  TextField,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { Delete, ArrowBack, Add, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/apiConfig';
import { useAuth } from '../auth/authContext';

const Cart = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    fetchCartData();
  }, [isAuthenticated, navigate]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cart');
      console.log('Cart response:', response.data);
      
      if (!response.data || !response.data.items || response.data.items.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }

      setCartItems(response.data.items);
      setRestaurant(response.data.restaurant);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/items/${itemId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      
      if (cartItems.length <= 1) {
        setError('Your cart is empty');
      }

      setSnackbarMessage('Item removed from cart');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error removing item:', error);
      setSnackbarMessage('Failed to remove item. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await api.put(`/api/cart/items/${itemId}`, { quantity: newQuantity });
      setCartItems((prevItems) => 
        prevItems.map((item) => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      setSnackbarMessage('Failed to update quantity. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        restaurantId: restaurant.id,
        items: cartItems.map((item) => ({
          foodId: item.id,
          quantity: item.quantity
        })),
        deliveryAddress: address,
        paymentMethod: paymentMethod
      };
      
      const response = await api.post('/api/orders', orderData);
      console.log('Order response:', response.data);
      
      setOrderId(response.data.id);
      setOrderPlaced(true);
      
      // Clear cart after successful order
      await api.delete('/api/cart');
      
      handleNext();
      setSnackbarMessage('Order placed successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again later.');
      setSnackbarMessage('Failed to place order. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSteps = () => {
    return ['Review Cart', 'Delivery Details', 'Order Confirmation'];
  };

  const steps = getSteps();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !cartItems.length) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
          >
            Browse Restaurants
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {activeStep === 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Your Order from {restaurant?.name}
            </Typography>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id} divider>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <ListItemText 
                        primary={item.name} 
                        secondary={`₹${item.price.toFixed(2)} each`} 
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                      <Typography>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{getTotalPrice().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery Fee</Typography>
                <Typography>₹40.00</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">₹{(getTotalPrice() + 40).toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
                disabled={cartItems.length === 0}
              >
                Continue to Delivery
              </Button>
            </Box>
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Delivery Address"
                  value={address}
                  onChange={handleAddressChange}
                  multiline
                  rows={3}
                  placeholder="Enter your full delivery address"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Method
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant={paymentMethod === 'CASH_ON_DELIVERY' ? 'contained' : 'outlined'}
                    onClick={() => handlePaymentMethodChange('CASH_ON_DELIVERY')}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    Cash on Delivery
                  </Button>
                  <Button
                    variant={paymentMethod === 'CREDIT_CARD' ? 'contained' : 'outlined'}
                    onClick={() => handlePaymentMethodChange('CREDIT_CARD')}
                    sx={{ mb: 1 }}
                  >
                    Credit Card
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Back to Cart
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handlePlaceOrder}
                disabled={!address}
              >
                Place Order
              </Button>
            </Box>
          </>
        )}
        
        {activeStep === 2 && (
          <>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Thank you for your order!
              </Typography>
              <Typography variant="body1" paragraph>
                Your order has been placed successfully.
              </Typography>
              {orderId && (
                <Typography variant="body2" paragraph>
                  Order ID: {orderId}
                </Typography>
              )}
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/orders')}
                  sx={{ mr: 2 }}
                >
                  View My Orders
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Cart; 