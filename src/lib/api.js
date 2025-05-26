import axios from 'axios';
import { getSession } from 'next-auth/react';

// Create a custom axios instance for the NestJS backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  async (config) => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we're in a browser environment
    if (typeof window !== 'undefined') {
      // Handle 401 Unauthorized errors
      if (error.response && error.response.status === 401) {
        // Redirect to login page - NextAuth will handle the session expiry
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden errors (authenticated but not authorized)
      else if (error.response && error.response.status === 403) {
        console.error('Access forbidden:', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;