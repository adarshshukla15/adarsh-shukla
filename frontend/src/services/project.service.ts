import api from './api';
import { Project } from '../types/project';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async createProject(data: any): Promise<any> {
    try {
      const response = await api.post('/projects', data);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async updateProject(id: string, data: any): Promise<any> {
    try {
      const response = await api.put(`/projects/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async deleteProject(id: string): Promise<any> {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};
