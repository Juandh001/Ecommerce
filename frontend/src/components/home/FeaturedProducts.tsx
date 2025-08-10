export function FeaturedProducts() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Check out our most popular items
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Placeholder for products */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card">
              <div className="loading-skeleton h-48 mb-4"></div>
              <div className="loading-skeleton h-4 w-3/4 mb-2"></div>
              <div className="loading-skeleton h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 