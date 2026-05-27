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
  Globe,
  Shield,
  FileSpreadsheet,
  PieChart,
  PenTool,
  CheckCircle2,
  ChevronDown,
  Target,
  LayoutTemplate,
  Briefcase
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeDown, HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const NAV_LINKS = [
  { href: '/corporate', label: 'Corporate' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];

const FRAMEWORKS = [
  {
    title: 'GRI',
    fullname: 'Global Reporting Initiative',
    description: 'The world\'s most widely used framework. Focuses on the economic, environmental, and social impacts of a company\'s operations on the world (impact materiality).',
    idealFor: 'Broad stakeholder audiences, NGOs, and global investors.',
    accent: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    title: 'TCFD',
    fullname: 'Task Force on Climate-related Financial Disclosures',
    description: 'Evaluates how climate change impacts the financial health of the business. Highly sought after by institutional investors assessing long-term risk.',
    idealFor: 'Investors, financial institutions, and capital markets.',
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    title: 'CSRD',
    fullname: 'Corporate Sustainability Reporting Directive',
    description: 'The stringent EU mandate that requires double materiality (how the world impacts the business AND how the business impacts the world).',
    idealFor: 'EU-operating entities and global supply chain compliance.',
    accent: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
];

const METHODOLOGY_STEPS = [
  {
    step: '01',
    title: 'Materiality Assessment',
    description: 'We identify and prioritize the ESG topics that matter most to your business and stakeholders, utilizing single or double materiality methodologies depending on the target framework.',
    icon: <Target className="h-6 w-6 text-emerald-400" />
  },
  {
    step: '02',
    title: 'Data Collection Framework',
    description: 'Structuring robust quantitative and qualitative data pipelines across E, S, and G pillars. We establish audit trails ensuring your data is reliable and assurance-ready.',
    icon: <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
  },
  {
    step: '03',
    title: 'Content & Narrative Development',
    description: 'Crafting compelling disclosures that blend hard metrics with strategic narrative, demonstrating your commitment and progress against sustainability targets.',
    icon: <PenTool className="h-6 w-6 text-emerald-400" />
  },
  {
    step: '04',
    title: 'Report Design & Advisory',
    description: 'Transforming technical disclosures into an engaging, beautifully designed ESG report layout ready for digital and print publication.',
    icon: <LayoutTemplate className="h-6 w-6 text-emerald-400" />
  }
];

const DELIVERABLES = [
  {
    title: 'Comprehensive ESG Report',
    description: 'A beautifully designed, full-length sustainability report aligned with your chosen frameworks.',
    icon: <LayoutTemplate className="h-6 w-6" />,
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'ESG Factsheet',
    description: 'A concise 2-4 page summary of your KPIs and targets for quick stakeholder consumption.',
    icon: <PieChart className="h-6 w-6" />,
    accent: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Reporting Roadmap',
    description: 'A multi-year strategy detailing how to evolve your reporting maturity and improve ESG ratings.',
    icon: <Globe className="h-6 w-6" />,
    accent: 'from-primary-500 to-primary-700',
  },
];

const FAQS = [
  {
    question: 'How do we choose which framework to report against?',
    answer: 'The choice depends on your audience and jurisdiction. GRI is excellent for general stakeholders. TCFD is critical for investors. CSRD is mandatory if you operate in or supply to the EU. Often, we recommend a hybrid approach (e.g., GRI + TCFD).',
  },
  {
    question: 'What is Double Materiality?',
    answer: 'Double materiality assesses both "Impact Materiality" (how your business affects the environment and society) and "Financial Materiality" (how sustainability factors affect your financial performance). It is the cornerstone of the CSRD framework.',
  },
  {
    question: 'Do you help with the visual design of the report?',
    answer: 'Yes. Beyond data aggregation and writing, our team handles the complete visual design of the report, ensuring it aligns with your brand identity and presents complex data in an easily digestible, visually appealing format.',
  },
  {
    question: 'How long does the ESG reporting process take?',
    answer: 'A first-time, comprehensive ESG report typically takes 12 to 16 weeks from kickoff to final publication, depending on internal data readiness and the complexity of the materiality assessment.',
  }
];

export default function ESGReportingPage() {
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
                  Book Consultation
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
                  Book Consultation
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-24 pt-20 lg:pt-28">
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-emerald-500 opacity-20 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Enterprise ESG Reporting Services
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-balance">
              Transform ESG Data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Credible Reporting.</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Develop globally aligned sustainability reports that build stakeholder confidence, attract capital, and demonstrate compliance with GRI, TCFD, and CSRD.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#lead-capture" onClick={scrollToLeadCapture} className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                Book ESG Reporting Consultation
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Framework Comparison Cards */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Navigate the Alphabet Soup
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We help you align your disclosures with the most rigorous global frameworks, ensuring your report meets the precise needs of your stakeholders.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {FRAMEWORKS.map((fw) => (
              <StaggerItem key={fw.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`text-4xl font-black tracking-tighter mb-2 ${fw.accent}`}>{fw.title}</div>
                <div className="text-sm font-semibold text-gray-500 mb-6">{fw.fullname}</div>
                <p className="text-gray-600 mb-6 min-h-[5rem]">{fw.description}</p>
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Ideal For</div>
                  <p className="text-sm font-medium text-gray-800">{fw.idealFor}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Report Preview Mockup Section */}
      <section className="bg-white py-24 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Mockup UI */}
            <FadeUp className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-slate-100 rounded-[3rem] transform -rotate-3 opacity-60" />
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden aspect-[4/3] flex">
                {/* Mock Report Cover */}
                <div className="w-1/2 bg-slate-900 p-8 flex flex-col justify-between border-r border-gray-100 text-white">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 mb-12 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-400" />
                    </div>
                    <div className="text-3xl font-black leading-none mb-4">Sustainability<br/>Report</div>
                    <div className="text-sm text-slate-400 font-medium">FY 2024 / GRI & TCFD Aligned</div>
                  </div>
                  <div className="text-xs text-slate-500">Prepared by Ploxi Earth</div>
                </div>
                {/* Mock Report Inside Page */}
                <div className="w-1/2 bg-white p-6 flex flex-col gap-4">
                  <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                  <div className="space-y-2 mt-4">
                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                    <div className="h-2 w-full bg-gray-100 rounded-full" />
                    <div className="h-2 w-4/5 bg-gray-100 rounded-full" />
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <div className="aspect-square bg-emerald-50 rounded-xl border border-emerald-100 p-3">
                      <div className="text-[10px] text-emerald-600 font-semibold mb-1">Scope 1</div>
                      <div className="text-lg font-bold text-emerald-900">12k</div>
                    </div>
                    <div className="aspect-square bg-blue-50 rounded-xl border border-blue-100 p-3">
                      <div className="text-[10px] text-blue-600 font-semibold mb-1">Diversity</div>
                      <div className="text-lg font-bold text-blue-900">42%</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2} className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Beyond Compliance. <br/> <span className="text-primary-600">Strategic Storytelling.</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                An ESG report shouldn't just be a data dump. We design visually striking, strategically crafted reports that communicate your sustainability journey to the world.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Bespoke visual design aligned with your brand.',
                  'Clear infographics simplifying complex carbon data.',
                  'Compelling narratives highlighting social impact.',
                  'Audit-ready data tables for transparent disclosures.',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Methodology Workflow */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold">Our Reporting Methodology</h2>
            <p className="mt-4 text-slate-400 text-lg">An end-to-end process from materiality to publication.</p>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {METHODOLOGY_STEPS.map((step, idx) => (
              <FadeUp key={idx} delay={idx * 0.1} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:bg-slate-800 transition">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-700 shadow-inner">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-black text-slate-700/50">{step.step}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What We Deliver</h2>
            <p className="mt-4 text-gray-600 text-lg">Tangible assets ready for your investors and stakeholders.</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Trusted across key sectors</h2>
              <p className="mt-2 text-gray-600">Deep expertise in industry-specific SASB and GRI metrics.</p>
            </div>
            <div className="md:w-2/3 flex flex-wrap gap-3 md:justify-end">
              {['Energy & Utilities', 'Financial Services', 'Manufacturing', 'Technology', 'Real Estate', 'FMCG'].map((ind) => (
                <span key={ind} className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-100">
                  <Briefcase className="inline w-4 h-4 mr-2 mb-0.5" />
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
            <h2 className="text-3xl font-bold text-gray-900">Reporting FAQ</h2>
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
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50 to-white pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            {/* Left Info */}
            <div className="lg:w-5/12 p-10 sm:p-14 bg-gradient-to-br from-emerald-900 to-slate-900 text-white flex flex-col justify-center">
              <Shield className="h-12 w-12 text-emerald-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Book Your ESG Reporting Consultation</h2>
              <p className="text-emerald-100/80 mb-8">
                Ready to elevate your sustainability disclosures? Speak with our reporting experts to scope your next ESG report.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Framework alignment advice
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Gap analysis scoping
                </div>
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Custom timeline & pricing
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
                    <label htmlFor="framework" className="text-sm font-medium text-gray-700">Target Frameworks</label>
                    <select id="framework" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition text-gray-700">
                      <option value="">Select Framework</option>
                      <option value="gri">GRI</option>
                      <option value="tcfd">TCFD</option>
                      <option value="csrd">CSRD</option>
                      <option value="brsr">BRSR Core</option>
                      <option value="multiple">Multiple / Not Sure</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Project Timeline & Goals</label>
                  <textarea id="message" rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition resize-none" placeholder="Tell us about your reporting cycle and immediate priorities..."></textarea>
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
