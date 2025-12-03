// src/app/layout.js
import { CartProvider } from '@/contexts/CartContext'
import ConditionalNavbar from '@/components/layout/ConditionalNavbar'
import './globals.css'

export const metadata = {
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ConditionalNavbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
