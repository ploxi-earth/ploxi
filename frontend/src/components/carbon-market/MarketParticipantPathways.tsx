'use client';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import { Search, Users, ArrowRight } from 'lucide-react';

interface MarketParticipantPathwaysProps {
  onEnquireClick: () => void;
}

export default function MarketParticipantPathways({ onEnquireClick }: MarketParticipantPathwaysProps) {
  return (
    <FadeUp>
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Get Involved</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">How Would You Like to Engage?</h2>
          </div>

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* For Buyers */}
            <StaggerItem>
              <div className="surface-card flex h-full flex-col gap-5 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Carbon Credit Buyers</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">Source Carbon Credits</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-500">
                    {[
                      'Discover available carbon credits from verified projects',
                      'Filter by category, registry, vintage, and geography',
                      'Compare project opportunities side by side',
                      'Submit sourcing requirements to our team',
                      'Connect directly with the carbon market advisory desk',
                    ].map(pt => (
                      <li key={pt} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  id="pathways-buyer-cta"
                  onClick={onEnquireClick}
                  className="btn-primary mt-auto gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Source Carbon Credits
                </button>
              </div>
            </StaggerItem>

            {/* For Developers */}
            <StaggerItem>
              <div className="surface-card flex h-full flex-col gap-5 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Carbon Project Developers</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">List Your Carbon Project</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-500">
                    {[
                      'Showcase your carbon project to qualified buyers',
                      'Connect with potential off-take partners globally',
                      'Explore voluntary and compliance market opportunities',
                      'Access Ploxi Earth carbon market advisory services',
                      'Explore climate finance for project development',
                    ].map(pt => (
                      <li key={pt} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  id="pathways-developer-cta"
                  onClick={onEnquireClick}
                  className="btn-secondary mt-auto gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  List Your Carbon Project
                </button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </FadeUp>
  );
}
