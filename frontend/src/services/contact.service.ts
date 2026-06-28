import api from './api';
import { ContactData, QuoteData } from '../types/contact';

export const contactService = {
  async submitContact(data: ContactData): Promise<{ success: boolean; message: string }> {
    try {
      console.log("Contact Payload in Service:", data);
      const response = await api.post('/contact', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  async submitQuote(data: QuoteData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/quote', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting quote request:', error);
      throw error;
    }
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/newsletter', { email });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }
};
