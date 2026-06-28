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
  },

  async createService(data: any): Promise<any> {
    try {
      const response = await api.post('/services', data);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  async updateService(id: string, data: any): Promise<any> {
    try {
      const response = await api.put(`/services/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  async deleteService(id: string): Promise<any> {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
};
