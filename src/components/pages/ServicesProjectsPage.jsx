// src/components/pages/ServicesProjectsPage.jsx
'use client'

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Edit3, 
  Plus, 
  Minus, 
  FileText, 
  Shield, 
  Briefcase,
  Package,
  Calculator,
  Send,
  X,
  Check
} from 'lucide-react';
import { useCart, CART_ITEM_TYPES } from '@/contexts/CartContext';

const ServicesProjectsPage = () => {
  const { 
    items, 
    totalItems, 
    totalCost, 
    removeItem, 
    updateItem, 
    clearCart, 
    getItemsByType, 
    getTotalByType 
  } = useCart();

  const [activeTab, setActiveTab] = useState('all');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Category configurations
  const categories = {
    all: { name: 'All Items', icon: ShoppingCart, color: 'text-gray-700' },
    [CART_ITEM_TYPES.REPORTING]: { name: 'Reporting Services', icon: FileText, color: 'text-blue-700' },
    [CART_ITEM_TYPES.COMPLIANCE]: { name: 'Compliance Actions', icon: Shield, color: 'text-green-700' },
    [CART_ITEM_TYPES.PROJECT]: { name: 'Projects', icon: Briefcase, color: 'text-purple-700' },
    [CART_ITEM_TYPES.PRODUCT]: { name: 'Products', icon: Package, color: 'text-orange-700' },
    [CART_ITEM_TYPES.SERVICE]: { name: 'Services', icon: Calculator, color: 'text-indigo-700' }
  };

  // Filter items by active tab
  const filteredItems = activeTab === 'all' ? items : getItemsByType(activeTab);

  // Get type-specific icon
  const getTypeIcon = (type) => {
    const category = categories[type];
    return category ? category.icon : Package;
  };

  // Handle quantity update
  const handleQuantityUpdate = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateItem(itemId, { quantity: newQuantity });
    }
  };

  // Handle item edit
  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  // Save edited item
  const saveEditedItem = (updates) => {
    updateItem(editingItem.id, updates);
    setEditingItem(null);
  };

  // Cart summary by type
  const cartSummary = Object.keys(CART_ITEM_TYPES).map(key => {
    const type = CART_ITEM_TYPES[key];
    const typeItems = getItemsByType(type);
    const typeTotal = getTotalByType(type);
    
    return {
      type,
      name: categories[type].name,
      icon: categories[type].icon,
      color: categories[type].color,
      count: typeItems.length,
      total: typeTotal
    };
  }).filter(summary => summary.count > 0);

  const CartItem = ({ item }) => {
    const TypeIcon = getTypeIcon(item.type);
    
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              categories[item.type]?.color === 'text-blue-700' ? 'bg-blue-100' :
              categories[item.type]?.color === 'text-green-700' ? 'bg-green-100' :
              categories[item.type]?.color === 'text-purple-700' ? 'bg-purple-100' :
              categories[item.type]?.color === 'text-orange-700' ? 'bg-orange-100' :
              'bg-gray-100'
            }`}>
              <TypeIcon className={`w-6 h-6 ${categories[item.type]?.color || 'text-gray-700'}`} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <span className="text-lg font-bold text-green-600">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === CART_ITEM_TYPES.REPORTING ? 'bg-blue-100 text-blue-700' :
                  item.type === CART_ITEM_TYPES.COMPLIANCE ? 'bg-green-100 text-green-700' :
                  item.type === CART_ITEM_TYPES.PROJECT ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {categories[item.type]?.name || item.type}
                </span>
                
                {item.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {item.category}
                  </span>
                )}
                
                {item.priority && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.priority} priority
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Unit Price: ₹{item.price.toLocaleString()}</span>
                <span>Added: {new Date(item.addedAt).toLocaleDateString()}</span>
                {item.deadline && (
                  <span>Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2 ml-4">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
              <button
                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                className="p-1 hover:bg-gray-200 rounded-l-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-200 rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditItem(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit item"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuoteRequestModal = () => {
    const [formData, setFormData] = useState({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      message: '',
      urgency: 'standard'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Simulate quote request
      alert('Quote request submitted successfully! We will contact you within 24 hours.');
      setShowQuoteModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Request Quote</h3>
            <button
              onClick={() => setShowQuoteModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Urgency
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="standard">Standard (2-4 weeks)</option>
                <option value="urgent">Urgent (1-2 weeks)</option>
                <option value="critical">Critical (Within 1 week)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Please describe any specific requirements or deadlines..."
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Quote Request</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-white mb-4">
          Services & Projects Cart
        </h1>
        <p className="text-white-600 max-w-3xl mx-auto">
          Review and manage your selected sustainability services, compliance actions, and projects. 
          Request quotes and coordinate your ESG implementation strategy.
        </p>
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{totalItems} Items in Cart</h2>
              <p className="text-gray-600">Total Value: ₹{totalCost.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear Cart
            </button>
            <button
              onClick={() => setShowQuoteModal(true)}
              disabled={items.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Request Quote</span>
            </button>
          </div>
        </div>

        {/* Cart Summary by Type */}
        {cartSummary.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
            {cartSummary.map((summary) => {
              const Icon = summary.icon;
              return (
                <div key={summary.type} className="text-center">
                  <Icon className={`w-6 h-6 ${summary.color} mx-auto mb-2`} />
                  <div className="text-lg font-bold text-gray-900">{summary.count}</div>
                  <div className="text-sm text-gray-600">{summary.name}</div>
                  <div className="text-sm font-medium text-green-600">₹{summary.total.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon;
            const isActive = activeTab === key;
            const itemCount = key === 'all' ? totalItems : getItemsByType(key).length;
            
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap
                  ${isActive
                    ? 'bg-[#e9f1ea] text-green-700 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
                {itemCount > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${isActive ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}
                  `}>
                    {itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cart Items */}
        <div className="p-6">
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'all' ? 'Your Cart is Empty' : `No ${categories[activeTab].name} in Cart`}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'all' 
                  ? 'Start adding sustainability services, compliance actions, and projects from across the platform.'
                  : `Browse the platform to add ${categories[activeTab].name.toLowerCase()} to your cart.`
                }
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && <QuoteRequestModal />}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Item</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              saveEditedItem({
                name: formData.get('name'),
                quantity: parseInt(formData.get('quantity')),
                priority: formData.get('priority')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    defaultValue={editingItem.quantity}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue={editingItem.priority || 'medium'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesProjectsPage;
