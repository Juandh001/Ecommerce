'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { productsApi, categoriesApi } from '@/lib/api';
import { ProductWithDetails } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products with category filter if present
        const filters: any = {};
        if (categoryId) {
          filters.categoryId = categoryId;
        }
        
        const [productsResponse, categoryResponse] = await Promise.all([
          productsApi.getProducts(filters),
          categoryId ? categoriesApi.getCategories() : Promise.resolve({ categories: [] })
        ]);
        
        setProducts(productsResponse.products);
        
        // Set current category info if filtering
        if (categoryId && categoryResponse.categories) {
          const category = categoryResponse.categories.find((cat: any) => cat.id === categoryId);
          setCurrentCategory(category);
        } else {
          setCurrentCategory(null);
        }
        
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {currentCategory ? `${currentCategory.name}` : 'Todos los Productos'}
            </h1>
            <p className="text-lg text-gray-600">
              {currentCategory 
                ? currentCategory.description || `Productos de la categoría ${currentCategory.name}`
                : 'Descubre nuestra amplia selección de productos'
              }
            </p>
            {currentCategory && (
              <div className="mt-4">
                <Link 
                  href="/products"
                  className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Ver todos los productos
                </Link>
              </div>
            )}
          </div>

          {error && (
            <div className="text-center mb-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="loading-skeleton h-48 mb-4 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="loading-skeleton h-4 w-3/4"></div>
                    <div className="loading-skeleton h-4 w-1/2"></div>
                    <div className="loading-skeleton h-6 w-1/3"></div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              // Real products
              products.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.slug}`}
                  className="card group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Destacado
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(Number(product.price))}
                      </span>
                      {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(Number(product.comparePrice))}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {product.category && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {product.category.name}
                        </span>
                      )}
                      {product.averageRating && (
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {product.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // No products found
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos</p>
              </div>
            )}
          </div>

          {!loading && products.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-600">
                Mostrando {products.length} productos
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 