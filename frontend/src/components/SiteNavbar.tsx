'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Menu, X, Calendar, ChevronDown,
  BarChart2, Leaf, TrendingUp,
  Target, FileText, Globe, Activity, Layers, ShieldCheck, LineChart, Wallet, Zap
} from 'lucide-react';
import { SOLUTION_CATEGORIES, FLAT_NAV_LINKS, type SolutionCategory } from '@/lib/navData';

// ─── Icon Resolver ────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  BarChart2: <BarChart2 className="h-5 w-5" />,
  Leaf: <Leaf className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Target: <Target className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  Globe: <Globe className="h-4 w-4" />,
  Activity: <Activity className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
  LineChart: <LineChart className="h-4 w-4" />,
  Wallet: <Wallet className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
};

// ─── Category accent mappings (bg pill for mega-menu card) ───────────────────
const CATEGORY_GRADIENTS: Record<string, string> = {
  'esg-strategy': 'from-emerald-500 to-green-600',
  'carbon-compliance': 'from-blue-500 to-cyan-600',
  'markets-financing': 'from-purple-500 to-indigo-600',
};

const CATEGORY_SERVICE_ICON_BG: Record<string, string> = {
  'esg-strategy': 'bg-emerald-100 text-emerald-700',
  'carbon-compliance': 'bg-blue-100 text-blue-700',
  'markets-financing': 'bg-purple-100 text-purple-700',
};

// ─── Mega Menu ─────────────────────────────────────────────────────────────────
function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-full mt-2 z-[200] w-[880px] max-w-[96vw] -translate-x-1/2"
    >
      {/* Arrow */}
      <div className="mx-auto mb-1 w-4 h-4 overflow-hidden relative flex justify-center">
        <div className="absolute top-1 h-3 w-3 rotate-45 bg-white border border-gray-100 shadow-sm" />
      </div>

      <div className="rounded-[1.75rem] border border-gray-100 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
        <div className="grid grid-cols-[220px_1fr]">

          {/* Left sidebar */}
          <div className="bg-slate-950 p-7 flex flex-col justify-between rounded-l-[1.75rem]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Our Solutions</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                End-to-end sustainability services for compliance, reporting, and climate action.
              </p>
            </div>
            <Link
              href="/solutions"
              onClick={onClose}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-400/20 px-4 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 transition"
            >
              View All Solutions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: 3 category cards */}
          <div className="p-6 grid grid-cols-3 gap-4">
            {SOLUTION_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} onClose={onClose} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ cat, onClose }: { cat: SolutionCategory; onClose: () => void }) {
  const gradient = CATEGORY_GRADIENTS[cat.slug];
  const iconBg = CATEGORY_SERVICE_ICON_BG[cat.slug];

  return (
    <div className="group rounded-2xl border border-gray-100 bg-gray-50/60 p-5 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200">
      {/* Category header */}
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
        {ICON_MAP[cat.icon]}
      </div>
      <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight">{cat.title}</h3>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">{cat.tagline}</p>

      {/* Service links */}
      <ul className="space-y-2 mb-5">
        {cat.services.map((svc) => (
          <li key={svc.href}>
            <Link
              href={svc.href}
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-primary-700 transition"
            >
              <span className={`flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-md ${iconBg}`}>
                {ICON_MAP[svc.icon]}
              </span>
              {svc.title}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={cat.href}
        onClick={onClose}
        className="flex items-center justify-between w-full text-xs font-semibold text-primary-600 hover:text-primary-700 transition group-hover:underline underline-offset-2"
      >
        Explore Services
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Mobile accordion for Solutions ─────────────────────────────────────────
function MobileSolutionsAccordion({ onClose }: { onClose: () => void }) {
  const [openCat, setOpenCat] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {SOLUTION_CATEGORIES.map((cat) => (
        <div key={cat.slug} className="rounded-2xl border border-slate-200 overflow-hidden">
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 transition"
            onClick={() => setOpenCat(openCat === cat.slug ? null : cat.slug)}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{cat.title}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${openCat === cat.slug ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {openCat === cat.slug && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-white"
              >
                <div className="px-4 pb-4 pt-2 space-y-1">
                  {cat.services.map((svc) => (
                    <Link
                      key={svc.href}
                      href={svc.href}
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-700 transition"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      {svc.title}
                    </Link>
                  ))}
                  <Link
                    href={cat.href}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition"
                  >
                    Explore all {cat.title} →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── Main SiteNavbar ──────────────────────────────────────────────────────────
export default function SiteNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mega menu on route change
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Body scroll lock for mobile
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // Click-outside to close mega menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const closeMegaDelayed = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-white/10 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
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

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-shrink-0 items-center justify-center gap-1 xl:gap-2 relative" ref={megaRef}>
            {/* Solutions mega-menu trigger */}
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMegaDelayed}
            >
              <button
                onClick={() => setMegaOpen(!megaOpen)}
                aria-expanded={megaOpen}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
                  megaOpen
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                Solutions
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${megaOpen ? 'rotate-180 text-primary-600' : 'text-gray-400'}`}
                />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <div onMouseEnter={openMega} onMouseLeave={closeMegaDelayed}>
                    <MegaMenu onClose={() => setMegaOpen(false)} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Other links */}
            {FLAT_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors xl:px-4 ${
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
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

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen slide-in ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[150] bg-slate-950/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed inset-x-3 top-3 z-[160] max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-[1.75rem] border border-white/60 bg-white/98 shadow-2xl backdrop-blur-xl lg:hidden"
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={36} height={36} className="rounded-full" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Ploxi Earth</p>
                    <p className="text-xs text-slate-400">Decarbonisation Marketplace</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 py-5 space-y-6">
                {/* Solutions accordion */}
                <div>
                  <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-400">Solutions</p>
                  <MobileSolutionsAccordion onClose={() => setMobileOpen(false)} />
                </div>

                {/* Other nav links */}
                <div>
                  <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-400">Platform</p>
                  <div className="space-y-1.5">
                    {FLAT_NAV_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition"
                      >
                        {item.label}
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
                  <a
                    href="https://calendly.com/dhwani-sg/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex w-full items-center justify-center gap-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    Book a Demo
                  </a>
                  <a
                    href="https://www.ploxiconsult.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex w-full items-center justify-center py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
