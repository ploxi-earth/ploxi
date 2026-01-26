// src/app/layout.js
import { CartProvider } from '@/contexts/CartContext'
import ConditionalNavbar from '@/components/layout/ConditionalNavbar'
import './globals.css'
import Script from "next/script";

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
      <head>
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RLR7SYE246"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RLR7SYE246');
          `}
        </Script>
      </head>
      <body>
        <CartProvider>
          <ConditionalNavbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
