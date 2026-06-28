import api from './api';

export const adminService = {
  // Testimonials
  async getTestimonials(): Promise<any[]> {
    try {
      const response = await api.get('/testimonials');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  async createTestimonial(data: any): Promise<any> {
    try {
      const response = await api.post('/testimonials', data);
      return response.data;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  },

  async updateTestimonial(id: string, data: any): Promise<any> {
    try {
      const response = await api.put(`/testimonials/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  },

  async deleteTestimonial(id: string): Promise<any> {
    try {
      const response = await api.delete(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  },

  // Blogs
  async getBlogs(): Promise<any[]> {
    try {
      const response = await api.get('/blogs');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  async getBlogBySlug(slug: string): Promise<any> {
    try {
      const response = await api.get(`/blogs/${slug}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },

  async createBlog(data: any): Promise<any> {
    try {
      const response = await api.post('/blogs', data);
      return response.data;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  async updateBlog(id: string, data: any): Promise<any> {
    try {
      const response = await api.put(`/blogs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  async deleteBlog(id: string): Promise<any> {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // FAQs
  async getFaqs(): Promise<any[]> {
    try {
      const response = await api.get('/faqs');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  async createFaq(data: any): Promise<any> {
    try {
      const response = await api.post('/faqs', data);
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  },

  async updateFaq(id: string, data: any): Promise<any> {
    try {
      const response = await api.put(`/faqs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  },

  async deleteFaq(id: string): Promise<any> {
    try {
      const response = await api.delete(`/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  },

  // Team members
  async getTeam(): Promise<any[]> {
    try {
      const response = await api.get('/team');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  async createTeamMember(data: any): Promise<any> {
    try {
      const response = await api.post('/team', data);
      return response.data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  async updateTeamMember(id: string, data: any): Promise<any> {
    try {
      const response = await api.put(`/team/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  async deleteTeamMember(id: string): Promise<any> {
    try {
      const response = await api.delete(`/team/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },

  // Global Settings
  async getSettings(): Promise<any> {
    try {
      const response = await api.get('/settings');
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  async updateSettings(data: any): Promise<any> {
    try {
      const response = await api.put('/settings', data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Media Library Files
  async getMediaList(): Promise<{ success: boolean; data: any[] }> {
    try {
      const response = await api.get('/media');
      return response.data;
    } catch (error) {
      console.error('Error fetching media list:', error);
      throw error;
    }
  },

  async deleteMediaItem(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/media/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting media item:', error);
      throw error;
    }
  },

  async uploadMedia(file: File): Promise<{ success: boolean; url: string; public_id?: string; message?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Contacts Management
  async getContacts(): Promise<any[]> {
    try {
      const response = await api.get('/contacts');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  async updateContactStatus(id: string, status: string): Promise<any> {
    try {
      const response = await api.put(`/contacts/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  },

  async deleteContact(id: string): Promise<any> {
    try {
      const response = await api.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  // Quotes Management
  async getQuotes(): Promise<any[]> {
    try {
      const response = await api.get('/quotes');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  },

  async updateQuoteStatus(id: string, status: string): Promise<any> {
    try {
      const response = await api.put(`/quotes/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  },

  async deleteQuote(id: string): Promise<any> {
    try {
      const response = await api.delete(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  },

  // Newsletter Management
  async getNewsletter(): Promise<any[]> {
    try {
      const response = await api.get('/newsletter');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      throw error;
    }
  }
};
