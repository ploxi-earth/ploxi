'use client'
import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function OTPModal({ 
  isOpen, 
  onClose, 
  email, 
  onVerify, 
  onResend,
  isVerifying = false 
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      inputRefs[0]?.current?.focus();
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }

    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs[lastFilledIndex]?.current?.focus();
  };

  const handleVerify = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    try {
      await onVerify(otpCode);
      setSuccess('Verification successful!');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs[0]?.current?.focus();
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    
    try {
      await onResend();
      setSuccess('OTP resent successfully!');
      setTimeout(() => setSuccess(''), 3000);
      inputRefs[0]?.current?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4">
        <button
          onClick={onClose}
          disabled={isVerifying}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We've sent a 6-digit code to<br />
          <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isVerifying}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500 transition-all
                ${error ? 'border-red-500' : 'border-gray-300'}
                ${digit ? 'border-green-500' : ''}
                disabled:bg-gray-100 disabled:cursor-not-allowed
              `}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          onClick={() => handleVerify()}
          disabled={otp.some(digit => !digit) || isVerifying}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold
            hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isVerifying}
                className="text-green-600 font-semibold hover:text-green-700 disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-400">
                Resend in {timer}s
              </span>
            )}
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}
