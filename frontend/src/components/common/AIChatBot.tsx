'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
}

interface AIChatBotProps {
  position?: 'bottom-right' | 'bottom-left';
  showAfterSeconds?: number;
  botName?: string;
}

// Respuestas predefinidas del bot
const botResponses: Record<string, string[]> = {
  greeting: [
    "¡Qué tal, parce! 👋 Soy tu asistente virtual de UrbanLane. ¿En qué te puedo colaborar?",
    "¡Bienvenido al street style! 🤖 Estoy aquí para ayudarte con lo que necesites, hermano.",
    "¡Ey, qué más! ✨ Soy tu guía en UrbanLane. ¿Qué bacano estás buscando hoy?"
  ],
  products: [
    "Tenemos una selección brutal de productos urbanos, parce. ¿Te tinca ropa street, accesorios o qué chimba buscas? 👕🎒",
    "¡Qué buena pregunta, bro! Manejamos puro street style de calidad. ¿Hay algo específico que tengas en mente? 🛍️",
    "Nuestro catálogo está lleno de cosas bacanas del urban style. ¿Te ayudo a encontrar algo chevere? ⭐",
    "¡Perfecto! Puedes explorar las categorías desde arriba, o dime qué rollo buscas y te colaboro 🔍"
  ],
  featured: [
    "¡Los productos destacados están en el home, hermano! Son lo más bacano del mes con descuentos brutales ⭐✨",
    "Te recomiendo que le eches un ojo a lo destacado, están con ofertas que están de locos 🔥",
    "Los productos destacados los cambiamos cada semana. ¡No te quedes sin las ofertas, parcero! 💫"
  ],
  help: [
    "Estoy aquí para colaborarte con info sobre productos, precios, envíos y todo el rollo. ¿Qué necesitas saber, parce? 🤝",
    "¡Claro que sí! Te ayudo con consultas sobre productos, pedidos, o cualquier cosa que tengas. ¿En qué te echo la mano? 💡",
    "Mi misión es que tengas la mejor experiencia comprando en UrbanLane. ¿Hay algo específico en lo que te pueda colaborar? 🎯"
  ],
  price: [
    "Nuestros precios están brutales y siempre tenemos promos bacanas. ¿Qué producto te tiene loco? 💰",
    "¡Tenemos ofertas que están de película! Los precios varían por producto. ¿Hay algo específico que quieras consultar, bro? 🏷️"
  ],
  shipping: [
    "Manejamos envío rapidísimo en 24-48 horas. ¡Y envío gratis si compras más de $150.000! 🚚✨",
    "El domicilio llega súper rápido, generalmente en 1-2 días hábiles por Bogotá y principales ciudades. ¿Quieres más detalles? 📦"
  ],
  default: [
    "Esa pregunta está cool, parce. ¿Podrías ser más específico para poder ayudarte mejor? 🤔",
    "No estoy pillando del todo, bro. ¿Puedes reformular la pregunta de otra forma? 💭",
    "Interesante rollo. ¿Hay algo más específico que quieras saber del street style o productos? 🔍",
    "¡Gracias por la pregunta! Para dartela clara, ¿me das más detalles, hermano? 📝"
  ]
};

export function AIChatBot({
  position = 'bottom-left',
  showAfterSeconds = 5,
  botName = "ShopBot"
}: AIChatBotProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sugerencias rápidas
  const quickActions = [
    { text: "Ver lo más bacano", emoji: "⭐" },
    { text: "¿Cuánto sale?", emoji: "💰" },
    { text: "Info de domicilio", emoji: "🚚" },
    { text: "Échame una mano", emoji: "🆘" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showAfterSeconds * 1000);

    return () => clearTimeout(timer);
  }, [showAfterSeconds]);

  useEffect(() => {
    if (isExpanded && !hasGreeted) {
      setTimeout(() => {
        addBotMessage(getRandomResponse('greeting'));
        setHasGreeted(true);
        // Mostrar acciones rápidas después del saludo
        setTimeout(() => {
          setShowQuickActions(true);
        }, 2000);
      }, 800);
    }
  }, [isExpanded, hasGreeted]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRandomResponse = (category: string): string => {
    const responses = botResponses[category] || botResponses.default;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const categorizeMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'greeting';
    }
    if (lowerMessage.includes('destacado') || lowerMessage.includes('featured') || lowerMessage.includes('mejor')) {
      return 'featured';
    }
    if (lowerMessage.includes('producto') || lowerMessage.includes('product') || lowerMessage.includes('comprar')) {
      return 'products';
    }
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('ayúdame')) {
      return 'help';
    }
    if (lowerMessage.includes('precio') || lowerMessage.includes('price') || lowerMessage.includes('costo')) {
      return 'price';
    }
    if (lowerMessage.includes('envío') || lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      return 'shipping';
    }
    
    return 'default';
  };

  const addBotMessage = (text: string, delay = 1500) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        text,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendUserMessage(inputValue);
  };

  const sendUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const category = categorizeMessage(text);
    const botResponse = getRandomResponse(category);
    
    setInputValue('');
    setShowQuickActions(false); // Ocultar acciones rápidas después de enviar mensaje
    addBotMessage(botResponse);
  };

  const handleQuickAction = (actionText: string) => {
    sendUserMessage(actionText);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-32 right-6', // Más separación del WhatsApp
    'bottom-left': 'bottom-32 left-6'    // Más separación del WhatsApp si estuviera a la izquierda
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-40 flex flex-col items-start space-y-3`}>
      {/* Expanded Chat Window */}
      {isExpanded && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col animate-bounce-in">
          {/* Header */}
                     <div className="bg-gray-800 text-white p-4 rounded-t-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
                             <div>
                 <h4 className="font-semibold text-sm text-white">{botName} AI</h4>
                 <p className="text-xs text-white/90 flex items-center">
                   <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-ping"></span>
                   Asistente Virtual
                 </p>
               </div>
            </div>
                         <button
               onClick={() => setIsExpanded(false)}
               className="text-white hover:text-white/90 transition-colors p-1 hover:bg-white/20 rounded-md"
             >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                                 <div className={`
                   max-w-xs p-3 rounded-lg shadow-sm
                   ${message.isBot 
                     ? 'bg-slate-100 text-gray-900 rounded-bl-none border border-gray-300' 
                     : 'bg-gray-700 text-white rounded-br-none shadow-md'
                   }
                 `}>
                                     <p className={`text-sm leading-relaxed ${!message.isBot ? 'font-medium text-white' : 'font-normal text-gray-900'}`}>
                     {message.text}
                   </p>
                                     <p className={`text-xs mt-1 ${message.isBot ? 'opacity-60 text-gray-900' : 'opacity-80 text-white'}`}>
                     {message.timestamp.toLocaleTimeString('es-ES', { 
                       hour: '2-digit', 
                       minute: '2-digit' 
                     })}
                   </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
                             <div className="flex justify-start">
                 <div className="bg-slate-100 text-gray-900 p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-300">
                  <div className="flex space-x-1">
                                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {/* Quick Actions */}
            {showQuickActions && messages.length > 0 && (
              <div className="px-2 pb-2">
                <p className="text-xs text-gray-500 mb-2 px-2">Sugerencias:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 flex items-center space-x-1 border border-gray-200"
                    >
                      <span>{action.emoji}</span>
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                                 className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
                disabled={isTyping}
              />
                             <button
                 type="submit"
                 disabled={!inputValue.trim() || isTyping}
                 className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-sm"
               >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main AI Bot Button */}
      <div className="relative">
        {/* Pulsing Ring Animation */}
                 <div className="absolute inset-0 rounded-full bg-gray-500 animate-ping opacity-30"></div>
         <div className="absolute inset-0 rounded-full bg-gray-400 animate-pulse opacity-50"></div>
        
        {/* Main Button */}
        <button
          onClick={handleToggleExpanded}
                     className="relative w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-gray-500/50 flex items-center justify-center group"
          aria-label="Abrir chat con IA"
        >
          {/* AI Robot Icon */}
          <div className="text-white group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5L14 2H10L9 3.5L3 7V9H21ZM15 9H9C8.45 9 8 9.45 8 10V11H16V10C16 9.45 15.55 9 15 9ZM7 12V22H17V12H7ZM9 14H15V20H9V14ZM11 16H13V18H11V16Z"/>
            </svg>
          </div>

          {/* AI Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <SparklesIcon className="w-3 h-3 text-white" />
          </div>
        </button>

        {/* Floating Message Indicator */}
        {!isExpanded && (
          <div className="absolute -top-2 -right-8 bg-white rounded-full px-3 py-1 shadow-lg border border-gray-100 animate-bounce">
                         <p className="text-xs font-medium text-gray-700 flex items-center">
               <SparklesIcon className="w-3 h-3 mr-1 text-gray-600" />
               ¡Pregúntame!
             </p>
            <div className="absolute bottom-0 left-4 w-2 h-2 bg-white transform rotate-45 translate-y-1"></div>
          </div>
        )}
      </div>
    </div>
  );
} 