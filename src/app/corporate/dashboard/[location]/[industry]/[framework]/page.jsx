
import { notFound } from 'next/navigation';
import DashboardContent from '@/components/dashboard/DashboardContent';

// Import data for validation
import locationsData from '@/data/locations.json';
import industriesData from '@/data/industries.json';
import vendorsData from '@/data/vendors.json';

const allFrameworks = [
  { id: "brsr", name: "BRSR", fullName: "Business Responsibility and Sustainability Reporting" },
  { id: "gri", name: "GRI", fullName: "Global Reporting Initiative" },
  { id: "sasb", name: "SASB", fullName: "Sustainability Accounting Standards Board" },
  { id: "tcfd", name: "TCFD", fullName: "Task Force on Climate-related Financial Disclosures" },
  { id: "esrs", name: "ESRS", fullName: "European Sustainability Reporting Standards" }
];

const mockLocations = [
  { id: "india", name: "India", code: "IN", reportingFrameworks: ["BRSR", "GRI"] },
  { id: "usa", name: "United States", code: "US", reportingFrameworks: ["SASB", "GRI", "TCFD"] },
  { id: "eu", name: "European Union", code: "EU", reportingFrameworks: ["TCFD", "ESRS", "GRI"] },
  { id: "uae", name: "United Arab Emirates", code: "AE", reportingFrameworks: ["GRI", "TCFD"] }
];

const mockIndustries = [
  { id: "healthcare", name: "Healthcare" },
  { id: "real_estate", name: "Real Estate" },
  { id: "cement", name: "Cement" },
  { id: "steel", name: "Steel" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "logistics", name: "Logistics" },
  { id: "automotive", name: "Automotive" },
  { id: "education", name: "Education" },
  { id: "finance", name: "Finance" },
  { id: "it_datacenter", name: "IT / Data Center" }
];

export default function DashboardPage({ params }) {
  const { location: locationId, industry: industryId, framework: frameworkId } = params;
  
  // Validate parameters
  const location = mockLocations.find(loc => loc.id === locationId);
  const industry = mockIndustries.find(ind => ind.id === industryId);
  const framework = allFrameworks.find(fw => fw.id === frameworkId);
  
  // Check if all parameters are valid
  if (!location || !industry || !framework) {
    notFound();
  }
  
  // Validate framework is available for the location
  if (!location.reportingFrameworks.includes(framework.name)) {
    notFound();
  }

  const dashboardConfig = {
    location,
    industry,
    framework,
    vendors: vendorsData.vendors || []
  };

  return (
    <DashboardContent 
      config={dashboardConfig}
      params={params}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { location: locationId, industry: industryId, framework: frameworkId } = params;
  
  const location = mockLocations.find(loc => loc.id === locationId);
  const industry = mockIndustries.find(ind => ind.id === industryId);
  const framework = allFrameworks.find(fw => fw.id === frameworkId);
  
  if (!location || !industry || !framework) {
    return {
      title: 'Dashboard Not Found | Ploxi Sustainability Platform',
      description: 'The requested dashboard configuration could not be found.'
    };
  }

  return {
    title: `${industry.name} Dashboard - ${location.name} | Ploxi Sustainability Platform`,
    description: `Comprehensive ${framework.name} sustainability dashboard for ${industry.name} organizations in ${location.name}. ESG metrics, compliance tracking, and vendor marketplace.`,
    openGraph: {
      title: `${industry.name} Sustainability Dashboard - ${location.name}`,
      description: `${framework.fullName} metrics and insights for ${industry.name} sector`,
      type: 'website',
      url: `/dashboard/${locationId}/${industryId}/${frameworkId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${industry.name} ESG Dashboard | Ploxi Platform`,
      description: `${framework.name} sustainability insights for ${industry.name} in ${location.name}`,
    },
  };
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  const params = [];
  
  // Generate combinations of location, industry, and framework
  mockLocations.forEach(location => {
    mockIndustries.forEach(industry => {
      // Only generate params for frameworks available in each location
      const availableFrameworks = allFrameworks.filter(fw => 
        location.reportingFrameworks.includes(fw.name)
      );
      
      availableFrameworks.forEach(framework => {
        params.push({
          location: location.id,
          industry: industry.id,
          framework: framework.id,
        });
      });
    });
  });
  
  return params;
}