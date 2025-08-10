import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Mis Pedidos
            </h1>
            
            {/* Empty state */}
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No tienes pedidos aún
              </h2>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Cuando realices tu primera compra, podrás ver y hacer seguimiento de tus pedidos aquí.
              </p>
              
              <a
                href="/products"
                className="btn-primary inline-flex items-center"
              >
                Comenzar a comprar
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            
            {/* Example orders for demonstration */}
            <div className="hidden space-y-6">
              {[1, 2, 3].map((order) => (
                <div key={order} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #ORD-{order.toString().padStart(4, '0')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Realizado el 15 de Enero, 2024
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Entregado
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Producto de ejemplo</h4>
                          <p className="text-sm text-gray-500">Cantidad: 2</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">$299.99</p>
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 