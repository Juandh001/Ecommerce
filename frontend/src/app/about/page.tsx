import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Acerca de ModernStore
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Bienvenido a ModernStore, tu destino de compras en línea para productos de alta calidad 
                a precios increíbles. Nos especializamos en ofrecer una experiencia de compra moderna 
                y segura.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 mb-6">
                Hacer que las compras en línea sean fáciles, seguras y accesibles para todos. 
                Ofrecemos productos de calidad con envío rápido y excelente servicio al cliente.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Productos de alta calidad garantizada</li>
                <li>Envío gratuito en pedidos superiores a $100</li>
                <li>Devoluciones fáciles y rápidas</li>
                <li>Atención al cliente 24/7</li>
                <li>Pagos seguros y protegidos</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 