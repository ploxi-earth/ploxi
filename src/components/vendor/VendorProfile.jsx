// src/components/vendor/VendorProfile.jsx
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Star, 
  Building, 
  CheckCircle,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import ContactForm from './ContactForm';
import RelatedVendors from './RelatedVendors';
import vendorsData from '@/data/vendors.json';

const VendorProfile = ({ vendor }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const router = useRouter();

  // Get vendor logo emoji
  const getVendorLogo = () => {
    const logoEmojis = {
      'Energy': '⚡',
      'Water': '💧',
      'Waste': '♻️',
      'Analytics': '📊',
      'Consulting': '🏢'
    };
    return logoEmojis[vendor.type] || '🏢';
  };

  // Region display mapping
  const regionNames = {
    'IN': 'India',
    'US': 'United States',
    'EU': 'European Union',
    'AE': 'United Arab Emirates'
  };

  // Mock case studies
  const mockCaseStudies = [
    {
      id: 1,
      clientName: "GreenTech Manufacturing",
      clientLogo: "🏭",
      testimonial: "Exceptional service and innovative solutions. Reduced our carbon footprint by 40% in just 6 months.",
      project: "Carbon Reduction Initiative",
      result: "40% emissions reduction"
    },
    {
      id: 2,
      clientName: "EcoFlow Industries",
      clientLogo: "🌱",
      testimonial: "Professional team with deep expertise in sustainability. Highly recommended for ESG transformation.",
      project: "ESG Compliance Program",
      result: "100% regulatory compliance"
    }
  ];

  // Type colors
  const typeColors = {
    Energy: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    Water: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    Waste: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    Analytics: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    Consulting: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  };

  const typeStyle = typeColors[vendor.type] || typeColors.Consulting;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href="/marketplace" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Marketplace
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{vendor.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push('/marketplace');
            }
          }}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-start space-x-6">
                {/* Vendor Logo */}
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-4xl flex-shrink-0">
                  {getVendorLogo()}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {vendor.name}
                      </h1>
                      <div className="flex items-center space-x-4 mb-4">
                        <span 
                          className={`
                            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border} border
                          `}
                        >
                          {vendor.type} Solutions
                        </span>
                        {vendor.rating && (
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              {vendor.rating?.toFixed(1)} rating
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Info Row */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    {vendor.contact?.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{vendor.contact.email}</span>
                      </div>
                    )}
                    {vendor.contact?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{vendor.contact.phone}</span>
                      </div>
                    )}
                    {vendor.website && (
                      <a 
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {vendor.name}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {vendor.description}
              </p>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Mission</h3>
                <p className="text-green-800">
                  Empowering organizations to achieve their sustainability goals through innovative 
                  {vendor.type.toLowerCase()} solutions and expert guidance.
                </p>
              </div>
            </div>

            {/* Solutions Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Solutions & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendor.solutions?.map((solution, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {solution.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Advanced {solution.replace('_', ' ')} solutions tailored for sustainable operations 
                      and regulatory compliance.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Studies Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Success Stories</h2>
              <div className="space-y-6">
                {mockCaseStudies.map((study) => (
                  <div key={study.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{study.clientLogo}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{study.clientName}</h3>
                          <span className="text-sm text-green-600 font-medium">{study.result}</span>
                        </div>
                        <p className="text-gray-700 italic mb-3">&quot;{study.testimonial}&quot;</p>

                        <p className="text-sm text-gray-600">
                          <strong>Project:</strong> {study.project}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Contact {vendor.name}
              </button>
            </div>

            {/* Industries & Coverage */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Industries Served</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {vendor.targetIndustries?.map((industry, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                  >
                    <Building className="w-3 h-3 mr-1" />
                    {industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Geographic Coverage</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.targetRegions?.map((region, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {regionNames[region] || region}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {vendor.certifications && vendor.certifications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {vendor.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integration Capabilities */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Integration Capabilities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">REST API Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">ESG Reporting Frameworks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">Data Analytics Platforms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">Cloud Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Vendors Section */}
        <div className="mt-16">
          <RelatedVendors currentVendor={vendor} allVendors={vendorsData.vendors} />
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          vendor={vendor}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
};

export default VendorProfile;
