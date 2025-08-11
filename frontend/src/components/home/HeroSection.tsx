'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
  backgroundImage: string;
  backgroundColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Encuentra tu",
    subtitle: "Flow Urbano",
    description: "Descubre el street style más bacano de Colombia. Desde ropa urbana hasta accesorios únicos, tenemos todo lo que necesitas para expresar tu estilo callejero.",
    primaryButton: { text: "Explorar", href: "/products" },
    secondaryButton: { text: "Lo Más Bacano →", href: "/products?isFeatured=true" },
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80",
    backgroundColor: "from-gray-700 to-gray-900"
  },
  {
    id: 2,
    title: "Street Style",
    subtitle: "Colombia",
    description: "Lleva el flow urbano colombiano a otro nivel. Ropa, zapatos y accesorios que hablan tu idioma callejero, parcero.",
    primaryButton: { text: "Ver Ropa", href: "/products?categoryId=clothing" },
    secondaryButton: { text: "Ofertas →", href: "/products" },
    backgroundImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop&q=80",
    backgroundColor: "from-gray-600 to-gray-800"
  },
  {
    id: 3,
    title: "Accesorios",
    subtitle: "Únicos",
    description: "Completa tu look urbano con accesorios que marcan la diferencia. Gorras, cadenas, mochilas y más para tu vibe callejero.",
    primaryButton: { text: "Ver Accesorios", href: "/products?categoryId=accessories" },
    secondaryButton: { text: "Novedades →", href: "/products" },
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80",
    backgroundColor: "from-gray-800 to-black"
  },
  {
    id: 4,
    title: "Ofertas",
    subtitle: "Brutales",
    description: "No te pierdas estas ofertas que están de locos. Descuentos únicos en lo mejor del street style colombiano, hermano.",
    primaryButton: { text: "Ver Ofertas", href: "/products" },
    secondaryButton: { text: "Todo el Flow →", href: "/products" },
    backgroundImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop&q=80",
    backgroundColor: "from-gray-700 to-gray-900"
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background with gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.backgroundColor} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <Image
          src={currentSlideData.backgroundImage}
          alt={currentSlideData.title}
          fill
          className="object-cover transition-opacity duration-1000"
          priority
        />
      </div>

      <div className="relative container-custom">
        <div className="py-24 sm:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl animate-fade-in">
                {currentSlideData.title}
                <span className="block text-white/80 transform transition-transform duration-500">
                  {currentSlideData.subtitle}
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/90 animate-slide-up">
                {currentSlideData.description}
              </p>
              <div className="mt-10 flex items-center gap-x-6 animate-slide-up">
                <Link
                  href={currentSlideData.primaryButton.href}
                  className="rounded-none bg-orange-500 px-8 py-4 text-sm font-black text-white uppercase tracking-widest shadow-lg hover:bg-orange-400 border-2 border-orange-500 hover:border-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50"
                >
                  {currentSlideData.primaryButton.text}
                </Link>
                <Link
                  href={currentSlideData.secondaryButton.href}
                  className="text-sm font-semibold leading-6 text-white hover:text-white/80 transition-colors"
                >
                  {currentSlideData.secondaryButton.text}
                </Link>
              </div>
            </div>

            {/* Interactive Visual Element */}
            <div className="mt-16 lg:mt-0">
              <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl animate-bounce">
                    {currentSlide === 0 && '🛍️'}
                    {currentSlide === 1 && '💻'}
                    {currentSlide === 2 && '👕'}
                    {currentSlide === 3 && '🎉'}
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-4 w-2 h-2 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-500 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
} 