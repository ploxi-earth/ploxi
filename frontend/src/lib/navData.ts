// ─── Ploxi Earth Navigation Data ─────────────────────────────────────────────
// Single source of truth for all Solutions navigation architecture.

export interface ServiceItem {
  title: string;
  href: string;
  description: string;
  icon: string; // Lucide icon name (string, resolved in components)
}

export interface SolutionCategory {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  icon: string;
  accentFrom: string;
  accentTo: string;
  textAccent: string;
  bgAccent: string;
  borderAccent: string;
  services: ServiceItem[];
  industriesServed: string[];
}

export const SOLUTION_CATEGORIES: SolutionCategory[] = [
  {
    slug: 'esg-strategy',
    title: 'ESG Strategy & Reporting',
    tagline: 'Build credible sustainability frameworks from the ground up.',
    description:
      'From establishing your ESG maturity baseline to publishing globally recognised sustainability reports, we guide enterprises through every phase of the reporting lifecycle.',
    href: '/solutions/esg-strategy',
    icon: 'BarChart2',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-green-600',
    textAccent: 'text-emerald-600',
    bgAccent: 'bg-emerald-50',
    borderAccent: 'border-emerald-200',
    services: [
      {
        title: 'ESG Baseline & Gap Analysis',
        href: '/services/esg-baseline',
        description: 'Identify gaps, benchmark ESG maturity, and build a roadmap toward sustainability readiness.',
        icon: 'Target',
      },
      {
        title: 'BRSR Core Reporting',
        href: '/services/brsr-reporting',
        description: 'Navigate Indian disclosure requirements confidently and prepare for SEBI compliance.',
        icon: 'FileText',
      },
      {
        title: 'ESG Reporting (TCFD, GRI, CSRD)',
        href: '/services/esg-reporting',
        description: 'Develop globally aligned sustainability reports that build stakeholder confidence.',
        icon: 'Globe',
      },
    ],
    industriesServed: ['Manufacturing', 'Financial Services', 'Real Estate', 'FMCG', 'Pharmaceuticals'],
  },
  {
    slug: 'carbon-compliance',
    title: 'Carbon & Compliance',
    tagline: 'Measure, verify, and manage your environmental impact.',
    description:
      'Establish credible emissions baselines, conduct lifecycle assessments, and stay ahead of evolving sustainability regulations including CBAM, EPR, and domestic carbon schemes.',
    href: '/solutions/carbon-compliance',
    icon: 'Leaf',
    accentFrom: 'from-blue-500',
    accentTo: 'to-cyan-600',
    textAccent: 'text-blue-600',
    bgAccent: 'bg-blue-50',
    borderAccent: 'border-blue-200',
    services: [
      {
        title: 'GHG Audit & Baseline',
        href: '/services/ghg-audit',
        description: 'Build a credible emissions inventory aligned with GHG Protocol and ISO standards.',
        icon: 'Activity',
      },
      {
        title: 'Carbon Footprint / LCA / EPD',
        href: '/services/product-lca',
        description: 'Measure product impact from raw materials to end-of-life and produce verified EPD documents.',
        icon: 'Layers',
      },
      {
        title: 'Compliance Support (CBAM, ICTS, EPR)',
        href: '/services/compliance-support',
        description: 'Stay compliant with international regulations and avoid costly reporting risks.',
        icon: 'ShieldCheck',
      },
    ],
    industriesServed: ['Exporters', 'Heavy Industry', 'Chemicals', 'Automotive', 'Consumer Goods'],
  },
  {
    slug: 'markets-financing',
    title: 'Markets & Financing',
    tagline: 'Convert sustainability action into capital and market value.',
    description:
      'Navigate voluntary carbon and renewable energy certificate markets, secure project financing, and unlock new revenue streams through the global green economy.',
    href: '/solutions/markets-financing',
    icon: 'TrendingUp',
    accentFrom: 'from-purple-500',
    accentTo: 'to-indigo-600',
    textAccent: 'text-purple-600',
    bgAccent: 'bg-purple-50',
    borderAccent: 'border-purple-200',
    services: [
      {
        title: 'IREC & Carbon Trading',
        href: '/services/carbon-trading',
        description: 'Navigate renewable certificates and carbon markets with expert trading advisory.',
        icon: 'LineChart',
      },
      {
        title: 'Carbon Project Financing',
        href: '/services/carbon-project-financing',
        description: 'Bridge high-integrity climate projects with global institutional investors.',
        icon: 'Wallet',
      },
      {
        title: 'Renewable Energy Financing',
        href: '/services/renewable-financing',
        description: 'Access structured financing pathways for solar, wind, and battery storage projects.',
        icon: 'Zap',
      },
    ],
    industriesServed: ['Project Developers', 'Renewable Energy', 'Infrastructure', 'Impact Investors', 'Agri-tech'],
  },
];

export const FLAT_NAV_LINKS = [
  { href: '/corporate', label: 'Platform' },
  { href: '/cleantech', label: 'Clean Tech' },
  { href: '/climate-finance', label: 'Climate Finance' },
  { href: '/tools/ghg-calculator', label: 'GHG Calculator' },
];
