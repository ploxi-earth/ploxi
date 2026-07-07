'use client';
import { useMemo } from 'react';
import { CARBON_PROJECTS, computePortfolioStats } from '@/lib/carbonMarketData';
import { StaggerContainer, StaggerItem } from '@/components/ui/Motion';
import { Globe, Layers, BarChart3, Leaf, Award, Calendar } from 'lucide-react';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

const STATS_CONFIG = [
  { key: 'totalProjects',  label: 'Carbon Projects',      icon: Layers,   color: 'emerald' },
  { key: 'totalVolume',    label: 'tCO₂e Available',      icon: Leaf,     color: 'green'   },
  { key: 'countries',      label: 'Countries / Regions',  icon: Globe,    color: 'teal'    },
  { key: 'categories',     label: 'Project Categories',   icon: BarChart3,color: 'cyan'    },
  { key: 'registries',     label: 'Registries / Standards', icon: Award,  color: 'blue'    },
  { key: 'vintages',       label: 'Available Vintages',   icon: Calendar, color: 'indigo'  },
] as const;

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  green:   { bg: 'bg-green-50',   text: 'text-green-600',   ring: 'ring-green-100'   },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-600',    ring: 'ring-teal-100'    },
  cyan:    { bg: 'bg-cyan-50',    text: 'text-cyan-600',    ring: 'ring-cyan-100'    },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    ring: 'ring-blue-100'    },
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  ring: 'ring-indigo-100'  },
};

export default function PortfolioStats() {
  const stats = useMemo(() => computePortfolioStats(CARBON_PROJECTS), []);

  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Portfolio Snapshot</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
            A Diversified Carbon Credit Portfolio
          </h2>
        </div>
        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {STATS_CONFIG.map(({ key, label, icon: Icon, color }) => {
            const c = COLOR_MAP[color];
            const val = stats[key as keyof typeof stats];
            return (
              <StaggerItem key={key}>
                <div className={`rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm ring-1 ${c.ring} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
                  <div className={`mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
                    <Icon className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <p className={`text-xl font-extrabold ${c.text}`}>{fmt(val)}</p>
                  <p className="mt-0.5 text-[10px] font-medium leading-tight text-gray-500">{label}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
