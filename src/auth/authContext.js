import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('jwt');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // Set default auth header for all requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with:', { email });
      
      // Make login request
      const response = await api.post('/auth/signin', { email, password });
      
      console.log('Login response:', response.data);
      
      // Check if response contains token and user data
      if (response.data && response.data.jwt) {
        // Store token and user data
        localStorage.setItem('jwt', response.data.jwt);
        
        // Extract user data from response
        const userData = {
          id: response.data.id || response.data.userId,
          email: response.data.email || email,
          fullName: response.data.fullName || response.data.name || 'User',
          role: response.data.role || 'ROLE_CUSTOMER'
        };
        
        console.log('Storing user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set default auth header for all requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
        
        setUser(userData);
        return { success: true };
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.response.status === 403) {
          errorMessage = 'Access denied. You do not have permission to log in.';
          console.error('Access denied details:', err.response.data);
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // No response received
        errorMessage = 'No response from server. Please check your connection or if the server is running.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Make registration request
      const response = await api.post('/auth/signup', userData);
      
      if (response.data && response.data.message) {
        // Registration successful
        return { success: true, message: response.data.message };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // Server responded with an error
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid registration data. Please check your information.';
        } else if (err.response.status === 409) {
          errorMessage = 'Email already exists. Please use a different email.';
        }
      } else if (err.request) {
        // No response received
        errorMessage = 'No response from server. Please check your connection or if the server is running.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token and user data from storage
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 