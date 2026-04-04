'use client';
import { useEffect, useMemo, useState } from 'react';
import { portalService } from '@/services/portal.service';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import {
  SettingsIcon,
  RocketIcon,
  HandshakeIcon,
} from '@/components/vendor/VendorIcons';

type NotifCategory = 'system' | 'onboarding' | 'partnership';

type NotificationRow = {
  id: string;
  type?: NotifCategory | string | null;
  title?: string | null;
  message?: string | null;
  created_at?: string | null;
  is_read?: boolean | null;
};

const CATEGORY_CONFIG: Record<NotifCategory, { label: string; classes: string; icon: React.ReactNode }> = {
    system: { label: 'System', classes: 'bg-gray-100 text-gray-600', icon: <SettingsIcon className="w-4 h-4" /> },
    onboarding: { label: 'Onboarding', classes: 'bg-blue-100 text-blue-700', icon: <RocketIcon className="w-4 h-4" /> },
    partnership: { label: 'Partnership', classes: 'bg-emerald-100 text-emerald-700', icon: <HandshakeIcon className="w-4 h-4" /> },
};

export default function VendorNotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationRow[]>([]);
    const [filter, setFilter] = useState<'all' | NotifCategory>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const unreadCount = useMemo(
      () => notifications.filter((n) => !n.is_read).length,
      [notifications]
    );

    const filtered = useMemo(() => {
      if (filter === 'all') return notifications;
      return notifications.filter((n) => (n.type || '') === filter);
    }, [notifications, filter]);

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const r = await portalService.getNotifications();
        setNotifications(r.data?.data || []);
      } catch (e: unknown) {
        setNotifications([]);
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load();
    }, []);

    // Realtime updates for notifications.
    useEffect(() => {
      const sb = getSupabaseBrowserClient();
      if (!sb) return;
      const ch = sb
        .channel('vendor-portal-notifications-list')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications' },
          () => load()
        )
        .subscribe();
      return () => {
        sb.removeChannel(ch);
      };
    }, []);

    const markAllRead = async () => {
      try {
        await portalService.markAllRead();
        await load();
      } catch (e: unknown) {
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to mark all as read.');
      }
    };

    const markRead = async (id: string) => {
      try {
        await portalService.markNotificationRead(id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      } catch (e: unknown) {
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to mark as read.');
      }
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

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

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
                {loading ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                    <p className="text-gray-400 text-sm">Loading notifications…</p>
                  </div>
                ) : filtered.map((n) => {
                    const category = (n.type || 'system') as NotifCategory;
                    const cat = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.system;
                    const isRead = Boolean(n.is_read);
                    return (
                        <div
                            key={n.id}
                            className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-all hover:shadow-sm cursor-pointer ${isRead ? 'border-gray-100' : 'border-primary-200 bg-primary-50/20'}`}
                            onClick={() => { if (!isRead) markRead(n.id); }}
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">
                                {cat.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {!isRead && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />}
                                    <p className={`text-sm font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title || 'Notification'}</p>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">{n.message || '—'}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.classes}`}>{cat.label}</span>
                                    <span className="text-xs text-gray-400">
                                      {n.created_at ? new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {!loading && filtered.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                        <p className="text-gray-400 text-sm">No notifications in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
