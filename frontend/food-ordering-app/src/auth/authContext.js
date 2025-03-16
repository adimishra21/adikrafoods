import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../config/apiConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const storedUser = localStorage.getItem('user');
    
    console.log('AuthContext initialized. Token exists:', !!token);
    console.log('AuthContext initialized. Stored user exists:', !!storedUser);
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed stored user:', parsedUser);
        
        // Set the JWT token in axios defaults
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(parsedUser);
        console.log('User state set:', parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      }
    } else {
      console.log('No stored authentication data found');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await api.post('/auth/signin', { email, password });
      console.log('Login response:', response.data);
      
      const { jwt, message, role, fullName } = response.data;
      
      // Check if the response contains the expected data
      if (!jwt) {
        console.error('Invalid response format - missing JWT token');
        return { 
          success: false, 
          error: 'Invalid response from server. Please try again.' 
        };
      }
      
      // Create a user object from the response
      const userData = {
        email,
        role,
        fullName: fullName || email.split('@')[0] // Use fullName from response or fallback to email
      };
      
      console.log('Storing user data:', userData);
      
      // Set the JWT token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      console.log('Authentication successful, user state updated:', userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Handle network errors
      if (!error.response) {
        return { 
          success: false, 
          error: 'No response from server. Please check your connection or if the server is running.' 
        };
      }
      
      // Handle specific error codes
      if (error.response) {
        console.log('Error response:', error.response);
        
        if (error.response.status === 401) {
          return { 
            success: false, 
            error: 'Invalid email or password. Please try again.' 
          };
        } else if (error.response.data && error.response.data.message) {
          return { 
            success: false, 
            error: error.response.data.message 
          };
        } else {
          return { 
            success: false, 
            error: `Error ${error.response.status}: ${error.response.statusText}` 
          };
        }
      }
      
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData);
      
      const response = await api.post('/auth/signup', userData);
      console.log('Registration response:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle network errors
      if (!error.response) {
        return { 
          success: false, 
          error: 'No response from server. Please check your connection or if the server is running.' 
        };
      }
      
      // Handle specific error codes
      if (error.response) {
        console.log('Error response:', error.response);
        
        if (error.response.status === 401) {
          return { 
            success: false, 
            error: 'Authentication required to register. Please contact the administrator.' 
          };
        } else if (error.response.status === 409) {
          return { 
            success: false, 
            error: 'Email already registered. Please use a different email.' 
          };
        } else if (error.response.data && error.response.data.message) {
          return { 
            success: false, 
            error: error.response.data.message 
          };
        } else {
          return { 
            success: false, 
            error: `Error ${error.response.status}: ${error.response.statusText}` 
          };
        }
      }
      
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      };
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('User logged out, state cleared');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isRestaurantOwner: user?.role === 'ROLE_RESTAURANT_OWNER',
    isCustomer: user?.role === 'ROLE_CUSTOMER',
  };

  console.log('AuthContext current state:', {
    user,
    loading,
    isAuthenticated: !!user
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 