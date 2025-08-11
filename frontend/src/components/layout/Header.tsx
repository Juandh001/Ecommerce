'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBagIcon,
  Bars3Icon,
  UserIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { categoriesApi } from '@/lib/api';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { isAuthenticated, user } = useAuthStore();
  const { getItemCount, openCart } = useCartStore();
  const router = useRouter();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
  ];

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoriesApi.getCategories();
        const activeCategories = response.categories.filter((cat: Category) => cat.isActive);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle dropdown hover with delay
  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsProductsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 200); // 200ms delay before closing
    setDropdownTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                UrbanLane
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Products Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-colors">
                Productos
                <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isProductsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-2">
                      {/* All Products Link */}
                      <Link
                        href="/products"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsProductsDropdownOpen(false)}
                      >
                        <span className="font-medium">Ver Todo el Flow</span>
                      </Link>
                      
                      {/* Divider */}
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      {/* Categories */}
                      <div className="space-y-1">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Shop by Category
                        </div>
                        
                        {categoriesLoading ? (
                          <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="px-3 py-2">
                                <div className="loading-skeleton h-4 w-32"></div>
                              </div>
                            ))}
                          </div>
                        ) : categories.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No categories available
                          </div>
                        ) : (
                          categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/products?categoryId=${category.id}`}
                              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => setIsProductsDropdownOpen(false)}
                            >
                              <span>{category.name}</span>
                              {category.description && (
                                <span className="ml-auto text-xs text-gray-500 truncate max-w-24">
                                  {category.description}
                                </span>
                              )}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>



          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

            {/* User Menu */}
            {isAuthenticated ? (
              <UserMenu user={user} />
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <UserIcon className="w-6 h-6" />
                <span className="hidden sm:block text-sm font-medium">Iniciar Sesión</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
        isAuthenticated={isAuthenticated}
        user={user}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />
    </header>
  );
} 