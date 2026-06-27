import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { io } from 'socket.io-client';
import { 
  FiLock, FiLogOut, FiPlus, FiTrash2, FiEdit2, FiCheckCircle, 
  FiMail, FiSliders, FiEye, FiFolder, FiStar, FiFileText, FiRefreshCw, 
  FiSettings, FiUsers, FiHelpCircle, FiImage, FiUploadCloud, FiDownload, 
  FiSun, FiMoon, FiPrinter, FiUser, FiGlobe, FiAlertCircle 
} from 'react-icons/fi';
import { 
  getBlogs, createBlog, updateBlog, deleteBlog,
  getFaqs, createFaq, updateFaq, deleteFaq,
  getTeam, createTeamMember, updateTeamMember, deleteTeamMember,
  getSettings, updateSettings, uploadMedia, getMediaList, deleteMediaItem
} from '../api';
import axios from 'axios';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

export default function Admin() {
  const { user, token, isAuthenticated, login, logout, checkAuth } = useAuthStore();

  // Theme state: dark mode (default) vs light mode
  const [isLightMode, setIsLightMode] = useState(false);

  // Authentication Pin reset states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isForgotPassMode, setIsForgotPassMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetStatus, setResetStatus] = useState({ type: '', msg: '' });

  // Tab control
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'projects' | 'services' | 'testimonials' | 'blogs' | 'faqs' | 'team' | 'messages' | 'quotes' | 'newsletter' | 'settings' | 'media'
  >('dashboard');

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryPage, setInquiryPage] = useState(1);

  // CMS Collections Data States
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [settings, setSettingsData] = useState<any>(null);
  
  // Local media library files list
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [teamUploading, setTeamUploading] = useState(false);
  const [teamUploadProgress, setTeamUploadProgress] = useState(0);
  const teamFileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [realtimeNotification, setRealtimeNotification] = useState<any>(null);

  // Form modals state control
  const [modalType, setModalType] = useState<'project' | 'service' | 'testimonial' | 'blog' | 'faq' | 'team' | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Core Form states
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', category: '', client: '', budget: '', timeline: '', tags: '', images: '', liveUrl: '', githubUrl: ''
  });

  interface UploadedImageItem {
    id: string;
    url: string;
    file?: File;
    isUploading: boolean;
    progress: number;
    error?: string;
  }

  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFilesSelected(files);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    files.forEach(file => {
      // Validate image size (5MB maximum)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the maximum size of 5MB.`);
        return;
      }

      // Validate image type (JPG, PNG, WEBP)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format. Please upload JPG, PNG, or WEBP.`);
        return;
      }

      const itemId = 'img-' + Math.random().toString(36).substr(2, 9);
      const newItem: UploadedImageItem = {
        id: itemId,
        url: URL.createObjectURL(file), // instant preview
        file,
        isUploading: true,
        progress: 0
      };

      setUploadedImages(prev => [...prev, newItem]);
      uploadSingleFile(newItem);
    });
  };

  const uploadSingleFile = async (item: UploadedImageItem) => {
    if (!item.file) return;
    const formData = new FormData();
    formData.append('file', item.file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
          );
          setUploadedImages(prev =>
            prev.map(img => img.id === item.id ? { ...img, progress: percentCompleted } : img)
          );
        }
      });

      if (response.data && response.data.success) {
        setUploadedImages(prev =>
          prev.map(img => img.id === item.id ? { 
            ...img, 
            url: response.data.url, 
            isUploading: false, 
            progress: 100 
          } : img)
        );
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setUploadedImages(prev =>
        prev.map(img => img.id === item.id ? { 
          ...img, 
          isUploading: false, 
          error: err.message || 'Upload failed' 
        } : img)
      );
    }
  };

  const handleReplaceImage = (index: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} exceeds the maximum size of 5MB.`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert(`File ${file.name} is not a supported format. Please upload JPG, PNG, or WEBP.`);
      return;
    }

    const itemId = uploadedImages[index].id;
    const updatedItem: UploadedImageItem = {
      id: itemId,
      url: URL.createObjectURL(file),
      file,
      isUploading: true,
      progress: 0
    };

    setUploadedImages(prev => {
      const copy = [...prev];
      copy[index] = updatedItem;
      return copy;
    });

    uploadSingleFile(updatedItem);
  };
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', category: '', details: '', icon: '', accentColor: 'from-cyan-500 to-blue-500', glowColor: 'rgba(6,182,212,0.2)', canvasType: 'web'
  });
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', role: '', company: '', feedback: '', rating: 5, avatar: ''
  });
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', category: '', tags: '', featuredImage: '', content: '', seoTitle: '', seoDescription: '', status: 'draft'
  });
  const [faqForm, setFaqForm] = useState({
    question: '', answer: '', displayOrder: 0
  });
  const [teamForm, setTeamForm] = useState({
    name: '', role: '', bio: '', photo: '', linkedin: '', github: '', twitter: ''
  });
  const [settingsForm, setSettingsForm] = useState<any>({
    companyName: '', email: '', phone: '', address: '', googleMapsUrl: '',
    linkedin: '', github: '', twitter: '', facebook: '', instagram: '',
    heroText: '', heroSubtitle: '', footerText: '', copyright: '',
    metaTitle: '', metaDescription: '', keywords: '', googleAnalyticsId: '',
    logo: '', favicon: ''
  });

  // Verify auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch all CMS datasets
  const fetchData = async () => {
    if (!token) return;
    setRefreshLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [pRes, sRes, tRes, mRes, qRes, nRes, bRes, fRes, tmRes, setRes, mediaRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/services'),
        fetch('/api/testimonials'),
        fetch('/api/contacts', { headers }),
        fetch('/api/quotes', { headers }),
        fetch('/api/newsletter', { headers }),
        fetch('/api/blogs'),
        fetch('/api/faqs'),
        fetch('/api/team'),
        fetch('/api/settings'),
        getMediaList(token)
      ]);

      const [pData, sData, tData, mData, qData, nData, bData, fData, tmData, setData, mediaData] = await Promise.all([
        pRes.json(), sRes.json(), tRes.json(), mRes.json(), qRes.json(), nRes.json(), bRes.json(), fRes.json(), tmRes.json(), setRes.json(), mediaRes
      ]);

      if (pData.success) setProjects(pData.data);
      if (sData.success) setServices(sData.data);
      if (tData.success) setTestimonials(tData.data);
      if (mData.success) setMessages(mData.data);
      if (qData.success) setQuotes(qData.data);
      if (nData.success) setSubscribers(nData.data);
      if (bData.success) setBlogs(bData.data);
      if (fData.success) setFaqs(fData.data);
      if (tmData.success) setTeam(tmData.data);
      if (mediaData.success) setMediaFiles(mediaData.data);
      if (setData.success && setData.data) {
        setSettingsData(setData.data);
        const sObj = setData.data;
        setSettingsForm({
          companyName: sObj.companyName || '',
          email: sObj.email || '',
          phone: sObj.phone || '',
          address: sObj.address || '',
          googleMapsUrl: sObj.googleMapsUrl || '',
          linkedin: sObj.socialLinks?.linkedin || '',
          github: sObj.socialLinks?.github || '',
          twitter: sObj.socialLinks?.twitter || '',
          facebook: sObj.socialLinks?.facebook || '',
          instagram: sObj.socialLinks?.instagram || '',
          heroText: sObj.heroText || '',
          heroSubtitle: sObj.heroSubtitle || '',
          footerText: sObj.footerText || '',
          copyright: sObj.copyright || '',
          metaTitle: sObj.seo?.metaTitle || '',
          metaDescription: sObj.seo?.metaDescription || '',
          keywords: sObj.seo?.keywords?.join(', ') || '',
          googleAnalyticsId: sObj.googleAnalyticsId || '',
          logo: sObj.logo || '',
          favicon: sObj.favicon || ''
        });
      }

      // Media loaded directly from media collection API. Falling back if empty.
      if (!mediaData.success || !mediaData.data || mediaData.data.length === 0) {
        const mediaUrls = new Set<string>();
        [...pData.data].forEach(p => {
          if (p.thumbnail) mediaUrls.add(p.thumbnail);
          p.gallery?.forEach((img: string) => mediaUrls.add(img));
          p.images?.forEach((img: string) => mediaUrls.add(img));
        });
        [...tData.data].forEach(t => t.avatar && mediaUrls.add(t.avatar));
        [...bData.data].forEach(b => b.featuredImage && mediaUrls.add(b.featuredImage));
        [...tmData.data].forEach(tm => tm.photo && mediaUrls.add(tm.photo));
        setMediaFiles(Array.from(mediaUrls).map(url => ({ url })));
      }

    } catch (err) {
      console.error('Error fetching admin datasets:', err);
    } finally {
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, token]);

  // Real-time Socket.IO inquiry alerts
  useEffect(() => {
    if (!token) return;

    // Detect server address dynamically
    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
    const socket = io(socketUrl);

    socket.on('newContact', (newInquiry: any) => {
      setMessages((prev) => [newInquiry, ...prev]);
      setRealtimeNotification(newInquiry);
      
      // Clear alert after 7 seconds
      setTimeout(() => {
        setRealtimeNotification(null);
      }, 7000);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Auth submits
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Server connection failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetStatus({ type: 'loading', msg: 'Generating pin...' });
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setResetStatus({ type: 'success', msg: 'Security code dispatched.' });
      } else {
        setResetStatus({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setResetStatus({ type: 'error', msg: 'Service failure.' });
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetToken || !resetNewPass) return;
    setResetStatus({ type: 'loading', msg: 'Updating password...' });
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, token: resetToken, newPassword: resetNewPass })
      });
      const data = await res.json();
      if (data.success) {
        setResetStatus({ type: 'success', msg: 'Success! Log in now.' });
        setTimeout(() => {
          setIsForgotPassMode(false);
          setResetStatus({ type: '', msg: '' });
        }, 2000);
      } else {
        setResetStatus({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setResetStatus({ type: 'error', msg: 'Reset failed.' });
    }
  };

  // Helper roles authorization
  const hasRoleAccess = (requiredRole: 'superadmin' | 'admin' | 'editor') => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    if (requiredRole === 'superadmin') return false; // Only superadmin allowed

    if (user.role === 'admin') return true;
    if (requiredRole === 'admin') return false; // admin or superadmin allowed

    return user.role === requiredRole; // editor only matches editor
  };

  // CRUD commands
  const handleItemDelete = async (route: string, id: string, roleRequired: 'superadmin' | 'admin' | 'editor' = 'admin') => {
    if (!hasRoleAccess(roleRequired)) {
      alert(`Permission Denied. Only roles [${roleRequired}] can execute deletions.`);
      return;
    }
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/${route}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuoteStatus = async (id: string, currentStatus: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: currentStatus === 'processed' ? 'pending' : 'processed' })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Form Submits
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedImages.some(img => img.isUploading)) {
      alert("Please wait for all uploads to complete before saving.");
      return;
    }

    const url = editId ? `/api/projects/${editId}` : '/api/projects';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: projectForm.title,
          description: projectForm.description,
          category: projectForm.category,
          client: projectForm.client,
          budget: projectForm.budget,
          timeline: projectForm.timeline,
          tags: projectForm.tags.split(',').map((t) => t.trim()).filter((t) => t !== ''),
          thumbnail: uploadedImages[0]?.url || '',
          gallery: uploadedImages.slice(1).map(img => img.url),
          liveUrl: projectForm.liveUrl,
          githubUrl: projectForm.githubUrl
        })
      });
      if (res.ok) {
        setModalType(null);
        setEditId(null);
        setProjectForm({ title: '', description: '', category: '', client: '', budget: '', timeline: '', tags: '', images: '', liveUrl: '', githubUrl: '' });
        setUploadedImages([]);
        fetchData();
        showToast('Project saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/services/${editId}` : '/api/services';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...serviceForm,
          details: serviceForm.details.split(',').map((d) => d.trim()).filter((d) => d !== '')
        })
      });
      if (res.ok) {
        setModalType(null);
        setEditId(null);
        fetchData();
        showToast('Service saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/testimonials/${editId}` : '/api/testimonials';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...testimonialForm,
          rating: Number(testimonialForm.rating)
        })
      });
      if (res.ok) {
        setModalType(null);
        setEditId(null);
        fetchData();
        showToast('Testimonial saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (editId) {
        res = await updateBlog(editId, blogForm, token || '');
      } else {
        res = await createBlog(blogForm, token || '');
      }
      if (res.success) {
        setModalType(null);
        setEditId(null);
        setBlogForm({ title: '', slug: '', category: '', tags: '', featuredImage: '', content: '', seoTitle: '', seoDescription: '', status: 'draft' });
        fetchData();
      } else {
        alert(res.message || 'Error saving article.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (editId) {
        res = await updateFaq(editId, faqForm, token || '');
      } else {
        res = await createFaq(faqForm, token || '');
      }
      if (res.success) {
        setModalType(null);
        setEditId(null);
        setFaqForm({ question: '', answer: '', displayOrder: 0 });
        fetchData();
        showToast('FAQ saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      name: teamForm.name,
      role: teamForm.role,
      bio: teamForm.bio,
      photo: teamForm.photo,
      socialLinks: {
        linkedin: teamForm.linkedin,
        github: teamForm.github,
        twitter: teamForm.twitter
      }
    };

    try {
      let res;
      if (editId) {
        res = await updateTeamMember(editId, formattedData, token || '');
      } else {
        res = await createTeamMember(formattedData, token || '');
      }
      if (res.success) {
        setModalType(null);
        setEditId(null);
        setTeamForm({ name: '', role: '', bio: '', photo: '', linkedin: '', github: '', twitter: '' });
        fetchData();
        showToast('Team member saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      companyName: settingsForm.companyName,
      email: settingsForm.email,
      phone: settingsForm.phone,
      address: settingsForm.address,
      googleMapsUrl: settingsForm.googleMapsUrl,
      socialLinks: {
        linkedin: settingsForm.linkedin,
        github: settingsForm.github,
        twitter: settingsForm.twitter,
        facebook: settingsForm.facebook,
        instagram: settingsForm.instagram
      },
      heroText: settingsForm.heroText,
      heroSubtitle: settingsForm.heroSubtitle,
      footerText: settingsForm.footerText,
      copyright: settingsForm.copyright,
      seo: {
        metaTitle: settingsForm.metaTitle,
        metaDescription: settingsForm.metaDescription,
        keywords: settingsForm.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k !== '')
      },
      googleAnalyticsId: settingsForm.googleAnalyticsId,
      logo: settingsForm.logo,
      favicon: settingsForm.favicon
    };

    try {
      const res = await updateSettings(formatted, token || '');
      if (res.success) {
        showToast('Settings saved successfully!', 'success');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Modals
  const openProjectEdit = (item: any) => {
    setEditId(item.id || item._id);
    setProjectForm({
      title: item.title,
      description: item.description,
      category: item.category,
      client: item.client,
      budget: item.budget,
      timeline: item.timeline,
      tags: item.tags?.join(', ') || '',
      images: '',
      liveUrl: item.liveUrl || '',
      githubUrl: item.githubUrl || ''
    });

    const initialImages: UploadedImageItem[] = [];
    if (item.thumbnail) {
      initialImages.push({
        id: 'thumb-' + Date.now(),
        url: item.thumbnail,
        isUploading: false,
        progress: 100
      });
    }
    if (item.gallery && Array.isArray(item.gallery)) {
      item.gallery.forEach((url: string, idx: number) => {
        initialImages.push({
          id: `gallery-${idx}-${Date.now()}`,
          url,
          isUploading: false,
          progress: 100
        });
      });
    }

    // Fallback if only item.images exists (legacy data support)
    if (initialImages.length === 0 && item.images && Array.isArray(item.images)) {
      item.images.forEach((url: string, idx: number) => {
        initialImages.push({
          id: `legacy-${idx}-${Date.now()}`,
          url,
          isUploading: false,
          progress: 100
        });
      });
    }

    setUploadedImages(initialImages);
    setModalType('project');
  };

  const openServiceEdit = (item: any) => {
    setEditId(item.id || item._id);
    setServiceForm({
      title: item.title,
      description: item.description,
      category: item.category,
      details: item.details?.join(', ') || '',
      icon: item.icon,
      accentColor: item.accentColor || 'from-cyan-500 to-blue-500',
      glowColor: item.glowColor || 'rgba(6,182,212,0.2)',
      canvasType: item.canvasType || 'web'
    });
    setModalType('service');
  };

  const openTestimonialEdit = (item: any) => {
    setEditId(item.id || item._id);
    setTestimonialForm({
      name: item.name,
      role: item.role,
      company: item.company,
      feedback: item.feedback,
      rating: item.rating,
      avatar: item.avatar || ''
    });
    setModalType('testimonial');
  };

  const openBlogEdit = (item: any) => {
    setEditId(item.id || item._id);
    setBlogForm({
      title: item.title,
      slug: item.slug,
      category: item.category,
      tags: item.tags?.join(', ') || '',
      featuredImage: item.featuredImage || '',
      content: item.content,
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      status: item.status || 'draft'
    });
    setModalType('blog');
  };

  const openFaqEdit = (item: any) => {
    setEditId(item.id || item._id);
    setFaqForm({
      question: item.question,
      answer: item.answer,
      displayOrder: item.displayOrder || 0
    });
    setModalType('faq');
  };

  const openTeamEdit = (item: any) => {
    setEditId(item.id || item._id);
    setTeamForm({
      name: item.name,
      role: item.role,
      bio: item.bio,
      photo: item.photo || '',
      linkedin: item.socialLinks?.linkedin || '',
      github: item.socialLinks?.github || '',
      twitter: item.socialLinks?.twitter || ''
    });
    setModalType('team');
  };

  // Drag and Drop media uploader
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setUploadProgress('uploading');
    try {
      const res = await uploadMedia(file, token || '');
      if (res.success) {
        setUploadProgress('success');
        setUploadedUrl(res.url);
        setMediaFiles((prev) => [res, ...prev]);
        setTimeout(() => setUploadProgress('idle'), 4000);
      } else {
        setUploadProgress('error');
      }
    } catch (err) {
      setUploadProgress('error');
    }
  };

  const handleMediaDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this image from database and storage?')) return;
    try {
      const res = await deleteMediaItem(id, token || '');
      if (res.success) {
        setMediaFiles((prev) => prev.filter((item) => (item.id || item._id) !== id));
        showToast('Image deleted successfully!', 'success');
      } else {
        showToast(res.message || 'Failed to delete image', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting image', 'error');
    }
  };

  // CSV query downloads
  const exportQueriesToCSV = () => {
    const query = inquirySearch.toLowerCase();
    const targetMessages = messages.filter((m) => {
      return (
        (m.name || '').toLowerCase().includes(query) ||
        (m.email || '').toLowerCase().includes(query) ||
        (m.subject || '').toLowerCase().includes(query) ||
        (m.message || '').toLowerCase().includes(query) ||
        (m.company || '').toLowerCase().includes(query)
      );
    });

    if (targetMessages.length === 0) return;
    const headers = 'Name,Email,Phone,Company,Budget,Timeline,Subject,Message,Date\n';
    const rows = targetMessages.map((m) => {
      const escapedMsg = m.message?.replace(/"/g, '""') || '';
      return `"${m.name}","${m.email}","${m.phone || ''}","${m.company || ''}","${m.budget || ''}","${m.timeline || ''}","${m.subject}","${escapedMsg}","${new Date(m.createdAt).toLocaleDateString()}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `A3_Contacts_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trend Sparkline Charts Renderer
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (activeTab !== 'dashboard' || !chartCanvasRef.current || messages.length === 0) return;
    const canvas = chartCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw analytics sparkline representing messages count by date (mock trend)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Gradient filling under line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

    const points = [12, 22, 15, 30, 25, 45, 38, 55, 48, 65]; // Mock node counts
    const stepX = width / (points.length - 1);
    
    ctx.beginPath();
    points.forEach((p, idx) => {
      const xCoord = idx * stepX;
      const yCoord = height - (p / 80) * (height - 20) - 10;
      if (idx === 0) ctx.moveTo(xCoord, yCoord);
      else ctx.lineTo(xCoord, yCoord);
    });

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under path
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [activeTab, messages]);

  // Global search filters
  const getFilteredItems = (items: any[]) => {
    return items.filter((item) => {
      const searchStr = searchQuery.toLowerCase();
      const titleMatch = (item.title || item.name || item.question || '').toLowerCase().includes(searchStr);
      const descMatch = (item.description || item.bio || item.answer || '').toLowerCase().includes(searchStr);
      const matchesSearch = titleMatch || descMatch;

      if (statusFilter === 'all') return matchesSearch;
      return matchesSearch && item.status === statusFilter;
    });
  };

  // Auth portal fallback screens
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-6 bg-black relative">
        <div className="glow-cyan absolute h-[350px] w-[350px] opacity-10 pointer-events-none" />

        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 relative z-10">
          <div className="text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.2)] mx-auto mb-4">
              <FiLock size={20} className="text-black" />
            </div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">
              {isForgotPassMode ? 'Forgot Password' : 'Admin Portal'}
            </h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">A3 Web & Software Services</p>
          </div>

          {!isForgotPassMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@a3.agency"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-600 outline-none transition-all focus:border-cyan-500/30 focus:bg-white/10"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-600 outline-none transition-all focus:border-cyan-500/30 focus:bg-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-xl bg-cyan-500 py-4 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400 transition-colors shadow-lg disabled:opacity-50 mt-2"
              >
                {loginLoading ? 'Authenticating...' : 'Sign In'}
              </button>

              {loginError && (
                <p className="text-xs text-center font-semibold text-rose-400 mt-2">{loginError}</p>
              )}

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPassMode(true)}
                  className="text-[10px] uppercase font-bold text-neutral-500 hover:text-cyan-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Pin Request Form */}
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Enter Admin Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="admin@a3.agency"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="flex-grow rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-600 outline-none focus:border-cyan-500/30"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-cyan-500 text-black text-xs font-bold uppercase tracking-wide rounded-xl hover:bg-cyan-400"
                    >
                      Send Pin
                    </button>
                  </div>
                </div>
              </form>

              {/* Pin Reset Form */}
              <form onSubmit={handleResetSubmit} className="space-y-4 border-t border-white/5 pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">6-Digit Verification Pin</label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-600 outline-none focus:border-cyan-500/30"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={resetNewPass}
                    onChange={(e) => setResetNewPass(e.target.value)}
                    className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-600 outline-none focus:border-cyan-500/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-500 py-4 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400 transition-colors"
                >
                  Reset Password
                </button>
              </form>

              {resetStatus.msg && (
                <p className={`text-xs text-center font-semibold mt-2 ${
                  resetStatus.type === 'success' ? 'text-green-400' : resetStatus.type === 'error' ? 'text-rose-400' : 'text-neutral-400'
                }`}>
                  {resetStatus.msg}
                </p>
              )}

              <div className="text-center mt-2">
                <button
                  onClick={() => { setIsForgotPassMode(false); setResetStatus({ type: '', msg: '' }); }}
                  className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <span className="text-[9px] text-neutral-600 tracking-wide">
              Default credentials: <br />
              <strong>admin@a3.agency</strong> / <strong>adminpassword123</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-7xl px-6 md:px-12 py-10 min-h-[90vh] transition-colors duration-300 ${isLightMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
      
      {/* Real-time Toast Inquiry Alerts */}
      {realtimeNotification && (
        <div className="fixed top-6 right-6 z-50 p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/95 text-white max-w-md shadow-2xl flex gap-3.5 animate-slide-in">
          <FiAlertCircle className="text-cyan-400 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-cyan-400">Real-time Inquiry Received!</h4>
            <p className="text-xs font-bold mt-1">{realtimeNotification.name}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5 italic">"{realtimeNotification.subject}"</p>
            <button 
              onClick={() => { setActiveTab('messages'); setRealtimeNotification(null); }}
              className="mt-2.5 text-[9px] font-black uppercase tracking-wider text-cyan-300 border-b border-cyan-300/30"
            >
              View Inquiries
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 mb-8 gap-4 ${isLightMode ? 'border-neutral-200' : 'border-white/5'}`}>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide flex items-center gap-2">
            <FiSliders className="text-cyan-500" /> CMS Console
          </h1>
          <p className="text-xs text-cyan-400 font-semibold mt-1">
            Role: <span className="uppercase text-[10px] font-black">{user?.role}</span> | Logged in as {user?.name}
          </p>
        </div>
        
        {/* Quick Config Actions */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Light/Dark Toggle */}
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
              isLightMode ? 'border-neutral-200 bg-neutral-100 text-neutral-800' : 'border-white/5 bg-white/5 text-neutral-400'
            }`}
          >
            {isLightMode ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>
          <button 
            onClick={fetchData} 
            disabled={refreshLoading}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
              isLightMode ? 'border-neutral-200 bg-neutral-100' : 'border-white/5 bg-white/5'
            }`}
          >
            <FiRefreshCw className={refreshLoading ? 'animate-spin' : ''} size={16} />
          </button>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/25 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-400 hover:bg-rose-500 hover:text-black transition-all"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Grid: Navigation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Drawer */}
        <div className={`lg:col-span-3 rounded-2xl p-4 border space-y-1 ${
          isLightMode ? 'border-neutral-200 bg-neutral-50/50' : 'border-white/10 bg-[#0a0a0a]/50'
        }`}>
          <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest px-3 mb-2">Metrics</div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'dashboard' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiSliders size={15} /> Overview
          </button>
          
          <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest px-3 pt-4 mb-2">Core Content</div>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'projects' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiFolder size={15} /> Projects
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'services' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiCheckCircle size={15} /> Services
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'testimonials' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiStar size={15} /> Testimonials
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'blogs' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiFileText size={15} /> Blogs CMS
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'faqs' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiHelpCircle size={15} /> FAQs CMS
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'team' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiUsers size={15} /> Team CMS
          </button>

          <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest px-3 pt-4 mb-2">Communications</div>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'messages' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiMail size={15} /> Inquiries ({messages.filter(m => m.status === 'unread').length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'quotes' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiFileText size={15} /> Estimates ({quotes.filter(q => q.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'newsletter' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiEye size={15} /> Subscribers
          </button>

          <div className="text-[9px] font-black uppercase text-neutral-500 tracking-widest px-3 pt-4 mb-2">Global System</div>
          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'media' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiImage size={15} /> Media Library
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === 'settings' ? 'bg-cyan-500 text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiSettings size={15} /> Site Settings
          </button>
        </div>

        {/* Dynamic Panels */}
        <div className={`lg:col-span-9 rounded-3xl p-8 border min-h-[550px] ${
          isLightMode ? 'border-neutral-200 bg-[#fafafa]' : 'border-white/10 bg-[#0a0a0a]/50'
        }`}>
          
          {/* TAB: DASHBOARD HOME OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-xl font-black uppercase tracking-wider mb-6">System Statistics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Total Projects</span>
                  <span className="text-3xl font-black text-white">{projects.length}</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Active Services</span>
                  <span className="text-3xl font-black text-white">{services.length}</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Blogs Articles</span>
                  <span className="text-3xl font-black text-white">{blogs.length}</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Unread Inquiries</span>
                  <span className="text-3xl font-black text-cyan-400">{messages.filter(m => m.status === 'unread').length}</span>
                </div>
              </div>

              {/* Chart trends */}
              <div className="border border-white/5 rounded-3xl p-6 bg-white/[0.01] shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider">Inquiry Conversion Trend</h3>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">Real-time daily incoming traffic</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-extrabold uppercase text-cyan-400">
                    Live Sparkline
                  </span>
                </div>
                <canvas ref={chartCanvasRef} width={650} height={180} className="w-full h-[180px] bg-transparent" />
              </div>
            </div>
          )}

          {/* TAB: PROJECTS CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase tracking-wider">Project Portfolio</h2>
                <button 
                  onClick={() => { setEditId(null); setProjectForm({ title: '', description: '', category: '', client: '', budget: '', timeline: '', tags: '', images: '', liveUrl: '', githubUrl: '' }); setUploadedImages([]); setModalType('project'); }}
                  className="flex items-center gap-1.5 bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                  <FiPlus /> Add Project
                </button>
              </div>

              {/* Projects Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-neutral-500">
                      <th className="py-3 px-4">Project Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj.id || proj._id} className="border-b border-white/5 text-xs text-neutral-300">
                        <td className="py-4 px-4 font-bold text-white">{proj.title}</td>
                        <td className="py-4 px-4">{proj.category}</td>
                        <td className="py-4 px-4">{proj.client}</td>
                        <td className="py-4 px-4">{proj.timeline}</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button onClick={() => openProjectEdit(proj)} className="text-cyan-400 hover:text-cyan-300 p-1"><FiEdit2 /></button>
                          <button onClick={() => handleItemDelete('projects', proj.id || proj._id, 'admin')} className="text-rose-400 hover:text-rose-300 p-1"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SERVICES CRUD */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase tracking-wider">Services CMS</h2>
                <button 
                  onClick={() => { setEditId(null); setServiceForm({ title: '', description: '', category: '', details: '', icon: '', accentColor: 'from-cyan-500 to-blue-500', glowColor: 'rgba(6,182,212,0.2)', canvasType: 'web' }); setModalType('service'); }}
                  className="flex items-center gap-1.5 bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                  <FiPlus /> Add Service
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-neutral-500">
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Visual Type</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((srv) => (
                      <tr key={srv.id || srv._id} className="border-b border-white/5 text-xs text-neutral-300">
                        <td className="py-4 px-4 font-bold text-white">{srv.title}</td>
                        <td className="py-4 px-4">{srv.category}</td>
                        <td className="py-4 px-4 font-mono text-[10px]">{srv.canvasType}</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button onClick={() => openServiceEdit(srv)} className="text-cyan-400 hover:text-cyan-300 p-1"><FiEdit2 /></button>
                          <button onClick={() => handleItemDelete('services', srv.id || srv._id, 'admin')} className="text-rose-400 hover:text-rose-300 p-1"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS CRUD */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase tracking-wider">Testimonials CMS</h2>
                <button 
                  onClick={() => { setEditId(null); setTestimonialForm({ name: '', role: '', company: '', feedback: '', rating: 5, avatar: '' }); setModalType('testimonial'); }}
                  className="flex items-center gap-1.5 bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                  <FiPlus /> Add Review
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-neutral-500">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((test) => (
                      <tr key={test.id || test._id} className="border-b border-white/5 text-xs text-neutral-300">
                        <td className="py-4 px-4 font-bold text-white">{test.name}</td>
                        <td className="py-4 px-4">{test.company} ({test.role})</td>
                        <td className="py-4 px-4 text-amber-500 font-bold">{test.rating} ★</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button onClick={() => openTestimonialEdit(test)} className="text-cyan-400 hover:text-cyan-300 p-1"><FiEdit2 /></button>
                          <button onClick={() => handleItemDelete('testimonials', test.id || test._id, 'admin')} className="text-rose-400 hover:text-rose-300 p-1"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: BLOG CMS CRUD */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase tracking-wider">Blogs CMS</h2>
                <button 
                  onClick={() => { setEditId(null); setBlogForm({ title: '', slug: '', category: '', tags: '', featuredImage: '', content: '', seoTitle: '', seoDescription: '', status: 'draft' }); setModalType('blog'); }}
                  className="flex items-center gap-1.5 bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                  <FiPlus /> Create Article
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-neutral-500">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr key={b.id || b._id} className="border-b border-white/5 text-xs text-neutral-300">
                        <td className="py-4 px-4 font-bold text-white">{b.title}</td>
                        <td className="py-4 px-4">{b.category}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            b.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-neutral-800 text-neutral-500'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button onClick={() => openBlogEdit(b)} className="text-cyan-400 hover:text-cyan-300 p-1"><FiEdit2 /></button>
                          <button onClick={() => handleItemDelete('blogs', b.id || b._id, 'admin')} className="text-rose-400 hover:text-rose-300 p-1"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: FAQ CMS CRUD */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase tracking-wider">FAQs CMS</h2>
                <button 
                  onClick={() => { setEditId(null); setFaqForm({ question: '', answer: '', displayOrder: 0 }); setModalType('faq'); }}
                  className="flex items-center gap-1.5 bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                  <FiPlus /> Add FAQ
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-neutral-500">
                      <th className="py-3 px-4">Question</th>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map((f) => (
                      <tr key={f.id || f._id} className="border-b border-white/5 text-xs text-neutral-300">
                        <td className="py-4 px-4 font-bold text-white">{f.question}</td>
                        <td className="py-4 px-4 font-mono">{f.displayOrder}</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button onClick={() => openFaqEdit(f)} className="text-cyan-400 hover:text-cyan-300 p-1"><FiEdit2 /></button>
                          <button onClick={() => handleItemDelete('faqs', f.id || f._id, 'admin')} className="text-rose-400 hover:text-rose-300 p-1"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TEAM CMS CRUD */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase tracking-wider">Team CMS</h2>
                <button 
                  onClick={() => { setEditId(null); setTeamForm({ name: '', role: '', bio: '', photo: '', linkedin: '', github: '', twitter: '' }); setModalType('team'); }}
                  className="flex items-center gap-1.5 bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                  <FiPlus /> Add Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-neutral-500">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((m) => (
                      <tr key={m.id || m._id} className="border-b border-white/5 text-xs text-neutral-300">
                        <td className="py-4 px-4 font-bold text-white">{m.name}</td>
                        <td className="py-4 px-4">{m.role}</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button onClick={() => openTeamEdit(m)} className="text-cyan-400 hover:text-cyan-300 p-1"><FiEdit2 /></button>
                          <button onClick={() => handleItemDelete('team', m.id || m._id, 'admin')} className="text-rose-400 hover:text-rose-300 p-1"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: INQUIRIES & EXPORTS */}
          {activeTab === 'messages' && (() => {
            const query = inquirySearch.toLowerCase();
            const filteredInquiries = messages.filter((msg) => {
              return (
                (msg.name || '').toLowerCase().includes(query) ||
                (msg.email || '').toLowerCase().includes(query) ||
                (msg.subject || '').toLowerCase().includes(query) ||
                (msg.message || '').toLowerCase().includes(query) ||
                (msg.company || '').toLowerCase().includes(query)
              );
            });

            const ITEMS_PER_PAGE = 5;
            const totalInquiryPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE) || 1;
            const paginatedInquiries = filteredInquiries.slice(
              (inquiryPage - 1) * ITEMS_PER_PAGE,
              inquiryPage * ITEMS_PER_PAGE
            );

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-xl font-black uppercase tracking-wider">Client Inquiries</h2>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={exportQueriesToCSV}
                      className="flex items-center gap-2 border border-white/5 bg-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-white/10 text-cyan-400 cursor-pointer"
                    >
                      <FiDownload /> Export CSV
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 border border-white/5 bg-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-white/10 cursor-pointer"
                    >
                      <FiPrinter /> Print PDF
                    </button>
                  </div>
                </div>

                {/* Premium Search Bar */}
                <div className="relative w-full rounded-xl p-[1px] bg-white/5 focus-within:bg-gradient-to-r focus-within:from-cyan-500/25 focus-within:to-blue-500/25 transition-all duration-300">
                  <input 
                    type="text"
                    placeholder="Search inquiries by client name, email, company, subject, or message content..."
                    value={inquirySearch}
                    onChange={(e) => { setInquirySearch(e.target.value); setInquiryPage(1); }}
                    className="w-full rounded-xl bg-[#070707] py-3.5 px-4 text-xs text-white placeholder-neutral-500 outline-none border border-white/5 focus-within:border-transparent transition-colors duration-300"
                  />
                </div>

                <div className="space-y-4">
                  {paginatedInquiries.length === 0 ? (
                    <p className="text-xs text-neutral-500">No contact messages logged or match your filter query.</p>
                  ) : (
                    paginatedInquiries.map((msg) => (
                      <div key={msg.id || msg._id} className={`p-6 rounded-2xl border text-xs transition-all duration-300 ${
                        msg.status === 'unread' 
                          ? 'border-cyan-500/20 bg-cyan-950/5' 
                          : msg.status === 'replied'
                          ? 'border-indigo-500/20 bg-indigo-950/5'
                          : 'border-white/5 bg-white/[0.01]'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{msg.name}</h4>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                msg.status === 'unread'
                                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 animate-pulse'
                                  : msg.status === 'replied'
                                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25'
                                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700/30'
                              }`}>
                                {msg.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-500 mt-1 block">
                              {msg.email} {msg.phone && `| ${msg.phone}`} {msg.company && `| ${msg.company}`} | {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {msg.status === 'unread' ? (
                              <button 
                                onClick={() => handleMessageStatus(msg.id || msg._id, 'read')}
                                className="px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide border bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400 cursor-pointer"
                              >
                                Mark Read
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleMessageStatus(msg.id || msg._id, 'unread')}
                                className="px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide border bg-transparent text-neutral-400 border-neutral-700 hover:text-white cursor-pointer"
                              >
                                Mark Unread
                              </button>
                            )}
                            {msg.status !== 'replied' && (
                              <button 
                                onClick={() => handleMessageStatus(msg.id || msg._id, 'replied')}
                                className="px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide border bg-transparent text-indigo-400 border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/10 cursor-pointer"
                              >
                                Mark Replied
                              </button>
                            )}
                            <button 
                              onClick={() => handleItemDelete('contacts', msg.id || msg._id, 'superadmin')}
                              className="text-rose-400 border border-rose-500/20 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-black cursor-pointer"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 py-2.5 text-[10px]">
                          <div>
                            <span className="text-neutral-500 font-bold uppercase block">Budget Goal</span>
                            <span className="text-neutral-300">{msg.budget || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 font-bold uppercase block">Target Timeline</span>
                            <span className="text-neutral-300">{msg.timeline || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-3 mt-1">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">Subject: {msg.subject}</span>
                          <p className="text-neutral-300 leading-relaxed font-light mt-1">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {totalInquiryPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-neutral-400">
                    <span>
                      Page <strong className="text-white">{inquiryPage}</strong> of <strong className="text-white">{totalInquiryPages}</strong> ({filteredInquiries.length} total)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setInquiryPage((p) => Math.max(1, p - 1))}
                        disabled={inquiryPage === 1}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none uppercase font-bold text-[10px] tracking-wider cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setInquiryPage((p) => Math.min(totalInquiryPages, p + 1))}
                        disabled={inquiryPage === totalInquiryPages}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none uppercase font-bold text-[10px] tracking-wider cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: ESTIMATIONS */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider mb-4">Project Estimates</h2>

              <div className="space-y-4">
                {quotes.length === 0 ? (
                  <p className="text-xs text-neutral-500">No project quotes logged.</p>
                ) : (
                  quotes.map((q) => (
                    <div key={q.id || q._id} className={`p-6 rounded-2xl border text-xs ${
                      q.status === 'pending' ? 'border-cyan-500/20 bg-cyan-950/5' : 'border-white/5 bg-white/[0.01]'
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-white text-sm">{q.name}</h4>
                          <span className="text-[10px] text-neutral-500 mt-0.5 block">
                            {q.email} {q.company && `| ${q.company}`} | {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleQuoteStatus(q.id || q._id, q.status)}
                            className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide border ${
                              q.status === 'pending' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-transparent text-neutral-400 border-neutral-700'
                            }`}
                          >
                            {q.status === 'pending' ? 'Mark Processed' : 'Mark Pending'}
                          </button>
                          <button 
                            onClick={() => handleItemDelete('quotes', q.id || q._id, 'admin')}
                            className="text-rose-400 border border-rose-500/20 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-black"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 py-3 text-[10px]">
                        <div>
                          <span className="text-neutral-500 font-bold uppercase block">Budget</span>
                          <span className="text-neutral-300 font-semibold text-cyan-400">
                            {q.budget && !isNaN(Number(q.budget)) 
                              ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(q.budget)) 
                              : q.budget || 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-bold uppercase block">Timeline</span>
                          <span className="text-neutral-300 font-semibold text-cyan-400">
                            {q.timeline && !isNaN(Number(q.timeline)) 
                              ? `${q.timeline} Days` 
                              : q.timeline || 'Not specified'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">Services Requested</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {q.services?.map((s: string, idx: number) => (
                            <span key={idx} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] text-neutral-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 border-t border-white/5 pt-3">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Details</span>
                        <p className="text-neutral-300 leading-relaxed font-light mt-1">{q.projectDetails}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: NEWSLETTER */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider mb-4">Newsletter Subs</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-neutral-500">
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={sub.id || sub._id || idx} className="border-b border-white/5 text-xs text-neutral-300">
                        <td className="py-4 px-4 font-semibold text-white">{sub.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            sub.active ? 'bg-green-500/10 text-green-400' : 'bg-neutral-800 text-neutral-500'
                          }`}>
                            {sub.active ? 'Active' : 'Unsubscribed'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-neutral-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MEDIA LIBRARY DRAG AND DROP */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider mb-4">Media Library</h2>

              {/* Drag and Drop Zone */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-cyan-500/35 rounded-3xl p-10 text-center bg-white/[0.01] hover:bg-white/[0.02] transition-all cursor-pointer relative flex flex-col items-center justify-center gap-3"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="image/*"
                />
                <FiUploadCloud size={36} className="text-neutral-500 group-hover:text-cyan-400" />
                <div>
                  <p className="text-xs font-bold uppercase text-white">Drag & Drop Image here</p>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">or click to browse local files (max 5MB)</p>
                </div>
                {uploadProgress === 'uploading' && <span className="text-[10px] text-cyan-400 animate-pulse">Uploading file...</span>}
                {uploadProgress === 'success' && <span className="text-[10px] text-green-400">Success! Asset URL: {uploadedUrl}</span>}
                {uploadProgress === 'error' && <span className="text-[10px] text-rose-400">Upload failed.</span>}
              </div>

              {/* Media Files list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {mediaFiles.map((item, idx) => {
                  const url = typeof item === 'string' ? item : (item.url || '');
                  const id = typeof item === 'string' ? null : (item.id || item._id);
                  return (
                    <div key={id || idx} className="group relative rounded-2xl overflow-hidden border border-white/5 aspect-square bg-[#0c0c0c] flex items-center justify-center">
                      <img src={url} alt="media element" className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                        <span className="text-[8px] font-mono truncate text-neutral-300">{url}</span>
                        <button 
                          onClick={() => { navigator.clipboard.writeText(url); showToast('URL copied to clipboard!', 'info'); }}
                          className="w-full bg-cyan-500 text-black py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Copy Link
                        </button>
                        {id && (
                          <button 
                            onClick={() => handleMediaDelete(id)}
                            className="w-full bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-black py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer border border-rose-500/20"
                          >
                            Delete Image
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: GLOBAL SETTINGS PANEL */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-wider mb-6">Website Settings</h2>
              
              <form onSubmit={handleSettingsSubmit} className="space-y-5 text-xs">
                
                <div className="border-b border-white/5 pb-4 mb-4">
                  <h3 className="text-xs font-bold uppercase text-cyan-400 mb-4">Corporate Contacts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Agency Name</label>
                      <input type="text" value={settingsForm.companyName} onChange={(e) => setSettingsForm({...settingsForm, companyName: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Public Contact Email</label>
                      <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Telephone Contact</label>
                      <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Office Address</label>
                      <input type="text" value={settingsForm.address} onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                  </div>
                </div>

                <div className="border-b border-white/5 pb-4 mb-4">
                  <h3 className="text-xs font-bold uppercase text-cyan-400 mb-4">Social Media Profile Links</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Twitter URL</label>
                      <input type="text" value={settingsForm.twitter} onChange={(e) => setSettingsForm({...settingsForm, twitter: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">LinkedIn URL</label>
                      <input type="text" value={settingsForm.linkedin} onChange={(e) => setSettingsForm({...settingsForm, linkedin: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">GitHub URL</label>
                      <input type="text" value={settingsForm.github} onChange={(e) => setSettingsForm({...settingsForm, github: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Instagram URL</label>
                      <input type="text" value={settingsForm.instagram} onChange={(e) => setSettingsForm({...settingsForm, instagram: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Facebook URL</label>
                      <input type="text" value={settingsForm.facebook} onChange={(e) => setSettingsForm({...settingsForm, facebook: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                  </div>
                </div>

                <div className="border-b border-white/5 pb-4 mb-4">
                  <h3 className="text-xs font-bold uppercase text-cyan-400 mb-4">Typography Settings</h3>
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-[10px] uppercase font-bold text-neutral-500">Hero Header Message</label>
                    <input type="text" value={settingsForm.heroText} onChange={(e) => setSettingsForm({...settingsForm, heroText: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-500">Hero Subtitle Paragraph</label>
                    <textarea rows={3} value={settingsForm.heroSubtitle} onChange={(e) => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20 resize-none" />
                  </div>
                </div>

                <div className="border-b border-white/5 pb-4 mb-4">
                  <h3 className="text-xs font-bold uppercase text-cyan-400 mb-4">SEO Header Parameters</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Meta Title Tag</label>
                      <input type="text" value={settingsForm.metaTitle} onChange={(e) => setSettingsForm({...settingsForm, metaTitle: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Google Analytics Tracking ID</label>
                      <input type="text" value={settingsForm.googleAnalyticsId} onChange={(e) => setSettingsForm({...settingsForm, googleAnalyticsId: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-500">Meta Description</label>
                    <textarea rows={2} value={settingsForm.metaDescription} onChange={(e) => setSettingsForm({...settingsForm, metaDescription: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white outline-none focus:border-cyan-500/20 resize-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-black py-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                  Save Global Configurations
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* DYNAMIC FORMS MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-6">
          <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-white/10 max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">
              {editId ? 'Modify' : 'Create'} {modalType}
            </h3>

            {/* PROJECT DIALOG FORM */}
            {modalType === 'project' && (
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Project Name *" required value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Category *" required value={projectForm.category} onChange={(e) => setProjectForm({...projectForm, category: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Client Name *" required value={projectForm.client} onChange={(e) => setProjectForm({...projectForm, client: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Budget *" required value={projectForm.budget} onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Timeline *" required value={projectForm.timeline} onChange={(e) => setProjectForm({...projectForm, timeline: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Technologies (comma-separated)" value={projectForm.tags} onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                </div>
                {/* Image Upload System */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block">Project Images (Drag to Reorder)</label>
                  
                  {/* Drag & Drop Zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => projectFileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-6 border border-dashed rounded-2xl cursor-pointer transition-all duration-300 group min-h-[140px]
                      ${isDragActive 
                        ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)] scale-[0.99]' 
                        : 'border-white/10 hover:border-blue-500/50 bg-white/[0.02] hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-blue-500/5 to-cyan-500/5 blur-xl" />
                    
                    <div className="flex flex-col items-center text-center gap-2 relative z-10 pointer-events-none">
                      <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                        <FiUploadCloud size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white tracking-wide">
                          Drag & Drop Images
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          or <span className="text-blue-400 font-bold hover:underline">Click to Upload</span>
                        </p>
                      </div>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
                        JPG, PNG, WEBP (Max 5MB)
                      </p>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={projectFileInputRef} 
                      multiple 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFilesSelected(Array.from(e.target.files));
                        }
                      }} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                    />
                  </div>

                  {/* Uploaded Images List with Reordering */}
                  {uploadedImages.length > 0 && (
                    <Reorder.Group axis="y" values={uploadedImages} onReorder={setUploadedImages} className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
                      {uploadedImages.map((item, idx) => (
                        <Reorder.Item 
                          key={item.id} 
                          value={item} 
                          className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md relative group/card cursor-grab active:cursor-grabbing hover:border-white/10 transition-all duration-300 select-none"
                        >
                          <div className="flex items-center gap-3 flex-grow min-w-0">
                            {/* Drag handle & order index indicator */}
                            <div className="flex flex-col items-center justify-center text-xs font-bold text-neutral-500 w-5">
                              {idx === 0 ? (
                                <span className="text-blue-400 text-base">★</span>
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>

                            {/* Image Preview */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-white/5 flex-shrink-0">
                              <img src={item.url} alt="preview" className="w-full h-full object-cover animate-fade-in" />
                              {item.isUploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <FiRefreshCw className="animate-spin text-white text-xs" />
                                </div>
                              )}
                            </div>

                            {/* Details & Progress Bar */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[9px] font-semibold text-neutral-200 truncate">
                                  {idx === 0 ? (
                                    <span className="text-blue-400 uppercase tracking-widest font-extrabold text-[8px] bg-blue-500/10 px-1.5 py-0.5 rounded">Thumbnail (Primary)</span>
                                  ) : (
                                    <span className="text-purple-400 uppercase tracking-widest font-extrabold text-[8px] bg-purple-500/10 px-1.5 py-0.5 rounded">Gallery Image</span>
                                  )}
                                </span>
                                {item.isUploading && (
                                  <span className="text-[9px] text-blue-400 font-bold">{item.progress}%</span>
                                )}
                              </div>
                              
                              {item.isUploading ? (
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${item.progress}%` }} />
                                </div>
                              ) : item.error ? (
                                <span className="text-[9px] text-red-500 block truncate">{item.error}</span>
                              ) : (
                                <span className="text-[8px] text-neutral-500 block truncate font-mono">{item.url}</span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 ml-3 relative z-20">
                            {/* Replace button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById(`replace-input-${idx}`)?.click();
                              }}
                              className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer animate-pulse-glow"
                              title="Replace Image"
                            >
                              <FiRefreshCw size={12} />
                            </button>
                            <input
                              type="file"
                              id={`replace-input-${idx}`}
                              className="hidden"
                              accept="image/jpeg,image/png,image/webp,image/jpg"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleReplaceImage(idx, e.target.files[0]);
                                }
                              }}
                            />

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImages(prev => prev.filter(img => img.id !== item.id));
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                              title="Delete Image"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Live Demo Link" value={projectForm.liveUrl} onChange={(e) => setProjectForm({...projectForm, liveUrl: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="GitHub Repository Link" value={projectForm.githubUrl} onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                </div>
                <textarea placeholder="Detailed Description *" required rows={4} value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none resize-none" />
                
                <div className="flex gap-3 justify-end mt-4">
                  <button type="button" onClick={() => { setModalType(null); setUploadedImages([]); }} className="px-5 py-3 rounded-xl border border-white/5 text-neutral-400 text-xs font-bold uppercase hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400">Save</button>
                </div>
              </form>
            )}

            {/* SERVICE DIALOG FORM */}
            {modalType === 'service' && (
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Service Name *" required value={serviceForm.title} onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Category *" required value={serviceForm.category} onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Icon (e.g. FiGlobe) *" required value={serviceForm.icon} onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <select value={serviceForm.canvasType} onChange={(e) => setServiceForm({...serviceForm, canvasType: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-neutral-400 outline-none">
                    <option value="web">Sine Wave (Web)</option>
                    <option value="design">Rings (Design)</option>
                    <option value="ai">Neural Connected (AI)</option>
                    <option value="crm">Bars (CRM)</option>
                    <option value="erp">Grid Blocks (ERP)</option>
                    <option value="api">Data Packets (API)</option>
                    <option value="saas">Line Graph (SaaS)</option>
                    <option value="mobile">Phone Signal (Mobile)</option>
                    <option value="ecommerce">Gravity Coins (E-Commerce)</option>
                    <option value="cloud">Pulses (Cloud)</option>
                    <option value="support">Heartbeat (Support)</option>
                    <option value="software">Binary Rain (Software)</option>
                  </select>
                </div>
                <input type="text" placeholder="Features list (comma separated)" value={serviceForm.details} onChange={(e) => setServiceForm({...serviceForm, details: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                <textarea placeholder="Short Description *" required rows={4} value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none resize-none" />
                
                <div className="flex gap-3 justify-end mt-4">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-3 rounded-xl border border-white/5 text-neutral-400 text-xs font-bold uppercase hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400">Save</button>
                </div>
              </form>
            )}

            {/* TESTIMONIAL DIALOG FORM */}
            {modalType === 'testimonial' && (
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Client Name *" required value={testimonialForm.name} onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Designation / Role *" required value={testimonialForm.role} onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Company Name *" required value={testimonialForm.company} onChange={(e) => setTestimonialForm({...testimonialForm, company: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="number" min={1} max={5} placeholder="Rating (1-5) *" required value={testimonialForm.rating} onChange={(e) => setTestimonialForm({...testimonialForm, rating: Number(e.target.value)})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                </div>
                <input type="text" placeholder="Client Avatar Image Link" value={testimonialForm.avatar} onChange={(e) => setTestimonialForm({...testimonialForm, avatar: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                <textarea placeholder="Client Feedback Review *" required rows={4} value={testimonialForm.feedback} onChange={(e) => setTestimonialForm({...testimonialForm, feedback: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none resize-none" />

                <div className="flex gap-3 justify-end mt-4">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-3 rounded-xl border border-white/5 text-neutral-400 text-xs font-bold uppercase hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400">Save</button>
                </div>
              </form>
            )}

            {/* BLOG DIALOG FORM */}
            {modalType === 'blog' && (
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Article Title *" required value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Slug (URL parameter) *" required value={blogForm.slug} onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Category *" required value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Tags (comma separated)" value={blogForm.tags} onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                </div>
                <input type="text" placeholder="Featured Image Link *" required value={blogForm.featuredImage} onChange={(e) => setBlogForm({...blogForm, featuredImage: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="SEO Title" value={blogForm.seoTitle} onChange={(e) => setBlogForm({...blogForm, seoTitle: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <select value={blogForm.status} onChange={(e) => setBlogForm({...blogForm, status: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-neutral-400 outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <input type="text" placeholder="SEO Description" value={blogForm.seoDescription} onChange={(e) => setBlogForm({...blogForm, seoDescription: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                <textarea placeholder="Article Content (Markdown / HTML support) *" required rows={6} value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none resize-none" />

                <div className="flex gap-3 justify-end mt-4">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-3 rounded-xl border border-white/5 text-neutral-400 text-xs font-bold uppercase hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400">Save</button>
                </div>
              </form>
            )}

            {/* FAQ DIALOG FORM */}
            {modalType === 'faq' && (
              <form onSubmit={handleFaqSubmit} className="space-y-4">
                <input type="text" placeholder="FAQ Question *" required value={faqForm.question} onChange={(e) => setFaqForm({...faqForm, question: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                <input type="number" placeholder="Display Order Placement" value={faqForm.displayOrder} onChange={(e) => setFaqForm({...faqForm, displayOrder: Number(e.target.value)})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                <textarea placeholder="FAQ Answer *" required rows={4} value={faqForm.answer} onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none resize-none" />

                <div className="flex gap-3 justify-end mt-4">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-3 rounded-xl border border-white/5 text-neutral-400 text-xs font-bold uppercase hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400">Save</button>
                </div>
              </form>
            )}

            {/* TEAM DIALOG FORM */}
            {modalType === 'team' && (
              <form onSubmit={handleTeamSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Name *" required value={teamForm.name} onChange={(e) => setTeamForm({...teamForm, name: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Role *" required value={teamForm.role} onChange={(e) => setTeamForm({...teamForm, role: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="LinkedIn Link" value={teamForm.linkedin} onChange={(e) => setTeamForm({...teamForm, linkedin: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="GitHub Link" value={teamForm.github} onChange={(e) => setTeamForm({...teamForm, github: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                  <input type="text" placeholder="Twitter Link" value={teamForm.twitter} onChange={(e) => setTeamForm({...teamForm, twitter: e.target.value})} className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none" />
                </div>
                {/* Team Member Photo Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block">Photo Image *</label>
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                      {teamForm.photo ? (
                        <img src={teamForm.photo} alt="team preview" className="w-full h-full object-cover" />
                      ) : (
                        <FiUser size={24} className="text-neutral-500" />
                      )}
                      {teamUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-[10px] text-cyan-400 font-bold">{teamUploadProgress}%</span>
                        </div>
                      )}
                    </div>
                    <div 
                      onClick={() => teamFileInputRef.current?.click()}
                      className="flex-grow border border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl p-4 text-center bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer text-xs font-bold text-neutral-400 hover:text-white transition-all flex flex-col items-center justify-center gap-1"
                    >
                      <FiUploadCloud size={18} className="text-neutral-500" />
                      <span>Upload Profile Photo</span>
                      <span className="text-[8px] text-neutral-600 font-normal uppercase">JPG, PNG, WEBP (MAX 5MB)</span>
                    </div>
                    <input 
                      type="file" 
                      ref={teamFileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 5 * 1024 * 1024) {
                            showToast('File exceeds 5MB size limit.', 'error');
                            return;
                          }
                          setTeamUploading(true);
                          setTeamUploadProgress(0);
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            const response = await axios.post('/api/upload', formData, {
                              headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token}`
                              },
                              onUploadProgress: (progressEvent) => {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded));
                                setTeamUploadProgress(percentCompleted);
                              }
                            });
                            if (response.data && response.data.success) {
                              setTeamForm(prev => ({ ...prev, photo: response.data.url }));
                              showToast('Photo uploaded successfully!', 'success');
                            } else {
                              showToast('Photo upload failed.', 'error');
                            }
                          } catch (err) {
                            console.error(err);
                            showToast('Photo upload error.', 'error');
                          } finally {
                            setTeamUploading(false);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <textarea placeholder="Bio *" required rows={3} value={teamForm.bio} onChange={(e) => setTeamForm({...teamForm, bio: e.target.value})} className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white placeholder-neutral-500 outline-none resize-none" />

                <div className="flex gap-3 justify-end mt-4">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-3 rounded-xl border border-white/5 text-neutral-400 text-xs font-bold uppercase hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400">Save</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* BEAUTIFUL CUSTOM TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3.5 px-5 py-4 rounded-2xl border border-white/10 bg-[#0e0e0e]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-sm"
          >
            {/* Left accent border depending on type */}
            <div className={`absolute left-0 top-3.5 bottom-3.5 w-1 rounded-full ${
              toast.type === 'success' ? 'bg-cyan-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-amber-500'
            }`} />

            {/* Check/Error Icons */}
            <div className={`p-2 rounded-xl shrink-0 ${
              toast.type === 'success' ? 'bg-cyan-500/10 text-cyan-400' : toast.type === 'error' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : toast.type === 'error' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            </div>

            <div className="flex-grow pr-2">
              <h4 className="text-[9px] uppercase font-black tracking-widest text-neutral-500">
                System Status
              </h4>
              <p className="text-xs text-white font-medium mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setToast(null)}
              className="text-neutral-500 hover:text-white transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
