import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, LineChart, Wallet, Zap, CheckCircle2, Sprout, Building2, Landmark, Lightbulb } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Markets & Financing Services | Ploxi Earth',
  description:
    'Navigate voluntary carbon markets, IREC trading, carbon project financing, and renewable energy financing with Ploxi Earth\'s expert advisory services.',
};

const SERVICES = [
  {
    title: 'IREC & Carbon Trading',
    href: '/services/carbon-trading',
    description: 'Navigate renewable energy certificates and voluntary carbon markets with expert advisory on procurement, trading strategy, and registry registration.',
    icon: <LineChart className="h-6 w-6" />,
    deliverables: ['I-REC Procurement', 'Carbon Credit Sourcing', 'Registry Registration'],
    iconBg: 'bg-purple-100 text-purple-700',
    cta: 'Explore Carbon Market Advisory',
  },
  {
    title: 'Carbon Project Financing',
    href: '/services/carbon-project-financing',
    description: 'Bridge high-integrity carbon removal and avoidance projects with global institutional capital through ERPAs, forward financing, and blended finance structures.',
    icon: <Wallet className="h-6 w-6" />,
    deliverables: ['Eligibility Assessment', 'Deal Structuring', 'Investor Matching'],
    iconBg: 'bg-indigo-100 text-indigo-700',
    cta: 'Connect with Climate Investors',
  },
  {
    title: 'Renewable Energy Financing',
    href: '/services/renewable-financing',
    description: 'Access structured financing for commercial solar, wind, and battery storage projects — from zero-capex PPA structures to green loans and operating leases.',
    icon: <Zap className="h-6 w-6" />,
    deliverables: ['Financial Modelling', 'Lender Matching', 'PPA Structuring'],
    iconBg: 'bg-amber-100 text-amber-700',
    cta: 'Talk to Renewable Financing Experts',
  },
];

const PROCESS = [
  { step: '1', title: 'Portfolio Assessment', desc: 'Evaluate your current emissions, assets, and goals to identify the best market opportunity.' },
  { step: '2', title: 'Strategy Design', desc: 'Build a tailored market or financing strategy aligned with your Net Zero timeline.' },
  { step: '3', title: 'Execution', desc: 'Execute transactions, register projects, or secure capital with our expert guidance.' },
  { step: '4', title: 'Monitoring', desc: 'Track credit issuance, energy generation, and portfolio performance over time.' },
];

const INDUSTRIES = [
  { name: 'Project Developers', icon: <Sprout className="h-5 w-5" /> },
  { name: 'Renewable Energy', icon: <Zap className="h-5 w-5" /> },
  { name: 'Infrastructure', icon: <Building2 className="h-5 w-5" /> },
  { name: 'Impact Investors', icon: <Landmark className="h-5 w-5" /> },
  { name: 'Agri-tech', icon: <Lightbulb className="h-5 w-5" /> },
];

export default function MarketsFinancingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-950/40 via-slate-950 to-slate-950" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'Solutions', href: '/solutions' }, { label: 'Markets & Financing' }]}
            className="mb-8 [&_*]:text-slate-400 [&_a]:hover:text-purple-300"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300 mb-6">
            Markets & Financing
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Convert Climate Action into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Capital & Market Value.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Navigate voluntary carbon and renewable energy certificate markets, secure project financing, and unlock new revenue streams through the global green economy.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/services/carbon-trading" className="btn-primary px-8 py-4 text-base font-semibold">
              Explore Carbon Market Advisory
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
            <p className="mt-4 text-lg text-gray-600">Choose the market or financing service that matches your investment objectives.</p>
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
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
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
            <h2 className="text-3xl font-bold text-gray-900">Our Advisory Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div key={p.step} className="bg-white rounded-2xl p-6 border border-gray-200 relative overflow-hidden group hover:border-purple-200 transition">
                <div className="absolute -right-3 -top-3 text-7xl font-black text-gray-100 group-hover:text-purple-50 transition">{p.step}</div>
                <div className="relative z-10">
                  <h4 className="font-bold text-purple-600 text-lg mb-2">{p.title}</h4>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Who We Work With</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="flex items-center gap-2 rounded-full border border-gray-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-gray-700">
                {ind.icon}
                {ind.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Enter the Carbon Market?</h2>
          <p className="text-slate-400 text-lg mb-8">Connect with our trading and financing experts for a free, no-obligation portfolio review.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/services/carbon-trading" className="btn-primary px-8 py-4 text-base font-semibold">
              Explore Market Advisory
            </Link>
            <Link href="/solutions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base text-white font-semibold hover:bg-white/10 transition">
              Explore Other Solutions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
