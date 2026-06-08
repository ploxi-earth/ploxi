'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, PieChart, LineChart, CheckCircle2,
  Leaf, Factory, Truck, FileCheck, ChevronDown, Zap, Calendar, Shield
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const CALENDLY_URL = 'https://calendly.com/dhwani-sg/30min';

const SCOPES = [
  { title: 'Scope 1', subtitle: 'Direct Emissions', description: 'Emissions from sources owned or controlled by your organization — company vehicles and onsite fuel combustion.', icon: <Factory className="h-8 w-8" />, accent: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { title: 'Scope 2', subtitle: 'Indirect Emissions (Energy)', description: 'Emissions from the generation of purchased electricity, steam, heating, and cooling consumed by your organization.', icon: <Zap className="h-8 w-8" />, accent: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { title: 'Scope 3', subtitle: 'Value Chain Emissions', description: 'All other indirect emissions that occur in your value chain, including both upstream and downstream activities.', icon: <Truck className="h-8 w-8" />, accent: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

const DELIVERABLES = [
  { title: 'Emissions Inventory', description: 'A comprehensive, granular accounting of your GHG emissions across Scope 1, 2, and 3 activities.', icon: <PieChart className="h-6 w-6" />, accent: 'from-emerald-500 to-green-600' },
  { title: 'Baseline Report', description: 'An official document establishing your historical emissions baseline, ready for audit and disclosure.', icon: <FileCheck className="h-6 w-6" />, accent: 'from-blue-500 to-cyan-600' },
  { title: 'Reduction Roadmap', description: 'Actionable decarbonization strategies with estimated impact to help you achieve Net Zero targets.', icon: <LineChart className="h-6 w-6" />, accent: 'from-primary-500 to-primary-700' },
];

const PROCESS_STEPS = [
  { title: 'Kickoff & Boundary Setting', description: 'Define organizational and operational boundaries according to the GHG Protocol.' },
  { title: 'Data Collection & Aggregation', description: 'Gather energy bills, fuel usage, and supply chain data systematically.' },
  { title: 'Emission Factor Mapping', description: 'Apply the latest, region-specific emission factors (e.g., DEFRA, EPA) to calculate CO2e.' },
  { title: 'Accounting & Validation', description: 'Rigorous calculation and quality assurance to ensure audit-readiness.' },
  { title: 'Reporting & Strategy', description: 'Delivery of the GHG Baseline Report and strategic reduction recommendations.' },
];

const FAQS = [
  { question: 'What is the GHG Protocol?', answer: 'The Greenhouse Gas Protocol is the world\'s most widely used greenhouse gas accounting standard for companies and organizations to measure and manage their emissions.' },
  { question: 'How long does a GHG audit typically take?', answer: 'Depending on the complexity of your organization and data availability, a comprehensive GHG audit across all three scopes typically takes 4 to 8 weeks.' },
  { question: 'Do you calculate Scope 3 emissions?', answer: 'Yes. While Scope 3 is often the most challenging due to data availability in the value chain, we use spend-based, average-data, and supplier-specific methods to build a reliable Scope 3 inventory.' },
  { question: 'Are your reports ready for verification by a third party?', answer: 'Absolutely. Our methodology strictly adheres to the GHG Protocol and ISO 14064 standards, ensuring the final emissions inventory is fully audit-ready.' },
];

export default function GHGAuditPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <div className="page-shell min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">GHG Audit & Carbon Accounting</div></HeroFadeUp>
          <HeroFadeUp delay={0.2}><h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">Measure Emissions. Establish Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Carbon Baseline.</span></h1></HeroFadeUp>
          <HeroFadeUp delay={0.3}><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Build a credible, audit-ready emissions inventory aligned with the GHG Protocol and ISO 14064.</p></HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="hero-cta-ghg-audit"><Calendar className="h-5 w-5" />Schedule Emissions Inventory</a>
              <Link href="/solutions/carbon-compliance" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View Carbon Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Standards Bar */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">Standards & Frameworks Compliant</p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 opacity-60">
            {['GHG Protocol', 'ISO 14064', 'SBTi', 'CDP'].map((s) => <div key={s} className="text-xl font-bold text-gray-600">{s}</div>)}
          </div>
        </div>
      </section>

      {/* Scopes */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Understanding Your Emissions Footprint</h2><p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">A robust GHG inventory categorizes emissions into three scopes to prevent double counting and accurately assign responsibility across the value chain.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SCOPES.map((scope) => (
              <StaggerItem key={scope.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition group">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${scope.bg} border ${scope.border} ${scope.accent}`}>{scope.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{scope.title}</h3>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${scope.accent}`}>{scope.subtitle}</h4>
                <p className="text-gray-600 leading-relaxed">{scope.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Dashboard mockup + benefits */}
      <section className="bg-white py-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Turn Raw Data into <span className="text-primary-600">Actionable Intelligence</span></h2>
              <p className="mt-6 text-lg text-gray-600">We do more than crunch numbers. Our audit delivers your emissions data in a structured, visual format that leadership teams and stakeholders can instantly understand.</p>
              <ul className="mt-8 space-y-4">
                {['Identify your largest emission hotspots instantly.', 'Track energy consumption trends across facilities.', 'Prepare data for Science Based Targets (SBTi) submission.'].map((item, idx) => (
                  <li key={idx} className="flex gap-3"><CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-500" /><span className="text-gray-700">{item}</span></li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp delay={0.2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-[2.5rem] transform rotate-3 opacity-50" />
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-gray-400" /><span className="font-semibold text-gray-700">Carbon Footprint Overview</span></div>
                  <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">FY 2024</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100"><p className="text-sm text-gray-500 mb-1">Total Emissions</p><p className="text-2xl font-bold text-gray-900">14,250 <span className="text-sm font-normal text-gray-500">tCO2e</span></p></div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100"><p className="text-sm text-gray-500 mb-1">Energy Intensity</p><p className="text-2xl font-bold text-gray-900">3.2 <span className="text-sm font-normal text-gray-500">MWh/fte</span></p></div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Emissions by Scope</p>
                  {[{ label: 'Scope 1', pct: '20%', w: 'w-[20%]', color: 'bg-emerald-500' }, { label: 'Scope 2', pct: '35%', w: 'w-[35%]', color: 'bg-blue-500' }, { label: 'Scope 3', pct: '45%', w: 'w-[45%]', color: 'bg-purple-500' }].map((s) => (
                    <div key={s.label} className="flex items-center gap-3"><div className="w-24 text-xs text-gray-500">{s.label}</div><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${s.color} ${s.w} rounded-full`} /></div><div className="w-12 text-right text-xs font-medium">{s.pct}</div></div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how-it-works" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold">The Carbon Accounting Process</h2><p className="mt-4 text-slate-400 text-lg">A systematic, rigorous approach to calculating your footprint.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step, idx) => (
              <StaggerItem key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition">
                <div className="text-3xl font-black text-emerald-500/30 mb-3">{String(idx + 1).padStart(2, '0')}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">What You Receive</h2></FadeUp>
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
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2></FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition" id={`faq-ghg-${idx}`}>
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
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeUp>
            <Leaf className="h-14 w-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Start Your Carbon Accounting Journey</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">Book a free consultation with our GHG experts. We'll assess your data readiness and outline a tailored approach for your emissions inventory.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="bottom-cta-ghg-audit"><Calendar className="h-5 w-5" />Book a Free Consultation</a>
              <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View All Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-emerald-200/70">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />GHG Protocol Aligned</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Transparent Methodology</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Audit-Ready Outputs</span>
            </div>
          </FadeUp>
        </div>
      </section>
      <Footer />
    </div>
  );
}
