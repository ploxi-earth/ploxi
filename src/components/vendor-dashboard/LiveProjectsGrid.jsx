import { ExternalLink, MapPin } from 'lucide-react';

export default function LiveProjectsGrid({ projects }) {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Live Projects & Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {project.thumbnail_url && (
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={project.thumbnail_url}
                    alt={project.project_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {project.project_name}
                  </h3>
                  {project.status && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : project.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">
                  {project.short_description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {project.capacity && (
                      <span className="font-medium text-blue-600">
                        {project.capacity}
                      </span>
                    )}
                    {project.location && (
                      <span className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </span>
                    )}
                  </div>

                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
