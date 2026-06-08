import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart2, Leaf, TrendingUp } from 'lucide-react';

import Footer from '@/components/Footer';
import { SOLUTION_CATEGORIES } from '@/lib/navData';

export const metadata: Metadata = {
  title: 'Sustainability Solutions | Ploxi Earth',
  description:
    "Explore Ploxi Earth's full suite of sustainability consulting services spanning ESG reporting, carbon accounting, regulatory compliance, and climate finance.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  BarChart2: <BarChart2 className="h-8 w-8" />,
  Leaf: <Leaf className="h-8 w-8" />,
  TrendingUp: <TrendingUp className="h-8 w-8" />,
};

const GRADIENTS: Record<string, string> = {
  'esg-strategy': 'from-emerald-500 to-green-600',
  'carbon-compliance': 'from-blue-500 to-cyan-600',
  'markets-financing': 'from-purple-500 to-indigo-600',
};

const HOVER_RINGS: Record<string, string> = {
  'esg-strategy': 'hover:ring-emerald-200',
  'carbon-compliance': 'hover:ring-blue-200',
  'markets-financing': 'hover:ring-purple-200',
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-900/30 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 mb-8">
            End-to-End Sustainability Services
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Our Sustainability <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Solutions</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            From ESG strategy to carbon markets, we offer integrated services that take companies from measurement to meaningful climate action.
          </p>
        </div>
      </section>

      {/* 3 Category Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Solution Area</h2>
            <p className="mt-4 text-lg text-gray-600">Select a category to explore the specific services within it.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {SOLUTION_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className={`group bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-2 ring-transparent ${HOVER_RINGS[cat.slug]}`}
              >
                {/* Icon */}
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${GRADIENTS[cat.slug]} text-white shadow-lg`}>
                  {ICON_MAP[cat.icon]}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{cat.description}</p>

                {/* Service list */}
                <ul className="space-y-2 mb-8">
                  {cat.services.map((svc) => (
                    <li key={svc.href} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {svc.title}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 font-semibold text-primary-600 group-hover:gap-3 transition-all text-sm">
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
