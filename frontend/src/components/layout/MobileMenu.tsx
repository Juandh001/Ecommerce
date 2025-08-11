'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { User } from '@/types';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: { name: string; href: string }[];
  isAuthenticated: boolean;
  user: User | null;
  categories: Category[];
  categoriesLoading: boolean;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  navigation, 
  isAuthenticated, 
  user,
  categories,
  categoriesLoading
}: MobileMenuProps) {
  const [isProductsExpanded, setIsProductsExpanded] = useState(false);
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Menu
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <nav className="space-y-1">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            {item.name}
                          </Link>
                        ))}
                        
                        {/* Products Section with Categories */}
                        <div className="space-y-1">
                          <button
                            onClick={() => setIsProductsExpanded(!isProductsExpanded)}
                            className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <span>Products</span>
                            {isProductsExpanded ? (
                              <ChevronDownIcon className="h-5 w-5" />
                            ) : (
                              <ChevronRightIcon className="h-5 w-5" />
                            )}
                          </button>
                          
                          {isProductsExpanded && (
                            <div className="pl-4 space-y-1">
                              <Link
                                href="/products"
                                onClick={onClose}
                                className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              >
                                All Products
                              </Link>
                              
                              <div className="border-t border-gray-200 my-2"></div>
                              
                              <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Categories
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
                                    onClick={onClose}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  >
                                    {category.name}
                                  </Link>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        
                        {!isAuthenticated && (
                          <Link
                            href="/auth/login"
                            onClick={onClose}
                            className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50"
                          >
                            Iniciar Sesión
                          </Link>
                        )}
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 