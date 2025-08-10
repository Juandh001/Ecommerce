'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductWithDetails } from '@/types';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart, isLoading } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProductBySlug(slug);
        setProduct(data.product);
      } catch (err) {
        setError('Error al cargar el producto');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
      openCart(); // Open cart sidebar to show the added product
    } catch (error) {
      // Error is already handled in the store
      console.error('Failed to add to cart:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container-custom section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="loading-skeleton h-96 rounded-lg"></div>
                <div className="flex space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="loading-skeleton h-20 w-20 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="loading-skeleton h-8 w-3/4"></div>
                <div className="loading-skeleton h-6 w-1/2"></div>
                <div className="loading-skeleton h-10 w-1/3"></div>
                <div className="loading-skeleton h-32 w-full"></div>
                <div className="loading-skeleton h-12 w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
            <p className="text-gray-600 mb-6">{error || 'El producto que buscas no existe.'}</p>
            <a 
              href="/products" 
              className="btn-primary"
            >
              Ver todos los productos
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount(Number(product.price), product.comparePrice ? Number(product.comparePrice) : undefined);
  const isInStock = product.inventory ? product.inventory.quantity > 0 || product.inventory.allowBackorder : true;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><a href="/" className="hover:text-blue-600">Inicio</a></li>
              <li>→</li>
              <li><a href="/products" className="hover:text-blue-600">Productos</a></li>
              <li>→</li>
              <li><a href={`/categories/${product.category.slug}`} className="hover:text-blue-600">{product.category.name}</a></li>
              <li>→</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]?.url || product.images[0].url}
                    alt={product.images[selectedImageIndex]?.altText || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-lg">Sin imagen</span>
                  </div>
                )}
                
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Destacado
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    -{discount}%
                  </div>
                )}
              </div>
              
              {/* Thumbnail images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">SKU: {product.sku}</p>
                
                {/* Rating */}
                {product.averageRating && product.reviewCount && (
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.floor(product.averageRating!) ? 'text-yellow-500' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.averageRating.toFixed(1)} ({product.reviewCount} {product.reviewCount === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(Number(product.price))}
                  </span>
                  {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(Number(product.comparePrice))}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    ¡Ahorra {discount}%! ({formatPrice(Number(product.comparePrice) - Number(product.price))})
                  </p>
                )}
              </div>

              {/* Description */}
              {product.shortDescription && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600">{product.shortDescription}</p>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span className={`h-3 w-3 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                  {isInStock ? 'En stock' : 'Agotado'}
                  {product.inventory && product.inventory.trackQuantity && product.inventory.quantity <= product.inventory.lowStockThreshold && product.inventory.quantity > 0 && (
                    <span className="text-orange-600"> (Pocas unidades)</span>
                  )}
                </span>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                    Cantidad:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isInStock}
                  >
                    {Array.from({ length: Math.min(10, product.inventory?.quantity || 10) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isLoading}
                  className="w-full btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Agregando...' : isInStock ? 'Agregar al carrito' : 'Agotado'}
                </button>
              </div>

              {/* Product Details */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Detalles del producto</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <a href={`/categories/${product.category.slug}`} className="text-blue-600 hover:underline">
                      {product.category.name}
                    </a>
                  </div>
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span>{product.weight} kg</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensiones:</span>
                      <span>{product.dimensions}</span>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <span className="text-gray-600 block mb-2">Etiquetas:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && product.description !== product.shortDescription && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción completa</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 