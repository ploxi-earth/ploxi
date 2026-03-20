'use client';
import {
  CheckCircleIcon,
  MailIcon,
  EditIcon,
  FileIcon,
} from '@/components/vendor/VendorIcons';

type DocStatus = 'signed' | 'sent' | 'draft';

interface Agreement {
    id: number;
    name: string;
    status: DocStatus;
    date: string;
}

interface SharedDoc {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    uploadedBy: string;
}

const AGREEMENTS: Agreement[] = [
    { id: 1, name: 'Vendor Partnership Agreement 2026', status: 'signed', date: '10 Feb 2026' },
    { id: 2, name: 'NDA – Confidentiality Agreement', status: 'signed', date: '05 Dec 2025' },
    { id: 3, name: 'Service Level Agreement (SLA)', status: 'sent', date: '14 Mar 2026' },
    { id: 4, name: 'Addendum – Carbon Credit Terms', status: 'draft', date: '16 Mar 2026' },
];

const SHARED_DOCS: SharedDoc[] = [
    { id: 1, name: 'Ploxi Brand Guidelines.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '01 Mar 2026', uploadedBy: 'Ploxi Admin' },
    { id: 2, name: 'Vendor Handbook 2026.pdf', type: 'PDF', size: '5.1 MB', uploadedAt: '15 Feb 2026', uploadedBy: 'Ploxi Admin' },
    { id: 3, name: 'Project Scope Template.docx', type: 'DOCX', size: '340 KB', uploadedAt: '20 Jan 2026', uploadedBy: 'Ploxi PM' },
    { id: 4, name: 'Invoice Template.xlsx', type: 'XLSX', size: '120 KB', uploadedAt: '10 Jan 2026', uploadedBy: 'Ploxi Finance' },
];

const STATUS_STYLES: Record<DocStatus, { label: string; classes: string; icon: React.ReactNode }> = {
    signed: { label: 'Signed', classes: 'bg-emerald-100 text-emerald-700', icon: <CheckCircleIcon className="w-4 h-4" /> },
    sent: { label: 'Pending Signature', classes: 'bg-amber-100 text-amber-700', icon: <MailIcon className="w-4 h-4" /> },
    draft: { label: 'Draft', classes: 'bg-gray-100 text-gray-500', icon: <EditIcon className="w-4 h-4" /> },
};

const FILE_ICONS: Record<string, React.ReactNode> = {
    PDF: <FileIcon className="w-4 h-4 text-red-600" />,
    DOCX: <FileIcon className="w-4 h-4 text-blue-600" />,
    XLSX: <FileIcon className="w-4 h-4 text-green-600" />,
};

export default function VendorDocumentsPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                    <p className="text-gray-500 text-sm mt-0.5">View agreements and shared files</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    Upload Document
                </button>
            </div>

            {/* Agreements */}
            <div className="mb-8">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-gray-600" /> Agreements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AGREEMENTS.map((a) => {
                        const s = STATUS_STYLES[a.status];
                        return (
                            <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-primary-100 transition-all group">
                                <div className="flex items-start gap-3">
                                    <div className="text-emerald-600">{s.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">{a.name}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.classes}`}>
                                                {s.label}
                                            </span>
                                            <span className="text-xs text-gray-400">{a.date}</span>
                                        </div>
                                    </div>
                                    <button className="flex-shrink-0 text-gray-300 hover:text-primary-500 transition-colors p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Shared Documents */}
            <div>
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileIcon className="w-5 h-5 text-gray-600" /> Shared Documents
                </h2>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100 text-left">
                                    <th className="px-5 py-3.5 font-medium text-gray-500">File</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500">Size</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500">Uploaded</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500">By</th>
                                    <th className="px-5 py-3.5 font-medium text-gray-500 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SHARED_DOCS.map((d) => (
                                    <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="flex items-center gap-2 font-medium text-gray-800">
                                                {FILE_ICONS[d.type] || <FileIcon className="w-4 h-4 text-gray-600" />}
                                                {d.name}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{d.size}</td>
                                        <td className="px-5 py-4 text-gray-500">{d.uploadedAt}</td>
                                        <td className="px-5 py-4 text-gray-500">{d.uploadedBy}</td>
                                        <td className="px-5 py-4 text-right">
                                            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                                                Download
                                            </button>
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
