import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useToast } from '@/components/GlobalComponents/Notifications';

// Create a custom axios instance for the NestJS backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Toast messages for different scenarios
const TOAST_MESSAGES = {
  unauthorized: {
    title: 'Authentication Required',
    message: 'Please login to continue.',
    type: 'error',
  },
  forbidden: {
    title: 'Access Denied',
    message: 'You do not have permission to access this resource.',
    type: 'error',
  },
  serverError: {
    title: 'Server Error',
    message: 'Something went wrong. Please try again later.',
    type: 'error',
  },
  networkError: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    type: 'warning',
  },
};

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

// Function to show toast notifications
let toast = useToast;


// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we're in a browser environment
    if (typeof window !== 'undefined') {
      // Handle 401 Unauthorized errors
      if (error.response && error.response.status === 401) {
        // Show unauthorized toast if toast function is available
        if (toast) {
          const { title, message, type } = TOAST_MESSAGES.unauthorized;
          toast(type, title, message);
        }
        
        // Redirect to login page - NextAuth will handle the session expiry
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden errors (authenticated but not authorized)
      else if (error.response && error.response.status === 403) {
        // Show forbidden toast if toast function is available
        if (toast) {
          const { title, message, type } = TOAST_MESSAGES.forbidden;
          toast(type, title, message);
        }
        
        // Optional: Redirect to unauthorized page
        // window.location.href = '/unauthorized';
      }
      
      // Handle 500 and other server errors
      else if (error.response && error.response.status >= 500) {
        if (toast) {
          const { title, message, type } = TOAST_MESSAGES.serverError;
          toast(type, title, message);
        }
      }
      
      // Handle network errors (when server is unreachable)
      else if (error.message === 'Network Error') {
        if (toast) {
          const { title, message, type } = TOAST_MESSAGES.networkError;
          toast(type, title, message);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;