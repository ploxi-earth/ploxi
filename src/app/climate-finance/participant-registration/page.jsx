'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Target, Mail } from 'lucide-react';
import OTPModal from '@/components/OTPModal';

export default function ParticipantRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    intentType: [],
  });
  const [errors, setErrors] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const INTENT_OPTIONS = [
    { value: 'events', label: 'Participate in Events', icon: '📅' },
    { value: 'consultation', label: 'Request Consultation', icon: '💡' },
  ];

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (formData.intentType.length === 0) newErrors.intentType = 'Select at least one intent';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleIntent = (value) => {
    setFormData(prev => ({
      ...prev,
      intentType: prev.intentType.includes(value)
        ? prev.intentType.filter(v => v !== value)
        : [...prev.intentType, value]
    }));
    // Clear error when user selects an intent
    if (errors.intentType) {
      setErrors(prev => ({ ...prev, intentType: null }));
    }
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
      const response = await fetch('/api/climate-finance/participant/send-otp', {
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
      const response = await fetch('/api/climate-finance/participant/verify-otp', {
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
        router.push('/climate-finance/participant/success');
      }, 500);

    } catch (error) {
      setIsVerifying(false);
      throw error; // OTPModal will handle the error display
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    const response = await fetch('/api/climate-finance/participant/send-otp', {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex justify-center items-center p-6">
      <div className="bg-gray-900 border-2 border-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Users className="w-8 h-8 text-blue-400 mr-2" /> Participant Registration
        </h2>
        <p className="text-gray-400 mb-6">Join events or request consultations</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${
                  errors.firstName ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${
                  errors.lastName ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
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
                className={`w-full pl-10 pr-4 py-3 bg-gray-800 border-2 rounded-xl text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Organization */}
          <div>
            <input
              type="text"
              placeholder="Organization (optional)"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white"
            />
          </div>

          {/* Intent Selection */}
          <div>
            <p className="text-gray-300 mb-3 font-semibold">Your Intent *</p>
            {errors.intentType && (
              <p className="text-red-400 text-sm mb-2">{errors.intentType}</p>
            )}
            <div className="space-y-3">
              {INTENT_OPTIONS.map(item => (
                <label
                  key={item.value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.intentType.includes(item.value)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.intentType.includes(item.value)}
                    onChange={() => toggleIntent(item.value)}
                    className="w-5 h-5 text-blue-500 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Target className="w-5 h-5 text-blue-400 mx-3" />
                  <span className="text-white font-medium">{item.label}</span>
                  <span className="ml-auto text-2xl">{item.icon}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending OTP...' : 'Submit & Verify Email'}
          </button>
        </form>
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
