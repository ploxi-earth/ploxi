import api from '@/lib/api';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }
export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: { _id: string; name: string; email: string; role: 'platform_admin' | 'vendor' | 'consultant' | 'manager' };
}

export const authService = {
  login: (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data),
  vendorLogin: (data: LoginPayload) => api.post<AuthResponse>('/vendor/login', data),
  adminLogin: (data: LoginPayload) => api.post<AuthResponse>('/admin/login', data),
  register: (data: RegisterPayload) => api.post<AuthResponse>('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.patch(`/auth/reset-password/${token}`, { password }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/auth/change-password', { currentPassword, newPassword }),
};
