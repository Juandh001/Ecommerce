import { OrderRepository } from '../../../domain/repositories/OrderRepository';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { PSEService, PSEPaymentRequest } from '../../../infrastructure/services/PSEService';
import { PaymentMethod, PaymentStatus } from '../../../domain/entities/Order';

export interface CreatePSEPaymentInput {
  orderId: string;
  userId: string;
  bankCode: string;
  customerDocument: string;
  documentType: string;
  customerPhone: string;
}

export interface CreatePSEPaymentOutput {
  paymentId: string;
  redirectUrl: string;
  pseHash: string;
}

export class CreatePSEPaymentUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly pseService: PSEService
  ) {}

  async execute(input: CreatePSEPaymentInput): Promise<CreatePSEPaymentOutput> {
    const { orderId, userId, bankCode, customerDocument, documentType, customerPhone } = input;

    // Obtener la orden
    const order = await this.orderRepository.findWithDetails(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Order does not belong to user');
    }

    // Obtener información del usuario
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Convertir amount a pesos colombianos si está en USD
    let amount = order.total;
    let currency = 'COP';
    
    if (order.currency === 'USD') {
      // Conversión aproximada USD a COP (deberías usar una API de cambio real)
      amount = order.total * 4000; // 1 USD = 4000 COP aproximadamente
    }

    // Preparar datos para PSE
    const psePaymentData: PSEPaymentRequest = {
      amount: amount,
      currency: currency,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      customerPhone: customerPhone,
      customerDocument: customerDocument,
      documentType: documentType,
      bankCode: bankCode,
      merchantPaymentCode: order.orderNumber,
      country: 'co'
    };

    // Crear pago en PSE
    const pseResponse = await this.pseService.createPayment(psePaymentData);

    // Crear registro de pago en la base de datos
    const paymentData = {
      orderId: orderId,
      amount: amount,
      currency: currency,
      method: PaymentMethod.PSE,
      status: PaymentStatus.PENDING,
      psePaymentId: pseResponse.payment.hash,
      pseRedirectUrl: pseResponse.redirect_url,
      pseBankCode: bankCode,
      gatewayResponse: pseResponse
    };

    const payment = await this.orderRepository.createPayment(paymentData);

    return {
      paymentId: payment.id,
      redirectUrl: pseResponse.redirect_url,
      pseHash: pseResponse.payment.hash
    };
  }
} 