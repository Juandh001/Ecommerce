'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  lastUpdated: string;
  category: string;
  price: number;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInventory();
  }, [currentPage, searchTerm, filterStock, filterCategory]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with real API call
      setTimeout(() => {
        const mockInventory: InventoryItem[] = [
          {
            id: '1',
            productId: 'prod1',
            productName: 'iPhone 15 Pro',
            productSku: 'IPH15PRO-128',
            productImage: 'https://via.placeholder.com/300x300?text=iPhone',
            quantity: 25,
            reservedQuantity: 3,
            availableQuantity: 22,
            lowStockThreshold: 10,
            trackQuantity: true,
            allowBackorder: false,
            lastUpdated: '2024-01-18T10:30:00Z',
            category: 'Electrónicos',
            price: 999.99,
          },
          {
            id: '2',
            productId: 'prod2',
            productName: 'MacBook Pro 16"',
            productSku: 'MBP16-512',
            productImage: 'https://via.placeholder.com/300x300?text=MacBook',
            quantity: 8,
            reservedQuantity: 1,
            availableQuantity: 7,
            lowStockThreshold: 5,
            trackQuantity: true,
            allowBackorder: false,
            lastUpdated: '2024-01-17T15:20:00Z',
            category: 'Electrónicos',
            price: 2499.99,
          },
          {
            id: '3',
            productId: 'prod3',
            productName: 'Levi\'s 501 Jeans',
            productSku: 'LEVIS-501-32',
            productImage: 'https://via.placeholder.com/300x300?text=Jeans',
            quantity: 0,
            reservedQuantity: 0,
            availableQuantity: 0,
            lowStockThreshold: 15,
            trackQuantity: true,
            allowBackorder: true,
            lastUpdated: '2024-01-16T09:45:00Z',
            category: 'Ropa',
            price: 89.99,
          },
          {
            id: '4',
            productId: 'prod4',
            productName: 'Samsung Galaxy S24',
            productSku: 'SGS24-256',
            productImage: 'https://via.placeholder.com/300x300?text=Galaxy',
            quantity: 3,
            reservedQuantity: 0,
            availableQuantity: 3,
            lowStockThreshold: 8,
            trackQuantity: true,
            allowBackorder: false,
            lastUpdated: '2024-01-18T14:10:00Z',
            category: 'Electrónicos',
            price: 899.99,
          },
          {
            id: '5',
            productId: 'prod5',
            productName: 'Nike Air Max 90',
            productSku: 'NIKE-AM90-10',
            productImage: 'https://via.placeholder.com/300x300?text=Nike',
            quantity: 45,
            reservedQuantity: 2,
            availableQuantity: 43,
            lowStockThreshold: 20,
            trackQuantity: true,
            allowBackorder: false,
            lastUpdated: '2024-01-15T11:30:00Z',
            category: 'Calzado',
            price: 129.99,
          },
        ];

        // Apply filters
        let filteredInventory = mockInventory;
        
        if (searchTerm) {
          filteredInventory = filteredInventory.filter(item => 
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.productSku.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (filterStock === 'low') {
          filteredInventory = filteredInventory.filter(item => 
            item.quantity <= item.lowStockThreshold
          );
        } else if (filterStock === 'out') {
          filteredInventory = filteredInventory.filter(item => item.quantity === 0);
        } else if (filterStock === 'available') {
          filteredInventory = filteredInventory.filter(item => item.quantity > 0);
        }
        
        if (filterCategory) {
          filteredInventory = filteredInventory.filter(item => item.category === filterCategory);
        }

        setInventory(filteredInventory);
        setTotalPages(Math.ceil(filteredInventory.length / 10));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      // TODO: Implement quantity update API
      console.log('Updating quantity:', itemId, newQuantity);
      setEditingItem(null);
      fetchInventory();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
          Agotado
        </span>
      );
    } else if (item.quantity <= item.lowStockThreshold) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
          Bajo stock
        </span>
      );
    } else {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          En stock
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

  const lowStockCount = inventory.filter(item => 
    item.quantity <= item.lowStockThreshold && item.quantity > 0
  ).length;

  const outOfStockCount = inventory.filter(item => item.quantity === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Controla el stock y cantidades de productos</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Exportar inventario
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Actualización masiva
          </button>
        </div>
      </div>

      {/* Stock Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Alertas de inventario
              </h3>
              <div className="text-sm text-yellow-700 mt-1">
                {outOfStockCount > 0 && (
                  <p>{outOfStockCount} productos agotados</p>
                )}
                {lowStockCount > 0 && (
                  <p>{lowStockCount} productos con bajo stock</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Estado de stock</option>
              <option value="available">En stock</option>
              <option value="low">Bajo stock</option>
              <option value="out">Agotado</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              <option value="Electrónicos">Electrónicos</option>
              <option value="Ropa">Ropa</option>
              <option value="Calzado">Calzado</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStock('');
                setFilterCategory('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando inventario...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actualizado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {item.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400 text-xs">Sin imagen</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </div>
                            <div className="text-sm text-gray-500">SKU: {item.productSku}</div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem === item.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, editQuantity)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{item.quantity} unidades</div>
                            {item.reservedQuantity > 0 && (
                              <div className="text-xs text-yellow-600">
                                {item.reservedQuantity} reservadas
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              Umbral: {item.lowStockThreshold}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.availableQuantity} unidades
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStockStatus(item)}
                        {item.allowBackorder && (
                          <div className="text-xs text-blue-600 mt-1">
                            Permite pedidos sin stock
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.lastUpdated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(item.id);
                              setEditQuantity(item.quantity);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Editar cantidad"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/admin/products/${item.productId}/edit`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Editar producto"
                          >
                            Ver producto
                          </Link>
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

        {!loading && inventory.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos en inventario</h3>
            <p className="text-gray-500">
              No se encontraron productos con los filtros actuales.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 