'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Store, 
  ShoppingCart, 
  Leaf, 
  Award, 
  Shield, 
  TrendingUp,
  Building2,
  Search as SearchIcon
} from 'lucide-react';
import MarketplaceGrid from '../marketplace/MarketplaceGrid';
import ProcurementGrid from '../marketplace/ProcurementGrid';
import vendorsData from '@/data/vendors.json';

const MarketplacePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('solutions');
  const [initialFilters, setInitialFilters] = useState({});

  // Enhanced vendor data with new categories
  const enhancedVendors = [
    ...vendorsData.vendors,
    // New Compliance as a Service vendors
    {
      id: "compliance_pro",
      name: "Compliance Pro",
      type: "Compliance",
      description: "Comprehensive ESG compliance management platform offering automated reporting, regulatory tracking, and audit support for BRSR, GRI, SASB frameworks.",
      solutions: ["compliance_management", "regulatory_reporting", "audit_support"],
      targetIndustries: ["finance", "manufacturing", "healthcare", "education"],
      targetRegions: ["IN", "US", "EU", "AE"],
      contact: { email: "info@compliancepro.com", phone: "+91-80-1234-5678" },
      website: "https://compliancepro.com",
      rating: 4.7,
      certifications: ["BRSR", "GRI", "ISO 27001"]
    },
    {
      id: "green_audit_solutions",
      name: "Green Audit Solutions",
      type: "Compliance",
      description: "Specialized ESG auditing and compliance services with expertise in sustainability frameworks, carbon accounting, and regulatory compliance across industries.",
      solutions: ["esg_auditing", "carbon_accounting", "compliance_tools"],
      targetIndustries: ["manufacturing", "steel", "cement", "automotive"],
      targetRegions: ["IN", "EU"],
      contact: { email: "contact@greenaudit.com", phone: "+91-22-9876-5432" },
      website: "https://greenaudit.com",
      rating: 4.5,
      certifications: ["TCFD", "SASB", "ISO 14001"]
    },
    // NBS (Nature-Based Solutions) vendors
    {
      id: "eco_restore",
      name: "EcoRestore",
      type: "NBS",
      description: "Nature-based solutions provider specializing in ecosystem restoration, urban forestry, and biodiversity conservation projects for carbon offsetting.",
      solutions: ["ecosystem_restoration", "urban_forestry", "biodiversity_conservation"],
      targetIndustries: ["real_estate", "manufacturing", "education"],
      targetRegions: ["IN", "US", "EU"],
      contact: { email: "info@ecorestore.com", phone: "+91-44-2345-6789" },
      website: "https://ecorestore.com",
      rating: 4.8,
      certifications: ["Verified Carbon Standard", "Gold Standard"]
    },
    {
      id: "green_corridors",
      name: "Green Corridors",
      type: "NBS",
      description: "Wetland restoration and green infrastructure development company focusing on natural water management and climate resilience solutions.",
      solutions: ["wetland_restoration", "green_infrastructure", "water_management"],
      targetIndustries: ["real_estate", "logistics", "manufacturing"],
      targetRegions: ["IN", "AE"],
      contact: { email: "hello@greencorridors.com", phone: "+91-40-7654-3210" },
      website: "https://greencorridors.com",
      rating: 4.6,
      certifications: ["UN SDG", "Climate Bonds Initiative"]
    },
    // Carbon Credits vendors
    {
      id: "carbon_markets_india",
      name: "Carbon Markets India",
      type: "Carbon Credits",
      description: "Leading carbon credit marketplace facilitating high-quality carbon offset purchases, project development, and carbon accounting services.",
      solutions: ["carbon_credits", "offset_projects", "carbon_accounting"],
      targetIndustries: ["finance", "manufacturing", "logistics", "automotive"],
      targetRegions: ["IN", "US", "EU"],
      contact: { email: "trade@carbonmarkets.in", phone: "+91-22-3456-7890" },
      website: "https://carbonmarkets.in",
      rating: 4.4,
      certifications: ["Verra", "Gold Standard", "CDM"]
    },
    {
      id: "offset_solutions",
      name: "Offset Solutions",
      type: "Carbon Credits",
      description: "Carbon offset provider specializing in verified emission reduction projects including renewable energy, forestry, and waste management initiatives.",
      solutions: ["verified_offsets", "project_development", "carbon_verification"],
      targetIndustries: ["manufacturing", "steel", "cement", "it_datacenter"],
      targetRegions: ["IN", "EU", "AE"],
      contact: { email: "info@offsetsolutions.com", phone: "+91-80-8765-4321" },
      website: "https://offsetsolutions.com",
      rating: 4.3,
      certifications: ["VCS", "UNFCCC", "ISO 14064"]
    },
    // Certificates vendors
    {
      id: "esg_certification_hub",
      name: "ESG Certification Hub",
      type: "Certificates",
      description: "One-stop platform for ESG certifications, sustainability assessments, and third-party verification services across multiple frameworks.",
      solutions: ["esg_certification", "sustainability_assessment", "third_party_verification"],
      targetIndustries: ["finance", "manufacturing", "education", "healthcare"],
      targetRegions: ["IN", "US", "EU", "AE"],
      contact: { email: "certify@esgcerthub.com", phone: "+91-11-1122-3344" },
      website: "https://esgcerthub.com",
      rating: 4.9,
      certifications: ["B-Corp", "LEED", "BREEAM", "ENERGY STAR"]
    },
    {
      id: "sustainability_credentials",
      name: "Sustainability Credentials",
      type: "Certificates",
      description: "Professional certification body for sustainability practitioners offering training, assessment, and certification programs for ESG professionals.",
      solutions: ["professional_certification", "training_programs", "competency_assessment"],
      targetIndustries: ["finance", "education", "manufacturing", "consulting"],
      targetRegions: ["IN", "US", "EU"],
      contact: { email: "learn@sustcredentials.com", phone: "+91-44-5566-7788" },
      website: "https://sustcredentials.com",
      rating: 4.7,
      certifications: ["IEMA", "GRI", "CDP", "SASB"]
    }
  ];

  // Procurement products/services data
  const procurementItems = [
    {
      id: "solar_panels_commercial",
      name: "Commercial Solar Panel Systems",
      category: "equipment",
      type: "Solar Energy Equipment",
      description: "High-efficiency monocrystalline solar panels for commercial installations with 25-year warranty and performance guarantee.",
      price: { min: 45000, max: 120000, currency: "INR", unit: "per kW" },
      supplier: "Quark Solar",
      specifications: {
        efficiency: "21.5%",
        warranty: "25 years",
        capacity: "400W - 500W per panel"
      },
      certifications: ["IEC 61215", "IEC 61730", "BIS"],
      targetIndustries: ["manufacturing", "real_estate", "education"],
      sustainability: {
        carbonOffset: "0.8 tons CO2/year per kW",
        paybackPeriod: "7-9 years"
      }
    },
    {
      id: "water_treatment_system",
      name: "Industrial Water Treatment Plant",
      category: "equipment",
      type: "Water Treatment Equipment",
      description: "Complete wastewater treatment solution with advanced membrane technology and automated monitoring systems.",
      price: { min: 1500000, max: 5000000, currency: "INR", unit: "per system" },
      supplier: "Furaat",
      specifications: {
        capacity: "100-1000 KLD",
        recovery: "85-95%",
        automation: "Full PLC control"
      },
      certifications: ["ISO 9001", "CPCB Approved", "CE Marked"],
      targetIndustries: ["manufacturing", "healthcare", "steel", "cement"],
      sustainability: {
        waterRecycling: "Up to 95%",
        energyEfficiency: "40% reduction vs conventional"
      }
    },
    {
      id: "esg_reporting_software",
      name: "ESG Reporting & Analytics Platform",
      category: "software",
      type: "ESG Management Software",
      description: "Cloud-based ESG data management and reporting platform with automated compliance tracking and dashboard analytics.",
      price: { min: 50000, max: 200000, currency: "INR", unit: "per year" },
      supplier: "Breathe ESG",
      specifications: {
        users: "Unlimited",
        frameworks: "GRI, BRSR, SASB, TCFD",
        integration: "API-enabled"
      },
      certifications: ["ISO 27001", "SOC 2", "GDPR Compliant"],
      targetIndustries: ["finance", "manufacturing", "education", "healthcare"],
      sustainability: {
        paperlessSavings: "90% reduction in reporting documentation",
        efficiency: "70% faster report generation"
      }
    },
    {
      id: "carbon_audit_service",
      name: "Comprehensive Carbon Footprint Audit",
      category: "consulting",
      type: "Carbon Accounting Service",
      description: "End-to-end carbon footprint assessment including Scope 1, 2, and 3 emissions with detailed reduction roadmap and action plan.",
      price: { min: 150000, max: 500000, currency: "INR", unit: "per audit" },
      supplier: "Earth Sync",
      specifications: {
        scope: "Scope 1, 2, 3 emissions",
        duration: "6-8 weeks",
        deliverables: "Audit report + Action plan"
      },
      certifications: ["ISO 14064", "GHG Protocol", "Carbon Trust"],
      targetIndustries: ["manufacturing", "logistics", "finance", "automotive"],
      sustainability: {
        emissionReduction: "15-30% potential savings identified",
        compliance: "Meets all major framework requirements"
      }
    }
  ];

  const tabs = [
    { 
      id: 'solutions', 
      name: 'Solution Providers', 
      icon: Store, 
      count: enhancedVendors.length,
      description: 'Sustainability solution vendors and service providers' 
    },
    { 
      id: 'procurement', 
      name: 'Purchasing/Procurement', 
      icon: ShoppingCart, 
      count: procurementItems.length,
      description: 'Products and services available for procurement' 
    }
  ];

  // Handle URL parameters for filters (like "REDUCE THIS" from dashboard)
  useEffect(() => {
    if (!searchParams) return; // Guard against missing searchParams
    
    const filter = searchParams.get('filter');
    const clear = searchParams.get('clear');
    
    if (clear === 'true') {
      setInitialFilters({});
    } else if (filter) {
      const filterMap = {
        'energy': 'Energy',
        'water': 'Water', 
        'waste': 'Waste',
        'analytics': 'Analytics',
        'consulting': 'Consulting',
        'compliance': 'Compliance',
        'nbs': 'NBS',
        'carbon-credits': 'Carbon Credits',
        'certificates': 'Certificates'
      };
      
      const mappedFilter = filterMap[filter.toLowerCase()];
      if (mappedFilter) {
        setInitialFilters({ types: [mappedFilter] });
      }
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Clear URL parameters when switching tabs
    router.replace('/marketplace', { shallow: true });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-white mb-4">
          Sustainability Marketplace
        </h1>
        <p className="text-white-600 max-w-3xl mx-auto">
          Discover verified solution providers, procurement options, and services for your sustainability journey. 
          From compliance management to nature-based solutions, find everything you need in one place.
        </p>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Building2, label: 'Vendors', count: enhancedVendors.length, color: 'text-blue-600' },
          { icon: Leaf, label: 'NBS Solutions', count: enhancedVendors.filter(v => v.type === 'NBS').length, color: 'text-green-600' },
          { icon: Shield, label: 'Compliance', count: enhancedVendors.filter(v => v.type === 'Compliance').length, color: 'text-purple-600' },
          { icon: TrendingUp, label: 'Carbon Credits', count: enhancedVendors.filter(v => v.type === 'Carbon Credits').length, color: 'text-orange-600' },
          { icon: Award, label: 'Certifications', count: enhancedVendors.filter(v => v.type === 'Certificates').length, color: 'text-indigo-600' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm">
              <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-3 px-6 py-4 font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-[#e9f1ea] text-green-700 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.count} items • {tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'solutions' && (
            <MarketplaceGrid
              vendors={enhancedVendors}
              initialFilters={initialFilters}
              availableIndustries={[
                { id: 'manufacturing', name: 'Manufacturing' },
                { id: 'finance', name: 'Finance' },
                { id: 'healthcare', name: 'Healthcare' },
                { id: 'education', name: 'Education' },
                { id: 'real_estate', name: 'Real Estate' },
                { id: 'logistics', name: 'Logistics' },
                { id: 'automotive', name: 'Automotive' },
                { id: 'steel', name: 'Steel' },
                { id: 'cement', name: 'Cement' },
                { id: 'it_datacenter', name: 'IT / Data Center' }
              ]}
            />
          )}

          {activeTab === 'procurement' && (
            <ProcurementGrid
              items={procurementItems}
              vendors={enhancedVendors}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
