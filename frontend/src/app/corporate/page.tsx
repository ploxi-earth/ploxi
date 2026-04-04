'use client';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import SubpageHeader from '@/components/SubpageHeader';

export default function CorporatePage() {
  return (
    <div className="page-shell min-h-screen bg-white">
      {/* ── Header ── */}
      <SubpageHeader subtitle="Decarbonisation and Net-Zero Marketplace" />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 px-4 py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <HeroFadeUp delay={0.1}>
            <h1 className="text-balance mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Empower Your
              <br />
              <span className="text-primary-300">Corporate ESG Journey</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.25}>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
              Navigate your sustainability roadmap with personalized ESG insights, compliance tracking,
              and access to a network of verified sustainability partners.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <Link href="/corporate/register" className="inline-flex items-center justify-center gap-2 btn-primary text-base px-8 py-4 bg-white text-primary-700 hover:bg-gray-100">
              Start Corporate Registration
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </HeroFadeUp>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>
                ),
                title: 'ESG Dashboard',
                desc: 'Comprehensive analytics and real-time sustainability metrics.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                ),
                title: 'Compliance Management',
                desc: 'Stay compliant with global ESG frameworks like GRI, SASB, and BRSR.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                ),
                title: 'Solution Marketplace',
                desc: 'Discover verified sustainability solution providers and consultants.',
              },
            ].map((f) => (
              <StaggerItem key={f.title} className="surface-card surface-card-hover p-8 text-center">
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ── */}
      <FadeUp>
        <section className="bg-primary-50 py-16 px-4 text-center">
          <h2 className="text-balance text-3xl font-bold text-gray-900 mb-4">Ready to Lead in Sustainability?</h2>
          <p className="text-gray-500 mb-8">Join organizations driving impactful ESG transformations with Ploxi Earth.</p>
          <Link href="/corporate/register" className="inline-flex items-center justify-center gap-2 btn-primary text-base px-8 py-4">
            Get Started Today
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </section>
      </FadeUp>

      <Footer />
    </div>
  );
}
