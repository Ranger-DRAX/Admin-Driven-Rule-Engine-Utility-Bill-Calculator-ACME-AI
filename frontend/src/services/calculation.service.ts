import apiClient from './api';
import type { CalculateBillRequest, CalculationResult, CalculationHistory } from '../types';

export const calculationService = {
  calculate: async (data: CalculateBillRequest): Promise<CalculationResult> => {
    // Add timestamp to prevent caching
    const response = await apiClient.post<CalculationResult>('/calculation', data, {
      params: { _t: Date.now() }
    });
    return response.data;
  },

  downloadPDF: async (data: CalculateBillRequest): Promise<Blob> => {
    const response = await apiClient.post('/calculation/pdf', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadPdf: async (data: CalculateBillRequest): Promise<Blob> => {
    const response = await apiClient.post('/calculation/pdf', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  getHistory: async (page = 1, limit = 10): Promise<{ data: CalculationHistory[]; total: number }> => {
    const response = await apiClient.get<{ data: CalculationHistory[]; total: number }>('/calculation/history', {
      params: { page, limit },
    });
    return response.data;
  },

  getHistoryById: async (id: string): Promise<CalculationHistory> => {
    const response = await apiClient.get<CalculationHistory>(`/calculation/history/${id}`);
    return response.data;
  },

  getHistoryByConsumerId: async (consumerId: string): Promise<CalculationHistory[]> => {
    const response = await apiClient.get<CalculationHistory[]>(`/calculation/history/consumer/${consumerId}`);
    return response.data;
  },
};
