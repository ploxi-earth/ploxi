'use client';
import { type CarbonProject } from '@/lib/carbonMarketData';
import { MapPin, Database, Leaf, Zap, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface CarbonProjectCardProps {
  project: CarbonProject;
  onViewDetails: (p: CarbonProject) => void;
  onEnquire: (p: CarbonProject) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Cookstoves':              'bg-orange-50 text-orange-700 border-orange-200',
  'Afforestation (Mahogany)':'bg-green-50  text-green-700  border-green-200',
  'Biogas/Biogas CNG':       'bg-teal-50   text-teal-700   border-teal-200',
  'Renewable Electricity':   'bg-blue-50   text-blue-700   border-blue-200',
  'Wind Power':              'bg-cyan-50   text-cyan-700   border-cyan-200',
  'Reduction':               'bg-purple-50 text-purple-700 border-purple-200',
  'Removal':                 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Reduction/Avoidance':     'bg-indigo-50 text-indigo-700 border-indigo-200',
};

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (s.startsWith('issued'))
    return { icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50', label: 'Issued' };
  if (s.includes('issuance by') || s.includes('pending') || s.includes('approved'))
    return { icon: Clock, cls: 'text-amber-600 bg-amber-50', label: 'Upcoming' };
  if (s.includes('cancellation'))
    return { icon: AlertCircle, cls: 'text-slate-500 bg-slate-50', label: 'Cancellation Only' };
  return { icon: Clock, cls: 'text-blue-600 bg-blue-50', label: status.slice(0, 22) };
}

function fmt(n?: number): string {
  if (!n) return '–';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M tCO₂e`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K tCO₂e`;
  return `${n.toLocaleString()} tCO₂e`;
}

export default function CarbonProjectCard({ project, onViewDetails, onEnquire }: CarbonProjectCardProps) {
  const catCls = CATEGORY_COLORS[project.category] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  const { icon: StatusIcon, cls: statusCls, label: statusLabel } = statusBadge(project.issuanceStatus);

  return (
    <article className="surface-card surface-card-hover flex flex-col gap-3 p-5">
      {/* Top row: category badge + status */}
      <div className="flex items-start justify-between gap-2">
        <span className={`self-start rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${catCls}`}>
          {project.category}
        </span>
        <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusCls}`}>
          <StatusIcon className="h-3 w-3" />
          {statusLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">{project.title}</h3>

      {/* Key facts */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate">{project.country}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Database className="h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate">{project.registry}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate">{project.creditType}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Leaf className="h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate">Vintage {project.vintage}</span>
        </div>
      </div>

      {/* Volume */}
      {project.volume ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          {fmt(project.volume)}
        </p>
      ) : null}

      {/* CORSIA tag if eligible */}
      {project.corsiaEligible && project.corsiaEligible !== 'No' && (
        <span className="self-start rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
          CORSIA Eligible
        </span>
      )}

      {/* Actions */}
      <div className="mt-auto flex gap-2 pt-1">
        <button
          id={`card-view-${project.id}`}
          onClick={() => onViewDetails(project)}
          className="flex-1 rounded-xl border border-primary-600 bg-transparent py-2 text-xs font-semibold text-primary-600 transition-all duration-150 hover:bg-primary-50"
        >
          View Project
        </button>
        <button
          id={`card-enquire-${project.id}`}
          onClick={() => onEnquire(project)}
          className="flex-1 rounded-xl bg-primary-600 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-primary-700"
        >
          Enquire
        </button>
      </div>
    </article>
  );
}
