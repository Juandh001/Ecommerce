import { FastifyRequest, FastifyReply } from 'fastify';
import { GetPSEBanksUseCase } from '../../application/use-cases/payments/GetPSEBanksUseCase';
import { CreatePSEPaymentUseCase } from '../../application/use-cases/payments/CreatePSEPaymentUseCase';
import { ProcessPSEWebhookUseCase } from '../../application/use-cases/payments/ProcessPSEWebhookUseCase';

export class PaymentController {
  constructor(
    private readonly getPSEBanksUseCase: GetPSEBanksUseCase,
    private readonly createPSEPaymentUseCase: CreatePSEPaymentUseCase,
    private readonly processPSEWebhookUseCase: ProcessPSEWebhookUseCase
  ) {}

  async getPSEBanks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.getPSEBanksUseCase.execute();
      
      reply.status(200).send({
        success: true,
        data: result.banks
      });
    } catch (error) {
      reply.status(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createPSEPayment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { orderId, bankCode, customerDocument, documentType, customerPhone } = request.body as {
        orderId: string;
        bankCode: string;
        customerDocument: string;
        documentType: string;
        customerPhone: string;
      };

      const userId = (request as any).user?.id;
      if (!userId) {
        reply.status(401).send({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const result = await this.createPSEPaymentUseCase.execute({
        orderId,
        userId,
        bankCode,
        customerDocument,
        documentType,
        customerPhone
      });

      reply.status(200).send({
        success: true,
        data: result
      });
    } catch (error) {
      reply.status(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async processPSEWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const webhookData = request.body as {
        hash: string;
        operation: string;
        notification_type: string;
      };

      const result = await this.processPSEWebhookUseCase.execute(webhookData);

      reply.status(200).send(result);
    } catch (error) {
      console.error('PSE Webhook error:', error);
      reply.status(500).send({
        success: false,
        message: 'Webhook processing failed'
      });
    }
  }
} 