export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: string;
  isFeatured?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  sortOrder: number;
  createdAt: Date;
}

export interface ProductWithDetails extends Product {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  inventory?: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
  };
  averageRating?: number;
  reviewCount?: number;
} 