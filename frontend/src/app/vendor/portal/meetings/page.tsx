'use client';

import { useEffect, useMemo, useState } from 'react';
import { portalService } from '@/services/portal.service';

type MeetingRow = {
  _id: string;
  type?: string | null;
  date?: string | null;
  time?: string | null;
  link?: string | null;
  note?: string | null;
  status?: 'upcoming' | 'completed' | string | null;
  scheduledAt?: string | null;
};

const STATUS_STYLES: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-600',
};

export default function VendorMeetingsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [meetings, setMeetings] = useState<MeetingRow[]>([]);

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const r = await portalService.getMeetings();
        setMeetings(r.data?.data || []);
      } catch (e: unknown) {
        setMeetings([]);
        setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load meetings.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      load();
    }, []);

    const upcoming = useMemo(
      () => meetings.filter((m) => m.status === 'upcoming'),
      [meetings]
    );
    const past = useMemo(
      () => meetings.filter((m) => m.status !== 'upcoming'),
      [meetings]
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Meetings</h1>
                <p className="text-gray-500 text-sm mt-0.5">View and manage your scheduled meetings</p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Upcoming */}
            <div className="mb-8">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Upcoming ({upcoming.length})
                </h2>
                <div className="space-y-4">
                    {loading ? (
                      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                        <p className="text-gray-400 text-sm">Loading meetings…</p>
                      </div>
                    ) : upcoming.map((m) => (
                        <div key={m._id} className="bg-white rounded-xl border border-blue-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow">
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center text-white shadow-sm">
                                <span className="text-xs font-medium leading-none">
                                  {m.date ? new Date(m.date).toLocaleDateString('en-GB', { month: 'short' }) : '—'}
                                </span>
                                <span className="text-lg font-bold leading-none mt-0.5">
                                  {m.date ? new Date(m.date).getDate() : '—'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900">{m.type || 'Meeting'}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        {m.time || '—'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        📹 Video Call
                                    </span>
                                    {m.note && <span className="flex items-center gap-1">📝 {m.note}</span>}
                                </div>
                            </div>
                            {m.link && (
                                <a
                                    href={m.link}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" /></svg>
                                    Join
                                </a>
                            )}
                        </div>
                    ))}
                    {!loading && upcoming.length === 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                            <p className="text-gray-400 text-sm">No upcoming meetings scheduled.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Past meetings */}
            <div>
                <h2 className="font-semibold text-gray-900 mb-4">Past Meetings</h2>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="space-y-3 p-4 md:hidden">
                        {loading ? (
                          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-400">Loading…</div>
                        ) : past.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-400">No past meetings.</div>
                        ) : past.map((m) => (
                          <div key={m._id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">{m.type || 'Meeting'}</p>
                                <p className="mt-1 text-sm text-gray-600">
                                  {m.date ? new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                  {m.time ? ` · ${m.time}` : ''}
                                </p>
                              </div>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[m.status || ''] || STATUS_STYLES.completed}`}>
                                {m.status || 'completed'}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span>📹 Video</span>
                              <span>{m.note || '—'}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100 text-left">
                                    <th className="px-5 py-3.5 font-medium text-gray-500">Meeting</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500">Date & Time</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500">Type</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500">Attendees</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                  <tr><td className="px-5 py-6 text-gray-400 text-sm" colSpan={5}>Loading…</td></tr>
                                ) : past.map((m) => (
                                    <tr key={m._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-4 font-medium text-gray-800">{m.type || 'Meeting'}</td>
                                        <td className="px-5 py-4 text-gray-600">
                                          {m.date ? new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                          {m.time ? ` · ${m.time}` : ''}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 capitalize">📹 Video</td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">{m.note || '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[m.status || ''] || STATUS_STYLES.completed}`}>
                                                {m.status || 'completed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && past.length === 0 && (
                      <div className="hidden p-10 text-center md:block">
                        <p className="text-gray-400 text-sm">No past meetings.</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
}
