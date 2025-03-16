import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  TextField, 
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../auth/authContext';
import { api } from '../config/apiConfig';
import { useNavigate } from 'react-router-dom';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RestaurantDashboard = () => {
  const { user, isAuthenticated, isRestaurantOwner } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [openRestaurantDialog, setOpenRestaurantDialog] = useState(false);
  const [openMenuItemDialog, setOpenMenuItemDialog] = useState(false);
  const [restaurantFormData, setRestaurantFormData] = useState({
    name: '',
    cuisineType: '',
    imageUrl: '',
    address: '',
    minOrderAmount: 0,
    deliveryFee: 0,
    openingTime: '09:00',
    closingTime: '22:00'
  });
  const [menuItemFormData, setMenuItemFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'MAIN_COURSE',
    vegetarian: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Check if user is authenticated and is a restaurant owner
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isRestaurantOwner) {
      navigate('/');
      return;
    }

    fetchRestaurants();
  }, [isAuthenticated, isRestaurantOwner, navigate]);

  // Fetch restaurants owned by the current user
  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/api/restaurants/owner');
      console.log('Fetched restaurants:', response.data);
      setRestaurants(response.data);
      
      // If there are restaurants, select the first one by default
      if (response.data.length > 0) {
        setSelectedRestaurant(response.data[0]);
        fetchMenuItems(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      showSnackbar('Failed to fetch restaurants', 'error');
    }
  };

  // Fetch menu items for a specific restaurant
  const fetchMenuItems = async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurants/${restaurantId}/menu-items`);
      console.log('Fetched menu items:', response.data);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      showSnackbar('Failed to fetch menu items', 'error');
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchMenuItems(restaurant.id);
  };

  // Handle restaurant form input change
  const handleRestaurantFormChange = (e) => {
    const { name, value } = e.target;
    setRestaurantFormData({
      ...restaurantFormData,
      [name]: value
    });
  };

  // Handle menu item form input change
  const handleMenuItemFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuItemFormData({
      ...menuItemFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open restaurant dialog for adding a new restaurant
  const handleAddRestaurant = () => {
    setRestaurantFormData({
      name: '',
      cuisineType: '',
      imageUrl: '',
      address: '',
      minOrderAmount: 0,
      deliveryFee: 0,
      openingTime: '09:00',
      closingTime: '22:00'
    });
    setIsEditing(false);
    setOpenRestaurantDialog(true);
  };

  // Open restaurant dialog for editing an existing restaurant
  const handleEditRestaurant = (restaurant) => {
    setRestaurantFormData({
      id: restaurant.id,
      name: restaurant.name,
      cuisineType: restaurant.cuisineType,
      imageUrl: restaurant.imageUrl,
      address: restaurant.address,
      minOrderAmount: restaurant.minOrderAmount,
      deliveryFee: restaurant.deliveryFee,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime
    });
    setIsEditing(true);
    setOpenRestaurantDialog(true);
  };

  // Open menu item dialog for adding a new menu item
  const handleAddMenuItem = () => {
    setMenuItemFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: 'MAIN_COURSE',
      vegetarian: false
    });
    setIsEditing(false);
    setOpenMenuItemDialog(true);
  };

  // Open menu item dialog for editing an existing menu item
  const handleEditMenuItem = (menuItem) => {
    setMenuItemFormData({
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl,
      category: menuItem.category,
      vegetarian: menuItem.vegetarian
    });
    setIsEditing(true);
    setOpenMenuItemDialog(true);
  };

  // Save restaurant (create or update)
  const handleSaveRestaurant = async () => {
    try {
      let response;
      if (isEditing) {
        response = await api.put(`/api/restaurants/${restaurantFormData.id}`, restaurantFormData);
        showSnackbar('Restaurant updated successfully', 'success');
      } else {
        response = await api.post('/api/restaurants', restaurantFormData);
        showSnackbar('Restaurant created successfully', 'success');
      }
      
      console.log('Restaurant saved:', response.data);
      setOpenRestaurantDialog(false);
      fetchRestaurants();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      showSnackbar('Failed to save restaurant', 'error');
    }
  };

  // Save menu item (create or update)
  const handleSaveMenuItem = async () => {
    try {
      console.log('Attempting to save menu item:', {
        restaurantId: selectedRestaurant?.id,
        menuItemData: menuItemFormData,
        isEditing
      });
      
      // Ensure category is a valid enum value
      const validCategories = ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SIDE_DISH'];
      if (!validCategories.includes(menuItemFormData.category)) {
        console.error('Invalid category:', menuItemFormData.category);
        showSnackbar('Invalid category selected', 'error');
        return;
      }
      
      // Ensure price is a number
      const price = parseFloat(menuItemFormData.price);
      if (isNaN(price)) {
        console.error('Invalid price:', menuItemFormData.price);
        showSnackbar('Price must be a valid number', 'error');
        return;
      }
      
      // Validate and limit image URL length
      let imageUrl = menuItemFormData.imageUrl || '';
      if (imageUrl.length > 900) {
        console.warn('Image URL too long, truncating:', imageUrl.length);
        imageUrl = imageUrl.substring(0, 900);
        showSnackbar('Image URL was too long and has been truncated', 'warning');
      }
      
      // Prepare data with correct types and limited URL
      const menuItemData = {
        ...menuItemFormData,
        price: price,
        imageUrl: imageUrl,
        vegetarian: Boolean(menuItemFormData.vegetarian)
      };
      
      console.log('Prepared menu item data:', menuItemData);
      
      let response;
      if (isEditing) {
        console.log(`Sending PUT request to /api/restaurants/${selectedRestaurant.id}/menu-items/${menuItemFormData.id}`);
        response = await api.put(
          `/api/restaurants/${selectedRestaurant.id}/menu-items/${menuItemFormData.id}`, 
          menuItemData
        );
        console.log('Update response:', response);
        showSnackbar('Menu item updated successfully', 'success');
      } else {
        console.log(`Sending POST request to /api/restaurants/${selectedRestaurant.id}/menu-items`);
        response = await api.post(
          `/api/restaurants/${selectedRestaurant.id}/menu-items`, 
          menuItemData
        );
        console.log('Create response:', response);
        showSnackbar('Menu item created successfully', 'success');
      }
      
      console.log('Menu item saved:', response.data);
      setOpenMenuItemDialog(false);
      fetchMenuItems(selectedRestaurant.id);
    } catch (error) {
      console.error('Error saving menu item:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // More specific error message based on the error
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          showSnackbar('Authentication error. Please log in again.', 'error');
        } else if (error.response.data && error.response.data.message) {
          showSnackbar(`Error: ${error.response.data.message}`, 'error');
        } else if (error.response.status === 500 && error.response.data && error.response.data.includes('Data too long')) {
          showSnackbar('The image URL is too long. Please use a shorter URL.', 'error');
        } else {
          showSnackbar(`Error (${error.response.status}): Failed to save menu item`, 'error');
        }
      } else {
        showSnackbar('Network error. Please check your connection.', 'error');
      }
    }
  };

  // Delete restaurant
  const handleDeleteRestaurant = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await api.delete(`/api/restaurants/${restaurantId}`);
        showSnackbar('Restaurant deleted successfully', 'success');
        fetchRestaurants();
        
        // If the deleted restaurant was selected, clear the selection
        if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
          setSelectedRestaurant(null);
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        showSnackbar('Failed to delete restaurant', 'error');
      }
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (menuItemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await api.delete(`/api/restaurants/${selectedRestaurant.id}/menu-items/${menuItemId}`);
        showSnackbar('Menu item deleted successfully', 'success');
        fetchMenuItems(selectedRestaurant.id);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        showSnackbar('Failed to delete menu item', 'error');
      }
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Restaurant Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome, {user?.fullName}! Manage your restaurants and menu items here.
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="My Restaurants" />
          <Tab label="Menu Items" disabled={!selectedRestaurant} />
          <Tab label="Orders" disabled={!selectedRestaurant} />
        </Tabs>
      </Box>

      {/* Restaurants Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddRestaurant}
          >
            Add Restaurant
          </Button>
        </Box>

        <Grid container spacing={3}>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <Grid item xs={12} md={6} key={restaurant.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: selectedRestaurant?.id === restaurant.id ? '2px solid #1976d2' : 'none'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2">
                      {restaurant.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {restaurant.cuisineType}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Address: {restaurant.address}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Hours: {restaurant.openingTime} - {restaurant.closingTime}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Min. Order: ${restaurant.minOrderAmount}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Delivery Fee: ${restaurant.deliveryFee}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleRestaurantSelect(restaurant)}
                    >
                      Select
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => handleEditRestaurant(restaurant)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  You don't have any restaurants yet.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddRestaurant}
                  sx={{ mt: 2 }}
                >
                  Add Your First Restaurant
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Menu Items Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Menu Items for {selectedRestaurant?.name}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddMenuItem}
          >
            Add Menu Item
          </Button>
        </Box>

        <Grid container spacing={3}>
          {menuItems.length > 0 ? (
            menuItems.map((menuItem) => (
              <Grid item xs={12} sm={6} md={4} key={menuItem.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2">
                      {menuItem.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      ${menuItem.price.toFixed(2)} • {menuItem.category.replace('_', ' ')}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {menuItem.description}
                    </Typography>
                    <Typography variant="body2" component="p" sx={{ mt: 1 }}>
                      {menuItem.vegetarian ? '🌱 Vegetarian' : ''}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => handleEditMenuItem(menuItem)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteMenuItem(menuItem.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No menu items found for this restaurant.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddMenuItem}
                  sx={{ mt: 2 }}
                >
                  Add Your First Menu Item
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Orders Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Orders for {selectedRestaurant?.name}
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Order management functionality coming soon!
          </Typography>
        </Paper>
      </TabPanel>

      {/* Restaurant Dialog */}
      <Dialog open={openRestaurantDialog} onClose={() => setOpenRestaurantDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Restaurant' : 'Add New Restaurant'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Restaurant Name"
              name="name"
              value={restaurantFormData.name}
              onChange={handleRestaurantFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Cuisine Type"
              name="cuisineType"
              value={restaurantFormData.cuisineType}
              onChange={handleRestaurantFormChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={restaurantFormData.imageUrl}
              onChange={handleRestaurantFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Address"
              name="address"
              value={restaurantFormData.address}
              onChange={handleRestaurantFormChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Minimum Order Amount"
                  name="minOrderAmount"
                  type="number"
                  value={restaurantFormData.minOrderAmount}
                  onChange={handleRestaurantFormChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Delivery Fee"
                  name="deliveryFee"
                  type="number"
                  value={restaurantFormData.deliveryFee}
                  onChange={handleRestaurantFormChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Opening Time"
                  name="openingTime"
                  type="time"
                  value={restaurantFormData.openingTime}
                  onChange={handleRestaurantFormChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Closing Time"
                  name="closingTime"
                  type="time"
                  value={restaurantFormData.closingTime}
                  onChange={handleRestaurantFormChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRestaurantDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRestaurant} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={openMenuItemDialog} onClose={() => setOpenMenuItemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Item Name"
              name="name"
              value={menuItemFormData.name}
              onChange={handleMenuItemFormChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={menuItemFormData.description}
              onChange={handleMenuItemFormChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={menuItemFormData.price}
              onChange={handleMenuItemFormChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={menuItemFormData.imageUrl}
              onChange={handleMenuItemFormChange}
              helperText="Maximum length: 900 characters. Longer URLs will be truncated."
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={menuItemFormData.category}
                label="Category"
                onChange={handleMenuItemFormChange}
              >
                <MenuItem value="APPETIZER">Appetizer</MenuItem>
                <MenuItem value="MAIN_COURSE">Main Course</MenuItem>
                <MenuItem value="DESSERT">Dessert</MenuItem>
                <MenuItem value="BEVERAGE">Beverage</MenuItem>
                <MenuItem value="SIDE_DISH">Side Dish</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="vegetarian-label">Vegetarian</InputLabel>
              <Select
                labelId="vegetarian-label"
                name="vegetarian"
                value={menuItemFormData.vegetarian}
                label="Vegetarian"
                onChange={handleMenuItemFormChange}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMenuItemDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveMenuItem} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RestaurantDashboard; 