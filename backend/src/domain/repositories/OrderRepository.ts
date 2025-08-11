import { Order, CreateOrderData, OrderWithDetails, OrderStatus, Payment, PaymentStatus } from '../entities/Order';

export interface CreatePaymentData {
  orderId: string;
  amount: number;
  currency: string;
  method: any;
  status: PaymentStatus;
  psePaymentId?: string;
  pseRedirectUrl?: string;
  pseBankCode?: string;
  stripePaymentId?: string;
  gatewayResponse?: any;
}

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findWithDetails(id: string): Promise<OrderWithDetails | null>;
  create(data: CreateOrderData): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  
  // Métodos para pagos
  createPayment(data: CreatePaymentData): Promise<Payment>;
  findPaymentByPseId(psePaymentId: string): Promise<Payment | null>;
  updatePaymentStatus(paymentId: string, status: PaymentStatus, updateData?: any): Promise<Payment>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  
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