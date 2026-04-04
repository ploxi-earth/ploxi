import axios from 'axios';
import { VENDOR_PORTAL_PAUSED_MESSAGE, VENDOR_PORTAL_PAUSED_REASON } from '@/lib/vendorAccess';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ── Request interceptor – attach token ────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor – handle 401 ────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        useAuthStore.getState().clearAuth();
        window.location.href = '/auth/login';
      }
    }

    if (error.response?.status === 403 && message === VENDOR_PORTAL_PAUSED_MESSAGE) {
      if (typeof window !== 'undefined') {
        useAuthStore.getState().clearAuth();
        window.location.href = `/auth/login?reason=${VENDOR_PORTAL_PAUSED_REASON}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
