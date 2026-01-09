import { CheckCircle, Briefcase } from 'lucide-react';

export default function AboutSection({ vendor }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Company */}
          {vendor.about_company && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About {vendor.name}
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: vendor.about_company }}
              />
            </div>
          )}

          {/* Vision */}
          {vendor.vision && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Vision</h3>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: vendor.vision }}
              />
            </div>
          )}

          {/* Mission */}
          {vendor.mission && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mission</h3>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: vendor.mission }}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Strengths */}
          {vendor.strengths && vendor.strengths.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Key Strengths
              </h3>
              <ul className="space-y-3">
                {vendor.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {vendor.services && vendor.services.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-green-600" />
                Services Offered
              </h3>
              <ul className="space-y-2">
                {vendor.services.map((service, index) => (
                  <li key={index} className="text-gray-700">
                    • {service}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {vendor.tags && vendor.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-3">TAGS</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
