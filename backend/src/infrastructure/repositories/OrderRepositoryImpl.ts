import { PrismaClient } from '@prisma/client';
import { OrderRepository, CreatePaymentData } from '../../domain/repositories/OrderRepository';
import { 
  Order, 
  CreateOrderData, 
  OrderWithDetails, 
  OrderStatus, 
  Payment, 
  PaymentStatus,
  PaymentMethod 
} from '../../domain/entities/Order';

export class OrderRepositoryImpl implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    return order ? this.mapToEntity(order) : null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
    });

    return order ? this.mapToEntity(order) : null;
  }

  async findWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1
                }
              }
            }
          }
        },
        payments: true,
        user: true,
        address: true,
      },
    });

    return order ? this.mapToEntityWithDetails(order) : null;
  }

  async create(data: CreateOrderData): Promise<Order> {
    const orderNumber = await this.generateOrderNumber();
    const total = data.subtotal + data.tax + data.shipping - data.discount;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        addressId: data.addressId,
        subtotal: data.subtotal,
        tax: data.tax,
        shipping: data.shipping,
        discount: data.discount,
        total,
        currency: data.currency,
        notes: data.notes,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
    });

    return this.mapToEntity(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
    });

    return this.mapToEntity(order);
  }

  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        method: data.method,
        status: data.status,
        psePaymentId: data.psePaymentId,
        pseRedirectUrl: data.pseRedirectUrl,
        pseBankCode: data.pseBankCode,
        stripePaymentId: data.stripePaymentId,
        gatewayResponse: data.gatewayResponse,
      },
    });

    return this.mapToPaymentEntity(payment);
  }

  async findPaymentByPseId(psePaymentId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { psePaymentId },
    });

    return payment ? this.mapToPaymentEntity(payment) : null;
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus, updateData?: any): Promise<Payment> {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        ...(updateData?.gatewayResponse && { gatewayResponse: updateData.gatewayResponse }),
      },
    });

    return this.mapToPaymentEntity(payment);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return this.mapToEntity(order);
  }

  async findByUser(userId: string, options?: {
    skip?: number;
    take?: number;
    status?: OrderStatus[];
  }): Promise<{
    orders: OrderWithDetails[];
    total: number;
  }> {
    const where: any = { userId };

    if (options?.status) {
      where.status = { in: options.status };
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: options?.skip,
        take: options?.take,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { sortOrder: 'asc' },
                    take: 1
                  }
                }
              }
            }
          },
          payments: true,
          user: true,
          address: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => this.mapToEntityWithDetails(order)),
      total,
    };
  }

  async findMany(options?: {
    skip?: number;
    take?: number;
    where?: {
      status?: OrderStatus[];
      userId?: string;
      dateRange?: {
        from: Date;
        to: Date;
      };
    };
    orderBy?: {
      field: string;
      direction: 'asc' | 'desc';
    };
  }): Promise<{
    orders: OrderWithDetails[];
    total: number;
  }> {
    const where: any = {};

    if (options?.where?.status) {
      where.status = { in: options.where.status };
    }

    if (options?.where?.userId) {
      where.userId = options.where.userId;
    }

    if (options?.where?.dateRange) {
      where.createdAt = {
        gte: options.where.dateRange.from,
        lte: options.where.dateRange.to,
      };
    }

    const orderBy: any = {};
    if (options?.orderBy) {
      orderBy[options.orderBy.field] = options.orderBy.direction;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: options?.skip,
        take: options?.take,
        orderBy,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { sortOrder: 'asc' },
                    take: 1
                  }
                }
              }
            }
          },
          payments: true,
          user: true,
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => this.mapToEntityWithDetails(order)),
      total,
    };
  }

  async generateOrderNumber(): Promise<string> {
    const count = await this.prisma.order.count();
    const timestamp = Date.now().toString().slice(-6);
    return `ORD-${timestamp}-${(count + 1).toString().padStart(4, '0')}`;
  }

  async getOrderStats(options?: {
    dateRange?: {
      from: Date;
      to: Date;
    };
  }): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
  }> {
    const where: any = {};

    if (options?.dateRange) {
      where.createdAt = {
        gte: options.dateRange.from,
        lte: options.dateRange.to,
      };
    }

    const [totalOrders, orders, ordersByStatus] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        select: { total: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = ordersByStatus.reduce((acc, item) => {
      acc[item.status as OrderStatus] = item._count.status;
      return acc;
    }, {} as Record<OrderStatus, number>);

    // Ensure all statuses are included
    Object.values(OrderStatus).forEach(status => {
      if (!(status in statusCounts)) {
        statusCounts[status] = 0;
      }
    });

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus: statusCounts,
    };
  }

  private mapToEntity(order: any): Order {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      addressId: order.addressId,
      status: order.status,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
      discount: Number(order.discount),
      total: Number(order.total),
      currency: order.currency,
      notes: order.notes,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private mapToEntityWithDetails(order: any): OrderWithDetails {
    return {
      ...this.mapToEntity(order),
      items: order.items?.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
        createdAt: item.createdAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          slug: item.product.slug,
          sku: item.product.sku,
          image: item.product.images?.[0]?.url || null,
        },
      })) || [],
      payments: order.payments?.map((payment: any) => this.mapToPaymentEntity(payment)) || [],
      user: order.user ? {
        id: order.user.id,
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
      } : undefined,
      address: order.address ? {
        id: order.address.id,
        title: order.address.title,
        firstName: order.address.firstName,
        lastName: order.address.lastName,
        company: order.address.company,
        addressLine1: order.address.addressLine1,
        addressLine2: order.address.addressLine2,
        city: order.address.city,
        state: order.address.state,
        zipCode: order.address.zipCode,
        country: order.address.country,
        phone: order.address.phone,
      } : undefined,
    };
  }

  private mapToPaymentEntity(payment: any): Payment {
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: Number(payment.amount),
      currency: payment.currency,
      method: payment.method as PaymentMethod,
      status: payment.status as PaymentStatus,
      transactionId: payment.transactionId,
      stripePaymentId: payment.stripePaymentId,
      psePaymentId: payment.psePaymentId,
      pseRedirectUrl: payment.pseRedirectUrl,
      pseBankCode: payment.pseBankCode,
      gatewayResponse: payment.gatewayResponse,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
} 