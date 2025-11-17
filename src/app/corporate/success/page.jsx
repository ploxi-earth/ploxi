'use client';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function CorporateSuccess() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border-2 border-green-500 shadow-2xl p-12 text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Ploxi Earth!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Your corporate registration is complete. We'll be in touch soon with next steps.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
