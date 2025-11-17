'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Users,
  TrendingUp,
  Award,
  Globe,
  Sparkles,
  Target,
  BarChart3,
  Lightbulb,
  Star,
  Building2,
  DollarSign
} from 'lucide-react';

export default function CleanTechLandingPage() {
  const benefits = [
    {
      icon: Users,
      title: 'Connect with Corporate Buyers',
      description: 'Access a curated network of enterprises actively seeking clean technology solutions'
    },
    {
      icon: TrendingUp,
      title: 'Showcase Your Innovation',
      description: 'Present your groundbreaking solutions to decision-makers across industries'
    },
    {
      icon: Target,
      title: 'Grow Your Business',
      description: 'Expand your market reach and accelerate revenue growth through strategic partnerships'
    },
    {
      icon: Award,
      title: 'Get Verified & Featured',
      description: 'Build credibility with verified listings and featured placement opportunities'
    }
  ];

  const stats = [
    { value: '500+', label: 'Corporate Buyers', icon: Building2 },
    { value: '150+', label: 'Clean Tech Vendors', icon: Lightbulb },
    { value: '₹200Cr+', label: 'Deals Facilitated', icon: DollarSign },
    { value: '25+', label: 'Countries', icon: Globe }
  ];

  const testimonials = [
    {
      company: 'SolarTech Innovations',
      quote: 'Ploxi helped us connect with 15 enterprise clients in the first quarter. The platform is a game-changer for clean tech vendors.',
      author: 'Rajesh Kumar',
      role: 'CEO',
      rating: 5
    },
    {
      company: 'AquaPure Systems',
      quote: 'The quality of leads and the ease of showcasing our water treatment solutions exceeded our expectations.',
      author: 'Priya Sharma',
      role: 'Founder',
      rating: 5
    },
    {
      company: 'GreenWaste Solutions',
      quote: 'From registration to closing deals, the entire process is seamless. Highly recommend for any clean tech company.',
      author: 'Michael Chen',
      role: 'Director',
      rating: 5
    }
  ];

  return (
  <div className="min-h-screen bg-white flex flex-col">
    {/* Header with Ploxi Branding */}
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-600 transition-colors text-sm font-medium"
          >
            ← Back to Main
          </Link>
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
              alt="Ploxi"
              width={48}
              height={48}
              className="h-12 w-12 object-contain rounded-xl transition-transform group-hover:scale-105"
              priority
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ploxi</h1>
              <p className="text-xs text-gray-600">Empowering Sustainable Business Growth</p>
            </div>
          </Link>
          
        </div>
      </div> */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center flex-wrap justify-center sm:justify-start space-x-0 sm:space-x-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-2 sm:mb-0">
            ← Back to Ploxi
          </Link>
          <div className="flex items-center space-x-3 sm:pl-4 sm:border-l border-gray-300">
            <Image
              src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
              alt="Ploxi Earth"
              width={48}
              height={48}
              className="rounded-md h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Ploxi Earth</h1>
              <p className="text-xs sm:text-sm text-gray-600">Decarbonisation and Net-Zero Marketplace</p>
            </div>
          </div>
        </div>

        <Link
          href="/cleantech/registration"
          className="w-full sm:w-auto text-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          Get Started
        </Link>
      </div>
    </header>

    {/* Hero Section */}
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6 sm:mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Clean Tech Marketplace</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Connect Your <span className="text-blue-600">Clean Tech</span>
            <br className="hidden sm:block" /> Solutions with Enterprise Buyers
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the leading marketplace connecting innovative clean technology providers 
            with corporations committed to sustainability. Showcase your solutions, generate 
            qualified leads, and accelerate your growth.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/cleantech/registration"
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Start Clean Tech Registration
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* <Link
              href="/cleantech/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Quick Access Dashboard
              <BarChart3 className="ml-2 w-5 h-5" />
            </Link> */}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free Registration</span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No Commission on Deals</span>
            </div> */}
            {/* <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Verified Buyers</span>
            </div> */}
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Accelerate Your Growth?
        </h3>
        <p className="text-base sm:text-lg md:text-xl mb-10 text-blue-100">
          Join hundreds of clean tech vendors connecting with enterprise buyers on Ploxi
        </p>
        <Link
          href="/cleantech/registration"
          className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl w-full sm:w-auto"
        >
          Start Your Registration Now
          <ArrowRight className="ml-3 w-5 sm:w-6 h-5 sm:h-6" />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <Image
              src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
              alt="Ploxi"
              width={32}
              height={32}
              className="h-8 w-8 object-contain rounded"
            />
            <div>
              <p className="font-semibold">Ploxi</p>
              <p className="text-xs text-gray-400">Empowering Sustainable Business Growth</p>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">© 2025 Ploxi. All rights reserved.</p>
            <p className="text-gray-400 text-sm">Bangalore, India</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

}
