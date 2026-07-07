'use client';
import Link from 'next/link';
import { HeroFadeUp } from '@/components/ui/Motion';
import { Leaf, ArrowDown, Mail } from 'lucide-react';

interface CarbonMarketHeroProps {
  onEnquireClick: () => void;
}

export default function CarbonMarketHero({ onEnquireClick }: CarbonMarketHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-slate-900 px-4 py-16 text-white sm:py-20">
      {/* Decorative orbs */}
      <div className="hero-orb left-[-5rem] top-[-5rem] h-64 w-64 bg-emerald-500/15" />
      <div className="hero-orb bottom-[-6rem] right-[-4rem] h-72 w-72 bg-green-400/10" />
      <div className="hero-orb right-1/4 top-[-2rem] h-40 w-40 bg-cyan-500/10" />

      <div className="relative mx-auto max-w-4xl text-center">
        <HeroFadeUp delay={0.05}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            <Leaf className="h-3.5 w-3.5" />
            Carbon Market
          </div>
        </HeroFadeUp>

        <HeroFadeUp delay={0.15}>
          <h1 className="mb-5 text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Discover High-Integrity{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
              Carbon Credits
            </span>
          </h1>
        </HeroFadeUp>

        <HeroFadeUp delay={0.25}>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-emerald-100/80 sm:text-lg">
            Ploxi Earth helps organisations discover verified carbon projects, evaluate available
            credit portfolios, and connect with project developers across global registries.
          </p>
        </HeroFadeUp>

        <HeroFadeUp delay={0.35}>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#carbon-portfolio"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/25 hover:shadow-xl"
              id="hero-explore-cta"
            >
              <ArrowDown className="h-4 w-4" />
              Explore Carbon Credits
            </a>
            <button
              onClick={onEnquireClick}
              id="hero-enquire-cta"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20"
            >
              <Mail className="h-4 w-4" />
              Source Carbon Credits
            </button>
          </div>
        </HeroFadeUp>
      </div>
    </section>
  );
}
