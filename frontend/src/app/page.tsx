'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X, Calendar } from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const SOLUTION_CARDS = [
  {
    href: '/corporate',
    eyebrow: 'Corporate & Industry',
    title: 'Marketplace',
    accent: 'from-green-500 to-emerald-600',
    hoverAccent: 'hover:from-green-600 hover:to-emerald-700',
    eyebrowClass: 'text-primary-600',
    items: ['ESG Dashboard', 'Sustainability Reporting', 'Compliance Management', 'Vendor Marketplace'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-white sm:h-8 sm:w-8" aria-hidden="true">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
      </svg>
    ),
  },
  {
    href: '/cleantech',
    eyebrow: 'Clean Tech',
    title: 'Vendors & Solutions',
    accent: 'from-blue-500 to-cyan-600',
    hoverAccent: 'hover:from-blue-600 hover:to-cyan-700',
    eyebrowClass: 'text-sky-600',
    items: ['Technology Vendors', 'Innovation Showcase', 'Solution Matching', 'Partnership Opportunities'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-white sm:h-8 sm:w-8" aria-hidden="true">
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
      </svg>
    ),
  },
  {
    href: '/climate-finance',
    eyebrow: 'Climate Finance',
    title: 'Investment & Funding',
    accent: 'from-gray-700 to-gray-900',
    hoverAccent: 'hover:from-gray-800 hover:to-black',
    eyebrowClass: 'text-gray-600',
    items: ['Carbon Credits', 'Green Bonds', 'Impact Investment', 'ESG Funds'],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-white sm:h-8 sm:w-8" aria-hidden="true">
        <path d="M16 7h6v6" />
        <path d="m22 7-8.5 8.5-5-5L2 17" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  return (
    <div className="page-shell min-h-screen bg-white">
      <HeroFadeDown delay={0} className="sticky top-0 z-50">
        <header className="border-b border-white/10 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            {/* Logo Section */}
            <div className="flex flex-1 items-center justify-start min-w-0">
              <Link href="/" className="flex min-w-0 items-center gap-3">
                <Image
                  src="/images/logo.jpeg"
                  alt="Ploxi Earth"
                  width={42}
                  height={42}
                  className="flex-shrink-0 rounded-full ring-2 ring-primary-500/10"
                />
                <div className="min-w-0">
                  <span className="block truncate text-lg font-bold text-gray-900">Ploxi Earth</span>
                  <span className="hidden text-xs uppercase tracking-[0.22em] text-gray-400 xl:block">
                    Decarbonisation Marketplace
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex flex-shrink-0 items-center justify-center gap-1 xl:gap-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600 xl:px-4"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons & Mobile Menu Toggle */}
            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="hidden lg:flex items-center gap-2 xl:gap-3">
                <a
                  href="https://www.ploxiconsult.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary whitespace-nowrap px-3 py-2 text-sm xl:px-4"
                >
                  Visit Website
                </a>
                <a
                  href="https://calendly.com/dhwani-sg/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex whitespace-nowrap items-center gap-2 px-3 py-2 text-sm transition-transform hover:-translate-y-0.5 xl:px-4"
                >
                  <Calendar className="h-4 w-4" />
                  Book a Demo
                </a>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
      </HeroFadeDown>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-4 z-[70] overflow-hidden rounded-[28px] border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden"
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={38} height={38} className="rounded-full" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">Ploxi Earth</p>
                    <p className="text-xs text-slate-500">Explore the platform</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="https://calendly.com/dhwani-sg/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex w-full items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <Calendar className="h-4 w-4" />
                  Book a Demo
                </a>
                <a
                  href="https://www.ploxiconsult.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex w-full items-center justify-center py-2"
                >
                  Visit Website
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="hero-orb left-[-8rem] top-10 h-56 w-56 bg-primary-500/35 sm:h-72 sm:w-72" />
        <div className="hero-orb bottom-[-4rem] right-[-3rem] h-72 w-72 bg-cyan-500/20 sm:h-96 sm:w-96" />
        <div className="hero-orb right-[20%] top-[18%] hidden h-40 w-40 bg-emerald-400/15 lg:block" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/25 bg-primary-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-200 sm:text-sm">
              Decarbonisation & Net-Zero Marketplace
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.22}>
            <h1 className="text-balance mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Empowering{' '}
              <span className="bg-gradient-to-r from-primary-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Sustainable
              </span>
              <br className="hidden sm:block" />
              Business Growth
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.34}>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 lg:text-xl">
              Transform your sustainability journey with an integrated platform connecting
              corporations, technology providers, and climate-focused financial solutions.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.46}>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="https://www.ploxiconsult.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 text-base"
              >
                Visit Our Website
              </a>
              <Link
                href="/tools/ghg-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
              >
                GHG Calculator
              </Link>
            </div>
          </HeroFadeUp>

        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
              Comprehensive ESG Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Explore tailored experiences for enterprises, clean technology innovators, and
              climate finance participants in one connected ecosystem.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {SOLUTION_CARDS.map((card) => (
              <StaggerItem
                key={card.title}
                className="surface-card surface-card-hover group relative overflow-hidden p-6 sm:p-8"
              >
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.accent} ${card.hoverAccent} transition-all duration-300 sm:h-16 sm:w-16`}>
                  {card.icon}
                </div>
                <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.22em] ${card.eyebrowClass}`}>
                  {card.eyebrow}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                <ul className="mt-5 space-y-3 text-sm text-gray-700">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={card.href}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${card.accent} ${card.hoverAccent}`}
                >
                  Explore Ploxi Earth
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </div>
  );
}
