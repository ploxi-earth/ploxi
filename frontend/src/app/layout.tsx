import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Ploxi Earth – Decarbonisation and Net-Zero Marketplace',
  description:
    'Ploxi Earth is a platform connecting cleantech vendors, corporate ESG leaders, and climate finance investors to accelerate sustainability transitions.',
  openGraph: {
    title: 'Ploxi Earth',
    description: 'Empowering Sustainable Business Growth',
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
      <body>{children}</body>
    </html>
  );
}
