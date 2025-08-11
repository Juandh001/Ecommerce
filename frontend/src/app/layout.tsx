import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WhatsAppFloat } from '@/components/common/WhatsAppFloat';
import { AIChatBot } from '@/components/common/AIChatBot';
import { CartSidebar } from '@/components/cart/CartSidebar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'UrbanLane - Street Style Colombia',
  description: 'El street style más bacano de Colombia. Encuentra tu flow urbano con productos de calidad.',
  keywords: 'street style, urban, colombia, ropa urbana, accesorios, style callejero, bogota',
  authors: [{ name: 'UrbanLane Colombia' }],
  openGraph: {
    title: 'UrbanLane - Street Style Colombia',
    description: 'El street style más bacano de Colombia. Encuentra tu flow urbano.',
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanLane Colombia',
    description: 'El street style más bacano de Colombia',
  },
  robots: 'index, follow',
  metadataBase: new URL('https://urbanlane.com.co'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-gray-100 font-sans antialiased">
        <Providers>
          {children}
          <CartSidebar />
          <WhatsAppFloat 
            phoneNumber="573001234567" // Cambia este número por el tuyo
            message="¡Ey, qué tal! Me interesa conocer más sobre los productos de UrbanLane. ¿Me pueden colaborar con info del street style que manejan?"
            position="bottom-right"
            showAfterSeconds={4}
          />
          <AIChatBot 
            position="bottom-right"
            showAfterSeconds={6}
            botName="UrbanBot"
          />
        </Providers>
      </body>
    </html>
  );
} 