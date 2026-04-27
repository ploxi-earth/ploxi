import api from '@/lib/api';

async function uploadVendorLogoRequest(file: File) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const fd = new FormData();
  fd.append('logo', file);
  const res = await fetch('/api/vendor/logo', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; data?: { logoUrl?: string }; message?: string };
  if (!res.ok) {
    const err = new Error(json?.message || 'Logo upload failed.') as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return json.data?.logoUrl ?? '';
}

async function uploadCorporateProfileRequest(file: File) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/vendor/corporate-profile', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; data?: { fileUrl?: string }; message?: string };
  if (!res.ok) {
    const err = new Error(json?.message || 'Corporate profile upload failed.') as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return json.data?.fileUrl ?? '';
}

export const vendorService = {
  getProfile: () => api.get('/vendor/profile'),
  updateProfile: (data: Record<string, unknown> | object) => api.put('/vendor/profile', data),
  getOnboardingStatus: () => api.get('/vendor/onboarding-status'),
  uploadLogo: (file: File) => uploadVendorLogoRequest(file),
  uploadCorporateProfile: (file: File) => uploadCorporateProfileRequest(file),
};

export const corporateService = {
  /** @deprecated Use sendOtp + verifyOtp + completeRegistration */
  register: (data: Record<string, unknown>) => api.post('/corporate/register', data),
  sendOtp: (email: string, formData: Record<string, unknown>) =>
    api.post('/corporate/register/send-otp', { email, formData }),
  verifyOtp: (email: string, otp: string) => api.post('/corporate/register/verify-otp', { email, otp }),
  completeRegistration: (data: Record<string, unknown>) => api.post('/corporate/register/complete', data),
};

export const cleantechService = {
  register: (data: Record<string, unknown>) => api.post('/cleantech/register', data),
};

const CLIMATE_OTP_ROUTES: Record<
  string,
  { send: string; verify: string }
> = {
  raise_funding: {
    send: '/climate-finance/raise-funding/send-otp',
    verify: '/climate-finance/raise-funding/verify-otp',
  },
  investor: {
    send: '/climate-finance/investor/send-otp',
    verify: '/climate-finance/investor/verify-otp',
  },
  participate: {
    send: '/climate-finance/participant/send-otp',
    verify: '/climate-finance/participant/verify-otp',
  },
};

export const climateFinanceService = {
  register: (data: Record<string, unknown>) => api.post('/climate-finance/register', data),
  /** Per-track OTP (separate Supabase tables). */
  sendOtp: async (engagementType: string, email: string, formData: Record<string, unknown>) => {
    const r = CLIMATE_OTP_ROUTES[engagementType];
    if (!r) throw new Error('Invalid engagement type.');
    return api.post(r.send, { email, formData });
  },
  verifyOtp: async (engagementType: string, email: string, otp: string) => {
    const r = CLIMATE_OTP_ROUTES[engagementType];
    if (!r) throw new Error('Invalid engagement type.');
    return api.post(r.verify, { email, otp });
  },
  completeInvestorProfile: (data: Record<string, unknown>) =>
    api.post('/climate-finance/investor/complete', data),
};

export const vendorRegistrationService = {
  sendOtp: (payload: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    password: string;
    vendorType: 'product' | 'service';
    locationsServed: string[];
    industryFocus: string[];
  }) => api.post('/vendor/register/send-otp', payload),
  verifyOtp: (email: string, otp: string) => api.post('/vendor/register/verify-otp', { email, otp }),
};
