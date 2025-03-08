import api from '../config/api';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login a user
export const login = async (userData) => {
  try {
    const response = await api.post('/auth/signin', userData);
    if (response.data.jwt) {
      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout a user
export const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('jwt') !== null;
}; 