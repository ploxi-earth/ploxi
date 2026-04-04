'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { portalService } from '@/services/portal.service';
import { authService } from '@/services/auth.service';

export default function VendorSettingsPage() {
    const { user, setUser, setTokens } = useAuthStore();

    const [account, setAccount] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
    });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [notifPrefs, setNotifPrefs] = useState({
        emailEnquiries: true,
        emailMeetings: true,
        emailSystem: false,
        pushAll: true,
    });
    const [savedAccount, setSavedAccount] = useState(false);
    const [savedPassword, setSavedPassword] = useState(false);
    const [savingAccount, setSavingAccount] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [accountError, setAccountError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleAccountSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingAccount(true);
        setAccountError('');
        setSavedAccount(false);
        try {
          const r = await portalService.updateSettings({
            contactPerson: account.name,
            phone: account.phone,
          });
          const updated = r.data?.data;
          if (updated && user) {
            // Keep auth store in sync for header greetings etc.
            setUser({
              ...user,
              name: updated.contact_person ?? account.name,
              email: updated.email ?? account.email,
            });
          }
          setSavedAccount(true);
          setTimeout(() => setSavedAccount(false), 3000);
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setAccountError(msg || 'Failed to update account details.');
        } finally {
          setSavingAccount(false);
        }
    };

    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordError('');
        setSavedPassword(false);
        try {
          if (!passwords.current || !passwords.newPass) {
            setPasswordError('Current and new password are required.');
            return;
          }
          if (passwords.newPass.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
          }
          if (passwords.newPass !== passwords.confirm) {
            setPasswordError('New password and confirmation do not match.');
            return;
          }

          const r = await authService.changePassword(passwords.current, passwords.newPass);
          const accessToken = r.data?.accessToken;
          const refreshToken = r.data?.refreshToken;
          const nextUser = r.data?.user;
          if (accessToken && refreshToken) setTokens(accessToken, refreshToken);
          if (nextUser) setUser(nextUser);

          setSavedPassword(true);
          setPasswords({ current: '', newPass: '', confirm: '' });
          setTimeout(() => setSavedPassword(false), 3000);
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setPasswordError(msg || 'Failed to update password.');
        } finally {
          setSavingPassword(false);
        }
    };

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-gray-200'}`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your account and preferences</p>
            </div>

            {/* Account Information */}
            <form onSubmit={handleAccountSave} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-5">Account Information</h2>
                {accountError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                    {accountError}
                  </div>
                )}
                {savedAccount && (
                    <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700 mb-4">
                        ✓ Account details saved successfully!
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={account.name}
                            onChange={(e) => setAccount({ ...account, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={account.email}
                            onChange={(e) => setAccount({ ...account, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all bg-gray-50"
                            disabled
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support for assistance.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <input
                            type="tel"
                            value={account.phone}
                            onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                            placeholder="+91 99999 00000"
                        />
                    </div>
                </div>
                <button
                  type="submit"
                  disabled={savingAccount}
                  className="mt-5 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                    {savingAccount ? 'Saving…' : 'Save Changes'}
                </button>
            </form>

            {/* Change Password */}
            <form onSubmit={handlePasswordSave} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-5">Change Password</h2>
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                    {passwordError}
                  </div>
                )}
                {savedPassword && (
                    <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700 mb-4">
                        ✓ Password updated successfully!
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                        <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <input
                            type="password"
                            value={passwords.newPass}
                            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="mt-5 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                    {savingPassword ? 'Updating…' : 'Update Password'}
                </button>
            </form>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-5">Notification Preferences</h2>
                <div className="space-y-4">
                    {[
                        { key: 'emailEnquiries' as const, label: 'Email – New Enquiries', desc: 'Receive an email when a new enquiry is submitted' },
                        { key: 'emailMeetings' as const, label: 'Email – Meeting Reminders', desc: 'Get notified about upcoming meetings' },
                        { key: 'emailSystem' as const, label: 'Email – System Updates', desc: 'Maintenance notices and platform updates' },
                        { key: 'pushAll' as const, label: 'Push Notifications', desc: 'Browser push notifications for all activity' },
                    ].map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-gray-800">{pref.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{pref.desc}</p>
                            </div>
                            <Toggle
                                checked={notifPrefs[pref.key]}
                                onChange={() => setNotifPrefs((p) => ({ ...p, [pref.key]: !p[pref.key] }))}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 p-6">
                <h2 className="font-semibold text-red-700 mb-2">Danger Zone</h2>
                <p className="text-sm text-gray-500 mb-4">Once you deactivate your account, all data will be permanently removed. This action cannot be undone.</p>
                <button className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors">
                    Deactivate Account
                </button>
            </div>
        </div>
    );
}
