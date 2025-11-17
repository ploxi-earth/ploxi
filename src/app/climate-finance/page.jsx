import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export default function ClimateFinancePage() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
    <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 text-sm sm:text-base"
            >
              ← Back to Ploxi
            </Link>
            <div className="border-l border-gray-700 pl-0 sm:pl-4 flex items-center space-x-3">
              <Image
                src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                alt="Ploxi"
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-xl bg-white p-1"
                priority
              />
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Ploxi Climate Finance
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">
                  Investment & Funding
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Centered main section */}
    <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="bg-gray-900 rounded-3xl border-2 border-gray-800 shadow-2xl p-6 sm:p-10 md:p-16 max-w-4xl w-full text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
          <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
          Climate Finance Solutions
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
          Connect clean technology providers with climate-focused investors and
          funding opportunities
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12">
          <Link
            href="/climate-finance/registration"
            className="p-5 sm:p-6 border-2 border-purple-500/30 rounded-2xl hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">
              Registration
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Submit your funding application and connect with investors
            </p>
            <span className="text-purple-400 font-semibold flex items-center text-sm sm:text-base">
              Get Started <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </span>
          </Link>

          {/* This is climate finance quick assesment of dashboard */}
          {/* <Link
            href="/climate-finance/dashboard"
            className="p-6 border-2 border-blue-500/30 rounded-2xl hover:border-blue-500 hover:bg-blue-500/10 transition-all text-left"
          >
            <Users className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Investor Dashboard</h3>
            <p className="text-gray-400 text-sm mb-4">Browse funding opportunities and connect with ventures</p>
            <span className="text-blue-400 font-semibold flex items-center">
              View Opportunities <ArrowRight className="w-4 h-4 ml-2" />
            </span>
          </Link> */}
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t-2 border-gray-800">
          {[
            { icon: DollarSign, label: 'Carbon Credits', count: '12+' },
            { icon: TrendingUp, label: 'Green Bonds', count: '8+' },
            { icon: Target, label: 'Impact Investment', count: '20+' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="text-center">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-1 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-white">{item.count}</p>
                <p className="text-xs sm:text-sm text-gray-400">{item.label}</p>
              </div>
            );
          })}
        </div> */}
      </div>
    </main>
  </div>
);

}
