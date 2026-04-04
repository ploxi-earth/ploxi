'use client';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { vendorService } from '@/services/vendor.service';
import { VENDOR_PORTAL_PAUSED_MESSAGE, VENDOR_PORTAL_PAUSED_REASON } from '@/lib/vendorAccess';
import { useAuthStore } from '@/store/authStore';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const redirectedReason = searchParams.get('reason');

  useEffect(() => {
    if (redirectedReason === VENDOR_PORTAL_PAUSED_REASON) {
      setError(VENDOR_PORTAL_PAUSED_MESSAGE);
    }
  }, [redirectedReason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authService.vendorLogin({ email, password });
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);
      try {
        const statusRes = await vendorService.getOnboardingStatus();
        const status = statusRes.data?.data?.status;
        router.push(status === 'onboarded' ? '/vendor/portal' : '/vendor');
      } catch {
        router.push('/vendor');
      }
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: { message?: string }; status?: number } })?.response;
      const msg = errData?.data?.message;
      const status = errData?.status;

      if (status === 403) {
        // Vendor pending/rejected — show specific message
        setError(msg || 'Your account is not active. Please contact support.');
      } else {
        setError(msg || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isPausedError = error === VENDOR_PORTAL_PAUSED_MESSAGE;
  const isWarning = isPausedError || error.includes('under review') || error.includes('rejected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={120} height={48} className="h-12 w-auto object-contain" />
        </Link>
        <h2 className="text-center text-2xl font-bold text-gray-900">Vendor Sign In</h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to your vendor portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-start gap-2 ${isWarning
                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                {error.includes('under review') ? (
                  <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>
                ) : isPausedError ? (
                  <><circle cx="12" cy="12" r="10" /><path d="M10 15V9" /><path d="M14 15V9" /></>
                ) : (
                  <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                )}
              </svg>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input className="input-field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="label">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
              </div>
              <input className="input-field" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              New vendor?{' '}
              <Link href="/vendor/register" className="font-medium text-primary-600 hover:text-primary-500">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-3 text-sm text-gray-500">
            <span className="w-5 h-5 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            Loading sign-in page...
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
