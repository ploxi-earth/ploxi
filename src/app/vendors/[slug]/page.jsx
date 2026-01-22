import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import VendorHero from '@/components/vendor-dashboard/VendorHero';
import AboutSection from '@/components/vendor-dashboard/AboutSection';
import KeyStatsSection from '@/components/vendor-dashboard/KeyStatsSection';
import PastProjectsSlider from '@/components/vendor-dashboard/PastProjectsSlider';
import LiveProjectsGrid from '@/components/vendor-dashboard/LiveProjectsGrid';
import ResourcesSection from '@/components/vendor-dashboard/ResourcesSection';
import PublicNavbar from '@/components/PublicNavbar';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from('vendors')
    .select('name, tagline, category')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!vendor) {
    return {
      title: 'Vendor Not Found',
    };
  }

  return {
    title: `${vendor.name} | Ploxi Earth Vendor Marketplace`,
    description: vendor.tagline || `${vendor.name} - ${vendor.category}`,
  };
}

// Main page component
export default async function VendorPage({ params }) {
  const supabase = await createClient();

  // Fetch vendor data
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (vendorError || !vendor) {
    notFound();
  }

  // Fetch past projects
  const { data: pastProjects } = await supabase
    .from('vendor_past_projects')
    .select('*')
    .eq('vendor_id', vendor.id)
    .order('display_order', { ascending: true });

  // Fetch live projects
  const { data: liveProjects } = await supabase
    .from('vendor_live_projects')
    .select('*')
    .eq('vendor_id', vendor.id)
    .order('display_order', { ascending: true });

  // Fetch documents
  const { data: documents } = await supabase
    .from('vendor_documents')
    .select('*')
    .eq('vendor_id', vendor.id)
    .order('uploaded_at', { ascending: false });

  return (
    <>
      {/* Ploxi Navbar */}
      <PublicNavbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <VendorHero vendor={vendor} />

          {/* Key Statistics */}
          {vendor.key_stats && Object.keys(vendor.key_stats).length > 0 && (
            <KeyStatsSection stats={vendor.key_stats} />
          )}

          {/* About Section */}
          <AboutSection vendor={vendor} />

          {/* Past Projects Slider */}
          {pastProjects && pastProjects.length > 0 && (
            <PastProjectsSlider projects={pastProjects} />
          )}

          {/* Live Projects Grid */}
          {liveProjects && liveProjects.length > 0 && (
            <LiveProjectsGrid projects={liveProjects} />
          )}

          {/* Resources & Documents */}
          {documents && documents.length > 0 && (
            <ResourcesSection documents={documents} vendor={vendor} />
          )}
        </div>
      </div>
    </>
  );
}
