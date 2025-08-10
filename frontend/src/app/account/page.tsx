import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Mi Cuenta
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <nav className="space-y-2">
                  <a href="#" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                    Información personal
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Mis pedidos
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Direcciones
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Lista de deseos
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Configuración
                  </a>
                </nav>
              </div>
              
              {/* Content */}
              <div className="md:col-span-2">
                <div className="card">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Información Personal
                  </h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="input mt-1"
                          defaultValue="Juan"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Apellido
                        </label>
                        <input
                          type="text"
                          className="input mt-1"
                          defaultValue="Pérez"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        className="input mt-1"
                        defaultValue="juan@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        className="input mt-1"
                        defaultValue="+1234567890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de nacimiento
                      </label>
                      <input
                        type="date"
                        className="input mt-1"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button type="button" className="btn-outline">
                        Cancelar
                      </button>
                      <button type="submit" className="btn-primary">
                        Guardar cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 