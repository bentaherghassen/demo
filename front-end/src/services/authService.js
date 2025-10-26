// src/services/authService.js

/**
 * Stores the JWT in localStorage.
 * @param {string} token The JWT to store.
 */
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Retrieves the JWT from localStorage.
 * @returns {string|null} The JWT or null if not found.
 */
export const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Removes the JWT from localStorage.
 */
export const removeToken = () => {
  localStorage.removeItem('authToken');
};
