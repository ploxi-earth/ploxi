'use client';
import { useState } from 'react';
import {
  SettingsIcon,
  RocketIcon,
  HandshakeIcon,
} from '@/components/vendor/VendorIcons';

type NotifCategory = 'system' | 'onboarding' | 'partnership';

interface Notification {
    id: number;
    title: string;
    message: string;
    category: NotifCategory;
    date: string;
    read: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
    { id: 1, title: 'New Enquiry Received', message: 'GreenTech Solutions sent an enquiry about Solar Panel Installation services.', category: 'partnership', date: '15 Mar 2026', read: false },
    { id: 2, title: 'Agreement Ready for Review', message: 'A new Service Level Agreement has been shared for your review and signature.', category: 'partnership', date: '14 Mar 2026', read: false },
    { id: 3, title: 'Meeting Scheduled', message: 'Quarterly Business Review scheduled for 20 Mar 2026 at 10:00 AM.', category: 'system', date: '13 Mar 2026', read: false },
    { id: 4, title: 'Profile Update Reminder', message: 'Complete your company profile to improve visibility to potential clients.', category: 'onboarding', date: '10 Mar 2026', read: true },
    { id: 5, title: 'Welcome to Ploxi Portal', message: 'Congratulations! Your onboarding is complete. Explore the vendor portal to manage services, projects, and meetings.', category: 'onboarding', date: '05 Mar 2026', read: true },
    { id: 6, title: 'System Maintenance Notice', message: 'Scheduled maintenance on 08 Mar 2026 from 2:00 AM to 4:00 AM IST. Portal may be briefly unavailable.', category: 'system', date: '06 Mar 2026', read: true },
    { id: 7, title: 'New Project Opportunity', message: 'A new project "LED Retrofit – Bangalore" matches your service categories. View details in Projects.', category: 'partnership', date: '01 Mar 2026', read: true },
];

const CATEGORY_CONFIG: Record<NotifCategory, { label: string; classes: string; icon: React.ReactNode }> = {
    system: { label: 'System', classes: 'bg-gray-100 text-gray-600', icon: <SettingsIcon className="w-4 h-4" /> },
    onboarding: { label: 'Onboarding', classes: 'bg-blue-100 text-blue-700', icon: <RocketIcon className="w-4 h-4" /> },
    partnership: { label: 'Partnership', classes: 'bg-emerald-100 text-emerald-700', icon: <HandshakeIcon className="w-4 h-4" /> },
};

export default function VendorNotificationsPage() {
    const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | NotifCategory>('all');

    const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.category === filter);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const toggleRead = (id: number) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\u0027re all caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['all', 'system', 'onboarding', 'partnership'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filter === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {f !== 'all' && CATEGORY_CONFIG[f as NotifCategory].icon}
                        {f === 'all' ? 'All' : CATEGORY_CONFIG[f as NotifCategory].label}
                    </button>
                ))}
            </div>

            {/* Notification list */}
            <div className="space-y-3">
                {filtered.map((n) => {
                    const cat = CATEGORY_CONFIG[n.category];
                    return (
                        <div
                            key={n.id}
                            className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-all hover:shadow-sm cursor-pointer ${n.read ? 'border-gray-100' : 'border-primary-200 bg-primary-50/20'}`}
                            onClick={() => toggleRead(n.id)}
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">
                                {cat.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />}
                                    <p className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">{n.message}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.classes}`}>{cat.label}</span>
                                    <span className="text-xs text-gray-400">{n.date}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                        <p className="text-gray-400 text-sm">No notifications in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
