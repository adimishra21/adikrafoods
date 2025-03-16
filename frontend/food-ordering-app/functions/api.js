const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Your API routes will go here
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Export the handler
exports.handler = serverless(app); 