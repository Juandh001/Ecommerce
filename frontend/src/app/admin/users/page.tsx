'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with real API call
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@ecommerce.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isActive: true,
            emailVerified: true,
            createdAt: '2024-01-01',
            ordersCount: 0,
            totalSpent: 0,
          },
          {
            id: '2',
            email: 'customer@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            role: 'CUSTOMER',
            isActive: true,
            emailVerified: true,
            createdAt: '2024-01-05',
            lastLogin: '2024-01-10',
            ordersCount: 5,
            totalSpent: 1299.95,
          },
          {
            id: '3',
            email: 'jane.smith@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'CUSTOMER',
            isActive: true,
            emailVerified: false,
            createdAt: '2024-01-08',
            ordersCount: 2,
            totalSpent: 459.98,
          },
          {
            id: '4',
            email: 'inactive@example.com',
            firstName: 'Inactive',
            lastName: 'User',
            role: 'CUSTOMER',
            isActive: false,
            emailVerified: true,
            createdAt: '2024-01-03',
            ordersCount: 0,
            totalSpent: 0,
          },
        ];

        // Apply filters
        let filteredUsers = mockUsers;
        
        if (searchTerm) {
          filteredUsers = filteredUsers.filter(user => 
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (filterRole) {
          filteredUsers = filteredUsers.filter(user => user.role === filterRole);
        }
        
        if (filterStatus === 'active') {
          filteredUsers = filteredUsers.filter(user => user.isActive);
        } else if (filterStatus === 'inactive') {
          filteredUsers = filteredUsers.filter(user => !user.isActive);
        }

        setUsers(filteredUsers);
        setTotalPages(Math.ceil(filteredUsers.length / 10));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      // TODO: Implement delete API
      console.log('Deleting user:', userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // TODO: Implement status toggle API
      console.log('Toggling user status:', userId, !currentStatus);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            <ShieldCheckIcon className="h-3 w-3 mr-1" />
            Super Admin
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            <ShieldExclamationIcon className="h-3 w-3 mr-1" />
            Admin
          </span>
        );
      case 'CUSTOMER':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            <UserIcon className="h-3 w-3 mr-1" />
            Cliente
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {role}
          </span>
        );
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Activo
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        Inactivo
      </span>
    );
  };

  const getVerificationBadge = (emailVerified: boolean) => {
    return emailVerified ? (
      <span className="text-green-600 text-sm">✓ Verificado</span>
    ) : (
      <span className="text-yellow-600 text-sm">⚠ Sin verificar</span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra cuentas de usuarios y permisos</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Usuario
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="CUSTOMER">Clientes</option>
              <option value="ADMIN">Administradores</option>
              <option value="SUPER_ADMIN">Super Administradores</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('');
                setFilterStatus('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Gastado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">
                              {getVerificationBadge(user.emailVerified)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.ordersCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${user.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                        {user.lastLogin && (
                          <div className="text-xs text-gray-400">
                            Último: {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`p-1 rounded ${user.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            title={user.isActive ? 'Desactivar' : 'Activar'}
                          >
                            {user.isActive ? '⏸' : '▶'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
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

        {!loading && users.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <UserIcon className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
            <p className="text-gray-500 mb-4">
              No se encontraron usuarios con los filtros actuales.
            </p>
            <Link
              href="/admin/users/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Agregar primer usuario
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 