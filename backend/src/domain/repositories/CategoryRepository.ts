import { Category, CreateCategoryData, UpdateCategoryData, CategoryWithChildren, CategoryTree } from '../entities/Category';

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findWithChildren(id: string): Promise<CategoryWithChildren | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: string, data: UpdateCategoryData): Promise<Category>;
  delete(id: string): Promise<void>;
  findMany(options?: {
    skip?: number;
    take?: number;
    where?: {
      isActive?: boolean;
      parentId?: string | null;
    };
    orderBy?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    include?: {
      children?: boolean;
      productCount?: boolean;
    };
  }): Promise<{
    categories: CategoryWithChildren[];
    total: number;
  }>;
  findTree(): Promise<CategoryTree[]>;
  findRootCategories(): Promise<CategoryWithChildren[]>;
  findByParent(parentId: string): Promise<Category[]>;
  reorderCategories(categoryIds: string[]): Promise<void>;
} 