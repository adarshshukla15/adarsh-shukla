export interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  client: string;
  budget: string;
  timeline: string;
  tags: string[];
  thumbnail: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Service {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  details: string[];
  icon: string;
}

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

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
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

// Fetch all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
}

// Fetch all services
export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch('/api/services');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching services:', err);
    return [];
  }
}

// Fetch all testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch('/api/testimonials');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    return [];
  }
}

// Submit contact form
export async function submitContact(data: ContactData): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// Submit quote form
export async function submitQuote(data: QuoteData): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ================= BLOG CMS CLIENTS =================
export async function getBlogs(): Promise<any[]> {
  try {
    const res = await fetch('/api/blogs');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching blogs:', err);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<any> {
  const res = await fetch(`/api/blogs/${slug}`);
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function createBlog(data: any, token: string): Promise<any> {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateBlog(id: string, data: any, token: string): Promise<any> {
  const res = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteBlog(id: string, token: string): Promise<any> {
  const res = await fetch(`/api/blogs/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

// ================= FAQ CMS CLIENTS =================
export async function getFaqs(): Promise<any[]> {
  try {
    const res = await fetch('/api/faqs');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    return [];
  }
}

export async function createFaq(data: any, token: string): Promise<any> {
  const res = await fetch('/api/faqs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateFaq(id: string, data: any, token: string): Promise<any> {
  const res = await fetch(`/api/faqs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteFaq(id: string, token: string): Promise<any> {
  const res = await fetch(`/api/faqs/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

// ================= TEAM CMS CLIENTS =================
export async function getTeam(): Promise<any[]> {
  try {
    const res = await fetch('/api/team');
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching team:', err);
    return [];
  }
}

export async function createTeamMember(data: any, token: string): Promise<any> {
  const res = await fetch('/api/team', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateTeamMember(id: string, data: any, token: string): Promise<any> {
  const res = await fetch(`/api/team/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteTeamMember(id: string, token: string): Promise<any> {
  const res = await fetch(`/api/team/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

// ================= GLOBAL CONFIGURATION CLIENTS =================
export async function getSettings(): Promise<any> {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error('Error fetching settings:', err);
    return null;
  }
}

export async function updateSettings(data: any, token: string): Promise<any> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ================= FILE UPLOAD CLIENT =================
export async function uploadMedia(file: File, token: string): Promise<{ success: boolean; url: string; public_id?: string; message?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return res.json();
}

export async function getMediaList(token: string): Promise<{ success: boolean; data: any[] }> {
  const res = await fetch('/api/media', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export async function deleteMediaItem(id: string, token: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/media/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}
