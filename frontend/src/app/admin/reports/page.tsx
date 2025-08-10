'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  name: string;
  sales: number;
  quantity: number;
  revenue: number;
}

interface TopCustomer {
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with real API calls
      setTimeout(() => {
        // Mock sales data
        const mockSalesData: SalesData[] = [
          { date: '2024-01-12', sales: 2450.50, orders: 8, customers: 6 },
          { date: '2024-01-13', sales: 3120.75, orders: 12, customers: 10 },
          { date: '2024-01-14', sales: 1890.25, orders: 6, customers: 5 },
          { date: '2024-01-15', sales: 4250.00, orders: 15, customers: 12 },
          { date: '2024-01-16', sales: 3680.50, orders: 11, customers: 9 },
          { date: '2024-01-17', sales: 2980.75, orders: 9, customers: 7 },
          { date: '2024-01-18', sales: 3890.25, orders: 13, customers: 11 },
        ];

        const mockTopProducts: TopProduct[] = [
          { name: 'iPhone 15 Pro', sales: 156, quantity: 156, revenue: 155844.00 },
          { name: 'MacBook Pro 16"', sales: 89, quantity: 89, revenue: 222411.00 },
          { name: 'Samsung Galaxy S24', sales: 134, quantity: 134, revenue: 120532.00 },
          { name: 'Nike Air Max 90', sales: 245, quantity: 245, revenue: 31834.55 },
          { name: 'Levi\'s 501 Jeans', sales: 189, quantity: 189, revenue: 16999.11 },
        ];

        const mockTopCustomers: TopCustomer[] = [
          { name: 'Juan Pérez', email: 'juan@example.com', orders: 8, totalSpent: 2450.75 },
          { name: 'María García', email: 'maria@example.com', orders: 6, totalSpent: 1890.50 },
          { name: 'Carlos López', email: 'carlos@example.com', orders: 5, totalSpent: 1650.25 },
          { name: 'Ana Rodríguez', email: 'ana@example.com', orders: 4, totalSpent: 1200.00 },
          { name: 'Luis Martínez', email: 'luis@example.com', orders: 3, totalSpent: 980.75 },
        ];

        const totalRevenue = mockSalesData.reduce((sum, day) => sum + day.sales, 0);
        const totalOrders = mockSalesData.reduce((sum, day) => sum + day.orders, 0);
        const totalCustomers = Math.max(...mockSalesData.map(day => day.customers));

        setSalesData(mockSalesData);
        setTopProducts(mockTopProducts);
        setTopCustomers(mockTopCustomers);
        setSummary({
          totalRevenue,
          totalOrders,
          totalCustomers,
          averageOrderValue: totalRevenue / totalOrders,
          revenueGrowth: 18.5,
          ordersGrowth: 12.3,
          customersGrowth: 8.7,
        });

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-gray-600">Análisis de ventas y rendimiento</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600">Análisis de ventas y rendimiento</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Exportar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(summary.totalRevenue)}
              </p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(summary.revenueGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(summary.revenueGrowth)}`}>
                  {Math.abs(summary.revenueGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos Totales</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalOrders}</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(summary.ordersGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(summary.ordersGrowth)}`}>
                  {Math.abs(summary.ordersGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Únicos</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalCustomers}</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(summary.customersGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(summary.customersGrowth)}`}>
                  {Math.abs(summary.customersGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Promedio</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(summary.averageOrderValue)}
              </p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(5.2)}
                <span className="text-sm font-medium text-green-600 ml-1">5.2%</span>
                <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ventas Diarias</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {salesData.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 w-16">
                      {formatDate(day.date)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(day.sales)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ({day.orders} pedidos)
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(day.sales / Math.max(...salesData.map(d => d.sales))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mejores Clientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gastado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promedio por Pedido
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topCustomers.map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(customer.totalSpent / customer.orders)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 