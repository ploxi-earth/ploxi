'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={120} height={48} className="h-12 w-auto object-contain" />
        </Link>
        <h2 className="text-center text-2xl font-bold text-gray-900">Vendor registration</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We verify your work email with a one-time code (sent via Supabase Auth / your project SMTP such as Brevo).
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-2xl sm:px-10 border border-gray-100 text-center">
          <Link href="/vendor/register" className="btn-primary inline-flex w-full justify-center">
            Continue to register with email OTP
          </Link>
          <p className="mt-4 text-xs text-gray-500">
            You will create your password, then enter the 6-digit code we email you.
          </p>
        </div>
      </div>
    </div>
  );
}
