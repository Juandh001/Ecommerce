'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { categoriesApi } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoriesApi.getCategories();
        const activeCategories = response.categories.filter((cat: Category) => cat.isActive);
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
      'Toys': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=300&fit=crop',
      'Automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=300&fit=crop',
    };
    
    return defaultImages[categoryName as keyof typeof defaultImages] || 
           'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&h=300&fit=crop';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Categorías
            </h1>
            <p className="text-lg text-gray-600">
              Explora productos por categorías
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="loading-skeleton h-32 mb-4 rounded-lg"></div>
                  <div className="loading-skeleton h-6 w-3/4 mx-auto mb-2"></div>
                  <div className="loading-skeleton h-4 w-1/2 mx-auto"></div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No hay categorías disponibles</p>
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?categoryId=${category.id}`}
                  className="card text-center hover:shadow-lg transition-shadow cursor-pointer block"
                >
                  <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={category.image || getDefaultCategoryImage(category.name)}
                      alt={category.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {category.description || 'Ver productos'}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 