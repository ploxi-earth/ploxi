'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Globe, Shield, FileSpreadsheet, PieChart, PenTool,
  CheckCircle2, ChevronDown, Target, LayoutTemplate, Calendar
} from 'lucide-react';
import Footer from '@/components/Footer';
import { HeroFadeUp, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';

const CALENDLY_URL = 'https://calendly.com/dhwani-sg/30min';

const FRAMEWORKS = [
  { title: 'GRI', fullname: 'Global Reporting Initiative', description: 'The world\'s most widely used framework. Focuses on the economic, environmental, and social impacts of a company\'s operations on the world (impact materiality).', idealFor: 'Broad stakeholder audiences, NGOs, and global investors.', accent: 'text-blue-500' },
  { title: 'TCFD', fullname: 'Task Force on Climate-related Financial Disclosures', description: 'Evaluates how climate change impacts the financial health of the business. Highly sought after by institutional investors assessing long-term risk.', idealFor: 'Investors, financial institutions, and capital markets.', accent: 'text-emerald-500' },
  { title: 'CSRD', fullname: 'Corporate Sustainability Reporting Directive', description: 'The stringent EU mandate that requires double materiality — how the world impacts the business AND how the business impacts the world.', idealFor: 'EU-operating entities and global supply chain compliance.', accent: 'text-purple-500' },
];

const METHODOLOGY_STEPS = [
  { step: '01', title: 'Materiality Assessment', description: 'We identify and prioritize the ESG topics that matter most to your business and stakeholders, utilizing single or double materiality methodologies.', icon: <Target className="h-6 w-6 text-emerald-400" /> },
  { step: '02', title: 'Data Collection Framework', description: 'Structuring robust quantitative and qualitative data pipelines across E, S, and G pillars with audit trails ensuring data reliability.', icon: <FileSpreadsheet className="h-6 w-6 text-emerald-400" /> },
  { step: '03', title: 'Content & Narrative Development', description: 'Crafting compelling disclosures that blend hard metrics with strategic narrative, demonstrating your commitment and progress against sustainability targets.', icon: <PenTool className="h-6 w-6 text-emerald-400" /> },
  { step: '04', title: 'Report Design & Advisory', description: 'Transforming technical disclosures into an engaging, beautifully designed ESG report layout ready for digital and print publication.', icon: <LayoutTemplate className="h-6 w-6 text-emerald-400" /> },
];

const DELIVERABLES = [
  { title: 'Comprehensive ESG Report', description: 'A beautifully designed, full-length sustainability report aligned with your chosen frameworks.', icon: <LayoutTemplate className="h-6 w-6" />, accent: 'from-emerald-500 to-green-600' },
  { title: 'ESG Factsheet', description: 'A concise 2–4 page summary of your KPIs and targets for quick stakeholder consumption.', icon: <PieChart className="h-6 w-6" />, accent: 'from-blue-500 to-cyan-600' },
  { title: 'Reporting Roadmap', description: 'A multi-year strategy detailing how to evolve your reporting maturity and improve ESG ratings.', icon: <Globe className="h-6 w-6" />, accent: 'from-primary-500 to-primary-700' },
];

const FAQS = [
  { question: 'How do we choose which framework to report against?', answer: 'The choice depends on your audience and jurisdiction. GRI is excellent for general stakeholders. TCFD is critical for investors. CSRD is mandatory if you operate in or supply to the EU. Often, we recommend a hybrid approach (e.g., GRI + TCFD).' },
  { question: 'What is Double Materiality?', answer: 'Double materiality assesses both "Impact Materiality" (how your business affects the environment and society) and "Financial Materiality" (how sustainability factors affect your financial performance). It is the cornerstone of the CSRD framework.' },
  { question: 'Do you help with the visual design of the report?', answer: 'Yes. Beyond data aggregation and writing, our team handles the complete visual design of the report, ensuring it aligns with your brand identity and presents complex data in an easily digestible, visually appealing format.' },
  { question: 'How long does the ESG reporting process take?', answer: 'A first-time, comprehensive ESG report typically takes 12 to 16 weeks from kickoff to final publication, depending on internal data readiness and the complexity of the materiality assessment.' },
];

export default function ESGReportingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="page-shell min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-20 lg:pt-28">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-emerald-500 opacity-20 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 z-10">
          <HeroFadeUp delay={0.1}><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Enterprise ESG Reporting Services</div></HeroFadeUp>
          <HeroFadeUp delay={0.2}><h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">Transform ESG Data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Credible Reporting.</span></h1></HeroFadeUp>
          <HeroFadeUp delay={0.3}><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Develop globally aligned sustainability reports that build stakeholder confidence, attract capital, and demonstrate compliance with GRI, TCFD, and CSRD.</p></HeroFadeUp>
          <HeroFadeUp delay={0.4}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="hero-cta-esg-reporting"><Calendar className="h-5 w-5" />Book a Free Consultation</a>
              <Link href="/solutions/esg-strategy" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View ESG Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </HeroFadeUp>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Navigate the Alphabet Soup</h2><p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">We align your disclosures with the most rigorous global frameworks to meet the precise needs of your stakeholders.</p></FadeUp>
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {FRAMEWORKS.map((fw) => (
              <StaggerItem key={fw.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className={`text-4xl font-black tracking-tighter mb-2 ${fw.accent}`}>{fw.title}</div>
                <div className="text-sm font-semibold text-gray-500 mb-6">{fw.fullname}</div>
                <p className="text-gray-600 mb-6 min-h-[5rem]">{fw.description}</p>
                <div className="pt-6 border-t border-gray-100"><div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Ideal For</div><p className="text-sm font-medium text-gray-800">{fw.idealFor}</p></div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold">Our Reporting Methodology</h2><p className="mt-4 text-slate-400 text-lg">An end-to-end process from materiality to publication.</p></FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {METHODOLOGY_STEPS.map((step, idx) => (
              <FadeUp key={idx} delay={idx * 0.1} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:bg-slate-800 transition">
                <div className="flex items-start justify-between mb-6"><div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-700 shadow-inner">{step.icon}</div><div className="text-4xl font-black text-slate-700/50">{step.step}</div></div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">What We Deliver</h2><p className="mt-4 text-gray-600 text-lg">Tangible assets ready for your investors and stakeholders.</p></FadeUp>
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

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-900">Reporting FAQ</h2></FadeUp>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition" id={`faq-esg-reporting-${idx}`}>
                  <span className="text-left">{faq.question}</span><ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>{openFaq === idx && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-5 text-gray-600 text-sm">{faq.answer}</motion.div>}</AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 py-20 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeUp>
            <Shield className="h-14 w-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Elevate Your ESG Disclosures?</h2>
            <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl mx-auto">Speak with our reporting experts to scope your next ESG report. We'll advise on framework alignment, gap analysis, and a custom timeline.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-base font-semibold shadow-lg flex items-center gap-2 justify-center" id="bottom-cta-esg-reporting"><Calendar className="h-5 w-5" />Book a Free Consultation</a>
              <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">View All Services <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-emerald-200/70">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Framework alignment advice</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Gap analysis scoping</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Custom timeline & pricing</span>
            </div>
          </FadeUp>
        </div>
      </section>
      <Footer />
    </div>
  );
}
