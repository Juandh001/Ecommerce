'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';

export function CartSidebar() {
  const { cart, isOpen, closeCart, updateItem, removeItem, clearCart, getItemCount, getSubtotal } = useCartStore();

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateItem(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
      clearCart();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Carrito de compras
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                        onClick={closeCart}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      {!cart || cart.items.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Tu carrito está vacío
                          </h3>
                          <p className="text-gray-500 mb-6">
                            Agrega algunos productos para comenzar
                          </p>
                          <button
                            onClick={closeCart}
                            className="btn-primary"
                          >
                            Seguir comprando
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cart.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              {/* Product image */}
                              <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                {item.product.images?.[0] ? (
                                  <Image
                                    src={item.product.images[0].url}
                                    alt={item.product.images[0].altText || item.product.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">Sin imagen</span>
                                  </div>
                                )}
                              </div>

                              {/* Product details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  SKU: {item.product.sku}
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  ${item.product.price.toFixed(2)}
                                </p>
                              </div>

                              {/* Quantity controls */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                  className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium text-gray-900 w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                  className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Remove button */}
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="p-1 rounded-md text-gray-400 hover:text-red-600"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cart && cart.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                          <p>Subtotal</p>
                          <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 mb-6">
                          Envío e impuestos calculados al finalizar la compra.
                        </p>
                        <div className="space-y-3">
                          <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="btn-primary w-full text-center"
                          >
                            Finalizar compra
                          </Link>
                          <button
                            onClick={handleClearCart}
                            className="w-full px-4 py-2 border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 rounded-lg transition-colors text-sm font-medium"
                          >
                            Limpiar carrito
                          </button>
                          <button
                            onClick={closeCart}
                            className="btn-outline w-full"
                          >
                            Seguir comprando
                          </button>
                        </div>
                      </div>
                    )}
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