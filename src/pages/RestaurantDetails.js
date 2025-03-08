import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, 
  Button, CircularProgress, Divider, Chip, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, Rating
} from '@mui/material';
import { api } from '../config/api';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../auth/authContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [foodType, setFoodType] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        // Fetch restaurant details
        const restaurantResponse = await api.get(`/api/restaurants/${id}`);
        setRestaurant(restaurantResponse.data);
        
        // Fetch menu items
        const menuResponse = await api.get(`/api/restaurants/${id}/menu-items`);
        setMenuItems(menuResponse.data);
        
        // Check if restaurant is in favorites
        if (isAuthenticated) {
          try {
            const favResponse = await api.get('/api/customers/favorites');
            const isFav = favResponse.data.some(fav => fav.id === parseInt(id));
            setIsFavorite(isFav);
          } catch (err) {
            console.error('Error checking favorites:', err);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setError('Failed to load restaurant details. Please try again later.');
        
        // Use sample data for demonstration
        const sampleRestaurant = {
          id: parseInt(id),
          name: id === '1' ? 'Spice Garden' : 
                id === '2' ? 'Pizza Paradise' : 
                id === '3' ? 'Burger Bliss' : 
                id === '4' ? 'Sushi Sensation' : 
                id === '5' ? 'Taco Town' : 'Veggie Delight',
          description: 'A wonderful restaurant with delicious food and great ambiance.',
          imageUrl: `https://source.unsplash.com/random?restaurant-${id}`,
          rating: 4.5,
          reviewCount: 200,
          location: 'City Center, Downtown',
          openingTime: '10:00',
          closingTime: '22:00',
          cuisineType: id === '1' ? 'Indian' : 
                      id === '2' ? 'Italian' : 
                      id === '3' ? 'American' : 
                      id === '4' ? 'Japanese' : 
                      id === '5' ? 'Mexican' : 'Vegetarian',
          category: id === '6' ? 'veg' : 'non-veg'
        };
        
        const sampleMenuItems = [
          {
            id: 1,
            name: 'Signature Dish',
            description: 'Our most popular dish with special ingredients',
            price: 15.99,
            imageUrl: `https://source.unsplash.com/random?food-${id}-1`,
            category: 'non-veg',
            foodType: id === '1' ? 'Indian' : 
                      id === '2' ? 'Italian' : 
                      id === '3' ? 'American' : 
                      id === '4' ? 'Japanese' : 
                      id === '5' ? 'Mexican' : 'Vegetarian',
          },
          {
            id: 2,
            name: 'Special Appetizer',
            description: 'Delicious starter to begin your meal',
            price: 8.99,
            imageUrl: `https://source.unsplash.com/random?appetizer-${id}`,
            category: 'veg',
            foodType: id === '1' ? 'Indian' : 
                      id === '2' ? 'Italian' : 
                      id === '3' ? 'American' : 
                      id === '4' ? 'Japanese' : 
                      id === '5' ? 'Mexican' : 'Vegetarian',
          },
          {
            id: 3,
            name: 'Chef\'s Special',
            description: 'Handcrafted by our chef with premium ingredients',
            price: 19.99,
            imageUrl: `https://source.unsplash.com/random?special-${id}`,
            category: 'non-veg',
            foodType: id === '1' ? 'Indian' : 
                      id === '2' ? 'Italian' : 
                      id === '3' ? 'American' : 
                      id === '4' ? 'Japanese' : 
                      id === '5' ? 'Mexican' : 'Vegetarian',
          },
          {
            id: 4,
            name: 'Seasonal Delight',
            description: 'Made with fresh seasonal ingredients',
            price: 12.99,
            imageUrl: `https://source.unsplash.com/random?seasonal-${id}`,
            category: 'seasonal',
            foodType: id === '1' ? 'Indian' : 
                      id === '2' ? 'Italian' : 
                      id === '3' ? 'American' : 
                      id === '4' ? 'Japanese' : 
                      id === '5' ? 'Mexican' : 'Vegetarian',
          },
          {
            id: 5,
            name: 'Vegetarian Option',
            description: 'Healthy and delicious vegetarian dish',
            price: 10.99,
            imageUrl: `https://source.unsplash.com/random?vegetarian-${id}`,
            category: 'veg',
            foodType: id === '1' ? 'Indian' : 
                      id === '2' ? 'Italian' : 
                      id === '3' ? 'American' : 
                      id === '4' ? 'Japanese' : 
                      id === '5' ? 'Mexican' : 'Vegetarian',
          }
        ];
        
        setRestaurant(sampleRestaurant);
        setMenuItems(sampleMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      if (isFavorite) {
        await api.delete(`/api/customers/favorites/${id}`);
      } else {
        await api.post(`/api/customers/favorites/${id}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setSelectedItem(item);
    setQuantity(1);
    setOpenDialog(true);
  };

  const handleConfirmAddToCart = async () => {
    try {
      await api.post('/api/cart/add', {
        menuItemId: selectedItem.id,
        quantity: quantity
      });
      setOpenDialog(false);
      // Show success message or notification
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Show error message
    }
  };

  // Filter menu items based on selected food type and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesFoodType = foodType === 'all' || item.foodType === foodType;
    const matchesCategory = category === 'all' || item.category === category;
    return matchesFoodType && matchesCategory;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !restaurant) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Restaurant Header */}
      <Box
        sx={{
          position: 'relative',
          height: '250px',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={restaurant.imageUrl || 'https://source.unsplash.com/random?restaurant'}
          alt={restaurant.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
              {restaurant.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Rating value={restaurant.rating || 4.5} precision={0.5} readOnly size="small" />
              <Typography variant="body2" sx={{ color: 'white', ml: 1 }}>
                {restaurant.rating || 4.5} ({restaurant.reviewCount || 200} reviews)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
              {restaurant.location || 'City Center, Downtown'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleToggleFavorite}
            sx={{ 
              bgcolor: 'background.paper', 
              '&:hover': { bgcolor: 'background.default' } 
            }}
          >
            {isFavorite ? 
              <FavoriteIcon color="error" /> : 
              <FavoriteBorderIcon color="error" />
            }
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Food Type</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['all', 'Indian', 'Italian', 'American', 'Japanese', 'Mexican', 'Vegetarian'].map((type) => (
                <Button
                  key={type}
                  variant={foodType === type ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setFoodType(type)}
                  sx={{ justifyContent: 'flex-start' }}
                  startIcon={
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'info.main',
                        mr: 1
                      }}
                    />
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Category</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['all', 'veg', 'non-veg', 'seasonal'].map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setCategory(cat)}
                  sx={{ justifyContent: 'flex-start' }}
                  startIcon={
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'info.main',
                        mr: 1
                      }}
                    />
                  }
                >
                  {cat === 'all' ? 'All' : cat === 'veg' ? 'Vegetarian' : cat === 'non-veg' ? 'Non-Vegetarian' : 'Seasonal'}
                </Button>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Menu Items */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
            Menu
          </Typography>
          
          {filteredMenuItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
              <Typography variant="h6">No menu items found with the selected filters.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredMenuItems.map((item) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Card sx={{ 
                    display: 'flex', 
                    height: '100%',
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    }
                  }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 140 }}
                      image={item.imageUrl || `https://source.unsplash.com/random?food-${item.id}`}
                      alt={item.name}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <CardContent sx={{ flex: '1 0 auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography component="div" variant="h6" sx={{ color: 'text.primary' }}>
                            {item.name}
                          </Typography>
                          <Chip 
                            label={`$${item.price.toFixed(2)}`} 
                            color="primary" 
                            size="small" 
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Chip 
                            label={item.category === 'veg' ? 'Vegetarian' : item.category === 'non-veg' ? 'Non-Vegetarian' : 'Seasonal'} 
                            size="small" 
                            color={item.category === 'veg' ? 'success' : item.category === 'non-veg' ? 'error' : 'warning'}
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={item.foodType} 
                            size="small" 
                            color="info"
                          />
                        </Box>
                      </CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToCart(item)}
                          fullWidth
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Add to Cart Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add to Cart</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src={selectedItem.imageUrl || `https://source.unsplash.com/random?food-${selectedItem.id}`}
                  alt={selectedItem.name}
                  sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{selectedItem.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${selectedItem.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <IconButton 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  color="primary"
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setQuantity(value);
                    }
                  }}
                  inputProps={{ min: 1, style: { textAlign: 'center' } }}
                  sx={{ width: 60, mx: 1 }}
                />
                <IconButton 
                  onClick={() => setQuantity(quantity + 1)}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${(selectedItem.price * quantity).toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmAddToCart} 
            variant="contained" 
            color="primary"
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RestaurantDetails; 