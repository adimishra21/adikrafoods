import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress, Alert, Divider, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED':
        return 'primary';
      case 'PREPARING':
        return 'info';
      case 'OUT_FOR_DELIVERY':
        return 'warning';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Orders
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">You haven't placed any orders yet</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/')}
          >
            Browse Restaurants
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Order #{order.id}
                  </Typography>
                  <Chip 
                    label={order.orderStatus} 
                    color={getStatusColor(order.orderStatus)}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Placed on: {formatDate(order.createdAt)}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Items:
                </Typography>
                
                {order.items && order.items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>
                      {item.quantity} x {item.menuItem.name}
                    </Typography>
                    <Typography>${(item.menuItem.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Total:</Typography>
                  <Typography variant="subtitle1">${order.totalAmount.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Delivery Address:
                  </Typography>
                  <Typography>{order.deliveryAddress}</Typography>
                </Box>
                
                {order.orderStatus === 'DELIVERED' && (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/order/${order.id}/review`)}
                  >
                    Leave a Review
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders; 