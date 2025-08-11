'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import { ProductWithDetails } from '@/types';

export function FeaturedProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsApi.getFeaturedProducts();
        setProducts(response.products);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Error al cargar los productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Check out our most popular items
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="loading-skeleton h-48 mb-4"></div>
                <div className="loading-skeleton h-4 w-3/4 mb-2"></div>
                <div className="loading-skeleton h-4 w-1/2"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 btn-primary"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No hay productos destacados disponibles</p>
            </div>
          ) : (
            products.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="card group hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                  )}
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Oferta
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {product.shortDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  
                  {product.inventory && product.inventory.quantity <= 5 && (
                    <p className="text-xs text-orange-600 font-medium">
                      ¡Solo quedan {product.inventory.quantity}!
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="btn-primary inline-flex items-center"
            >
              Ver todos los productos
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
} 