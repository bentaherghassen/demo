// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // Correct import
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        removeToken();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      // Replace with your actual API call
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, credentials);
      const { token } = response.data;

      setToken(token);
      const decoded = jwtDecode(token);
      setUser(decoded);

      return { token };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'An unexpected error occurred.' };
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const handleRegister = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
      const { token } = response.data;

      setToken(token);
      const decoded = jwtDecode(token);
      setUser(decoded);

      return { token };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        return { error: error.response.data.message };
      }
      return { error: 'An unexpected error occurred during registration.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout, handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};
