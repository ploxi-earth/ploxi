'use client';
import { useState, useCallback } from 'react';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { FadeUp } from '@/components/ui/Motion';
import { Mail, ArrowRight } from 'lucide-react';

import CarbonMarketHero         from '@/components/carbon-market/CarbonMarketHero';
import PortfolioStats            from '@/components/carbon-market/PortfolioStats';
import CarbonProjectExplorer     from '@/components/carbon-market/CarbonProjectExplorer';
import CarbonProjectDetail       from '@/components/carbon-market/CarbonProjectDetail';
import CreditRequirementForm     from '@/components/carbon-market/CreditRequirementForm';
import MarketParticipantPathways from '@/components/carbon-market/MarketParticipantPathways';
import { type CarbonProject }   from '@/lib/carbonMarketData';

// Note: metadata export belongs in a server component — kept here as reference.
// For Next.js App Router metadata, move to a separate layout.tsx or use generateMetadata.
// export const metadata: Metadata = { ... };

export default function CarbonMarketPage() {
  const [detailProject, setDetailProject] = useState<CarbonProject | null>(null);
  const [formOpen,      setFormOpen]      = useState(false);
  const [formProject,   setFormProject]   = useState<CarbonProject | null>(null);

  const openEnquiry = useCallback((p?: CarbonProject | null) => {
    setFormProject(p ?? null);
    setFormOpen(true);
  }, []);

  const openDetail = useCallback((p: CarbonProject) => {
    setDetailProject(p);
  }, []);

  // Enquire from detail drawer: close drawer, open form
  const enquireFromDetail = useCallback((p: CarbonProject) => {
    setDetailProject(null);
    setTimeout(() => openEnquiry(p), 50);
  }, [openEnquiry]);

  return (
    <div className="page-shell min-h-screen bg-white">
      {/* 1 — Hero */}
      <CarbonMarketHero onEnquireClick={() => openEnquiry(null)} />

      {/* 2 — Portfolio Snapshot */}
      <PortfolioStats />

      {/* 3 — Portfolio Explorer */}
      <CarbonProjectExplorer onViewDetails={openDetail} onEnquire={openEnquiry} />

      {/* 4 — Participant Pathways */}
      <MarketParticipantPathways onEnquireClick={() => openEnquiry(null)} />

      {/* 5 — Final CTA */}
      <FadeUp>
        <section className="bg-slate-950 py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-balance text-2xl font-extrabold text-white sm:text-3xl">
              Looking for the Right Carbon Credit Portfolio?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              Tell us your credit requirements, preferred project types, registry, vintage,
              geography, and procurement objectives. Our carbon market team will match you
              with the most suitable projects.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                id="final-cta-submit"
                onClick={() => openEnquiry(null)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <Mail className="h-4 w-4" />
                Submit Credit Requirement
              </button>
              <a
                href="https://calendly.com/dhwani-sg/30min"
                target="_blank"
                rel="noopener noreferrer"
                id="final-cta-talk"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                <ArrowRight className="h-4 w-4" />
                Talk to Carbon Market Team
              </a>
            </div>
          </div>
        </section>
      </FadeUp>

      <Footer />

      {/* Modals */}
      <CarbonProjectDetail
        project={detailProject}
        onClose={() => setDetailProject(null)}
        onEnquire={enquireFromDetail}
      />
      <CreditRequirementForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        prefillProject={formProject}
      />
    </div>
  );
}
