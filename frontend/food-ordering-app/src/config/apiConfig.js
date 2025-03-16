import axios from 'axios';

// Get the API URL from environment variable, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5454';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('jwt');
    
    // Enhanced request logging
    const isAuthEndpoint = config.url.includes('/auth/');
    const isCartEndpoint = config.url.includes('/api/cart/');
    
    console.log(`API Request to ${isAuthEndpoint ? 'AUTH' : isCartEndpoint ? 'CART' : 'OTHER'} endpoint:`, {
      url: config.url,
      method: config.method,
      data: config.data ? (isAuthEndpoint ? {...config.data, password: '***HIDDEN***'} : config.data) : undefined
    });
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Added token to ${config.url} request:`, `Bearer ${token.substring(0, 15)}...`);
    } else {
      console.log(`No token available for ${config.url} request`);
      
      // Special handling for cart endpoints
      if (isCartEndpoint) {
        console.warn('IMPORTANT: Attempting to access cart endpoint without authentication token!');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Enhanced response logging
    const isAuthEndpoint = response.config.url.includes('/auth/');
    
    console.log(`API Response from ${isAuthEndpoint ? 'AUTH' : 'OTHER'} endpoint:`, {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: isAuthEndpoint ? 
        (response.data.jwt ? 
          {...response.data, jwt: `${response.data.jwt.substring(0, 15)}...`} : 
          response.data) : 
        response.data
    });
    
    // For authentication responses, log token handling
    if (isAuthEndpoint && response.data && response.data.jwt) {
      console.log('Authentication successful, token received and will be stored');
    }
    
    return response;
  },
  (error) => {
    // Enhanced error logging
    const url = error.config?.url || 'unknown endpoint';
    const isAuthEndpoint = url.includes('/auth/');
    const isCartEndpoint = url.includes('/api/cart/');
    
    console.error(`API Error from ${isAuthEndpoint ? 'AUTH' : isCartEndpoint ? 'CART' : 'OTHER'} endpoint:`, {
      url: url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Additional debugging for authentication errors
    if (error.response?.status === 401) {
      const authHeader = error.config?.headers?.Authorization;
      console.error('Authentication failed. Auth header:', authHeader ? `${authHeader.substring(0, 15)}...` : 'not present');
      
      // Add user info from localStorage for debugging
      const userStr = localStorage.getItem('user');
      console.error('Current user in localStorage:', userStr ? JSON.parse(userStr) : 'no user found');
    }
    
    // Handle 401 Unauthorized or 403 Forbidden errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Authentication error detected, clearing token');
      
      // Only redirect for API calls (not auth endpoints)
      if (!isAuthEndpoint) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/login') {
          console.log(`Redirecting to login from ${window.location.pathname}`);
          window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export { api }; 