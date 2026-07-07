'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type CarbonProject } from '@/lib/carbonMarketData';
import {
  X, MapPin, Database, Leaf, Zap, Calendar, CheckCircle, Clock,
  AlertCircle, ShieldCheck, Truck, RefreshCw, FileText, Mail,
} from 'lucide-react';

interface CarbonProjectDetailProps {
  project: CarbonProject | null;
  onClose: () => void;
  onEnquire: (p: CarbonProject) => void;
}

const SDG_COLORS: Record<string, string> = {
  'SDG 1': 'bg-red-600', 'SDG 3': 'bg-green-600', 'SDG 7': 'bg-yellow-400',
  'SDG 8': 'bg-red-700', 'SDG 11': 'bg-amber-500', 'SDG 13': 'bg-green-800',
  'SDG 15': 'bg-emerald-600',
};

function fmtVol(n?: number) {
  if (!n) return '–';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M tCO₂e`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K tCO₂e`;
  return `${n.toLocaleString()} tCO₂e`;
}

function statusMeta(status: string) {
  const s = status.toLowerCase();
  if (s.startsWith('issued')) return { icon: CheckCircle, cls: 'text-emerald-600' };
  if (s.includes('issuance') || s.includes('approved')) return { icon: Clock, cls: 'text-amber-600' };
  if (s.includes('cancellation')) return { icon: AlertCircle, cls: 'text-slate-500' };
  return { icon: Clock, cls: 'text-blue-600' };
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 leading-snug">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">{title}</p>
      <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-1">{children}</div>
    </div>
  );
}

export default function CarbonProjectDetail({ project, onClose, onEnquire }: CarbonProjectDetailProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (project) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 z-[210] flex w-full max-w-lg flex-col bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 bg-emerald-950 px-5 py-4">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Carbon Project</p>
                <h2 className="text-sm font-bold leading-snug text-white line-clamp-2">{project.title}</h2>
                <p className="mt-0.5 text-xs text-emerald-300">{project.id}</p>
              </div>
              <button
                onClick={onClose}
                id="detail-close-btn"
                className="shrink-0 rounded-xl border border-white/15 p-1.5 text-white/70 transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto mobile-scroll px-5 py-5">

              {/* Overview */}
              <Section title="Project Overview">
                <Row icon={MapPin}   label="Location"  value={project.country} />
                <Row icon={Leaf}     label="Category"  value={project.category} />
                {project.technology && <Row icon={Zap} label="Technology" value={project.technology} />}
              </Section>

              {project.description && (
                <div className="mb-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Project Description</p>
                  <p className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Credit Information */}
              <Section title="Credit Information">
                <Row icon={Database}  label="Registry / Standard" value={project.registry} />
                <Row icon={Zap}       label="Credit Type"          value={project.creditType} />
                <Row icon={Calendar}  label="Vintage"              value={project.vintage} />
                <Row icon={Leaf}      label="Available Volume"     value={fmtVol(project.volume)} />
                {(() => {
                  const { icon: Si, cls } = statusMeta(project.issuanceStatus);
                  return (
                    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <Si className={`mt-0.5 h-4 w-4 shrink-0 ${cls}`} />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Issuance Status</p>
                        <p className="text-sm font-medium text-gray-800">{project.issuanceStatus}</p>
                      </div>
                    </div>
                  );
                })()}
                {project.verificationCycle && (
                  <Row icon={RefreshCw} label="Verification Cycle" value={project.verificationCycle} />
                )}
              </Section>

              {/* Eligibility & Delivery — only if data present */}
              {(project.corsiaEligible || project.loaStatus || project.deliveryStatus || project.deliverySchedule) && (
                <Section title="Eligibility & Delivery">
                  {project.corsiaEligible && (
                    <Row icon={ShieldCheck} label="CORSIA Eligibility" value={project.corsiaEligible} />
                  )}
                  {project.loaStatus && (
                    <Row icon={FileText} label="Letter of Authorisation" value={project.loaStatus} />
                  )}
                  {project.deliveryStatus && (
                    <Row icon={Truck} label="Spot / Delivery" value={project.deliveryStatus} />
                  )}
                  {project.deliverySchedule && (
                    <Row icon={Calendar} label="Delivery Schedule" value={project.deliverySchedule} />
                  )}
                </Section>
              )}

              {/* SDGs */}
              {project.sdgs && project.sdgs.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                    Sustainable Development Goals
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.sdgs.map(sdg => {
                      const trimmed = sdg.trim();
                      const colorCls = SDG_COLORS[trimmed] ?? 'bg-slate-600';
                      return (
                        <span key={trimmed} className={`rounded-lg px-3 py-1 text-xs font-bold text-white ${colorCls}`}>
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 flex flex-col gap-2.5">
              <button
                id={`detail-enquire-${project.id}`}
                onClick={() => onEnquire(project)}
                className="btn-primary w-full gap-2"
              >
                <Mail className="h-4 w-4" />
                Enquire About Credits
              </button>
              <a
                href="https://calendly.com/dhwani-sg/30min"
                target="_blank"
                rel="noopener noreferrer"
                id="detail-talk-cta"
                className="btn-secondary w-full gap-2 text-center"
              >
                Talk to Carbon Market Team
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
