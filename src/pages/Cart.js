import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, 
  Button, CircularProgress, Divider, IconButton, TextField, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../auth/authContext';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [address, setAddress] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchCartItems();
  }, [isAuthenticated, navigate]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cart');
      setCartItems(response.data);
      calculateTotal(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to load cart items. Please try again later.');
      
      // Use sample data for demonstration
      const sampleCartItems = [
        {
          id: 1,
          menuItem: {
            id: 1,
            name: 'Butter Chicken',
            description: 'Creamy tomato sauce with tender chicken pieces',
            price: 15.99,
            imageUrl: 'https://source.unsplash.com/random?butter-chicken',
            category: 'non-veg',
            foodType: 'Indian'
          },
          quantity: 2,
          totalPrice: 31.98
        },
        {
          id: 2,
          menuItem: {
            id: 2,
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato, mozzarella, and basil',
            price: 12.99,
            imageUrl: 'https://source.unsplash.com/random?pizza',
            category: 'veg',
            foodType: 'Italian'
          },
          quantity: 1,
          totalPrice: 12.99
        }
      ];
      
      setCartItems(sampleCartItems);
      calculateTotal(sampleCartItems);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.totalPrice || item.menuItem.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const updatedItems = cartItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            quantity: newQuantity,
            totalPrice: item.menuItem.price * newQuantity
          };
          return updatedItem;
        }
        return item;
      });
      
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
      
      await api.put(`/api/cart/${itemId}`, { quantity: newQuantity });
    } catch (err) {
      console.error('Error updating quantity:', err);
      fetchCartItems(); // Refresh cart on error
    }
  };

  const handleRemoveItem = async (itemId) => {
    setSelectedItem(itemId);
    setOpenDialog(true);
  };

  const confirmRemoveItem = async () => {
    try {
      await api.delete(`/api/cart/${selectedItem}`);
      const updatedItems = cartItems.filter(item => item.id !== selectedItem);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
      setOpenDialog(false);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError('Please provide a delivery address');
      return;
    }
    
    try {
      setCheckoutLoading(true);
      await api.post('/api/orders', { deliveryAddress: address });
      navigate('/orders');
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, color: 'text.primary', fontWeight: 'bold' }}>
        Your Cart
      </Typography>
      
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {cartItems.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Add items from restaurants to get started
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
          >
            Browse Restaurants
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.dark' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={item.menuItem.imageUrl || 'https://source.unsplash.com/random?food'}
                            alt={item.menuItem.name}
                            sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                              {item.menuItem.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.menuItem.foodType}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ color: 'text.primary' }}>
                          ${item.menuItem.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                handleUpdateQuantity(item.id, value);
                              }
                            }}
                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            sx={{ width: 40, mx: 1 }}
                            variant="standard"
                          />
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper', boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    ${totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Delivery Fee
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    $2.99
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Tax
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    ${(totalAmount * 0.08).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  ${(totalAmount + 2.99 + totalAmount * 0.08).toFixed(2)}
                </Typography>
              </Box>
              
              <TextField
                label="Delivery Address"
                fullWidth
                multiline
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Enter your full delivery address"
                required
              />
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={checkoutLoading || cartItems.length === 0}
                sx={{ py: 1.5 }}
              >
                {checkoutLoading ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Checkout'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this item from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmRemoveItem} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart; 