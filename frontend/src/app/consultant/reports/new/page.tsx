'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { consultantService } from '@/services/consultant.service';

type Section = 'energy' | 'water' | 'waste' | 'emissions' | 'social' | 'governance';
const SECTIONS: Array<{ key: Section; label: string; icon: string }> = [
  { key: 'energy', label: 'Energy', icon: '⚡' },
  { key: 'water', label: 'Water', icon: '💧' },
  { key: 'waste', label: 'Waste', icon: '♻️' },
  { key: 'emissions', label: 'Emissions', icon: '🌫️' },
  { key: 'social', label: 'Social', icon: '👥' },
  { key: 'governance', label: 'Governance', icon: '⚖️' },
];

const ENERGY_FIELDS = [
  { key: 'totalEnergyConsumption', label: 'Total Energy Consumption (GJ)' },
  { key: 'renewableEnergyPercentage', label: 'Renewable Energy (%)' },
  { key: 'electricityConsumption', label: 'Electricity Consumption (kWh)' },
];
const WATER_FIELDS = [
  { key: 'totalWaterWithdrawal', label: 'Total Water Withdrawal (m³)' },
  { key: 'waterRecycled', label: 'Water Recycled (m³)' },
];
const WASTE_FIELDS = [
  { key: 'totalWasteGenerated', label: 'Total Waste Generated (tonnes)' },
  { key: 'wasteRecycled', label: 'Waste Recycled (tonnes)' },
  { key: 'wasteDisposedToLandfill', label: 'Waste to Landfill (tonnes)' },
];
const EMISSIONS_FIELDS = [
  { key: 'scope1Emissions', label: 'Scope 1 Emissions (tCO₂e)' },
  { key: 'scope2Emissions', label: 'Scope 2 Emissions (tCO₂e)' },
  { key: 'scope3Emissions', label: 'Scope 3 Emissions (tCO₂e)' },
];
const SOCIAL_FIELDS = [
  { key: 'totalEmployees', label: 'Total Employees' },
  { key: 'femaleEmployeePercentage', label: 'Female Employees (%)' },
  { key: 'employeeTurnoverRate', label: 'Employee Turnover Rate (%)' },
  { key: 'trainingHoursPerEmployee', label: 'Training Hours / Employee' },
];
const GOVERNANCE_FIELDS = [
  { key: 'boardSize', label: 'Board Size' },
  { key: 'independentDirectorsPercentage', label: 'Independent Directors (%)' },
  { key: 'womenOnBoardPercentage', label: 'Women on Board (%)' },
];

const SECTION_FIELDS: Record<Section, Array<{ key: string; label: string }>> = {
  energy: ENERGY_FIELDS, water: WATER_FIELDS, waste: WASTE_FIELDS,
  emissions: EMISSIONS_FIELDS, social: SOCIAL_FIELDS, governance: GOVERNANCE_FIELDS,
};

export default function NewReportPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('energy');
  const [title, setTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('');
  const [data, setData] = useState<Record<string, Record<string, string>>>({
    energy: {}, water: {}, waste: {}, emissions: {}, social: {}, governance: {},
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (section: Section, key: string, value: string) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const buildPayload = () => ({
    title, reportingPeriod,
    energyData: Object.fromEntries(Object.entries(data.energy).map(([k, v]) => [k, Number(v) || 0])),
    waterData: Object.fromEntries(Object.entries(data.water).map(([k, v]) => [k, Number(v) || 0])),
    wasteData: Object.fromEntries(Object.entries(data.waste).map(([k, v]) => [k, Number(v) || 0])),
    emissionsData: Object.fromEntries(Object.entries(data.emissions).map(([k, v]) => [k, Number(v) || 0])),
    socialData: Object.fromEntries(Object.entries(data.social).map(([k, v]) => [k, Number(v) || 0])),
    governanceData: Object.fromEntries(Object.entries(data.governance).map(([k, v]) => [k, Number(v) || 0])),
  });

  const handleSave = async (submit = false) => {
    if (!title) { setError('Report title is required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await consultantService.createReport(buildPayload());
      const id = res.data.data._id;
      if (submit) await consultantService.submitReport(id);
      router.push(`/consultant/reports/${id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to save report.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/consultant" className="text-sm text-gray-500 hover:text-gray-700">← Reports</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Sustainability Report</h1>
      </div>

      {/* Meta */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Report Details</h2>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Report Title *</label>
            <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="FY 2025 Sustainability Report" />
          </div>
          <div>
            <label className="label">Reporting Period</label>
            <input className="input-field" value={reportingPeriod} onChange={(e) => setReportingPeriod(e.target.value)} placeholder="FY 2025 (Apr 2024 – Mar 2025)" />
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {SECTIONS.map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === s.key ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>
            <span>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      {/* Section inputs */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 capitalize">{activeSection} Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SECTION_FIELDS[activeSection].map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input className="input-field" type="number" min="0" value={data[activeSection][f.key] || ''} onChange={(e) => updateField(activeSection, f.key, e.target.value)} placeholder="0" />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline">
          {saving ? 'Saving…' : 'Save as Draft'}
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary">
          {saving ? 'Submitting…' : 'Save & Submit'}
        </button>
      </div>
    </div>
  );
}
