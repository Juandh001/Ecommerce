'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemsCount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, filterStatus, filterPayment]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with real API call
      setTimeout(() => {
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            customerName: 'Juan Pérez',
            customerEmail: 'juan@example.com',
            status: 'DELIVERED',
            subtotal: 299.99,
            tax: 30.00,
            shipping: 15.00,
            total: 344.99,
            itemsCount: 2,
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'COMPLETED',
            shippingAddress: '123 Main St, Ciudad, País',
            createdAt: '2024-01-15T10:30:00Z',
            shippedAt: '2024-01-16T14:00:00Z',
            deliveredAt: '2024-01-18T09:00:00Z',
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            customerName: 'María García',
            customerEmail: 'maria@example.com',
            status: 'PROCESSING',
            subtotal: 159.99,
            tax: 16.00,
            shipping: 10.00,
            total: 185.99,
            itemsCount: 1,
            paymentMethod: 'PAYPAL',
            paymentStatus: 'COMPLETED',
            shippingAddress: '456 Oak Ave, Ciudad, País',
            createdAt: '2024-01-16T15:45:00Z',
          },
          {
            id: '3',
            orderNumber: 'ORD-2024-003',
            customerName: 'Carlos López',
            customerEmail: 'carlos@example.com',
            status: 'PENDING',
            subtotal: 89.99,
            tax: 9.00,
            shipping: 5.00,
            total: 103.99,
            itemsCount: 1,
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'PENDING',
            shippingAddress: '789 Pine St, Ciudad, País',
            createdAt: '2024-01-17T09:15:00Z',
          },
          {
            id: '4',
            orderNumber: 'ORD-2024-004',
            customerName: 'Ana Rodríguez',
            customerEmail: 'ana@example.com',
            status: 'SHIPPED',
            subtotal: 499.99,
            tax: 50.00,
            shipping: 20.00,
            total: 569.99,
            itemsCount: 3,
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'COMPLETED',
            shippingAddress: '321 Elm St, Ciudad, País',
            createdAt: '2024-01-14T11:20:00Z',
            shippedAt: '2024-01-15T16:30:00Z',
          },
          {
            id: '5',
            orderNumber: 'ORD-2024-005',
            customerName: 'Luis Martínez',
            customerEmail: 'luis@example.com',
            status: 'CANCELLED',
            subtotal: 199.99,
            tax: 20.00,
            shipping: 12.00,
            total: 231.99,
            itemsCount: 1,
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'REFUNDED',
            shippingAddress: '654 Maple Dr, Ciudad, País',
            createdAt: '2024-01-13T14:10:00Z',
          },
        ];

        // Apply filters
        let filteredOrders = mockOrders;
        
        if (searchTerm) {
          filteredOrders = filteredOrders.filter(order => 
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (filterStatus) {
          filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
        }
        
        if (filterPayment) {
          filteredOrders = filteredOrders.filter(order => order.paymentStatus === filterPayment);
        }

        setOrders(filteredOrders);
        setTotalPages(Math.ceil(filteredOrders.length / 10));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // TODO: Implement status update API
      console.log('Updating order status:', orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Pendiente' },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, label: 'Confirmado' },
      PROCESSING: { color: 'bg-orange-100 text-orange-800', icon: ClockIcon, label: 'Procesando' },
      SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: TruckIcon, label: 'Enviado' },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Entregado' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Cancelado' },
      REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, label: 'Reembolsado' },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'COMPLETED':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Completado
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Fallido
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Reembolsado
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {paymentStatus}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600">Administra y rastrea todos los pedidos</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Exportar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="PROCESSING">Procesando</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregado</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Estado de pago</option>
              <option value="COMPLETED">Completado</option>
              <option value="PENDING">Pendiente</option>
              <option value="FAILED">Fallido</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
                setFilterPayment('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando pedidos...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.itemsCount} {order.itemsCount === 1 ? 'producto' : 'productos'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(order.status)}
                          {order.status === 'SHIPPED' && (
                            <div className="text-xs text-gray-500">
                              Enviado: {formatDate(order.shippedAt!)}
                            </div>
                          )}
                          {order.status === 'DELIVERED' && (
                            <div className="text-xs text-gray-500">
                              Entregado: {formatDate(order.deliveredAt!)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getPaymentStatusBadge(order.paymentStatus)}
                          <div className="text-xs text-gray-500">
                            {order.paymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Subtotal: ${order.subtotal.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <div className="relative group">
                            <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                              <div className="p-2">
                                <div className="text-xs font-medium text-gray-700 mb-2">Cambiar estado:</div>
                                {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updateOrderStatus(order.id, status as OrderStatus)}
                                    className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                                    disabled={order.status === status}
                                  >
                                    {status === 'CONFIRMED' && 'Confirmar'}
                                    {status === 'PROCESSING' && 'Procesar'}
                                    {status === 'SHIPPED' && 'Enviar'}
                                    {status === 'DELIVERED' && 'Entregar'}
                                    {status === 'CANCELLED' && 'Cancelar'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && orders.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
            <p className="text-gray-500">
              No se encontraron pedidos con los filtros actuales.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 