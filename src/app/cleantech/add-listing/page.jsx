'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Upload, 
  X, 
  Eye,
  CheckCircle,
  FileText,
  Building2,
  Mail,
  Globe,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Award,
  ArrowLeft,
  ArrowRight,
  FileSignature,
  AlertCircle,
  Package,
  Phone,
  MapPin,
  Star
} from 'lucide-react';

export default function AddListingPage() {
  const router = useRouter();
  const [step, setStep] = useState('form'); // form, preview, agreement, success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Load registration data from previous step
  useEffect(() => {
    const data = sessionStorage.getItem('cleantech-registration');
    if (data) {
      try {
        setRegistrationData(JSON.parse(data));
      } catch (error) {
        console.error('Failed to load registration data');
      }
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    // Service/Product Details
    companyName: '',
    serviceName: '',
    category: '',
    subcategories: [],
    shortDescription: '',
    detailedDescription: '',
    keyFeatures: ['', '', ''],
    uniqueSellingPoints: '',
    
    // Pricing
    pricingModel: '',
    priceRange: '',
    currency: 'INR',
    
    // Company Details
    contactEmail: '',
    contactPhone: '',
    website: '',
    location: '',
    yearFounded: '',
    teamSize: '',
    
    // File uploads (storing file info for mock)
    logo: null,
    productImages: [],
    certificates: [],
    documents: [],
  });

  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Categories
  const CATEGORIES = [
    'Energy Management',
    'Water Treatment',
    'Waste Solutions',
    'Analytics & Monitoring',
    'Green Buildings',
    'Renewable Energy',
    'Carbon Capture',
    'EV Charging',
    'Circular Economy'
  ];

  const SUBCATEGORIES = {
    'Energy Management': ['Solar', 'Energy Storage', 'Smart Grid', 'Energy Audit'],
    'Water Treatment': ['Wastewater', 'Water Recycling', 'Purification', 'Monitoring'],
    'Waste Solutions': ['Recycling', 'Waste-to-Energy', 'Composting', 'E-waste'],
    'Analytics & Monitoring': ['IoT Sensors', 'Data Analytics', 'AI/ML', 'Reporting'],
    'Renewable Energy': ['Solar', 'Wind', 'Hydro', 'Biomass'],
  };

  const PRICING_MODELS = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'subscription', label: 'Subscription/Recurring' },
    { value: 'custom', label: 'Custom Quote' },
    { value: 'contact', label: 'Contact for Pricing' }
  ];

  const TEAM_SIZES = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  // Handle file uploads (mock)
  const handleFileUpload = (field, files, multiple = false) => {
    if (multiple) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file
      }));
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...newFiles]
      }));
    } else {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [field]: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          file: file
        }
      }));
    }
  };

  // Remove file
  const removeFile = (field, index = null) => {
    if (index !== null) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: null }));
    }
  };

  // Update key features
  const updateFeature = (index, value) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
  };

  // Add feature field
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, '']
    }));
  };

  // Remove feature field
  const removeFeature = (index) => {
    if (formData.keyFeatures.length > 3) {
      const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.serviceName.trim()) newErrors.serviceName = 'Service/Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.detailedDescription.trim()) newErrors.detailedDescription = 'Detailed description is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Valid email is required';
    }
    if (!formData.pricingModel) newErrors.pricingModel = 'Pricing model is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = () => {
    if (validateForm()) {
      setStep('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sign agreement
  const handleSignAgreement = () => {
    setIsSubmitting(true);
    
    // Simulate agreement signing and listing creation
    setTimeout(() => {
      // Prepare vendor data
      const vendorListing = {
        id: `vendor_${Date.now()}`,
        ...formData,
        registrationData,
        status: 'active',
        rating: 0,
        reviewCount: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        agreementSigned: true,
        agreementDate: new Date().toISOString()
      };

      // Store in session (ready for backend integration)
      const existingVendors = JSON.parse(sessionStorage.getItem('cleantech-vendors') || '[]');
      existingVendors.push(vendorListing);
      sessionStorage.setItem('cleantech-vendors', JSON.stringify(existingVendors));
      
      // Also prepare for API call structure
      console.log('Ready for API submission:', {
        endpoint: '/api/cleantech/vendors',
        method: 'POST',
        data: vendorListing
      });
      
      setIsSubmitting(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                alt="Ploxi"
                width={40}
                height={40}
                className="h-10 w-10 object-contain rounded-lg"
                priority
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ploxi Clean Tech</h1>
                <p className="text-xs text-gray-600">Create Vendor Listing</p>
              </div>
            </div>
            {step === 'form' && (
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* FORM STEP */}
        {step === 'form' && (
          <div className="space-y-8">
            {/* Context Banner */}
            {registrationData && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Registration Data Loaded</h3>
                    <p className="text-sm text-gray-700">
                      We&apos;ve pre-loaded your information. Complete the listing details below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Service Details Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Tag className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Service & Product Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="md:col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, companyName: e.target.value }));
                      if (errors.companyName) setErrors(prev => ({ ...prev, companyName: null }));
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.companyName ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Your company name"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                {/* Service Name */}
                <div className="md:col-span-2">
                  <label htmlFor="serviceName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Service/Product Name *
                  </label>
                  <input
                    id="serviceName"
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, serviceName: e.target.value }));
                      if (errors.serviceName) setErrors(prev => ({ ...prev, serviceName: null }));
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.serviceName ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="e.g., Solar Panel Installation Service"
                  />
                  {errors.serviceName && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceName}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                    Primary Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, category: e.target.value, subcategories: [] }));
                      if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Subcategories */}
                {formData.category && SUBCATEGORIES[formData.category] && (
                  <div>
                    <label htmlFor="subcategories" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subcategories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUBCATEGORIES[formData.category].map(sub => (
                        <label
                          key={sub}
                          className={`px-3 py-2 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                            formData.subcategories.includes(sub)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.subcategories.includes(sub)}
                            onChange={(e) => {
                              const newSubs = e.target.checked
                                ? [...formData.subcategories, sub]
                                : formData.subcategories.filter(s => s !== sub);
                              setFormData(prev => ({ ...prev, subcategories: newSubs }));
                            }}
                            className="sr-only"
                          />
                          {sub}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short Description */}
                <div className="md:col-span-2">
                  <label htmlFor="shortDescription" className="block text-sm font-semibold text-gray-900 mb-2">
                    Short Description * <span className="text-gray-500 font-normal">(max 150 characters)</span>
                  </label>
                  <textarea
                    id="shortDescription"
                    rows={2}
                    maxLength={150}
                    value={formData.shortDescription}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, shortDescription: e.target.value }));
                      if (errors.shortDescription) setErrors(prev => ({ ...prev, shortDescription: null }));
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.shortDescription ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Brief one-line description"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.shortDescription && (
                      <p className="text-sm text-red-600">{errors.shortDescription}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">{formData.shortDescription.length}/150</p>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="md:col-span-2">
                  <label htmlFor="detailedDescription" className="block text-sm font-semibold text-gray-900 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="detailedDescription"
                    rows={6}
                    value={formData.detailedDescription}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, detailedDescription: e.target.value }));
                      if (errors.detailedDescription) setErrors(prev => ({ ...prev, detailedDescription: null }));
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.detailedDescription ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Comprehensive description of your service, technology, and benefits"
                  />
                  {errors.detailedDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.detailedDescription}</p>
                  )}
                </div>

                {/* Key Features */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Key Features
                  </label>
                  {formData.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.keyFeatures.length > 3 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Another Feature
                  </button>
                </div>

                {/* USPs */}
                <div className="md:col-span-2">
                  <label htmlFor="uniqueSellingPoints" className="block text-sm font-semibold text-gray-900 mb-2">
                    Unique Selling Points (USPs)
                  </label>
                  <textarea
                    id="uniqueSellingPoints"
                    rows={3}
                    value={formData.uniqueSellingPoints}
                    onChange={(e) => setFormData(prev => ({ ...prev, uniqueSellingPoints: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="What makes your solution unique?"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-8">
              <div className="flex items-center mb-6">
                <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Pricing Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pricing Model */}
                <div>
                  <label htmlFor="pricingModel" className="block text-sm font-semibold text-gray-900 mb-2">
                    Pricing Model *
                  </label>
                  <select
                    id="pricingModel"
                    value={formData.pricingModel}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, pricingModel: e.target.value }));
                      if (errors.pricingModel) setErrors(prev => ({ ...prev, pricingModel: null }));
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.pricingModel ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Select pricing model</option>
                    {PRICING_MODELS.map(model => (
                      <option key={model.value} value={model.value}>{model.label}</option>
                    ))}
                  </select>
                  {errors.pricingModel && (
                    <p className="mt-1 text-sm text-red-600">{errors.pricingModel}</p>
                  )}
                </div>

                {/* Currency */}
                {formData.pricingModel && formData.pricingModel !== 'contact' && (
                  <div>
                    <label htmlFor="currency" className="block text-sm font-semibold text-gray-900 mb-2">
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                )}

                {/* Price Range */}
                {formData.pricingModel && formData.pricingModel !== 'contact' && (
                  <div className="md:col-span-2">
                    <label htmlFor="priceRange" className="block text-sm font-semibold text-gray-900 mb-2">
                      Price Range
                    </label>
                    <input
                      id="priceRange"
                      type="text"
                      value={formData.priceRange}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 50,000 - 200,000 per project"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Company Details Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Building2 className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Company & Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-900 mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, contactEmail: e.target.value }));
                        if (errors.contactEmail) setErrors(prev => ({ ...prev, contactEmail: null }));
                      }}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.contactEmail ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="contact@company.com"
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>

                {/* Contact Phone */}
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-900 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                    Headquarters Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Year Founded */}
                <div>
                  <label htmlFor="yearFounded" className="block text-sm font-semibold text-gray-900 mb-2">
                    Year Founded
                  </label>
                  <input
                    id="yearFounded"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearFounded}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearFounded: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="2020"
                  />
                </div>

                {/* Team Size */}
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-semibold text-gray-900 mb-2">
                    Team Size
                  </label>
                  <select
                    id="teamSize"
                    value={formData.teamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select team size</option>
                    {TEAM_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-8">
              <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Media & Documentation</h2>
              </div>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Logo
                  </label>
                  {!formData.logo ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload logo</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('logo', e.target.files)}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={formData.logo.url}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain border-2 border-gray-200 rounded-xl bg-white p-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('logo')}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Product/Service Images (up to 5)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {formData.productImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover border-2 border-gray-200 rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('productImages', index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.productImages.length < 5 && (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-600">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('productImages', e.target.files, true)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Certificates & Accreditations
                  </label>
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors bg-gray-50">
                    <Award className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload certificates (PDF, JPG)</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      multiple
                      onChange={(e) => handleFileUpload('certificates', e.target.files, true)}
                      className="hidden"
                    />
                  </label>
                  {formData.certificates.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-700 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-gray-500" />
                            {cert.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile('certificates', index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Documents */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Additional Documents (Brochures, Case Studies)
                  </label>
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 transition-colors bg-gray-50">
                    <FileText className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload documents (PDF)</span>
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => handleFileUpload('documents', e.target.files, true)}
                      className="hidden"
                    />
                  </label>
                  {formData.documents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-700 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-gray-500" />
                            {doc.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile('documents', index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 inline mr-2" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl"
              >
                Preview Listing
                <Eye className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* PREVIEW STEP */}
        {step === 'preview' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <Eye className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Preview Your Listing</h3>
                  <p className="text-blue-800 text-sm">
                    This is how your listing will appear to buyers. Review carefully before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {formData.logo && (
                      <div className="w-20 h-20 bg-white rounded-xl p-2 flex-shrink-0">
                        <img
                          src={formData.logo.url}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{formData.serviceName}</h2>
                      <p className="text-blue-100 mb-2">{formData.companyName}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                          {formData.category}
                        </span>
                        {formData.subcategories.map(sub => (
                          <span key={sub} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <p className="text-lg text-gray-700 font-medium">{formData.shortDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About This Solution</h3>
                      <p className="text-gray-700 whitespace-pre-line">{formData.detailedDescription}</p>
                    </div>

                    {formData.keyFeatures.filter(f => f.trim()).length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Key Features</h3>
                        <ul className="space-y-2">
                          {formData.keyFeatures.filter(f => f.trim()).map((feature, index) => (
                            <li key={index} className="flex items-start text-gray-700">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formData.uniqueSellingPoints && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Why Choose Us</h3>
                        <p className="text-gray-700 whitespace-pre-line">{formData.uniqueSellingPoints}</p>
                      </div>
                    )}

                    {formData.productImages.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.productImages.map((img, index) => (
                            <img
                              key={index}
                              src={img.url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-48 object-cover rounded-xl"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Pricing */}
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Pricing</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Model:</strong> {PRICING_MODELS.find(m => m.value === formData.pricingModel)?.label}
                        </p>
                        {formData.priceRange && (
                          <p className="text-2xl font-bold text-green-600">
                            {formData.currency === 'INR' ? '₹' : formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£'}
                            {formData.priceRange}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Company Details</h3>
                      <div className="space-y-3 text-sm">
                        {formData.location && (
                          <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            {formData.location}
                          </div>
                        )}
                        {formData.website && (
                          <div className="flex items-center text-gray-700">
                            <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                            <a href={formData.website} className="text-blue-600 hover:underline truncate">
                              {formData.website}
                            </a>
                          </div>
                        )}
                        {formData.contactEmail && (
                          <div className="flex items-center text-gray-700">
                            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{formData.contactEmail}</span>
                          </div>
                        )}
                        {formData.yearFounded && (
                          <div className="text-gray-700">
                            <strong>Founded:</strong> {formData.yearFounded}
                          </div>
                        )}
                        {formData.teamSize && (
                          <div className="text-gray-700">
                            <strong>Team:</strong> {formData.teamSize}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Certificates */}
                    {formData.certificates.length > 0 && (
                      <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Certifications</h3>
                        <div className="space-y-2">
                          {formData.certificates.map((cert, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <Award className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0" />
                              <span className="truncate">{cert.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Button */}
                    <button className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                      Contact Vendor
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => setStep('agreement')}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center shadow-lg hover:shadow-xl"
              >
                Proceed to Agreement
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* AGREEMENT STEP */}
        {step === 'agreement' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
              <div className="text-center mb-8">
                <FileSignature className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Partnership Agreement</h2>
                <p className="text-gray-600">Review and sign the vendor partnership agreement</p>
              </div>

              {/* Agreement Content */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vendor Partnership Agreement</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <p><strong>Agreement Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Vendor:</strong> {formData.companyName}</p>
                  
                  <div className="pt-4 border-t border-gray-300">
                    <h4 className="font-bold mb-2">1. Terms of Service</h4>
                    <p>
                      By signing this agreement, {formData.companyName} (&quot;Vendor&quot;) agrees to list their services 
                      on the Ploxi Clean Tech Marketplace (&quot;Platform&quot;) and abide by the following terms.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">2. Listing Terms</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Your listing will be displayed on the Platform for buyers</li>
                      <li>You agree to maintain accurate and up-to-date information</li>
                      <li>Platform reserves the right to remove listings that violate terms</li>
                      <li>Currently, there are no listing fees (subject to change with 30 days notice)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">3. Vendor Responsibilities</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Respond to inquiries within 48 hours</li>
                      <li>Provide accurate service descriptions and pricing</li>
                      <li>Maintain relevant certifications and compliance</li>
                      <li>Deliver services as described in your listing</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">4. Platform Rights</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ploxi may feature your listing in promotional materials</li>
                      <li>Platform reserves the right to verify vendor information</li>
                      <li>Ploxi may collect and share performance metrics</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">5. Termination</h4>
                    <p>
                      Either party may terminate this agreement with 14 days written notice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I have read and agree to the terms of the Partnership Agreement. 
                    I understand that a detailed agreement will be sent to <strong>{formData.contactEmail}</strong>.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('preview')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSignAgreement}
                  disabled={!agreedToTerms || isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Sign Agreement
                      <FileSignature className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>What happens next:</strong> After signing, a partnership agreement 
                  will be sent to your email. Your listing will go live immediately!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Listing Successfully Created!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Congratulations! Your service is now live on the Ploxi Clean Tech Marketplace.
              </p>

              <div className="bg-green-50 rounded-xl p-6 mb-8 border-2 border-green-200">
                <h3 className="font-semibold text-green-900 mb-3">What&apos;s Next?</h3>
                <ul className="text-sm text-green-800 space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Partnership agreement sent to <strong>{formData.contactEmail}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Your listing is now visible to potential buyers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You&apos;ll receive email notifications for inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Track performance in your vendor dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/cleantech/dashboard')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push('/cleantech')}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back to Clean Tech
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
