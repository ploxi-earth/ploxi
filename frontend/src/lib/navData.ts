// ─── Ploxi Earth Navigation Data ─────────────────────────────────────────────
// Single source of truth for all navigation architecture.

// ─── Legacy: Solutions (kept for /solutions page usage) ───────────────────────

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

// ─── New Enterprise Navigation Architecture ────────────────────────────────────

export interface MegaMenuItem {
  title: string;
  /** If undefined, item is text-only (non-clickable, linkable later) */
  href?: string;
  description?: string;
  /** Opens in new tab */
  external?: boolean;
}

export interface MegaMenuColumn {
  heading: string;
  items: MegaMenuItem[];
}

// ─── Partners Menu ─────────────────────────────────────────────────────────────
export const PARTNERS_MENU: MegaMenuItem[] = [
  {
    title: 'Clean-Tech',
    href: '/cleantech',
    description: 'Connect with leading cleantech solution providers and innovators.',
  },
  {
    title: 'Carbon Market',
    href: '/partners/carbon-market',
    description: 'Access verified carbon market participants and trading networks.',
  },
  {
    title: 'Climate Finance',
    href: '/climate-finance',
    description: 'Engage with climate finance institutions and impact investors.',
  },
];

// ─── Tools Menu ────────────────────────────────────────────────────────────────
export const TOOLS_MENU: MegaMenuColumn[] = [
  {
    heading: 'Tools & Calculators',
    items: [
      { title: 'GHG', href: '/tools/ghg-calculator', description: 'GHG Emissions Calculator — GHG Protocol aligned' },
      { title: 'LCA', description: 'Life Cycle Assessment tool' /* href: '/tools/lca' */ },
    ],
  },
  {
    heading: 'Compliance',
    items: [
      { title: 'CBAM' /* href: '/tools/cbam' */ },
      { title: 'CCTS' /* href: '/tools/ccts' */ },
      { title: 'EPR' /* href: '/tools/epr' */ },
      { title: 'EIA' /* href: '/tools/eia' */ },
      { title: 'RPO' /* href: '/tools/rpo' */ },
    ],
  },
  {
    heading: 'ESG Reporting',
    items: [
      { title: 'BRSR' /* href: '/tools/brsr' */ },
      { title: 'GRI' /* href: '/tools/gri' */ },
      { title: 'IFRS' /* href: '/tools/ifrs' */ },
      { title: 'SASB' /* href: '/tools/sasb' */ },
    ],
  },
  {
    heading: 'Certifications',
    items: [
      { title: 'IGBC' /* href: '/tools/igbc' */ },
      { title: 'LEED' /* href: '/tools/leed' */ },
      { title: 'GRIHA' /* href: '/tools/griha' */ },
      { title: 'GNFZ' /* href: '/tools/gnfz' */ },
      { title: 'ISO Standards' /* href: '/tools/iso' */ },
    ],
  },
];

// ─── Services Menu (Lead-Generation Cards) ─────────────────────────────────────
// CTA labels are declared here so content admins can update them without
// touching component code. This shape also maps 1-to-1 to a future CMS schema.

export type ServiceCategory =
  | 'ESG & Reporting'
  | 'Carbon & Compliance'
  | 'Markets & Financing'
  | 'Green Assets'
  | 'Platform';

export interface ServiceCard {
  /** Primary display name of the service */
  name: string;
  /** Optional parenthetical subtitle (e.g. "LCA Reports & EPD Documentation") */
  subtitle?: string;
  /** CTA button label — editable by content admins */
  ctaText: string;
  /** CTA destination URL; '#' until a real page exists */
  ctaHref: string;
  /** Opens in new tab? */
  ctaExternal?: boolean;
  /** Groups cards visually inside the mega-panel */
  category: ServiceCategory;
}

export const SERVICES_MENU: ServiceCard[] = [
  // ── ESG & Reporting ─────────────────────────────────────────────────────────
  {
    name: 'ESG Baseline & Gap Analysis',
    subtitle: 'ESG Data Management',
    ctaText: 'Book ESG Baseline Assessment',
    ctaHref: 'https://calendly.com/dhwani-sg/30min',
    ctaExternal: true,
    category: 'ESG & Reporting',
  },
  {
    name: 'BRSR Core Reporting',
    subtitle: 'GRI, BRSR, CDP, IFRS',
    ctaText: 'Book BRSR Consultation',
    ctaHref: 'https://calendly.com/dhwani-sg/30min',
    ctaExternal: true,
    category: 'ESG & Reporting',
  },

  // ── Carbon & Compliance ─────────────────────────────────────────────────────
  {
    name: 'GHG Audit & Baseline',
    subtitle: 'ISHRAE, ISO & Others',
    ctaText: 'Schedule Emissions Inventory',
    ctaHref: 'https://calendly.com/dhwani-sg/30min',
    ctaExternal: true,
    category: 'Carbon & Compliance',
  },
  {
    name: 'Compliance Support',
    subtitle: 'CBAM, EPR, PAT',
    ctaText: 'Request Compliance Consultation',
    ctaHref: 'https://calendly.com/dhwani-sg/30min',
    ctaExternal: true,
    category: 'Carbon & Compliance',
  },
  {
    name: 'Carbon Footprint Assessment',
    subtitle: 'LCA Reports & EPD Documentation',
    ctaText: 'Request Lifecycle Assessment',
    ctaHref: 'https://calendly.com/dhwani-sg/30min',
    ctaExternal: true,
    category: 'Carbon & Compliance',
  },

  // ── Markets & Financing ─────────────────────────────────────────────────────
  {
    name: 'Carbon Credit Registration',
    ctaText: 'Explore Carbon Market Advisory',
    ctaHref: '/services/carbon-trading',
    category: 'Markets & Financing',
  },
  {
    name: 'Carbon Project Financing',
    ctaText: 'Connect with Climate Investors',
    ctaHref: '/services/carbon-project-financing',
    category: 'Markets & Financing',
  },
  {
    name: 'Renewable Energy Financing',
    ctaText: 'Discuss Project Financing',
    ctaHref: '/services/renewable-financing',
    category: 'Markets & Financing',
  },
  {
    name: 'IREC & Carbon Trading',
    ctaText: 'Learn Renewable Procurement Strategies',
    ctaHref: '/services/carbon-trading',
    category: 'Markets & Financing',
  },

  // ── Green Assets ────────────────────────────────────────────────────────────
  {
    name: 'Green Building Certification',
    ctaText: 'Explore Certification Support',
    ctaHref: '/solutions',
    category: 'Green Assets',
  },

  // ── Platform ────────────────────────────────────────────────────────────────
  {
    name: 'Ploxi Earth Marketplace',
    ctaText: 'Book Platform Demo',
    ctaHref: 'https://calendly.com/dhwani-sg/30min',
    ctaExternal: true,
    category: 'Platform',
  },
  {
    name: 'Download Document',
    ctaText: 'Download Event Videos, Whitepapers & Reports',
    ctaHref: '/resources',
    category: 'Platform',
  },
];

// ─── Events Menu ───────────────────────────────────────────────────────────────
export const EVENTS_MENU: MegaMenuItem[] = [
  {
    title: 'Upcoming Events',
    description: 'Discover sustainability conferences, workshops and webinars.',
    // href: '/events/upcoming',
  },
  {
    title: 'Completed Events',
    description: 'Browse past events and access recorded sessions.',
    // href: '/events/completed',
  },
  {
    title: 'Blogs',
    href: 'https://www.ploxiconsult.com/blog.html',
    description: 'Insights, research and sustainability thought leadership.',
    external: true,
  },
];
