import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Events = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            This is a placeholder for the events page. This page will display upcoming food events, promotions, and special offers from restaurants.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Events; 