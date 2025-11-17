'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  User,
  FileText,
  Calendar,
  Target,
  DollarSign,
  AlertCircle,
  Send
} from 'lucide-react';

export default function ConsultationRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userContext, setUserContext] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    // Personal/Company Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    designation: '',
    website: '',
    
    // Consultation Details
    consultationType: '',
    fundingStage: '',
    amountSeeking: '',
    urgency: '',
    preferredDate: '',
    preferredTime: '',
    
    // Description
    consultationNeeds: '',
    currentSituation: '',
    specificQuestions: '',
    
    // Additional
    heardAboutUs: ''
  });

  const [errors, setErrors] = useState({});

  // Load user context if available
  useEffect(() => {
    // Try to load from investor profile
    const investorProfile = sessionStorage.getItem('investor-profile');
    if (investorProfile) {
      try {
        const profile = JSON.parse(investorProfile);
        setUserContext(profile);
        setFormData(prev => ({
          ...prev,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          companyName: profile.organizationName || '',
          designation: profile.designation || '',
          website: profile.website || ''
        }));
      } catch (error) {
        console.error('Failed to load user context');
      }
    }

    // Try to load from funding request
    const fundingData = sessionStorage.getItem('cleantech-registration');
    if (fundingData && !investorProfile) {
      try {
        const data = JSON.parse(fundingData);
        setFormData(prev => ({
          ...prev,
          companyName: data.companyName || ''
        }));
      } catch (error) {
        console.error('Failed to load funding data');
      }
    }
  }, []);

  const CONSULTATION_TYPES = [
    'Fundraising Strategy',
    'Investment Terms & Negotiation',
    'Pitch Deck Review',
    'Financial Modeling',
    'Investor Introductions',
    'Due Diligence Preparation',
    'Valuation Assessment',
    'Deal Structuring',
    'ESG & Impact Metrics',
    'Other'
  ];

  const FUNDING_STAGES = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C+',
    'Growth/Expansion',
    'Project Finance',
    'Not Sure'
  ];

  const URGENCY_LEVELS = [
    { value: 'high', label: 'High - Within 1 week', color: 'red' },
    { value: 'medium', label: 'Medium - Within 2-4 weeks', color: 'yellow' },
    { value: 'low', label: 'Low - Flexible timing', color: 'green' }
  ];

  const HEARD_ABOUT = [
    'Google Search',
    'Referral',
    'LinkedIn',
    'Event/Conference',
    'Partner Organization',
    'Social Media',
    'Other'
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.consultationType) newErrors.consultationType = 'Please select consultation type';
    if (!formData.consultationNeeds.trim()) newErrors.consultationNeeds = 'Please describe your needs';
    else if (formData.consultationNeeds.length < 50) {
      newErrors.consultationNeeds = 'Please provide at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Prepare submission data
    const consultationRequest = {
      ...formData,
      userContext,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      id: `consultation_${Date.now()}`
    };

    // Store in session
    const existingConsultations = JSON.parse(sessionStorage.getItem('consultation-requests') || '[]');
    existingConsultations.push(consultationRequest);
    sessionStorage.setItem('consultation-requests', JSON.stringify(existingConsultations));

    // API ready
    console.log('API Ready - POST /api/climate-finance/consultations', consultationRequest);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <Image
                src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                alt="Ploxi"
                width={48}
                height={48}
                className="h-12 w-12 object-contain rounded-xl bg-white p-1"
                priority
              />
              <div>
                <h1 className="text-3xl font-bold text-white">Ploxi Climate Finance</h1>
                <p className="text-purple-300">Consultation Request</p>
              </div>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Request Submitted Successfully!
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Thank you for your consultation request. Our team will review your submission and get back to you within 24-48 hours.
            </p>

            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 mb-8 border border-purple-500/30">
              <h3 className="font-semibold text-white mb-4">What Happens Next?</h3>
              <div className="space-y-3 text-left max-w-xl mx-auto">
                {[
                  'Our team will review your consultation request',
                  'We\'ll match you with the right advisor',
                  'You\'ll receive an email with scheduling options',
                  'A confirmation email has been sent to ' + formData.email
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-900/20 rounded-xl p-4 mb-8 border border-blue-500/30">
              <p className="text-blue-300 text-sm">
                <strong>Reference ID:</strong> {`consultation_${Date.now()}`.substring(0, 20)}...
              </p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                alt="Ploxi"
                width={48}
                height={48}
                className="h-12 w-12 object-contain rounded-xl bg-white p-1"
                priority
              />
              <div>
                <h1 className="text-3xl font-bold text-white">Ploxi Climate Finance</h1>
                <p className="text-purple-300">Request Consultation</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Expert Fundraising Consultation</h3>
              <p className="text-gray-300 text-sm">
                Our experienced advisors provide personalized guidance on fundraising strategy, investor relations, 
                deal structuring, and more. Fill out the form below and we'll connect you with the right expert.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-xl p-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Personal Information</h2>
            </div>

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
                  className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${
                    errors.firstName ? 'border-red-500' : 'border-gray-700'
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
                  className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${
                    errors.lastName ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
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
                    className={`w-full pl-11 pr-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="john@company.com"
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
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, companyName: e.target.value }));
                      if (errors.companyName) setErrors(prev => ({ ...prev, companyName: null }));
                    }}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${
                      errors.companyName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Your company"
                  />
                </div>
                {errors.companyName && <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="e.g., CEO, Founder"
                />
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Consultation Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Type of Consultation *
                </label>
                <select
                  value={formData.consultationType}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, consultationType: e.target.value }));
                    if (errors.consultationType) setErrors(prev => ({ ...prev, consultationType: null }));
                  }}
                  className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${
                    errors.consultationType ? 'border-red-500' : 'border-gray-700'
                  }`}
                >
                  <option value="">Select consultation type</option>
                  {CONSULTATION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.consultationType && <p className="mt-1 text-sm text-red-400">{errors.consultationType}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Current Funding Stage
                  </label>
                  <select
                    value={formData.fundingStage}
                    onChange={(e) => setFormData(prev => ({ ...prev, fundingStage: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="">Select stage</option>
                    {FUNDING_STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Amount Seeking (if applicable)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={formData.amountSeeking}
                      onChange={(e) => setFormData(prev => ({ ...prev, amountSeeking: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="e.g., $5M"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Urgency Level
                </label>
                <div className="space-y-3">
                  {URGENCY_LEVELS.map(level => (
                    <label
                      key={level.value}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.urgency === level.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.urgency === level.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="ml-3 text-white font-medium">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Preferred Time
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="">Select time slot</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                    <option value="evening">Evening (3 PM - 6 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-xl p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Tell Us More</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  What do you need help with? *
                </label>
                <textarea
                  rows={5}
                  value={formData.consultationNeeds}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, consultationNeeds: e.target.value }));
                    if (errors.consultationNeeds) setErrors(prev => ({ ...prev, consultationNeeds: null }));
                  }}
                  className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 text-white ${
                    errors.consultationNeeds ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Describe your consultation needs in detail..."
                  maxLength={1000}
                />
                <div className="flex justify-between mt-2">
                  {errors.consultationNeeds ? (
                    <p className="text-sm text-red-400">{errors.consultationNeeds}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Minimum 50 characters</p>
                  )}
                  <p className="text-sm text-gray-500">{formData.consultationNeeds.length}/1000</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Current Situation
                </label>
                <textarea
                  rows={3}
                  value={formData.currentSituation}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentSituation: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Brief overview of your current stage, traction, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Specific Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.specificQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specificQuestions: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Any specific questions you'd like addressed?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  How did you hear about us?
                </label>
                <select
                  value={formData.heardAboutUs}
                  onChange={(e) => setFormData(prev => ({ ...prev, heardAboutUs: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="">Select source</option>
                  {HEARD_ABOUT.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-900/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Need Immediate Assistance?</h3>
              <p className="text-gray-300 text-sm mb-3">
                For urgent matters, please contact us directly:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  consultations@ploxi.com
                </p>
                <p className="text-gray-300 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-400" />
                  +91 80 1234 5678
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
