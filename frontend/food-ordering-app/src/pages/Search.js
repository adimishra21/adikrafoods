import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Tabs, 
  Tab, 
  Paper, 
  Divider, 
  Rating, 
  Button 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Restaurant as RestaurantIcon, 
  Fastfood as FoodIcon, 
  Clear as ClearIcon, 
  LocationOn, 
  AccessTime 
} from '@mui/icons-material';
import { api } from '../config/apiConfig';
import { useAuth } from '../auth/authContext';

// Sample data for development
const sampleRestaurants = [
  {
    id: 1,
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with a modern twist',
    imageUrl: 'https://source.unsplash.com/random/600x400/?indian-restaurant',
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
    description: 'Authentic Italian pizzas baked in wood-fired ovens',
    imageUrl: 'https://source.unsplash.com/random/600x400/?pizza-restaurant',
    rating: 4.3,
    cuisineType: ['Italian', 'Pizza', 'Pasta'],
    priceRange: '₹₹₹',
    location: 'Indiranagar, Bangalore',
    openingTime: '11:00',
    closingTime: '23:00',
    isVeg: false
  }
];

const sampleFoodItems = [
  {
    id: 1,
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in a rich tomato and butter gravy',
    price: 320,
    imageUrl: 'https://source.unsplash.com/random/300x200/?butter-chicken',
    category: 'Main Course',
    isVeg: false,
    rating: 4.8,
    restaurantId: 1,
    restaurantName: 'Spice Garden'
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 250,
    imageUrl: 'https://source.unsplash.com/random/300x200/?margherita-pizza',
    category: 'Pizza',
    isVeg: true,
    rating: 4.6,
    restaurantId: 2,
    restaurantName: 'Pizza Paradise'
  }
];

const popularSearches = [
  'Biryani', 'Pizza', 'Burger', 'North Indian', 'Chinese', 'South Indian', 'Desserts', 'Breakfast'
];

// Utility function to ensure a value is always an array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const Search = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // In a real app, you would make API calls to search for restaurants and food items
        const restaurantsResponse = await api.get(`/api/restaurants/search?q=${query}`);
        const foodItemsResponse = await api.get(`/api/menu-items/search?q=${query}`);
        
        setRestaurants(restaurantsResponse.data);
        setFoodItems(foodItemsResponse.data);
      } else {
        // Use sample data when not authenticated
        // Filter sample data based on the query
        const filteredRestaurants = sampleRestaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.cuisineType.some(cuisine => cuisine.toLowerCase().includes(query.toLowerCase())) ||
          restaurant.description.toLowerCase().includes(query.toLowerCase())
        );
        
        const filteredFoodItems = sampleFoodItems.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setRestaurants(filteredRestaurants);
        setFoodItems(filteredFoodItems);
      }
      setError(null);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Failed to perform search. Please try again later.');
      // Use filtered sample data on error
      const filteredRestaurants = sampleRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisineType.some(cuisine => cuisine.toLowerCase().includes(query.toLowerCase())) ||
        restaurant.description.toLowerCase().includes(query.toLowerCase())
      );
      
      const filteredFoodItems = sampleFoodItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setRestaurants(filteredRestaurants);
      setFoodItems(filteredFoodItems);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      // Update URL with search query
      const searchParams = new URLSearchParams();
      searchParams.set('q', searchQuery);
      window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setRestaurants([]);
    setFoodItems([]);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePopularSearchClick = (term) => {
    setSearchQuery(term);
    performSearch(term);
    // Update URL with search query
    const searchParams = new URLSearchParams();
    searchParams.set('q', term);
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
  };

  const isRestaurantOpen = (restaurant) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const [openHour, openMinute] = restaurant.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = restaurant.closingTime.split(':').map(Number);
    
    const openingTime = openHour * 60 + openMinute;
    const closingTime = closeHour * 60 + closeMinute;
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    return currentTimeMinutes >= openingTime && currentTimeMinutes <= closingTime;
  };

  const filterRestaurants = (restaurants, query) => {
    if (!query) return restaurants;
    
    return restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(query.toLowerCase()) ||
      ensureArray(restaurant.cuisineType).some(cuisine => cuisine.toLowerCase().includes(query.toLowerCase()))
    );
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Try to get restaurants from API
        const response = await api.get('/api/restaurants');
        const apiRestaurants = response.data;
        
        // Filter restaurants based on search query
        const filtered = filterRestaurants(apiRestaurants, searchQuery);
        
        setRestaurants(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        
        // Fallback to sample data if API fails
        const filtered = filterRestaurants(sampleRestaurants, searchQuery);
        setRestaurants(filtered);
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchQuery]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Search Bar */}
      <Paper 
        component="form" 
        onSubmit={handleSearchSubmit}
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for restaurants, cuisines, or dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ ml: 2, height: 56 }}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
      </Paper>

      {/* Popular Searches */}
      {!searchQuery && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Popular Searches
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularSearches.map((term, index) => (
              <Chip
                key={index}
                label={term}
                onClick={() => handlePopularSearchClick(term)}
                clickable
                color="primary"
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255, 23, 68, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 23, 68, 0.1)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Search Results */}
      {searchQuery && (
        <>
          <Typography variant="h5" gutterBottom>
            Search Results for "{searchQuery}"
          </Typography>
          
          {/* Tabs for Restaurants and Food Items */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab 
                icon={<RestaurantIcon />} 
                label={`Restaurants (${restaurants.length})`} 
                iconPosition="start"
              />
              <Tab 
                icon={<FoodIcon />} 
                label={`Food Items (${foodItems.length})`} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Restaurants Tab */}
          {tabValue === 0 && (
            <Box>
              {restaurants.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No restaurants found matching "{searchQuery}"
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {restaurants.map((restaurant) => {
                    const isOpen = isRestaurantOpen(restaurant);
                    
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
            </Box>
          )}

          {/* Food Items Tab */}
          {tabValue === 1 && (
            <Box>
              {foodItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No food items found matching "{searchQuery}"
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {foodItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card 
                        className="food-item-card"
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          position: 'relative'
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="160"
                          image={item.imageUrl}
                          alt={item.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography gutterBottom variant="h6" component="h3">
                              {item.name}
                            </Typography>
                            <Chip 
                              label={item.isVeg ? 'Veg' : 'Non-Veg'} 
                              size="small" 
                              sx={{ 
                                bgcolor: item.isVeg ? 'success.main' : 'error.main',
                                color: 'white'
                              }} 
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={item.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {item.rating}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            From: {item.restaurantName}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              ₹{item.price}
                            </Typography>
                            <Button
                              component={Link}
                              to={`/restaurant/${item.restaurantId}`}
                              variant="contained"
                              color="primary"
                            >
                              View Restaurant
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Search; 