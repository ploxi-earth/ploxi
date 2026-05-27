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
  Globe2,
  Scale,
  FileWarning,
  ShieldAlert,
  ListChecks,
  Activity,
  Briefcase,
  Clock,
  Target,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const REGULATIONS = [
  {
    title: 'CBAM',
    fullname: 'Carbon Border Adjustment Mechanism',
    description: 'The EU\'s landmark tool to put a fair price on the carbon emitted during the production of carbon-intensive goods entering the EU. Importers must report embedded emissions and eventually purchase certificates.',
    icon: <Globe2 className="h-8 w-8" />,
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    title: 'ICTS',
    fullname: 'Indian Carbon Trading Scheme / Standards',
    description: 'Emerging domestic compliance mechanisms and trading standards that mandate carbon intensity reductions for designated sectors, enforcing stricter accounting and reporting methodologies.',
    icon: <Activity className="h-8 w-8" />,
    accent: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    title: 'EPR',
    fullname: 'Extended Producer Responsibility',
    description: 'Policy approaches that make producers responsible for the end-of-life impact of their products, particularly concerning plastic packaging, e-waste, and batteries. Essential for market access.',
    icon: <Scale className="h-8 w-8" />,
    accent: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
];

const RISK_MATRIX = [
  {
    level: 'High Risk',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    consequences: ['Loss of EU market access (CBAM)', 'Severe financial penalties', 'Supply chain delisting', 'Reputational damage']
  },
  {
    level: 'Medium Risk',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <FileWarning className="h-5 w-5 text-amber-500" />,
    consequences: ['Increased taxation & carbon fees', 'Delayed shipments at customs', 'Increased scrutiny from auditors']
  },
  {
    level: 'Low Risk (Compliant)',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <ShieldAlert className="h-5 w-5 text-emerald-500" />,
    consequences: ['Uninterrupted market access', 'Preferred supplier status', 'Optimized carbon tax burden']
  }
];

const WORKFLOW = [
  { step: '1', title: 'Regulatory Mapping', desc: 'Identify which regulations (CBAM, EPR, etc.) apply to your specific product codes and export markets.' },
  { step: '2', title: 'Data Readiness Check', desc: 'Assess current data availability against regulatory reporting requirements.' },
  { step: '3', title: 'Methodology Alignment', desc: 'Implement the correct calculation methodologies (e.g., CBAM default values vs. actual emissions).' },
  { step: '4', title: 'Filing & Submission', desc: 'Prepare and submit the finalized compliance reports to the respective authorities.' },
];

const DELIVERABLES = [
  {
    title: 'CBAM Declarations',
    description: 'Quarterly and annual reports accurately calculating embedded emissions for EU importers.',
    icon: <FileCheck className="h-6 w-6" />,
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Compliance Roadmaps',
    description: 'A strategic timeline outlining exactly when and how to collect necessary data to avoid penalties.',
    icon: <Target className="h-6 w-6" />,
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'EPR Registration Support',
    description: 'End-to-end assistance with Extended Producer Responsibility registration and waste management planning.',
    icon: <ListChecks className="h-6 w-6" />,
    accent: 'from-primary-500 to-primary-700',
  },
];

const FAQS = [
  {
    question: 'When do financial obligations for CBAM begin?',
    answer: 'The CBAM transitional phase (reporting only) began in October 2023. The definitive phase, where importers must purchase and surrender CBAM certificates, begins on January 1, 2026.',
  },
  {
    question: 'What happens if we fail to report under CBAM?',
    answer: 'Failure to submit a CBAM report, or submitting an incorrect/incomplete report, can result in penalties ranging from €10 to €50 per tonne of unreported embedded emissions, scaling up based on the severity.',
  },
  {
    question: 'Are EPR regulations the same globally?',
    answer: 'No. Extended Producer Responsibility regulations vary significantly by country and even by state/province. We help map your export destinations to the specific local EPR requirements.',
  },
  {
    question: 'Do you communicate with our EU importers directly?',
    answer: 'Yes, we can act as the technical liaison between your manufacturing facilities and your EU clients/importers to ensure they have the exact embedded emissions data they need to file their declarations.',
  }
];

export default function ComplianceSupportPage() {
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
                  <Briefcase className="h-4 w-4" />
                  Consultation
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
                  <Briefcase className="h-4 w-4" />
                  Request Consultation
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-24 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-emerald-950/40" />
        <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-primary-600/10 blur-[150px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Regulatory Compliance Support
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-balance">
              Navigate Evolving <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Sustainability Regulations.</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Stay compliant with international requirements, mitigate border taxes, and avoid reporting risks across CBAM, EPR, and emerging carbon standards.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex justify-center">
              <a href="#lead-capture" onClick={scrollToLeadCapture} className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Request Compliance Consultation
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Regulation Overview Cards */}
      <section className="bg-slate-50 py-24 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Key Compliance Frameworks
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We decode complex legislative texts into actionable, operational requirements for your business.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REGULATIONS.map((reg) => (
              <StaggerItem key={reg.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${reg.bg} border ${reg.border} ${reg.accent}`}>
                  {reg.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{reg.title}</h3>
                <div className="text-sm font-semibold text-gray-400 mb-4">{reg.fullname}</div>
                <p className="text-gray-600 leading-relaxed">{reg.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Compliance Timelines & Risk Matrix */}
      <section className="bg-white py-24 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Timelines */}
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary-600" />
                Critical Timelines
              </h2>
              <div className="relative border-l-2 border-gray-200 ml-4 space-y-10 pl-8">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-amber-500 shadow-sm" />
                  <div className="text-sm font-bold text-amber-600 mb-1">Current (2023 - 2025)</div>
                  <h4 className="text-lg font-bold text-gray-900">CBAM Transitional Phase</h4>
                  <p className="text-gray-600 mt-2">Quarterly reporting of embedded emissions without financial payment. Penalties apply for non-reporting.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-500 shadow-sm" />
                  <div className="text-sm font-bold text-blue-600 mb-1">Ongoing</div>
                  <h4 className="text-lg font-bold text-gray-900">EPR State-Level Enforcement</h4>
                  <p className="text-gray-600 mt-2">Stricter enforcement of plastic packaging and e-waste EPR targets across global markets.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-red-500 shadow-sm" />
                  <div className="text-sm font-bold text-red-600 mb-1">January 1, 2026</div>
                  <h4 className="text-lg font-bold text-gray-900">CBAM Definitive Phase</h4>
                  <p className="text-gray-600 mt-2">Importers must purchase and surrender CBAM certificates corresponding to embedded emissions.</p>
                </div>
              </div>
            </FadeUp>

            {/* Risk Matrix */}
            <FadeUp delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-3">
                <Scale className="h-8 w-8 text-primary-600" />
                The Cost of Inaction
              </h2>
              <div className="space-y-4">
                {RISK_MATRIX.map((risk, idx) => (
                  <div key={idx} className={`rounded-2xl border p-6 ${risk.color}`}>
                    <div className="flex items-center gap-2 mb-4">
                      {risk.icon}
                      <h4 className="font-bold">{risk.level}</h4>
                    </div>
                    <ul className="space-y-2">
                      {risk.consequences.map((cons, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 opacity-60" />
                          <span className="opacity-90">{cons}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Process Workflow */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold">The Compliance Workflow</h2>
            <p className="mt-4 text-slate-400 text-lg">A systematic approach to mitigating regulatory risk.</p>
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
        </div>
      </section>

      {/* Readiness Checklist */}
      <section className="bg-slate-50 py-24 border-y border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Are You Ready?</h2>
              <p className="mt-4 text-gray-600">Ensure you have these pillars in place before deadlines hit.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <ul className="space-y-4">
                {[
                  'Identified all exported products affected by CBAM via CN/HS codes.',
                  'Mapped direct (Scope 1) and indirect (Scope 2) emissions at the installation level.',
                  'Assessed EPR obligations in target export markets for packaging and components.',
                  'Established an audit trail for primary supplier data.',
                  'Designated an internal compliance officer for sustainability reporting.'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-gray-100">
                    <div className="mt-0.5">
                      <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center border border-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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

      {/* Deliverables Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What We Deliver</h2>
          </FadeUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DELIVERABLES.map((item) => (
              <StaggerItem key={item.title} className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:-translate-y-1 transition duration-300">
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

      {/* FAQs */}
      <section className="bg-slate-50 py-20 border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Compliance FAQ</h2>
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
              <ShieldAlert className="h-12 w-12 text-emerald-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Request Compliance Consultation</h2>
              <p className="text-emerald-100/80 mb-8">
                Don't let regulatory complexity disrupt your operations or market access. Speak with our compliance experts today.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Regulatory applicability check
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Risk assessment
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Mitigation strategy
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
                    <input type="text" id="company" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="Acme Global" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="markets" className="text-sm font-medium text-gray-700">Key Export Markets</label>
                    <input type="text" id="markets" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition" placeholder="EU, US, APAC..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="concern" className="text-sm font-medium text-gray-700">Primary Compliance Concern</label>
                  <select id="concern" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                    <option value="">Select a concern...</option>
                    <option value="cbam">CBAM Reporting & Data</option>
                    <option value="epr">EPR Registration / Obligations</option>
                    <option value="icts">Domestic Carbon Trading (ICTS/etc)</option>
                    <option value="multiple">Multiple Regulations</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base font-semibold shadow-md">
                  Request Consultation
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
