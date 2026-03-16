'use client';
import { useEffect, useState } from 'react';
import { vendorService } from '@/services/vendor.service';

interface Profile {
  companyName?: string; website?: string; industry?: string; description?: string;
  phone?: string; address?: string; country?: string; foundedYear?: string;
  employeeCount?: string; revenue?: string;
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    vendorService.getProfile().then((r: { data: { data: Profile } }) => setProfile(r.data.data || {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(''); setSaved(false);
    try {
      await vendorService.updateProfile(profile);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Save failed. Please try again.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-10 text-gray-400 text-center">Loading…</div>;

  const fields: Array<{ key: keyof Profile; label: string; placeholder?: string; type?: string }> = [
    { key: 'companyName', label: 'Company Name', placeholder: 'Acme Corp' },
    { key: 'website', label: 'Website', placeholder: 'https://acme.com' },
    { key: 'industry', label: 'Industry', placeholder: 'Renewable Energy' },
    { key: 'phone', label: 'Phone', placeholder: '+91 99999 00000' },
    { key: 'address', label: 'Address', placeholder: 'Street, City' },
    { key: 'country', label: 'Country', placeholder: 'India' },
    { key: 'foundedYear', label: 'Founded Year', placeholder: '2015' },
    { key: 'employeeCount', label: 'Employee Count', placeholder: '50-100' },
    { key: 'revenue', label: 'Annual Revenue', placeholder: '₹5 Cr' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Complete your profile to advance through onboarding</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          {saved && <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700">✓ Profile saved successfully!</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input className="input-field" type={f.type || 'text'} value={profile[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input-field min-h-[100px] resize-y" value={profile.description || ''} onChange={(e) => update('description', e.target.value)} placeholder="Brief description of your company and services…" />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
