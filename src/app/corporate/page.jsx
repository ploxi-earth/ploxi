'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart3, Shield, Users, ChevronDown } from 'lucide-react';
import LocationIndustrySelector from '@/components/common/LocationIndustrySelector';



export default function CorporateLandingPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const assessmentRef = useRef(null); // 👈 create ref

  const handleSelectionChange = (selection) => {
    if (selection.location && selection.industry && selection.framework) {
      setIsNavigating(true);
      localStorage.setItem('dashboardConfig', JSON.stringify(selection));
      const dashboardUrl = `/corporate/dashboard/${selection.location.id}/${selection.industry.id}/${selection.framework.id}`;
      setTimeout(() => router.push(dashboardUrl), 500);
    }
  };

  const handleAssessmentClick = () => {
    setShowAssessment((prev) => {
      const newState = !prev;
      // Scroll only when showing
      if (!prev) {
        setTimeout(() => {
          assessmentRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 200); // give time for section to mount
      }
      return newState;
    });
  };

  const features = [
    {
      icon: BarChart3,
      title: 'ESG Dashboard',
      description: 'Comprehensive analytics and real-time sustainability metrics.',
    },
    {
      icon: Shield,
      title: 'Compliance Management',
      description: 'Stay compliant with global ESG frameworks like GRI, SASB, and BRSR.',
    },
    {
      icon: Users,
      title: 'Solution Marketplace',
      description: 'Discover verified sustainability solution providers and consultants.',
    },
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
    {/* Header */}
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-3 sm:mb-0">
          <Link href="/" className="text-green-600 hover:text-green-700 font-medium mb-2 sm:mb-0">
            ← Back to Ploxi
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-3 sm:pl-4 sm:border-l border-gray-300">
            <Image
              src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
              alt="Ploxi Earth"
              width={48}
              height={48}
              className="rounded-md h-12 w-12 object-contain mb-2 sm:mb-0"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Ploxi Earth</h1>
              <p className="text-sm text-gray-600">Decarbonisation and Net-Zero Marketplace</p>
            </div>
          </div>
        </div>

        <Link
          href="/corporate/register"
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md text-sm sm:text-base"
        >
          Get Started
        </Link>
      </div>
    </header>

    {/* Hero Section */}
    <section className="relative px-4 py-14 sm:py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center">
          {/* Left Side */}
          <div className="text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              <span className="block">Empower Your</span>
              <span className="block text-green-600">Corporate ESG Journey</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-7 sm:leading-8">
              Navigate your sustainability roadmap with personalized ESG insights,
              compliance tracking, and access to a network of verified sustainability partners.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/corporate/register"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-green-600 border border-transparent rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Corporate Registration
                <ArrowRight className="ml-3 h-4 sm:h-5 w-4 sm:w-5" />
              </Link>

              {/* This is for the quick assesment */}
              {/* <button
                onClick={handleAssessmentClick}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-700 bg-white border-2 border-green-600 rounded-xl hover:bg-green-50 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Quick Assessment
                <ChevronDown
                  className={`ml-3 h-5 w-5 transition-transform duration-200 ${showAssessment ? 'rotate-180' : ''
                    }`}
                />
              </button> */}
            </div>
          </div>

          {/* Right Side Features */}
          <div className="mt-12 lg:mt-0 lg:col-span-6 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 w-full max-w-md space-y-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Quick Assessment Section */}
    {showAssessment && (
      <section
        ref={assessmentRef}
        className="relative px-4 py-10 sm:py-12 sm:px-6 lg:px-8 bg-white border-t border-gray-200"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Configure Your ESG Assessment
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Get a personalized sustainability dashboard tailored to your location, industry, and framework.
          </p>

          {/* Steps */}
          {/* <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                ['1', 'Choose Location', 'Select your region'],
                ['2', 'Select Industry', 'Pick your sector'],
                ['3', 'Pick Framework', 'Choose your standard'],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {num}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div> */}

          {isNavigating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-xl p-6 sm:p-8 max-w-sm w-full text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Preparing Dashboard
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Setting up your ESG insights...</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mt-8">
            <LocationIndustrySelector onSelectionChange={handleSelectionChange} className="p-6 sm:p-8" />
          </div>
        </div>
      </section>
    )}

    {/* CTA Section */}
    <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Lead in Sustainability?</h2>
        <p className="text-lg sm:text-xl text-green-100 mb-8">
          Join organizations driving impactful ESG transformations with Ploxi Earth.
        </p>
        <Link
          href="/corporate/register"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-white text-green-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Get Started Today
          <ArrowRight className="ml-3 h-4 sm:h-5 w-4 sm:w-5" />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-x-0 sm:space-x-3 mb-3 md:mb-0">
          <Image
            src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
            alt="Ploxi Earth"
            width={32}
            height={32}
            className="rounded h-8 w-8 mb-2 sm:mb-0"
          />
          <span className="text-gray-300 text-sm sm:text-base">
            © 2025 Ploxi Consult. All rights reserved.
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 md:mt-0">
          Bangalore, India • Corporate ESG & Sustainability Solutions
        </p>
      </div>
    </footer>
  </div>
);

}
