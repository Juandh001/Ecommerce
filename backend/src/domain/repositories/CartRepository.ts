import { Cart, CartWithItems, AddToCartData, UpdateCartItemData } from '../entities/Cart';

export interface CartRepository {
  findByUserId(userId: string): Promise<CartWithItems | null>;
  create(userId: string): Promise<Cart>;
  addItem(userId: string, data: AddToCartData): Promise<CartWithItems>;
  updateItem(userId: string, productId: string, data: UpdateCartItemData): Promise<CartWithItems>;
  removeItem(userId: string, productId: string): Promise<CartWithItems>;
  clear(userId: string): Promise<void>;
  getItemCount(userId: string): Promise<number>;
  mergeCart(fromUserId: string, toUserId: string): Promise<CartWithItems>;
} 