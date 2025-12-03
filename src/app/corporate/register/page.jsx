'use client'
import OTPModal from '@/components/OTPModal';


import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  User,
  Briefcase,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';



export default function CorporateRegistration() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    companyName: '',
    website: '',
    industrySector: '',
    customIndustry: '', // For "Other" option
    email: '',
    countryCode: '+91',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  // Industry sectors
  const INDUSTRY_SECTORS = [
    'Real Estate Developer',
    'Oil & Gas',
    'Steel & Cement',
    'Manufacturing',
    'Logistics',
    'IT/Data Centre',
    'Healthcare',
    'Education',
    'Other'
  ];

  // Country codes
  const COUNTRY_CODES = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' }
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    // Company Name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }

    // Website validation (optional but validate format if provided)
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
    }

    // Industry Sector validation
    if (!formData.industrySector) {
      newErrors.industrySector = 'Please select an industry sector';
    }

    // Custom Industry validation (if "Other" selected)
    if (formData.industrySector === 'Other' && !formData.customIndustry.trim()) {
      newErrors.customIndustry = 'Please specify your industry';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation helper functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Prepare data for backend
  //     const registrationData = {
  //       fullName: formData.fullName.trim(),
  //       designation: formData.designation.trim(),
  //       companyName: formData.companyName.trim(),
  //       website: formData.website.trim() || null,
  //       industrySector: formData.industrySector === 'Other' 
  //         ? formData.customIndustry.trim() 
  //         : formData.industrySector,
  //       email: formData.email.trim().toLowerCase(),
  //       phone: `${formData.countryCode}${formData.phone.trim()}`,
  //       registrationStep: 1,
  //       completedAt: new Date().toISOString()
  //     };

  //     // Store in sessionStorage for now (backend will use database)
  //     sessionStorage.setItem('corporate-registration-step1', JSON.stringify(registrationData));

  //     // Backend API call (ready for implementation)
  //     console.log('API Ready - POST /api/corporate/register/step1', registrationData);

  //     /*
  //     // Future backend implementation:
  //     const response = await fetch('/api/corporate/register/step1', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(registrationData)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Registration failed');
  //     }

  //     const data = await response.json();
  //     // Store temporary user ID for step 2
  //     sessionStorage.setItem('temp-user-id', data.userId);
  //     */

  //     // Navigate to step 2
  //     setTimeout(() => {
  //       router.push('/corporate/onboarding');
  //     }, 500);

  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     setErrors({ submit: 'Registration failed. Please try again.' });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Your existing validation code here...
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.industrySector) newErrors.industrySector = 'Industry sector is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/corporate/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          formData: formData,
        }),
      });

      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Show OTP modal
      setShowOTPModal(true);

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setIsVerifying(true);

    try {
      const response = await fetch('/api/corporate/register/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // Store email for Step 2
      sessionStorage.setItem('corporate-registration-email', formData.email);

      // Close modal and redirect to Step 2 (onboarding page)
      setShowOTPModal(false);
      router.push('/corporate/onboarding'); // Adjust this path to your Step 2 page

    } catch (error) {
      setIsVerifying(false);
      throw error;
    }
  };

  const handleResendOTP = async () => {
    const response = await fetch('/api/corporate/register/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        formData: formData,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to resend OTP');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/corporate" className="text-green-600 hover:text-green-700 font-medium mb-2 sm:mb-0 ">
                ← Back to Ploxi
              </Link>
              <Image
                src="/images/ploxi earth logo.jpeg"
                alt="Ploxi"
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-xl"
                priority
              />
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ploxi Earth</h1>
                <p className="text-xs sm:text-sm text-gray-600">Corporate Sustainability Solutions</p>
              </div>

             
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Progress Indicator */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 min-w-[350px] sm:min-w-0">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium text-gray-900">Company Details</span>
            </div>
            <div className="w-12 sm:w-16 h-1 bg-gray-300" />
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium text-gray-500">ESG & Compliance</span>
            </div>
            <div className="w-12 sm:w-16 h-1 bg-gray-300" />
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-sm sm:text-base">
                3
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium text-gray-500">Verification</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 sm:p-8">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Company Details</h2>
            <p className="text-gray-600 text-sm sm:text-base">Let's start with your company information</p>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm sm:text-base">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Designation *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.designation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., Sustainability Manager, CEO"
                />
              </div>
              {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Acme Corporation"
                />
              </div>
              {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="https://yourcompany.com"
                />
              </div>
              {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
            </div>

            {/* Industry Sector */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Industry Sector *</label>
              <select
                value={formData.industrySector}
                onChange={(e) => handleInputChange('industrySector', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.industrySector ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select your industry</option>
                {INDUSTRY_SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              {errors.industrySector && <p className="mt-1 text-sm text-red-600">{errors.industrySector}</p>}
            </div>

            {/* Custom Industry */}
            {formData.industrySector === 'Other' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Please specify your industry *</label>
                <input
                  type="text"
                  value={formData.customIndustry}
                  onChange={(e) => handleInputChange('customIndustry', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.customIndustry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your industry"
                />
                {errors.customIndustry && <p className="mt-1 text-sm text-red-600">{errors.customIndustry}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email ID *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="john.doe@company.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  className="w-full sm:w-32 px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  {COUNTRY_CODES.map(({ code, country, flag }) => (
                    <option key={code} value={code}>
                      {flag} {code}
                    </option>
                  ))}
                </select>
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="9876543210"
                    maxLength="15"
                  />
                </div>
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to ESG & Compliance
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Need help?{' '}
            <a href="mailto:support@ploxi.com" className="text-green-600 font-semibold hover:text-green-700">
              Contact Support
            </a>
          </p>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={formData.email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        isVerifying={isVerifying}
      />
    </div>
  );

}
