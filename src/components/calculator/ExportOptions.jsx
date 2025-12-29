'use client';

// src/components/calculator/ExportOptions.jsx
// Export and save calculation options

import { useState } from 'react';
import { Download, FileText, Save } from 'lucide-react';
import { exportToCSV, downloadCSV } from '@/lib/calculatorUtils';
import { generateAndDownloadPDF } from '@/lib/pdfGenerator';

export default function ExportOptions({
  calculationData,
  totals,
  equivalencies,
  onSave,
}) {
  const [companyName, setCompanyName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Handle CSV export
  const handleExportCSV = () => {
    try {
      setIsExporting(true);
      const csvContent = exportToCSV(calculationData, totals);
      const timestamp = new Date().toISOString().split('T')[0];
      downloadCSV(csvContent, `ghg-emissions-${timestamp}.csv`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle PDF export
  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().split('T')[0];
      const company = companyName || 'Your Organization';
      generateAndDownloadPDF(
        calculationData,
        totals,
        equivalencies,
        company,
        `ghg-emissions-report-${timestamp}.pdf`
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle save calculation
  const handleSave = () => {
    if (onSave) {
      onSave(companyName);
      setShowSaveModal(false);
      setCompanyName('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Export & Save
      </h3>

      {/* Company Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization Name (Optional)
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your organization name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          This will appear on exported reports
        </p>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* PDF Export */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting || totals.total === 0}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          <FileText className="w-5 h-5" />
          <span>Export PDF</span>
        </button>

        {/* CSV Export */}
        <button
          onClick={handleExportCSV}
          disabled={isExporting || totals.total === 0}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Save Button (for logged-in users or localStorage) */}
      {onSave && (
        <div className="mt-3">
          <button
            onClick={() => setShowSaveModal(true)}
            disabled={totals.total === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            <Save className="w-5 h-5" />
            <span>Save Calculation</span>
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Export your calculations for record-keeping 
          or to share with stakeholders. PDF reports include detailed breakdowns and equivalencies.
        </p>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Save Calculation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your calculation will be saved locally in your browser. You can access it later 
              from the calculation history.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Q4 2025 Emissions"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}