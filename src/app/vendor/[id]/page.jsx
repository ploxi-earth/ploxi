// src/app/vendor/[id]/page.jsx
import { notFound } from 'next/navigation';
import VendorProfile from '@/components/vendor/VendorProfile';
import vendorsData from '@/data/vendors.json';

export default function VendorPage({ params }) {
  const { id } = params;
  const normalizedId = String(id).toLowerCase();

  // Find the vendor by ID (case-insensitive)
  const vendor = vendorsData.vendors.find(
    (v) => String(v.id).toLowerCase() === normalizedId
  );

  // If vendor not found, show 404
  if (!vendor) {
    notFound();
  }

  return <VendorProfile vendor={vendor} />;
}

// Generate metadata for SEO (Server Component only)
export async function generateMetadata({ params }) {
  const { id } = params;
  const normalizedId = String(id).toLowerCase();

  const vendor = vendorsData.vendors.find(
    (v) => String(v.id).toLowerCase() === normalizedId
  );

  if (!vendor) {
    return {
      title: 'Vendor Not Found | Ploxi Vendor Marketplace',
      description: 'The requested vendor profile could not be found.',
    };
  }

  const description =
    vendor.description && vendor.description.length > 150
      ? vendor.description.substring(0, 150) + '...'
      : vendor.description || '';

  return {
    title: `${vendor.name} | Ploxi Vendor Marketplace`,
    description,
    openGraph: {
      title: `${vendor.name} - ${vendor.type} Solutions`,
      description,
      type: 'profile',
      url: `/vendor/${vendor.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vendor.name} | Sustainability Solutions`,
      description,
    },
  };
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  return vendorsData.vendors.map((vendor) => ({
    id: String(vendor.id),
  }));
}
