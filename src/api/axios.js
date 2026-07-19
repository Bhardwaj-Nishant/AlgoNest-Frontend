import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ----- Request Interceptor: Attach JWT -----
api.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Response Interceptor: Handle 401 & Refresh -----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting to refresh session...');
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !data.session) {
          console.error('❌ Refresh failed:', refreshError?.message || 'No session');
          // Sign out and reject
          await supabase.auth.signOut();
          // Do NOT redirect here; let the caller handle it
          return Promise.reject(error);
        }

        console.log('✅ Session refreshed successfully');
        // Update the token and retry
        const newToken = data.session.access_token;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh exception:', refreshError);
        await supabase.auth.signOut();
        return Promise.reject(error);
      }
    }

    // If it's a 401 but we already retried, just reject
    if (error.response?.status === 401) {
      // Don't auto-logout; let the component handle it
      console.warn('⚠️ 401 Unauthorized after retry, rejecting');
    }

    return Promise.reject(error);
  }
);

export default api;