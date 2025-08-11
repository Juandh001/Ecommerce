import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  ProductsResponse, 
  ProductFilters,
  ProductWithDetails,
  Cart
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'An error occurred';
    
    // Handle authentication errors appropriately
    if (error.response?.status === 401) {
      // Only redirect to login on specific auth failures, not all 401s
      if (error.response?.data?.error === 'Authentication required' ||
          error.response?.data?.error === 'Invalid token' ||
          error.config?.url?.includes('/auth/')) {
        Cookies.remove('auth-token');
        if (typeof window !== 'undefined') {
          const { useAuthStore } = require('@/store/authStore');
          useAuthStore.getState().logout();
          window.location.href = '/auth/login';
        }
      }
      // Don't show toast for 401 to avoid spam
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    Cookies.remove('auth-token');
  },
};

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getFeaturedProducts: async (): Promise<{ products: ProductWithDetails[] }> => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  getProduct: async (id: string): Promise<{ product: ProductWithDetails }> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<{ product: ProductWithDetails }> => {
    const response = await api.get(`/products/by-slug/${slug}`);
    return response.data;
  },

  searchProducts: async (query: string, filters: Omit<ProductFilters, 'search'> = {}): Promise<ProductsResponse> => {
    const response = await api.get('/products', { 
      params: { ...filters, search: query } 
    });
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<ProductWithDetails>): Promise<{ product: ProductWithDetails }> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<{ cart: Cart }> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number): Promise<{ cart: Cart }> => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (productId: string, quantity: number): Promise<{ cart: Cart }> => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (productId: string): Promise<{ cart: Cart }> => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

export const ordersApi = {
  createOrder: async (data: {
    addressId: string;
    notes?: string;
  }): Promise<{ order: any }> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getOrders: async (page = 1, limit = 10): Promise<{ orders: any[]; total: number }> => {
    const response = await api.get('/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  getOrder: async (id: string): Promise<{ order: any }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export const categoriesApi = {
  getCategories: async (): Promise<{ categories: any[] }> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id: string): Promise<{ category: any }> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

export const addressesApi = {
  getAddresses: async (): Promise<{ addresses: any[] }> => {
    const response = await api.get('/addresses');
    return response.data;
  },

  createAddress: async (data: any): Promise<{ address: any }> => {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  updateAddress: async (id: string, data: any): Promise<{ address: any }> => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id: string): Promise<{ address: any }> => {
    const response = await api.post(`/addresses/${id}/default`);
    return response.data;
  },
};

export default api; 