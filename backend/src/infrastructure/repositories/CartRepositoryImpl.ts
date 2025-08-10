import { PrismaClient } from '@prisma/client';
import { Cart, CartWithItems, AddToCartData, UpdateCartItemData } from '../../domain/entities/Cart';
import { CartRepository } from '../../domain/repositories/CartRepository';

export class CartRepositoryImpl implements CartRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<CartWithItems | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    return this.mapToCartWithItems(cart);
  }

  async create(userId: string): Promise<Cart> {
    const cart = await this.prisma.cart.create({
      data: { userId },
    });

    return this.mapToCart(cart);
  }

  async addItem(userId: string, data: AddToCartData): Promise<CartWithItems> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: data.productId,
        },
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
        },
      });
    }

    const updatedCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    return this.mapToCartWithItems(updatedCart!);
  }

  async updateItem(userId: string, productId: string, data: UpdateCartItemData): Promise<CartWithItems> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      data: { quantity: data.quantity },
    });

    const updatedCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    return this.mapToCartWithItems(updatedCart!);
  }

  async removeItem(userId: string, productId: string): Promise<CartWithItems> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    await this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const updatedCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    return this.mapToCartWithItems(updatedCart!);
  }

  async clear(userId: string): Promise<void> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }

  async getItemCount(userId: string): Promise<number> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) return 0;

    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  async mergeCart(fromUserId: string, toUserId: string): Promise<CartWithItems> {
    const fromCart = await this.prisma.cart.findUnique({
      where: { userId: fromUserId },
      include: { items: true },
    });

    if (!fromCart) {
      throw new Error('Source cart not found');
    }

    let toCart = await this.prisma.cart.findUnique({
      where: { userId: toUserId },
    });

    if (!toCart) {
      toCart = await this.prisma.cart.create({
        data: { userId: toUserId },
      });
    }

    for (const item of fromCart.items) {
      const existingItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: toCart.id,
            productId: item.productId,
          },
        },
      });

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: toCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: fromCart.id },
    });

    await this.prisma.cart.delete({
      where: { id: fromCart.id },
    });

    const updatedCart = await this.prisma.cart.findUnique({
      where: { id: toCart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    return this.mapToCartWithItems(updatedCart!);
  }

  private mapToCart(cart: any): Cart {
    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  private mapToCartWithItems(cart: any): CartWithItems {
    const items = cart.items.map((item: any) => ({
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : undefined,
        sku: item.product.sku,
        isActive: item.product.isActive,
        images: item.product.images.map((img: any) => ({
          url: img.url,
          altText: img.altText,
        })),
        inventory: item.product.inventory ? {
          quantity: item.product.inventory.quantity,
          trackQuantity: item.product.inventory.trackQuantity,
          allowBackorder: item.product.inventory.allowBackorder,
        } : undefined,
      },
    }));

    const subtotal = items.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0);
    const totalItems = items.reduce((total: number, item: any) => total + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items,
      totalItems,
      subtotal,
    };
  }
} 