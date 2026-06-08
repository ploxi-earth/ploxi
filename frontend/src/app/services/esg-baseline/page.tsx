'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart,
  Map,
  FileText,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  ChevronDown,
  Calendar,
  Target,
  Shield
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const CALENDLY_URL = 'https://calendly.com/dhwani-sg/30min';

const BENEFITS = [
  'Stay ahead of mandatory regulatory disclosures (CSRD, BRSR).',
  'Respond confidently to investor and stakeholder ESG inquiries.',
  'Identify operational inefficiencies and cost-saving opportunities.',
  'Set realistic, science-based targets grounded in actual data.',
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
    answer: 'A standard ESG Baseline & Gap Analysis typically takes 4–6 weeks, depending on the size of your organization and data availability.',
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="page-shell min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white pb-20 pt-20 lg:pt-28">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/20 blur-[100px]" />
        <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[80px]" />
        <div className="relative mx-auto max-w-5xl px-4 py-4 text-center sm:px-6 lg:px-8 z-10">
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
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Identify gaps, benchmark performance, and build a robust roadmap toward sustainability readiness and compliance.
            </p>
          </HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-primary-600/20 flex items-center gap-2 justify-center"
                id="hero-cta-esg-baseline"
              >
                <Calendar className="h-5 w-5" />
                Book ESG Baseline Assessment
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
      <section className="bg-slate-50 py-20 lg:py-24">
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
                {BENEFITS.map((item, idx) => (
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

      {/* Frameworks */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Align with Global Standards</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              We map your existing policies and data against the world's leading sustainability reporting frameworks.
            </p>
          </FadeUp>
          <StaggerContainer className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
            {['GRI', 'SASB', 'TCFD', 'CSRD', 'BRSR', 'CDP'].map((framework) => (
              <StaggerItem key={framework} className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 font-semibold text-gray-700 shadow-sm transition hover:border-primary-300 hover:bg-primary-50">
                {framework}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-900/30 blur-3xl rounded-full" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Our Gap Identification Methodology</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">A structured, proven approach to baseline your ESG performance.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {METHODOLOGY_STEPS.map((step, idx) => (
              <FadeUp key={step.step} delay={idx * 0.1} className="relative">
                <div className="text-5xl font-extrabold text-white/5 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-emerald-400">{step.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
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

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition"
                  id={`faq-esg-baseline-${idx}`}
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
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 py-20 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeUp>
            <Shield className="h-14 w-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Baseline Your ESG Performance?</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">
              Book a free 30-minute consultation with our sustainability experts. We'll review your requirements and outline a customized approach within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 text-base font-semibold shadow-lg shadow-primary-600/30 flex items-center gap-2 justify-center"
                id="bottom-cta-esg-baseline"
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
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Customized proposal</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Expert guidance</span>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
