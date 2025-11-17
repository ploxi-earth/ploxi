'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TrendingUp, Briefcase, Users } from 'lucide-react';

export default function ClimateFinanceRegistrationLanding() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-10 max-w-3xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Climate Finance</h2>
          <p className="text-gray-400">How would you like to engage with us?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button
            onClick={() => router.push('/climate-finance/raise-funding-registration')}
            className="p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl hover:border-green-500 hover:bg-gray-800/50 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30">
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Raise Funding</h3>
            <p className="text-gray-400 text-sm">Seeking investment for your clean tech venture</p>
          </button>
          <button
            onClick={() => router.push('/climate-finance/investor-registration')}
            className="p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl hover:border-purple-500 hover:bg-gray-800/50 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30">
              <Briefcase className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">I'm an Investor</h3>
            <p className="text-gray-400 text-sm">Looking to invest in climate solutions</p>
          </button>
          <button
            onClick={() => router.push('/climate-finance/participant-registration')}
            className="p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl hover:border-blue-500 hover:bg-gray-800/50 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Participate</h3>
            <p className="text-gray-400 text-sm">Join events and seek consultation</p>
          </button>
        </div>
      </div>
    </div>
  );
}
