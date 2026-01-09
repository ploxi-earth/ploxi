import { FileText, Download, Mail } from 'lucide-react';

export default function ResourcesSection({ documents, vendor }) {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Resources & Documents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Documents */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {doc.file_name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {doc.document_type.replace('_', ' ')} • {(doc.file_size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </a>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
            <p className="text-blue-100 mb-6">
              Interested in working with {vendor.name}? Reach out to discuss your project requirements.
            </p>
            <div className="space-y-3">
              {vendor.contact_email && (
                <a
                  href={`mailto:${vendor.contact_email}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{vendor.contact_email}</span>
                </a>
              )}
              {vendor.contact_phone && (
                <a
                  href={`tel:${vendor.contact_phone}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <span className="text-xl">📞</span>
                  <span>{vendor.contact_phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
