import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function VendorHero({ vendor }) {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-green-600 text-white overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTIwIDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek00IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Logo with glassmorphism */}
          {vendor.logo_url && (
            <div className="w-44 h-44 bg-white/95 backdrop-blur-lg rounded-3xl p-5 shadow-2xl flex items-center justify-center ring-4 ring-white/20 hover:scale-105 transition-transform duration-300">
              <img
                src={vendor.logo_url}
                alt={vendor.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-5 border border-white/30 shadow-lg">
              {vendor.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 drop-shadow-lg">
              {vendor.name}
            </h1>
            {vendor.tagline && (
              <p className="text-xl md:text-2xl text-blue-50 mb-8 font-light">
                {vendor.tagline}
              </p>
            )}

            {/* Contact Info with glassmorphism */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Visit Website</span>
                </a>
              )}
              {vendor.contact_email && (
                <a
                  href={`mailto:${vendor.contact_email}`}
                  className="flex items-center gap-2 px-5 py-3 bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </a>
              )}
              {vendor.contact_phone && (
                <a
                  href={`tel:${vendor.contact_phone}`}
                  className="flex items-center gap-2 px-5 py-3 bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">{vendor.contact_phone}</span>
                </a>
              )}
            </div>

            {/* Location with enhanced styling */}
            {vendor.headquarters && (
              <div className="flex items-center gap-3 justify-center md:justify-start text-blue-50 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 inline-flex border border-white/20">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{vendor.headquarters}</span>
                {vendor.founded_year && (
                  <span className="ml-2 text-blue-100">• Founded {vendor.founded_year}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
