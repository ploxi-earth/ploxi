'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Mail } from 'lucide-react';
import OTPModal from '@/components/OTPModal';
import Link from 'next/link';
import Image from 'next/image';

export default function RaiseFundingRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    fundingStage: '',
    fundingAmount: '',
    fundingPurpose: '',
    currentRevenue: '',
    useOfFunds: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FUNDING_STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
  const FUNDING_PURPOSES = ['Product Development', 'Market Expansion', 'R&D', 'Marketing'];

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (!formData.fundingStage) newErrors.fundingStage = 'Funding stage required';
    if (!formData.fundingAmount.trim()) newErrors.fundingAmount = 'Funding amount required';
    if (!formData.fundingPurpose) newErrors.fundingPurpose = 'Funding purpose required';
    if (!formData.useOfFunds.trim()) newErrors.useOfFunds = 'Use of funds required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (sends OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/climate-finance/raise-funding/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          formData: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Show OTP Modal
      setShowOTPModal(true);
      setIsSubmitting(false);

    } catch (error) {
      console.error('Send OTP error:', error);
      alert(error.message || 'Failed to send OTP');
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (otp) => {
    setIsVerifying(true);

    try {
      const response = await fetch('/api/climate-finance/raise-funding/verify-otp', {
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

      // Success
      setShowOTPModal(false);

      // Redirect to success page
      setTimeout(() => {
        router.push('/climate-finance/raise-funding/success');
      }, 500);

    } catch (error) {
      setIsVerifying(false);
      throw error; // OTPModal will handle the error display
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    const response = await fetch('/api/climate-finance/raise-funding/send-otp', {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ">
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Left section */}
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
              <Link
                href="/climate-finance/registration"
                className="text-purple-400 hover:text-purple-300 text-sm sm:text-base"
              >
                ← Back to Ploxi
              </Link>

              <div className="border-l border-gray-700 pl-0 sm:pl-4 flex items-center space-x-3">
                <Image
                  src="/images/ploxi earth logo.jpeg"
                  alt="Ploxi"
                  width={48}
                  height={48}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-xl bg-white p-1"
                  priority
                />

                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Ploxi Earth
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Investment & Funding
                  </p>
                </div>
              </div>
            </div>

            {/* Right section */}
            <Link
              href="https://www.ploxiconsult.com/"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md text-sm sm:text-base"
            >
              Go to Website
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-16 px-4">

        <div className="bg-gray-900 border-2 border-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <TrendingUp className="w-8 h-8 text-green-400 mr-2" /> Raise Funding
          </h2>
          <p className="text-gray-400 mb-6">Tell us about your clean tech venture</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${errors.companyName ? 'border-red-500' : 'border-gray-700'
                  }`}
              />
              {errors.companyName && (
                <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Funding Stage */}
            <div>
              <select
                value={formData.fundingStage}
                onChange={(e) => setFormData({ ...formData, fundingStage: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${errors.fundingStage ? 'border-red-500' : 'border-gray-700'
                  }`}
              >
                <option value="">Select Funding Stage *</option>
                {FUNDING_STAGES.map(stage => <option key={stage}>{stage}</option>)}
              </select>
              {errors.fundingStage && (
                <p className="text-red-400 text-sm mt-1">{errors.fundingStage}</p>
              )}
            </div>

            {/* Funding Amount */}
            <div>
              <input
                type="text"
                placeholder="Funding Amount (INR) *"
                value={formData.fundingAmount}
                onChange={(e) => setFormData({ ...formData, fundingAmount: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${errors.fundingAmount ? 'border-red-500' : 'border-gray-700'
                  }`}
              />
              {errors.fundingAmount && (
                <p className="text-red-400 text-sm mt-1">{errors.fundingAmount}</p>
              )}
            </div>

            {/* Funding Purpose */}
            <div>
              <select
                value={formData.fundingPurpose}
                onChange={(e) => setFormData({ ...formData, fundingPurpose: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${errors.fundingPurpose ? 'border-red-500' : 'border-gray-700'
                  }`}
              >
                <option value="">Select Funding Purpose *</option>
                {FUNDING_PURPOSES.map(purpose => <option key={purpose}>{purpose}</option>)}
              </select>
              {errors.fundingPurpose && (
                <p className="text-red-400 text-sm mt-1">{errors.fundingPurpose}</p>
              )}
            </div>

            {/* Current Revenue */}
            <div>
              <input
                type="text"
                placeholder="Current Annual Revenue (Optional)"
                value={formData.currentRevenue}
                onChange={(e) => setFormData({ ...formData, currentRevenue: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white"
              />
            </div>

            {/* Use of Funds */}
            <div>
              <textarea
                rows={4}
                placeholder="Detailed Use of Funds *"
                value={formData.useOfFunds}
                onChange={(e) => setFormData({ ...formData, useOfFunds: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${errors.useOfFunds ? 'border-red-500' : 'border-gray-700'
                  }`}
              />
              {errors.useOfFunds && (
                <p className="text-red-400 text-sm mt-1">{errors.useOfFunds}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${errors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending OTP...' : 'Submit & Verify Email'}
            </button>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
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
