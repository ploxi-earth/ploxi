'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  Wallet,
  Sprout,
  Zap,
  Briefcase,
  TrendingUp,
  Leaf,
  Handshake,
  Search,
  FileText,
  Building2,
  BadgeDollarSign
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const PROJECT_TYPES = [
  {
    title: 'Nature-Based Solutions',
    description: 'Afforestation, reforestation, and regenerative agriculture projects that sequester carbon directly from the atmosphere.',
    icon: <Sprout className="h-8 w-8" />,
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    title: 'Technology & Direct Air Capture',
    description: 'Capital-intensive innovations including CCUS (Carbon Capture, Utilization, and Storage) and advanced biomass technologies.',
    icon: <Building2 className="h-8 w-8" />,
    accent: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    title: 'Energy Efficiency & Renewables',
    description: 'Large-scale solar, wind, and industrial energy efficiency upgrades generating predictable, long-term carbon avoidance credits.',
    icon: <Zap className="h-8 w-8" />,
    accent: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
];

const PROCESS_STEPS = [
  { step: '1', title: 'Initial Screening', desc: 'We evaluate your project\'s carbon yield potential, methodology alignment, and basic financial viability.' },
  { step: '2', title: 'Due Diligence', desc: 'Rigorous technical and legal assessment to verify additionality, permanence, and risk mitigation strategies.' },
  { step: '3', title: 'Deal Structuring', desc: 'We design the financial instrument, whether it is forward-financing, equity, or an emission reduction purchase agreement (ERPA).' },
  { step: '4', title: 'Capital Deployment', desc: 'Connecting you with our network of institutional investors and facilitating the final transaction.' },
];

const BENEFITS = [
  {
    title: 'Unlock Upfront Capital',
    description: 'Transform future carbon credit issuance into immediate working capital to cover CAPEX and operational costs.',
    icon: <Wallet className="h-6 w-6 text-emerald-400" />
  },
  {
    title: 'Access Global Investors',
    description: 'Tap into our curated network of climate funds, impact investors, and corporations seeking high-quality offsets.',
    icon: <Handshake className="h-6 w-6 text-emerald-400" />
  },
  {
    title: 'Mitigate Market Risk',
    description: 'Secure long-term offtake agreements that insulate your project from voluntary carbon market price volatility.',
    icon: <TrendingUp className="h-6 w-6 text-emerald-400" />
  }
];

const FAQS = [
  {
    question: 'What size projects do you finance?',
    answer: 'We typically focus on mid-to-large scale projects requiring $1M to $50M in funding. However, we can also assist highly scalable, innovative pilot projects in securing early-stage capital.',
  },
  {
    question: 'How does carbon forward-financing work?',
    answer: 'Investors provide upfront capital to develop the project. In return, they receive the right to a portion of the verified carbon credits generated in the future at a pre-negotiated discount.',
  },
  {
    question: 'Do you guarantee funding?',
    answer: 'While we cannot guarantee funding, our rigorous pre-screening and eligibility assessment ensure that any project we present to our investor network has a significantly higher probability of securing capital.',
  },
  {
    question: 'Which carbon standards do you accept?',
    answer: 'We prioritize projects adhering to internationally recognized standards such as Verra (VCS), Gold Standard, ACR, and CAR to ensure credit integrity and investor confidence.',
  }
];

export default function CarbonFinancingPage() {
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
                  <BadgeDollarSign className="h-4 w-4" />
                  Connect
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
                  <BadgeDollarSign className="h-4 w-4" />
                  Connect with Investors
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-24 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Project Finance & Advisory
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-balance">
              Secure Capital for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Climate Projects.</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Bridge your sustainability initiatives with global financing opportunities. We connect high-integrity carbon projects with institutional capital.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#lead-capture" onClick={scrollToLeadCapture} className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                <BadgeDollarSign className="h-5 w-5" />
                Connect with Climate Investors
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Project Types */}
      <section className="bg-slate-50 py-24 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Projects We Finance
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We focus on high-impact, verifiable projects capable of generating high-quality carbon credits.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECT_TYPES.map((type) => (
              <StaggerItem key={type.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${type.bg} border ${type.border} ${type.accent}`}>
                  {type.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{type.title}</h3>
                <p className="text-gray-600 leading-relaxed">{type.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Ecosystem & Process Flow */}
      <section className="bg-white py-24 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                The Climate <span className="text-primary-600">Financing Ecosystem</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Navigating the landscape of climate finance can be daunting. We act as the bridge between project developers and institutional capital, streamlining the due diligence and structuring processes.
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

            {/* Eligibility Assessment UI */}
            <FadeUp delay={0.2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tl from-emerald-100 to-slate-100 rounded-[2.5rem] transform -rotate-2 opacity-50" />
              <div className="relative bg-slate-50 rounded-3xl border border-gray-200 shadow-xl p-8">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
                  <Search className="h-8 w-8 text-primary-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Eligibility Assessment</h3>
                </div>
                
                <ul className="space-y-6">
                  {[
                    { title: 'Additionality Validated', desc: 'Project requires carbon revenue to be viable.' },
                    { title: 'Permanence Secured', desc: 'Emissions reductions are long-term and irreversible.' },
                    { title: 'Clear Baseline Methodology', desc: 'Conforms to strict Verra or Gold Standard criteria.' },
                    { title: 'Co-benefits Identified', desc: 'Positive impact on local communities and biodiversity.' },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Partner With Us?</h2>
            <p className="mt-4 text-slate-400 text-lg">We accelerate your path from concept to capital deployment.</p>
          </FadeUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((item) => (
              <StaggerItem key={item.title} className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 hover:bg-slate-800 transition duration-300">
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

      {/* Case Studies Placeholder */}
      <section className="bg-slate-50 py-24 border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Proven Success</h2>
            <p className="mt-4 text-lg text-gray-600">Examples of projects we've successfully brought to market.</p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case Study 1 */}
            <StaggerItem className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm group cursor-pointer hover:shadow-md transition">
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                <Leaf className="h-16 w-16 text-emerald-200 group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Nature-Based</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Agroforestry Project in SE Asia</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">Secured $5M in forward-financing through an ERPA, enabling the planting of 2M trees and supporting local farming communities.</p>
                <div className="flex items-center text-primary-600 font-semibold text-sm">
                  View Case Study <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </StaggerItem>

            {/* Case Study 2 */}
            <StaggerItem className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm group cursor-pointer hover:shadow-md transition">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-blue-200 group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Technology</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Industrial Biochar Facility</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">Structured a blended finance solution providing $12M CAPEX for a state-of-the-art biochar production plant.</p>
                <div className="flex items-center text-primary-600 font-semibold text-sm">
                  View Case Study <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Financing FAQ</h2>
          </FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition"
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
      <section id="lead-capture" className="bg-slate-50 py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            {/* Left Info */}
            <div className="lg:w-5/12 p-10 sm:p-14 bg-gradient-to-br from-emerald-900 to-slate-900 text-white flex flex-col justify-center">
              <Briefcase className="h-12 w-12 text-emerald-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Connect with Climate Investors</h2>
              <p className="text-emerald-100/80 mb-8">
                Ready to fund your sustainability initiative? Submit your project details for an initial eligibility review.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Confidential review process
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Access to institutional funds
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Custom term sheet structuring
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:w-7/12 p-10 sm:p-14 bg-white">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Work Email</label>
                    <input type="email" id="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="john@project.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-gray-700">Organization Name</label>
                    <input type="text" id="company" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Green Infra Corp" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="projectType" className="text-sm font-medium text-gray-700">Project Type</label>
                    <select id="projectType" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                      <option value="">Select type...</option>
                      <option value="nature">Nature-Based (Forestry, Ag)</option>
                      <option value="tech">Tech-Based (CCUS, Biochar)</option>
                      <option value="energy">Renewable Energy / Efficiency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="funding" className="text-sm font-medium text-gray-700">Funding Requirement (USD)</label>
                  <select id="funding" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                    <option value="">Select range...</option>
                    <option value="seed">&lt; $1 Million</option>
                    <option value="growth">$1 Million - $5 Million</option>
                    <option value="scale">$5 Million - $20 Million</option>
                    <option value="enterprise">&gt; $20 Million</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="details" className="text-sm font-medium text-gray-700">Project Overview</label>
                  <textarea id="details" rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition resize-none" placeholder="Briefly describe the project's current stage, location, and estimated carbon yield..."></textarea>
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base font-semibold shadow-md">
                  Submit Project for Review
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
