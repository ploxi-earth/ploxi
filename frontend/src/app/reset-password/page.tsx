"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

function parseTokenFromUrl(): { access_token?: string; refresh_token?: string } {
  try {
    // Check hash first (#access_token=...&refresh_token=...)
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const search = typeof window !== 'undefined' ? window.location.search : '';

    const params = new URLSearchParams(hash.replace(/^#/, ''));
    if (params.has('access_token')) {
      return { access_token: params.get('access_token') || undefined, refresh_token: params.get('refresh_token') || undefined };
    }

    const q = new URLSearchParams(search);
    if (q.has('access_token')) {
      return { access_token: q.get('access_token') || undefined, refresh_token: q.get('refresh_token') || undefined };
    }
  } catch (e) {
    // ignore
  }
  return {};
}

export default function ResetPassword() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [sessionValidated, setSessionValidated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        if (!supabaseClient) throw new Error('Supabase client not configured');

        // Try supabase helper first (some versions expose getSessionFromUrl)
        // @ts-ignore
        if (typeof supabaseClient.auth.getSessionFromUrl === 'function') {
          try {
            // getSessionFromUrl will parse the URL and set the session when possible
            // @ts-ignore
            const { data, error } = await supabaseClient.auth.getSessionFromUrl();
            if (error) {
              // continue to manual parsing
              console.debug('getSessionFromUrl error', error.message);
            } else if (data?.session) {
              setSessionValidated(true);
              setInitialized(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore and try manual
          }
        }

        // Manual parse
        const tokens = parseTokenFromUrl();
        if (tokens.access_token) {
          // set session using access_token (and refresh token if present)
          // @ts-ignore
          const { data, error } = await supabaseClient.auth.setSession({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          });
          if (error || !data?.session) {
            setError('Invalid or expired reset link.');
          } else {
            setSessionValidated(true);
          }
        } else {
          setError('Invalid or expired reset link.');
        }
      } catch (e) {
        console.error('Reset init error', e);
        setError('Invalid or expired reset link.');
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      if (!supabaseClient) throw new Error('Supabase client not configured');
      const { data, error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        console.error('updateUser error', error);
        setError(error.message || 'Failed to update password.');
      } else {
        setSuccess(true);
        // Optional: redirect to login after short delay
        setTimeout(() => router.push('/auth/login'), 2500);
      }
    } catch (e) {
      console.error('Reset submit error', e);
      setError('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={120} height={48} className="h-12 w-auto object-contain" />
        </Link>
        <h2 className="text-center text-2xl font-bold text-gray-900">Set new password</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-2xl sm:px-10 border border-gray-100">
          {!initialized || loading ? (
            <div className="text-center">Verifying reset link…</div>
          ) : error ? (
            <div>
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              <div className="text-center">
                <Link href="/auth/forgot-password" className="btn-primary inline-block">Request a new reset link</Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password updated!</h3>
              <p className="text-sm text-gray-600">Redirecting you to login…</p>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">New Password</label>
                  <input className="input-field" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input className="input-field" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" autoComplete="new-password" />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Updating...' : 'Update password'}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
