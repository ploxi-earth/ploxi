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
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle2,
  Leaf,
  Factory,
  Truck,
  FileCheck,
  Activity,
  Layers,
  ChevronDown,
  Shield,
  Zap
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const SCOPES = [
  {
    title: 'Scope 1',
    subtitle: 'Direct Emissions',
    description: 'Emissions from sources that are owned or controlled by your organization. Examples include company vehicles and onsite fuel combustion.',
    icon: <Factory className="h-8 w-8" />,
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    title: 'Scope 2',
    subtitle: 'Indirect Emissions (Energy)',
    description: 'Emissions from the generation of purchased electricity, steam, heating, and cooling consumed by your organization.',
    icon: <Zap className="h-8 w-8" />,
    accent: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    title: 'Scope 3',
    subtitle: 'Value Chain Emissions',
    description: 'All other indirect emissions that occur in your value chain, including both upstream and downstream activities.',
    icon: <Truck className="h-8 w-8" />,
    accent: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
];

const DELIVERABLES = [
  {
    title: 'Emissions Inventory',
    description: 'A comprehensive, granular accounting of your GHG emissions across Scope 1, 2, and 3 activities.',
    icon: <PieChart className="h-6 w-6" />,
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Baseline Report',
    description: 'An official document establishing your historical emissions baseline, ready for audit and disclosure.',
    icon: <FileCheck className="h-6 w-6" />,
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Reduction Roadmap',
    description: 'Actionable decarbonization strategies with estimated impact to help you achieve Net Zero targets.',
    icon: <LineChart className="h-6 w-6" />,
    accent: 'from-primary-500 to-primary-700',
  },
];

const PROCESS_STEPS = [
  {
    title: 'Kickoff & Boundary Setting',
    description: 'Define organizational and operational boundaries according to the GHG Protocol.'
  },
  {
    title: 'Data Collection & Aggregation',
    description: 'Gather energy bills, fuel usage, and supply chain data systematically.'
  },
  {
    title: 'Emission Factor Mapping',
    description: 'Apply the latest, region-specific emission factors (e.g., DEFRA, EPA) to calculate CO2e.'
  },
  {
    title: 'Accounting & Validation',
    description: 'Rigorous calculation and quality assurance to ensure audit-readiness.'
  },
  {
    title: 'Reporting & Strategy',
    description: 'Delivery of the GHG Baseline Report and strategic reduction recommendations.'
  }
];

const FAQS = [
  {
    question: 'What is the GHG Protocol?',
    answer: 'The Greenhouse Gas Protocol is the world\'s most widely used greenhouse gas accounting standard for companies and organizations to measure and manage their emissions.',
  },
  {
    question: 'How long does a GHG audit typically take?',
    answer: 'Depending on the complexity of your organization and data availability, a comprehensive GHG audit across all three scopes typically takes 4 to 8 weeks.',
  },
  {
    question: 'Do you calculate Scope 3 emissions?',
    answer: 'Yes. While Scope 3 is often the most challenging due to data availability in the value chain, we use spend-based, average-data, and supplier-specific methods to build a reliable Scope 3 inventory.',
  },
  {
    question: 'Are your reports ready for verification by a third party?',
    answer: 'Absolutely. Our methodology strictly adheres to the GHG Protocol and ISO 14064 standards, ensuring the final emissions inventory is fully audit-ready.',
  }
];

export default function GHGAuditPage() {
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
                  <Calendar className="h-4 w-4" />
                  Schedule Inventory
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
                  <Calendar className="h-4 w-4" />
                  Schedule Inventory
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-24 pt-20 lg:pt-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              GHG Audit & Carbon Accounting
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-balance">
              Measure Emissions. Establish Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Carbon Baseline.</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Build a credible, audit-ready emissions inventory aligned with global reporting standards like the GHG Protocol and ISO 14064.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#lead-capture" onClick={scrollToLeadCapture} className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/20">
                Schedule Emissions Inventory
              </a>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">
                Explore Process
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Trust Metrics / Logos */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
            Standards & Frameworks Compliant
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 opacity-60">
            <div className="text-xl font-bold text-gray-600">GHG Protocol</div>
            <div className="text-xl font-bold text-gray-600">ISO 14064</div>
            <div className="text-xl font-bold text-gray-600">SBTi</div>
            <div className="text-xl font-bold text-gray-600">CDP</div>
          </div>
        </div>
      </section>

      {/* Understanding Scopes Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Understanding Your Emissions Footprint
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A robust GHG inventory categorizes emissions into three scopes to prevent double counting and accurately assign responsibility across the value chain.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SCOPES.map((scope) => (
              <StaggerItem key={scope.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition group">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${scope.bg} border ${scope.border} ${scope.accent}`}>
                  {scope.icon}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{scope.title}</h3>
                </div>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${scope.accent}`}>{scope.subtitle}</h4>
                <p className="text-gray-600 leading-relaxed">{scope.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Carbon Dashboard Mockup Section */}
      <section className="bg-white py-24 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Turn Raw Data into <span className="text-primary-600">Actionable Intelligence</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                We do more than just crunch numbers. Our audit delivers your emissions data in a structured, visual format that leadership teams and stakeholders can instantly understand.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Identify your largest emission hotspots instantly.',
                  'Track energy consumption trends across facilities.',
                  'Prepare data for Science Based Targets (SBTi) submission.',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>

            {/* Dashboard Mock UI */}
            <FadeUp delay={0.2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-[2.5rem] transform rotate-3 opacity-50" />
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold text-gray-700">Carbon Footprint Overview</span>
                  </div>
                  <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">FY 2024</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Emissions</p>
                    <p className="text-2xl font-bold text-gray-900">14,250 <span className="text-sm font-normal text-gray-500">tCO2e</span></p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Energy Intensity</p>
                    <p className="text-2xl font-bold text-gray-900">3.2 <span className="text-sm font-normal text-gray-500">MWh/fte</span></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Emissions by Scope</p>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-xs text-gray-500">Scope 1</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[20%] rounded-full" />
                    </div>
                    <div className="w-12 text-right text-xs font-medium">20%</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-xs text-gray-500">Scope 2</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[35%] rounded-full" />
                    </div>
                    <div className="w-12 text-right text-xs font-medium">35%</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-xs text-gray-500">Scope 3</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[45%] rounded-full" />
                    </div>
                    <div className="w-12 text-right text-xs font-medium">45%</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Accounting Process */}
      <section id="how-it-works" className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold">The Carbon Accounting Process</h2>
            <p className="mt-4 text-slate-400 text-lg">A systematic, rigorous approach to calculating your footprint.</p>
          </FadeUp>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 transform -translate-x-1/2" />
            
            <div className="space-y-12 relative">
              {PROCESS_STEPS.map((step, idx) => (
                <FadeUp key={step.title} delay={idx * 0.1} className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`md:w-1/2 flex ${idx % 2 !== 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 w-full max-w-md hover:border-emerald-500/50 transition duration-300 relative group">
                      <div className="absolute top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10
                        ${idx % 2 === 0 ? '-right-[2.5rem]' : '-left-[2.5rem]'}">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2" />
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What You Receive</h2>
          </FadeUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DELIVERABLES.map((item) => (
              <StaggerItem key={item.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-inner`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/3">
              <h2 className="text-2xl font-bold text-gray-900">Proven across complex industries</h2>
              <p className="mt-2 text-gray-600">We handle the nuances of varied supply chains.</p>
            </div>
            <div className="md:w-2/3 flex flex-wrap gap-3 md:justify-end">
              {['Real Estate', 'Manufacturing', 'Technology', 'Transportation', 'Agriculture', 'Retail'].map((ind) => (
                <span key={ind} className="px-4 py-2 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
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
              <Leaf className="h-12 w-12 text-emerald-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Start your carbon accounting journey</h2>
              <p className="text-emerald-100/80 mb-8">
                Provide some basic information about your organization to help us prepare a tailored approach for your emissions inventory.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> GHG Protocol Aligned
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Transparent Methodology
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Audit-Ready Outputs
                </div>
              </div>
            </div>

            {/* Left Form */}
            <div className="lg:w-7/12 p-10 sm:p-14 bg-white">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Jane Smith" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Work Email</label>
                    <input type="email" id="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="jane@company.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
                  <input type="text" id="company" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Acme Logistics" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="industry" className="text-sm font-medium text-gray-700">Industry</label>
                    <select id="industry" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                      <option value="">Select Industry</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="transportation">Transportation / Logistics</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="technology">Technology</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="energy" className="text-sm font-medium text-gray-700">Est. Annual Energy Use / Fleet Size</label>
                    <select id="energy" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                      <option value="">Select Range</option>
                      <option value="small">&lt; 1,000 MWh / &lt; 50 Vehicles</option>
                      <option value="medium">1,000 - 10,000 MWh</option>
                      <option value="large">10,000 - 50,000 MWh</option>
                      <option value="enterprise">&gt; 50,000 MWh</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base font-semibold shadow-md">
                  Request Consultation
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  Your information is securely stored and never shared with third parties.
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
