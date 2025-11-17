// src/components/cart/AddToCartButton.jsx
'use client'

import React, { useState } from 'react';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useCart, CART_ITEM_TYPES } from '@/contexts/CartContext';

const AddToCartButton = ({ 
  item,
  type = CART_ITEM_TYPES.SERVICE,
  variant = 'button', // 'button' | 'icon' | 'minimal'
  className = '',
  onAdd = null
}) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      ...item,
      type,
      id: item.id || `${type}_${Date.now()}_${Math.random()}`,
      addedAt: new Date().toISOString()
    };
    
    addItem(cartItem);
    setIsAdded(true);
    
    // Reset the button state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
    
    // Call optional callback
    if (onAdd) onAdd(cartItem);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${isAdded 
            ? 'bg-green-100 text-green-600' 
            : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
          }
          ${className}
        `}
        title="Add to cart"
      >
        {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleAddToCart}
        className={`
          text-sm font-medium transition-colors duration-200
          ${isAdded 
            ? 'text-green-600' 
            : 'text-blue-600 hover:text-blue-700'
          }
          ${className}
        `}
      >
        {isAdded ? 'Added!' : 'Add to Cart'}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`
        inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isAdded 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-green-600 text-white hover:bg-green-700'
        }
        ${className}
      `}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4" />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
