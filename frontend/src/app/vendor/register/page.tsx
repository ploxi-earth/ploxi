'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { vendorRegistrationService } from '@/services/vendor.service';
import OTPModal from '@/components/OTPModal';
import Footer from '@/components/Footer';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@/components/vendor/VendorIcons';

const ALLOWED_CORPORATE_PROFILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_CORPORATE_PROFILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function VendorRegisterPage() {
    const [form, setForm] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        vendorType: 'service' as 'product' | 'service',
        locationsServed: '',
        industryFocus: '',
        password: '',
        confirmPassword: '',
    });
    const [corporateProfileFile, setCorporateProfileFile] = useState<File | null>(null);
    const [corporateProfileError, setCorporateProfileError] = useState('');
    const corporateFileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

    // Validate corporate profile file
    const validateCorporateProfileFile = (file: File): { ok: boolean; message: string } => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ALLOWED_CORPORATE_PROFILE_EXTENSIONS.includes(ext)) {
            return { ok: false, message: 'File must be PDF, DOC, or DOCX format.' };
        }
        if (!ALLOWED_CORPORATE_PROFILE_TYPES.includes(file.type) && 
            !ALLOWED_CORPORATE_PROFILE_EXTENSIONS.some(e => file.name.toLowerCase().endsWith(e))) {
            return { ok: false, message: 'Invalid file type. Allowed: PDF, DOC, DOCX' };
        }
        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
            return { ok: false, message: 'File size must be less than 10MB.' };
        }
        return { ok: true, message: '' };
    };

    // Handle corporate profile file selection
    const onCorporateProfilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        setCorporateProfileError('');
        if (!f) return;
        const validation = validateCorporateProfileFile(f);
        if (!validation.ok) {
            setCorporateProfileError(validation.message);
            e.target.value = '';
            return;
        }
        setCorporateProfileFile(f);
    };

    // Clear corporate profile file selection
    const clearCorporateProfileSelection = () => {
        setCorporateProfileFile(null);
        setCorporateProfileError('');
        if (corporateFileInputRef.current) corporateFileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!form.vendorType || !form.locationsServed.trim()) {
            setError('Vendor type and locations served are required.');
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
                vendorType: form.vendorType,
                locationsServed: form.locationsServed.split(',').map((v) => v.trim()).filter(Boolean),
                industryFocus: form.industryFocus.split(',').map((v) => v.trim()).filter(Boolean),
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
            vendorType: form.vendorType,
            locationsServed: form.locationsServed.split(',').map((v) => v.trim()).filter(Boolean),
            industryFocus: form.industryFocus.split(',').map((v) => v.trim()).filter(Boolean),
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
                            <CheckCircleIcon className="h-7 w-7 text-white" />
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
                                You will be able to sign in after approval.
                            </p>
                        </div>
                        <Link
                            href="/cleantech"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                        >
                            <ArrowLeftIcon className="h-3.5 w-3.5" />
                            Back to CleanTech
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow bg-gradient-to-br from-gray-50 to-sky-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="mb-6 flex justify-center">
                    <Link
                        href="/cleantech"
                        className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm transition-colors hover:bg-sky-50"
                    >
                        <ArrowLeftIcon className="h-3.5 w-3.5" />
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
                            <XCircleIcon className="h-4 w-4" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Vendor Type *</label>
                                <select className="input-field" value={form.vendorType} onChange={(e) => update('vendorType', e.target.value)}>
                                    <option value="product">Product Vendor</option>
                                    <option value="service">Service Vendor</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="label">Locations Served * (comma-separated)</label>
                            <input className="input-field" required value={form.locationsServed} onChange={(e) => update('locationsServed', e.target.value)} placeholder="Bengaluru, Mumbai, Delhi NCR" />
                        </div>
                        <div>
                            <label className="label">Industry Focus (comma-separated)</label>
                            <input className="input-field" value={form.industryFocus} onChange={(e) => update('industryFocus', e.target.value)} placeholder="Renewable Energy, E-Mobility" />
                        </div>
                        <div>
                            <label className="label">Corporate Profile (PDF, DOC, DOCX)</label>
                            <p className="text-xs text-gray-500 mb-2">Upload your corporate profile document (optional, max 10MB)</p>
                            <input
                                ref={corporateFileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="block w-full max-w-md text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800 hover:file:bg-emerald-100"
                                onChange={onCorporateProfilePick}
                                disabled={loading}
                            />
                            {corporateProfileFile && (
                                <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <span className="text-sm text-emerald-800 truncate">{corporateProfileFile.name}</span>
                                    <button
                                        type="button"
                                        onClick={clearCorporateProfileSelection}
                                        className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                            {corporateProfileError && (
                                <p className="mt-2 text-sm text-red-600" role="alert">{corporateProfileError}</p>
                            )}
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

        <Footer />
    </div>
}
