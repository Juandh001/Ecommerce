import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types';
import { cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
}

interface CartActions {
  setCart: (cart: Cart | null) => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  addItem: (item: CartItem) => void; // Keep local function for legacy support
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setLoading: (loading: boolean) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,

      setCart: (cart: Cart | null) => {
        set({ cart });
      },

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const response = await cartApi.getCart();
          set({ cart: response.cart });
        } catch (error) {
          console.error('Error fetching cart:', error);
          // Don't show toast for 401 errors to avoid spam
          if (error.response?.status !== 401) {
            toast.error('Error al cargar el carrito');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId: string, quantity: number) => {
        try {
          set({ isLoading: true });
          const response = await cartApi.addToCart(productId, quantity);
          set({ cart: response.cart });
          toast.success('Producto agregado al carrito');
        } catch (error) {
          console.error('Error adding to cart:', error);
          if (error.response?.status !== 401) {
            toast.error('Error al agregar al carrito');
          }
          throw error; // Re-throw to let UI handle the error
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: (item: CartItem) => {
        const { cart } = get();
        if (!cart) return;

        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );

        let updatedItems: CartItem[];
        
        if (existingItemIndex >= 0) {
          updatedItems = cart.items.map((i, index) =>
            index === existingItemIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updatedItems = [...cart.items, item];
        }

        const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = updatedItems.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        );

        set({
          cart: {
            ...cart,
            items: updatedItems,
            totalItems,
            subtotal,
          },
        });
      },

      updateItem: async (productId: string, quantity: number) => {
        try {
          set({ isLoading: true });
          const response = await cartApi.updateCartItem(productId, quantity);
          set({ cart: response.cart });
          toast.success('Cantidad actualizada');
        } catch (error) {
          console.error('Error updating cart item:', error);
          if (error.response?.status !== 401) {
            toast.error('Error al actualizar el carrito');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (productId: string) => {
        try {
          set({ isLoading: true });
          const response = await cartApi.removeFromCart(productId);
          set({ cart: response.cart });
          toast.success('Producto eliminado del carrito');
        } catch (error) {
          console.error('Error removing from cart:', error);
          if (error.response?.status !== 401) {
            toast.error('Error al eliminar del carrito');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true });
          await cartApi.clearCart();
          set({ 
            cart: {
              id: '',
              userId: '',
              createdAt: '',
              updatedAt: '',
              items: [],
              totalItems: 0,
              subtotal: 0,
            }
          });
          toast.success('Carrito vaciado');
        } catch (error) {
          console.error('Error clearing cart:', error);
          if (error.response?.status !== 401) {
            toast.error('Error al vaciar el carrito');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      getItemCount: () => {
        const { cart } = get();
        return cart?.totalItems || 0;
      },

      getSubtotal: () => {
        const { cart } = get();
        return cart?.subtotal || 0;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        cart: state.cart 
      }),
    }
  )
); 