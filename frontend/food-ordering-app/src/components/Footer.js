import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[900],
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Food Ordering App
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Discover the best food from restaurants near you.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/restaurants" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Restaurants
            </Link>
            <Link component={RouterLink} to="/profile" color="inherit" sx={{ display: 'block', mb: 1 }}>
              My Profile
            </Link>
            <Link component={RouterLink} to="/cart" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Cart
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Join Us
            </Typography>
            <Link component={RouterLink} to="/register" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Register as Customer
            </Link>
            <Link component={RouterLink} to="/register" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Register as Restaurant Owner
            </Link>
            <Link component={RouterLink} to="/login" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Login
            </Link>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {'© '}
          {new Date().getFullYear()}
          {' Food Ordering App. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;