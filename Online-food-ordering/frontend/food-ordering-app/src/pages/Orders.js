import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Divider, 
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  ExpandMore, 
  AccessTime, 
  LocalShipping, 
  CheckCircle, 
  Cancel,
  Restaurant,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { api } from '../config/apiConfig';
import { useAuth } from '../auth/authContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'ACCEPTED':
      return 'info';
    case 'PREPARING':
      return 'info';
    case 'OUT_FOR_DELIVERY':
      return 'info';
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING':
      return <AccessTime />;
    case 'ACCEPTED':
      return <Restaurant />;
    case 'PREPARING':
      return <Restaurant />;
    case 'OUT_FOR_DELIVERY':
      return <LocalShipping />;
    case 'DELIVERED':
      return <CheckCircle />;
    case 'CANCELLED':
      return <Cancel />;
    default:
      return <AccessTime />;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

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

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">You haven't placed any orders yet.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Paper elevation={2}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Chip 
                      icon={getStatusIcon(order.status)} 
                      label={order.status.replace('_', ' ')} 
                      color={getStatusColor(order.status)} 
                      variant="outlined" 
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography>
                      {order.restaurant?.name || 'Restaurant'} - {order.items?.length || 0} item(s)
                    </Typography>
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {order.items?.map((item, index) => (
                      <ListItem key={index} divider={index < order.items.length - 1}>
                        <ListItemText
                          primary={item.menuItem?.name || 'Item'}
                          secondary={`Quantity: ${item.quantity}`}
                        />
                        <Typography variant="body2">
                          ${(item.menuItem?.price * item.quantity).toFixed(2) || '0.00'}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Delivery Details
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Address: {order.deliveryAddress || 'Not provided'}
                    </Typography>
                    <Typography variant="body2">
                      Payment Method: {order.paymentMethod?.replace('_', ' ') || 'Not specified'}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders; 