import api from '@/lib/api';

export const vendorService = {
  getProfile: () => api.get('/vendor/profile'),
  updateProfile: (data: Record<string, unknown> | object) => api.put('/vendor/profile', data),
  getOnboardingStatus: () => api.get('/vendor/onboarding-status'),
};

export const corporateService = {
  register: (data: Record<string, unknown>) => api.post('/corporate/register', data),
};

export const cleantechService = {
  register: (data: Record<string, unknown>) => api.post('/cleantech/register', data),
};

export const climateFinanceService = {
  register: (data: Record<string, unknown>) => api.post('/climate-finance/register', data),
};
