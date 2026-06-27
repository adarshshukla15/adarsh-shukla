import { useState } from 'react';
import { contactService } from '../services/contact.service';
import { ContactData, QuoteData } from '../types/contact';

export function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendContact = async (data: ContactData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const res = await contactService.submitContact(data);
      if (res.success) {
        setSuccess(true);
        return { success: true, message: res.message };
      } else {
        throw new Error(res.message || 'Form submission failed');
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      const msg = err.response?.data?.message || 'Unable to connect to server';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const sendQuote = async (data: QuoteData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const res = await contactService.submitQuote(data);
      if (res.success) {
        setSuccess(true);
        return { success: true, message: res.message };
      } else {
        throw new Error(res.message || 'Quote request failed');
      }
    } catch (err: any) {
      console.error('Quote submission error:', err);
      const msg = err.response?.data?.message || 'Unable to connect to server';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, sendContact, sendQuote };
}
