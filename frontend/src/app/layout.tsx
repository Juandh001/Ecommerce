import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { CartSidebar } from '@/components/cart/CartSidebar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Modern Ecommerce - Shop the Latest Products',
  description: 'Discover amazing products at great prices. Fast shipping, secure checkout, and excellent customer service.',
  keywords: 'ecommerce, shopping, products, online store, electronics, clothing',
  authors: [{ name: 'Modern Ecommerce' }],
  openGraph: {
    title: 'Modern Ecommerce - Shop the Latest Products',
    description: 'Discover amazing products at great prices. Fast shipping and secure checkout.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Ecommerce',
    description: 'Shop the latest products online',
  },
  robots: 'index, follow',
  metadataBase: new URL('https://ecommerce.example.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Providers>
          {children}
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
} 