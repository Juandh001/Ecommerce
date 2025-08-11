import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  clearAuthOnUserNotFound: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user: User, token: string) => {
        const isProduction = process.env.NODE_ENV === 'production';
        Cookies.set('auth-token', token, { 
          expires: 7, 
          secure: isProduction, 
          sameSite: 'strict' 
        });
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Redirect based on user role
        if (typeof window !== 'undefined') {
          if (user.role === 'ADMIN') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
        }
      },

      logout: () => {
        Cookies.remove('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Redirect to home after logout
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initialize: () => {
        const token = Cookies.get('auth-token');
        if (token) {
          try {
            // Decode JWT token to get user info
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user = {
              id: payload.id,
              email: payload.email,
              role: payload.role,
              firstName: payload.firstName || '',
              lastName: payload.lastName || '',
            };
            set({ 
              token, 
              user, 
              isAuthenticated: true,
              isLoading: false 
            });
          } catch (error) {
            console.error('Error decoding token:', error);
            // If token is invalid, remove it
            Cookies.remove('auth-token');
            set({ 
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false 
            });
          }
        } else {
          set({ isLoading: false });
        }
      },
      clearAuthOnUserNotFound: () => {
        Cookies.remove('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Don't redirect, just clear the auth state
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 