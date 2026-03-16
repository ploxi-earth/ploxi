import api from '@/lib/api';

export interface GhgInputData {
  companyName?: string;
  reportingYear?: number;
  sessionId?: string;
  scope1?: {
    stationaryCombustion?: {
      naturalGas?: { value: number };
      diesel?: { value: number };
      coal?: { value: number };
    };
    mobileCombustion?: {
      petrol?: { value: number };
      diesel?: { value: number };
    };
    fugitiveEmissions?: {
      refrigerantLeakage?: { value: number };
    };
  };
  scope2?: {
    purchasedElectricity?: { value: number };
    purchasedHeat?: { value: number };
  };
  scope3?: {
    businessTravel?: {
      airTravel?: { value: number };
      roadTravel?: { value: number };
    };
    employeeCommute?: { value: number };
    wasteGenerated?: { value: number };
    purchasedGoods?: { value: number };
  };
}

export const ghgService = {
  calculate: (data: GhgInputData) => api.post('/ghg/calculate', data),
  getHistory: (sessionId?: string) => api.get('/ghg/history', { params: { sessionId } }),
};

export const consultantService = {
  createReport: (data: Record<string, unknown>) => api.post('/consultant/reports', data),
  getMyReports: () => api.get('/consultant/reports/my'),
  getReport: (id: string) => api.get(`/consultant/reports/${id}`),
  updateReport: (id: string, data: Record<string, unknown>) =>
    api.put(`/consultant/reports/${id}`, data),
  submitReport: (id: string) => api.patch(`/consultant/reports/${id}/submit`),
  getAllReports: (params?: { status?: string }) => api.get('/consultant/reports', { params }),
  approveReport: (id: string) => api.patch(`/consultant/reports/${id}/approve`),
  publishReport: (id: string) => api.patch(`/consultant/reports/${id}/publish`),
};
