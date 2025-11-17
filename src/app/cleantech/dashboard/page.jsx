'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard,
  User,
  Edit,
  Handshake,
  FileText,
  TrendingUp,
  ShoppingCart,
  Eye,
  MessageSquare,
  Send,
  LogOut,
  Menu,
  X,
  BarChart3,
  DollarSign,
  Package,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Filter,
  Search,
  Download,
  Plus,
  Star,
  Building2
} from 'lucide-react';

export default function VendorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vendorData, setVendorData] = useState(null);
  const [stats, setStats] = useState({
    views: 1247,
    enquiries: 23,
    activeDeals: 5,
    revenue: 450000
  });

  // Load vendor data
  useEffect(() => {
    const vendors = JSON.parse(sessionStorage.getItem('cleantech-vendors') || '[]');
    if (vendors.length > 0) {
      setVendorData(vendors[0]); // Get first vendor for demo
    } else {
      // Mock data if no vendor exists
      setVendorData({
        companyName: 'Clean Tech Solutions',
        serviceName: 'Advanced Solar Panel Systems',
        category: 'Renewable Energy',
        shortDescription: 'Leading provider of efficient solar energy solutions',
        detailedDescription: 'We provide cutting-edge solar panel systems...',
        contactEmail: 'contact@cleantech.com',
        location: 'Bangalore, India',
        yearFounded: '2020',
        teamSize: '11-50 employees'
      });
    }
  }, []);

  // Mock enquiries data
  const [enquiries] = useState([
    {
      id: 1,
      company: 'Tech Industries Ltd',
      contactPerson: 'John Smith',
      email: 'john@techindustries.com',
      message: 'Interested in your solar panel installation services for our facility.',
      date: '2025-10-10',
      status: 'new',
      priority: 'high'
    },
    {
      id: 2,
      company: 'Green Corp',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@greencorp.com',
      message: 'Looking for a quote on renewable energy solutions.',
      date: '2025-10-08',
      status: 'responded',
      priority: 'medium'
    },
    {
      id: 3,
      company: 'Eco Manufacturing',
      contactPerson: 'David Lee',
      email: 'david@ecomanuf.com',
      message: 'Need information about your water treatment systems.',
      date: '2025-10-05',
      status: 'responded',
      priority: 'low'
    }
  ]);

  // Mock deals data
  const [deals] = useState([
    {
      id: 1,
      title: 'Solar Installation - Tech Industries',
      company: 'Tech Industries Ltd',
      value: 250000,
      status: 'in-progress',
      progress: 60,
      startDate: '2025-09-15',
      expectedCompletion: '2025-11-30'
    },
    {
      id: 2,
      title: 'Renewable Energy Audit - Green Corp',
      company: 'Green Corp',
      value: 180000,
      status: 'negotiation',
      progress: 30,
      startDate: '2025-10-01',
      expectedCompletion: '2025-12-15'
    },
    {
      id: 3,
      title: 'Complete Solar Setup - Eco Factory',
      company: 'Eco Manufacturing',
      value: 500000,
      status: 'proposal',
      progress: 15,
      startDate: '2025-10-10',
      expectedCompletion: '2026-01-30'
    }
  ]);

  // Navigation items
  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: User },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit },
    { id: 'deals', label: 'Deals', icon: Handshake },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'fund', label: 'Fund', icon: TrendingUp },
    { id: 'sell', label: 'Sell', icon: ShoppingCart },
    { id: 'views', label: 'Views', icon: Eye },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'send-offer', label: 'Send Offer', icon: Send }
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      sessionStorage.clear();
      router.push('/cleantech');
    }
  };

  if (!vendorData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                  alt="Ploxi"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain rounded-lg"
                  priority
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Ploxi</h1>
                  <p className="text-xs text-gray-600">{vendorData.companyName}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:sticky lg:translate-x-0 top-16 left-0 z-40 h-[calc(100vh-4rem)]
            w-64 bg-white border-r-2 border-gray-200 transition-transform duration-300
            overflow-y-auto
          `}
        >
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm border-2 border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                  <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your performance summary</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Views', value: stats.views.toLocaleString(), icon: Eye, color: 'blue', change: '+12%' },
                  { label: 'Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'green', change: '+5' },
                  { label: 'Active Deals', value: stats.activeDeals, icon: Handshake, color: 'purple', change: '+2' },
                  { label: 'Revenue', value: `₹${(stats.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'orange', change: '+18%' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  const colorClasses = {
                    blue: 'bg-blue-100 text-blue-600',
                    green: 'bg-green-100 text-green-600',
                    purple: 'bg-purple-100 text-purple-600',
                    orange: 'bg-orange-100 text-orange-600'
                  };
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                      </div>
                      <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enquiries */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Enquiries</h3>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {enquiries.slice(0, 3).map((enq) => (
                      <div key={enq.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{enq.company}</p>
                            <p className="text-sm text-gray-600">{enq.contactPerson}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            enq.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{enq.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Deals */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Active Deals</h3>
                    <button
                      onClick={() => setActiveTab('deals')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {deals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{deal.title}</p>
                            <p className="text-sm text-gray-600">₹{deal.value.toLocaleString()}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            deal.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                            deal.status === 'negotiation' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {deal.status}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${deal.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">Progress: {deal.progress}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">About Your Listing</h2>
              <p className="text-gray-600">This is how your profile appears to potential buyers</p>
              
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 text-white">
                  <div className="flex items-start space-x-6">
                    {vendorData.logo && (
                      <div className="w-24 h-24 bg-white rounded-xl p-2 flex-shrink-0">
                        <img
                          src={vendorData.logo.url}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{vendorData.serviceName}</h3>
                      <p className="text-blue-100 text-lg mb-3">{vendorData.companyName}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                          {vendorData.category}
                        </span>
                        {vendorData.subcategories?.map(sub => (
                          <span key={sub} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-700 whitespace-pre-line">{vendorData.detailedDescription}</p>
                  </div>

                  {vendorData.keyFeatures?.filter(f => f.trim()).length > 0 && (
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {vendorData.keyFeatures.filter(f => f.trim()).map((feature, idx) => (
                          <div key={idx} className="flex items-start bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h4>
                      <div className="space-y-3">
                        {vendorData.contactEmail && (
                          <div className="flex items-center text-gray-700">
                            <Mail className="w-4 h-4 mr-3 text-gray-500" />
                            {vendorData.contactEmail}
                          </div>
                        )}
                        {vendorData.contactPhone && (
                          <div className="flex items-center text-gray-700">
                            <Phone className="w-4 h-4 mr-3 text-gray-500" />
                            {vendorData.contactPhone}
                          </div>
                        )}
                        {vendorData.website && (
                          <div className="flex items-center text-gray-700">
                            <Globe className="w-4 h-4 mr-3 text-gray-500" />
                            <a href={vendorData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Visit Website
                            </a>
                          </div>
                        )}
                        {vendorData.location && (
                          <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                            {vendorData.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Company Details</h4>
                      <div className="space-y-3 text-gray-700">
                        {vendorData.yearFounded && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                            Founded: {vendorData.yearFounded}
                          </div>
                        )}
                        {vendorData.teamSize && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-3 text-gray-500" />
                            Team: {vendorData.teamSize}
                          </div>
                        )}
                        {vendorData.certificates?.length > 0 && (
                          <div>
                            <div className="flex items-center mb-2">
                              <Award className="w-4 h-4 mr-3 text-gray-500" />
                              Certifications
                            </div>
                            <div className="ml-7 space-y-1">
                              {vendorData.certificates.map((cert, idx) => (
                                <p key={idx} className="text-sm">{cert.name}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDIT PROFILE TAB */}
          {activeTab === 'edit-profile' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-blue-800 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    Profile editing functionality will be available soon. Contact support for urgent updates.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => router.push('/cleantech/add-listing')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Create New Listing
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DEALS TAB */}
          {activeTab === 'deals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Your Deals</h2>
                <div className="flex items-center space-x-3">
                  <select className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>All Status</option>
                    <option>In Progress</option>
                    <option>Negotiation</option>
                    <option>Proposal</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {deals.map((deal) => (
                  <div key={deal.id} className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{deal.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{deal.company}</p>
                        <p className="text-2xl font-bold text-green-600">₹{deal.value.toLocaleString()}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl font-semibold ${
                        deal.status === 'in-progress' 
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                          : deal.status === 'negotiation'
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                      }`}>
                        {deal.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-semibold text-gray-900">{new Date(deal.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expected End</p>
                        <p className="font-semibold text-gray-900">{new Date(deal.expectedCompletion).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-semibold text-gray-900">{deal.progress}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-semibold text-gray-900 capitalize">{deal.status.replace('-', ' ')}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${deal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View Details →
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Update Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TERMS TAB */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Terms & Conditions</h2>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Vendor Partnership Terms</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>These terms govern your use of the Ploxi Clean Tech Vendor Portal and listing services.</p>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">1. Listing Terms</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Maintain accurate and up-to-date information</li>
                        <li>Respond to inquiries within 48 hours</li>
                        <li>Provide honest service descriptions</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">2. Payment Terms</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Currently no listing fees</li>
                        <li>Commission on completed deals (to be introduced)</li>
                        <li>30-day notice for any pricing changes</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">3. Data & Privacy</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Your data is protected and secure</li>
                        <li>We don&apos;t share contact details without consent</li>
                        <li>Analytics data is anonymized</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FUND TAB */}
          {activeTab === 'fund' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Funding Opportunities</h2>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Access Climate Finance</h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Connect with investors and funding programs specifically focused on clean technology and sustainability.
                  </p>
                  <button
                    onClick={() => router.push('/climate-finance')}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center shadow-lg"
                  >
                    Explore Funding Options
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SELL TAB */}
          {activeTab === 'sell' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Marketplace Listings</h2>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Your Active Listings</h3>
                    <p className="text-gray-600">Manage your products and services</p>
                  </div>
                  <button
                    onClick={() => router.push('/cleantech/add-listing')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Listing
                  </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <Package className="w-12 h-12 text-gray-400" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{vendorData.serviceName}</h4>
                      <p className="text-sm text-gray-600 mb-3">{vendorData.shortDescription}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600 font-medium flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Active
                        </span>
                        <span className="text-gray-600">{stats.views} views</span>
                        <span className="text-gray-600">{stats.enquiries} enquiries</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEWS TAB */}
          {activeTab === 'views' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Analytics & Views</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Views', value: '1,247', change: '+12%', period: 'vs last month' },
                  { label: 'Unique Visitors', value: '892', change: '+8%', period: 'vs last month' },
                  { label: 'Avg. Time on Page', value: '2m 34s', change: '+15%', period: 'vs last month' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
                    <p className="text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-600 font-semibold">{stat.change}</span>
                      <span className="text-gray-500 ml-2">{stat.period}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Views Over Time</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[45, 52, 48, 65, 72, 68, 85, 92, 88, 95, 105, 120].map((height, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`Views: ${Math.floor(height * 10)}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Enquiries</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search enquiries..."
                      className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <select className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>All</option>
                    <option>New</option>
                    <option>Responded</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{enq.company}</h3>
                          <p className="text-gray-600">{enq.contactPerson}</p>
                          <p className="text-sm text-gray-500">{enq.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          enq.status === 'new' 
                            ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                            : 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        }`}>
                          {enq.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-2">{new Date(enq.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border-2 border-gray-200">
                      <p className="text-gray-700">{enq.message}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          enq.priority === 'high' ? 'bg-red-500' : enq.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm text-gray-600 capitalize">{enq.priority} priority</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Mark as Read
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Respond
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEND OFFER TAB */}
          {activeTab === 'send-offer' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Send Offer</h2>
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Client/Company Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="client@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Service/Product
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>Select service</option>
                      <option>{vendorData.serviceName}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Quoted Price
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="₹ 0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Validity (Days)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Offer Details
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your offer, scope of work, deliverables, timeline, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Attach Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Click to upload files or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-1">PDF, DOC, XLS up to 10MB</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-gray-200">
                    <button
                      type="button"
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Save as Draft
                    </button>
                    {/* <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                    >
                      Send Offer
                      <Send className="w-5 h-5 ml-2" />
                    </button> */}
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
