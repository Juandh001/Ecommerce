'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  isFeatured: boolean;
  isActive: boolean;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch featured products
        const response = await productsApi.getProducts({ 
          isFeatured: true, 
          isActive: true, 
          limit: 4 
        });
        
        setProducts(response.products || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Error al cargar los productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const getDefaultProductImage = (productName: string): string => {
    // Usar imágenes que coincidan mejor con el tipo de producto urbano
    const name = productName.toLowerCase();
    
    if (name.includes('zapatillas') || name.includes('flow') || name.includes('shoes')) {
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80';
    }
    if (name.includes('camiseta') || name.includes('vibes') || name.includes('shirt')) {
      return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80';
    }
    if (name.includes('gorra') || name.includes('cap') || name.includes('colombia')) {
      return 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop&q=80';
    }
    if (name.includes('mochila') || name.includes('pack') || name.includes('bag')) {
      return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80';
    }
    if (name.includes('urban') || name.includes('street')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80';
    }
    if (name.includes('iphone') || name.includes('phone')) {
      return 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&q=80';
    }
    if (name.includes('samsung') || name.includes('galaxy')) {
      return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&q=80';
    }
    if (name.includes('macbook') || name.includes('laptop')) {
      return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80';
    }
    
    // Fallback para productos generales urbanos
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80';
  };

  const formatPrice = (price: number): string => {
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
            Lo Más Bacano
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Échale un ojo a nuestros productos más chimbas
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
                className="card group hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
                  <Image
                    src={product.images?.[0]?.url || product.images?.[0] || getDefaultProductImage(product.name)}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getDefaultProductImage(product.name);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      ⭐ Destacado
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/products?isFeatured=true"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Ver todos los destacados
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