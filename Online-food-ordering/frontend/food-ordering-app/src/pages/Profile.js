import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Avatar, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Rating,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Event as EventIcon,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../auth/authContext';
import { api } from '../config/apiConfig';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tabValue === 1) {
      fetchOrders();
    } else if (tabValue === 2) {
      fetchFavorites();
    }
  }, [tabValue]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      console.log('Orders response:', response.data);
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/favorites');
      console.log('Favorites response:', response.data);
      setFavorites(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset form data if canceling edit
      setFormData({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Updated profile data:', formData);
    setEditMode(false);
  };

  const renderLoadingOrError = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ ml: 3 }}>
                <Typography variant="h4" gutterBottom>
                  {user?.fullName || 'User Profile'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user?.email || 'No email provided'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<CartIcon />} label="Orders" />
              <Tab icon={<FavoriteIcon />} label="Favorites" />
              <Tab icon={<PaymentIcon />} label="Payment" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<EventIcon />} label="Events" />
            </Tabs>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      multiline
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleEditToggle}
                      >
                        {editMode ? 'Cancel' : 'Edit Profile'}
                      </Button>
                      {editMode && (
                        <Button
                          variant="contained"
                          type="submit"
                        >
                          Save Changes
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Your Orders
              </Typography>
              {renderLoadingOrError()}
              {!loading && !error && orders.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  No orders found.
                </Typography>
              )}
              {!loading && !error && orders.length > 0 && (
                <Grid container spacing={2}>
                  {orders.map((order) => (
                    <Grid item xs={12} key={order.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                              Order #{order.id}
                            </Typography>
                            <Chip 
                              label={order.status} 
                              color={order.status === 'DELIVERED' ? 'success' : 'primary'} 
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Ordered on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <List>
                            {order.items.map((item, index) => (
                              <ListItem key={index} divider={index < order.items.length - 1}>
                                <ListItemText
                                  primary={item.name}
                                  secondary={`Quantity: ${item.quantity}`}
                                />
                                <Typography variant="body2">
                                  ₹{item.price * item.quantity}
                                </Typography>
                              </ListItem>
                            ))}
                          </List>
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">
                              Total Amount
                            </Typography>
                            <Typography variant="subtitle1">
                              ₹{order.totalAmount}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* Favorites Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Favorite Restaurants
              </Typography>
              {renderLoadingOrError()}
              {!loading && !error && favorites.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  No favorite restaurants yet.
                </Typography>
              )}
              {!loading && !error && favorites.length > 0 && (
                <Grid container spacing={3}>
                  {favorites.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                      <Card 
                        component={Link} 
                        to={`/restaurant/${restaurant.id}`}
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          textDecoration: 'none',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            transition: 'transform 0.2s ease-in-out'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={restaurant.imageUrl}
                          alt={restaurant.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="h3">
                            {restaurant.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={restaurant.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {restaurant.rating}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {restaurant.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {restaurant.openingTime} - {restaurant.closingTime}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* Payment Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Payment Methods
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No payment methods added.
              </Typography>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No notifications.
              </Typography>
            </TabPanel>

            {/* Events Tab */}
            <TabPanel value={tabValue} index={5}>
              <Typography variant="h6" gutterBottom>
                Events
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No upcoming events.
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 