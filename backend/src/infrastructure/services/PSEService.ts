import axios from 'axios';

export interface PSEBankResponse {
  code: string;
  name: string;
}

export interface PSEPaymentRequest {
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;
  documentType: string;
  bankCode: string;
  merchantPaymentCode: string;
  country: string;
}

export interface PSEPaymentResponse {
  payment: {
    hash: string;
    status: string;
    redirect_url: string;
    merchant_payment_code: string;
    amount_ext: string;
    currency_ext: string;
    payment_type_code: string;
  };
  status: string;
  redirect_url: string;
}

export interface PSEPaymentStatusResponse {
  payment: {
    hash: string;
    status: string;
    merchant_payment_code: string;
    amount_ext: string;
    currency_ext: string;
  };
  status: string;
}

export class PSEService {
  private readonly apiUrl: string;
  private readonly integrationKey: string;

  constructor() {
    this.apiUrl = process.env.PSE_SANDBOX === 'true' 
      ? 'https://sandbox.ebanx.com/ws'
      : 'https://api.ebanx.com/ws';
    this.integrationKey = process.env.PSE_INTEGRATION_KEY || '';
  }

  async getBankList(): Promise<PSEBankResponse[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/getBankList`, {
        params: {
          integration_key: this.integrationKey,
          payment_type: 'achpse',
          country_code: 'co'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting PSE bank list:', error);
      throw new Error('Failed to get PSE bank list');
    }
  }

  async createPayment(paymentData: PSEPaymentRequest): Promise<PSEPaymentResponse> {
    try {
      const requestBody = {
        integration_key: this.integrationKey,
        operation: 'request',
        payment: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          phone_number: paymentData.customerPhone,
          document_type: paymentData.documentType,
          document: paymentData.customerDocument,
          country: paymentData.country,
          payment_type_code: 'achpse',
          bank_code: paymentData.bankCode,
          merchant_payment_code: paymentData.merchantPaymentCode,
          currency_code: paymentData.currency,
          amount_total: paymentData.amount.toString()
        }
      };

      const response = await axios.post(`${this.apiUrl}/direct`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status !== 'SUCCESS') {
        throw new Error(`PSE payment creation failed: ${response.data.status_message || 'Unknown error'}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error creating PSE payment:', error);
      throw new Error('Failed to create PSE payment');
    }
  }

  async getPaymentStatus(hash: string): Promise<PSEPaymentStatusResponse> {
    try {
      const response = await axios.get(`${this.apiUrl}/query`, {
        params: {
          integration_key: this.integrationKey,
          hash: hash
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting PSE payment status:', error);
      throw new Error('Failed to get PSE payment status');
    }
  }

  async processWebhook(requestBody: any): Promise<any> {
    try {
      // Verificar la autenticidad del webhook
      const hash = requestBody.hash;
      
      if (!hash) {
        throw new Error('Invalid webhook: missing hash');
      }

      // Obtener el estado actualizado del pago
      const paymentStatus = await this.getPaymentStatus(hash);
      
      return {
        hash: hash,
        status: paymentStatus.payment.status,
        merchantPaymentCode: paymentStatus.payment.merchant_payment_code,
        amount: paymentStatus.payment.amount_ext,
        currency: paymentStatus.payment.currency_ext
      };
    } catch (error) {
      console.error('Error processing PSE webhook:', error);
      throw new Error('Failed to process PSE webhook');
    }
  }
} 