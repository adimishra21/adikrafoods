import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box, 
  Button, 
  Chip, 
  CircularProgress, 
  Rating,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  AccessTime, 
  LocationOn, 
  ArrowForward,
  Search as SearchIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../config/apiConfig';
import { useAuth } from '../auth/authContext';

// Utility function to ensure a value is always an array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

// Sample data for development (same as in Home.js)
const sampleRestaurants = [
  {
    id: 1,
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with a modern twist',
    imageUrl: 'https://media.istockphoto.com/id/1131393938/photo/very-stylish-indian-gourmet-restaurant.webp?a=1&b=1&s=612x612&w=0&k=20&c=Nja6_FL1Ww89l03D-Nyex4f-3PBN_IYfDp_6J3UH5Cs=',
    rating: 4.5,
    cuisineType: ['Indian', 'Curry', 'Biryani'],
    priceRange: '₹₹',
    location: 'Koramangala, Bangalore',
    openingTime: '10:00',
    closingTime: '22:00',
    isVeg: false
  },
  {
    id: 2,
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizzas and pasta',
    imageUrl: 'https://media.istockphoto.com/id/1295797149/photo/pizza-restaurant-interior.webp?a=1&b=1&s=612x612&w=0&k=20&c=2RiTXwJ1vEPiB-UNuFvVHGBvVRuKPBH7y6G1kZnW1AI=',
    rating: 4.7,
    cuisineType: ['Italian', 'Pizza', 'Pasta'],
    priceRange: '₹₹₹',
    location: 'Indiranagar, Bangalore',
    openingTime: '11:00',
    closingTime: '23:00',
    isVeg: false
  },
  {
    id: 3,
    name: 'Dragon House',
    description: 'Authentic Chinese and Pan-Asian cuisine',
    imageUrl: 'https://media.istockphoto.com/id/1175505781/photo/chinese-food-blank-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=gUTvQuVPUxXrYBJjUQSJLqxFYXnJlUEfPVnWQpaIXA8=',
    rating: 4.6,
    cuisineType: ['Chinese', 'Thai', 'Asian'],
    priceRange: '₹₹',
    location: 'Whitefield, Bangalore',
    openingTime: '11:30',
    closingTime: '22:30',
    isVeg: false
  },
  {
    id: 4,
    name: 'South Indian Delight',
    description: 'Traditional South Indian vegetarian cuisine',
    imageUrl: 'https://media.istockphoto.com/id/1024549286/photo/south-indian-meals-served-on-banana-leaf.webp?a=1&b=1&s=612x612&w=0&k=20&c=1QS5JF6ZHDQmBgBTiKE7ZK4FG_PSbsHOAHGN1O1Qdxg=',
    rating: 4.8,
    cuisineType: ['South Indian', 'Vegetarian'],
    priceRange: '₹',
    location: 'Jayanagar, Bangalore',
    openingTime: '07:00',
    closingTime: '22:00',
    isVeg: true
  },
  {
    id: 5,
    name: 'Burger Junction',
    description: 'Gourmet burgers and American classics',
    imageUrl: 'https://media.istockphoto.com/id/1206323282/photo/juicy-hamburger-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=K0DxyiChLwewXcCy8aLjjOqkc8QXPgQMAXPG_5_NRQw=',
    rating: 4.4,
    cuisineType: ['American', 'Burger', 'Fast Food'],
    priceRange: '₹₹',
    location: 'HSR Layout, Bangalore',
    openingTime: '11:00',
    closingTime: '23:00',
    isVeg: false
  },
  {
    id: 6,
    name: 'Biryani House',
    description: 'Flavorful biryanis and kebabs',
    imageUrl: 'https://media.istockphoto.com/id/671413740/photo/young-indian-man-and-two-women-spending-some-time-together-in-a-jodhpur-restaurant.webp?a=1&b=1&s=612x612&w=0&k=20&c=wIZf8-iTseYVQBPLNR9YLxGTokEtUJvhZC6tJWFRb_A=',
    rating: 4.8,
    cuisineType: ['Mughlai', 'Biryani', 'Kebab'],
    priceRange: '₹₹',
    location: 'Frazer Town, Bangalore',
    openingTime: '12:00',
    closingTime: '22:00',
    isVeg: false
  },
  {
    id: 7,
    name: 'Tandoori Nights',
    description: 'Authentic North Indian cuisine with tandoor specialties',
    imageUrl: 'https://media.istockphoto.com/id/1158623408/photo/indian-tandoori-chicken-legs-or-drumsticks-served-with-green-mint-chutney-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=Vu9RyCVJQvHXK1l3qqGm_sbVtEeBHQMPdnmXDPS-JEE=',
    rating: 4.6,
    cuisineType: ['North Indian', 'Tandoori', 'Curry'],
    priceRange: '₹₹',
    location: 'MG Road, Bangalore',
    openingTime: '11:00',
    closingTime: '23:00',
    isVeg: false
  },
  {
    id: 8,
    name: 'Sushi Samurai',
    description: 'Premium Japanese sushi and sashimi',
    imageUrl: 'https://media.istockphoto.com/id/1053854126/photo/all-you-can-eat-sushi.webp?a=1&b=1&s=612x612&w=0&k=20&c=qqP6SHUojGXvXx7KKbsWHbkSm_OMgCgQIUz1lNp9T4c=',
    rating: 4.9,
    cuisineType: ['Japanese', 'Sushi', 'Asian'],
    priceRange: '₹₹₹',
    location: 'Koramangala, Bangalore',
    openingTime: '12:00',
    closingTime: '22:30',
    isVeg: false
  },
  {
    id: 9,
    name: 'Mediterranean Mezze',
    description: 'Authentic Mediterranean and Middle Eastern cuisine',
    imageUrl: 'https://media.istockphoto.com/id/1311427209/photo/arabic-and-middle-eastern-dinner-table-hummus-tabbouleh-salad-fattoush-salad-pita-meat-kebab.webp?a=1&b=1&s=612x612&w=0&k=20&c=JFpfQ1rQbdZFXA8y_nVp5KZSW5BQZvwzkPnSkTGOP-A=',
    rating: 4.5,
    cuisineType: ['Mediterranean', 'Middle Eastern', 'Lebanese'],
    priceRange: '₹₹',
    location: 'Indiranagar, Bangalore',
    openingTime: '11:30',
    closingTime: '22:30',
    isVeg: false
  },
  {
    id: 10,
    name: 'Taco Town',
    description: 'Authentic Mexican street food and tacos',
    imageUrl: 'https://media.istockphoto.com/id/1213818930/photo/traditional-mexican-tacos-with-meat-and-vegetables.webp?a=1&b=1&s=612x612&w=0&k=20&c=0gTZLPSuBrJOZLgRfGcEEGXkPs7B0FLVe5z-Y-CxQoE=',
    rating: 4.3,
    cuisineType: ['Mexican', 'Tacos', 'Latin American'],
    priceRange: '₹₹',
    location: 'HSR Layout, Bangalore',
    openingTime: '11:00',
    closingTime: '23:00',
    isVeg: false
  }
];

const Restaurants = () => {
  const { isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/restaurants');
      console.log('Restaurant response:', response.data);
      setRestaurants(response.data.length > 0 ? response.data : sampleRestaurants);
      setError(null);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants. Please try again later.');
      // Use sample data on error
      setRestaurants(sampleRestaurants);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/api/restaurants/favorites');
      console.log('Favorites response:', response.data);
      const favoriteIds = new Set(response.data.map(restaurant => restaurant.id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleToggleFavorite = async (restaurantId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/restaurants' } });
      return;
    }

    try {
      const response = await api.post(`/api/restaurants/${restaurantId}/favorite`);
      console.log('Toggle favorite response:', response.data);
      
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(restaurantId)) {
          newFavorites.delete(restaurantId);
        } else {
          newFavorites.add(restaurantId);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isRestaurantOpen = (restaurant) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Parse opening and closing times
    const [openHour, openMinute] = restaurant.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = restaurant.closingTime.split(':').map(Number);
    
    // Convert to minutes for easier comparison
    const openingTime = openHour * 60 + openMinute;
    const closingTime = closeHour * 60 + closeMinute;
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    console.log(`Restaurant ${restaurant.name}: Current time: ${currentHour}:${currentMinute} (${currentTimeMinutes} mins)`);
    console.log(`Opening time: ${openHour}:${openMinute} (${openingTime} mins)`);
    console.log(`Closing time: ${closeHour}:${closeMinute} (${closingTime} mins)`);
    
    // Handle cases where closing time is after midnight
    if (closingTime < openingTime) {
      // Restaurant closes after midnight
      return currentTimeMinutes >= openingTime || currentTimeMinutes <= closingTime;
    }
    
    // Normal case (opening and closing on the same day)
    return currentTimeMinutes >= openingTime && currentTimeMinutes <= closingTime;
  };

  const filterRestaurants = (restaurants) => {
    return restaurants.filter(restaurant => {
      // Apply search filter
      if (searchTerm && 
          !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !ensureArray(restaurant.cuisineType).some(cuisine => cuisine.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Apply cuisine filter
      if (filterType !== 'all' && 
          !ensureArray(restaurant.cuisineType).some(cuisine => cuisine.toLowerCase() === filterType.toLowerCase())) {
        return false;
      }
      
      // Apply veg filter
      if (filterType === 'veg' && !restaurant.isVeg) {
        return false;
      }
      
      return true;
    });
  };

  // Sort restaurants
  const sortedRestaurants = [...filterRestaurants(restaurants)].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        All Restaurants
      </Typography>
      
      {/* Search and Filter Controls */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Search restaurants"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: '150px' }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="rating">Rating (High to Low)</MenuItem>
            <MenuItem value="name">Name (A-Z)</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: '150px' }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterType}
            label="Filter"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="veg">Vegetarian</MenuItem>
            <MenuItem value="nonVeg">Non-Vegetarian</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Restaurant List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box sx={{ my: 4, p: 2, bgcolor: 'rgba(255, 23, 68, 0.1)', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedRestaurants.map((restaurant) => {
            const isOpen = isRestaurantOpen(restaurant);
            const isFavorite = favorites.has(restaurant.id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <Card 
                  className="restaurant-card"
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    opacity: isOpen ? 1 : 0.7,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: isOpen ? 'translateY(-8px)' : 'none',
                      boxShadow: isOpen ? 8 : 1
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={restaurant.imageUrl}
                      alt={restaurant.name}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    />
                    <Box 
                      className={`restaurant-status ${isOpen ? 'open' : 'closed'}`}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: isOpen ? 'success.main' : 'error.main',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }}
                    >
                      {isOpen ? 'OPEN' : 'CLOSED'}
                    </Box>
                    
                    <IconButton
                      onClick={() => handleToggleFavorite(restaurant.id)}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }
                      }}
                    >
                      {isFavorite ? (
                        <Favorite sx={{ color: '#ff1744' }} />
                      ) : (
                        <FavoriteBorder sx={{ color: 'white' }} />
                      )}
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {restaurant.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={restaurant.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {restaurant.rating}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {restaurant.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.openingTime} - {restaurant.closingTime}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {ensureArray(restaurant.cuisineType).map((cuisine, index) => (
                        <Chip 
                          key={index} 
                          label={cuisine} 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(41, 121, 255, 0.1)', 
                            color: 'primary.main',
                            borderColor: 'rgba(41, 121, 255, 0.3)',
                            fontWeight: 500,
                            fontSize: '0.7rem'
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/restaurant/${restaurant.id}`}
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!isOpen}
                      endIcon={<ArrowForward />}
                    >
                      {isOpen ? 'View Menu' : 'Currently Closed'}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Restaurants; 