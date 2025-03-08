import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { Rating } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Function to check if restaurant is open based on current time
const checkIfRestaurantOpen = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return true; // Default to open if no times provided
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [openHour, openMinute] = (openingTime || '10:00').split(':').map(Number);
  const [closeHour, closeMinute] = (closingTime || '22:00').split(':').map(Number);
  
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
};

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodType, setFoodType] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/restaurants');
        setRestaurants(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
        // Use sample data for demonstration
        setRestaurants([
          {
            id: 1,
            name: 'Spice Garden',
            description: 'Authentic Indian cuisine with a modern twist',
            imageUrl: 'https://source.unsplash.com/random?indian-food',
            rating: 4.7,
            reviewCount: 245,
            location: 'Downtown',
            openingTime: '10:00',
            closingTime: '22:00',
            cuisineType: 'Indian',
            category: 'non-veg'
          },
          {
            id: 2,
            name: 'Pizza Paradise',
            description: 'Delicious pizzas with a variety of toppings',
            imageUrl: 'https://source.unsplash.com/random?pizza',
            rating: 4.5,
            reviewCount: 189,
            location: 'Uptown',
            openingTime: '11:00',
            closingTime: '23:00',
            cuisineType: 'Italian',
            category: 'veg'
          },
          {
            id: 3,
            name: 'Burger Bliss',
            description: 'Juicy burgers with fresh ingredients',
            imageUrl: 'https://source.unsplash.com/random?burger',
            rating: 4.3,
            reviewCount: 156,
            location: 'Midtown',
            openingTime: '09:00',
            closingTime: '21:00',
            cuisineType: 'American',
            category: 'non-veg'
          },
          {
            id: 4,
            name: 'Sushi Sensation',
            description: 'Fresh and authentic Japanese sushi',
            imageUrl: 'https://source.unsplash.com/random?sushi',
            rating: 4.8,
            reviewCount: 210,
            location: 'Harbor District',
            openingTime: '12:00',
            closingTime: '22:30',
            cuisineType: 'Japanese',
            category: 'non-veg'
          },
          {
            id: 5,
            name: 'Taco Town',
            description: 'Authentic Mexican tacos and more',
            imageUrl: 'https://source.unsplash.com/random?tacos',
            rating: 4.4,
            reviewCount: 178,
            location: 'West End',
            openingTime: '10:30',
            closingTime: '23:00',
            cuisineType: 'Mexican',
            category: 'non-veg'
          },
          {
            id: 6,
            name: 'Veggie Delight',
            description: 'Healthy and delicious vegetarian options',
            imageUrl: 'https://source.unsplash.com/random?vegetarian',
            rating: 4.6,
            reviewCount: 165,
            location: 'Green Valley',
            openingTime: '08:00',
            closingTime: '20:00',
            cuisineType: 'Vegetarian',
            category: 'veg'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on selected food type and category
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesFoodType = foodType === 'all' || restaurant.cuisineType === foodType;
    const matchesCategory = category === 'all' || restaurant.category === category;
    return matchesFoodType && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '300px',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(https://source.unsplash.com/random?food)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          ADIKR Foods
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box sx={{ flex: 1, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
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

        <Box sx={{ flex: 1, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
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
      </Box>

      {/* Top Meals Section */}
      <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
        Top Meals
      </Typography>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 2,
          mb: 4,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'background.paper',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
            borderRadius: 4,
          },
        }}
      >
        {['Biryani', 'Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Curry', 'Salad'].map((meal, index) => (
          <Box
            key={index}
            sx={{
              minWidth: 150,
              textAlign: 'center',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                overflow: 'hidden',
                mb: 1,
                boxShadow: 3,
              }}
            >
              <img
                src={`https://source.unsplash.com/random?${meal.toLowerCase()}`}
                alt={meal}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              {meal}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Restaurants Section */}
      <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>
        Top Restaurants
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
          <Typography variant="h6">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredRestaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const isOpen = checkIfRestaurantOpen(restaurant.openingTime, restaurant.closingTime);

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        m: 2, 
        bgcolor: 'background.paper', 
        boxShadow: 3,
        position: 'relative',
        opacity: isOpen ? 1 : 0.7,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: isOpen ? 'scale(1.03)' : 'none',
          boxShadow: isOpen ? 6 : 3,
        }
      }}
      onClick={() => isOpen && navigate(`/restaurant/${restaurant.id}`)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
          image={restaurant.imageUrl || 'https://source.unsplash.com/random?restaurant'}
          alt={restaurant.name}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: isOpen ? 'success.main' : 'error.main',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        >
          {isOpen ? 'OPEN' : 'CLOSED'}
        </Box>
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'text.primary' }}>
          {restaurant.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {restaurant.description || 'Delicious food and great ambiance'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating value={restaurant.rating || 4.5} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {restaurant.rating || 4.5} ({restaurant.reviewCount || 120})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <LocationOnIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {restaurant.location || 'City Center, Downtown'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Home; 