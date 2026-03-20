import api from '@/lib/api';

export const portalService = {
    // Dashboard
    getDashboard: () => api.get('/portal/dashboard'),

    // Services
    getServices: () => api.get('/portal/services'),
    createService: (data: Record<string, unknown>) => api.post('/portal/services', data),
    updateService: (id: string, data: Record<string, unknown>) => api.patch(`/portal/services/${id}`, data),
    deleteService: (id: string) => api.delete(`/portal/services/${id}`),

    // Projects
    getProjects: (status?: string) => api.get('/portal/projects', { params: status ? { status } : {} }),
    createProject: (data: Record<string, unknown>) => api.post('/portal/projects', data),
    updateProject: (id: string, data: Record<string, unknown>) => api.patch(`/portal/projects/${id}`, data),
    deleteProject: (id: string) => api.delete(`/portal/projects/${id}`),

    // Meetings
    getMeetings: () => api.get('/portal/meetings'),

    // Documents
    getDocuments: () => api.get('/portal/documents'),
    createDocument: (data: Record<string, unknown>) => api.post('/portal/documents', data),

    // Notifications
    getNotifications: () => api.get('/portal/notifications'),
    markNotificationRead: (id: string) => api.patch(`/portal/notifications/${id}/read`),
    markAllRead: () => api.patch('/portal/notifications/read-all'),

    // Settings
    updateSettings: (data: Record<string, unknown>) => api.patch('/portal/settings', data),
};
