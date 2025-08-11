import { OrderRepository } from '../../../domain/repositories/OrderRepository';
import { PSEService } from '../../../infrastructure/services/PSEService';
import { PaymentStatus, OrderStatus } from '../../../domain/entities/Order';

export interface ProcessPSEWebhookInput {
  hash: string;
  operation: string;
  notification_type: string;
}

export interface ProcessPSEWebhookOutput {
  success: boolean;
  message: string;
}

export class ProcessPSEWebhookUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly pseService: PSEService
  ) {}

  async execute(input: ProcessPSEWebhookInput): Promise<ProcessPSEWebhookOutput> {
    try {
      const { hash } = input;

      // Procesar el webhook usando el servicio PSE
      const webhookData = await this.pseService.processWebhook({ hash });

      // Buscar el pago por el hash de PSE
      const payment = await this.orderRepository.findPaymentByPseId(hash);
      if (!payment) {
        throw new Error(`Payment not found for PSE hash: ${hash}`);
      }

      // Mapear estado de PSE a nuestro sistema
      let newPaymentStatus: PaymentStatus;
      let newOrderStatus: OrderStatus | null = null;

      switch (webhookData.status) {
        case 'CO': // Confirmed
          newPaymentStatus = PaymentStatus.COMPLETED;
          newOrderStatus = OrderStatus.CONFIRMED;
          break;
        case 'CA': // Cancelled
          newPaymentStatus = PaymentStatus.FAILED;
          newOrderStatus = OrderStatus.CANCELLED;
          break;
        case 'PE': // Pending
          newPaymentStatus = PaymentStatus.PENDING;
          break;
        default:
          newPaymentStatus = PaymentStatus.FAILED;
          newOrderStatus = OrderStatus.CANCELLED;
      }

      // Actualizar el estado del pago
      await this.orderRepository.updatePaymentStatus(payment.id, newPaymentStatus, {
        gatewayResponse: webhookData
      });

      // Actualizar el estado de la orden si es necesario
      if (newOrderStatus) {
        await this.orderRepository.updateOrderStatus(payment.orderId, newOrderStatus);
      }

      return {
        success: true,
        message: `Payment ${payment.id} updated to ${newPaymentStatus}`
      };

    } catch (error) {
      console.error('Error processing PSE webhook:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 