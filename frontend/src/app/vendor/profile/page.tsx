'use client';
import { useEffect, useRef, useState } from 'react';
import { vendorService } from '@/services/vendor.service';
import { VendorLogoAvatar } from '@/components/vendor/VendorLogoAvatar';
import { ALLOWED_VENDOR_LOGO_ACCEPT } from '@/lib/vendorLogoConstants';
import { validateVendorLogoFile } from '@/lib/vendorLogoValidation';

interface Profile {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  companyDescription?: string;
  servicesOffered?: string;
  sector?: string;
  location?: string;
  logoUrl?: string | null;
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoLocalUrl, setLogoLocalUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    vendorService
      .getProfile()
      .then((r: { data: { data: Profile } }) => setProfile(r.data.data || {}))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      if (logoLocalUrl) URL.revokeObjectURL(logoLocalUrl);
    };
  }, [logoLocalUrl]);

  const update = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const onLogoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setLogoError('');
    if (!f) return;
    const v = validateVendorLogoFile(f);
    if (!v.ok) {
      setLogoError(v.message);
      e.target.value = '';
      return;
    }
    setLogoFile(f);
    setLogoLocalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  };

  const clearLogoSelection = () => {
    setLogoFile(null);
    setLogoLocalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setLogoError('');
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setLogoError('');
    setSaved(false);
    try {
      if (logoFile) {
        const v = validateVendorLogoFile(logoFile);
        if (!v.ok) {
          setLogoError(v.message);
          return;
        }
        const publicUrl = await vendorService.uploadLogo(logoFile);
        setProfile((p) => ({ ...p, logoUrl: publicUrl || p.logoUrl }));
        clearLogoSelection();
      }

      const res = await vendorService.updateProfile(profile);
      setProfile(res.data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = ax?.response?.data?.message || ax?.message;
      setError(msg || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-gray-400 text-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-2" />
        Loading…
      </div>
    );

  const fields: Array<{ key: keyof Profile; label: string; placeholder?: string }> = [
    { key: 'companyName', label: 'Company Name', placeholder: 'Acme Clean Energy' },
    { key: 'contactPerson', label: 'Contact Person', placeholder: 'Jane Smith' },
    { key: 'phone', label: 'Phone', placeholder: '+91 99999 00000' },
    { key: 'website', label: 'Website', placeholder: 'https://acme.com' },
    { key: 'sector', label: 'Sector', placeholder: 'Renewable Energy' },
    { key: 'location', label: 'Location', placeholder: 'Mumbai, India' },
  ];

  // Compute profile completion
  const allFields = [
    profile.companyName,
    profile.contactPerson,
    profile.phone,
    profile.website,
    profile.companyDescription,
    profile.servicesOffered,
    profile.sector,
    profile.location,
  ];
  const filled = allFields.filter(Boolean).length;
  const completion = Math.round((filled / allFields.length) * 100);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 sm:mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
        <VendorLogoAvatar
          logoUrl={logoLocalUrl || profile.logoUrl}
          label={profile.companyName || profile.contactPerson || 'Vendor'}
          sizeClass="h-20 w-20 sm:h-24 sm:w-24"
        />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Company Profile</h1>
          <p className="text-slate-600 mt-2">Manage your company information and track completion progress</p>
        </div>
      </div>

      {/* Completion Indicator */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6 mb-8 shadow-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-emerald-900">Profile Completion</p>
          <p className={`text-2xl font-bold ${completion === 100 ? 'text-green-600' : 'text-emerald-600'}`}>
            {completion}%
          </p>
        </div>
        <div className="h-3 bg-white rounded-full border border-emerald-200 overflow-hidden">
          <div
            className={`h-full transition-all ${
              completion === 100 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>
        {completion < 100 && (
          <p className="text-xs text-emerald-700 mt-3 font-medium">
            ✓ {completion}% complete – {allFields.length - filled} field{allFields.length - filled !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="max-w-4xl">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sm:p-8">
          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">⚠️</span>
                <div>{error}</div>
              </div>
            </div>
          )}
          {saved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span className="font-medium">Profile saved successfully!</span>
              </div>
            </div>
          )}

          {/* Company logo */}
          <div className="mb-10 pb-10 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Company logo</h2>
            <p className="text-sm text-slate-600 mb-4">
              PNG, JPEG, WebP, or GIF — up to 2 MB. Shown on your vendor dashboards after you save.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <input
                ref={logoInputRef}
                type="file"
                accept={ALLOWED_VENDOR_LOGO_ACCEPT}
                className="block w-full max-w-md text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800 hover:file:bg-emerald-100"
                onChange={onLogoPick}
                disabled={saving}
              />
              {logoFile && (
                <button
                  type="button"
                  onClick={clearLogoSelection}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  disabled={saving}
                >
                  Clear selection
                </button>
              )}
            </div>
            {logoError && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {logoError}
              </p>
            )}
          </div>

          {/* Basic Information Section */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fields.slice(0, 6).map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">{f.label}</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    type="text"
                    value={(profile[f.key] as string) || ''}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-10 mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Services & Operations</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Services Offered</label>
                <input
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  value={profile.servicesOffered || ''}
                  onChange={(e) => update('servicesOffered', e.target.value)}
                  placeholder="Solar Installation, Energy Auditing, Carbon Offsetting…"
                />
                <p className="text-xs text-slate-500 mt-2">List the main services your company offers</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Company Description</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-vertical min-h-[120px]"
                  value={profile.companyDescription || ''}
                  onChange={(e) => update('companyDescription', e.target.value)}
                  placeholder="Brief description of your company, its mission, and the services you offer…"
                />
                <p className="text-xs text-slate-500 mt-2">Share your company&apos;s vision and key achievements</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all shadow-sm"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Changes…
              </>
            ) : (
              <>
                <span>✓ Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
