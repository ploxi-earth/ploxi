'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Building2,
  MapPin,
  Target,
  Eye,
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  Download,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  Settings,
  Briefcase,
  Globe,
  TrendingDown,
  PieChart,
  BarChart3,
  ExternalLink,
  Send,
  Clock,
  AlertCircle,
  Edit,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function InvestorDashboard() {
  const router = useRouter();
  const [investorProfile, setInvestorProfile] = useState(null);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedFinancingType, setSelectedFinancingType] = useState('all');

  // Mock events data
  const [events] = useState([
    {
      id: 1,
      title: 'Climate Tech Pitch Day',
      date: '2025-10-25',
      time: '10:00 AM - 4:00 PM',
      location: 'Bangalore, India',
      type: 'Pitching',
      description: '15 clean tech startups presenting to investors',
      registrations: 45,
      capacity: 100,
      rsvp: false
    },
    {
      id: 2,
      title: 'Green Finance Summit 2025',
      date: '2025-11-10',
      time: '9:00 AM - 6:00 PM',
      location: 'Mumbai, India',
      type: 'Conference',
      description: 'Annual summit on climate finance and investment',
      registrations: 230,
      capacity: 500,
      rsvp: false
    },
    {
      id: 3,
      title: 'Renewable Energy Investor Meetup',
      date: '2025-10-30',
      time: '6:00 PM - 9:00 PM',
      location: 'Virtual',
      type: 'Networking',
      description: 'Connect with renewable energy ventures',
      registrations: 78,
      capacity: 150,
      rsvp: true
    }
  ]);

  const [consultations] = useState([
    {
      id: 1,
      company: 'SolarTech Innovations',
      requestDate: '2025-10-08',
      status: 'pending',
      type: 'Fundraising Strategy',
      message: 'Seeking advice on Series A fundraising for solar panel manufacturing'
    },
    {
      id: 2,
      company: 'AquaPure Systems',
      requestDate: '2025-10-10',
      status: 'scheduled',
      type: 'Investment Terms',
      message: 'Need consultation on term sheet negotiation',
      scheduledFor: '2025-10-20'
    }
  ]);

  // Load investor profile and funding requests
  useEffect(() => {
    const profile = sessionStorage.getItem('investor-profile');
    if (profile) {
      try {
        setInvestorProfile(JSON.parse(profile));
      } catch (error) {
        console.error('Failed to load investor profile');
      }
    }

    const requests = JSON.parse(sessionStorage.getItem('funding-requests') || '[]');
    setFundingRequests(requests);
    setFilteredRequests(requests);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = fundingRequests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.pitch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.solutionTypes?.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(req => 
        req.solutionTypes?.includes(selectedSector)
      );
    }

    // Stage filter
    if (selectedStage !== 'all') {
      filtered = filtered.filter(req => req.fundingStage === selectedStage);
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(req => 
        req.geographies?.includes(selectedRegion)
      );
    }

    // Financing type filter
    if (selectedFinancingType !== 'all') {
      filtered = filtered.filter(req => 
        req.financeSubType?.includes(selectedFinancingType) ||
        (selectedFinancingType === 'equity' && req.equityOffered)
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, selectedSector, selectedStage, selectedRegion, selectedFinancingType, fundingRequests]);

  // Navigation items
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'portfolio', label: 'My Pipeline', icon: Briefcase },
    { id: 'consultations', label: 'Consultations', icon: MessageSquare },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: Users }
  ];

  const handleRSVP = (eventId) => {
    alert(`RSVP functionality for event ${eventId} - Ready for backend integration`);
  };

  const handleViewDetails = (request) => {
    // Store selected opportunity for detailed view
    sessionStorage.setItem('selected-opportunity', JSON.stringify(request));
    alert('Detailed view page - Ready for implementation');
  };

  const handleContactVendor = (request) => {
    alert(`Contact form for ${request.companyName} - Ready for backend integration`);
  };

  if (!investorProfile && activeTab !== 'opportunities') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Complete Your Profile</h2>
          <p className="text-gray-400 mb-6">
            Please complete your investor profile to access the full dashboard
          </p>
          <button
            onClick={() => router.push('/climate-finance/investor-registration')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Image
                src="/images/ploxi earth logo.jpeg"
                alt="Ploxi"
                width={48}
                height={48}
                className="h-12 w-12 object-contain rounded-xl bg-white p-1"
                priority
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Ploxi Climate Finance</h1>
                <p className="text-sm text-purple-300">Investor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => router.push('/climate-finance')}
                className="px-4 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:sticky lg:translate-x-0 top-16 left-0 z-40 h-[calc(100vh-4rem)]
            w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 transition-transform duration-300
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
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
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
        <main className="flex-1 p-6 lg:p-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && investorProfile && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {investorProfile.firstName}!</h2>
                <p className="text-gray-400">Here's your investment dashboard overview</p>
              </div>

              {/* Profile Summary Card */}
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl border-2 border-purple-500/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{investorProfile.organizationName}</h3>
                      <p className="text-purple-300">{investorProfile.organizationType}</p>
                      {investorProfile.fundName && (
                        <p className="text-gray-400 text-sm mt-1">{investorProfile.fundName}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/climate-finance/investor-registration')}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Fund Size</p>
                    <p className="text-white font-semibold">{investorProfile.fundSizeRange || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Focus Sectors</p>
                    <p className="text-white font-semibold">{investorProfile.sectors?.length || 0} sectors</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Geographies</p>
                    <p className="text-white font-semibold">{investorProfile.geographicFocus?.length || 0} regions</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Investment Stages</p>
                    <p className="text-white font-semibold">{investorProfile.investmentStages?.length || 0} stages</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Opportunities', value: fundingRequests.length, icon: Target, gradient: 'from-purple-600 to-pink-600' },
                  { label: 'Matched Projects', value: filteredRequests.length, icon: CheckCircle, gradient: 'from-green-600 to-emerald-600' },
                  { label: 'Pending Consultations', value: consultations.filter(c => c.status === 'pending').length, icon: MessageSquare, gradient: 'from-blue-600 to-cyan-600' },
                  { label: 'Upcoming Events', value: events.filter(e => new Date(e.date) > new Date()).length, icon: Calendar, gradient: 'from-orange-600 to-red-600' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-gray-900 rounded-2xl p-6 border-2 border-gray-800">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Access Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Opportunities */}
                <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Opportunities</h3>
                    <button
                      onClick={() => setActiveTab('opportunities')}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {filteredRequests.slice(0, 3).map((req) => (
                      <div key={req.id} className="p-4 bg-gray-800 rounded-xl hover:bg-gray-800/70 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-white">{req.companyName}</h4>
                            <p className="text-sm text-gray-400">{req.fundingStage}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                            Clean Tech
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-purple-400 mb-2">{req.fundingAmount}</p>
                        <div className="flex flex-wrap gap-2">
                          {req.solutionTypes?.slice(0, 2).map(type => (
                            <span key={type} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {events.filter(e => new Date(e.date) > new Date()).slice(0, 3).map((event) => (
                      <div key={event.id} className="p-4 bg-gray-800 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                            <p className="text-sm text-gray-400 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </p>
                          </div>
                          {event.rsvp ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                              Registered
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRSVP(event.id)}
                              className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs hover:bg-purple-700"
                            >
                              RSVP
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OPPORTUNITIES TAB */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Funding Opportunities</h2>
                <p className="text-gray-400">Browse and filter investment opportunities</p>
              </div>

              {/* Filters */}
              <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search companies, solutions..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>
                  </div>

                  {/* Sector Filter */}
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="all">All Sectors</option>
                    {investorProfile?.sectors?.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>

                  {/* Stage Filter */}
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="all">All Stages</option>
                    <option value="Pre-seed">Pre-seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Growth/Expansion">Growth</option>
                  </select>

                  {/* Region Filter */}
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="all">All Regions</option>
                    {investorProfile?.geographicFocus?.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">
                    Showing <strong className="text-white">{filteredRequests.length}</strong> of {fundingRequests.length} opportunities
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSector('all');
                      setSelectedStage('all');
                      setSelectedRegion('all');
                      setSelectedFinancingType('all');
                    }}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Opportunities List */}
              <div className="space-y-6">
                {filteredRequests.length === 0 ? (
                  <div className="bg-gray-900 rounded-2xl p-12 text-center border-2 border-gray-800">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No opportunities match your filters</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div key={request.id} className="bg-gray-900 rounded-2xl border-2 border-gray-800 hover:border-purple-500/50 transition-all overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{request.companyName}</h3>
                              {request.vendorContext?.source === 'cleantech' && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                                  ✓ Clean Tech Verified
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {request.solutionTypes?.slice(0, 4).map(type => (
                                <span key={type} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400 mb-1">Seeking</p>
                            <p className="text-2xl font-bold text-purple-400">{request.fundingAmount}</p>
                            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold mt-2 border border-purple-500/30">
                              {request.fundingStage}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4 line-clamp-2">{request.pitch}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Purpose</p>
                            <p className="text-sm font-semibold text-gray-300">{request.fundingPurpose}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Current Revenue</p>
                            <p className="text-sm font-semibold text-gray-300">{request.currentRevenue || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Equity</p>
                            <p className="text-sm font-semibold text-gray-300">{request.equityOffered || 'Negotiable'}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Industries</p>
                            <p className="text-sm font-semibold text-gray-300">{request.industries?.length || 0} sectors</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-800">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {request.geographies?.length || 0} regions
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(request.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="px-4 py-2 text-purple-400 border-2 border-purple-500/50 rounded-lg hover:bg-purple-500/10 transition-colors text-sm font-semibold"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleContactVendor(request)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-semibold flex items-center"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">My Pipeline</h2>
                <p className="text-gray-400">Track your investment pipeline and portfolio</p>
              </div>

              <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Active Pipeline</h3>
                <p className="text-gray-400 mb-6">Start engaging with opportunities to build your pipeline</p>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Browse Opportunities
                </button>
              </div>
            </div>
          )}

          {/* CONSULTATIONS TAB */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Consultation Requests</h2>
                <p className="text-gray-400">Manage consultation requests from ventures</p>
              </div>

              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{consultation.company}</h3>
                        <p className="text-sm text-gray-400">{consultation.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        consultation.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {consultation.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{consultation.message}</p>
                    {consultation.scheduledFor && (
                      <p className="text-sm text-purple-400 mb-4">
                        Scheduled for: {new Date(consultation.scheduledFor).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        Respond
                      </button>
                      <button className="px-4 py-2 text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Events & Opportunities</h2>
                <p className="text-gray-400">Upcoming pitching events and networking opportunities</p>
              </div>

              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{event.title}</h3>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
                            {event.type}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {event.registrations}/{event.capacity} registered
                          </span>
                        </div>
                      </div>
                      <div className="ml-6">
                        {event.rsvp ? (
                          <div className="text-center">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                            <p className="text-green-400 font-semibold">Registered</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRSVP(event.id)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all whitespace-nowrap"
                          >
                            RSVP Now
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && investorProfile && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
                  <p className="text-gray-400">View and manage your investor profile</p>
                </div>
                <button
                  onClick={() => router.push('/climate-finance/investor-registration')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Name</p>
                      <p className="text-white font-semibold">{investorProfile.firstName} {investorProfile.lastName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="text-white font-semibold">{investorProfile.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>
                      <p className="text-white font-semibold">{investorProfile.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Designation</p>
                      <p className="text-white font-semibold">{investorProfile.designation || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Fund Details */}
                <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Fund Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Organization</p>
                      <p className="text-white font-semibold">{investorProfile.organizationName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Type</p>
                      <p className="text-white font-semibold">{investorProfile.organizationType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Fund Size</p>
                      <p className="text-white font-semibold">{investorProfile.fundSizeRange || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Vintage</p>
                      <p className="text-white font-semibold">{investorProfile.fundVintage || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Investment Focus */}
                <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Investment Focus</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Sectors ({investorProfile.sectors?.length || 0})</p>
                      <div className="flex flex-wrap gap-2">
                        {investorProfile.sectors?.map(sector => (
                          <span key={sector} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Investment Stages ({investorProfile.investmentStages?.length || 0})</p>
                      <div className="flex flex-wrap gap-2">
                        {investorProfile.investmentStages?.map(stage => (
                          <span key={stage} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Geographic Focus ({investorProfile.geographicFocus?.length || 0})</p>
                      <div className="flex flex-wrap gap-2">
                        {investorProfile.geographicFocus?.map(region => (
                          <span key={region} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ESG Focus */}
                <div className="bg-gray-900 rounded-2xl border-2 border-gray-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">ESG & Impact</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-2">ESG Focus Areas ({investorProfile.esgFocus?.length || 0})</p>
                      <div className="flex flex-wrap gap-2">
                        {investorProfile.esgFocus?.map(area => (
                          <span key={area} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-2">SDG Alignment</p>
                      <div className="flex flex-wrap gap-2">
                        {investorProfile.sdgAlignment?.map(sdg => (
                          <span key={sdg} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                            SDG {sdg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
