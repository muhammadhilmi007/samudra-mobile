// src/api/endpoints/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../../constants/config';

// Create API instance
export const api = axios.create({
  baseURL: CONFIG.API_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from storage
      const token = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      
      // If token exists, add to headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized error (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear token from storage
        await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        
        // You can add token refresh logic here if needed
        // For now, reject the promise to handle logout in the UI
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API utility functions
export const apiService = {
  /**
   * Handle API error response
   * @param error Error from axios
   * @returns Formatted error message
   */
  handleError: (error: any): string => {
    if (error.response) {
      // The request was made and the server responded with an error status
      if (error.response.data && error.response.data.message) {
        return error.response.data.message;
      }
      return `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      return error.message || 'An unexpected error occurred.';
    }
  },
  
  /**
   * Set auth token
   * @param token JWT token
   */
  setAuthToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
  },
  
  /**
   * Clear auth token
   */
  clearAuthToken: async (): Promise<void> => {
    await AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  },
};