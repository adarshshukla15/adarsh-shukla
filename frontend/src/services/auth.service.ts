import api from './api';

export const authService = {
  async login(credentials: any): Promise<{ success: boolean; token: string; user: any; message?: string }> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async getMe(): Promise<{ success: boolean; user: any; message?: string }> {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Error in getMe:', error);
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      throw error;
    }
  },

  async resetPassword(data: any): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  },

  async updateProfile(data: any): Promise<{ success: boolean; user: any; message?: string }> {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }
};
