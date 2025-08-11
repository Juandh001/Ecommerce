import { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { ProductWithDetails } from '../../../domain/entities/Product';

export interface GetProductsUseCaseInput {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface GetProductsUseCaseOutput {
  products: ProductWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: GetProductsUseCaseInput = {}): Promise<GetProductsUseCaseOutput> {
    const {
      page = 1,
      limit = 20,
      categoryId,
      search,
      priceRange,
      tags,
      isFeatured,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = input;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.search = search;
    }

    if (priceRange) {
      where.priceRange = priceRange;
    }

    if (tags && tags.length > 0) {
      where.tags = tags;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.productRepository.findMany({
      skip,
      take,
      where,
      orderBy: {
        field: sortBy,
        direction: sortOrder,
      },
      include: {
        category: true,
        images: true,
        inventory: true,
        reviews: true,
      },
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      products: result.products,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
} 