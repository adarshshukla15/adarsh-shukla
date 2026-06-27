import { create } from 'zustand';
import { authService } from '../services/auth.service';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('a3_admin_token'),
  user: localStorage.getItem('a3_admin_user') 
    ? JSON.parse(localStorage.getItem('a3_admin_user')!) 
    : null,
  isAuthenticated: !!localStorage.getItem('a3_admin_token'),
  isLoading: false,
  error: null,

  login: (token, user) => {
    localStorage.setItem('a3_admin_token', token);
    localStorage.setItem('a3_admin_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem('a3_admin_token');
    localStorage.removeItem('a3_admin_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  setError: (error) => set({ error }),
  
  setLoading: (loading) => set({ isLoading: loading }),

  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return false;
    }

    try {
      set({ isLoading: true });
      const data = await authService.getMe();
      if (data.success) {
        set({ user: data.user, isAuthenticated: true, isLoading: false });
        localStorage.setItem('a3_admin_user', JSON.stringify(data.user));
        return true;
      } else {
        get().logout();
        set({ isLoading: false });
        return false;
      }
    } catch (err) {
      console.error('Check auth failed:', err);
      get().logout();
      set({ isLoading: false });
      return false;
    }
  }
}));
