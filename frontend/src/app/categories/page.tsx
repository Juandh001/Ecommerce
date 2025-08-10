import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CategoriesPage() {
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
            {['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive'].map((category) => (
              <div
                key={category}
                className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="loading-skeleton h-32 mb-4 rounded-lg"></div>
                <h3 className="font-semibold text-lg text-gray-900">{category}</h3>
                <p className="text-gray-500 text-sm mt-1">Ver productos</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 