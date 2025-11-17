// src/components/cart/CartBadge.jsx
'use client'

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

const CartBadge = ({ className = '' }) => {
  const { totalItems } = useCart();

  return (
    <Link 
      href="/services"
      className={`
        relative inline-flex items-center p-2 text-gray-600 hover:text-green-600 transition-colors
        ${className}
      `}
    >
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;
