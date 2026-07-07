'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { corporateService } from '@/services/vendor.service';
import OTPModal from '@/components/OTPModal';

const INDUSTRY_SECTORS = [
  'Manufacturing', 'Real Estate', 'Agriculture', 'Transportation',
  'Utilities', 'Finance', 'Healthcare', 'Education', 'IT / Data Center',
  'Hospitality', 'Retail', 'Logistics', 'Automotive', 'Steel',
  'Cement', 'Chemicals', 'Oil & Gas', 'Pharmaceuticals', 'Other',
];

const ESG_FRAMEWORKS = ['GRI', 'SASB', 'BRSR', 'TCFD', 'CDP', 'UN SDGs', 'ISO 14001'];
const ESG_GOALS = [
  'Net Zero by 2050', 'Carbon Neutral by 2030', 'Reduce Scope 1 Emissions',
  'Reduce Scope 2 Emissions', 'Supply Chain Sustainability', 'Water Conservation',
  'Zero Waste to Landfill', 'Biodiversity Protection',
];

export default function CorporateRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    fullName: '', designation: '', companyName: '', website: '',
    industrySector: '', customIndustry: '', email: '', phone: '',
    // Step 2
    currentEsgFrameworks: [] as string[], esgReportingStatus: '',
    primaryEsgGoals: [] as string[], annualRevenueBand: '', employeeCount: '',
    // Step 3
    hearAboutUs: '', additionalNotes: '',
  });

  const update = (field: string, value: unknown) => setForm((p) => ({ ...p, [field]: value }));

  const toggleArray = (field: string, value: string) => {
    const current = form[field as keyof typeof form] as string[];
    update(field, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  useEffect(() => {
    if (step > 1 && !emailVerified) setStep(1);
  }, [step, emailVerified]);

  const step1Valid =
    form.fullName &&
    form.designation &&
    form.companyName &&
    form.industrySector &&
    form.email &&
    form.phone &&
    (form.industrySector !== 'Other' || form.customIndustry.trim());

  const sendStep1Otp = async () => {
    setOtpBusy(true);
    setError('');
    try {
      await corporateService.sendOtp(form.email, {
        fullName: form.fullName,
        designation: form.designation,
        companyName: form.companyName,
        website: form.website,
        industrySector: form.industrySector,
        customIndustry: form.customIndustry,
        phone: form.phone,
      });
      setShowOTPModal(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Could not send OTP. Please try again.');
    } finally {
      setOtpBusy(false);
    }
  };

  const handleVerifyCorporateOtp = async (otp: string) => {
    setIsVerifying(true);
    try {
      await corporateService.verifyOtp(form.email, otp);
      setEmailVerified(true);
      setShowOTPModal(false);
      setStep(2);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      throw new Error(e?.response?.data?.message || 'Invalid OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCorporateOtp = async () => {
    await corporateService.sendOtp(form.email, {
      fullName: form.fullName,
      designation: form.designation,
      companyName: form.companyName,
      website: form.website,
      industrySector: form.industrySector,
      customIndustry: form.customIndustry,
      phone: form.phone,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await corporateService.completeRegistration({
        email: form.email,
        fullName: form.fullName,
        designation: form.designation,
        companyName: form.companyName,
        website: form.website,
        industrySector: form.industrySector,
        customIndustry: form.customIndustry,
        phone: form.phone,
        currentEsgFrameworks: form.currentEsgFrameworks,
        esgReportingStatus: form.esgReportingStatus,
        primaryEsgGoals: form.primaryEsgGoals,
        annualRevenueBand: form.annualRevenueBand,
        employeeCount: form.employeeCount,
        hearAboutUs: form.hearAboutUs,
        additionalNotes: form.additionalNotes,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
          <p className="text-gray-500 mb-6">Thank you! Our team will review your application and contact you shortly.</p>
          <Link href="/" className="btn-primary w-full justify-center">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <div className="flex items-center gap-2 mb-8">
          {['Company Details', 'ESG & Compliance', 'Verification'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-primary-600 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-200 flex-1" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Company Details</h2>
              <p className="text-gray-500 text-sm mb-6">Let&apos;s start with your company information</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input className="input-field" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="label">Designation *</label>
                    <input className="input-field" value={form.designation} onChange={(e) => update('designation', e.target.value)} placeholder="Chief Sustainability Officer" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Company Name *</label>
                    <input className="input-field" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className="label">Website</label>
                    <input className="input-field" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://example.com" />
                  </div>
                </div>
                <div>
                  <label className="label">Industry Sector *</label>
                  <select className="input-field" value={form.industrySector} onChange={(e) => update('industrySector', e.target.value)}>
                    <option value="">Select sector</option>
                    {INDUSTRY_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {form.industrySector === 'Other' && (
                  <div>
                    <label className="label">Specify industry *</label>
                    <input
                      className="input-field"
                      value={form.customIndustry}
                      onChange={(e) => update('customIndustry', e.target.value)}
                      placeholder="Your industry"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email ID *</label>
                    <input className="input-field" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input className="input-field" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>
              {error && step === 1 && (
                <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
              )}
              <div className="mt-8 flex justify-between items-center">
                <p className="text-xs text-gray-400">Need help? <a href="mailto:support@ploxi.com" className="text-primary-600 hover:underline">Contact Support</a></p>
                <button
                  type="button"
                  className="btn-primary inline-flex items-center gap-2"
                  onClick={() => void sendStep1Otp()}
                  disabled={!step1Valid || otpBusy}
                >
                  {otpBusy ? 'Sending code…' : 'Verify email & continue'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">ESG &amp; Compliance</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us about your sustainability journey</p>
              <div className="space-y-6">
                <div>
                  <label className="label">Current ESG Frameworks</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ESG_FRAMEWORKS.map((f) => (
                      <button key={f} type="button"
                        onClick={() => toggleArray('currentEsgFrameworks', f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.currentEsgFrameworks.includes(f) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">ESG Reporting Status</label>
                  <select className="input-field" value={form.esgReportingStatus} onChange={(e) => update('esgReportingStatus', e.target.value)}>
                    <option value="">Select status</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="label">Primary ESG Goals</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ESG_GOALS.map((g) => (
                      <button key={g} type="button"
                        onClick={() => toggleArray('primaryEsgGoals', g)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.primaryEsgGoals.includes(g) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Annual Revenue Band</label>
                    <select className="input-field" value={form.annualRevenueBand} onChange={(e) => update('annualRevenueBand', e.target.value)}>
                      <option value="">Select range</option>
                      <option>Below ₹10 Cr</option>
                      <option>₹10 Cr – ₹100 Cr</option>
                      <option>₹100 Cr – ₹500 Cr</option>
                      <option>₹500 Cr – ₹1,000 Cr</option>
                      <option>Above ₹1,000 Cr</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Employee Count</label>
                    <select className="input-field" value={form.employeeCount} onChange={(e) => update('employeeCount', e.target.value)}>
                      <option value="">Select range</option>
                      <option>1 – 50</option>
                      <option>51 – 200</option>
                      <option>201 – 1,000</option>
                      <option>1,001 – 5,000</option>
                      <option>5,000+</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button className="btn-outline flex-1" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary flex-1 inline-flex items-center justify-center gap-2" onClick={() => setStep(3)}>Continue to Verification <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Verification</h2>
              <p className="text-gray-500 text-sm mb-6">Final details before submission</p>
              <div className="space-y-4">
                <div>
                  <label className="label">How did you hear about us?</label>
                  <select className="input-field" value={form.hearAboutUs} onChange={(e) => update('hearAboutUs', e.target.value)}>
                    <option value="">Select option</option>
                    <option>LinkedIn</option>
                    <option>Google Search</option>
                    <option>Referral</option>
                    <option>Event / Conference</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Additional Notes</label>
                  <textarea className="input-field h-28 resize-none" value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} placeholder="Any additional information you'd like to share..." />
                </div>
              </div>
              {error && <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
              <div className="mt-8 flex gap-3">
                <button className="btn-outline flex-1" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary flex-1 inline-flex items-center justify-center gap-2" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : <>Submit Registration <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={form.email}
        onVerify={handleVerifyCorporateOtp}
        onResend={handleResendCorporateOtp}
        isVerifying={isVerifying}
      />
    </div>
  );
}
