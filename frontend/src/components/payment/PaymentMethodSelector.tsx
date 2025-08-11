'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/types';
import PSEPayment from './PSEPayment';

interface PaymentMethodSelectorProps {
  orderId: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentMethodSelector({ 
  orderId, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const paymentMethods = [
    {
      id: PaymentMethod.STRIPE,
      name: 'Tarjeta de Crédito/Débito',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      available: true
    },
    {
      id: PaymentMethod.PSE,
      name: 'PSE',
      description: 'Pagos Seguros en Línea - Todos los bancos de Colombia',
      icon: '🏦',
      available: true
    }
  ];

  const handleStripePayment = async () => {
    // Aquí implementarías la lógica de Stripe
    // Por ahora mostraremos un placeholder
    onPaymentError('Stripe no está implementado aún en este demo');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Selecciona tu método de pago</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => method.available && setSelectedMethod(method.id)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {!method.available && (
                    <p className="text-xs text-red-500 mt-1">Próximamente disponible</p>
                  )}
                </div>
                <div className={`
                  w-4 h-4 rounded-full border-2
                  ${selectedMethod === method.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMethod && (
        <div className="border-t pt-6">
          {selectedMethod === PaymentMethod.STRIPE && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">💳</span>
                <h3 className="text-lg font-semibold">Pagar con Tarjeta</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Acepta Visa, Mastercard, American Express y otras tarjetas principales
              </p>

              <button
                onClick={handleStripePayment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Pagar con Tarjeta
              </button>

              <div className="mt-4 text-xs text-gray-500">
                <p>Procesado de forma segura por Stripe</p>
              </div>
            </div>
          )}

          {selectedMethod === PaymentMethod.PSE && (
            <PSEPayment
              orderId={orderId}
              onPaymentSuccess={onPaymentSuccess}
              onPaymentError={onPaymentError}
            />
          )}
        </div>
      )}
    </div>
  );
} 