'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBagIcon, 
  UserGroupIcon, 
  StarIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline';

interface Stat {
  id: number;
  name: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const stats: Stat[] = [
  {
    id: 1,
    name: "Parceros Felices",
    value: 15000,
    unit: "+",
    icon: UserGroupIcon,
    color: "text-gray-600",
    description: "Clientes satisfechos con su flow urbano"
  },
  {
    id: 2,
    name: "Street Style Vendido",
    value: 75000,
    unit: "+",
    icon: ShoppingBagIcon,
    color: "text-gray-700",
    description: "Productos urbanos entregados exitosamente"
  },
  {
    id: 3,
    name: "Rating Brutal",
    value: 4.8,
    unit: "/5",
    icon: StarIcon,
    color: "text-gray-800",
    description: "Calificación promedio de nuestros parceros"
  },
  {
    id: 4,
    name: "Envío Rapidísimo",
    value: 24,
    unit: "h",
    icon: TruckIcon,
    color: "text-gray-900",
    description: "Tiempo promedio de entrega en Colombia"
  }
];

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export function StatsSection() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            ¿Por Qué UrbanLane?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Únete a miles de parceros que ya confían en nosotros para su flow urbano
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isHovered = hoveredStat === stat.id;
            
            return (
              <div
                key={stat.id}
                className={`
                  relative group bg-white rounded-xl p-6 shadow-lg border border-gray-100
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-2
                  ${isHovered ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                `}
                onMouseEnter={() => setHoveredStat(stat.id)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon */}
                <div className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4
                  ${stat.color} bg-current bg-opacity-10 group-hover:bg-opacity-20
                  transition-all duration-300 group-hover:scale-110
                `}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>

                {/* Main Content */}
                <div className="relative z-10">
                  <div className="flex items-baseline space-x-1 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      <AnimatedCounter value={stat.value} />
                    </span>
                    <span className={`text-lg font-semibold ${stat.color}`}>
                      {stat.unit}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {stat.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className={`
                  absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/5 to-gray-800/5
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `} />

                {/* Floating Dots */}
                <div className="absolute top-4 right-4 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white flex items-center justify-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-white text-xs font-bold">👤</span>
                </div>
              ))}
            </div>
            <span className="text-gray-600 font-medium">
              ¡Únete a la comunidad urbana, parcero!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
} 