'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type CarbonProject } from '@/lib/carbonMarketData';
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface CreditRequirementFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefillProject?: CarbonProject | null;
}

interface FormData {
  fullName: string;
  workEmail: string;
  company: string;
  country: string;
  estimatedCredits: string;
  preferredCategory: string;
  preferredRegistry: string;
  preferredVintage: string;
  additionalRequirements: string;
}

const INITIAL: FormData = {
  fullName: '', workEmail: '', company: '', country: '',
  estimatedCredits: '', preferredCategory: '', preferredRegistry: '',
  preferredVintage: '', additionalRequirements: '',
};

const CATEGORIES = [
  'Cookstoves', 'Afforestation (Mahogany)', 'Biogas/Biogas CNG',
  'Renewable Electricity', 'Wind Power', 'Reduction', 'Removal', 'Reduction/Avoidance',
];

const REGISTRIES = [
  'Gold Standard', 'VCS (Verra)', 'CDM (UNFCCC)', 'ICR', 'GCR', 'GCC',
  'Any / No Preference',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function CreditRequirementForm({ isOpen, onClose, prefillProject }: CreditRequirementFormProps) {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen) { setForm(INITIAL); setErrors({}); setStatus('idle'); setServerError(''); }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.workEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.workEmail))
      e.workEmail = 'A valid work email is required.';
    if (!form.company.trim()) e.company = 'Company name is required.';
    if (!form.country.trim()) e.country = 'Country is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setServerError('');
    try {
      const payload = {
        full_name: form.fullName.trim(),
        work_email: form.workEmail.trim().toLowerCase(),
        company: form.company.trim(),
        country: form.country.trim(),
        estimated_credits: form.estimatedCredits.trim() || null,
        preferred_category: form.preferredCategory || null,
        preferred_registry: form.preferredRegistry || null,
        preferred_vintage: form.preferredVintage.trim() || null,
        additional_requirements: form.additionalRequirements.trim() || null,
        project_id: prefillProject?.id ?? null,
        project_title: prefillProject?.title ?? null,
        submitted_at: new Date().toISOString(),
      };
      const res = await fetch('/api/partners/carbon-market/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Submission failed.');
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  function field(
    id: keyof FormData,
    label: string,
    type = 'text',
    placeholder = '',
    required = false,
  ) {
    return (
      <div>
        <label htmlFor={`form-${id}`} className="label">
          {label}{required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <input
          id={`form-${id}`}
          type={type}
          value={form[id]}
          onChange={ev => setForm(f => ({ ...f, [id]: ev.target.value }))}
          placeholder={placeholder}
          className={`input-field ${errors[id] ? 'input-error' : ''}`}
        />
        {errors[id] && <p className="mt-1 text-xs text-red-600">{errors[id]}</p>}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[300] bg-slate-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-[310] flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-slate-950 px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Credit Sourcing</p>
                <h2 className="text-sm font-bold text-white">Submit Credit Requirement</h2>
                {prefillProject && (
                  <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{prefillProject.title}</p>
                )}
              </div>
              <button
                onClick={onClose}
                id="form-close-btn"
                className="rounded-xl border border-white/15 p-1.5 text-white/70 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto mobile-scroll px-5 py-5">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Requirement Submitted</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Thank you. Our carbon market team will review your requirements and be in touch shortly.
                    </p>
                  </div>
                  <button onClick={onClose} className="btn-primary mt-4">Close</button>
                </div>
              ) : (
                <form id="credit-requirement-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {prefillProject && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Project of Interest</p>
                      <p className="mt-0.5 text-xs font-semibold text-gray-800 line-clamp-2">{prefillProject.title}</p>
                      <p className="text-[10px] text-gray-500">{prefillProject.id}</p>
                    </div>
                  )}

                  {field('fullName',  'Full Name', 'text', 'Jane Smith', true)}
                  {field('workEmail', 'Work Email', 'email', 'jane@company.com', true)}
                  {field('company',   'Company', 'text', 'Acme Corp', true)}
                  {field('country',   'Country', 'text', 'India', true)}
                  {field('estimatedCredits', 'Estimated Credit Requirement (tCO₂e)', 'text', 'e.g. 50,000')}

                  <div>
                    <label htmlFor="form-preferredCategory" className="label">Preferred Project Category</label>
                    <select
                      id="form-preferredCategory"
                      value={form.preferredCategory}
                      onChange={ev => setForm(f => ({ ...f, preferredCategory: ev.target.value }))}
                      className="input-field"
                    >
                      <option value="">Any / No Preference</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="form-preferredRegistry" className="label">Preferred Registry / Standard</label>
                    <select
                      id="form-preferredRegistry"
                      value={form.preferredRegistry}
                      onChange={ev => setForm(f => ({ ...f, preferredRegistry: ev.target.value }))}
                      className="input-field"
                    >
                      <option value="">Any / No Preference</option>
                      {REGISTRIES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  {field('preferredVintage', 'Preferred Vintage', 'text', 'e.g. 2022–2024')}

                  <div>
                    <label htmlFor="form-additionalRequirements" className="label">Additional Requirements</label>
                    <textarea
                      id="form-additionalRequirements"
                      rows={3}
                      value={form.additionalRequirements}
                      onChange={ev => setForm(f => ({ ...f, additionalRequirements: ev.target.value }))}
                      placeholder="CORSIA eligibility, geography preference, delivery timeline..."
                      className="input-field resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {serverError}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="form-submit-btn"
                    disabled={status === 'loading'}
                    className="btn-primary w-full gap-2 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</>
                    ) : (
                      <><Send className="h-4 w-4" />Submit Credit Requirement</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
