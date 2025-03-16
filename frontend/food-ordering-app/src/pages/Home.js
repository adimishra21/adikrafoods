import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Box, 
  Button, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Radio, 
  RadioGroup, 
  Chip, 
  CircularProgress, 
  Paper, 
  Rating,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  AccessTime, 
  LocationOn, 
  ArrowForward,
  KeyboardArrowRight,
  KeyboardArrowLeft
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../config/apiConfig';
import { useAuth } from '../auth/authContext';

// Sample data for development
const sampleTopMeals = [
  { id: 1, name: 'Butter Chicken', image: 'https://media.istockphoto.com/id/1479262112/photo/butter-chicken.webp?a=1&b=1&s=612x612&w=0&k=20&c=zlL-vxHvAftRnyGhEwIKba37oSSwVwZU1UjPlMS847E=', rating: 4.8 },
  { id: 2, name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE1hcmdoZXJpdGElMjBQaXp6YXxlbnwwfHwwfHx8MA%3D%3D', rating: 4.5 },
  { id: 3, name: 'Chicken Biryani', image: 'https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=', rating: 4.7 },
  { id: 4, name: 'Veg Burger', image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmVnJTIwYnVyZ2VyfGVufDB8fDB8fHww', rating: 4.2 },
  { id: 5, name: 'Masala Dosa', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFzYWxhJTIwZG9zYXxlbnwwfHwwfHx8MA%3D%3D', rating: 4.6 },
  { id: 6, name: 'Paneer Tikka', image: 'https://media.istockphoto.com/id/1474136049/photo/close-up-image-of-paneer-kebabs-marinated-curd-cheese-pieces-on-metal-skewers-red-onion-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=cvfV2qr33X-FNf0E4GCYnVovx3w7DdXmyIxv4EuMLII=', rating: 4.4 },
  { id: 7, name: 'Chocolate Cake', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D', rating: 4.9 },
  { id: 8, name: 'Veg Thali', image: 'https://media.istockphoto.com/id/1796556887/photo/non-veg-thali-served-on-a-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=JV-dC_VIkOjJklfqR66Is9f4nfuVSpxrVPCc0cJ5hH0=', rating: 4.3 },
];

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
    imageUrl: 'https://media.istockphoto.com/id/187248625/photo/pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=QHrM65XqDQd3Z50r5cT2qV4nwctw6rNMM1JTlGEEVzI=',
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
    imageUrl: 'https://media.istockphoto.com/id/2157184167/photo/overhead-view-of-platter-of-sushi-rolls.jpg?s=612x612&w=0&k=20&c=-31t8M-BHarVxXOrzcUGDpfUe_lkOPNmvC7dWA3k-Uw=',
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
    imageUrl: 'https://media.istockphoto.com/id/1292563627/photo/assorted-south-indian-breakfast-foods-on-wooden-background-ghee-dosa-uttappam-medhu-vada.jpg?s=612x612&w=0&k=20&c=HvuYT3RiWj5YsvP2_pJrSWIcZUXhnTKqjKhdN3j_SgY=',
    rating: 4.8,
    cuisineType: ['South Indian', 'Vegetarian'],
    priceRange: '₹',
    location: 'Jayanagar, Bangalore',
    openingTime: '11:30',
    closingTime: '22:00',
    isVeg: true
  },
  {
    id: 5,
    name: 'Burger Junction',
    description: 'Gourmet burgers and American classics',
    imageUrl: 'https://media.istockphoto.com/id/496389174/photo/delicious-hamburgers.jpg?s=612x612&w=0&k=20&c=vnRqLGfUhTIdcuBH9kr60nPXpd4lTZeSOeZkAsG_G5w=',
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
      name: 'Fresh Squeeze Juicery',
      description: 'Healthy and refreshing juices made from fresh fruits and vegetables',
      imageUrl: 'https://media.istockphoto.com/id/540519504/photo/fresh-smoothies-in-glass.jpg?s=612x612&w=0&k=20&c=KCjc6ItwKEW_pAF9i46tlND0la2d5QM-nfL9onfflxs=',
      rating: 4.6,
      cuisineType: ['Juices', 'Smoothies', 'Healthy'],
      priceRange: '₹₹',
      location: 'MG Road, Bangalore',
      openingTime: '08:00',
      closingTime: '22:00',
      isVeg: true
  },
  {
    id: 8,
    name: 'Sweet Temptations',
    description: 'Delicious desserts and sweet delicacies for every occasion',
    imageUrl: 'https://media.istockphoto.com/id/1215697769/photo/variety-of-desserts.jpg?s=612x612&w=0&k=20&c=szCUuSuPfRXNYidZUN5kg3nxF9C8KrWxHRi77PmbAdM=',
    rating: 4.8,
    cuisineType: ['Desserts', 'Bakery', 'Sweets'],
    priceRange: '₹-₹',
    location: 'Brigade Road, Bangalore',
    openingTime: '10:00',
    closingTime: '22:00',
    isVeg: true,
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

const popularCuisines = [
  'All', 'Pizza', 'Biryani', 'Burger', 'Chicken', 'South Indian', 'Poha', 'North Indian', 'Chinese', 'Desserts'
];

// Utility function to ensure a value is always an array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [foodTypeFilters, setFoodTypeFilters] = useState({
    all: true,
    pizza: false,
    biryani: false,
    burger: false,
    chicken: false,
    southIndian: false,
    poha: false
  });
  const [foodCategory, setFoodCategory] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
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
      const restaurantsData = response.data && response.data.length > 0 ? response.data : sampleRestaurants;
      // Validate restaurant data
      const validatedRestaurants = restaurantsData.map(restaurant => {
        if (!restaurant) return null;
        
        return {
          ...restaurant,
          openingTime: restaurant.openingTime || '00:00',
          closingTime: restaurant.closingTime || '23:59',
          cuisineType: restaurant.cuisineType || [],
          name: restaurant.name || 'Unknown Restaurant',
          description: restaurant.description || '',
          location: restaurant.location || 'Location not available',
          rating: restaurant.rating || 0,
          imageUrl: restaurant.imageUrl || 'https://via.placeholder.com/300',
          id: restaurant.id || Math.random().toString(36).substr(2, 9)
        };
      }).filter(restaurant => restaurant !== null); // Remove any null entries
      
      setRestaurants(validatedRestaurants);
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
      const favoriteIds = new Set((response.data || []).map(restaurant => restaurant.id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites(new Set());
    }
  };

  const handleToggleFavorite = async (restaurantId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
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

  const handleFoodTypeFilterChange = (event) => {
    const { name, checked } = event.target;
    
    if (name === 'all' && checked) {
      // If 'all' is checked, uncheck all other filters
      setFoodTypeFilters({
        all: true,
        pizza: false,
        biryani: false,
        burger: false,
        chicken: false,
        southIndian: false,
        poha: false
      });
    } else if (name === 'all' && !checked) {
      // If 'all' is unchecked, keep it checked (can't uncheck 'all' if nothing else is selected)
      setFoodTypeFilters({
        ...foodTypeFilters,
        all: true
      });
    } else {
      // If any other filter is changed, update accordingly and uncheck 'all'
      setFoodTypeFilters({
        ...foodTypeFilters,
        [name]: checked,
        all: false
      });
    }
  };

  const handleFoodCategoryChange = (event) => {
    setFoodCategory(event.target.value);
  };

  const isRestaurantOpen = (restaurant) => {
    try {
      // Check if restaurant or required properties are null/undefined
      if (!restaurant || typeof restaurant !== 'object') {
        console.warn('Invalid restaurant object:', restaurant);
        return false;
      }

      // Ensure opening and closing times are in correct format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!restaurant.openingTime || !restaurant.closingTime || 
          !timeRegex.test(restaurant.openingTime) || !timeRegex.test(restaurant.closingTime)) {
        console.warn(`Invalid time format for restaurant ${restaurant.name || 'unknown'}:`, {
          openingTime: restaurant.openingTime,
          closingTime: restaurant.closingTime
        });
        return false;
      }

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
      
      // Handle cases where closing time is after midnight
      if (closingTime < openingTime) {
        // Restaurant closes after midnight
        return currentTimeMinutes >= openingTime || currentTimeMinutes <= closingTime;
      }
      
      // Normal case (opening and closing on the same day)
      return currentTimeMinutes >= openingTime && currentTimeMinutes <= closingTime;
    } catch (error) {
      console.error('Error in isRestaurantOpen:', error, 'Restaurant:', restaurant);
      return false;
    }
  };

  const applyFilters = (restaurant) => {
    // Apply food type filters
    const cuisineTypes = ensureArray(restaurant.cuisineType).map(type => type.toLowerCase());
    
    if (foodTypeFilters.pizza && !cuisineTypes.includes('pizza')) return false;
    if (foodTypeFilters.biryani && !cuisineTypes.includes('biryani')) return false;
    if (foodTypeFilters.burger && !cuisineTypes.includes('burger')) return false;
    if (foodTypeFilters.chicken && !cuisineTypes.includes('chicken')) return false;
    if (foodTypeFilters.southIndian && !cuisineTypes.includes('south indian')) return false;
    if (foodTypeFilters.poha && !cuisineTypes.includes('poha')) return false;
    
    // Apply food category filter
    if (foodCategory !== 'all') {
      if (foodCategory === 'veg' && !restaurant.isVeg) return false;
      if (foodCategory === 'nonVeg' && restaurant.isVeg) return false;
    }
    
    return true;
  };

  const filteredRestaurants = (restaurants || []).filter(restaurant => {
    if (!restaurant) return false;
    
    return applyFilters(restaurant);
  });

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(scrollPosition - 300, 0));
  };

  const handleScrollRight = () => {
    const container = document.querySelector('.horizontal-scroll');
    const maxScroll = container.scrollWidth - container.clientWidth;
    setScrollPosition(Math.min(scrollPosition + 300, maxScroll));
  };

  useEffect(() => {
    const container = document.querySelector('.horizontal-scroll');
    if (container) {
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [scrollPosition]);

  // Test the isRestaurantOpen function
  const testRestaurant = {
    name: "Test Restaurant",
    openingTime: "00:00",
    closingTime: "23:59"
  };
  console.log("Test restaurant should be open:", isRestaurantOpen(testRestaurant));

  const testRestaurantAfterMidnight = {
    name: "Late Night Restaurant",
    openingTime: "22:00",
    closingTime: "04:00"
  };
  const currentHour = new Date().getHours();
  console.log("Current hour:", currentHour);
  console.log("Late night restaurant should be open if current time is between 22:00 and 04:00:", 
    isRestaurantOpen(testRestaurantAfterMidnight));

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="hero-section"
        style={{ 
          backgroundImage: `url('data:image/jpeg;base64,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')` 
        }}
      >
        <div className="hero-content">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            ADIKR Foods
          </Typography>
          <Typography variant="h5" gutterBottom>
            Delicious food delivered to your doorstep
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={Link}
            to="/restaurants"
            sx={{ mt: 2 }}
          >
            Explore Resturants
          </Button>
        </div>
      </div>

      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Popular Cuisines */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Popular Cuisines
          </Typography>
          <Box sx={{ display: 'flex', overflowX: 'auto', py: 2 }}>
            {popularCuisines.map((cuisine, index) => (
              <Chip
                key={index}
                label={cuisine}
                clickable
                color={index === 0 ? "primary" : "default"}
                sx={{ 
                  mr: 1, 
                  mb: 1,
                  backgroundColor: index === 0 ? '#ff1744' : 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: index === 0 ? '#d50000' : 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Top Meals Section */}
        <Box sx={{ mb: 6, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Top Meals
            </Typography>
            <Box>
              <IconButton onClick={handleScrollLeft} color="primary">
                <KeyboardArrowLeft />
              </IconButton>
              <IconButton onClick={handleScrollRight} color="primary">
                <KeyboardArrowRight />
              </IconButton>
            </Box>
          </Box>
          
          <Box className="horizontal-scroll" sx={{ display: 'flex', overflowX: 'auto', pb: 2 }}>
            {sampleTopMeals.map((meal) => (
              <Box key={meal.id} sx={{ minWidth: 150, mr: 2 }}>
                <Box 
                  className="circular-food-item"
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: 3,
                    mb: 1
                  }}
                >
                  <img 
                    src={meal.image} 
                    alt={meal.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'medium' }}>
                  {meal.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Rating value={meal.rating} precision={0.1} size="small" readOnly />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Main Content with Filters and Restaurants */}
        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper className="filter-sidebar" elevation={3}>
              {/* Food Type Filter */}
              <div className="filter-section">
                <Typography className="filter-title" variant="h6">
                  Food Type
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={foodTypeFilters.all} 
                        onChange={handleFoodTypeFilterChange} 
                        name="all"
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    }
                    label="All"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={foodTypeFilters.pizza} 
                        onChange={handleFoodTypeFilterChange} 
                        name="pizza"
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    }
                    label="Pizza"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={foodTypeFilters.biryani} 
                        onChange={handleFoodTypeFilterChange} 
                        name="biryani"
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    }
                    label="Biryani"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={foodTypeFilters.burger} 
                        onChange={handleFoodTypeFilterChange} 
                        name="burger"
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    }
                    label="Burger"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={foodTypeFilters.chicken} 
                        onChange={handleFoodTypeFilterChange} 
                        name="chicken"
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    }
                    label="Chicken"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={foodTypeFilters.southIndian} 
                        onChange={handleFoodTypeFilterChange} 
                        name="southIndian"
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    }
                    label="South Indian"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={foodTypeFilters.poha} 
                        onChange={handleFoodTypeFilterChange} 
                        name="poha"
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    }
                    label="Poha"
                  />
                </FormGroup>
              </div>

              <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

              {/* Food Category Filter */}
              <div className="filter-section">
                <Typography className="filter-title" variant="h6">
                  Food Category
                </Typography>
                <RadioGroup
                  value={foodCategory}
                  onChange={handleFoodCategoryChange}
                >
                  <FormControlLabel 
                    value="all" 
                    control={
                      <Radio 
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    } 
                    label="All" 
                  />
                  <FormControlLabel 
                    value="veg" 
                    control={
                      <Radio 
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    } 
                    label="Vegetarian" 
                  />
                  <FormControlLabel 
                    value="nonVeg" 
                    control={
                      <Radio 
                        sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                      />
                    } 
                    label="Non-Vegetarian" 
                  />
                </RadioGroup>
              </div>
            </Paper>
          </Grid>

          {/* Restaurants List */}
          <Grid item xs={12} md={9}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Top Restaurants
            </Typography>
            
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
                {filteredRestaurants.map((restaurant) => {
                  if (!restaurant) return null;
                  
                  const cuisineType = restaurant.cuisineType || [];
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
                            {ensureArray(cuisineType).map((cuisine, index) => (
                              <Chip 
                                key={index} 
                                label={cuisine || 'Unknown'} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(41, 121, 255, 0.1)', 
                                  borderColor: 'rgba(41, 121, 255, 0.3)',
                                  color: 'primary.main',
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
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home; 