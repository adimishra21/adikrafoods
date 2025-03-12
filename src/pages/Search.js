import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, 
  Button, CircularProgress, Tabs, Tab, Chip, Avatar
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../config/api';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SearchIcon from '@mui/icons-material/Search';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [popularSearches] = useState([
    'Pizza', 'Burger', 'Biryani', 'Chinese', 'Italian', 'Dessert', 'Vegan'
  ]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        // Search restaurants
        const restaurantResponse = await api.get(`/api/restaurants/search?query=${searchTerm}`);
        setRestaurants(restaurantResponse.data);
        
        // Search menu items
        const menuItemResponse = await api.get(`/api/menu-items/search?query=${searchTerm}`);
        setMenuItems(menuItemResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error searching:', err);
        setError('Failed to load search results. Please try again later.');
        
        // Use sample data for demonstration
        setRestaurants([
          {
            id: 1,
            name: 'Spice Garden',
            description: 'Authentic Indian cuisine with a modern twist',
            imageUrl: 'https://source.unsplash.com/random?indian-food',
            rating: 4.7,
            cuisineType: 'Indian'
          },
          {
            id: 2,
            name: 'Pizza Paradise',
            description: 'Delicious pizzas with a variety of toppings',
            imageUrl: 'https://source.unsplash.com/random?pizza',
            rating: 4.5,
            cuisineType: 'Italian'
          }
        ]);
        
        setMenuItems([
          {
            id: 1,
            name: 'Butter Chicken',
            description: 'Creamy tomato sauce with tender chicken pieces',
            price: 15.99,
            imageUrl: 'https://source.unsplash.com/random?butter-chicken',
            restaurantId: 1,
            restaurantName: 'Spice Garden'
          },
          {
            id: 2,
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato, mozzarella, and basil',
            price: 12.99,
            imageUrl: 'https://source.unsplash.com/random?pizza',
            restaurantId: 2,
            restaurantName: 'Pizza Paradise'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePopularSearch = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: 'text.primary', fontWeight: 'bold' }}>
          Search Results
        </Typography>
        {searchTerm && (
          <Typography variant="h6" color="text.secondary">
            for "{searchTerm}"
          </Typography>
        )}
      </Box>

      {!searchTerm ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 4 }}>
            Enter a search term to find restaurants and dishes
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Popular Searches
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
              {popularSearches.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onClick={() => handlePopularSearch(term)}
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
          <Typography variant="h6">{error}</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="search results tabs"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab 
                icon={<RestaurantIcon />} 
                label={`Restaurants (${restaurants.length})`} 
                id="tab-0" 
                aria-controls="tabpanel-0" 
              />
              <Tab 
                icon={<FastfoodIcon />} 
                label={`Menu Items (${menuItems.length})`} 
                id="tab-1" 
                aria-controls="tabpanel-1" 
              />
            </Tabs>
          </Box>

          <Box
            role="tabpanel"
            hidden={tabValue !== 0}
            id="tabpanel-0"
            aria-labelledby="tab-0"
          >
            {tabValue === 0 && (
              restaurants.length > 0 ? (
                <Grid container spacing={3}>
                  {restaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 6,
                          }
                        }}
                        component={Link}
                        to={`/restaurant/${restaurant.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <CardMedia
                          component="img"
                          height="160"
                          image={restaurant.imageUrl || 'https://source.unsplash.com/random?restaurant'}
                          alt={restaurant.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div" sx={{ color: 'text.primary' }}>
                            {restaurant.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {restaurant.description || 'Delicious food and great ambiance'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label={restaurant.cuisineType || 'Various'} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No restaurants found matching "{searchTerm}"
                  </Typography>
                </Box>
              )
            )}
          </Box>

          <Box
            role="tabpanel"
            hidden={tabValue !== 1}
            id="tabpanel-1"
            aria-labelledby="tab-1"
          >
            {tabValue === 1 && (
              menuItems.length > 0 ? (
                <Grid container spacing={3}>
                  {menuItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card 
                        sx={{ 
                          display: 'flex', 
                          height: '100%',
                          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 6,
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              sx={{ height: 140 }}
                              image={item.imageUrl || `https://source.unsplash.com/random?food-${item.id}`}
                              alt={item.name}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                bgcolor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '4px 8px',
                              }}
                            >
                              <Typography variant="body2" component="div">
                                ${item.price?.toFixed(2) || '12.99'}
                              </Typography>
                            </Box>
                          </Box>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h6" component="div" sx={{ color: 'text.primary' }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {item.description || 'Delicious food item'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}
                                alt={item.restaurantName}
                              >
                                {item.restaurantName?.charAt(0) || 'R'}
                              </Avatar>
                              <Typography variant="body2" color="text.secondary">
                                {item.restaurantName || 'Restaurant'}
                              </Typography>
                            </Box>
                          </CardContent>
                          <Box sx={{ p: 1 }}>
                            <Button 
                              component={Link}
                              to={`/restaurant/${item.restaurantId}`}
                              variant="contained" 
                              color="primary" 
                              fullWidth
                            >
                              View Restaurant
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No menu items found matching "{searchTerm}"
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Search; 