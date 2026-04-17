import api from '@/lib/api';

export const adminService = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Vendor management
  getVendors: (params?: { status?: string; page?: number; limit?: number; search?: string }) =>
    api.get('/admin/vendors', { params }),
  getVendor: (id: string) => api.get(`/admin/vendors/${id}`),
  addVendor: (data: { companyName: string; email: string; phone: string; contactPerson: string }) =>
    api.post('/admin/vendors', data),
  approveVendor: (id: string, note?: string) =>
    api.patch(`/admin/vendors/${id}/approve`, { note }),
  rejectVendor: (id: string, note: string) =>
    api.patch(`/admin/vendors/${id}/reject`, { note }),
  sendAgreement: (id: string, data: { note?: string }) =>
    api.patch(`/admin/vendors/${id}/send-agreement`, data),
  markAgreementViewed: (id: string) => api.patch(`/admin/vendors/${id}/mark-viewed`),
  markAgreementSigned: (id: string) => api.patch(`/admin/vendors/${id}/mark-signed`),
  completeOnboarding: (id: string) => api.patch(`/admin/vendors/${id}/complete-onboarding`),
  setVendorPortalAccess: (
    id: string,
    data: { portalAccessStatus: 'active' | 'paused'; reason?: string }
  ) => api.patch(`/admin/vendors/${id}/portal-access`, data),

  // Registrations
  getCorporateRegistrations: (params?: { status?: string; page?: number }) =>
    api.get('/admin/registrations/corporate', { params }),
  getCleantechRegistrations: (params?: { status?: string; page?: number }) =>
    api.get('/admin/registrations/cleantech', { params }),
  getClimateFinanceRegistrations: (params?: { status?: string; engagementType?: string; page?: number }) =>
    api.get('/admin/registrations/climate-finance', { params }),
};
