'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, ChevronDown, Wallet, Sprout, Zap,
  Briefcase, TrendingUp, Handshake, Search, Building2, BadgeDollarSign, Calendar
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const CALENDLY_URL = 'https://calendly.com/dhwani-sg/30min';

const PROJECT_TYPES = [
  { title: 'Nature-Based Solutions', description: 'Afforestation, reforestation, and regenerative agriculture projects that sequester carbon directly from the atmosphere.', icon: <Sprout className="h-8 w-8" />, accent: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { title: 'Technology & Direct Air Capture', description: 'Capital-intensive innovations including CCUS (Carbon Capture, Utilization, and Storage) and advanced biomass technologies.', icon: <Building2 className="h-8 w-8" />, accent: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { title: 'Energy Efficiency & Renewables', description: 'Large-scale solar, wind, and industrial energy efficiency upgrades generating predictable, long-term carbon avoidance credits.', icon: <Zap className="h-8 w-8" />, accent: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
];

const PROCESS_STEPS = [
  { step: '1', title: 'Initial Screening', desc: 'We evaluate your project\'s carbon yield potential, methodology alignment, and basic financial viability.' },
  { step: '2', title: 'Due Diligence', desc: 'Rigorous technical and legal assessment to verify additionality, permanence, and risk mitigation strategies.' },
  { step: '3', title: 'Deal Structuring', desc: 'We design the financial instrument — whether forward-financing, equity, or an emission reduction purchase agreement (ERPA).' },
  { step: '4', title: 'Capital Deployment', desc: 'Connecting you with our network of institutional investors and facilitating the final transaction.' },
];

const BENEFITS = [
  { title: 'Unlock Upfront Capital', description: 'Transform future carbon credit issuance into immediate working capital to cover CAPEX and operational costs.', icon: <Wallet className="h-6 w-6 text-emerald-400" /> },
  { title: 'Access Global Investors', description: 'Tap into our curated network of climate funds, impact investors, and corporations seeking high-quality offsets.', icon: <Handshake className="h-6 w-6 text-emerald-400" /> },
  { title: 'Mitigate Market Risk', description: 'Secure long-term offtake agreements that insulate your project from voluntary carbon market price volatility.', icon: <TrendingUp className="h-6 w-6 text-emerald-400" /> },
];

const FAQS = [
  { question: 'What size projects do you finance?', answer: 'We typically focus on mid-to-large scale projects requiring $1M to $50M in funding. However, we can also assist highly scalable, innovative pilot projects in securing early-stage capital.' },
  { question: 'How does carbon forward-financing work?', answer: 'Investors provide upfront capital to develop the project. In return, they receive the right to a portion of the verified carbon credits generated in the future at a pre-negotiated discount.' },
  { question: 'Do you guarantee funding?', answer: 'While we cannot guarantee funding, our rigorous pre-screening and eligibility assessment ensure that any project we present to our investor network has a significantly higher probability of securing capital.' },
  { question: 'Which carbon standards do you accept?', answer: 'We prioritize projects adhering to internationally recognized standards such as Verra (VCS), Gold Standard, ACR, and CAR to ensure credit integrity and investor confidence.' },
];

export default function CarbonFinancingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <div className="page-shell min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Project Finance & Advisory</div></HeroFadeUp>
          <HeroFadeUp delay={0.2}><h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">Secure Capital for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Climate Projects.</span></h1></HeroFadeUp>
          <HeroFadeUp delay={0.3}><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Bridge your sustainability initiatives with global financing opportunities. We connect high-integrity carbon projects with institutional capital.</p></HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="hero-cta-carbon-financing"><Calendar className="h-5 w-5" />Connect with Climate Investors</a>
              <Link href="/solutions/markets-financing" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View Markets Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Project Types */}
      <section className="bg-slate-50 py-20 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold tracking-tight text-gray-900">Projects We Finance</h2><p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">We focus on high-impact, verifiable projects capable of generating high-quality carbon credits.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECT_TYPES.map((type) => (
              <StaggerItem key={type.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${type.bg} border ${type.border} ${type.accent}`}>{type.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{type.title}</h3>
                <p className="text-gray-600 leading-relaxed">{type.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process + Eligibility */}
      <section className="bg-white py-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">The Climate <span className="text-primary-600">Financing Ecosystem</span></h2>
              <p className="text-lg text-gray-600 mb-8">We act as the bridge between project developers and institutional capital, streamlining due diligence and structuring processes.</p>
              <div className="space-y-6">
                {PROCESS_STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1"><div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shadow-md">{step.step}</div></div>
                    <div><h4 className="text-lg font-bold text-gray-900">{step.title}</h4><p className="text-gray-600 mt-1">{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tl from-emerald-100 to-slate-100 rounded-[2.5rem] transform -rotate-2 opacity-50" />
              <div className="relative bg-slate-50 rounded-3xl border border-gray-200 shadow-xl p-8">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200"><Search className="h-8 w-8 text-primary-600" /><h3 className="text-2xl font-bold text-gray-900">Eligibility Assessment</h3></div>
                <ul className="space-y-6">
                  {[{ title: 'Additionality Validated', desc: 'Project requires carbon revenue to be viable.' }, { title: 'Permanence Secured', desc: 'Emissions reductions are long-term and irreversible.' }, { title: 'Clear Baseline Methodology', desc: 'Conforms to strict Verra or Gold Standard criteria.' }, { title: 'Co-benefits Identified', desc: 'Positive impact on local communities and biodiversity.' }].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                      <div><h4 className="font-semibold text-gray-900">{item.title}</h4><p className="text-sm text-gray-500 mt-1">{item.desc}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold">Why Partner With Us?</h2><p className="mt-4 text-slate-400 text-lg">We accelerate your path from concept to capital deployment.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((item) => (
              <StaggerItem key={item.title} className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 hover:bg-slate-800 transition duration-300">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-700 shadow-inner">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">Financing FAQ</h2></FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition" id={`faq-carbon-financing-${idx}`}>
                  <span className="text-left">{faq.question}</span><ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>{openFaq === idx && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-5 text-gray-600 text-sm">{faq.answer}</motion.div>}</AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 py-20 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeUp>
            <Briefcase className="h-14 w-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Fund Your Climate Project?</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">Book a free consultation. Our project finance team will conduct an initial eligibility review and connect you with relevant investors.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="bottom-cta-carbon-financing"><Calendar className="h-5 w-5" />Book a Free Consultation</a>
              <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View All Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-emerald-200/70">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Confidential review</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Access to institutional funds</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Custom term sheet structuring</span>
            </div>
          </FadeUp>
        </div>
      </section>
      <Footer />
    </div>
  );
}
