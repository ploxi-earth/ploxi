// src/contexts/CartContext.jsx
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart item types
export const CART_ITEM_TYPES = {
  REPORTING: 'reporting',
  COMPLIANCE: 'compliance', 
  PROJECT: 'project',
  PRODUCT: 'product',
  SERVICE: 'service'
};

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalCost: 0
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.type === action.payload.type
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, {
          ...action.payload,
          quantity: action.payload.quantity || 1,
          addedAt: new Date().toISOString()
        }];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalCost = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return { items: newItems, totalItems, totalCost };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalCost = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return { items: newItems, totalItems, totalCost };
    }

    case CART_ACTIONS.UPDATE_ITEM: {
      const newItems = state.items.map(item => 
        item.id === action.payload.id 
          ? { ...item, ...action.payload.updates }
          : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalCost = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return { items: newItems, totalItems, totalCost };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return initialState;
    }

    case CART_ACTIONS.LOAD_CART: {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalCost = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return { items: action.payload, totalItems, totalCost };
    }

    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ploxi-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ploxi-cart', JSON.stringify(state.items));
  }, [state.items]);

  // Cart actions
  const addItem = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  const updateItem = (itemId, updates) => {
    dispatch({ type: CART_ACTIONS.UPDATE_ITEM, payload: { id: itemId, updates } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getItemsByType = (type) => {
    return state.items.filter(item => item.type === type);
  };

  const getTotalByType = (type) => {
    return state.items
      .filter(item => item.type === type)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const contextValue = {
    ...state,
    addItem,
    removeItem, 
    updateItem,
    clearCart,
    getItemsByType,
    getTotalByType
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
