'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Leaf,
  Globe,
  FileText,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';




export default function CorporateOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step1Data, setStep1Data] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    geography: '',
    esgFrameworks: [],
    sustainabilityStage: '',
    esgSaasIntegration: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if email is verified
    const email = sessionStorage.getItem('corporate-registration-email');
    if (!email) {
      router.push('/corporate/register'); // Redirect back if not verified
    }
  }, [router]);

  // Load Step 1 data
  useEffect(() => {
    const step1 = sessionStorage.getItem('corporate-registration-email');
    if (!step1) {
      // Redirect back to step 1 if data doesn't exist
      router.push('/corporate');
      return;
    }
    try {
      setStep1Data(step1);
    } catch (error) {
      console.error('Failed to load step 1 data');
      router.push('/corporate');
    }
  }, [router]);

  // Geography options
  const GEOGRAPHIES = [
    { value: 'India', label: 'India', flag: '🇮🇳' },
    { value: 'UAE', label: 'UAE', flag: '🇦🇪' },
    { value: 'US', label: 'United States', flag: '🇺🇸' },
    { value: 'Europe', label: 'Europe', flag: '🇪🇺' },
    { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'Australia', label: 'Australia', flag: '🇦🇺' }
  ];

  // ESG Frameworks
  const ESG_FRAMEWORKS = [
    {
      value: 'BRSR',
      label: 'BRSR',
      fullName: 'Business Responsibility and Sustainability Reporting',
      region: 'India'
    },
    {
      value: 'GRI',
      label: 'GRI',
      fullName: 'Global Reporting Initiative',
      region: 'Global'
    },
    {
      value: 'SASB',
      label: 'SASB',
      fullName: 'Sustainability Accounting Standards Board',
      region: 'US'
    },
    {
      value: 'TCFD',
      label: 'TCFD',
      fullName: 'Task Force on Climate-related Financial Disclosures',
      region: 'Global'
    },
    {
      value: 'ESRS',
      label: 'ESRS',
      fullName: 'European Sustainability Reporting Standards',
      region: 'Europe'
    }
  ];

  // Sustainability Journey Stages
  const SUSTAINABILITY_STAGES = [
    {
      value: 'beginner',
      label: 'I do not know where to start',
      description: 'New to ESG and sustainability reporting'
    },
    {
      value: 'roadmap',
      label: 'Sustainability roadmap developed (GHG baseline set)',
      description: 'Initial assessment completed, baseline established'
    },
    {
      value: 'aspirant',
      label: 'Net-Zero Aspirant (targets set and % achieved)',
      description: 'Active progress toward sustainability goals'
    },
    {
      value: 'advanced',
      label: 'Advanced ESG and Compliant (need net-zero certification)',
      description: 'Mature ESG program seeking certification'
    }
  ];

  // ESG SaaS Integration Options
  const SAAS_INTEGRATION_OPTIONS = [
    {
      value: 'evaluating',
      label: 'Evaluating ESG SaaS Platforms',
      description: 'Researching options for ESG management software'
    },
    {
      value: 'using',
      label: 'Already using ESG SaaS Platform',
      description: 'Currently have an ESG software solution in place'
    },
    {
      value: 'unknown',
      label: "I don't know, tell me more",
      description: 'Need guidance on ESG software solutions'
    }
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.geography) {
      newErrors.geography = 'Please select your geography';
    }

    if (formData.esgFrameworks.length === 0) {
      newErrors.esgFrameworks = 'Please select at least one ESG framework';
    }

    if (!formData.sustainabilityStage) {
      newErrors.sustainabilityStage = 'Please select your sustainability journey stage';
    }

    if (!formData.esgSaasIntegration) {
      newErrors.esgSaasIntegration = 'Please select your ESG SaaS integration status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle framework toggle
  const toggleFramework = (framework) => {
    setFormData(prev => ({
      ...prev,
      esgFrameworks: prev.esgFrameworks.includes(framework)
        ? prev.esgFrameworks.filter(f => f !== framework)
        : [...prev.esgFrameworks, framework]
    }));
    if (errors.esgFrameworks) {
      setErrors(prev => ({ ...prev, esgFrameworks: null }));
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
  //     // Combine step 1 and step 2 data
  //     const completeRegistration = {
  //       ...step1Data,
  //       ...formData,
  //       registrationStep: 2,
  //       completedAt: new Date().toISOString()
  //     };

  //     // Store complete registration
  //     sessionStorage.setItem('corporate-registration-complete', JSON.stringify(completeRegistration));

  //     // Backend API call (ready for implementation)
  //     console.log('API Ready - POST /api/corporate/register/step2', completeRegistration);

  //     /*
  //     // Future backend implementation:
  //     const response = await fetch('/api/corporate/register/step2', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(completeRegistration)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Registration failed');
  //     }

  //     const data = await response.json();

  //     // Send verification email
  //     await fetch('/api/auth/send-verification-email', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: step1Data.email,
  //         userId: data.userId,
  //         userName: step1Data.fullName
  //       })
  //     });
  //     */

  //     // Navigate to email verification page
  //     setTimeout(() => {
  //       router.push('/corporate/verify-email');
  //     }, 500);

  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     setErrors({ submit: 'Registration failed. Please try again.' });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleSubmit = async () => {
  //   // Validate all required fields first
  //   if (!validateStep(step)) {
  //     return;
  //   }

  //   const email = sessionStorage.getItem('corporate-registration-email');

  //   if (!email) {
  //     alert('Session expired. Please register again.');
  //     router.push('/corporate/register');
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Call the complete API
  //     const response = await fetch('/api/corporate/register/complete', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email: email,
  //         onboardingData: {
  //           companySize: formData.companySize,
  //           annualRevenue: formData.annualRevenue,
  //           location: formData.location,
  //           operationalGeographies: formData.operationalGeographies,
  //           companyDescription: formData.companyDescription,
  //           esgFrameworks: formData.esgFrameworks,
  //           sustainabilityGoals: formData.sustainabilityGoals,
  //           challenges: formData.challenges,
  //         },
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || 'Failed to complete registration');
  //     }

  //     // Clear session data
  //     sessionStorage.removeItem('corporate-registration-email');

  //     // Move to success step (your existing step 999 or redirect)
  //     setStep(999); // Your success step

  //     // OR redirect to a thank you page if you have one:
  //     // router.push('/corporate/thank-you');

  //   } catch (error) {
  //     console.error('Complete registration error:', error);
  //     alert(error.message || 'Failed to complete registration. Please try again.');
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  if (!validateForm()) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const email = sessionStorage.getItem('corporate-registration-email');

  if (!email) {
    alert('Session expired. Please register again.');
    router.push('/corporate/register');
    return;
  }

  setIsSubmitting(true);

  try {
    // Call the complete API
    const response = await fetch('/api/corporate/register/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        onboardingData: {
          geography: formData.geography,
          esgFrameworks: formData.esgFrameworks,
          sustainabilityStage: formData.sustainabilityStage,
          esgSaasIntegration: formData.esgSaasIntegration,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to complete registration');
    }

    // Clear session data
    sessionStorage.removeItem('corporate-registration-email');

    // Show success message or redirect
    alert('✅ Registration completed successfully!');
    router.push('/corporate/success'); // Create this page

  } catch (error) {
    console.error('Complete registration error:', error);
    setErrors({ submit: error.message || 'Failed to complete registration. Please try again.' });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleBack = () => {
    router.push('/corporate');
  };

  if (!step1Data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    {/* Header */}
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Image
              src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
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
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="ml-2 text-xs sm:text-sm font-medium text-green-600">Company Details</span>
          </div>
          <div className="hidden sm:block w-12 sm:w-16 h-1 bg-green-600" />
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <span className="ml-2 text-xs sm:text-sm font-medium text-gray-900">ESG & Compliance</span>
          </div>
          <div className="hidden sm:block w-12 sm:w-16 h-1 bg-gray-300" />
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">
              3
            </div>
            <span className="ml-2 text-xs sm:text-sm font-medium text-gray-500">Verification</span>
          </div>
        </div>
      </div>

      {/* Onboarding Form */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">ESG & Compliance Setup</h2>
          <p className="text-sm sm:text-base text-gray-600">Configure your sustainability reporting preferences</p>
        </div>

        {/* Company Info Summary */}
        <div className="mb-8 p-4 bg-green-50 rounded-xl border-2 border-green-200 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-green-800">
            <strong>Company:</strong> {step1Data.companyName} | <strong>Contact:</strong> {step1Data.email}
          </p>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-red-800">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Geography */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Geography *
            </label>
            <select
              value={formData.geography}
              onChange={(e) => handleInputChange('geography', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base ${errors.geography ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Select your primary geography</option>
              {GEOGRAPHIES.map(({ value, label, flag }) => (
                <option key={value} value={value}>
                  {flag} {label}
                </option>
              ))}
            </select>
            {errors.geography && (
              <p className="mt-1 text-sm text-red-600">{errors.geography}</p>
            )}
          </div>

          {/* ESG Frameworks */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              ESG Frameworks * <span className="text-gray-500 font-normal">(Select all that apply)</span>
            </label>
            {errors.esgFrameworks && (
              <p className="mb-3 text-sm text-red-600">{errors.esgFrameworks}</p>
            )}
            <div className="space-y-3">
              {ESG_FRAMEWORKS.map(framework => (
                <label
                  key={framework.value}
                  className={`flex flex-col sm:flex-row sm:items-start p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.esgFrameworks.includes(framework.value)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-300'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.esgFrameworks.includes(framework.value)}
                    onChange={() => toggleFramework(framework.value)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                  />
                  <div className="ml-0 sm:ml-3 mt-2 sm:mt-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{framework.label}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 sm:mt-0">
                        {framework.region}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{framework.fullName}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Sustainability Journey Stage */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Sustainability Journey Stage *
            </label>
            {errors.sustainabilityStage && (
              <p className="mb-3 text-sm text-red-600">{errors.sustainabilityStage}</p>
            )}
            <div className="space-y-3">
              {SUSTAINABILITY_STAGES.map(stage => (
                <label
                  key={stage.value}
                  className={`flex flex-col sm:flex-row sm:items-start p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.sustainabilityStage === stage.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="sustainabilityStage"
                    value={stage.value}
                    checked={formData.sustainabilityStage === stage.value}
                    onChange={(e) => handleInputChange('sustainabilityStage', e.target.value)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 focus:ring-green-500 mt-0.5"
                  />
                  <div className="ml-0 sm:ml-3 mt-2 sm:mt-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{stage.label}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{stage.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ESG SaaS Integration */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              ESG SaaS Integration *
            </label>
            {errors.esgSaasIntegration && (
              <p className="mb-3 text-sm text-red-600">{errors.esgSaasIntegration}</p>
            )}
            <div className="space-y-3">
              {SAAS_INTEGRATION_OPTIONS.map(option => (
                <label
                  key={option.value}
                  className={`flex flex-col sm:flex-row sm:items-start p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.esgSaasIntegration === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="esgSaasIntegration"
                    value={option.value}
                    checked={formData.esgSaasIntegration === option.value}
                    onChange={(e) => handleInputChange('esgSaasIntegration', e.target.value)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 focus:ring-green-500 mt-0.5"
                  />
                  <div className="ml-0 sm:ml-3 mt-2 sm:mt-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{option.label}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

}
