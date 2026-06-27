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
  }
};
