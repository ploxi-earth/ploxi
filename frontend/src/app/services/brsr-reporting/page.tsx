'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Menu,
  X,
  FileText,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Download,
  ListChecks,
  Briefcase,
  Clock,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  LineChart
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const STRUGGLES = [
  {
    title: 'Data Fragmentation',
    description: 'ESG data is often siloed across HR, EHS, facilities, and finance departments, making aggregation difficult.',
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    title: 'Value Chain Visibility',
    description: 'The BRSR Core mandate requires tracking ESG metrics across your top upstream and downstream value chain partners.',
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    title: 'Assurance Readiness',
    description: 'Data must be robust enough to pass reasonable assurance audits by external third parties.',
    icon: <ShieldCheck className="h-6 w-6" />,
  },
];

const DELIVERABLES = [
  {
    title: 'Custom Reporting Templates',
    description: 'Standardized data collection templates mapped directly to SEBI’s BRSR Core requirements.',
    icon: <FileText className="h-6 w-6" />,
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'BRSR Gap Assessments',
    description: 'Identification of missing policies and data tracking mechanisms before the reporting cycle begins.',
    icon: <AlertCircle className="h-6 w-6" />,
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Advisory Support',
    description: 'Expert guidance through the disclosure process, value chain mapping, and assurance preparation.',
    icon: <BookOpen className="h-6 w-6" />,
    accent: 'from-primary-500 to-primary-700',
  },
];

const CHECKLIST = [
  'Identify internal data owners across EHS, HR, and Finance',
  'Map existing policies against the 9 National Guidelines on Responsible Business Conduct (NGRBC) principles',
  'Establish a baseline for Scope 1 and Scope 2 GHG emissions',
  'Identify top 75% of value chain partners (by value) for ESG integration',
  'Implement a robust data governance system for assurance readiness',
  'Conduct a trial run of the BRSR Core KPI disclosures'
];

const WORKFLOW = [
  { step: '1', title: 'Data Mapping', desc: 'Align existing metrics to NGRBC principles.' },
  { step: '2', title: 'Value Chain Integration', desc: 'Engage top supply chain partners for data.' },
  { step: '3', title: 'Assurance Readiness', desc: 'Conduct internal audits for data reliability.' },
  { step: '4', title: 'Report Generation', desc: 'Compile the final BRSR disclosure.' },
];

const FAQS = [
  {
    question: 'What is the difference between Comprehensive BRSR and BRSR Core?',
    answer: 'BRSR Comprehensive is a broad reporting framework covering over 100+ data points across 9 NGRBC principles. BRSR Core is a subset of 43 critical KPIs (Key Performance Indicators) that specifically require mandatory reasonable assurance by an external auditor.',
  },
  {
    question: 'Which companies are mandated to file BRSR Core?',
    answer: 'SEBI mandates BRSR Core reporting and reasonable assurance for the top 1,000 listed companies (by market capitalization) in India, phased in gradually starting from the top 150 companies.',
  },
  {
    question: 'How do we handle value chain ESG data?',
    answer: 'Under BRSR Core, companies must report ESG footprints for their value chain encompassing the top 75% of purchases/sales by value. We provide supply chain engagement templates to help gather this data systematically.',
  },
  {
    question: 'When should we start preparing?',
    answer: 'Preparation should begin at least 6-8 months before the end of the financial year. This allows adequate time to identify gaps, implement missing policies, and ensure data is assurance-ready.',
  }
];

export default function BRSRReportingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileNavOpen]);

  const scrollToDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('download-guide')?.scrollIntoView({ behavior: 'smooth' });
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
                <a href="#download-guide" onClick={scrollToDownload} className="btn-primary flex whitespace-nowrap items-center gap-2 px-4 py-2 text-sm transition-transform hover:-translate-y-0.5">
                  <Download className="h-4 w-4" />
                  Download Guide
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
                <a href="#download-guide" onClick={(e) => { setMobileNavOpen(false); scrollToDownload(e); }} className="btn-primary flex w-full items-center justify-center gap-2 transition-transform hover:-translate-y-0.5">
                  <Download className="h-4 w-4" />
                  Download Guide
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-24 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              SEBI BRSR Compliance
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-balance">
              BRSR Core Reporting <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Made Practical.</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Navigate SEBI's disclosure requirements confidently. Streamline data collection, engage your value chain, and prepare for assurance readiness.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#download-guide" onClick={scrollToDownload} className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2 justify-center">
                <Download className="h-5 w-5" />
                Download ESG Readiness Guide
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* What is BRSR Core */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <FadeUp>
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">What is BRSR Core?</h2>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  The Business Responsibility and Sustainability Report (BRSR) Core is a regulatory framework mandated by the Securities and Exchange Board of India (SEBI).
                </p>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  It focuses on critical, quantifiable ESG metrics (Key Performance Indicators) and requires mandatory independent reasonable assurance to ensure transparency and accountability among India's top listed companies and their value chains.
                </p>
              </FadeUp>
            </div>
            <div className="lg:w-1/2">
              <FadeUp delay={0.2} className="bg-slate-50 p-8 rounded-3xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Companies Struggle</h3>
                <div className="space-y-6">
                  {STRUGGLES.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting Workflow */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold">The BRSR Reporting Workflow</h2>
            <p className="mt-4 text-slate-400 text-lg">A clear path from fragmented data to assurance-ready disclosures.</p>
          </FadeUp>
          
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW.map((step, idx) => (
              <StaggerItem key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition">
                <div className="absolute -right-4 -top-4 text-8xl font-black text-slate-700/30 group-hover:text-emerald-500/10 transition">
                  {step.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-emerald-400 mb-3">{step.title}</h3>
                  <p className="text-slate-300 text-sm">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp delay={0.4} className="mt-16 bg-gradient-to-r from-emerald-900/50 to-slate-800 rounded-3xl p-8 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Benefits of Early Preparation</h3>
              <p className="text-emerald-100/80">Mitigate compliance risks, streamline internal processes, improve your external ESG ratings, and attract responsible institutional capital by staying ahead of the mandate.</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How We Help You Deliver</h2>
            <p className="mt-4 text-gray-600 text-lg">Comprehensive solutions to tackle the BRSR Core mandate.</p>
          </FadeUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DELIVERABLES.map((item) => (
              <StaggerItem key={item.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
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

      {/* Readiness Checklist UI */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <ListChecks className="h-8 w-8 text-primary-600" />
              <h2 className="text-3xl font-bold text-gray-900">Your BRSR Readiness Checklist</h2>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-gray-200">
              <ul className="space-y-4">
                {CHECKLIST.map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="mt-0.5">
                      <div className="w-6 h-6 rounded-md bg-primary-50 flex items-center justify-center border border-primary-100">
                        <CheckCircle2 className="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">BRSR Regulatory FAQ</h2>
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

      {/* Download Guide CTA Section */}
      <section id="download-guide" className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 sm:p-16 lg:p-20 shadow-2xl flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Info */}
            <div className="lg:w-1/2 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-6">
                Free Resource
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Download the Complete BRSR Readiness Guide</h2>
              <p className="text-emerald-100/80 mb-8 text-lg">
                Get our comprehensive blueprint for Indian enterprises. Inside you'll find data mapping strategies, value chain engagement templates, and an audit-prep checklist.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> 25+ Page PDF Guide
                </div>
                <div className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Sector-specific KPIs breakdown
                </div>
                <div className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Supply chain engagement strategy
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Where should we send your guide?</h3>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Rahul Sharma" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Work Email</label>
                    <input type="email" id="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="rahul@company.in" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
                    <input type="text" id="company" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Acme India Ltd." />
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 text-base font-semibold shadow-md flex items-center justify-center gap-2 mt-4">
                    <Download className="h-5 w-5" />
                    Download the Guide Now
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    By downloading, you agree to receive occasional updates about ESG compliance. You can unsubscribe at any time.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
