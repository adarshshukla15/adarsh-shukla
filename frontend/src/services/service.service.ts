import api from './api';
import { Service } from '../types/service';

export const serviceService = {
  async getServices(): Promise<Service[]> {
    try {
      const response = await api.get('/services');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }
};
