'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WhatsAppFloatProps {
  phoneNumber: string; // Número de teléfono en formato internacional (ej: "573001234567")
  message?: string; // Mensaje predefinido
  position?: 'bottom-right' | 'bottom-left';
  showAfterSeconds?: number; // Segundos para mostrar el botón después de cargar la página
}

export function WhatsAppFloat({
  phoneNumber,
  message = "¡Hola! Me interesa conocer más sobre sus productos. ¿Pueden ayudarme?",
  position = 'bottom-right',
  showAfterSeconds = 3
}: WhatsAppFloatProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  useEffect(() => {
    // Mostrar el botón después de un delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showAfterSeconds * 1000);

    return () => clearTimeout(timer);
  }, [showAfterSeconds]);

  useEffect(() => {
    // Auto-expandir una vez después de aparecer
    if (isVisible && !hasBeenSeen) {
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
        setHasBeenSeen(true);
        // Auto-contraer después de 5 segundos
        const contractTimer = setTimeout(() => {
          setIsExpanded(false);
        }, 5000);
        return () => clearTimeout(contractTimer);
      }, 1000);
      return () => clearTimeout(expandTimer);
    }
  }, [isVisible, hasBeenSeen]);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col items-end space-y-3`}>
      {/* Expanded Chat Bubble */}
      {isExpanded && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-xs animate-bounce-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💬</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Atención al Cliente</h4>
                <p className="text-xs text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-ping"></span>
                  En línea ahora
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4 relative">
            <p className="text-sm text-gray-700 leading-relaxed">
              ¡Hola! 👋 <br />
              ¿Necesitas ayuda con algún producto? Estamos aquí para ayudarte.
            </p>
            <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gray-50 transform rotate-45"></div>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 text-sm font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <span>💬</span>
            <span>Chatear por WhatsApp</span>
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Respuesta típica en unos minutos
          </p>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <div className="relative">
        {/* Pulsing Ring Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></div>
        <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-50"></div>
        
        {/* Main Button */}
        <button
          onClick={isExpanded ? handleWhatsAppClick : handleToggleExpanded}
          className="relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/50 flex items-center justify-center group"
          aria-label="Contactar por WhatsApp"
        >
          {/* WhatsApp Icon */}
          <svg
            className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>

          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </button>

        {/* Floating Message Indicator */}
        {!isExpanded && (
          <div className="absolute -top-2 -left-8 bg-white rounded-full px-3 py-1 shadow-lg border border-gray-100 animate-bounce">
            <p className="text-xs font-medium text-gray-700">¡Escríbenos!</p>
            <div className="absolute bottom-0 right-4 w-2 h-2 bg-white transform rotate-45 translate-y-1"></div>
          </div>
        )}
      </div>
    </div>
  );
} 