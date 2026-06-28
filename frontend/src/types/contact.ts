export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

export interface QuoteData {
  name: string;
  email: string;
  company?: string;
  services: string[];
  budget: string | number;
  timeline: string | number;
  projectDetails: string;
}
