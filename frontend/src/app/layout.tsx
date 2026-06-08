import type { Metadata } from 'next';
import '@/styles/globals.css';
import SiteNavbar from '@/components/SiteNavbar';

export const metadata: Metadata = {
  title: 'Ploxi Earth – Enterprise Sustainability & Decarbonisation',
  description:
    'Ploxi Earth is an enterprise sustainability platform connecting corporates, cleantech partners, and climate finance investors to accelerate decarbonisation.',
  openGraph: {
    title: 'Ploxi Earth',
    description: 'Enterprise Sustainability & Decarbonisation',
    url: 'https://www.ploxi.earth',
    siteName: 'Ploxi Earth',
    images: [{ url: '/images/logo.jpeg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen">
        <SiteNavbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
