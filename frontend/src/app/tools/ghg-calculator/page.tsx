'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ghgService } from '@/services/consultant.service';

interface ScopeResults { scope1: number; scope2: number; scope3: number; total: number }

const field = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors';

function ScopeTag({ color, label }: { color: string; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

function InputGroup({ label, unit, val, set }: { label: string; unit: string; val: string; set: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          className={field}
          type="number" min="0"
          value={val}
          onChange={(e) => set(e.target.value)}
          placeholder="0"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">{unit}</span>
      </div>
    </div>
  );
}

export default function GHGCalculatorPage() {
  const [companyName, setCompanyName] = useState('');
  const [reportingYear, setReportingYear] = useState(new Date().getFullYear());
  const [results, setResults] = useState<ScopeResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeScope, setActiveScope] = useState<1 | 2 | 3>(1);

  // Scope 1
  const [naturalGas, setNaturalGas] = useState('');
  const [dieselStat, setDieselStat] = useState('');
  const [coal, setCoal] = useState('');
  const [petrol, setPetrol] = useState('');
  const [dieselMob, setDieselMob] = useState('');
  const [refrigerant, setRefrigerant] = useState('');

  // Scope 2
  const [electricity, setElectricity] = useState('');
  const [heat, setHeat] = useState('');

  // Scope 3
  const [airTravel, setAirTravel] = useState('');
  const [roadTravel, setRoadTravel] = useState('');
  const [commute, setCommute] = useState('');
  const [waste, setWaste] = useState('');
  const [goods, setGoods] = useState('');

  const handleCalculate = async () => {
    setLoading(true); setError('');
    const payload = {
      companyName, reportingYear,
      sessionId: `anon_${Date.now()}`,
      scope1: {
        stationaryCombustion: {
          naturalGas: { value: Number(naturalGas) || 0 },
          diesel: { value: Number(dieselStat) || 0 },
          coal: { value: Number(coal) || 0 },
        },
        mobileCombustion: {
          petrol: { value: Number(petrol) || 0 },
          diesel: { value: Number(dieselMob) || 0 },
        },
        fugitiveEmissions: { refrigerantLeakage: { value: Number(refrigerant) || 0 } },
      },
      scope2: {
        purchasedElectricity: { value: Number(electricity) || 0 },
        purchasedHeat: { value: Number(heat) || 0 },
      },
      scope3: {
        businessTravel: {
          airTravel: { value: Number(airTravel) || 0 },
          roadTravel: { value: Number(roadTravel) || 0 },
        },
        employeeCommute: { value: Number(commute) || 0 },
        wasteGenerated: { value: Number(waste) || 0 },
        purchasedGoods: { value: Number(goods) || 0 },
      },
    };
    try {
      const res = await ghgService.calculate(payload);
      setResults(res.data.data);
    } catch {
      setError('Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pct = (v: number) => results && results.total > 0 ? ((v / results.total) * 100).toFixed(1) : '0';

  const scopes = [
    { id: 1 as const, label: 'Scope 1', sublabel: 'Direct Emissions', tag: 'bg-red-100 text-red-700', dot: 'bg-red-500', ring: 'ring-red-200', active: 'bg-red-600 text-white', inactive: 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200' },
    { id: 2 as const, label: 'Scope 2', sublabel: 'Indirect Energy', tag: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', ring: 'ring-amber-200', active: 'bg-amber-500 text-white', inactive: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200' },
    { id: 3 as const, label: 'Scope 3', sublabel: 'Value Chain', tag: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-200', active: 'bg-emerald-600 text-white', inactive: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200' },
  ];
  const current = scopes.find((s) => s.id === activeScope)!;

  return (
    <div className="min-h-screen bg-[#f5f6f8]">

      {/* ── Sticky nav ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Left — Ploxi brand identity */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={32} height={32} className="rounded-full ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all" />
            <div className="leading-none">
              <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Ploxi Earth</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Decarbonisation Platform</p>
            </div>
          </Link>

          {/* Centre — tool name as a Ploxi product */}
          <div className="order-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 sm:order-none sm:w-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">GHG Calculator</span>
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 border-l border-gray-200 pl-2 ml-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />S1
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-1" />S2
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />S3
            </span>
          </div>

          {/* Right — platform context link */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              Back to Platform
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero banner ── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 text-white py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <Image src="/images/logo.jpeg" alt="" width={14} height={14} className="rounded-full opacity-80" />
            Ploxi Earth · GHG Protocol Aligned Tool
          </div>
          <h1 className="text-balance mb-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Ploxi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">GHG Emissions</span> Calculator
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-2">
            Measure your organisation&apos;s carbon footprint across all three scopes — built on GHG Protocol standards with IPCC AR6 GWP values.
          </p>
          <p className="text-emerald-400/70 text-xs mb-8">Part of the Ploxi Decarbonisation Suite · Free to use</p>
          {/* Scope pills overview */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { dot: 'bg-red-400', label: 'Scope 1 — Direct Emissions' },
              { dot: 'bg-amber-400', label: 'Scope 2 — Indirect Energy' },
              { dot: 'bg-emerald-400', label: 'Scope 3 — Value Chain' },
            ].map((p) => (
              <span key={p.label} className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-2 rounded-full">
                <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-6">

        {/* Organisation Details */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Organisation Details</h2>
              <p className="text-xs text-gray-400">Identify your reporting entity and period</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Company / Organisation Name</label>
              <input className={field} value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Acme Corporation" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Reporting Year</label>
              <input className={field} type="number" value={reportingYear} onChange={(e) => setReportingYear(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Scope Tab Switcher */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
          {/* Tab bar */}
          <div className="grid grid-cols-3 border-b border-gray-100">
            {scopes.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScope(s.id)}
                className={`py-4 px-2 flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 ${activeScope === s.id ? `${s.active} shadow-none` : `${s.inactive} border-none`}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeScope === s.id ? 'bg-white/20' : ''}`}>{s.id}</span>
                <span>{s.label}</span>
                <span className={`font-normal hidden sm:block ${activeScope === s.id ? 'opacity-75' : 'text-gray-400'}`}>{s.sublabel}</span>
              </button>
            ))}
          </div>

          {/* Scope content */}
          <div className="p-6">

            {/* ── SCOPE 1 ── */}
            {activeScope === 1 && (
              <div className="space-y-7">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Scope 1 — Direct Emissions</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Emissions from sources directly owned or controlled by your organisation</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stationary Combustion</span>
                    <span className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputGroup label="Natural Gas" unit="MMBtu" val={naturalGas} set={setNaturalGas} />
                    <InputGroup label="Diesel" unit="Litres" val={dieselStat} set={setDieselStat} />
                    <InputGroup label="Coal" unit="Tonnes" val={coal} set={setCoal} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Combustion</span>
                    <span className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="Petrol" unit="Litres" val={petrol} set={setPetrol} />
                    <InputGroup label="Diesel" unit="Litres" val={dieselMob} set={setDieselMob} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fugitive Emissions</span>
                    <span className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="max-w-xs">
                    <InputGroup label="Refrigerant Leakage" unit="kg R-22" val={refrigerant} set={setRefrigerant} />
                  </div>
                </div>

                <button onClick={() => setActiveScope(2)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                  Next: Scope 2 — Indirect Energy
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {/* ── SCOPE 2 ── */}
            {activeScope === 2 && (
              <div className="space-y-7">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Scope 2 — Indirect Energy Emissions</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Emissions from purchased electricity, heat and steam</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchased Energy</span>
                    <span className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="Purchased Electricity" unit="kWh" val={electricity} set={setElectricity} />
                    <InputGroup label="Purchased Heat / Steam" unit="GJ" val={heat} set={setHeat} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button onClick={() => setActiveScope(1)} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                    Back to Scope 1
                  </button>
                  <button onClick={() => setActiveScope(3)} className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                    Next: Scope 3 — Value Chain
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* ── SCOPE 3 ── */}
            {activeScope === 3 && (
              <div className="space-y-7">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Scope 3 — Value Chain Emissions</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Indirect emissions across your upstream and downstream value chain</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Travel & Commute</span>
                    <span className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputGroup label="Air Travel" unit="km" val={airTravel} set={setAirTravel} />
                    <InputGroup label="Road Travel" unit="km" val={roadTravel} set={setRoadTravel} />
                    <InputGroup label="Employee Commute" unit="km/yr" val={commute} set={setCommute} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Supply Chain</span>
                    <span className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="Waste Generated" unit="tonnes" val={waste} set={setWaste} />
                    <InputGroup label="Purchased Goods & Services" unit="₹ millions" val={goods} set={setGoods} />
                  </div>
                </div>

                <button onClick={() => setActiveScope(2)} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                  Back to Scope 2
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Calculate CTA */}
        <button
          className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-base py-4 rounded-2xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Calculating Emissions…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              Calculate Total GHG Emissions
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </>
          )}
        </button>

        {/* ── Results ── */}
        {results && (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
            {/* Results header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-6 text-center text-white sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Total Estimated Emissions</p>
              <p className="text-5xl font-extrabold tracking-tight sm:text-6xl">{results.total.toFixed(2)}</p>
              <p className="text-emerald-400 text-sm font-medium mt-1">tCO₂e · {companyName || 'Your Organisation'} · {reportingYear}</p>
            </div>

            <div className="space-y-8 p-5 sm:p-8">
              {/* Scope cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Scope 1', sub: 'Direct', value: results.scope1, dot: 'bg-red-500', border: 'border-red-100', text: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Scope 2', sub: 'Indirect Energy', value: results.scope2, dot: 'bg-amber-500', border: 'border-amber-100', text: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Scope 3', sub: 'Value Chain', value: results.scope3, dot: 'bg-emerald-500', border: 'border-emerald-100', text: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} p-5 text-center`}>
                    <ScopeTag color={`${s.bg} ${s.text}`} label={`${s.label} · ${s.sub}`} />
                    <p className="text-3xl font-extrabold text-gray-900 mt-3">{s.value.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">tCO₂e</p>
                    <p className={`text-lg font-bold mt-2 ${s.text}`}>{pct(s.value)}%</p>
                    <p className="text-xs text-gray-400">of total</p>
                  </div>
                ))}
              </div>

              {/* Stacked bar */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Emissions Breakdown</p>
                <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
                  {[
                    { value: results.scope1, color: 'bg-red-500' },
                    { value: results.scope2, color: 'bg-amber-400' },
                    { value: results.scope3, color: 'bg-emerald-500' },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`${s.color} transition-all duration-700 first:rounded-l-full last:rounded-r-full`}
                      style={{ width: `${pct(s.value)}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between">
                  {[
                    { label: 'Scope 1', color: 'bg-red-500', value: results.scope1 },
                    { label: 'Scope 2', color: 'bg-amber-400', value: results.scope2 },
                    { label: 'Scope 3', color: 'bg-emerald-500', value: results.scope3 },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.label} · {pct(s.value)}%
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual progress bars */}
              <div className="space-y-4">
                {[
                  { label: 'Scope 1 — Direct Emissions', value: results.scope1, bar: 'bg-red-500', text: 'text-red-600' },
                  { label: 'Scope 2 — Indirect Energy', value: results.scope2, bar: 'bg-amber-400', text: 'text-amber-600' },
                  { label: 'Scope 3 — Value Chain', value: results.scope3, bar: 'bg-emerald-500', text: 'text-emerald-600' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="mb-1.5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs font-medium text-gray-600">{s.label}</span>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-xs font-bold ${s.text}`}>{pct(s.value)}%</span>
                        <span className="text-xs text-gray-400">{s.value.toFixed(2)} tCO₂e</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bar} rounded-full transition-all duration-700`} style={{ width: `${pct(s.value)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footnote */}
              <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <p className="text-xs text-gray-400">
                  Emission factors based on India CEA 2023 grid factor (0.82 kg CO₂e / kWh) and IPCC AR6 GWP values. For internal estimation purposes only.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
