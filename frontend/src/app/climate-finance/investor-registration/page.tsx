'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import FormPageHeader from '@/components/FormPageHeader';
import { climateFinanceService } from '@/services/vendor.service';
import OTPModal from '@/components/OTPModal';

type InvestorForm = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  linkedIn: string;
  designation: string;
  organizationName: string;
  fundName: string;
  organizationType: string;
  fundSize: string;
  fundSizeRange: string;
  aum: string;
  fundVintage: string;
  website: string;
  sectors: string[];
  investmentStages: string[];
  geographicFocus: string[];
  typicalTicketSize: string;
  minInvestment: string;
  maxInvestment: string;
  financingTypes: string[];
  investmentStructures: string[];
  esgFocus: string[];
  impactMetrics: string[];
  certifications: string[];
  sdgAlignment: string[];
  investmentCriteria: string;
  portfolioCompanies: string;
  recentInvestments: string;
  valueAdd: string;
  decisionTimeline: string;
  dueDiligenceProcess: string;
};

const ORG_TYPES = ['Venture Capital', 'Private Equity', 'Family Office', 'Angel Network', 'Corporate VC', 'Impact Fund', 'Other'];
const SECTORS = ['Solar', 'Wind', 'EV & Mobility', 'Green Hydrogen', 'Carbon Markets', 'Agri-Tech', 'Water', 'Waste'];
const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B/C', 'Growth', 'Late Stage', 'Project Finance'];
const GEO = ['India', 'Southeast Asia', 'Middle East', 'Africa', 'Europe', 'North America', 'Global'];
const FINANCING = ['Equity', 'Debt', 'Convertible Notes', 'SAFE', 'Revenue-Based Financing', 'Green Bonds', 'Project Finance'];
const STRUCTURES = ['Direct Investment', 'Co-Investment', 'Fund of Funds', 'SPV', 'Syndicate', 'Joint Venture'];
const ESG = ['Carbon Reduction', 'Clean Energy Transition', 'Circular Economy', 'Water Conservation', 'Biodiversity', 'Social Impact'];
const METRICS = ['CO2 Reduced', 'MW Installed', 'Water Saved', 'Waste Diverted', 'Jobs Created'];
const CERTS = ['B Corp', 'PRI Signatory', 'TCFD', 'SBTi', 'ISO 14001'];
const SDGS = ['SDG 7', 'SDG 9', 'SDG 11', 'SDG 12', 'SDG 13', 'SDG 17'];

function initialForm(email = ''): InvestorForm {
  return {
    email,
    firstName: '',
    lastName: '',
    phone: '',
    linkedIn: '',
    designation: '',
    organizationName: '',
    fundName: '',
    organizationType: '',
    fundSize: '',
    fundSizeRange: '',
    aum: '',
    fundVintage: '',
    website: '',
    sectors: [],
    investmentStages: [],
    geographicFocus: [],
    typicalTicketSize: '',
    minInvestment: '',
    maxInvestment: '',
    financingTypes: [],
    investmentStructures: [],
    esgFocus: [],
    impactMetrics: [],
    certifications: [],
    sdgAlignment: [],
    investmentCriteria: '',
    portfolioCompanies: '',
    recentInvestments: '',
    valueAdd: '',
    decisionTimeline: '',
    dueDiligenceProcess: '',
  };
}

export default function InvestorRegistrationPage() {
  const router = useRouter();
  const search = useSearchParams();
  const prefilledEmail = (search.get('email') || '').trim();
  const verifiedFlag = search.get('verified') === '1';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(verifiedFlag);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [form, setForm] = useState<InvestorForm>(initialForm(prefilledEmail));

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('investor-otp-prefill');
      if (!raw) return;
      const data = JSON.parse(raw) as { email?: string; fullName?: string; phone?: string; organization?: string; website?: string };
      const names = String(data.fullName || '').trim().split(/\s+/).filter(Boolean);
      setForm((prev) => ({
        ...prev,
        email: data.email || prev.email || prefilledEmail,
        firstName: prev.firstName || names[0] || '',
        lastName: prev.lastName || names.slice(1).join(' '),
        phone: prev.phone || data.phone || '',
        organizationName: prev.organizationName || data.organization || '',
        website: prev.website || data.website || '',
      }));
    } catch {
      // ignore
    }
  }, [prefilledEmail]);

  const stepTitle = useMemo(
    () => ['Personal & Organization', 'Investment Preferences', 'ESG & Additional'][step - 1] || 'Investor Profile',
    [step]
  );

  const set = <K extends keyof InvestorForm>(k: K, v: InvestorForm[K]) => setForm((p) => ({ ...p, [k]: v }));
  const toggle = (k: keyof InvestorForm, value: string) => {
    const current = form[k] as string[];
    const next = current.includes(value) ? current.filter((x) => x !== value) : [...current, value];
    set(k as keyof InvestorForm, next as InvestorForm[keyof InvestorForm]);
  };

  const canStep1 =
    form.email.trim() &&
    form.firstName.trim() &&
    form.organizationName.trim();

  const onSubmit = async () => {
    if (!emailVerified) {
      setError('Please verify your email before submitting the investor profile.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await climateFinanceService.completeInvestorProfile({
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName || 'N/A',
        phone: form.phone,
        linkedin_url: form.linkedIn,
        designation: form.designation,
        organization_name: form.organizationName,
        fund_name: form.fundName,
        organization_type: form.organizationType || 'Other',
        fund_size: form.fundSize,
        fund_size_range: form.fundSizeRange,
        aum: form.aum,
        fund_vintage: form.fundVintage,
        website: form.website,
        sectors_of_interest: form.sectors,
        investment_stages: form.investmentStages,
        geographic_focus: form.geographicFocus,
        typical_ticket_size: form.typicalTicketSize,
        min_investment: form.minInvestment,
        max_investment: form.maxInvestment,
        financing_types: form.financingTypes,
        investment_structures: form.investmentStructures,
        esg_focus: form.esgFocus,
        impact_metrics: form.impactMetrics,
        certifications: form.certifications,
        sdg_alignment: form.sdgAlignment,
        investment_criteria: form.investmentCriteria,
        portfolio_companies: form.portfolioCompanies,
        recent_investments: form.recentInvestments,
        value_add: form.valueAdd,
        decision_timeline: form.decisionTimeline,
        due_diligence_process: form.dueDiligenceProcess,
      });
      try {
        sessionStorage.removeItem('investor-otp-prefill');
      } catch {
        // ignore
      }
      setDone(true);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (e as Error)?.message;
      setError(msg || 'Could not save investor profile.');
    } finally {
      setLoading(false);
    }
  };

  const sendInvestorOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await climateFinanceService.sendOtp('investor', form.email, {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        linkedIn: form.linkedIn,
        designation: form.designation,
        organizationName: form.organizationName,
        fundName: form.fundName,
        organizationType: form.organizationType,
        fundSize: form.fundSize,
        fundSizeRange: form.fundSizeRange,
        aum: form.aum,
        fundVintage: form.fundVintage,
        website: form.website,
        sectors: form.sectors,
        investmentStages: form.investmentStages,
        geographicFocus: form.geographicFocus,
        typicalTicketSize: form.typicalTicketSize,
        minInvestment: form.minInvestment,
        maxInvestment: form.maxInvestment,
        financingTypes: form.financingTypes,
        investmentStructures: form.investmentStructures,
        esgFocus: form.esgFocus,
        impactMetrics: form.impactMetrics,
        certifications: form.certifications,
        sdgAlignment: form.sdgAlignment,
        investmentCriteria: form.investmentCriteria,
        portfolioCompanies: form.portfolioCompanies,
        recentInvestments: form.recentInvestments,
        valueAdd: form.valueAdd,
        decisionTimeline: form.decisionTimeline,
        dueDiligenceProcess: form.dueDiligenceProcess,
      });
      setShowOtpModal(true);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (e as Error)?.message;
      setError(msg || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyInvestorOtp = async (otp: string) => {
    setIsVerifyingOtp(true);
    try {
      await climateFinanceService.verifyOtp('investor', form.email, otp);
      setShowOtpModal(false);
      setEmailVerified(true);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (e as Error)?.message;
      throw new Error(msg || 'Invalid OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendInvestorOtp = async () => {
    await climateFinanceService.sendOtp('investor', form.email, {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      organizationName: form.organizationName,
      website: form.website,
    });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Investor profile submitted</h2>
          <p className="mt-2 text-sm text-gray-600">Thank you. Your climate finance investor profile is now complete.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/" className="btn-outline flex-1 justify-center">Back Home</Link>
            <button type="button" className="btn-primary flex-1" onClick={() => router.push('/climate-finance')}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FormPageHeader backHref="/climate-finance/registration?type=investor" subtitle="Investor Registration" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        {!emailVerified && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Verify your email first</p>
            <p className="mt-1 text-sm text-amber-800">
              Send OTP, verify your email, then continue with the full investor profile.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Email *" value={form.email} onChange={(v) => set('email', v)} type="email" />
              <Input label="First name *" value={form.firstName} onChange={(v) => set('firstName', v)} />
              <Input label="Last name" value={form.lastName} onChange={(v) => set('lastName', v)} />
              <Input label="Organization name *" value={form.organizationName} onChange={(v) => set('organizationName', v)} />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="btn-primary"
                onClick={() => void sendInvestorOtp()}
                disabled={loading || !form.email.trim() || !form.firstName.trim() || !form.organizationName.trim()}
              >
                {loading ? 'Sending code…' : 'Send OTP'}
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">Step {step} of 3 — {stepTitle}</p>
          <div className="flex gap-1">{[1, 2, 3].map((n) => <div key={n} className={`h-1.5 w-10 rounded ${step >= n ? 'bg-primary-600' : 'bg-gray-200'}`} />)}</div>
        </div>

        <div className={`rounded-2xl border border-gray-200 bg-white p-6 space-y-5 ${!emailVerified ? 'opacity-60 pointer-events-none' : ''}`}>
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Email *" value={form.email} onChange={(v) => set('email', v)} type="email" />
                <Input label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
                <Input label="First name *" value={form.firstName} onChange={(v) => set('firstName', v)} />
                <Input label="Last name" value={form.lastName} onChange={(v) => set('lastName', v)} />
                <Input label="LinkedIn URL" value={form.linkedIn} onChange={(v) => set('linkedIn', v)} />
                <Input label="Designation" value={form.designation} onChange={(v) => set('designation', v)} />
                <Input label="Organization name *" value={form.organizationName} onChange={(v) => set('organizationName', v)} />
                <Input label="Fund name" value={form.fundName} onChange={(v) => set('fundName', v)} />
                <Select label="Organization type" value={form.organizationType} onChange={(v) => set('organizationType', v)} options={ORG_TYPES} />
                <Input label="Fund size" value={form.fundSize} onChange={(v) => set('fundSize', v)} />
                <Input label="Fund size range" value={form.fundSizeRange} onChange={(v) => set('fundSizeRange', v)} />
                <Input label="AUM" value={form.aum} onChange={(v) => set('aum', v)} />
                <Input label="Fund vintage" value={form.fundVintage} onChange={(v) => set('fundVintage', v)} />
                <Input label="Website" value={form.website} onChange={(v) => set('website', v)} />
              </div>
              <div className="flex justify-end">
                <button type="button" className="btn-primary" disabled={!canStep1} onClick={() => setStep(2)}>Continue</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Multi label="Sectors of interest" options={SECTORS} selected={form.sectors} onToggle={(v) => toggle('sectors', v)} />
              <Multi label="Investment stages" options={STAGES} selected={form.investmentStages} onToggle={(v) => toggle('investmentStages', v)} />
              <Multi label="Geographic focus" options={GEO} selected={form.geographicFocus} onToggle={(v) => toggle('geographicFocus', v)} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Typical ticket size" value={form.typicalTicketSize} onChange={(v) => set('typicalTicketSize', v)} />
                <Input label="Min investment" value={form.minInvestment} onChange={(v) => set('minInvestment', v)} />
                <Input label="Max investment" value={form.maxInvestment} onChange={(v) => set('maxInvestment', v)} />
              </div>
              <Multi label="Financing types" options={FINANCING} selected={form.financingTypes} onToggle={(v) => toggle('financingTypes', v)} />
              <Multi label="Investment structures" options={STRUCTURES} selected={form.investmentStructures} onToggle={(v) => toggle('investmentStructures', v)} />
              <div className="flex justify-between">
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn-primary" onClick={() => setStep(3)}>Continue</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Multi label="ESG focus" options={ESG} selected={form.esgFocus} onToggle={(v) => toggle('esgFocus', v)} />
              <Multi label="Impact metrics" options={METRICS} selected={form.impactMetrics} onToggle={(v) => toggle('impactMetrics', v)} />
              <Multi label="Certifications" options={CERTS} selected={form.certifications} onToggle={(v) => toggle('certifications', v)} />
              <Multi label="SDG alignment" options={SDGS} selected={form.sdgAlignment} onToggle={(v) => toggle('sdgAlignment', v)} />
              <Area label="Investment criteria" value={form.investmentCriteria} onChange={(v) => set('investmentCriteria', v)} />
              <Area label="Portfolio companies" value={form.portfolioCompanies} onChange={(v) => set('portfolioCompanies', v)} />
              <Area label="Recent investments" value={form.recentInvestments} onChange={(v) => set('recentInvestments', v)} />
              <Area label="Value add" value={form.valueAdd} onChange={(v) => set('valueAdd', v)} />
              <Input label="Decision timeline" value={form.decisionTimeline} onChange={(v) => set('decisionTimeline', v)} />
              <Area label="Due diligence process" value={form.dueDiligenceProcess} onChange={(v) => set('dueDiligenceProcess', v)} />

              {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="flex justify-between">
                <button type="button" className="btn-outline" onClick={() => setStep(2)}>Back</button>
                <button type="button" className="btn-primary" onClick={() => void onSubmit()} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit complete profile'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <OTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={form.email}
        onVerify={handleVerifyInvestorOtp}
        onResend={handleResendInvestorOtp}
        isVerifying={isVerifyingOtp}
      />
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input-field" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea className="input-field min-h-[88px]" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input-field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function Multi({ label, options, selected, onToggle }: { label: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${selected.includes(o) ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 bg-white text-gray-700'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
