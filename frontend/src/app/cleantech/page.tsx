'use client';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp } from '@/components/ui/Motion';
import SubpageHeader from '@/components/SubpageHeader';

export default function CleantechPage() {
  return (
    <div className="page-shell min-h-screen bg-white">
      <SubpageHeader subtitle="Decarbonisation and Net-Zero Marketplace" />

      <section className="bg-gradient-to-br from-sky-900 via-cyan-800 to-blue-900 px-4 py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <HeroFadeUp delay={0.1}>
            <div className="inline-block bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-sky-400/30 mb-6">
              Clean Tech Marketplace
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.22}>
            <h1 className="text-balance mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vendor/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-sky-600 hover:to-cyan-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                Register as Vendor
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-white/20 hover:border-white/50 transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                Vendor Sign In
              </Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Features Section */}
      <FadeUp>
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Partner with Ploxi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                  ),
                  title: 'Global Reach',
                  desc: 'Connect with enterprise buyers across industries worldwide.',
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  ),
                  title: 'Trusted Platform',
                  desc: 'Our vetting process ensures only quality vendors are onboarded.',
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                  ),
                  title: 'Accelerate Growth',
                  desc: 'Showcase your solutions and generate qualified leads.',
                },
              ].map((f) => (
                <div key={f.title} className="surface-card surface-card-hover p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      <FadeUp>
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-balance text-3xl font-bold text-gray-900 mb-4">Ready to Accelerate Your Growth?</h2>
            <p className="text-gray-500 mb-8">Join hundreds of clean tech vendors connecting with enterprise buyers on Ploxi</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vendor/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-md hover:from-sky-600 hover:to-cyan-600 transition-all duration-200">
                Start Your Registration Now
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200">
                Already Registered? Sign In
              </Link>
            </div>
          </div>
        </section>
      </FadeUp>

      <Footer />
    </div>
  );
}
