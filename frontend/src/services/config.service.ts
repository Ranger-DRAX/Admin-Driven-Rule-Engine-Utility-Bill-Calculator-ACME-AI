import apiClient from './api';
import type { Config, CreateConfigRequest } from '../types';

export const configService = {
  getAll: async (activeOnly = false): Promise<Config[]> => {
    const response = await apiClient.get<Config[]>('/config', {
      params: activeOnly ? { active: 'true' } : {},
    });
    return response.data;
  },

  getById: async (id: string): Promise<Config> => {
    const response = await apiClient.get<Config>(`/config/${id}`);
    return response.data;
  },

  getByConsumerType: async (type: string): Promise<Config[]> => {
    const response = await apiClient.get<Config[]>(`/config/consumer-type/${type}`);
    return response.data;
  },

  create: async (data: CreateConfigRequest): Promise<Config> => {
    const response = await apiClient.post<Config>('/config', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateConfigRequest>): Promise<Config> => {
    const response = await apiClient.patch<Config>(`/config/${id}`, data);
    return response.data;
  },

  toggleActive: async (id: string): Promise<Config> => {
    const response = await apiClient.patch<Config>(`/config/${id}/toggle`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/config/${id}`);
  },
};
