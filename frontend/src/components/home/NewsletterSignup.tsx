export function NewsletterSignup() {
  return (
    <section className="section-padding bg-gray-200">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Mantente al Día
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Suscríbete y recibe las ofertas más bacanas del street style colombiano
          </p>
          
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ingresa tu email, parcero"
              className="input flex-1"
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Suscribirme
            </button>
          </form>
          
          <p className="mt-4 text-sm text-gray-500">
            Respetamos tu privacidad. Puedes cancelar cuando quieras, hermano.
          </p>
        </div>
      </div>
    </section>
  );
} 