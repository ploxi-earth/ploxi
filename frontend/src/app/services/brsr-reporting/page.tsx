'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  ListChecks,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  LineChart,
  Calendar
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const CALENDLY_URL = 'https://calendly.com/dhwani-sg/30min';

const BENEFITS = [
  {
    title: 'Data Fragmentation',
    description: 'ESG data is often siloed across HR, EHS, facilities, and finance departments. We unify it into a single audit-ready inventory.',
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    title: 'Value Chain Visibility',
    description: 'The BRSR Core mandate requires tracking ESG metrics across your top upstream and downstream value chain partners.',
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    title: 'Assurance Readiness',
    description: 'Data must be robust enough to pass reasonable assurance audits by external third parties. We get you there.',
    icon: <ShieldCheck className="h-6 w-6" />,
  },
];

const DELIVERABLES = [
  {
    title: 'Custom Reporting Templates',
    description: "Standardized data collection templates mapped directly to SEBI's BRSR Core requirements.",
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

const WORKFLOW = [
  { step: '1', title: 'Data Mapping', desc: 'Align existing metrics to NGRBC principles.' },
  { step: '2', title: 'Value Chain Integration', desc: 'Engage top supply chain partners for data.' },
  { step: '3', title: 'Assurance Readiness', desc: 'Conduct internal audits for data reliability.' },
  { step: '4', title: 'Report Generation', desc: 'Compile the final BRSR disclosure.' },
];

const FAQS = [
  {
    question: 'What is the difference between Comprehensive BRSR and BRSR Core?',
    answer: 'BRSR Comprehensive is a broad reporting framework covering over 100+ data points across 9 NGRBC principles. BRSR Core is a subset of 43 critical KPIs that specifically require mandatory reasonable assurance by an external auditor.',
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
    answer: 'Preparation should begin at least 6–8 months before the end of the financial year. This allows adequate time to identify gaps, implement missing policies, and ensure data is assurance-ready.',
  },
];

export default function BRSRReportingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="page-shell min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              SEBI BRSR Compliance
            </div>
          </HeroFadeUp>
          <HeroFadeUp delay={0.2}>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              BRSR Core Reporting <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Made Practical.</span>
            </h1>
          </HeroFadeUp>
          <HeroFadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Navigate SEBI's disclosure requirements confidently. Streamline data collection, engage your value chain, and prepare for assurance readiness.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2 justify-center"
                id="hero-cta-brsr"
              >
                <Calendar className="h-5 w-5" />
                Book a Free Consultation
              </a>
              <Link
                href="/solutions/esg-strategy"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                View ESG Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Companies Struggle with BRSR</h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">Common pain points we solve for India's top listed enterprises.</p>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((item, idx) => (
              <StaggerItem key={idx} className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 text-primary-600">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What We Deliver */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What We Deliver</h2>
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

      {/* Process */}
      <section className="bg-slate-900 py-20 text-white overflow-hidden relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-12">
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
          <FadeUp delay={0.3} className="mt-12 bg-gradient-to-r from-emerald-900/50 to-slate-800 rounded-3xl p-8 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
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
                  id={`faq-brsr-${idx}`}
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

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <ListChecks className="w-80 h-80 text-white" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-6">
              Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to File BRSR Core Confidently?</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">
              Book a free 30-minute consultation with our BRSR experts. We'll assess your current readiness and outline a clear path to compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2 justify-center"
                id="bottom-cta-brsr"
              >
                <Calendar className="h-5 w-5" />
                Book a Free Consultation
              </a>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-emerald-200/70">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> No commitment required</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Response within 24 hours</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Expert SEBI guidance</span>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
