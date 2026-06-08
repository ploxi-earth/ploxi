import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target, FileText, Globe, CheckCircle2, Users, Building2, Factory, Package, Pill } from 'lucide-react';

import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'ESG Strategy & Reporting Services | Ploxi Earth',
  description:
    'From ESG baseline assessments to BRSR and global reporting frameworks (GRI, TCFD, CSRD), Ploxi Earth guides enterprises through every phase of the sustainability reporting lifecycle.',
};

const SERVICES = [
  {
    title: 'ESG Baseline & Gap Analysis',
    href: '/services/esg-baseline',
    description:
      'Identify gaps, benchmark your ESG maturity against global frameworks, and build a strategic roadmap toward full sustainability readiness.',
    icon: <Target className="h-6 w-6" />,
    deliverables: ['ESG Scorecard', 'Gap Report', 'Strategic Roadmap'],
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-700',
    cta: 'Book ESG Baseline Assessment',
  },
  {
    title: 'BRSR Core Reporting',
    href: '/services/brsr-reporting',
    description:
      'Navigate India\'s SEBI-mandated Business Responsibility & Sustainability Reporting requirements with expert guidance from data collection to final filing.',
    icon: <FileText className="h-6 w-6" />,
    deliverables: ['Reporting Templates', 'Gap Assessment', 'Advisory Support'],
    accent: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-100 text-blue-700',
    cta: 'Download ESG Readiness Guide',
  },
  {
    title: 'ESG Reporting (TCFD, GRI, CSRD)',
    href: '/services/esg-reporting',
    description:
      'Develop globally aligned sustainability reports under major frameworks — GRI Standards, TCFD climate disclosures, and EU CSRD requirements.',
    icon: <Globe className="h-6 w-6" />,
    deliverables: ['Full ESG Report', 'ESG Factsheet', 'Reporting Roadmap'],
    accent: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-700',
    cta: 'Book ESG Reporting Consultation',
  },
];

const PROCESS = [
  { step: '1', title: 'Materiality Assessment', desc: 'Identify the ESG topics most relevant to your business and stakeholders.' },
  { step: '2', title: 'Data Collection', desc: 'Structure and gather the quantitative and qualitative data required by each framework.' },
  { step: '3', title: 'Gap Analysis', desc: 'Compare your current disclosures against framework requirements and industry peers.' },
  { step: '4', title: 'Report Development', desc: 'Draft, design, and publish a professional, investor-grade sustainability report.' },
];

const INDUSTRIES = [
  { name: 'Manufacturing', icon: <Factory className="h-5 w-5" /> },
  { name: 'Financial Services', icon: <Building2 className="h-5 w-5" /> },
  { name: 'Real Estate', icon: <Building2 className="h-5 w-5" /> },
  { name: 'Consumer Goods', icon: <Package className="h-5 w-5" /> },
  { name: 'Pharmaceuticals', icon: <Pill className="h-5 w-5" /> },
];

export default function ESGStrategyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'Solutions', href: '/solutions' }, { label: 'ESG Strategy & Reporting' }]}
            className="mb-8 [&_*]:text-slate-400 [&_a]:hover:text-emerald-300"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 mb-6">
            ESG Strategy & Reporting
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Build Credible <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">ESG Frameworks</span> That Stakeholders Trust.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            From establishing your ESG maturity baseline to publishing globally recognised sustainability reports, we guide enterprises through every phase of the reporting lifecycle.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/services/esg-baseline" className="btn-primary px-8 py-4 text-base font-semibold">
              Book ESG Baseline Assessment
            </Link>
            <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition">
              All Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Services in This Category</h2>
            <p className="mt-4 text-lg text-gray-600">Choose the specific reporting service that fits your current needs.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {SERVICES.map((svc) => (
              <div key={svc.href} className="bg-slate-50 rounded-3xl border border-gray-200 p-8 flex flex-col hover:shadow-md transition-shadow">
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${svc.iconBg}`}>
                  {svc.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{svc.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{svc.description}</p>
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Key Deliverables</p>
                  <ul className="space-y-1.5">
                    {svc.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={svc.href}
                  className="flex items-center justify-between w-full rounded-2xl bg-slate-900 text-white px-5 py-3 text-sm font-semibold hover:bg-slate-800 transition"
                >
                  {svc.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-slate-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Reporting Methodology</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div key={p.step} className="bg-white rounded-2xl p-6 border border-gray-200 relative overflow-hidden group hover:border-emerald-200 transition">
                <div className="absolute -right-3 -top-3 text-7xl font-black text-gray-100 group-hover:text-emerald-50 transition">{p.step}</div>
                <div className="relative z-10">
                  <h4 className="font-bold text-emerald-600 text-lg mb-2">{p.title}</h4>
                  <p className="text-gray-500 text-sm">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="flex items-center gap-2 rounded-full border border-gray-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-gray-700">
                {ind.icon}
                {ind.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your ESG Journey?</h2>
          <p className="text-slate-400 text-lg mb-8">Book a free discovery call and we'll identify the right starting point for your organisation.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/services/esg-baseline" className="btn-primary px-8 py-4 text-base font-semibold">
              Book ESG Baseline Assessment
            </Link>
            <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base text-white font-semibold hover:bg-white/10 transition">
              <Users className="h-5 w-5" /> Explore Other Solutions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
