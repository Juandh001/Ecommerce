import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container-custom">
        <div className="relative py-24 sm:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Shop the Latest
                <span className="block text-primary-200">Products</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-primary-100">
                Discover amazing products at unbeatable prices. From electronics to fashion, 
                we have everything you need with fast shipping and excellent customer service.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/products"
                  className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/products?isFeatured=true"
                  className="text-sm font-semibold leading-6 text-white hover:text-primary-200 transition-colors"
                >
                  View Featured <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-16 lg:mt-0">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                  alt="Shopping"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 