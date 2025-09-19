import axios from 'axios';
import { createClient } from '@/lib/supabase/client';

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
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we're in a browser environment
    if (typeof window !== 'undefined') {
      // Handle 401 Unauthorized errors
      if (error.response && error.response.status === 401) {
        const supabase = createClient();
        await supabase.auth.signOut();
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