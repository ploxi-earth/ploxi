'use client';

interface Meeting {
    id: number;
    title: string;
    date: string;
    time: string;
    type: 'video' | 'in-person';
    attendees: string[];
    status: 'upcoming' | 'completed' | 'cancelled';
    link?: string;
}

const SAMPLE_MEETINGS: Meeting[] = [
    { id: 1, title: 'Quarterly Business Review', date: '20 Mar 2026', time: '10:00 AM', type: 'video', attendees: ['Ploxi Team', 'You'], status: 'upcoming', link: '#' },
    { id: 2, title: 'Solar Rooftop Project Kickoff', date: '22 Mar 2026', time: '2:30 PM', type: 'video', attendees: ['GreenTech Solutions', 'Ploxi PM', 'You'], status: 'upcoming', link: '#' },
    { id: 3, title: 'Partnership Review – Q4 2025', date: '15 Jan 2026', time: '11:00 AM', type: 'video', attendees: ['Ploxi Team', 'You'], status: 'completed' },
    { id: 4, title: 'Onboarding Intro Call', date: '05 Dec 2025', time: '3:00 PM', type: 'video', attendees: ['Ploxi Onboarding', 'You'], status: 'completed' },
    { id: 5, title: 'Carbon Audit Scoping', date: '10 Feb 2026', time: '4:00 PM', type: 'in-person', attendees: ['EcoVentures India', 'Ploxi PM', 'You'], status: 'cancelled' },
];

const STATUS_STYLES: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-600',
};

export default function VendorMeetingsPage() {
    const upcoming = SAMPLE_MEETINGS.filter((m) => m.status === 'upcoming');
    const past = SAMPLE_MEETINGS.filter((m) => m.status !== 'upcoming');

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
                <p className="text-gray-500 text-sm mt-0.5">View and manage your scheduled meetings</p>
            </div>

            {/* Upcoming */}
            <div className="mb-8">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Upcoming ({upcoming.length})
                </h2>
                <div className="space-y-4">
                    {upcoming.map((m) => (
                        <div key={m.id} className="bg-white rounded-xl border border-blue-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow">
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center text-white shadow-sm">
                                <span className="text-xs font-medium leading-none">{m.date.split(' ')[1]}</span>
                                <span className="text-lg font-bold leading-none mt-0.5">{m.date.split(' ')[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900">{m.title}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        {m.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {m.type === 'video' ? '📹' : '📍'} {m.type === 'video' ? 'Video Call' : 'In-Person'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        👥 {m.attendees.join(', ')}
                                    </span>
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
                    {upcoming.length === 0 && (
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
                    <div className="overflow-x-auto">
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
                                {past.map((m) => (
                                    <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-4 font-medium text-gray-800">{m.title}</td>
                                        <td className="px-5 py-4 text-gray-600">{m.date} · {m.time}</td>
                                        <td className="px-5 py-4 text-gray-600 capitalize">{m.type === 'video' ? '📹 Video' : '📍 In-Person'}</td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">{m.attendees.join(', ')}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[m.status]}`}>
                                                {m.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
