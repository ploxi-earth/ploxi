// src/app/layout.js
import { CartProvider } from '@/contexts/CartContext'
import ConditionalNavbar from '@/components/layout/ConditionalNavbar' // New component
import './globals.css'

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
  )
}
