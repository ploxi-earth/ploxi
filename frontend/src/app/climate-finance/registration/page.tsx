'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { climateFinanceService } from '@/services/vendor.service';
import FormPageHeader from '@/components/FormPageHeader';
import OTPModal from '@/components/OTPModal';

type EngagementType = 'raise_funding' | 'investor' | 'participate' | '';

function ClimateFinanceRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') || '') as EngagementType;

  const [engagementType, setEngagementType] = useState<EngagementType>(initialType);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', organization: '', website: '',
    // Raise Funding
    projectName: '', projectDescription: '', fundingRequired: '', projectStage: '', sector: '',
    // Investor
    investmentFocus: [] as string[], ticketSize: '', geographicPreference: [] as string[],
    // Participate
    participationType: '', areaOfInterest: '', message: '',
  });

  const update = (field: string, value: unknown) => setForm((p) => ({ ...p, [field]: value }));
  const toggleArray = (field: string, value: string) => {
    const current = form[field as keyof typeof form] as string[];
    update(field, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const buildFormData = () => ({ ...form });

  const sendClimateOtp = async () => {
    if (!engagementType) return;
    setLoading(true);
    setError('');
    try {
      await climateFinanceService.sendOtp(engagementType, form.email, buildFormData());
      setShowOTPModal(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClimateOtp = async (otp: string) => {
    if (!engagementType) return;
    setIsVerifying(true);
    try {
      await climateFinanceService.verifyOtp(engagementType, form.email, otp);
      setShowOTPModal(false);
      if (engagementType === 'investor') {
        try {
          sessionStorage.setItem(
            'investor-otp-prefill',
            JSON.stringify({
              email: form.email,
              fullName: form.fullName,
              phone: form.phone,
              organization: form.organization,
              website: form.website,
            })
          );
        } catch {
          // ignore storage issues
        }
        router.push(`/climate-finance/investor-registration?email=${encodeURIComponent(form.email)}&verified=1`);
        return;
      }
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      throw new Error(e?.response?.data?.message || 'Invalid OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendClimateOtp = async () => {
    if (!engagementType) return;
    await climateFinanceService.sendOtp(engagementType, form.email, buildFormData());
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submitted!</h2>
          <p className="text-gray-500 mb-6">Thank you for your interest in climate finance. Our team will reach out shortly.</p>
          <Link href="/" className="btn-primary w-full justify-center">Back to Home</Link>
        </div>
      </div>
    );
  }

  const typeOptions: { type: EngagementType; emoji: string; title: string; desc: string }[] = [
    { type: 'raise_funding', emoji: '🚀', title: 'Raise Funding', desc: 'Seeking investment for your clean tech venture' },
    { type: 'investor', emoji: '💰', title: "I'm an Investor", desc: 'Looking to invest in climate solutions' },
    { type: 'participate', emoji: '🤝', title: 'Participate', desc: 'Join events and seek consultation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <FormPageHeader backHref="/climate-finance" subtitle="Investment &amp; Funding" />

      <div className="mx-auto max-w-2xl px-4 pt-8 pb-12">
        {!engagementType && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome to Climate Finance</h2>
            <p className="text-gray-500 text-center text-sm mb-8">How would you like to engage with us?</p>
            <div className="grid grid-cols-1 gap-4">
              {typeOptions.map((opt) => (
                <button key={opt.type} onClick={() => setEngagementType(opt.type)}
                  className="flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                  <span className="text-3xl">{opt.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-900">{opt.title}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {engagementType === 'investor' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Investor Registration</h2>
            <p className="text-gray-500 text-sm mb-6">
              The investor flow now uses a dedicated full multi-step form to match schema fields.
            </p>
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              onClick={() => router.push('/climate-finance/investor-registration')}
            >
              Open Full Investor Form
            </button>
          </div>
        )}

        {engagementType && engagementType !== 'investor' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* <button onClick={() => setEngagementType('')} className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">← Back</button> */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {typeOptions.find((o) => o.type === engagementType)?.title} – Registration
            </h2>

            {/* Common Fields */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input-field" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input className="input-field" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input className="input-field" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                </div>
                <div>
                  <label className="label">Organization</label>
                  <input className="input-field" value={form.organization} onChange={(e) => update('organization', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Raise Funding */}
            {engagementType === 'raise_funding' && (
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="label">Funding Purpose</label>
                  <input className="input-field" value={form.projectName} onChange={(e) => update('projectName', e.target.value)} />
                </div>
                <div>
                  <label className="label">Use of funds</label>
                  <textarea className="input-field h-24 resize-none" value={form.projectDescription} onChange={(e) => update('projectDescription', e.target.value)} placeholder="Type here" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Funding Amount</label>
                    <select className="input-field" value={form.fundingRequired} onChange={(e) => update('fundingRequired', e.target.value)}>
                      <option value="">Select range</option>
                      <option>Below ₹1 Cr</option>
                      <option>₹1–5 Cr</option>
                      <option>₹5–20 Cr</option>
                      <option>₹20–100 Cr</option>
                      <option>Above ₹100 Cr</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Project Stage</label>
                    <select className="input-field" value={form.projectStage} onChange={(e) => update('projectStage', e.target.value)}>
                      <option value="">Select stage</option>
                      <option>Pre-Seed</option>
                      <option>Seed</option>
                      <option>Series A</option>
                      <option>Series B</option>
                      <option>Series C+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Investor */}
            {engagementType === 'investor' && (
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="label">Investment Focus</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Solar', 'Wind', 'EV & Mobility', 'Green Hydrogen', 'Carbon Markets', 'Agri-Tech', 'Water', 'Waste'].map((f) => (
                      <button key={f} type="button" onClick={() => toggleArray('investmentFocus', f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${form.investmentFocus.includes(f) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Ticket Size</label>
                  <select className="input-field" value={form.ticketSize} onChange={(e) => update('ticketSize', e.target.value)}>
                    <option value="">Select range</option>
                    <option>₹50L – ₹2 Cr</option>
                    <option>₹2–10 Cr</option>
                    <option>₹10–50 Cr</option>
                    <option>₹50 Cr+</option>
                  </select>
                </div>
              </div>
            )}

            {/* Participate */}
            {engagementType === 'participate' && (
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="label">Type of Participation</label>
                  <select className="input-field" value={form.participationType} onChange={(e) => update('participationType', e.target.value)}>
                    <option value="">Select type</option>
                    <option>Event / Conference</option>
                    <option>Consultation</option>
                    <option>Webinar</option>
                    <option>Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="label">Area of Interest</label>
                  <input className="input-field" value={form.areaOfInterest} onChange={(e) => update('areaOfInterest', e.target.value)} placeholder="e.g., Carbon Markets, ESG Reporting" />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input-field h-24 resize-none" value={form.message} onChange={(e) => update('message', e.target.value)} />
                </div>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
            <div className="mt-8">
              <button
                type="button"
                className="btn-primary w-full inline-flex items-center justify-center gap-2"
                onClick={() => void sendClimateOtp()}
                disabled={loading || !form.fullName || !form.email}
              >
                {loading ? 'Sending code…' : <>{engagementType === 'investor' ? 'Verify email & continue' : 'Verify email & submit'} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>}
              </button>
            </div>
          </div>
        )}
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={form.email}
        onVerify={handleVerifyClimateOtp}
        onResend={handleResendClimateOtp}
        isVerifying={isVerifying}
      />
    </div>
  );
}

export default function ClimateFinanceRegistrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <ClimateFinanceRegistrationForm />
    </Suspense>
  );
}
