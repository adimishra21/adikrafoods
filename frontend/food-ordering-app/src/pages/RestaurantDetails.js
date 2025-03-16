import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Box, 
  Button, 
  IconButton, 
  Chip, 
  Rating, 
  Divider, 
  Paper, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Radio, 
  RadioGroup, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Snackbar, 
  Alert 
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Add, 
  Remove, 
  ShoppingCart, 
  AccessTime, 
  LocationOn, 
  ArrowBack, 
  Star, 
  Phone, 
  Language 
} from '@mui/icons-material';
import { api } from '../config/apiConfig';
import { useAuth } from '../auth/authContext';

// Sample data for development
const sampleRestaurant = {
  id: 1,
  name: 'Spice Garden',
  description: 'Authentic Indian cuisine with a modern twist',
  imageUrl: 'https://media.istockphoto.com/id/1131393938/photo/very-stylish-indian-gourmet-restaurant.webp?a=1&b=1&s=612x612&w=0&k=20&c=Nja6_FL1Ww89l03D-Nyex4f-3PBN_IYfDp_6J3UH5Cs=',
  rating: 4.5,
  cuisineType: ['Indian', 'Curry', 'Biryani'],
  priceRange: '₹350-₹15000',
  location: 'Koramangala, Bangalore',
  openingTime: '09:00',
  closingTime: '22:00',
  isVeg: false,
  phone: '+91 9876543210',
  website: 'www.spicegarden.com',
  menuItems: [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Tender chicken cooked in a rich tomato and butter gravy',
      price: 320,
      imageUrl: 'https://media.istockphoto.com/id/1479262112/photo/butter-chicken.webp?a=1&b=1&s=612x612&w=0&k=20&c=zlL-vxHvAftRnyGhEwIKba37oSSwVwZU1UjPlMS847E=',
      category: 'Main Course',
      isVeg: false,
      isPopular: true,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Paneer Tikka Masala',
      description: 'Grilled cottage cheese cubes in a spicy tomato gravy',
      price: 280,
      imageUrl: 'https://media.istockphoto.com/id/1314562948/photo/view-from-top-of-paneer-tikka-or-cottage-cheese.webp?a=1&b=1&s=612x612&w=0&k=20&c=TiFA6ZyoeIP2kk1scZ2pml8jyY9CVzAGrnWKEpGSM_g=',
      category: 'Main Course',
      isVeg: true,
      isPopular: true,
      rating: 4.6
    },
    {
      id: 3,
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices',
      price: 350,
      imageUrl: 'https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=',
      category: 'Rice',
      isVeg: false,
      isPopular: true,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Garlic Naan',
      description: 'Soft bread topped with garlic and butter',
      price: 60,
      imageUrl: 'https://media.istockphoto.com/id/674462754/photo/coriander-naan-bread-on-wooden-board.webp?a=1&b=1&s=612x612&w=0&k=20&c=oHxsvbFtQqwcMJgmQszBZAEVaTqkcte6Lj1euO30G_A=',
      category: 'Bread',
      isVeg: true,
      isPopular: false,
      rating: 4.5
    },
    {
      id: 5,
      name: 'Dal Makhani',
      description: 'Black lentils cooked with butter and cream',
      price: 220,
      imageUrl: 'https://media.istockphoto.com/id/1338247483/photo/image-of-kadhai-style-serving-bowl-of-homemade-dal-makhani-curry-recipe-plate-of-garlic-naan.webp?a=1&b=1&s=612x612&w=0&k=20&c=u2UStkMBzblb3J5KH58Du4XuJoRrdDbrx7mzbRe2xfg=',
      category: 'Main Course',
      isVeg: true,
      isPopular: false,
      rating: 4.4
    },
    {
      id: 6,
      name: 'Gulab Jamun',
      description: 'Deep-fried milk solids soaked in sugar syrup',
      price: 120,
      imageUrl: 'https://media.istockphoto.com/id/1188000786/photo/gulab-jamun-in-bowl-on-wooden-background-indian-dessert-or-sweet-dish.webp?a=1&b=1&s=612x612&w=0&k=20&c=4kVDa_BP4pypOSvfDSL2mmLNO3SYdoAs1VG-qi4WAtI=',
      category: 'Dessert',
      isVeg: true,
      isPopular: true,
      rating: 4.9
    }
  ]
};

const restaurantMenus = {
  1: {
    id: 1,
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with a modern twist',
    imageUrl: 'https://media.istockphoto.com/id/1131393938/photo/very-stylish-indian-gourmet-restaurant.webp?a=1&b=1&s=612x612&w=0&k=20&c=Nja6_FL1Ww89l03D-Nyex4f-3PBN_IYfDp_6J3UH5Cs=',
    rating: 4.5,
    cuisineType: ['Indian', 'Curry', 'Biryani'],
    priceRange: '₹350-₹15000',
    location: 'Koramangala, Bangalore',
    openingTime: '10:00',
    closingTime: '22:00',
    isVeg: false,
    phone: '+91 9876543210',
    website: 'www.spicegarden.com',
    menuItems: [
      {
        id: 1,
        name: 'Butter Chicken',
        description: 'Tender chicken cooked in a rich tomato and butter gravy',
        price: 320,
        imageUrl: 'https://media.istockphoto.com/id/1479262112/photo/butter-chicken.webp?a=1&b=1&s=612x612&w=0&k=20&c=zlL-vxHvAftRnyGhEwIKba37oSSwVwZU1UjPlMS847E=',
        category: 'Main Course',
        isVeg: false,
        isPopular: true,
        rating: 4.8
      },
      {
        id: 2,
        name: 'Paneer Tikka Masala',
        description: 'Grilled cottage cheese cubes in a spicy tomato gravy',
        price: 280,
        imageUrl: 'https://media.istockphoto.com/id/1314562948/photo/view-from-top-of-paneer-tikka-or-cottage-cheese.webp?a=1&b=1&s=612x612&w=0&k=20&c=TiFA6ZyoeIP2kk1scZ2pml8jyY9CVzAGrnWKEpGSM_g=',
        category: 'Main Course',
        isVeg: true,
        isPopular: true,
        rating: 4.6
      },
      {
        id: 3,
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices',
        price: 350,
        imageUrl: 'https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=',
        category: 'Rice',
        isVeg: false,
        isPopular: true,
        rating: 4.7
      },
      {
        id: 4,
        name: 'Garlic Naan',
        description: 'Soft bread topped with garlic and butter',
        price: 60,
        imageUrl: 'https://media.istockphoto.com/id/674462754/photo/coriander-naan-bread-on-wooden-board.webp?a=1&b=1&s=612x612&w=0&k=20&c=oHxsvbFtQqwcMJgmQszBZAEVaTqkcte6Lj1euO30G_A=',
        category: 'Bread',
        isVeg: true,
        isPopular: false,
        rating: 4.5
      },
      {
        id: 5,
        name: 'Dal Makhani',
        description: 'Black lentils cooked with butter and cream',
        price: 220,
        imageUrl: 'https://media.istockphoto.com/id/1338247483/photo/image-of-kadhai-style-serving-bowl-of-homemade-dal-makhani-curry-recipe-plate-of-garlic-naan.webp?a=1&b=1&s=612x612&w=0&k=20&c=u2UStkMBzblb3J5KH58Du4XuJoRrdDbrx7mzbRe2xfg=',
        category: 'Main Course',
        isVeg: true,
        isPopular: false,
        rating: 4.4
      },
      {
        id: 6,
        name: 'Gulab Jamun',
        description: 'Deep-fried milk solids soaked in sugar syrup',
        price: 120,
        imageUrl: 'https://media.istockphoto.com/id/1188000786/photo/gulab-jamun-in-bowl-on-wooden-background-indian-dessert-or-sweet-dish.webp?a=1&b=1&s=612x612&w=0&k=20&c=4kVDa_BP4pypOSvfDSL2mmLNO3SYdoAs1VG-qi4WAtI=',
        category: 'Dessert',
        isVeg: true,
        isPopular: true,
        rating: 4.9
      }
    ]
  },
  2: { // Pizza Paradise
    id: 2,
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizzas and pasta',
    imageUrl: 'https://media.istockphoto.com/id/187248625/photo/pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=QHrM65XqDQd3Z50r5cT2qV4nwctw6rNMM1JTlGEEVzI=',
    rating: 4.7,
    cuisineType: ['Italian', 'Pizza', 'Pasta'],
    priceRange: '₹200-₹1000',
    location: 'Indiranagar, Bangalore',
    openingTime: '11:00',
    closingTime: '23:00',
    isVeg: false,
    phone: '+91 9876543211',
    website: 'www.pizzaparadise.com',
    menuItems: [
      {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 299,
        imageUrl: 'https://media.istockphoto.com/id/1442417585/photo/person-getting-a-piece-of-cheesy-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=k60TjxKIOIxJpd4F4yLMVjsniB4W1BpEV4Mi_nb4uJU=',
        category: 'Pizza',
        isVeg: true,
        isPopular: true,
        rating: 4.6
      },
      {
        id: 2,
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with spicy pepperoni and cheese',
        price: 399,
        imageUrl: 'https://media.istockphoto.com/id/537640710/photo/homemade-pineapple-and-ham-hawaiian-pizza.jpg?s=612x612&w=0&k=20&c=j2aAIbK9Emya9FHhBgBXG38DhC0vVGSdqK5FcsbZDHY=',
        category: 'Pizza',
        isVeg: false,
        isPopular: true,
        rating: 4.8
      },
      {
        id: 3,
        name: 'Spaghetti Carbonara',
        description: 'Classic pasta with eggs, cheese, pancetta, and black pepper',
        price: 349,
        imageUrl: 'https://media.istockphoto.com/id/1134915462/photo/spaghetti-carbonara-with-a-poached-egg.jpg?s=612x612&w=0&k=20&c=zw6jkSJHGTOSDOVXGl7AteRLwjt2dCGkxi3MwNjQb-Q=',
        category: 'Pasta',
        isVeg: false,
        isPopular: true,
        rating: 4.7
      }
    ]
  },
  3: { // Dragon House
    id: 4,
    name: 'Dragon House',
    description: 'Authentic Chinese and Pan-Asian cuisine',
    imageUrl: 'https://media.istockphoto.com/id/2157184167/photo/overhead-view-of-platter-of-sushi-rolls.jpg?s=612x612&w=0&k=20&c=-31t8M-BHarVxXOrzcUGDpfUe_lkOPNmvC7dWA3k-Uw=',
    rating: 4.6,
    cuisineType: ['Chinese', 'Thai', 'Asian'],
    priceRange: '₹250-₹1200',
    location: 'Whitefield, Bangalore',
    openingTime: '11:30',
    closingTime: '22:30',
    isVeg: false,
    phone: '+91 9876543212',
    website: 'www.dragonhouse.com',
    menuItems: [
      {
        id: 1,
        name: 'Kung Pao Chicken',
        description: 'Spicy diced chicken with peanuts and vegetables',
        price: 299,
        imageUrl: 'https://media.istockphoto.com/id/1091604352/photo/szechuan-chicken-which-is-a-popular-indo-chinese-non-vegetarian-recipe-served-in-a-plate-with.jpg?s=612x612&w=0&k=20&c=LQt67W2x0Ll4oeWRrXfZVgMYoitUHqTIwj8NtIITLvI=',
        category: 'Main Course',
        isVeg: false,
        isPopular: true,
        rating: 4.7
      },
      {
        id: 2,
        name: 'Pad Thai',
        description: 'Thai style stir-fried rice noodles with tofu and shrimp',
        price: 279,
        imageUrl: 'https://media.istockphoto.com/id/510163478/photo/pad-thai.jpg?s=612x612&w=0&k=20&c=-tOqzOMwfhq0JZrX0mfEHE4R-vaUua5I4rcuSlSeGs0=',
        category: 'Noodles',
        isVeg: false,
        isPopular: true,
        rating: 4.8
      }
    ]
  },
  4: { // South Indian DElight
    id: 4,
    name: 'South Indian Delight',
    description: 'Authentic south Indian Food',
    imageUrl: 'https://media.istockphoto.com/id/1292563627/photo/assorted-south-indian-breakfast-foods-on-wooden-background-ghee-dosa-uttappam-medhu-vada.jpg?s=612x612&w=0&k=20&c=HvuYT3RiWj5YsvP2_pJrSWIcZUXhnTKqjKhdN3j_SgY=',
    rating: 4.6,
    cuisineType: ['South Indian', 'Coast Indian'],
    priceRange: '₹250-₹1200',
    location: 'Whitefield, Bangalore',
    openingTime: '11:30',
    closingTime: '22:30',
    isVeg: true,
    phone: '+91 9876543212',
    website: 'www.southindiandelight.com',
    menuItems: [
      {
        id: 1,
        name: 'Sambar Dosa',
        description: 'Plain/Paneer Dosa with sambhar and vegetables',
        price: 299,
        imageUrl: 'https://media.istockphoto.com/id/1367508718/photo/crispy-crepes-made-of-little-millets-and-lentils-commonly-known-as-little-millet-dosa-plated.jpg?s=612x612&w=0&k=20&c=h1OLjk3vrWAMpf11n04j7-ElsO3-SufhKitjt7LKXzk=',
        category: 'Main Course',
        isVeg: true,
        isPopular: true,
        rating: 4.7
      },
      {
        id: 2,
        name: 'Idli Sambhar',
        description: 'a soft, fluffy, steamed rice cake from South India',
        price: 279,
        imageUrl: 'https://media.istockphoto.com/id/638506124/photo/idli-with-coconut-chutney-and-sambhar.jpg?s=612x612&w=0&k=20&c=ze1ngBM0LY4w9aqWx_tGe2vTAr4uf36elveTDZ83fgw=',
        category: 'cereal',
        isVeg: true,
        isPopular: true,
        rating: 4.8
      },
      {
        id: 3,
        name: 'Vada Pav',
        description: 'a popular Mumbai street food consisting of a spicy potato fritter in a bun',
        price: 99,
        imageUrl: 'https://media.istockphoto.com/id/1329213718/photo/vada-pav.jpg?s=612x612&w=0&k=20&c=Yy3pm53KrPAnZXL9weCJDzXjxa2My34oVFx7RBCPmZ8=',
        category: 'snack',
        isVeg: true,
        isPopular: true,
        rating: 4.7
      }
    ]
  },
  5:{// Burger Junction
    id: 5, 
    name: 'Burger Junction',
    description: 'Gourmet Burgers and American Classics',
    imageUrl: 'https://media.istockphoto.com/id/496389174/photo/delicious-hamburgers.jpg?s=612x612&w=0&k=20&c=vnRqLGfUhTIdcuBH9kr60nPXpd4lTZeSOeZkAsG_G5w=',
    rating: 4.8,
    cuisineType: ['American', 'Burger', 'Fast Food'],
    priceRange: '₹199-₹1499',
    location: 'HSR Layout, Bangalore',
    openingTime: '11:00',
    closingTime: '23:00',
    isVeg: false,
    phone: '+91 9876543222',
    website: 'www.burgerjunction.com',
    menuItems: [
        {
            id: 1,
            name: 'Classic Cheeseburger',
            description: 'Juicy beef patty with cheddar cheese, lettuce, and secret sauce',
            price: 399,
            imageUrl: 'https://media.istockphoto.com/id/1622449180/photo/beef-cheese-burger.jpg?s=612x612&w=0&k=20&c=JHUFTcHR10-2qcbQltBVhCOUacr_QucttZwUJO-AhY8=',
            category: 'Main Course',
            isVeg: false,
            isPopular: true,
            rating: 4.9
        },
        {
            id: 2,
            name: 'Spicy Chicken Burger',
            description: 'Crispy fried chicken burger with spicy mayo and pickles',
            price: 349,
            imageUrl: 'https://media.istockphoto.com/id/1265242728/photo/crispy-chicken-burger-with-cheese-tomato-onions-and-lettuce.jpg?s=612x612&w=0&k=20&c=WRl1S0zNx1YeVOH6ceB92FN9STcsMB0F5xu-LlgfQ3M=',
            category: 'Main Course',
            isVeg: false,
            isPopular: true,
            rating: 4.8
        },
        {
            id: 3,
            name: 'Veggie Delight Burger',
            description: 'Grilled veggie patty with fresh lettuce, tomato, and aioli sauce',
            price: 299,
            imageUrl: 'https://media.istockphoto.com/id/1489417428/photo/crispy-aloo-tikki-burger.jpg?s=612x612&w=0&k=20&c=IH9EAID6iqTWrxNujrmN0R6vTQDNR4Iy2YMkmkHiln8=',
            category: 'Snack',
            isVeg: true,
            isPopular: true,
            rating: 4.6
        }
    ]
},
6: { // Royal Biryani House
  id: 6,
  name: 'Royal Biryani House',
  description: 'Aromatic and flavorful biryanis from across India',
  imageUrl: 'https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=',
  rating: 4.7,
  cuisineType: ['Indian', 'Biryani', 'Mughlai'],
  priceRange: '₹250-₹1800',
  location: 'JP Nagar, Bangalore',
  openingTime: '11:00',
  closingTime: '23:00',
  isVeg: false,
  phone: '+91 9876543233',
  website: 'www.royalbiryani.com',
  menuItems: [
      {
          id: 1,
          name: 'Hyderabadi Dum Biryani',
          description: 'Slow-cooked basmati rice with marinated chicken and aromatic spices',
          price: 399,
          imageUrl: 'https://media.istockphoto.com/id/1403698924/photo/hyderabadi-chicken-biryani.jpg?s=612x612&w=0&k=20&c=IkXY2h3EIzF8XtqxFAtd_5DQGkpJAg6bLRwJdeObXAk=',
          category: 'Main Course',
          isVeg: false,
          isPopular: true,
          rating: 4.8
      },
      {
          id: 2,
          name: 'Veg Biryani',
          description: 'Fragrant rice cooked with fresh vegetables and mild spices',
          price: 349,
          imageUrl: 'https://media.istockphoto.com/id/1278490087/photo/veg-biryani.jpg?s=612x612&w=0&k=20&c=JENLKZLGaS3B_liz_8BFI_XBR3GqOH3cOJx8WJswnBw=',
          category: 'Main Course',
          isVeg: true,
          isPopular: false,
          rating: 4.5
      },
      {
          id: 3,
          name: 'Mutton Biryani',
          description: 'Tender mutton pieces cooked with basmati rice and saffron',
          price: 499,
          imageUrl: 'https://media.istockphoto.com/id/1287565213/photo/mutton-biryani.jpg?s=612x612&w=0&k=20&c=IhSvVpqCM5ULZLULlGmpWmIklfRsdZfMgSWclp6x04I=',
          category: 'Main Course',
          isVeg: false,
          isPopular: true,
          rating: 4.9
      }
  ]
},
7: { // Fresh Squeeze Juicery
  id: 7,
  name: 'Fresh Squeeze Juicery',
  description: 'Healthy and refreshing juices made from fresh fruits and vegetables',
  imageUrl: 'https://media.istockphoto.com/id/540519504/photo/fresh-smoothies-in-glass.jpg?s=612x612&w=0&k=20&c=KCjc6ItwKEW_pAF9i46tlND0la2d5QM-nfL9onfflxs=',
  rating: 4.6,
  cuisineType: ['Juices', 'Smoothies', 'Healthy'],
  priceRange: '₹80-₹500',
  location: 'MG Road, Bangalore',
  openingTime: '08:00',
  closingTime: '22:00',
  isVeg: true,
  phone: '+91 9876543234',
  website: 'www.freshsqueeze.com',
  menuItems: [
      {
          id: 1,
          name: 'Mango Smoothie',
          description: 'A rich and creamy mango smoothie with a hint of honey',
          price: 199,
          imageUrl: 'https://media.istockphoto.com/id/1318362821/photo/mango-smoothie.jpg?s=612x612&w=0&k=20&c=D4oAWh4syLP4m7-B28AyK-Ow0SAtT7tgye7uBIKWVD0=',
          category: 'Smoothie',
          isVeg: true,
          isPopular: true,
          rating: 4.8
      },
      {
          id: 2,
          name: 'Orange Carrot Detox Juice',
          description: 'A refreshing blend of fresh oranges, carrots, and ginger',
          price: 149,
          imageUrl: 'https://media.istockphoto.com/id/466096984/photo/healthy-drink-served-on-a-platter.jpg?s=612x612&w=0&k=20&c=OVHxVP8ccdOvRmHhvhVtkR765BbGqGp-CDZAXBG8v7s=',
          category: 'Juice',
          isVeg: true,
          isPopular: true,
          rating: 4.7
      },
      {
          id: 3,
          name: 'Mixed Berry Blast',
          description: 'A mix of strawberries, blueberries, and raspberries blended to perfection',
          price: 229,
          imageUrl: 'https://media.istockphoto.com/id/1411862737/video/pour-worn-ripe-red-strawberries-into-a-glass.jpg?s=640x640&k=20&c=P5V0nn8QMTVJK_swN7igQZR4TPZ3vzZTxm7zRwcxOIo=',
          category: 'Smoothie',
          isVeg: true,
          isPopular: false,
          rating: 4.6
      }
  ]
},
8: { // Sweet Temptations
  id: 8,
  name: 'Sweet Temptations',
  description: 'Delicious desserts and sweet delicacies for every occasion',
  imageUrl: 'https://media.istockphoto.com/id/1215697769/photo/variety-of-desserts.jpg?s=612x612&w=0&k=20&c=szCUuSuPfRXNYidZUN5kg3nxF9C8KrWxHRi77PmbAdM=',
  rating: 4.8,
  cuisineType: ['Desserts', 'Bakery', 'Sweets'],
  priceRange: '₹100-₹1500',
  location: 'Brigade Road, Bangalore',
  openingTime: '10:00',
  closingTime: '22:00',
  isVeg: true,
  phone: '+91 9876543235',
  website: 'www.sweettemptations.com',
  menuItems: [
      {
          id: 1,
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with a gooey molten center',
          price: 249,
          imageUrl: 'https://media.istockphoto.com/id/912526854/photo/molten-chocolate-lava-cake.jpg?s=612x612&w=0&k=20&c=w7mYtrNNm5NPeLz9j2L8Xch6ebXNeFkRsWyOaf0BxFw=',
          category: 'Dessert',
          isVeg: true,
          isPopular: true,
          rating: 4.9
      },
      {
          id: 2,
          name: 'Classic Cheesecake',
          description: 'Rich and creamy cheesecake with a buttery graham cracker crust',
          price: 299,
          imageUrl: 'https://media.istockphoto.com/id/1453724992/photo/classic-new-york-style-cheesecake.jpg?s=612x612&w=0&k=20&c=fnReydXAtpIz8rWt_Tz1FS4xrlEqvlSgSVP8h7sxCec=',
          category: 'Dessert',
          isVeg: true,
          isPopular: false,
          rating: 4.7
      },
      {
          id: 3,
          name: 'Gulab Jamun Sundae',
          description: 'A fusion of traditional Gulab Jamun with creamy vanilla ice cream',
          price: 199,
          imageUrl: 'https://media.istockphoto.com/id/1292801107/photo/gulab-jamun-ice-cream.jpg?s=612x612&w=0&k=20&c=rOvsoFzWmv5Npb2-90GizHfgkht4Se9G0uUCPGbQpck=',
          category: 'Dessert',
          isVeg: true,
          isPopular: true,
          rating: 4.8
      }
  ]
}

};

// Utility function to ensure a value is always an array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

// Add this error boundary component at the top of the file
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" paragraph>
            There was an error loading this restaurant's details.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.href = '/'}
          >
            Return to Home
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodTypeFilters, setFoodTypeFilters] = useState({
    all: true,
    mainCourse: false,
    rice: false,
    bread: false,
    dessert: false,
    starter: false
  });
  const [foodCategory, setFoodCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    setLoading(true);
    try {
      let restaurantData;
      let menuItemsData = [];
      
      // First try to get data from API
      try {
        const response = await api.get(`/api/restaurants/${id}`);
        console.log('API Restaurant details response:', response.data);
        restaurantData = response.data;
        
        // Try to get menu items from API
        const menuResponse = await api.get(`/api/restaurants/${id}/menu-items`);
        console.log('API Menu items response:', menuResponse.data);
        menuItemsData = menuResponse.data || [];
      } catch (apiError) {
        console.log('API error, checking hardcoded data:', apiError);
        // Check hardcoded data
        if (restaurantMenus[id]) {
          console.log('Found hardcoded restaurant data for ID:', id);
          restaurantData = restaurantMenus[id];
          menuItemsData = restaurantData.menuItems || [];
        } else {
          console.log('No hardcoded data found for ID:', id, 'Using default restaurant');
          restaurantData = restaurantMenus[1]; // Default to first restaurant
          menuItemsData = restaurantData.menuItems || [];
        }
      }
      
      // If we still don't have data, throw an error
      if (!restaurantData) {
        throw new Error('No restaurant data available');
      }
      
      // Ensure all required properties exist
      const validatedRestaurant = {
        ...restaurantData,
        id: restaurantData.id || id, // Ensure we have an ID
        name: restaurantData.name || 'Unknown Restaurant',
        description: restaurantData.description || 'No description available',
        imageUrl: restaurantData.imageUrl || 'https://via.placeholder.com/800x400',
        rating: restaurantData.rating || 0,
        cuisineType: restaurantData.cuisineType || [],
        priceRange: restaurantData.priceRange || 'Not specified',
        location: restaurantData.location || 'Location not available',
        openingTime: restaurantData.openingTime || '00:00',
        closingTime: restaurantData.closingTime || '23:59',
        phone: restaurantData.phone || 'Not available',
        website: restaurantData.website || ''
      };
      
      // Validate menu items
      const validatedMenuItems = menuItemsData.map(item => ({
        ...item,
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: item.name || 'Unknown Item',
        description: item.description || 'No description available',
        price: item.price || 0,
        imageUrl: item.imageUrl || 'https://via.placeholder.com/400',
        category: item.category || 'Other',
        isVeg: item.isVeg || false,
        isPopular: item.isPopular || false,
        rating: item.rating || 0
      }));
      
      setRestaurant(validatedRestaurant);
      setMenuItems(validatedMenuItems);
      setError(null);
      
      console.log('Set restaurant data:', validatedRestaurant);
      console.log('Set menu items:', validatedMenuItems);
      
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      setError('Failed to load restaurant details. Please try again later.');
      setRestaurant(null);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodTypeFilterChange = (event) => {
    const { name, checked } = event.target;
    
    if (name === 'all' && checked) {
      // If 'all' is checked, uncheck all other filters
      setFoodTypeFilters({
        all: true,
        mainCourse: false,
        rice: false,
        bread: false,
        dessert: false,
        starter: false
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

  const handleAddToCart = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleConfirmAddToCart = async () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please login to add items to cart');
      setSnackbarOpen(true);
      setOpenDialog(false);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            returnTo: `/restaurants/${restaurant.id}`,
            message: 'Please login to add items to your cart'
          } 
        });
      }, 2000);
      return;
    }

    try {
      // Make sure we have a valid item and restaurant
      if (!selectedItem || !selectedItem.id || !restaurant || !restaurant.id) {
        console.error('Invalid item or restaurant:', { selectedItem, restaurant });
        setSnackbarMessage('Invalid item or restaurant selected. Please try again.');
        setSnackbarOpen(true);
        setOpenDialog(false);
        return;
      }

      const cartItem = {
        menuItemId: selectedItem.id,
        restaurantId: restaurant.id,
        quantity: quantity,
        name: selectedItem.name,
        price: selectedItem.price,
        imageUrl: selectedItem.imageUrl || '',
        isVeg: selectedItem.isVeg || false
      };

      console.log('Adding to cart:', JSON.stringify(cartItem));
      
      // Log authentication status and token for debugging
      const token = localStorage.getItem('jwt');
      console.log('Authentication status:', {
        isAuthenticated,
        userExists: !!user,
        userEmail: user?.email,
        tokenExists: !!token,
        tokenFirstChars: token ? token.substring(0, 15) + '...' : 'none'
      });
      
      const response = await api.post('/api/cart/add', cartItem);
      console.log('Add to cart response:', response.data);
      
      // Show success message
      setSnackbarMessage(`Added ${quantity} ${selectedItem.name} to cart`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error details:', error.response?.data);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        console.log('Authentication error detected. Redirecting to login.');
        setSnackbarMessage('Your session has expired. Please login again.');
        setSnackbarOpen(true);
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              returnTo: `/restaurants/${restaurant.id}`,
              message: 'Please login again to continue shopping'
            } 
          });
        }, 2000);
      } else {
        setSnackbarMessage(
          error.response?.data?.message || 
          'Failed to add item to cart. Please try again.'
        );
        setSnackbarOpen(true);
      }
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please login to add to favorites');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await api.post(`/api/restaurants/${restaurant.id}/favorite`);
      console.log('Toggle favorite response:', response.data);
      setIsFavorite(!isFavorite);
      setSnackbarMessage(isFavorite 
        ? `Removed ${restaurant.name} from favorites` 
        : `Added ${restaurant.name} to favorites`
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to update favorites. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const isRestaurantOpen = () => {
    try {
      // Temporary fix: always return true to bypass any issues
      return true;
      
      /* Original code commented out for debugging
      if (!restaurant) return false;
      
      // Check if opening and closing times exist
      if (!restaurant.openingTime || !restaurant.closingTime) {
        console.warn(`Restaurant ${restaurant.name || 'unknown'} is missing opening/closing times`);
        return false;
      }
      
      // Validate time format with regex
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(restaurant.openingTime) || !timeRegex.test(restaurant.closingTime)) {
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
      */
    } catch (error) {
      console.error('Error in isRestaurantOpen:', error, 'Restaurant:', restaurant);
      return false;
    }
  };

  const filteredMenuItems = (menuItems || []).filter(item => {
    if (foodCategory === 'all') return true;
    return item.category === foodCategory;
  }) || [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Restaurant not found</Typography>
      </Box>
    );
  }

  const isOpen = isRestaurantOpen();

  return (
    <ErrorBoundary>
      <div>
        {/* Restaurant Header */}
        <Box 
          sx={{ 
            position: 'relative',
            height: '300px',
            backgroundImage: `url(${restaurant.imageUrl || 'https://via.placeholder.com/800x400'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              p: 3
            }}
          >
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16, 
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
              onClick={() => navigate('/')}
            >
              <ArrowBack sx={{ color: 'white' }} />
            </IconButton>
            
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? 
                <Favorite sx={{ color: '#ff1744' }} /> : 
                <FavoriteBorder sx={{ color: 'white' }} />
              }
            </IconButton>
            
            <Box 
              className={`restaurant-status ${isOpen ? 'open' : 'closed'}`}
              sx={{
                position: 'absolute',
                top: 16,
                right: 80,
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                backgroundColor: isOpen ? 'success.main' : 'error.main',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {isOpen ? 'OPEN' : 'CLOSED'}
            </Box>
            
            <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
              {restaurant.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Rating value={restaurant.rating} precision={0.1} readOnly />
              <Typography variant="body1" sx={{ ml: 1, color: 'white' }}>
                {restaurant.rating} • {restaurant.priceRange}
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
          </Box>
        </Box>

        <Container maxWidth="lg">
          {/* Restaurant Info */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" paragraph>
                {restaurant.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Opening Hours
                    </Typography>
                    <Typography variant="body1">
                      {restaurant.openingTime} - {restaurant.closingTime}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {restaurant.location}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {restaurant.phone}
                    </Typography>
                  </Box>
                </Box>
                
                {restaurant.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Language color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Website
                      </Typography>
                      <Typography variant="body1">
                        {restaurant.website}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.imageUrl}
                  alt={restaurant.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Info
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Cuisine:</strong> {ensureArray(restaurant.cuisineType).join(', ') || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Price Range:
                    </Typography>
                    <Typography variant="body2">
                      {restaurant.priceRange}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Veg/Non-Veg:
                    </Typography>
                    <Typography variant="body2">
                      {restaurant.isVeg ? 'Pure Veg' : 'Both Veg & Non-Veg'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

          {/* Menu Section */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Menu
          </Typography>

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
                          checked={foodTypeFilters.mainCourse} 
                          onChange={handleFoodTypeFilterChange} 
                          name="mainCourse"
                          sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                        />
                      }
                      label="Main Course"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={foodTypeFilters.rice} 
                          onChange={handleFoodTypeFilterChange} 
                          name="rice"
                          sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                        />
                      }
                      label="Rice"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={foodTypeFilters.bread} 
                          onChange={handleFoodTypeFilterChange} 
                          name="bread"
                          sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                        />
                      }
                      label="Bread"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={foodTypeFilters.dessert} 
                          onChange={handleFoodTypeFilterChange} 
                          name="dessert"
                          sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                        />
                      }
                      label="Dessert"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={foodTypeFilters.starter} 
                          onChange={handleFoodTypeFilterChange} 
                          name="starter"
                          sx={{ color: '#2979ff', '&.Mui-checked': { color: '#2979ff' } }}
                        />
                      }
                      label="Starter"
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

            {/* Menu Items */}
            <Grid item xs={12} md={9}>
              {filteredMenuItems.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">No menu items match your filters</Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => {
                      setFoodTypeFilters({
                        all: true,
                        mainCourse: false,
                        rice: false,
                        bread: false,
                        dessert: false,
                        starter: false
                      });
                      setFoodCategory('all');
                    }}
                    sx={{ mt: 2 }}
                  >
                    Reset Filters
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredMenuItems.map((item) => (
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
                        {item.isPopular && (
                          <Chip 
                            label="Popular" 
                            color="primary" 
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              right: 10, 
                              zIndex: 1,
                              fontWeight: 'bold'
                            }}
                          />
                        )}
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
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              ₹{item.price}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<ShoppingCart />}
                              onClick={() => handleAddToCart(item)}
                              disabled={!isOpen}
                            >
                              Add
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>

        {/* Add to Cart Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add to Cart</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.name} 
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                  />
                  <Box>
                    <Typography variant="h6">{selectedItem.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedItem.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ₹{selectedItem.price}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                  <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Remove />
                  </IconButton>
                  <TextField
                    value={quantity}
                    InputProps={{ readOnly: true }}
                    sx={{ width: 60, mx: 1, '& input': { textAlign: 'center' } }}
                  />
                  <IconButton onClick={() => handleQuantityChange(1)}>
                    <Add />
                  </IconButton>
                </Box>
                
                <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                  Total: ₹{selectedItem.price * quantity}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleConfirmAddToCart}
              startIcon={<ShoppingCart />}
            >
              Add to Cart
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </ErrorBoundary>
  );
};

const RestaurantDetailsWithErrorBoundary = () => (
  <ErrorBoundary>
    <RestaurantDetails />
  </ErrorBoundary>
);

export default RestaurantDetailsWithErrorBoundary; 