import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Activity, Layers, ShieldCheck, CheckCircle2, Truck, Package, FlaskConical, Car, ShoppingBag } from 'lucide-react';

import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Carbon & Compliance Services | Ploxi Earth',
  description:
    'Establish credible GHG baselines, conduct lifecycle assessments, produce EPD documentation, and navigate CBAM, ICTS, and EPR compliance with Ploxi Earth.',
};

const SERVICES = [
  {
    title: 'GHG Audit & Baseline',
    href: '/services/ghg-audit',
    description:
      'Build a credible, third-party-verifiable greenhouse gas emissions inventory across Scope 1, 2, and 3 — aligned with GHG Protocol and ISO 14064.',
    icon: <Activity className="h-6 w-6" />,
    deliverables: ['Emissions Inventory', 'Baseline Report', 'Reduction Roadmap'],
    iconBg: 'bg-blue-100 text-blue-700',
    cta: 'Schedule Emissions Inventory',
  },
  {
    title: 'Carbon Footprint / LCA / EPD',
    href: '/services/product-lca',
    description:
      'Measure product-level environmental impact from raw material extraction to end-of-life and produce ISO 14025-compliant EPD documentation for buyers and regulators.',
    icon: <Layers className="h-6 w-6" />,
    deliverables: ['Footprint Report', 'EPD Documentation', 'Reduction Opportunities'],
    iconBg: 'bg-cyan-100 text-cyan-700',
    cta: 'Book Carbon Assessment',
  },
  {
    title: 'Compliance Support (CBAM, ICTS, EPR)',
    href: '/services/compliance-support',
    description:
      'Stay ahead of evolving international sustainability regulations. We handle CBAM embedded-emission reporting, EPR registration, and domestic carbon scheme advisory.',
    icon: <ShieldCheck className="h-6 w-6" />,
    deliverables: ['CBAM Declarations', 'Compliance Roadmap', 'EPR Registration Support'],
    iconBg: 'bg-emerald-100 text-emerald-700',
    cta: 'Request Compliance Consultation',
  },
];

const PROCESS = [
  { step: '1', title: 'Boundary Setting', desc: 'Define organisational and operational boundaries per GHG Protocol or ISO methodology.' },
  { step: '2', title: 'Data Collection', desc: 'Gather activity data across energy, transport, procurement, and waste streams.' },
  { step: '3', title: 'Calculation & Verification', desc: 'Apply emission factors and facilitate third-party verification for full regulatory credibility.' },
  { step: '4', title: 'Report & Comply', desc: 'Publish the inventory report and submit all required regulatory filings on time.' },
];

const INDUSTRIES = [
  { name: 'Exporters', icon: <Truck className="h-5 w-5" /> },
  { name: 'Heavy Industry', icon: <FlaskConical className="h-5 w-5" /> },
  { name: 'Consumer Goods', icon: <ShoppingBag className="h-5 w-5" /> },
  { name: 'Automotive', icon: <Car className="h-5 w-5" /> },
  { name: 'Packaging & Plastics', icon: <Package className="h-5 w-5" /> },
];

export default function CarbonCompliancePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-slate-950 to-slate-950" />
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'Solutions', href: '/solutions' }, { label: 'Carbon & Compliance' }]}
            className="mb-8 [&_*]:text-slate-400 [&_a]:hover:text-blue-300"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 mb-6">
            Carbon & Compliance
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Measure, Verify &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Manage Your Carbon Impact.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            From GHG baselines to product lifecycle assessments and regulatory filings, we ensure your environmental data is credible, audit-ready, and compliance-proof.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/services/ghg-audit" className="btn-primary px-8 py-4 text-base font-semibold">
              Schedule Emissions Inventory
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition"
            >
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
            <p className="mt-4 text-lg text-gray-600">
              Select the service that addresses your specific carbon or compliance challenge.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {SERVICES.map((svc) => (
              <div
                key={svc.href}
                className="bg-slate-50 rounded-3xl border border-gray-200 p-8 flex flex-col hover:shadow-md transition-shadow"
              >
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
                        <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
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
            <h2 className="text-3xl font-bold text-gray-900">Our Carbon Accounting Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div
                key={p.step}
                className="bg-white rounded-2xl p-6 border border-gray-200 relative overflow-hidden group hover:border-blue-200 transition"
              >
                <div className="absolute -right-3 -top-3 text-7xl font-black text-gray-100 group-hover:text-blue-50 transition">
                  {p.step}
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-blue-600 text-lg mb-2">{p.title}</h4>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Industries We Serve</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.name}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-gray-700"
              >
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Establish Your Carbon Baseline?</h2>
          <p className="text-slate-400 text-lg mb-8">
            Talk to our carbon accounting team for a no-obligation project scope assessment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/services/ghg-audit" className="btn-primary px-8 py-4 text-base font-semibold">
              Schedule Emissions Inventory
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base text-white font-semibold hover:bg-white/10 transition"
            >
              Explore Other Solutions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
