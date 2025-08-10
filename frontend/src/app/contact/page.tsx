import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Contáctanos
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Envíanos un mensaje
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
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Apellido
                      </label>
                      <input
                        type="text"
                        className="input mt-1"
                        placeholder="Tu apellido"
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
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Asunto
                    </label>
                    <input
                      type="text"
                      className="input mt-1"
                      placeholder="¿En qué te podemos ayudar?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mensaje
                    </label>
                    <textarea
                      rows={6}
                      className="input mt-1 resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary w-full">
                    Enviar mensaje
                  </button>
                </form>
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Información de contacto
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Dirección</h3>
                    <p className="text-gray-600">
                      123 Commerce Street<br />
                      Suite 100<br />
                      Ciudad, Estado 12345
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Teléfono</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">contacto@modernstore.com</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Horarios de atención</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                      <p>Sábado: 10:00 AM - 4:00 PM</p>
                      <p>Domingo: Cerrado</p>
                    </div>
                  </div>
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