import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { 
  login, getMe, refreshToken, forgotPassword, resetPassword, updateProfile 
} from '../controllers/authController';
import { 
  getProjects, getProjectById, createProject, updateProject, deleteProject 
} from '../controllers/projectController';
import { 
  getServices, createService, updateService, deleteService 
} from '../controllers/serviceController';
import { 
  getContacts, createContact, updateContactStatus, deleteContact 
} from '../controllers/contactController';
import { 
  getQuotes, createQuote, updateQuoteStatus, deleteQuote 
} from '../controllers/quoteController';
import { 
  getSubscribers, subscribeNewsletter, unsubscribeNewsletter 
} from '../controllers/newsletterController';
import { 
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial 
} from '../controllers/testimonialController';
import { 
  getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog 
} from '../controllers/blogController';
import { 
  getFaqs, createFaq, updateFaq, deleteFaq 
} from '../controllers/faqController';
import { 
  getTeam, createTeamMember, updateTeamMember, deleteTeamMember 
} from '../controllers/teamController';
import { 
  getSettings, updateSettings 
} from '../controllers/settingsController';
import { 
  uploadMiddleware, uploadImage, projectUploadMiddleware, getMediaFiles, deleteMediaFile
} from '../controllers/mediaController';

const router = Router();

import { 
  rateLimiter, validateContactInputs, validateQuoteInputs 
} from '../middleware/securityMiddleware';

// ================= AUTHENTICATION =================
router.post('/login', login);
router.post('/auth/login', login);
router.post('/auth/logout', (req, res) => res.status(200).json({ success: true, message: 'Logged out successfully' }));
router.get('/me', authMiddleware, getMe);
router.post('/auth/refresh-token', refreshToken);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.put('/auth/profile', authMiddleware, updateProfile);

// ================= PROJECTS CMS =================
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', authMiddleware, projectUploadMiddleware, createProject);
router.put('/projects/:id', authMiddleware, projectUploadMiddleware, updateProject);
router.delete('/projects/:id', authMiddleware, deleteProject);

// ================= SERVICES CMS =================
router.get('/services', getServices);
router.post('/services', authMiddleware, createService);
router.put('/services/:id', authMiddleware, updateService);
router.delete('/services/:id', authMiddleware, deleteService);

// ================= BLOG CMS =================
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.post('/blogs', authMiddleware, createBlog);
router.put('/blogs/:id', authMiddleware, updateBlog);
router.delete('/blogs/:id', authMiddleware, deleteBlog);

// ================= FAQ CMS =================
router.get('/faqs', getFaqs);
router.post('/faqs', authMiddleware, createFaq);
router.put('/faqs/:id', authMiddleware, updateFaq);
router.delete('/faqs/:id', authMiddleware, deleteFaq);

// ================= TEAM CMS =================
router.get('/team', getTeam);
router.post('/team', authMiddleware, createTeamMember);
router.put('/team/:id', authMiddleware, updateTeamMember);
router.delete('/team/:id', authMiddleware, deleteTeamMember);

// ================= CONTACTS / INQUIRIES =================
router.post('/contact', rateLimiter, validateContactInputs, createContact);
router.get('/contacts', authMiddleware, getContacts);
router.put('/contacts/:id', authMiddleware, updateContactStatus);
router.delete('/contacts/:id', authMiddleware, deleteContact);

// ================= ESTIMATIONS / QUOTES =================
router.post('/quote', rateLimiter, validateQuoteInputs, createQuote);
router.get('/quotes', authMiddleware, getQuotes);
router.put('/quotes/:id', authMiddleware, updateQuoteStatus);
router.delete('/quotes/:id', authMiddleware, deleteQuote);

// ================= NEWSLETTER SUBS =================
router.post('/newsletter', subscribeNewsletter);
router.post('/newsletter/unsubscribe', unsubscribeNewsletter);
router.get('/newsletter', authMiddleware, getSubscribers);

// ================= TESTIMONIALS CMS =================
router.get('/testimonials', getTestimonials);
router.post('/testimonials', authMiddleware, createTestimonial);
router.put('/testimonials/:id', authMiddleware, updateTestimonial);
router.delete('/testimonials/:id', authMiddleware, deleteTestimonial);

// ================= GLOBAL CONFIGURATION =================
router.get('/settings', getSettings);
router.put('/settings', authMiddleware, updateSettings);

// ================= FILE UPLOADS =================
router.post('/upload', authMiddleware, uploadMiddleware, uploadImage);
router.get('/media', authMiddleware, getMediaFiles);
router.delete('/media/:id', authMiddleware, deleteMediaFile);

export default router;
