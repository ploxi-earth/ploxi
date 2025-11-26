'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Zap, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function MainLandingPage() {
  const services = [
    {
      id: 'corporate',
      title: 'Corporate & Industry',
      subtitle: 'Marketplace',
      // description: 'ESG analytics, sustainability reporting, and compliance solutions for corporations',
      icon: Building2,
      features: [
        'ESG Dashboard',
        'Sustainability Reporting', 
        'Compliance Management',
        'Vendor Marketplace'
      ],
      href: '/corporate',
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      id: 'cleantech',
      title: 'Clean Tech',
      subtitle: 'Vendors & Solutions',
      // description: 'Technology vendors, innovation showcase, and solution matching for clean technology',
      icon: Zap,
      features: [
        'Technology Vendors',
        'Innovation Showcase',
        'Solution Matching', 
        'Partnership Opportunities'
      ],
      href: '/cleantech',
      gradient: 'from-blue-500 to-cyan-600',
      hoverGradient: 'hover:from-blue-600 hover:to-cyan-700'
    },
    {
      id: 'climate-finance',
      title: 'Climate Finance',
      subtitle: 'Investment & Funding',
      // description: 'Climate finance solutions, carbon credits, and sustainable investment opportunities',
      icon: TrendingUp,
      features: [
        'Carbon Credits',
        'Green Bonds',
        'Impact Investment',
        'ESG Funds'
      ],
      href: '/climate-finance',
      gradient: 'from-purple-500 to-indigo-600',
      hoverGradient: 'hover:from-purple-600 hover:to-indigo-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
            <Image
              src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
              alt="Ploxi"
              width={64}
              height={64}
              className="h-16 w-16 object-contain rounded-xl mb-3 sm:mb-0 sm:mr-4"
              priority
            />
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Ploxi</h1>
              <p className="text-md sm:text-lg text-green-600 font-medium">
                Empowering Sustainable Business Growth
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 sm:py-14 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive ESG Solutions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Transform your sustainability journey with our integrated platform connecting
            corporations, technology providers, and financial solutions.
          </p>

          {/* Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mb-10">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                >
                  <div className="p-6 sm:p-8">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 transition-all duration-300 ${service.hoverGradient}`}
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-green-600 font-medium text-xs sm:text-sm mb-4">
                      {service.subtitle}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={service.href}
                      className={`inline-flex items-center justify-center w-full px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-semibold text-sm sm:text-lg transition-all duration-300 transform group-hover:scale-105 ${service.hoverGradient} shadow-md hover:shadow-lg`}
                    >
                      Explore Ploxi Earth
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
              <Image
                src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                alt="Ploxi"
                width={32}
                height={32}
                className="h-8 w-8 object-contain rounded mb-3 sm:mb-0 sm:mr-3"
              />
              <span className="text-lg sm:text-xl font-semibold">Ploxi</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base mb-3">
              Empowering Sustainable Business Growth
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Bangalore, India • © 2025 Ploxi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
