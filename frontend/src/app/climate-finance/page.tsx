'use client';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import SubpageHeader from '@/components/SubpageHeader';

export default function ClimateFinancePage() {
  return (
    <div className="page-shell min-h-screen bg-white">
      <SubpageHeader subtitle="Investment &amp; Funding" />

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 px-4 py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <HeroFadeUp delay={0.1}>
            <div className="inline-block bg-white/10 text-gray-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20 mb-6">
              Climate Finance Platform
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.22}>
            <h1 className="text-balance mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Accelerate Your
              <br />
              <span className="text-gray-400 bg-clip-text bg-gradient-to-r from-gray-400 to-white">Climate Finance</span>{' '}
              Journey
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.36}>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
              Connect clean technology providers with climate-focused investors and unlock funding opportunities that drive real-world impact.
            </p>
          </HeroFadeUp>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Climate Finance</h2>
            <p className="text-gray-500">How would you like to engage with us?</p>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Raise Funding */}
            <StaggerItem>
              <Link href="/climate-finance/registration?type=raise_funding"
                className="surface-card surface-card-hover block p-8 text-center cursor-pointer group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:from-gray-800 group-hover:to-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white" aria-hidden="true">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">Raise Funding</h3>
                <p className="text-sm text-gray-500">Seeking investment for your clean tech venture</p>
              </Link>
            </StaggerItem>

            {/* Investor */}
            <StaggerItem>
              <Link href="/climate-finance/registration?type=investor"
                className="surface-card surface-card-hover block p-8 text-center cursor-pointer group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:from-gray-800 group-hover:to-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white" aria-hidden="true">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">I&apos;m an Investor</h3>
                <p className="text-sm text-gray-500">Looking to invest in climate solutions</p>
              </Link>
            </StaggerItem>

            {/* Participate */}
            <StaggerItem>
              <Link href="/climate-finance/registration?type=participate"
                className="surface-card surface-card-hover block p-8 text-center cursor-pointer group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:from-gray-800 group-hover:to-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">Participate</h3>
                <p className="text-sm text-gray-500">Join events and seek consultation</p>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </div>
  );
}
