'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/types';

interface PSEBank {
  code: string;
  name: string;
}

interface PSEPaymentProps {
  orderId: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export default function PSEPayment({ orderId, onPaymentSuccess, onPaymentError }: PSEPaymentProps) {
  const [banks, setBanks] = useState<PSEBank[]>([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [customerDocument, setCustomerDocument] = useState('');
  const [documentType, setDocumentType] = useState('CC');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await fetch('/api/pse/banks');
      const result = await response.json();
      
      if (result.success) {
        setBanks(result.data);
      } else {
        onPaymentError('Error al cargar la lista de bancos');
      }
    } catch (error) {
      onPaymentError('Error al cargar la lista de bancos');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBank || !customerDocument || !customerPhone) {
      onPaymentError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pse/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          bankCode: selectedBank,
          customerDocument,
          documentType,
          customerPhone
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirigir al usuario a la página de PSE
        window.location.href = result.data.redirectUrl;
      } else {
        onPaymentError(result.message || 'Error al procesar el pago');
      }
    } catch (error) {
      onPaymentError('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (loadingBanks) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando bancos...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center mb-4">
        <img src="/pse-logo.png" alt="PSE" className="h-8 mr-3" />
        <h3 className="text-lg font-semibold">Pagar con PSE</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Paga de forma segura desde tu banco utilizando PSE (Pagos Seguros en Línea)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona tu banco *
          </label>
          <select
            id="bank"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecciona un banco</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de documento *
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="NIT">NIT</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="PP">Pasaporte</option>
          </select>
        </div>

        <div>
          <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
            Número de documento *
          </label>
          <input
            type="text"
            id="document"
            value={customerDocument}
            onChange={(e) => setCustomerDocument(e.target.value.replace(/\D/g, ''))}
            placeholder="Ingresa tu número de documento"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Número de teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="Ingresa tu número de teléfono"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Procesando...
            </div>
          ) : (
            'Pagar con PSE'
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>* Todos los campos son obligatorios</p>
        <p className="mt-1">
          Al hacer clic en "Pagar con PSE", serás redirigido a tu banco para completar el pago de forma segura.
        </p>
      </div>
    </div>
  );
} 