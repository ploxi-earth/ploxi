'use client';

import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Briefcase, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">

      {/* NAVBAR (TOP) */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Left section */}
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
              <Link
                href="/climate-finance"
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

      {/* PAGE CONTENT — centered below the header */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 shadow-2xl p-10 max-w-3xl w-full">

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to Climate Finance
            </h2>
            <p className="text-gray-400">
              How would you like to engage with us?
            </p>
          </div>

          {/* 3 options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Raise Funding */}
            <button
              onClick={() => router.push('/climate-finance/raise-funding-registration')}
              className="p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl hover:border-green-500 hover:bg-gray-800/50 transition-all text-center group"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Raise Funding</h3>
              <p className="text-gray-400 text-sm">
                Seeking investment for your clean tech venture
              </p>
            </button>

            {/* Investor */}
            <button
              onClick={() => router.push('/climate-finance/investor-registration')}
              className="p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl hover:border-purple-500 hover:bg-gray-800/50 transition-all text-center group"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30">
                <Briefcase className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">I'm an Investor</h3>
              <p className="text-gray-400 text-sm">
                Looking to invest in climate solutions
              </p>
            </button>

            {/* Participant */}
            <button
              onClick={() => router.push('/climate-finance/participant-registration')}
              className="p-8 bg-gray-800 border-2 border-gray-700 rounded-2xl hover:border-blue-500 hover:bg-gray-800/50 transition-all text-center group"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Participate</h3>
              <p className="text-gray-400 text-sm">
                Join events and seek consultation
              </p>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
