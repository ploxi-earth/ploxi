'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isVerifying?: boolean;
};

export default function OTPModal({ isOpen, onClose, email, onVerify, onResend, isVerifying = false }: Props) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const r0 = useRef<HTMLInputElement>(null);
  const r1 = useRef<HTMLInputElement>(null);
  const r2 = useRef<HTMLInputElement>(null);
  const r3 = useRef<HTMLInputElement>(null);
  const r4 = useRef<HTMLInputElement>(null);
  const r5 = useRef<HTMLInputElement>(null);
  const inputRefs = [r0, r1, r2, r3, r4, r5];

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

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }

    if (index === 5 && value && newOtp.every((digit) => digit !== '')) {
      void handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
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
      const msg = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(msg);
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
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isVerifying}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Mail className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="mb-8 text-center text-gray-600">
          We&apos;ve sent a 6-digit code to
          <br />
          <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <div className="mb-6 flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isVerifying}
              className={`h-14 w-12 rounded-lg border-2 text-center text-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                error ? 'border-red-500' : 'border-gray-300'
              } ${digit ? 'border-emerald-500' : ''}`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={otp.some((digit) => !digit) || isVerifying}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the code?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={isVerifying}
                className="font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-400">Resend in {timer}s</span>
            )}
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">Check your spam folder if you don&apos;t see the email.</p>
      </div>
    </div>
  );
}
