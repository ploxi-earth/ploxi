'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, ChevronDown, Globe2, Scale, Activity,
  Target, FileCheck, AlertTriangle, FileWarning, ShieldAlert,
  Clock, Calendar
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const CALENDLY_URL = 'https://calendly.com/dhwani-sg/30min';

const REGULATIONS = [
  { title: 'CBAM', fullname: 'Carbon Border Adjustment Mechanism', description: 'The EU\'s landmark tool to put a fair price on carbon emitted during the production of carbon-intensive goods entering the EU. Importers must report embedded emissions and purchase certificates.', icon: <Globe2 className="h-8 w-8" />, accent: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { title: 'ICTS', fullname: 'Indian Carbon Trading Scheme / Standards', description: 'Emerging domestic compliance mechanisms mandating carbon intensity reductions for designated sectors, enforcing stricter accounting and reporting methodologies.', icon: <Activity className="h-8 w-8" />, accent: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { title: 'EPR', fullname: 'Extended Producer Responsibility', description: 'Policy approaches that make producers responsible for the end-of-life impact of their products — particularly plastic packaging, e-waste, and batteries. Essential for market access.', icon: <Scale className="h-8 w-8" />, accent: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

const RISK_MATRIX = [
  { level: 'High Risk', color: 'bg-red-50 text-red-700 border-red-200', icon: <AlertTriangle className="h-5 w-5 text-red-500" />, consequences: ['Loss of EU market access (CBAM)', 'Severe financial penalties', 'Supply chain delisting', 'Reputational damage'] },
  { level: 'Medium Risk', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <FileWarning className="h-5 w-5 text-amber-500" />, consequences: ['Increased taxation & carbon fees', 'Delayed shipments at customs', 'Increased scrutiny from auditors'] },
  { level: 'Low Risk (Compliant)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <ShieldAlert className="h-5 w-5 text-emerald-500" />, consequences: ['Uninterrupted market access', 'Preferred supplier status', 'Optimized carbon tax burden'] },
];

const WORKFLOW = [
  { step: '1', title: 'Regulatory Mapping', desc: 'Identify which regulations (CBAM, EPR, etc.) apply to your specific product codes and export markets.' },
  { step: '2', title: 'Data Readiness Check', desc: 'Assess current data availability against regulatory reporting requirements.' },
  { step: '3', title: 'Methodology Alignment', desc: 'Implement the correct calculation methodologies (e.g., CBAM default values vs. actual emissions).' },
  { step: '4', title: 'Filing & Submission', desc: 'Prepare and submit the finalized compliance reports to the respective authorities.' },
];

const DELIVERABLES = [
  { title: 'CBAM Declarations', description: 'Quarterly and annual reports accurately calculating embedded emissions for EU importers.', icon: <FileCheck className="h-6 w-6" />, accent: 'from-emerald-500 to-green-600' },
  { title: 'Compliance Roadmaps', description: 'A strategic timeline outlining exactly when and how to collect necessary data to avoid penalties.', icon: <Target className="h-6 w-6" />, accent: 'from-blue-500 to-cyan-600' },
  { title: 'EPR Registration Support', description: 'End-to-end assistance with Extended Producer Responsibility registration and waste management planning.', icon: <CheckCircle2 className="h-6 w-6" />, accent: 'from-primary-500 to-primary-700' },
];

const FAQS = [
  { question: 'When do financial obligations for CBAM begin?', answer: 'The CBAM transitional phase (reporting only) began in October 2023. The definitive phase, where importers must purchase and surrender CBAM certificates, begins on January 1, 2026.' },
  { question: 'What happens if we fail to report under CBAM?', answer: 'Failure to submit a CBAM report, or submitting an incorrect/incomplete report, can result in penalties ranging from €10 to €50 per tonne of unreported embedded emissions.' },
  { question: 'Are EPR regulations the same globally?', answer: 'No. Extended Producer Responsibility regulations vary significantly by country and even by state/province. We help map your export destinations to the specific local EPR requirements.' },
  { question: 'Do you communicate with our EU importers directly?', answer: 'Yes, we can act as the technical liaison between your manufacturing facilities and your EU clients/importers to ensure they have the exact embedded emissions data they need to file their declarations.' },
];

export default function ComplianceSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <div className="page-shell min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-20 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-emerald-950/40" />
        <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-primary-600/10 blur-[150px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Regulatory Compliance Support</div></HeroFadeUp>
          <HeroFadeUp delay={0.2}><h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">Navigate Evolving <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Sustainability Regulations.</span></h1></HeroFadeUp>
          <HeroFadeUp delay={0.3}><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Stay compliant with international requirements, mitigate border taxes, and avoid reporting risks across CBAM, EPR, and emerging carbon standards.</p></HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="hero-cta-compliance"><Calendar className="h-5 w-5" />Request Compliance Consultation</a>
              <Link href="/solutions/carbon-compliance" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View Carbon Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      {/* Regulations */}
      <section className="bg-slate-50 py-20 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold tracking-tight text-gray-900">Key Compliance Frameworks</h2><p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">We decode complex legislative texts into actionable, operational requirements for your business.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REGULATIONS.map((reg) => (
              <StaggerItem key={reg.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${reg.bg} border ${reg.border} ${reg.accent}`}>{reg.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{reg.title}</h3>
                <div className="text-sm font-semibold text-gray-400 mb-4">{reg.fullname}</div>
                <p className="text-gray-600 leading-relaxed">{reg.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timelines + Risk */}
      <section className="bg-white py-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-3"><Clock className="h-8 w-8 text-primary-600" />Critical Timelines</h2>
              <div className="relative border-l-2 border-gray-200 ml-4 space-y-10 pl-8">
                {[
                  { dot: 'bg-amber-500', label: 'Current (2023–2025)', labelColor: 'text-amber-600', title: 'CBAM Transitional Phase', desc: 'Quarterly reporting of embedded emissions without financial payment. Penalties apply for non-reporting.' },
                  { dot: 'bg-blue-500', label: 'Ongoing', labelColor: 'text-blue-600', title: 'EPR State-Level Enforcement', desc: 'Stricter enforcement of plastic packaging and e-waste EPR targets across global markets.' },
                  { dot: 'bg-red-500', label: 'January 1, 2026', labelColor: 'text-red-600', title: 'CBAM Definitive Phase', desc: 'Importers must purchase and surrender CBAM certificates corresponding to embedded emissions.' },
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white ${item.dot} shadow-sm`} />
                    <div className={`text-sm font-bold mb-1 ${item.labelColor}`}>{item.label}</div>
                    <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-3"><Scale className="h-8 w-8 text-primary-600" />The Cost of Inaction</h2>
              <div className="space-y-4">
                {RISK_MATRIX.map((risk, idx) => (
                  <div key={idx} className={`rounded-2xl border p-6 ${risk.color}`}>
                    <div className="flex items-center gap-2 mb-4">{risk.icon}<h4 className="font-bold">{risk.level}</h4></div>
                    <ul className="space-y-2">{risk.consequences.map((c, i) => <li key={i} className="flex items-start gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 opacity-60" /><span className="opacity-90">{c}</span></li>)}</ul>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold">The Compliance Workflow</h2><p className="mt-4 text-slate-400 text-lg">A systematic approach to mitigating regulatory risk.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW.map((step, idx) => (
              <StaggerItem key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition">
                <div className="absolute -right-4 -top-4 text-8xl font-black text-slate-700/30 group-hover:text-emerald-500/10 transition">{step.step}</div>
                <div className="relative z-10"><h3 className="text-xl font-bold text-emerald-400 mb-3">{step.title}</h3><p className="text-slate-300 text-sm">{step.desc}</p></div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">What We Deliver</h2></FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DELIVERABLES.map((item) => (
              <StaggerItem key={item.title} className="bg-slate-50 rounded-3xl p-8 border border-gray-100 hover:-translate-y-1 transition duration-300">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-inner`}>{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">Compliance FAQ</h2></FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50 transition" id={`faq-compliance-${idx}`}>
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
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary-600/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeUp>
            <ShieldAlert className="h-14 w-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Don't Let Regulations Disrupt Your Operations</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">Book a free 30-minute consultation with our compliance experts. We'll assess your regulatory exposure and outline a mitigation strategy.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="bottom-cta-compliance"><Calendar className="h-5 w-5" />Book a Free Consultation</a>
              <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View All Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-emerald-200/70">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Regulatory applicability check</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Risk assessment</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Mitigation strategy</span>
            </div>
          </FadeUp>
        </div>
      </section>
      <Footer />
    </div>
  );
}
