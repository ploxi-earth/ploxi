'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Briefcase,
  DollarSign,
  Globe,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  User,
  Users,
  TrendingUp,
  Leaf,
  HelpCircle,
  Info,
  Save,
  AlertCircle
} from 'lucide-react';

import OTPModal from '@/components/OTPModal'; // ADD THIS LINE


// Tooltip component
const Tooltip = ({ content }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-gray-400 hover:text-purple-400 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {show && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-8 w-64 border border-gray-700">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3 border-l border-b border-gray-700"></div>
        </div>
      )}
    </div>
  );
};

export default function InvestorRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ADD THESE NEW STATE VARIABLES
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);



  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    designation: '',

    // Organization/Fund Information
    organizationName: '',
    fundName: '',
    organizationType: '', // VC, PE, Family Office, Angel Network, Corporate VC, Impact Fund
    fundSize: '',
    fundSizeRange: '',
    aum: '', // Assets Under Management
    fundVintage: '',
    website: '',

    // Investment Focus
    sectors: [],
    investmentStages: [],
    geographicFocus: [],
    typicalTicketSize: '',
    minInvestment: '',
    maxInvestment: '',

    // Financing Types
    financingTypes: [],
    investmentStructures: [],

    // ESG & Impact
    esgFocus: [],
    impactMetrics: [],
    certifications: [],
    sdgAlignment: [],

    // Additional Details
    investmentCriteria: '',
    portfolioCompanies: '',
    recentInvestments: '',
    valueAdd: '',
    decisionTimeline: '',
    dueDiligenceProcess: ''
  });

  const [errors, setErrors] = useState({});

  // Load existing profile if editing
  useEffect(() => {
    const existingProfile = sessionStorage.getItem('investor-profile');
    if (existingProfile) {
      try {
        const data = JSON.parse(existingProfile);
        setFormData(data);
        setIsEditMode(true);
      } catch (error) {
        console.error('Failed to load investor profile');
      }
    }
  }, []);

  // Configuration data
  const ORGANIZATION_TYPES = [
    'Venture Capital',
    'Private Equity',
    'Family Office',
    'Angel Network',
    'Corporate VC',
    'Impact Fund',
    'Green Bond Fund',
    'Climate Fund',
    'Government Fund',
    'Development Finance Institution'
  ];

  const SECTORS = [
    'Renewable Energy',
    'Energy Storage',
    'EV & Mobility',
    'Green Buildings',
    'Water & Wastewater',
    'Waste Management',
    'Carbon Capture & Storage',
    'Agriculture Tech',
    'Food Tech',
    'Clean Manufacturing',
    'Circular Economy',
    'Climate Tech',
    'Sustainability Software',
    'Clean Energy Infrastructure',
    'Smart Grid',
    'Hydrogen',
    'Biomass & Biofuels',
    'Ocean Tech',
    'Air Quality',
    'Environmental Monitoring'
  ];

  const INVESTMENT_STAGES = [
    'Pre-seed',
    'Seed',
    'Early Stage (Series A)',
    'Growth Stage (Series B/C)',
    'Late Stage',
    'Pre-IPO',
    'Public Markets',
    'Project Finance',
    'Infrastructure',
    'Buyout'
  ];

  const GEOGRAPHIC_REGIONS = [
    { value: 'India', label: 'India', flag: '🇮🇳' },
    { value: 'Southeast Asia', label: 'Southeast Asia', flag: '🌏' },
    { value: 'Middle East', label: 'Middle East', flag: '🌍' },
    { value: 'Africa', label: 'Africa', flag: '🌍' },
    { value: 'Europe', label: 'Europe', flag: '🇪🇺' },
    { value: 'North America', label: 'North America', flag: '🌎' },
    { value: 'Latin America', label: 'Latin America', flag: '🌎' },
    { value: 'Australia & Oceania', label: 'Australia & Oceania', flag: '🌏' },
    { value: 'Global', label: 'Global', flag: '🌐' }
  ];

  const FINANCING_TYPES = [
    'Equity',
    'Debt',
    'Convertible Notes',
    'SAFE',
    'Revenue-Based Financing',
    'Green Bonds',
    'Mezzanine',
    'Project Finance',
    'Structured Finance',
    'Grants',
    'Carbon Credits',
    'Blended Finance'
  ];

  const INVESTMENT_STRUCTURES = [
    'Direct Investment',
    'Co-Investment',
    'Fund of Funds',
    'SPV (Special Purpose Vehicle)',
    'Syndicate',
    'Joint Venture',
    'Strategic Partnership'
  ];

  const ESG_FOCUS_AREAS = [
    'Carbon Reduction',
    'Clean Energy Transition',
    'Circular Economy',
    'Water Conservation',
    'Biodiversity',
    'Social Impact',
    'Gender Lens Investing',
    'Community Development',
    'Green Jobs Creation',
    'Climate Adaptation',
    'Climate Resilience',
    'Just Transition',
    'Sustainable Supply Chain',
    'Environmental Justice'
  ];

  const IMPACT_METRICS = [
    'CO2 Emissions Reduced (tons)',
    'Renewable Energy Generated (MW)',
    'Water Saved (liters)',
    'Waste Diverted (tons)',
    'Green Jobs Created',
    'Communities Impacted',
    'Clean Energy Access',
    'Air Quality Improvement',
    'Land Restored (acres)',
    'Plastic Reduction (kg)'
  ];

  const CERTIFICATIONS = [
    'B Corp Certified',
    'GIIN Member',
    'PRI Signatory',
    'UNPRI Member',
    'Climate Action 100+',
    'Net Zero Asset Managers',
    'Science Based Targets',
    'ISO 14001',
    'Green Bond Principles',
    'TCFD Aligned'
  ];

  const SDG_GOALS = [
    { number: 7, name: 'Affordable & Clean Energy' },
    { number: 9, name: 'Industry, Innovation & Infrastructure' },
    { number: 11, name: 'Sustainable Cities & Communities' },
    { number: 12, name: 'Responsible Consumption' },
    { number: 13, name: 'Climate Action' },
    { number: 14, name: 'Life Below Water' },
    { number: 15, name: 'Life on Land' }
  ];

  const FUND_SIZE_RANGES = [
    'Under $10M',
    '$10M - $50M',
    '$50M - $100M',
    '$100M - $250M',
    '$250M - $500M',
    '$500M - $1B',
    'Above $1B'
  ];

  const DECISION_TIMELINES = [
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    '3-6 months',
    '6+ months'
  ];

  // Validation
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Required';
      if (!formData.email.trim()) newErrors.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Valid email required';
      }
      if (!formData.organizationName.trim()) newErrors.organizationName = 'Required';
      if (!formData.organizationType) newErrors.organizationType = 'Required';
    }

    if (currentStep === 2) {
      if (formData.sectors.length === 0) newErrors.sectors = 'Select at least one sector';
      if (formData.investmentStages.length === 0) newErrors.investmentStages = 'Select at least one stage';
      if (formData.geographicFocus.length === 0) newErrors.geographicFocus = 'Select at least one region';
    }

    if (currentStep === 3) {
      if (formData.financingTypes.length === 0) newErrors.financingTypes = 'Select at least one type';
    }

    if (currentStep === 4) {
      if (formData.esgFocus.length === 0) newErrors.esgFocus = 'Select at least one ESG focus area';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle array values
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

  // Submit
  // const handleSubmit = () => {
  //   if (!validateStep(4)) return;

  //   setIsSubmitting(true);

  //   const profileData = {
  //     ...formData,
  //     profileType: 'investor',
  //     status: 'active',
  //     createdAt: isEditMode ? formData.createdAt : new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     id: formData.id || `investor_${Date.now()}`
  //   };

  //   // Save to session storage
  //   sessionStorage.setItem('investor-profile', JSON.stringify(profileData));

  //   // Also add to investors list
  //   const investors = JSON.parse(sessionStorage.getItem('climate-investors') || '[]');
  //   const existingIndex = investors.findIndex(inv => inv.id === profileData.id);
  //   if (existingIndex >= 0) {
  //     investors[existingIndex] = profileData;
  //   } else {
  //     investors.push(profileData);
  //   }
  //   sessionStorage.setItem('climate-investors', JSON.stringify(investors));

  //   // API ready
  //   console.log('API Ready - POST /api/investors/profile', profileData);

  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     setStep(5); // Success
  //   }, 2000);
  // };

const handleSubmit = async () => {
  if (!validateStep(4)) {
    return;
  }

  setIsSubmitting(true);

  try {
    // Call send-otp API with complete form data
    const response = await fetch('/api/climate-finance/investor/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        formData: {
          // Personal
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          linkedin_url: formData.linkedIn,
          designation: formData.designation,
          
          // Organization
          organization_name: formData.organizationName,
          fund_name: formData.fundName,
          organization_type: formData.organizationType,
          fund_size: formData.fundSize,
          fund_size_range: formData.fundSizeRange,
          aum: formData.aum,
          fund_vintage: formData.fundVintage,
          website: formData.website,
          
          // Investment Focus
          sectors_of_interest: formData.sectors,
          investment_stages: formData.investmentStages,
          geographic_focus: formData.geographicFocus,
          typical_ticket_size: formData.typicalTicketSize,
          min_investment: formData.minInvestment,
          max_investment: formData.maxInvestment,
          
          // Financing
          financing_types: formData.financingTypes,
          investment_structures: formData.investmentStructures,
          
          // ESG
          esg_focus: formData.esgFocus,
          impact_metrics: formData.impactMetrics,
          certifications: formData.certifications,
          sdg_alignment: formData.sdgAlignment,
          
          // Additional
          investment_criteria: formData.investmentCriteria,
          portfolio_companies: formData.portfolioCompanies,
          recent_investments: formData.recentInvestments,
          value_add: formData.valueAdd,
          decision_timeline: formData.decisionTimeline,
          due_diligence_process: formData.dueDiligenceProcess,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }

    // Show OTP modal
    setShowOTPModal(true);
    setIsSubmitting(false);

  } catch (error) {
    console.error('Registration error:', error);
    alert(error.message || 'Failed to send OTP. Please try again.');
    setIsSubmitting(false);
  }
};

const handleResendOTP = async () => {
  const response = await fetch('/api/climate-finance/investor/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      formData: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization_name: formData.organizationName,
        organization_type: formData.organizationType,
        // Add minimal required fields
      },
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to resend OTP');
  }
};


  const handleVerifyOTP = async (otp) => {
    setIsVerifying(true);

    try {
      const response = await fetch('/api/climate-finance/register/verify-otp', {
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

      // Close modal and show success step
      setShowOTPModal(false);
      setStep(5); // Your existing success step

      // Clear any stored data
      sessionStorage.removeItem('investor-profile');

    } catch (error) {
      setIsVerifying(false);
      throw error; // OTP Modal will handle the error display
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/climate-finance/registration')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Ploxi
            </button>
            <div className="flex items-center space-x-4 sm:space-x-3 sm:pl-4 sm:border-l border-gray-300">
              <Image
                src="/images/ploxi earth logo.jpeg"
                alt="Ploxi"
                width={48}
                height={48}
                className="h-12 w-12 object-contain rounded-xl bg-white p-1"
                priority
              />
              <div>
                <h1 className="text-3xl font-bold text-white">Ploxi Earth</h1>
                <p className="text-purple-300">
                  {isEditMode ? 'Update Investor Profile' : 'Investor Registration'}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-300 text-sm">
                <strong className="text-purple-300">Complete your investor profile</strong> to access funding opportunities,
                connect with clean tech ventures, and showcase your fund to the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        {step < 5 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[
                { num: 1, label: 'Personal & Org' },
                { num: 2, label: 'Investment Focus' },
                { num: 3, label: 'Financing' },
                { num: 4, label: 'ESG & Impact' }
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s.num
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                      }`}>
                      {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                    </div>
                    <span className={`text-xs mt-2 ${step >= s.num ? 'text-purple-400' : 'text-gray-600'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${step > s.num ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-800'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">Step {step} of 4</p>
          </div>
        )}

        {/* STEP 1: Personal & Organization Info */}
        {step === 1 && (
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-8">
            <div className="flex items-center mb-8">
              <User className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">Personal & Organization Information</h2>
                <p className="text-gray-400">Tell us about you and your fund</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, firstName: e.target.value }));
                        if (errors.firstName) setErrors(prev => ({ ...prev, firstName: null }));
                      }}
                      className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${errors.firstName ? 'border-red-500' : 'border-gray-700'
                        }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, lastName: e.target.value }));
                        if (errors.lastName) setErrors(prev => ({ ...prev, lastName: null }));
                      }}
                      className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${errors.lastName ? 'border-red-500' : 'border-gray-700'
                        }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, email: e.target.value }));
                          if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                        }}
                        className={`w-full pl-11 pr-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${errors.email ? 'border-red-500' : 'border-gray-700'
                          }`}
                        placeholder="john@fund.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="e.g., Managing Partner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="border-t-2 border-gray-800 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Organization & Fund Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Organization Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.organizationName}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, organizationName: e.target.value }));
                          if (errors.organizationName) setErrors(prev => ({ ...prev, organizationName: null }));
                        }}
                        className={`w-full pl-11 pr-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${errors.organizationName ? 'border-red-500' : 'border-gray-700'
                          }`}
                        placeholder="Your fund/organization"
                      />
                    </div>
                    {errors.organizationName && <p className="mt-1 text-sm text-red-400">{errors.organizationName}</p>}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                      Organization Type *
                      <Tooltip content="Select the type of organization that best describes your fund" />
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, organizationType: e.target.value }));
                        if (errors.organizationType) setErrors(prev => ({ ...prev, organizationType: null }));
                      }}
                      className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${errors.organizationType ? 'border-red-500' : 'border-gray-700'
                        }`}
                    >
                      <option value="">Select type</option>
                      {ORGANIZATION_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.organizationType && <p className="mt-1 text-sm text-red-400">{errors.organizationType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Fund Name
                    </label>
                    <input
                      type="text"
                      value={formData.fundName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fundName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="e.g., Climate Fund I"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                      Fund Size Range
                      <Tooltip content="Total fund size or AUM range" />
                    </label>
                    <select
                      value={formData.fundSizeRange}
                      onChange={(e) => setFormData(prev => ({ ...prev, fundSizeRange: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                    >
                      <option value="">Select range</option>
                      {FUND_SIZE_RANGES.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Fund Vintage (Year)
                    </label>
                    <input
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={formData.fundVintage}
                      onChange={(e) => setFormData(prev => ({ ...prev, fundVintage: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder={new Date().getFullYear().toString()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                        placeholder="https://yourfund.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t-2 border-gray-800">
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center shadow-lg"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Investment Focus */}
        {step === 2 && (
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-8">
            <div className="flex items-center mb-8">
              <Target className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">Investment Focus</h2>
                <p className="text-gray-400">Define your investment thesis and focus areas</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Sectors */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  Sectors You Invest In *
                  <Tooltip content="Select all sectors that align with your investment strategy" />
                </label>
                {errors.sectors && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {errors.sectors}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SECTORS.map(sector => (
                    <label
                      key={sector}
                      className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${formData.sectors.includes(sector)
                          ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sectors.includes(sector)}
                        onChange={() => toggleArrayValue('sectors', sector)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Investment Stages */}
              <div className="border-t-2 border-gray-800 pt-8">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  Investment Stages *
                  <Tooltip content="Select the stages where you typically invest" />
                </label>
                {errors.investmentStages && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {errors.investmentStages}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INVESTMENT_STAGES.map(stage => (
                    <label
                      key={stage}
                      className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${formData.investmentStages.includes(stage)
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.investmentStages.includes(stage)}
                        onChange={() => toggleArrayValue('investmentStages', stage)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Geographic Focus */}
              <div className="border-t-2 border-gray-800 pt-8">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  Geographic Focus *
                  <Tooltip content="Select regions where you invest" />
                </label>
                {errors.geographicFocus && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {errors.geographicFocus}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {GEOGRAPHIC_REGIONS.map(region => (
                    <label
                      key={region.value}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.geographicFocus.includes(region.value)
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.geographicFocus.includes(region.value)}
                        onChange={() => toggleArrayValue('geographicFocus', region.value)}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-2">{region.flag}</span>
                        <span className="text-sm font-medium text-gray-300 text-center">{region.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ticket Size */}
              <div className="border-t-2 border-gray-800 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Typical Investment Size</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Minimum Investment (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.minInvestment}
                        onChange={(e) => setFormData(prev => ({ ...prev, minInvestment: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                        placeholder="e.g., 500,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Maximum Investment (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.maxInvestment}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxInvestment: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                        placeholder="e.g., 10,000,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Sweet Spot
                    </label>
                    <input
                      type="text"
                      value={formData.typicalTicketSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, typicalTicketSize: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="e.g., $2M - $5M"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-800">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center shadow-lg"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Financing Types */}
        {step === 3 && (
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-8">
            <div className="flex items-center mb-8">
              <DollarSign className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">Financing & Structure</h2>
                <p className="text-gray-400">How do you structure your investments?</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Financing Types */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  Types of Financing Offered *
                  <Tooltip content="Select all financing instruments you provide" />
                </label>
                {errors.financingTypes && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {errors.financingTypes}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FINANCING_TYPES.map(type => (
                    <label
                      key={type}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.financingTypes.includes(type)
                          ? 'border-green-500 bg-green-500/10 text-green-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.financingTypes.includes(type)}
                        onChange={() => toggleArrayValue('financingTypes', type)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Investment Structures */}
              <div className="border-t-2 border-gray-800 pt-8">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  Investment Structures
                  <Tooltip content="How do you typically structure deals?" />
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INVESTMENT_STRUCTURES.map(structure => (
                    <label
                      key={structure}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.investmentStructures.includes(structure)
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.investmentStructures.includes(structure)}
                        onChange={() => toggleArrayValue('investmentStructures', structure)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{structure}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Decision Timeline */}
              <div className="border-t-2 border-gray-800 pt-8">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                  Typical Decision Timeline
                  <Tooltip content="How long does your investment decision process typically take?" />
                </label>
                <select
                  value={formData.decisionTimeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, decisionTimeline: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="">Select timeline</option>
                  {DECISION_TIMELINES.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>

              {/* Investment Criteria */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Key Investment Criteria
                </label>
                <textarea
                  rows={4}
                  value={formData.investmentCriteria}
                  onChange={(e) => setFormData(prev => ({ ...prev, investmentCriteria: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="What are your key criteria when evaluating investments?"
                />
              </div>

              {/* Value Add */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Value Add to Portfolio Companies
                </label>
                <textarea
                  rows={3}
                  value={formData.valueAdd}
                  onChange={(e) => setFormData(prev => ({ ...prev, valueAdd: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="What support do you provide beyond capital?"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-800">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center shadow-lg"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ESG & Impact */}
        {step === 4 && (
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-8">
            <div className="flex items-center mb-8">
              <Leaf className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">ESG & Impact Focus</h2>
                <p className="text-gray-400">Define your sustainability and impact criteria</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* ESG Focus Areas */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  ESG Focus Areas *
                  <Tooltip content="Select the ESG themes that align with your investment mandate" />
                </label>
                {errors.esgFocus && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {errors.esgFocus}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ESG_FOCUS_AREAS.map(area => (
                    <label
                      key={area}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.esgFocus.includes(area)
                          ? 'border-green-500 bg-green-500/10 text-green-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.esgFocus.includes(area)}
                        onChange={() => toggleArrayValue('esgFocus', area)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="border-t-2 border-gray-800 pt-8">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  Impact Metrics Tracked
                  <Tooltip content="What impact metrics do you measure?" />
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {IMPACT_METRICS.map(metric => (
                    <label
                      key={metric}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.impactMetrics.includes(metric)
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.impactMetrics.includes(metric)}
                        onChange={() => toggleArrayValue('impactMetrics', metric)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SDG Alignment */}
              <div className="border-t-2 border-gray-800 pt-8">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  UN SDG Alignment
                  <Tooltip content="Which Sustainable Development Goals does your fund support?" />
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SDG_GOALS.map(sdg => (
                    <label
                      key={sdg.number}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.sdgAlignment.includes(sdg.number)
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sdgAlignment.includes(sdg.number)}
                        onChange={() => toggleArrayValue('sdgAlignment', sdg.number)}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                          {sdg.number}
                        </div>
                        <span className="text-sm font-medium text-gray-300">{sdg.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="border-t-2 border-gray-800 pt-8">
                <label className="flex items-center text-sm font-semibold text-gray-300 mb-4">
                  Certifications & Memberships
                  <Tooltip content="Select relevant certifications and memberships" />
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CERTIFICATIONS.map(cert => (
                    <label
                      key={cert}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.certifications.includes(cert)
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => toggleArrayValue('certifications', cert)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-800">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    {isEditMode ? 'Update Profile' : 'Complete Registration'}
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>

            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 5 && (
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {isEditMode ? 'Profile Updated Successfully!' : 'Registration Complete!'}
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Your investor profile is now live. You can access funding opportunities and connect with clean tech ventures.
            </p>

            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 mb-8 border border-purple-500/30">
              <h3 className="font-semibold text-white mb-4">What's Next?</h3>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  'Access the investor dashboard',
                  'Browse funding opportunities',
                  'Connect directly with ventures',
                  'Receive matching notifications',
                  'Participate in pitch events'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/climate-finance/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/climate-finance')}
                className="px-8 py-4 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
        
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
