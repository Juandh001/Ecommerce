import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Todos los Productos
            </h1>
            <p className="text-lg text-gray-600">
              Descubre nuestra amplia selección de productos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder products */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="loading-skeleton h-48 mb-4 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="loading-skeleton h-4 w-3/4"></div>
                  <div className="loading-skeleton h-4 w-1/2"></div>
                  <div className="loading-skeleton h-6 w-1/3"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500">
              Los productos se cargarán cuando el backend esté completamente configurado.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 