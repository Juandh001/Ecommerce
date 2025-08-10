'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  userGrowth: number;
  productGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  id: string;
  name: string;
  sold: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    userGrowth: 0,
    productGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API calls
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulated data - replace with real API calls
        setTimeout(() => {
          setStats({
            totalUsers: 1247,
            totalProducts: 342,
            totalOrders: 1893,
            totalRevenue: 45789.50,
            userGrowth: 12.5,
            productGrowth: 8.2,
            orderGrowth: 23.1,
            revenueGrowth: 18.7,
          });

          setRecentOrders([
            {
              id: '1',
              orderNumber: 'ORD-001',
              customerName: 'Juan Pérez',
              total: 299.99,
              status: 'Procesando',
              createdAt: '2024-01-10'
            },
            {
              id: '2',
              orderNumber: 'ORD-002',
              customerName: 'María García',
              total: 159.99,
              status: 'Entregado',
              createdAt: '2024-01-10'
            },
            {
              id: '3',
              orderNumber: 'ORD-003',
              customerName: 'Carlos López',
              total: 89.99,
              status: 'Pendiente',
              createdAt: '2024-01-09'
            }
          ]);

          setTopProducts([
            { id: '1', name: 'iPhone 15 Pro', sold: 156, revenue: 155844.00 },
            { id: '2', name: 'MacBook Pro 16"', sold: 89, revenue: 222411.00 },
            { id: '3', name: 'Samsung Galaxy S24', sold: 134, revenue: 160732.00 }
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Usuarios Totales',
      value: stats.totalUsers.toLocaleString(),
      change: stats.userGrowth,
      icon: UsersIcon,
      color: 'bg-blue-600'
    },
    {
      name: 'Productos',
      value: stats.totalProducts.toLocaleString(),
      change: stats.productGrowth,
      icon: ShoppingBagIcon,
      color: 'bg-green-600'
    },
    {
      name: 'Pedidos',
      value: stats.totalOrders.toLocaleString(),
      change: stats.orderGrowth,
      icon: ShoppingCartIcon,
      color: 'bg-yellow-600'
    },
    {
      name: 'Ingresos',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueGrowth,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'procesando':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.name}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <div className="flex items-center mt-2">
                  {card.change >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(card.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
          </div>
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
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200">
            <a href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-500">
              Ver todos los pedidos →
            </a>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200">
            <a href="/admin/products" className="text-sm text-blue-600 hover:text-blue-500">
              Ver todos los productos →
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center">
                <ShoppingBagIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Agregar Producto</h4>
                  <p className="text-sm text-gray-500">Crear nuevo producto</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/users/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Agregar Usuario</h4>
                  <p className="text-sm text-gray-500">Crear nuevo usuario</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/reports"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Ver Reportes</h4>
                  <p className="text-sm text-gray-500">Análisis y estadísticas</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 