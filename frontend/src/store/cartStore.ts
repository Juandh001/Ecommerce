import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
}

interface CartActions {
  setCart: (cart: Cart | null) => void;
  addItem: (item: CartItem) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
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

      updateItem: (productId: string, quantity: number) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );

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

      removeItem: (productId: string) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.filter(
          (item) => item.productId !== productId
        );

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

      clearCart: () => {
        const { cart } = get();
        if (!cart) return;

        set({
          cart: {
            ...cart,
            items: [],
            totalItems: 0,
            subtotal: 0,
          },
        });
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