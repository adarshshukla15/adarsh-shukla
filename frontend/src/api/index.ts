import { projectService } from '../services/project.service';
import { serviceService } from '../services/service.service';
import { contactService } from '../services/contact.service';
import { adminService } from '../services/admin.service';

export * from '../types/project';
export * from '../types/service';
export * from '../types/contact';

export interface Testimonial {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  rating: number;
  avatar?: string;
}

// Client service bridges preserving original method signatures for backward compatibility
export const getProjects = projectService.getProjects;
export const createProject = projectService.createProject;
export const updateProject = projectService.updateProject;
export const deleteProject = projectService.deleteProject;

export const getServices = serviceService.getServices;
export const createService = serviceService.createService;
export const updateService = serviceService.updateService;
export const deleteService = serviceService.deleteService;

export const submitContact = contactService.submitContact;
export const submitQuote = contactService.submitQuote;

export const getTestimonials = adminService.getTestimonials;
export const createTestimonial = adminService.createTestimonial;
export const updateTestimonial = adminService.updateTestimonial;
export const deleteTestimonial = adminService.deleteTestimonial;

export const getBlogs = adminService.getBlogs;
export const getBlogBySlug = adminService.getBlogBySlug;

export async function createBlog(data: any, token?: string): Promise<any> {
  return adminService.createBlog(data);
}

export async function updateBlog(id: string, data: any, token?: string): Promise<any> {
  return adminService.updateBlog(id, data);
}

export async function deleteBlog(id: string, token?: string): Promise<any> {
  return adminService.deleteBlog(id);
}

export const getFaqs = adminService.getFaqs;

export async function createFaq(data: any, token?: string): Promise<any> {
  return adminService.createFaq(data);
}

export async function updateFaq(id: string, data: any, token?: string): Promise<any> {
  return adminService.updateFaq(id, data);
}

export async function deleteFaq(id: string, token?: string): Promise<any> {
  return adminService.deleteFaq(id);
}

export const getTeam = adminService.getTeam;

export async function createTeamMember(data: any, token?: string): Promise<any> {
  return adminService.createTeamMember(data);
}

export async function updateTeamMember(id: string, data: any, token?: string): Promise<any> {
  return adminService.updateTeamMember(id, data);
}

export async function deleteTeamMember(id: string, token?: string): Promise<any> {
  return adminService.deleteTeamMember(id);
}

export const getSettings = adminService.getSettings;

export async function updateSettings(data: any, token?: string): Promise<any> {
  return adminService.updateSettings(data);
}

export async function uploadMedia(file: File, token?: string): Promise<any> {
  return adminService.uploadMedia(file);
}

export async function getMediaList(token?: string): Promise<any> {
  return adminService.getMediaList();
}

export async function deleteMediaItem(id: string, token?: string): Promise<any> {
  return adminService.deleteMediaItem(id);
}

export const getContacts = adminService.getContacts;
export const updateContactStatus = adminService.updateContactStatus;
export const deleteContact = adminService.deleteContact;

export const getQuotes = adminService.getQuotes;
export const updateQuoteStatus = adminService.updateQuoteStatus;
export const deleteQuote = adminService.deleteQuote;

export const getNewsletter = adminService.getNewsletter;

export const subscribeNewsletter = contactService.subscribeNewsletter;
