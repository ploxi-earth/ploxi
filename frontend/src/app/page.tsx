'use client';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <HeroFadeDown delay={0} className="sticky top-0 z-50">
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.jpeg"
                alt="Ploxi Earth"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-gray-900">Ploxi</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/corporate" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Corporate</Link>
              <Link href="/cleantech" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Clean Tech</Link>
              <Link href="/climate-finance" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Climate Finance</Link>
              <Link href="/tools/ghg-calculator" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">GHG Calculator</Link>
              <Link href="https://www.ploxiconsult.com/" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm px-4 py-2">
                Visit Website
              </Link>
            </nav>
          </div>
        </div>
      </header>
      </HeroFadeDown>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-28 text-center">
          <HeroFadeUp delay={0.1}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-600/20 px-4 py-1.5 text-sm font-medium text-primary-300 border border-primary-500/30">
              Decarbonisation & Net-Zero Marketplace
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.22}>
            <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight">
              Empowering{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
                Sustainable
              </span>
              <br />Business Growth
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.36}>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transform your sustainability journey with our integrated platform connecting
              corporations, technology providers, and financial solutions.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.48}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://www.ploxiconsult.com/" target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-8 py-4">
                Visit Our Website
              </Link>
              <Link href="/tools/ghg-calculator" className="btn-secondary text-base px-8 py-4 border-white/30 text-white hover:bg-white/10">
                GHG Calculator
              </Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* ── Solutions Section ────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Comprehensive ESG Solutions</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Transform your sustainability journey with our integrated platform connecting
              corporations, technology providers, and financial solutions.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Corporate Card */}
            <StaggerItem className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 transition-all duration-300 hover:from-green-600 hover:to-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-white" aria-hidden="true">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
                </svg>
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Corporate & Industry</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Marketplace</h3>
              <ul className="space-y-2.5 text-sm text-gray-700 mb-6">
                {['ESG Dashboard', 'Sustainability Reporting', 'Compliance Management', 'Vendor Marketplace'].map((item) => (
                  <li key={item} className="flex items-center text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true">
                      <path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/corporate" className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
                Explore Ploxi Earth <span aria-hidden="true">→</span>
              </Link>
            </StaggerItem>

            {/* Clean Tech Card */}
            <StaggerItem className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 transition-all duration-300 hover:from-blue-600 hover:to-cyan-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-white" aria-hidden="true">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">Clean Tech</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vendors & Solutions</h3>
              <ul className="space-y-2.5 text-sm text-gray-700 mb-6">
                {['Technology Vendors', 'Innovation Showcase', 'Solution Matching', 'Partnership Opportunities'].map((item) => (
                  <li key={item} className="flex items-center text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true">
                      <path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/cleantech" className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-blue-600 hover:to-cyan-700 transition-all duration-200">
                Explore Ploxi Earth <span aria-hidden="true">→</span>
              </Link>
            </StaggerItem>

            {/* Climate Finance Card */}
            <StaggerItem className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 transition-all duration-300 hover:from-gray-800 hover:to-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-white" aria-hidden="true">
                  <path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" />
                </svg>
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">Climate Finance</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Investment & Funding</h3>
              <ul className="space-y-2.5 text-sm text-gray-700 mb-6">
                {['Carbon Credits', 'Green Bonds', 'Impact Investment', 'ESG Funds'].map((item) => (
                  <li key={item} className="flex items-center text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true">
                      <path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/climate-finance" className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-gray-800 hover:to-black transition-all duration-200">
                Explore Ploxi Earth <span aria-hidden="true">→</span>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </div>
  );
}