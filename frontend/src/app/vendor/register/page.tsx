'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { vendorRegistrationService } from '@/services/vendor.service';
import OTPModal from '@/components/OTPModal';

export default function VendorRegisterPage() {
    const [form, setForm] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await vendorRegistrationService.sendOtp({
                companyName: form.companyName,
                contactPerson: form.contactPerson,
                email: form.email,
                phone: form.phone,
                password: form.password,
            });
            setShowOTPModal(true);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyVendorOtp = async (otp: string) => {
        setIsVerifying(true);
        try {
            await vendorRegistrationService.verifyOtp(form.email, otp);
            setShowOTPModal(false);
            setSubmitted(true);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            throw new Error(msg || 'Invalid OTP.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendVendorOtp = async () => {
        await vendorRegistrationService.sendOtp({
            companyName: form.companyName,
            contactPerson: form.contactPerson,
            email: form.email,
            phone: form.phone,
            password: form.password,
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <Link href="/" className="flex justify-center mb-6">
                        <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={120} height={48} className="h-12 w-auto object-contain" />
                    </Link>
                    <div className="bg-white py-10 px-6 shadow-sm rounded-2xl sm:px-10 border border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Submitted!</h2>
                        <p className="text-gray-600 mb-2">
                            Thank you for registering on Ploxi Earth.
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Your email is verified and your application is under review. You will receive a notification once your account is approved by our admin team.
                        </p>
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-sky-800 font-medium">
                                ⏳ You will be able to sign in after approval.
                            </p>
                        </div>
                        <Link
                            href="/cleantech"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                            Back to CleanTech
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="mb-6 flex justify-center">
                    <Link
                        href="/cleantech"
                        className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm transition-colors hover:bg-sky-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>
                        Back to CleanTech
                    </Link>
                </div>
                <Link href="/" className="flex justify-center mb-6">
                    <Image src="/images/logo.jpeg" alt="Ploxi Earth" width={120} height={48} className="h-12 w-auto object-contain" />
                </Link>
                <h2 className="text-center text-2xl font-bold text-gray-900">Register as a Vendor</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join the Ploxi CleanTech Marketplace as a technology partner.
                </p>
                <p className="mt-1 text-center text-sm text-gray-500">
                    Already registered?{' '}
                    <Link href="/auth/login" className="font-medium text-sky-600 hover:text-sky-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 shadow-sm rounded-2xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Company Name *</label>
                                <input
                                    className="input-field"
                                    required
                                    value={form.companyName}
                                    onChange={(e) => update('companyName', e.target.value)}
                                    placeholder="Acme Clean Energy"
                                />
                            </div>
                            <div>
                                <label className="label">Contact Person *</label>
                                <input
                                    className="input-field"
                                    required
                                    value={form.contactPerson}
                                    onChange={(e) => update('contactPerson', e.target.value)}
                                    placeholder="Jane Smith"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Email Address *</label>
                                <input
                                    className="input-field"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => update('email', e.target.value)}
                                    placeholder="jane@company.com"
                                    autoComplete="email"
                                />
                            </div>
                            <div>
                                <label className="label">Phone Number *</label>
                                <input
                                    className="input-field"
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={(e) => update('phone', e.target.value)}
                                    placeholder="+91 99999 00000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Password *</label>
                            <input
                                className="input-field"
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) => update('password', e.target.value)}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <label className="label">Confirm Password *</label>
                            <input
                                className="input-field"
                                type="password"
                                required
                                value={form.confirmPassword}
                                onChange={(e) => update('confirmPassword', e.target.value)}
                                placeholder="Repeat password"
                                autoComplete="new-password"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full text-base py-3" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending code…
                                </span>
                            ) : (
                                'Continue — verify email'
                            )}
                        </button>
                    </form>
                    <p className="mt-4 text-xs text-gray-500 text-center">
                        By registering you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>

            <OTPModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                email={form.email}
                onVerify={handleVerifyVendorOtp}
                onResend={handleResendVendorOtp}
                isVerifying={isVerifying}
            />
        </div>
    );
}
