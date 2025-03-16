import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Payment = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Methods
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            This is a placeholder for the payment methods page. This page will allow users to manage their payment methods and view payment history.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Payment; 