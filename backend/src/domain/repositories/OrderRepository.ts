import { Order, CreateOrderData, OrderWithDetails, OrderStatus } from '../entities/Order';

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findWithDetails(id: string): Promise<OrderWithDetails | null>;
  create(data: CreateOrderData): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  findByUser(userId: string, options?: {
    skip?: number;
    take?: number;
    status?: OrderStatus[];
  }): Promise<{
    orders: OrderWithDetails[];
    total: number;
  }>;
  findMany(options?: {
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
  }>;
  generateOrderNumber(): Promise<string>;
  getOrderStats(options?: {
    dateRange?: {
      from: Date;
      to: Date;
    };
  }): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
  }>;
} 