'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, ChevronDown, LineChart, Globe,
  Zap, BarChart3, TrendingUp, Coins, ShieldCheck, FileText, Wallet, Calendar
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const CALENDLY_URL = 'https://calendly.com/dhwani-sg/30min';

const MARKET_INSTRUMENTS = [
  { title: 'I-REC', fullname: 'International Renewable Energy Certificates', description: 'A global standard used to track and verify the origins of electricity generated from renewable sources. Purchasing I-RECs allows companies to claim Scope 2 emissions reductions.', icon: <Zap className="h-8 w-8" />, accent: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { title: 'Carbon Credits', fullname: 'Voluntary Carbon Market Offsets', description: 'Tradable certificates representing the removal or avoidance of one tonne of CO2e. Vital for neutralizing unavoidable Scope 1 and Scope 3 emissions on your path to Net Zero.', icon: <Globe className="h-8 w-8" />, accent: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { title: 'Compliance Trading', fullname: 'Cap-and-Trade / ETS Mechanisms', description: 'Advisory on navigating mandatory compliance markets, managing allowances, and optimizing your carbon trading portfolio to minimize tax liabilities.', icon: <BarChart3 className="h-8 w-8" />, accent: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Asset Registration', desc: 'Registering your renewable energy projects or emission reduction initiatives with accredited global registries.' },
  { step: '02', title: 'Verification', desc: 'Facilitating third-party audits to verify generation data and ensure issuance of certified credits/I-RECs.' },
  { step: '03', title: 'Market Strategy', desc: 'Analyzing current market prices and forecasting trends to determine the optimal time to sell or retire certificates.' },
  { step: '04', title: 'Trading & Settlement', desc: 'Executing secure transactions through our marketplace and ensuring proper retirement of credits against corporate targets.' },
];

const REVENUE_OPPS = [
  { title: 'Monetize Renewable Assets', description: 'If you generate captive solar or wind energy, we help you register the plant and sell the resulting I-RECs to companies seeking Scope 2 reductions, creating a new revenue stream.', icon: <Coins className="h-6 w-6 text-emerald-400" /> },
  { title: 'Optimize Offset Procurement', description: 'Avoid price volatility. Our advisory ensures you procure high-quality carbon credits at the best market rates, safeguarding against greenwashing risks.', icon: <TrendingUp className="h-6 w-6 text-emerald-400" /> },
  { title: 'Build a Trading Portfolio', description: 'For sophisticated organizations, we advise on building a diversified portfolio of carbon assets — balancing nature-based, technology, and compliance instruments.', icon: <Wallet className="h-6 w-6 text-emerald-400" /> },
];

const DELIVERABLES = [
  { title: 'Market Advisory Report', description: 'A comprehensive analysis of which instruments best fit your corporate decarbonisation strategy.', icon: <FileText className="h-6 w-6" />, accent: 'from-emerald-500 to-green-600' },
  { title: 'Trading Execution', description: 'End-to-end facilitation of credit procurement or issuance — from registration to final settlement.', icon: <LineChart className="h-6 w-6" />, accent: 'from-blue-500 to-cyan-600' },
  { title: 'Registry & Retirement Records', description: 'Complete audit trail documentation of all credits issued or retired for your sustainability reports.', icon: <ShieldCheck className="h-6 w-6" />, accent: 'from-primary-500 to-primary-700' },
];

const FAQS = [
  { question: 'What is the difference between I-RECs and Carbon Credits?', answer: 'I-RECs (International Renewable Energy Certificates) specifically track and attribute renewable electricity generation, allowing companies to claim Scope 2 reductions. Carbon credits (or offsets) represent avoided or removed CO2 emissions and are used to neutralize Scope 1 and Scope 3 emissions.' },
  { question: 'How do I ensure my carbon credits are high-quality?', answer: 'We only source credits from projects registered under globally recognized standards such as Verra (VCS), Gold Standard, ACR, and CAR. These standards ensure credits are real, additional, permanent, and independently verified.' },
  { question: 'Can we sell I-RECs if we have a captive solar plant?', answer: 'Yes. If you have a captive or on-site renewable energy facility, you can register the plant with a recognized I-REC registry and issue certificates for the electricity generated, which can then be sold to other companies.' },
  { question: 'What is the current market price for carbon credits?', answer: 'Carbon credit prices vary significantly depending on project type, vintage, co-benefits, and geography. We provide real-time market intelligence to help you procure or sell at the optimal price point.' },
];

export default function CarbonTradingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <div className="page-shell min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/30" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Carbon Markets & I-REC Advisory</div></HeroFadeUp>
          <HeroFadeUp delay={0.2}><h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">Navigate Carbon Markets with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Confidence.</span></h1></HeroFadeUp>
          <HeroFadeUp delay={0.3}><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">From I-REC issuance to voluntary carbon offset procurement, we help you build a credible, cost-efficient carbon trading strategy.</p></HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="hero-cta-carbon-trading"><Calendar className="h-5 w-5" />Book a Market Advisory Call</a>
              <Link href="/solutions/markets-financing" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View Markets Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Market Instruments */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Carbon Market Instruments</h2><p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">We help you understand, access, and leverage the full spectrum of carbon and renewable energy certificate markets.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MARKET_INSTRUMENTS.map((item) => (
              <StaggerItem key={item.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} border ${item.border} ${item.accent}`}>{item.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{item.title}</h3>
                <div className="text-sm font-semibold text-gray-400 mb-4">{item.fullname}</div>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process + Mock Dashboard */}
      <section className="bg-white py-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Our Trading <span className="text-primary-600">Process</span></h2>
              <div className="space-y-6">
                {PROCESS_STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center shadow-md text-sm">{step.step}</div>
                    <div><h4 className="text-lg font-bold text-gray-900">{step.title}</h4><p className="text-gray-600 mt-1 text-sm">{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-100 to-cyan-100 rounded-[2.5rem] transform -rotate-2 opacity-50" />
              <div className="relative bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-emerald-400" /><span className="font-semibold text-slate-100">Carbon Portfolio</span></div>
                  <div className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full font-medium border border-emerald-500/30">Live</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700"><p className="text-xs text-slate-400 mb-1">I-RECs Issued</p><p className="text-2xl font-bold text-white">12,450 <span className="text-xs font-normal text-slate-400">MWh</span></p></div>
                  <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700"><p className="text-xs text-slate-400 mb-1">Credits Retired</p><p className="text-2xl font-bold text-emerald-400">3,200 <span className="text-xs font-normal text-slate-400">tCO2e</span></p></div>
                </div>
                <div className="space-y-3">
                  {[{ label: 'Nature-Based', pct: '45%', w: 'w-[45%]', color: 'bg-emerald-500' }, { label: 'Renewable Energy', pct: '35%', w: 'w-[35%]', color: 'bg-amber-500' }, { label: 'Technology', pct: '20%', w: 'w-[20%]', color: 'bg-blue-500' }].map((s) => (
                    <div key={s.label} className="flex items-center gap-3"><div className="w-28 text-xs text-slate-400">{s.label}</div><div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full ${s.color} ${s.w} rounded-full`} /></div><div className="w-10 text-right text-xs font-medium text-slate-300">{s.pct}</div></div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Revenue Opportunities */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold">Revenue Opportunities</h2><p className="mt-4 text-slate-400 text-lg">Carbon markets are not just a compliance tool — they are a financial opportunity.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVENUE_OPPS.map((item) => (
              <StaggerItem key={item.title} className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 hover:bg-slate-800 transition duration-300">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-700 shadow-inner">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">What We Deliver</h2></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DELIVERABLES.map((item) => (
              <StaggerItem key={item.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-inner`}>{item.icon}</div>
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
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">Carbon Markets FAQ</h2></FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition" id={`faq-carbon-trading-${idx}`}>
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
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeUp>
            <Globe className="h-14 w-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Enter Carbon Markets?</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">Book a free advisory call. Our experts will assess your portfolio and recommend the right market instruments for your Net Zero strategy.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="bottom-cta-carbon-trading"><Calendar className="h-5 w-5" />Book a Free Consultation</a>
              <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View All Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-emerald-200/70">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Verra & Gold Standard</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />I-REC issuance support</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Portfolio management</span>
            </div>
          </FadeUp>
        </div>
      </section>
      <Footer />
    </div>
  );
}
