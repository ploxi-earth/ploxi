'use client';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function CleanTechSuccess() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-2xl p-12 text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for registering your clean tech business.  
          Our team will review your details and get in touch soon.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all"
        >
          Back to Ploxi Home
        </button>
      </div>
    </div>
  );
}
