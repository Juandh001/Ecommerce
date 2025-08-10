export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    sku: string;
    isActive: boolean;
    images: {
      url: string;
      altText?: string;
    }[];
    inventory?: {
      quantity: number;
      trackQuantity: boolean;
      allowBackorder: boolean;
    };
  };
}

export interface CartWithItems extends Cart {
  items: CartItemWithProduct[];
  totalItems: number;
  subtotal: number;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
} 