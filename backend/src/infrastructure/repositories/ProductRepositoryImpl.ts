import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { Product, CreateProductData, UpdateProductData, ProductWithDetails } from '../../domain/entities/Product';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product ? this.mapToEntity(product) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
    });

    return product ? this.mapToEntity(product) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });

    return product ? this.mapToEntity(product) : null;
  }

  async findWithDetails(id: string): Promise<ProductWithDetails | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        inventory: true,
        reviews: {
          where: { isVisible: true },
          select: { rating: true },
        },
      },
    });

    return product ? this.mapToEntityWithDetails(product) : null;
  }

  async create(data: CreateProductData): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        sku: data.sku,
        price: data.price,
        comparePrice: data.comparePrice,
        costPrice: data.costPrice,
        weight: data.weight,
        dimensions: data.dimensions,
        isFeatured: data.isFeatured || false,
        tags: data.tags || [],
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        categoryId: data.categoryId,
        inventory: {
          create: {
            quantity: 0,
            trackQuantity: true,
          },
        },
      },
    });

    return this.mapToEntity(product);
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data,
    });

    return this.mapToEntity(product);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findMany(options?: any): Promise<{ products: ProductWithDetails[]; total: number; }> {
    const where: any = {};
    
    if (options?.where?.isActive !== undefined) {
      where.isActive = options.where.isActive;
    }
    
    if (options?.where?.isFeatured !== undefined) {
      where.isFeatured = options.where.isFeatured;
    }
    
    if (options?.where?.categoryId) {
      where.categoryId = options.where.categoryId;
    }
    
    if (options?.where?.priceRange) {
      where.price = {};
      if (options.where.priceRange.min !== undefined) {
        where.price.gte = options.where.priceRange.min;
      }
      if (options.where.priceRange.max !== undefined) {
        where.price.lte = options.where.priceRange.max;
      }
    }
    
    if (options?.where?.search) {
      where.OR = [
        { name: { contains: options.where.search, mode: 'insensitive' } },
        { description: { contains: options.where.search, mode: 'insensitive' } },
        { sku: { contains: options.where.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (options?.orderBy) {
      orderBy[options.orderBy.field] = options.orderBy.direction;
    }

    const include: any = {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      inventory: true,
      reviews: {
        where: { isVisible: true },
        select: { rating: true },
      },
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: options?.skip,
        take: options?.take,
        orderBy,
        include,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(product => this.mapToEntityWithDetails(product)),
      total,
    };
  }

  async findFeatured(limit = 10): Promise<ProductWithDetails[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: limit,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        inventory: true,
        reviews: {
          where: { isVisible: true },
          select: { rating: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(product => this.mapToEntityWithDetails(product));
  }

  async findByCategory(categoryId: string, options?: any): Promise<{ products: ProductWithDetails[]; total: number; }> {
    return this.findMany({
      ...options,
      where: {
        categoryId,
        isActive: true,
      },
    });
  }

  async search(query: string, options?: any): Promise<{ products: ProductWithDetails[]; total: number; }> {
    return this.findMany({
      ...options,
      where: {
        search: query,
        categoryId: options?.categoryId,
        isActive: true,
      },
    });
  }

  async updateInventory(productId: string, quantity: number): Promise<void> {
    await this.prisma.inventory.update({
      where: { productId },
      data: { quantity },
    });
  }

  async reserveInventory(productId: string, quantity: number): Promise<boolean> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) return false;

    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    
    if (inventory.trackQuantity && availableQuantity < quantity && !inventory.allowBackorder) {
      return false;
    }

    await this.prisma.inventory.update({
      where: { productId },
      data: {
        reservedQuantity: {
          increment: quantity,
        },
      },
    });

    return true;
  }

  async releaseInventory(productId: string, quantity: number): Promise<void> {
    await this.prisma.inventory.update({
      where: { productId },
      data: {
        reservedQuantity: {
          decrement: quantity,
        },
      },
    });
  }

  private mapToEntity(product: any): Product {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      sku: product.sku,
      price: parseFloat(product.price.toString()),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice.toString()) : undefined,
      costPrice: product.costPrice ? parseFloat(product.costPrice.toString()) : undefined,
      weight: product.weight ? parseFloat(product.weight.toString()) : undefined,
      dimensions: product.dimensions,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      tags: product.tags,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private mapToEntityWithDetails(product: any): ProductWithDetails {
    const baseProduct = this.mapToEntity(product);
    
    const averageRating = product.reviews?.length > 0 
      ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length 
      : undefined;

    return {
      ...baseProduct,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      } : { id: '', name: '', slug: '' },
      images: product.images?.map((image: any) => ({
        id: image.id,
        productId: image.productId,
        url: image.url,
        altText: image.altText,
        sortOrder: image.sortOrder,
        createdAt: image.createdAt,
      })) || [],
      inventory: product.inventory ? {
        quantity: product.inventory.quantity,
        lowStockThreshold: product.inventory.lowStockThreshold,
        trackQuantity: product.inventory.trackQuantity,
        allowBackorder: product.inventory.allowBackorder,
      } : undefined,
      averageRating,
      reviewCount: product.reviews?.length || 0,
    };
  }
} 