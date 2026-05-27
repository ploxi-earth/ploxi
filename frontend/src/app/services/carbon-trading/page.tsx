'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Menu,
  X,
  Calendar,
  CheckCircle2,
  ChevronDown,
  LineChart,
  Globe,
  Zap,
  BarChart3,
  TrendingUp,
  Coins,
  ShieldCheck,
  FileText,
  Wallet
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const MARKET_INSTRUMENTS = [
  {
    title: 'I-REC',
    fullname: 'International Renewable Energy Certificates',
    description: 'A global standard used to track and verify the origins of electricity generated from renewable sources. Purchasing I-RECs allows companies to claim Scope 2 emissions reductions.',
    icon: <Zap className="h-8 w-8" />,
    accent: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    title: 'Carbon Credits',
    fullname: 'Voluntary Carbon Market Offsets',
    description: 'Tradable certificates representing the removal or avoidance of one tonne of CO2e. Vital for neutralizing unavoidable Scope 1 and Scope 3 emissions on your path to Net Zero.',
    icon: <Globe className="h-8 w-8" />,
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    title: 'Compliance Trading',
    fullname: 'Cap-and-Trade / ETS Mechanisms',
    description: 'Advisory on navigating mandatory compliance markets, managing allowances, and optimizing your carbon trading portfolio to minimize tax liabilities.',
    icon: <BarChart3 className="h-8 w-8" />,
    accent: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Asset Registration', desc: 'Registering your renewable energy projects or emission reduction initiatives with accredited global registries.' },
  { step: '02', title: 'Verification', desc: 'Facilitating third-party audits to verify generation data and ensure issuance of certified credits/I-RECs.' },
  { step: '03', title: 'Market Strategy', desc: 'Analyzing current market prices and forecasting trends to determine the optimal time to sell or retire certificates.' },
  { step: '04', title: 'Trading & Settlement', desc: 'Executing secure transactions through our marketplace and ensuring proper retirement of credits against corporate targets.' },
];

const REVENUE_OPPS = [
  {
    title: 'Monetize Renewable Assets',
    description: 'If you generate captive solar or wind energy, we help you register the plant and sell the resulting I-RECs to companies seeking Scope 2 reductions, creating a new revenue stream.',
    icon: <Coins className="h-6 w-6 text-emerald-400" />
  },
  {
    title: 'Optimize Offset Procurement',
    description: 'Avoid price volatility. Our advisory ensures you procure high-quality carbon credits at the best market rates, safeguarding against greenwashing risks.',
    icon: <TrendingUp className="h-6 w-6 text-emerald-400" />
  },
  {
    title: 'Project Development Financing',
    description: 'Leverage future carbon credit issuance to secure upfront financing for new sustainable infrastructure and energy efficiency projects.',
    icon: <Wallet className="h-6 w-6 text-emerald-400" />
  }
];

const FAQS = [
  {
    question: 'What is the difference between an I-REC and a Carbon Credit?',
    answer: 'An I-REC specifically tracks the generation of 1 MWh of renewable electricity and is used solely to reduce Scope 2 (purchased electricity) emissions. A Carbon Credit represents 1 metric tonne of CO2 avoided or removed from the atmosphere and can be used to offset Scope 1, 2, or 3 emissions.',
  },
  {
    question: 'How do I know the carbon credits I buy are legitimate?',
    answer: 'We exclusively source and trade credits verified by internationally recognized standard bodies like Verra (VCS), Gold Standard, and the American Carbon Registry, ensuring additionality, permanence, and no double counting.',
  },
  {
    question: 'Can my company sell I-RECs if we have rooftop solar?',
    answer: 'Yes. If you own the renewable generation asset and consume the power, you can register the installation to generate I-RECs. You can then sell these certificates, though you can no longer claim that specific renewable energy usage for your own sustainability reporting.',
  },
  {
    question: 'How transparent is the pricing?',
    answer: 'Our advisory provides full market transparency. We share current index prices, historical trends, and bid/ask spreads to ensure you are buying or selling at fair market value.',
  }
];

export default function CarbonTradingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileNavOpen]);

  const scrollToLeadCapture = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-shell min-h-screen bg-slate-50">
      {/* Navbar */}
      <HeroFadeDown delay={0} className="sticky top-0 z-50">
        <header className="border-b border-white/10 bg-white/80 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center justify-start min-w-0">
              <Link href="/" className="flex min-w-0 items-center gap-3">
                <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={42} height={42} className="flex-shrink-0 rounded-full ring-2 ring-primary-500/10" />
                <div className="min-w-0">
                  <span className="block truncate text-lg font-bold text-gray-900">Ploxi Earth</span>
                  <span className="hidden text-xs uppercase tracking-[0.22em] text-gray-400 xl:block">
                    Decarbonisation Marketplace
                  </span>
                </div>
              </Link>
            </div>
            <nav className="hidden lg:flex flex-shrink-0 items-center justify-center gap-1 xl:gap-4">
              {NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600 xl:px-4">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="hidden lg:flex items-center gap-2 xl:gap-3">
                <a href="#lead-capture" onClick={scrollToLeadCapture} className="btn-primary flex whitespace-nowrap items-center gap-2 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5">
                  <LineChart className="h-4 w-4" />
                  Advisory
                </a>
              </div>
              <button type="button" onClick={() => setMobileNavOpen(true)} className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
      </HeroFadeDown>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.button type="button" aria-label="Close navigation" className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileNavOpen(false)} />
            <motion.div className="fixed inset-x-4 top-4 z-[70] overflow-hidden rounded-[28px] border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden" initial={{ opacity: 0, y: -24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18, scale: 0.98 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={38} height={38} className="rounded-full" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">Ploxi Earth</p>
                  </div>
                </div>
                <button type="button" onClick={() => setMobileNavOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {NAV_LINKS.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700">
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <a href="#lead-capture" onClick={(e) => { setMobileNavOpen(false); scrollToLeadCapture(e); }} className="btn-primary flex w-full items-center justify-center gap-2 transition-transform hover:-translate-y-0.5">
                  <LineChart className="h-4 w-4" />
                  Explore Advisory
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-24 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary-900/30 via-slate-950 to-slate-950" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-96 w-full max-w-2xl rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Environmental Commodities
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-balance">
              Turn Sustainability Action Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Market Value.</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Navigate renewable certificates, voluntary carbon markets, and compliance offsets with our expert trading advisory and registration services.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#lead-capture" onClick={scrollToLeadCapture} className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/20">
                Explore Carbon Market Advisory
              </a>
              <a href="#markets" onClick={(e) => { e.preventDefault(); document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">
                View Instruments
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Market Instruments */}
      <section id="markets" className="bg-slate-50 py-24 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              The Tools of Decarbonization
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Understand the key environmental commodities driving the global transition to Net Zero.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MARKET_INSTRUMENTS.map((inst) => (
              <StaggerItem key={inst.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${inst.bg} border ${inst.border} ${inst.accent}`}>
                  {inst.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{inst.title}</h3>
                <div className="text-sm font-semibold text-gray-400 mb-4">{inst.fullname}</div>
                <p className="text-gray-600 leading-relaxed">{inst.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Dynamic Carbon Market Graphics / Trading Process */}
      <section className="bg-white py-24 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                Trading Process & Market Workflow
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Carbon markets are complex and highly regulated. We provide end-to-end support, acting as your trusted intermediary whether you are seeking to retire credits for claims, or monetize your own green assets.
              </p>
              
              <div className="space-y-6">
                {PROCESS_STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shadow-md">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{step.title}</h4>
                      <p className="text-gray-600 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Mock Trading Dashboard UI */}
            <FadeUp delay={0.2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-cyan-100 rounded-[2.5rem] transform rotate-2 opacity-50" />
              <div className="relative bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 text-white overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-slate-200">Market Index Live</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
                
                {/* Mock Chart Area */}
                <div className="mb-6 h-40 flex items-end gap-2 px-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="w-full h-px bg-white" />
                    <div className="w-full h-px bg-white" />
                    <div className="w-full h-px bg-white" />
                    <div className="w-full h-px bg-white" />
                  </div>
                  {/* Bars */}
                  {[40, 55, 45, 70, 65, 80, 95, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-emerald-900 to-emerald-400 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                  {/* Line Overlay */}
                  <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,60 L14,45 L28,55 L42,30 L56,35 L70,20 L84,5 L100,15" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Mock Tickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">I-REC (India Wind)</div>
                    <div className="flex items-end justify-between">
                      <div className="text-xl font-bold text-white">₹ 145.00</div>
                      <div className="text-xs text-emerald-400 font-medium">+2.4%</div>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">VCS (Nature Based)</div>
                    <div className="flex items-end justify-between">
                      <div className="text-xl font-bold text-white">$ 8.50</div>
                      <div className="text-xs text-emerald-400 font-medium">+1.1%</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Revenue Opportunities */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold">Revenue & Value Opportunities</h2>
            <p className="mt-4 text-slate-400 text-lg">It's not just about compliance; it's about capitalizing on the green economy.</p>
          </FadeUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVENUE_OPPS.map((item) => (
              <StaggerItem key={item.title} className="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:-translate-y-1 transition duration-300">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-700 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-50 py-20 border-y border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Carbon Trading FAQ</h2>
          </FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50 transition"
                >
                  <span className="text-left">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-gray-600 text-sm"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form Section */}
      <section id="lead-capture" className="bg-white py-24 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-emerald-50 to-white pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row-reverse">
            {/* Right Info */}
            <div className="lg:w-5/12 p-10 sm:p-14 bg-gradient-to-bl from-emerald-900 to-slate-900 text-white flex flex-col justify-center">
              <LineChart className="h-12 w-12 text-emerald-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Explore Market Advisory</h2>
              <p className="text-emerald-100/80 mb-8">
                Whether you need to offset emissions or monetize renewable assets, our trading experts are ready to guide your strategy.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Transparent pricing
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Verified global standards
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> End-to-end registration
                </div>
              </div>
            </div>

            {/* Left Form */}
            <div className="lg:w-7/12 p-10 sm:p-14 bg-white">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Work Email</label>
                    <input type="email" id="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="john@company.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
                  <input type="text" id="company" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Acme Renewables" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="interest" className="text-sm font-medium text-gray-700">Primary Interest</label>
                  <select id="interest" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                    <option value="">Select your goal...</option>
                    <option value="buy_irec">Procure I-RECs (Scope 2)</option>
                    <option value="buy_carbon">Procure Carbon Credits (Offsets)</option>
                    <option value="sell_irec">Register & Monetize Renewable Assets</option>
                    <option value="compliance">Compliance Trading (ETS)</option>
                    <option value="advisory">General Market Advisory</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="volume" className="text-sm font-medium text-gray-700">Estimated Volume (Optional)</label>
                  <input type="text" id="volume" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="e.g., 50,000 MWh or 10,000 tCO2e" />
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base font-semibold shadow-md">
                  Request Market Consultation
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
