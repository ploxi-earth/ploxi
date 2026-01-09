import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function VendorHero({ vendor }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Logo */}
          {vendor.logo_url && (
            <div className="w-40 h-40 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center">
              <img
                src={vendor.logo_url}
                alt={vendor.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              {vendor.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {vendor.name}
            </h1>
            {vendor.tagline && (
              <p className="text-xl text-blue-100 mb-6">
                {vendor.tagline}
              </p>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Website</span>
                </a>
              )}
              {vendor.contact_email && (
                <a
                  href={`mailto:${vendor.contact_email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              )}
              {vendor.contact_phone && (
                <a
                  href={`tel:${vendor.contact_phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{vendor.contact_phone}</span>
                </a>
              )}
            </div>

            {/* Location */}
            {vendor.headquarters && (
              <div className="flex items-center gap-2 justify-center md:justify-start mt-4 text-blue-100">
                <MapPin className="w-4 h-4" />
                <span>{vendor.headquarters}</span>
                {vendor.founded_year && (
                  <span className="ml-2">• Founded {vendor.founded_year}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
