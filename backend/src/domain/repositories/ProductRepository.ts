import { Product, CreateProductData, UpdateProductData, ProductWithDetails } from '../entities/Product';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findWithDetails(id: string): Promise<ProductWithDetails | null>;
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  delete(id: string): Promise<void>;
  findMany(options?: {
    skip?: number;
    take?: number;
    where?: {
      isActive?: boolean;
      isFeatured?: boolean;
      categoryId?: string;
      priceRange?: {
        min?: number;
        max?: number;
      };
      search?: string;
      tags?: string[];
    };
    orderBy?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    include?: {
      category?: boolean;
      images?: boolean;
      inventory?: boolean;
      reviews?: boolean;
    };
  }): Promise<{
    products: ProductWithDetails[];
    total: number;
  }>;
  findFeatured(limit?: number): Promise<ProductWithDetails[]>;
  findByCategory(categoryId: string, options?: {
    skip?: number;
    take?: number;
    orderBy?: {
      field: string;
      direction: 'asc' | 'desc';
    };
  }): Promise<{
    products: ProductWithDetails[];
    total: number;
  }>;
  search(query: string, options?: {
    skip?: number;
    take?: number;
    categoryId?: string;
  }): Promise<{
    products: ProductWithDetails[];
    total: number;
  }>;
  updateInventory(productId: string, quantity: number): Promise<void>;
  reserveInventory(productId: string, quantity: number): Promise<boolean>;
  releaseInventory(productId: string, quantity: number): Promise<void>;
} 