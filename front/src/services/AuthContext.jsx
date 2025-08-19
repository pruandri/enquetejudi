import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // Verify the token
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Call a protected route to verify token
      const response = await axios.get('http://localhost:8081/groupe-enqueteur/protected');
      
      // If successful, set user
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      // Token is invalid, clear it
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset user and authentication state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Provide context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};