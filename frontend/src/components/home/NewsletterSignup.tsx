export function NewsletterSignup() {
  return (
    <section className="section-padding bg-gray-100">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Subscribe to our newsletter and get the latest deals and updates
          </p>
          
          <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-1"
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          
          <p className="mt-4 text-sm text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
} 