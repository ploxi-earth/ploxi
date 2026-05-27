'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Leaf, TrendingUp } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import { SOLUTION_CATEGORIES } from '@/lib/navData';

// ─── Icon resolver for category cards ────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  BarChart2: <BarChart2 className="h-8 w-8" />,
  Leaf: <Leaf className="h-8 w-8" />,
  TrendingUp: <TrendingUp className="h-8 w-8" />,
};

const CATEGORY_GRADIENT: Record<string, string> = {
  'esg-strategy': 'from-emerald-500 to-green-600',
  'carbon-compliance': 'from-blue-500 to-cyan-600',
  'markets-financing': 'from-purple-500 to-indigo-600',
};

const CATEGORY_HOVER_SHADOW: Record<string, string> = {
  'esg-strategy': 'hover:shadow-emerald-100',
  'carbon-compliance': 'hover:shadow-blue-100',
  'markets-financing': 'hover:shadow-purple-100',
};

const CATEGORY_ACCENT_TEXT: Record<string, string> = {
  'esg-strategy': 'text-emerald-600',
  'carbon-compliance': 'text-blue-600',
  'markets-financing': 'text-purple-600',
};

// ─── Original platform solution cards (unchanged) ────────────────────────────
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
        <path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
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
        <path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="page-shell min-h-screen bg-white">
      <SiteNavbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
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
              Transform your sustainability journey with an integrated platform connecting corporations, technology providers, and climate-focused financial solutions.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.46}>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/solutions" className="btn-primary px-8 py-4 text-base">
                Explore Our Solutions
              </Link>
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

      {/* ── Our Sustainability Solutions (3 category cards) ──────────────── */}
      <section className="bg-slate-50 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto mb-16 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 mb-5">
              Consulting Services
            </div>
            <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Sustainability Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              End-to-end advisory for enterprises navigating ESG reporting, carbon accounting, regulatory compliance, and climate finance.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {SOLUTION_CATEGORIES.map((cat) => (
              <StaggerItem key={cat.slug}>
                <Link
                  href={cat.href}
                  className={`group flex flex-col bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-xl ${CATEGORY_HOVER_SHADOW[cat.slug]} transition-all duration-300 hover:-translate-y-1.5 ring-2 ring-transparent hover:ring-gray-100 h-full`}
                >
                  {/* Icon */}
                  <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENT[cat.slug]} text-white shadow-lg`}>
                    {CATEGORY_ICONS[cat.icon]}
                  </div>

                  {/* Title + tagline */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{cat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{cat.tagline}</p>

                  {/* Service names as tags */}
                  <div className="flex-1 flex flex-col justify-end">
                    <ul className="space-y-2 mb-8">
                      {cat.services.map((svc) => (
                        <li key={svc.href} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                          {svc.title}
                        </li>
                      ))}
                    </ul>

                    <div className={`flex items-center gap-2 font-semibold ${CATEGORY_ACCENT_TEXT[cat.slug]} text-sm group-hover:gap-3 transition-all`}>
                      Explore Services
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp className="mt-12 text-center">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:border-primary-300 hover:text-primary-700 transition"
            >
              View All 9 Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Platform Solutions (original section, preserved) ─────────────── */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
              Comprehensive ESG Platform
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Explore tailored experiences for enterprises, clean technology innovators, and climate finance participants in one connected ecosystem.
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

      {/* ── Why Ploxi Earth strip ─────────────────────────────────────────── */}
      <section className="bg-slate-950 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Why Leading Enterprises Choose Ploxi Earth</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { stat: '9+', label: 'Integrated sustainability services' },
              { stat: '3', label: 'Consulting practice areas' },
              { stat: '100%', label: 'Framework-aligned reporting' },
            ].map((item) => (
              <FadeUp key={item.label} className="flex flex-col items-center">
                <motion.div
                  className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.stat}
                </motion.div>
                <p className="text-slate-400 text-sm font-medium">{item.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
