'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Info, 
  Handshake, 
  TrendingUp,
  Building2,
  Globe,
  User,
  Mail,
  FileText,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

// Solution types configuration
const SOLUTION_TYPES = [
  'Energy Management',
  'Water Treatment',
  'Waste Solutions',
  'Analytics & Monitoring',
  'Green Buildings',
  'Renewable Energy',
  'Carbon Capture & Offsetting',
  'EV Charging',
  'Circular Economy',
  'Air Quality Management',
  'Sustainable Agriculture',
  'Green Manufacturing',
  'Other'
];

// Industries configuration
const INDUSTRIES = [
  'Manufacturing',
  'Real Estate',
  'Agriculture',
  'Transportation',
  'Utilities',
  'Finance',
  'Healthcare',
  'Education',
  'IT / Data Center',
  'Hospitality',
  'Retail',
  'Logistics',
  'Automotive',
  'Steel',
  'Cement',
  'Chemicals',
  'Oil & Gas',
  'Pharmaceuticals'
];

import OTPModal from '@/components/OTPModal';


// Geographical regions
const REGIONS = [
  { id: 'India', label: 'India', flag: '🇮🇳' },
  { id: 'United States', label: 'United States', flag: '🇺🇸' },
  { id: 'European Union', label: 'European Union', flag: '🇪🇺' },
  { id: 'United Arab Emirates', label: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'United Kingdom', label: 'United Kingdom', flag: '🇬🇧' },
  { id: 'Southeast Asia', label: 'Southeast Asia', flag: '🌏' },
  { id: 'Africa', label: 'Africa', flag: '🌍' },
  { id: 'South America', label: 'South America', flag: '🌎' },
  { id: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { id: 'Other', label: 'Other', flag: '🌐' }
];



// Tooltip component
const Tooltip = ({ content }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-gray-400 hover:text-blue-600 focus:text-blue-600 focus:outline-none transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {show && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-8 w-64 border border-gray-700">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3"></div>
        </div>
      )}
    </div>
  );
};

// Progress Step Indicator
const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Company Info' },
    { number: 2, label: 'Requirements' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${currentStep >= step.number 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-24 h-1 mx-4 transition-all duration-300 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default function CleanTechRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    website: '',
    solutionType: '',
    customSolution: '', // For "Other" option
    targetIndustries: [],
    geographicRegions: [],
    contactName: '',
    contactEmail: '',
    companyBrief: '',
    
    // Requirements
    requirement: null // 'listing' or 'funding'
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
const [isVerifying, setIsVerifying] = useState(false);
const [pendingEmail, setPendingEmail] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Toggle array values (for multi-select)
  const toggleArrayValue = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validation helper functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (url) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Company Name
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      } else if (formData.companyName.trim().length < 2) {
        newErrors.companyName = 'Company name must be at least 2 characters';
      }

      // Website (optional but validate format)
      if (formData.website && !isValidUrl(formData.website)) {
        newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
      }

      // Solution Type
      if (!formData.solutionType) {
        newErrors.solutionType = 'Please select a solution type';
      }

      // Custom Solution (if "Other" selected)
      if (formData.solutionType === 'Other' && !formData.customSolution.trim()) {
        newErrors.customSolution = 'Please specify your solution type';
      }

      // Target Industries
      if (formData.targetIndustries.length === 0) {
        newErrors.targetIndustries = 'Please select at least one target industry';
      }

      // Geographic Regions
      if (formData.geographicRegions.length === 0) {
        newErrors.geographicRegions = 'Please select at least one geographic region';
      }

      // Contact Name
      if (!formData.contactName.trim()) {
        newErrors.contactName = 'Point of contact name is required';
      }

      // Contact Email
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = 'Contact email is required';
      } else if (!isValidEmail(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }

      // Company Brief
      if (!formData.companyBrief.trim()) {
        newErrors.companyBrief = 'Company brief is required';
      } else if (formData.companyBrief.length < 100) {
        newErrors.companyBrief = 'Company brief should be at least 100 characters';
      } else if (formData.companyBrief.length > 1000) {
        newErrors.companyBrief = 'Company brief should not exceed 1000 characters';
      }
    }

    if (step === 2) {
      if (!formData.requirement) {
        newErrors.requirement = 'Please select an option';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle final action
  // const handleContinue = () => {
  //   if (!validateStep(2)) return;

  //   // Prepare data for next step
  //   const registrationData = {
  //     ...formData,
  //     // Replace "Other" solution type with custom value
  //     solutionType: formData.solutionType === 'Other' ? formData.customSolution : formData.solutionType,
  //     timestamp: new Date().toISOString(),
  //     source: 'cleantech'
  //   };

  //   // Store in session for passing to next page
  //   sessionStorage.setItem('cleantech-registration', JSON.stringify(registrationData));

  //   // Backend API ready
  //   console.log('API Ready - POST /api/cleantech/register', registrationData);

  //   if (formData.requirement === 'listing') {
  //     router.push('/cleantech/add-listing');
  //   } else if (formData.requirement === 'funding') {
  //     router.push('/climate-finance/registration');
  //   }
  // };

  const handleContinue = async () => {
  if (!validateStep(2)) {
    return;
  }
  const requirementsMap = {
  listing: 'grow your business',
  funding: 'access climate capital'
};

  // Prepare vendor data
  const vendorData = {
    companyName: formData.companyName,
    website: formData.website,
    solutionType: formData.solutionType === 'Other' ? formData.customSolution : formData.solutionType,
    targetIndustries: formData.targetIndustries,
    geographicRegions: formData.geographicRegions,
    contactName: formData.contactName,
    contactEmail: formData.contactEmail,
    companyBrief: formData.companyBrief,
    requirements: requirementsMap[formData.requirement] || null
  };
 
  try {
    // Call send-otp API
    const response = await fetch('/api/cleantech/register/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.contactEmail,
        formData: {
          company_name: vendorData.companyName,
          contact_person_name: vendorData.contactName,
          email: vendorData.contactEmail,
          phone: '', // Add phone if you have it in your form
          website: vendorData.website,
          solution_types: [vendorData.solutionType],
          industries_served: vendorData.targetIndustries,
          operational_regions: vendorData.geographicRegions,
          company_description: vendorData.companyBrief,
          requirements: vendorData.requirements
        },
      }),
    });
     console.log(vendorData)
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }

    // Store data and show OTP modal
    setPendingEmail(formData.contactEmail);
    sessionStorage.setItem('cleantech-requirement', formData.requirement);
    setShowOTPModal(true);

  } catch (error) {
    console.error('Registration error:', error);
    alert(error.message || 'Failed to send OTP. Please try again.');
  }
};

  const handleVerifyOTP = async (otp) => {
  setIsVerifying(true);
  
  try {
    const response = await fetch('/api/cleantech/register/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: pendingEmail,
        otp: otp,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Invalid OTP');
    }

    // Get requirement from session
    const requirement = sessionStorage.getItem('cleantech-requirement');
    
    // Clear session
    sessionStorage.removeItem('cleantech-registration');
    sessionStorage.removeItem('cleantech-requirement');
    
    // Close modal
    setShowOTPModal(false);

    // Redirect based on requirement
    if (requirement === 'listing') {
      router.push('/cleantech/thank-you');
    } else if (requirement === 'funding') {
      router.push('/climate-finance/registration');
    }

  } catch (error) {
    setIsVerifying(false);
    throw error;
  }
};

const handleResendOTP = async () => {
  const response = await fetch('/api/cleantech/register/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: pendingEmail,
      formData: {
        company_name: formData.companyName,
        contact_person_name: formData.contactName,
        email: formData.contactEmail,
      },
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to resend OTP');
  }
};


  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
    {/* Header */}
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Image
              src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
              alt="Ploxi"
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-xl"
              priority
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ploxi Clean Tech</h1>
              <p className="text-sm text-gray-600">Vendor Registration</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/cleantech')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm sm:text-base"
          >
            ← Cancel
          </button>
        </div>
      </div>
    </header>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Progress Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={2} />

      {/* Form Container */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-6 sm:p-8 md:p-12">
        {/* STEP 1: Company Information */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3 sm:gap-4">
                <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Information</h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Tell us about your clean tech business</p>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your Company Name"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                )}
              </div>

              {/* Solution Type */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                  Solution Type *
                  <Tooltip content="Select the primary type of clean tech solution you provide" />
                </label>
                <select
                  value={formData.solutionType}
                  onChange={(e) => handleInputChange('solutionType', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.solutionType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select solution type</option>
                  {SOLUTION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.solutionType && (
                  <p className="mt-1 text-sm text-red-600">{errors.solutionType}</p>
                )}
              </div>

              {/* Custom Solution (shown when "Other" is selected) */}
              {formData.solutionType === 'Other' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Please specify your solution type *
                  </label>
                  <input
                    type="text"
                    value={formData.customSolution}
                    onChange={(e) => handleInputChange('customSolution', e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.customSolution ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your solution type"
                  />
                  {errors.customSolution && (
                    <p className="mt-1 text-sm text-red-600">{errors.customSolution}</p>
                  )}
                </div>
              )}

              {/* Target Industries */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                  Target Industries *
                  <Tooltip content="Select all industries that your solutions serve" />
                </label>
                {errors.targetIndustries && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errors.targetIndustries}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {INDUSTRIES.map(industry => (
                    <label
                      key={industry}
                      className={`
                        flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all
                        ${formData.targetIndustries.includes(industry)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetIndustries.includes(industry)}
                        onChange={() => toggleArrayValue('targetIndustries', industry)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Geographic Regions */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
                  Geographic Regions *
                  <Tooltip content="Select all regions where your solutions are available" />
                </label>
                {errors.geographicRegions && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errors.geographicRegions}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {REGIONS.map(region => (
                    <label
                      key={region.id}
                      className={`
                        flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${formData.geographicRegions.includes(region.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.geographicRegions.includes(region.id)}
                        onChange={() => toggleArrayValue('geographicRegions', region.id)}
                        className="sr-only"
                      />
                      <span className="text-xl sm:text-2xl mr-2">{region.flag}</span>
                      <span className="text-sm sm:text-base font-medium text-gray-900">{region.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Point of Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Point of Contact: Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.contactName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                )}
              </div>

              {/* Point of Contact Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Point of Contact: Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@company.com"
                  />
                </div>
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                )}
              </div>

              {/* Company Brief */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                  Brief About the Company *
                  <Tooltip content="Provide a comprehensive overview of your company, technology, and value proposition" />
                </label>
                <textarea
                  rows={6}
                  value={formData.companyBrief}
                  onChange={(e) => handleInputChange('companyBrief', e.target.value)}
                  className={`w-full px-3 sm:px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    errors.companyBrief ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about your company, your clean tech solutions, key achievements, and what makes you unique..."
                  maxLength={1000}
                />
                <div className="flex flex-col sm:flex-row justify-between mt-2 text-sm gap-1 sm:gap-0">
                  {errors.companyBrief ? (
                    <p className="text-red-600">{errors.companyBrief}</p>
                  ) : (
                    <span className="text-gray-600">Minimum 100 characters</span>
                  )}
                  <span className={`${formData.companyBrief.length > 900 ? 'text-red-600' : 'text-gray-600'}`}>
                    {formData.companyBrief.length}/1000
                  </span>
                </div>
              </div>
            </form>

            {/* Navigation */}
            <div className="flex justify-end pt-6 border-t-2 border-gray-100">
              <button
                onClick={nextStep}
                className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Next: Requirements
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Requirements */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Are You Looking For?</h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Choose the path that best fits your business goals</p>
                </div>
              </div>
            </div>

            {errors.requirement && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm sm:text-base">{errors.requirement}</p>
              </div>
            )}

            {/* Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Grow Your Business */}
              <button
                type="button"
                onClick={() => handleInputChange('requirement', 'listing')}
                className={`
                  group relative p-6 sm:p-8 border-3 rounded-2xl text-left transition-all
                  ${formData.requirement === 'listing'
                    ? 'border-blue-600 bg-blue-50 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white'
                  }
                `}
              >
                <div className="flex flex-col h-full">
                  <div className={`
                    w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center mb-4 transition-all
                    ${formData.requirement === 'listing' ? 'bg-blue-600' : 'bg-gray-100 group-hover:bg-blue-100'}
                  `}>
                    <Handshake className={`w-7 h-7 sm:w-8 sm:h-8 ${formData.requirement === 'listing' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Grow Your Business
                  </h3>
                  <p className="text-sm text-blue-600 font-semibold mb-4">
                    Through Marketplace Listing
                  </p>
                  <p className="text-gray-600 mb-6 flex-grow text-sm sm:text-base">
                    Get your solutions listed on our marketplace, connect with corporate buyers, and access qualified business leads.
                  </p>

                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                    <p className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">What happens next:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Complete vendor listing form</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Partnership agreement sent to inbox</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Sign agreement to go live</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Listing is free (for now)</span>
                      </li>
                    </ul>
                  </div>
                </div>
                {formData.requirement === 'listing' && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                )}
              </button>

              {/* Option 2: Access Climate Capital */}
              <button
                type="button"
                onClick={() => handleInputChange('requirement', 'funding')}
                className={`
                  group relative p-6 sm:p-8 border-3 rounded-2xl text-left transition-all
                  ${formData.requirement === 'funding'
                    ? 'border-purple-600 bg-purple-50 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white'
                  }
                `}
              >
                <div className="flex flex-col h-full">
                  <div className={`
                    w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center mb-4 transition-all
                    ${formData.requirement === 'funding' ? 'bg-purple-600' : 'bg-gray-100 group-hover:bg-purple-100'}
                  `}>
                    <TrendingUp className={`w-7 h-7 sm:w-8 sm:h-8 ${formData.requirement === 'funding' ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Access Climate Capital
                  </h3>
                  <p className="text-sm text-purple-600 font-semibold mb-4">
                    Raise Funding for Your Business
                  </p>
                  <p className="text-gray-600 mb-6 flex-grow text-sm sm:text-base">
                    Showcase your company to climate-focused investors and access funding programs tailored for clean tech ventures.
                  </p>

                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                    <p className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">What happens next:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Redirect to Climate Finance portal</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Profile visible to investors</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Access to funding programs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Connect with climate finance partners</span>
                      </li>
                    </ul>
                  </div>
                </div>
                {formData.requirement === 'funding' && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                )}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-6 border-t-2 border-gray-100">
              <button
                onClick={prevStep}
                className="inline-flex items-center justify-center px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!formData.requirement}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    <OTPModal
      isOpen={showOTPModal}
      onClose={() => setShowOTPModal(false)}
      email={pendingEmail}
      onVerify={handleVerifyOTP}
      onResend={handleResendOTP}
      isVerifying={isVerifying}
    />
  </div>
);

}
