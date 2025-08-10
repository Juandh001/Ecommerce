'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ShoppingCartIcon,
  CubeIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Productos', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Usuarios', href: '/admin/users', icon: UsersIcon },
  { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Inventario', href: '/admin/inventory', icon: CubeIcon },
  { name: 'Reportes', href: '/admin/reports', icon: ChartBarIcon },
  { name: 'Configuración', href: '/admin/settings', icon: CogIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if still loading
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router, isLoading]);

  // Show loading while initializing or if user data is not loaded yet
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check role after user is loaded
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    router.push('/');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User info and logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 