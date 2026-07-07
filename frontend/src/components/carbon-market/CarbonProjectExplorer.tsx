'use client';
import { useState, useMemo, useCallback } from 'react';
import {
  CARBON_PROJECTS, getFilterOptions, filterAndSort,
  type CarbonProject, type ProjectFilters,
} from '@/lib/carbonMarketData';
import CarbonProjectCard from './CarbonProjectCard';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

const PAGE_SIZE = 18;

interface ExplorerProps {
  onViewDetails: (p: CarbonProject) => void;
  onEnquire: (p: CarbonProject) => void;
}

const SORT_OPTIONS: { value: ProjectFilters['sortBy']; label: string }[] = [
  { value: 'title',   label: 'Project Name' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'volume',  label: 'Volume' },
  { value: 'country', label: 'Country' },
];

function FilterSelect({
  id, label, value, options, onChange,
}: {
  id: string; label: string; value: string;
  options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
      >
        <option value="">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function CarbonProjectExplorer({ onViewDetails, onEnquire }: ExplorerProps) {
  const opts = useMemo(() => getFilterOptions(CARBON_PROJECTS), []);

  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [creditType, setCreditType] = useState('');
  const [registry, setRegistry]   = useState('');
  const [country, setCountry]     = useState('');
  const [source, setSource]       = useState('');
  const [status, setStatus]       = useState('');
  const [sortBy, setSortBy]       = useState<ProjectFilters['sortBy']>('title');
  const [sortDir, setSortDir]     = useState<'asc'|'desc'>('asc');
  const [page, setPage]           = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: ProjectFilters = { search, category, creditType, registry, country, source, status, sortBy, sortDir };

  const results = useMemo(() => filterAndSort(CARBON_PROJECTS, filters), [
    search, category, creditType, registry, country, source, status, sortBy, sortDir,
  ]);

  const displayed = useMemo(() => results.slice(0, page * PAGE_SIZE), [results, page]);
  const hasMore    = displayed.length < results.length;

  const activeFilters = [
    category && { key: 'category', label: category, clear: () => setCategory('') },
    creditType && { key: 'creditType', label: creditType, clear: () => setCreditType('') },
    registry && { key: 'registry', label: registry, clear: () => setRegistry('') },
    country && { key: 'country', label: country, clear: () => setCountry('') },
    source && { key: 'source', label: source, clear: () => setSource('') },
    status && { key: 'status', label: status, clear: () => setStatus('') },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const clearAll = useCallback(() => {
    setSearch(''); setCategory(''); setCreditType(''); setRegistry('');
    setCountry(''); setSource(''); setStatus(''); setPage(1);
  }, []);

  function onSearchChange(v: string) { setSearch(v); setPage(1); }
  function onFilter<T>(setter: (v: T) => void) { return (v: T) => { setter(v); setPage(1); }; }

  return (
    <section id="carbon-portfolio" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Portfolio Explorer</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Carbon Credit Portfolio</h2>
        </div>

        {/* Search + Filter toggle row */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="portfolio-search"
              type="search"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search by project name, ID, country, category, or registry…"
              className="input-field pl-10 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <select
                id="portfolio-sort"
                value={sortBy}
                onChange={e => { setSortBy(e.target.value as ProjectFilters['sortBy']); setPage(1); }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 shadow-sm focus:outline-none"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 hover:bg-gray-50"
                title={sortDir === 'asc' ? 'Sort descending' : 'Sort ascending'}
              >
                {sortDir === 'asc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            </div>

            {/* Filter toggle (mobile) */}
            <button
              id="portfolio-filter-toggle"
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold shadow-sm transition lg:hidden ${
                filtersOpen ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter sidebar — desktop always visible, mobile collapsible */}
          <aside
            className={`shrink-0 lg:block ${filtersOpen ? 'block' : 'hidden'} w-full lg:w-52`}
            aria-label="Project filters"
          >
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Filters</p>
                {activeFilters.length > 0 && (
                  <button onClick={clearAll} className="text-[10px] font-semibold text-primary-600 hover:text-primary-800">
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <FilterSelect id="f-category"   label="Category"   value={category}   options={opts.categories}   onChange={onFilter(setCategory)} />
                <FilterSelect id="f-creditType" label="Credit Type" value={creditType} options={opts.creditTypes}  onChange={onFilter(setCreditType)} />
                <FilterSelect id="f-registry"   label="Registry"   value={registry}   options={opts.registries}   onChange={onFilter(setRegistry)} />
                <FilterSelect id="f-country"    label="Country"    value={country}    options={opts.countries}    onChange={onFilter(setCountry)} />
                <FilterSelect id="f-source"     label="Source"     value={source}     options={opts.sources}      onChange={onFilter(setSource)} />
                <FilterSelect id="f-status"     label="Status"     value={status}     options={opts.statuses}     onChange={onFilter(setStatus)} />
              </div>
            </div>
          </aside>

          {/* Main grid */}
          <div className="min-w-0 flex-1">
            {/* Active filters + result count */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                {results.length} project{results.length !== 1 ? 's' : ''}
              </span>
              {activeFilters.map(af => (
                <button
                  key={af.key}
                  onClick={af.clear}
                  className="flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary-700 hover:bg-primary-100"
                >
                  {af.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>

            {/* Grid */}
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-200 py-20 text-center">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">No projects found</p>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                </div>
                <button onClick={clearAll} className="btn-outline text-sm">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {displayed.map(p => (
                    <CarbonProjectCard
                      key={p.id}
                      project={p}
                      onViewDetails={onViewDetails}
                      onEnquire={onEnquire}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      id="portfolio-load-more"
                      onClick={() => setPage(n => n + 1)}
                      className="btn-outline"
                    >
                      Load More ({results.length - displayed.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
