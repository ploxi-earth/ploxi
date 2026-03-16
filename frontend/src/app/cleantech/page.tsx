'use client';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp } from '@/components/ui/Motion';
import SubpageHeader from '@/components/SubpageHeader';

export default function CleantechPage() {
  return (
    <div className="min-h-screen bg-white">
      <SubpageHeader subtitle="Decarbonisation and Net-Zero Marketplace" />

      <section className="bg-gradient-to-br from-sky-900 via-cyan-800 to-blue-900 text-white py-24 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <HeroFadeUp delay={0.1}>
            <div className="inline-block bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-sky-400/30 mb-6">
              Clean Tech Marketplace
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.22}>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Connect Your <span className="text-sky-300">Clean Tech</span>
              <br />
              Solutions with Enterprise Buyers
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.36}>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
              Join the leading marketplace connecting innovative clean technology providers with
              corporations committed to sustainability. Showcase your solutions, generate qualified
              leads, and accelerate your growth.
            </p>
            <p className="text-sm text-sky-300 mb-10">Free Registration</p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.48}>
            <Link href="/cleantech/registration" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-md hover:from-sky-600 hover:to-cyan-600 transition-all duration-200">
              Start Clean Tech Registration
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </HeroFadeUp>
        </div>
      </section>

      <FadeUp>
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Accelerate Your Growth?</h2>
            <p className="text-gray-500 mb-8">Join hundreds of clean tech vendors connecting with enterprise buyers on Ploxi</p>
            <Link href="/cleantech/registration" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-md hover:from-sky-600 hover:to-cyan-600 transition-all duration-200">
              Start Your Registration Now
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </section>
      </FadeUp>

      <Footer />
    </div>
  );
}
