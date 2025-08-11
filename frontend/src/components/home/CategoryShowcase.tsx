'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categoriesApi } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoriesApi.getCategories();
        // Show only the first 4 active categories for the showcase
        const activeCategories = response.categories
          .filter((cat: Category) => cat.isActive)
          .slice(0, 4);
        setCategories(activeCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Default images for categories that don't have one
  const getDefaultCategoryImage = (categoryName: string) => {
    const defaultImages = {
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop',
      'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop',
      'Home & Garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      'Books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop',
      'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=300&fit=crop',
    };
    
    return defaultImages[categoryName as keyof typeof defaultImages] || 
           'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&h=300&fit=crop';
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find exactly what you're looking for
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden group cursor-pointer"
              >
                <div className="loading-skeleton h-32 lg:h-48"></div>
                <div className="absolute inset-0 bg-black bg-opacity-40">
                  <div className="absolute bottom-4 left-4">
                    <div className="loading-skeleton h-6 w-24 bg-white bg-opacity-20"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No hay categorías disponibles</p>
            </div>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
                className="relative rounded-lg overflow-hidden group cursor-pointer block"
              >
                <div className="aspect-w-16 aspect-h-9 h-32 lg:h-48">
                  <Image
                    src={category.image || getDefaultCategoryImage(category.name)}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-white text-sm opacity-90 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* View All Products Link */}
        {!loading && categories.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
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