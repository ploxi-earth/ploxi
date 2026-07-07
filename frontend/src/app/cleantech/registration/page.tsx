'use client';
import { useState } from 'react';
import Link from 'next/link';
import { cleantechService } from '@/services/vendor.service';

const SOLUTION_TYPES = [
  'Solar Energy', 'Wind Energy', 'Energy Storage', 'Green Hydrogen',
  'Carbon Capture', 'EV & Mobility', 'Water Treatment', 'Waste Management',
  'Smart Buildings', 'Green Finance', 'Agri-Tech', 'Other',
];
const INDUSTRIES = [
  'Manufacturing', 'Real Estate', 'Agriculture', 'Transportation',
  'Utilities', 'Finance', 'Healthcare', 'Education', 'IT / Data Center',
  'Hospitality', 'Retail', 'Logistics', 'Automotive', 'Steel',
  'Cement', 'Chemicals', 'Oil & Gas', 'Pharmaceuticals',
];
const REGIONS = [
  { flag: '🇮🇳', label: 'India' }, { flag: '🇺🇸', label: 'United States' },
  { flag: '🇪🇺', label: 'European Union' }, { flag: '🇦🇪', label: 'United Arab Emirates' },
  { flag: '🇬🇧', label: 'United Kingdom' }, { flag: '🌏', label: 'Southeast Asia' },
  { flag: '🌍', label: 'Africa' }, { flag: '🌎', label: 'South America' },
  { flag: '🇦🇺', label: 'Australia' }, { flag: '🌐', label: 'Other' },
];

export default function CleantechRegistrationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const [form, setForm] = useState({
    companyName: '', website: '', solutionType: '',
    targetIndustries: [] as string[], geographicRegions: [] as string[],
    contactName: '', contactEmail: '', companyDescription: '',
    revenueStage: '', teamSize: '', fundingStatus: '',
    keyDifferentiators: '', partnershipGoals: [] as string[],
  });

  const update = (field: string, value: unknown) => setForm((p) => ({ ...p, [field]: value }));
  const toggleArray = (field: string, value: string) => {
    const current = form[field as keyof typeof form] as string[];
    update(field, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      await cleantechService.register(form);
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
          <p className="text-gray-500 mb-6">Thank you! Our team will review your clean tech profile and get in touch shortly.</p>
          <Link href="/" className="btn-primary w-full justify-center">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 pt-8">
        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className={`flex items-center gap-2 ${s < step ? 'opacity-100' : s === step ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s ? '✓' : s}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {s === 1 ? 'Company Info' : 'Requirements'}
              </span>
              {s === 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
          <span className="text-xs text-gray-400 ml-auto">Step {step} of 2</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Company Information</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us about your clean tech business</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Company Name *</label>
                    <input className="input-field" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="GreenTech Solutions" />
                  </div>
                  <div>
                    <label className="label">Website</label>
                    <input className="input-field" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://example.com" />
                  </div>
                </div>
                <div>
                  <label className="label">Solution Type *</label>
                  <select className="input-field" value={form.solutionType} onChange={(e) => update('solutionType', e.target.value)}>
                    <option value="">Select type</option>
                    {SOLUTION_TYPES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Target Industries *</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {INDUSTRIES.map((i) => (
                      <button key={i} type="button" onClick={() => toggleArray('targetIndustries', i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.targetIndustries.includes(i) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Geographic Regions *</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {REGIONS.map((r) => (
                      <button key={r.label} type="button" onClick={() => toggleArray('geographicRegions', r.label)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.geographicRegions.includes(r.label) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                        {r.flag} {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Point of Contact: Name *</label>
                    <input className="input-field" value={form.contactName} onChange={(e) => update('contactName', e.target.value)} placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="label">Point of Contact: Email *</label>
                    <input className="input-field" type="email" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} placeholder="jane@company.com" />
                  </div>
                </div>
                <div>
                  <label className="label">Brief About the Company * <span className="text-gray-400 font-normal">(Minimum 100 characters)</span></label>
                  <textarea
                    className="input-field h-28 resize-none"
                    maxLength={1000}
                    value={form.companyDescription}
                    onChange={(e) => { update('companyDescription', e.target.value); setCharCount(e.target.value.length); }}
                    placeholder="Describe your company, technology, and impact..."
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{charCount}/1000</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => setStep(2)}
                  disabled={!form.companyName || !form.solutionType || !form.contactName || !form.contactEmail || form.companyDescription.length < 100}
                >
                  Next: Requirements
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Requirements</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us about your business stage and goals</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Revenue Stage</label>
                    <select className="input-field" value={form.revenueStage} onChange={(e) => update('revenueStage', e.target.value)}>
                      <option value="">Select stage</option>
                      <option>Pre-revenue</option>
                      <option>Early Revenue (&lt; ₹1 Cr)</option>
                      <option>Growth (₹1–10 Cr)</option>
                      <option>Scale (₹10 Cr+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Team Size</label>
                    <select className="input-field" value={form.teamSize} onChange={(e) => update('teamSize', e.target.value)}>
                      <option value="">Select range</option>
                      <option>1 – 10</option>
                      <option>11 – 50</option>
                      <option>51 – 200</option>
                      <option>200+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Funding Status</label>
                  <select className="input-field" value={form.fundingStatus} onChange={(e) => update('fundingStatus', e.target.value)}>
                    <option value="">Select status</option>
                    <option>Bootstrapped</option>
                    <option>Angel / Pre-seed</option>
                    <option>Seed</option>
                    <option>Series A+</option>
                    <option>Grant Funded</option>
                  </select>
                </div>
                <div>
                  <label className="label">Key Differentiators</label>
                  <textarea className="input-field h-24 resize-none" value={form.keyDifferentiators} onChange={(e) => update('keyDifferentiators', e.target.value)} placeholder="What makes your solution unique?" />
                </div>
              </div>
              {error && <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
              <div className="mt-8 flex gap-3">
                <button className="btn-outline flex-1" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary flex-1 inline-flex items-center justify-center gap-2" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : <>Submit Registration <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
