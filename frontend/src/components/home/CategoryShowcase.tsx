export function CategoryShowcase() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find exactly what you're looking for
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category) => (
            <div
              key={category}
              className="relative rounded-lg overflow-hidden group cursor-pointer"
            >
              <div className="loading-skeleton h-32 lg:h-48"></div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity">
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold text-lg">{category}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 