import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Favorites = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Favorite Restaurants
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            This is a placeholder for the favorite restaurants page. This page will display a list of restaurants that the user has marked as favorites.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Favorites; 