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
  BarChart,
  Map,
  FileText,
  CheckCircle2,
  TrendingUp,
  Shield,
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const DELIVERABLES = [
  {
    title: 'ESG Scorecard',
    description: 'A quantifiable measure of your current environmental, social, and governance maturity against industry peers.',
    icon: <BarChart className="h-6 w-6" />,
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Comprehensive Gap Report',
    description: 'Detailed analysis identifying missing policies, data tracking gaps, and areas needing immediate compliance attention.',
    icon: <FileText className="h-6 w-6" />,
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Strategic Roadmap',
    description: 'A step-by-step, actionable plan prioritizing quick wins and long-term structural changes for sustainability readiness.',
    icon: <Map className="h-6 w-6" />,
    accent: 'from-primary-500 to-primary-700',
  },
];

const METHODOLOGY_STEPS = [
  {
    step: '01',
    title: 'Discovery & Mapping',
    description: 'We align your business operations with suitable global frameworks (GRI, SASB, CSRD) and identify key stakeholders.',
  },
  {
    step: '02',
    title: 'Data Collection & Assessment',
    description: 'Comprehensive review of your existing sustainability data, policies, and governance structures.',
  },
  {
    step: '03',
    title: 'Gap Identification',
    description: 'Comparing current state vs. framework requirements to pinpoint critical compliance and performance gaps.',
  },
  {
    step: '04',
    title: 'Actionable Roadmap',
    description: 'Delivering prioritized recommendations, resource requirements, and timelines to achieve target ESG maturity.',
  },
];

const FAQS = [
  {
    question: 'How long does a baseline assessment take?',
    answer: 'A standard ESG Baseline & Gap Analysis typically takes 4-6 weeks, depending on the size of your organization and data availability.',
  },
  {
    question: 'Which frameworks do you map against?',
    answer: 'We tailor the assessment to your regional and industry needs, commonly mapping against GRI, SASB, TCFD, CSRD, and BRSR.',
  },
  {
    question: 'Do we need prior sustainability data?',
    answer: 'No prior formal reporting is needed. The baseline assessment is designed precisely to find out what data you have and what you are missing.',
  },
];

export default function ESGBaselinePage() {
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
      {/* Navbar - Kept consistent with main pages */}
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
                  Book Assessment
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
                  Book Assessment
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        {/* Subtle background abstract shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/20 blur-[100px]" />
          <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Sustainability Consulting Services
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Understand Where Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">ESG Journey Stands</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Identify gaps, benchmark performance, and build a robust roadmap toward sustainability readiness and compliance.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex justify-center">
              <a href="#lead-capture" onClick={scrollToLeadCapture} className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-primary-600/20">
                Book ESG Baseline Assessment
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Trust Metrics / Logos */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
            Trusted by forward-thinking enterprises
          </p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-50 grayscale">
            {/* Mock placeholders for client logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 text-xl font-bold text-gray-400">
                <Layers className="h-6 w-6" /> Logo {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Why you need it */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why do you need an <span className="text-primary-600">ESG Baseline?</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Navigating the complex landscape of sustainability reporting can be overwhelming. Without a clear starting point, organizations risk compliance failures, missed investment opportunities, and stakeholder distrust.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Stay ahead of mandatory regulatory disclosures (CSRD, BRSR).',
                  'Respond confidently to investor and stakeholder ESG inquiries.',
                  'Identify operational inefficiencies and cost-saving opportunities.',
                  'Set realistic, science-based targets grounded in actual data.',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp delay={0.2} className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-tr from-emerald-100 to-cyan-50 p-8 shadow-xl border border-white flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <Activity className="h-8 w-8 text-blue-500 mb-3" />
                    <h4 className="font-semibold text-gray-900">Current State</h4>
                    <p className="text-sm text-gray-500 mt-1">Fragmented data & ad-hoc policies</p>
                  </div>
                  <div className="rounded-2xl bg-primary-600 p-6 shadow-sm text-white transform translate-y-4">
                    <TrendingUp className="h-8 w-8 text-primary-200 mb-3" />
                    <h4 className="font-semibold">Target State</h4>
                    <p className="text-sm text-primary-100 mt-1">Compliant, tracked & optimized</p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 mt-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Map className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">The Gap Analysis</h4>
                      <p className="text-sm text-gray-500">The bridge to readiness</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Framework Mapping */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Align with Global Standards</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              We map your existing policies and data against the world's leading sustainability reporting frameworks to ensure full compliance.
            </p>
          </FadeUp>
          <StaggerContainer className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
            {['GRI', 'SASB', 'TCFD', 'CSRD', 'BRSR', 'CDP'].map((framework) => (
              <StaggerItem key={framework} className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 font-semibold text-gray-700 shadow-sm transition hover:border-primary-300 hover:bg-primary-50">
                {framework}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Methodology & Process */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-900/30 blur-3xl rounded-full" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Our Gap Identification Methodology</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">A structured, proven approach to baseline your ESG performance.</p>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {METHODOLOGY_STEPS.map((step, idx) => (
              <FadeUp key={step.step} delay={idx * 0.1} className="relative">
                <div className="text-5xl font-extrabold text-white/5 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">{step.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
                {idx !== METHODOLOGY_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-[-2rem] w-8 border-t border-dashed border-slate-700" />
                )}
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Key Deliverables */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Tangible Outcomes</h2>
            <p className="mt-4 text-gray-600 text-lg">Everything you need to confidently advance your ESG strategy.</p>
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

      {/* Industries Served */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tailored for Complex Supply Chains</h2>
          </FadeUp>
          <div className="flex flex-wrap justify-center gap-4">
            {['Manufacturing', 'Exporters', 'Heavy Enterprise', 'Logistics & Supply Chain', 'Energy'].map((industry) => (
              <span key={industry} className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-800 text-sm font-medium border border-emerald-100">
                {industry}
              </span>
            ))}
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
        {/* Decor */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50 to-white pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            {/* Left Info */}
            <div className="lg:w-5/12 p-10 sm:p-14 bg-gradient-to-br from-emerald-900 to-slate-900 text-white flex flex-col justify-center">
              <Shield className="h-12 w-12 text-emerald-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Ready to baseline your ESG performance?</h2>
              <p className="text-emerald-100/80 mb-8">
                Fill out the form to request a consultation. Our sustainability experts will review your requirements and get in touch within 24 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> No commitment required
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Customized proposal
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Expert guidance
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
                    <input type="email" id="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="john@company.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
                    <input type="text" id="company" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="industry" className="text-sm font-medium text-gray-700">Industry</label>
                    <select id="industry" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                      <option value="">Select Industry</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="energy">Energy & Utilities</option>
                      <option value="logistics">Logistics</option>
                      <option value="technology">Technology</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-medium text-gray-700">Assessment Requirements / Focus Areas</label>
                  <textarea id="requirements" rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition resize-none" placeholder="Tell us briefly about your current sustainability goals and reporting needs..."></textarea>
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base font-semibold shadow-md">
                  Request Assessment Proposal
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
