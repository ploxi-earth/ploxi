// src/components/pages/CompliancePage.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Calendar, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Search,
  Filter,
  X,
  ExternalLink,
  BookOpen,
  AlertCircle,
  Building2
} from 'lucide-react';
import complianceData from '@/data/complianceData.json';

const CompliancePage = () => {
  // Get location from localStorage (set during dashboard configuration)
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [taskProgress, setTaskProgress] = useState({});

  // Load location and task progress on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.location) {
          const locationKey = config.location.code.toLowerCase() === 'in' ? 'india' : 
                             config.location.code.toLowerCase() === 'us' ? 'usa' :
                             config.location.code.toLowerCase() === 'eu' ? 'eu' : 'uae';
          setSelectedLocation(locationKey);
        }
      } catch (err) {
        console.error('Failed to load location config:', err);
        setSelectedLocation('india'); // Default fallback
      }
    } else {
      setSelectedLocation('india'); // Default fallback
    }

    // Load saved task progress
    const savedProgress = localStorage.getItem('complianceProgress');
    if (savedProgress) {
      try {
        setTaskProgress(JSON.parse(savedProgress));
      } catch (err) {
        console.error('Failed to load task progress:', err);
      }
    }
  }, []);

  // Save task progress when it changes
  useEffect(() => {
    if (Object.keys(taskProgress).length > 0) {
      localStorage.setItem('complianceProgress', JSON.stringify(taskProgress));
    }
  }, [taskProgress]);

  // Get current region data
  const currentRegion = selectedLocation ? complianceData.regions[selectedLocation] : null;

  // Handle location change (for demonstration - in real app this would come from dashboard)
  const handleLocationChange = (locationKey) => {
    setSelectedLocation(locationKey);
    setActiveCategory('all');
    setSearchQuery('');
    setFilterStatus('all');
  };

  // Handle task status update
  const updateTaskStatus = (taskId, newStatus) => {
    setTaskProgress(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        status: newStatus,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Handle file download simulation
  const handleDownload = (document) => {
    // Simulate file download
    console.log(`Downloading: ${document.title}`);
    
    // Create a temporary download link simulation
    const link = document.createElement('a');
    link.href = '#';
    link.download = document.title;
    link.click();
    
    // Show success message
    alert(`Downloaded: ${document.title}`);
  };

  // Get all tasks from all categories
  const getAllTasks = () => {
    if (!currentRegion) return [];
    
    return Object.values(currentRegion.categories).flatMap(category => 
      category.tasks.map(task => ({
        ...task,
        categoryName: category.name,
        categoryColor: category.color,
        categoryBg: category.bgColor
      }))
    );
  };

  // Filter tasks based on search and filters
  const filteredTasks = getAllTasks().filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const taskStatus = taskProgress[task.id]?.status || task.status;
    const matchesStatus = filterStatus === 'all' || taskStatus === filterStatus;
    
    const matchesCategory = activeCategory === 'all' || 
      task.categoryName.toLowerCase().includes(activeCategory.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate compliance statistics
  const getComplianceStats = () => {
    const allTasks = getAllTasks();
    const total = allTasks.length;
    const completed = allTasks.filter(task => 
      (taskProgress[task.id]?.status || task.status) === 'completed'
    ).length;
    const inProgress = allTasks.filter(task => 
      (taskProgress[task.id]?.status || task.status) === 'in-progress'
    ).length;
    const overdue = allTasks.filter(task => {
      const status = taskProgress[task.id]?.status || task.status;
      return status !== 'completed' && new Date(task.deadline) < new Date();
    }).length;

    return { total, completed, inProgress, overdue, completionRate: Math.round((completed / total) * 100) };
  };

  const stats = currentRegion ? getComplianceStats() : { total: 0, completed: 0, inProgress: 0, overdue: 0, completionRate: 0 };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!selectedLocation || !currentRegion) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Compliance Data</h3>
          <p className="text-gray-600">Setting up your location-specific compliance requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-white mb-4">
          ESG Compliance Management
        </h1>
        <p className="text-white-600 max-w-3xl mx-auto">
          Stay compliant with location-specific ESG regulations, track your progress, and access 
          essential compliance resources tailored to your region.
        </p>
      </div>

      {/* Location & Stats Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Current Location */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              {currentRegion.flag}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentRegion.name}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>Primary Frameworks: {currentRegion.primaryFrameworks.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Location Switcher (for demo purposes) */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Switch Region:</span>
            {Object.entries(complianceData.regions).map(([key, region]) => (
              <button
                key={key}
                onClick={() => handleLocationChange(key)}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                  ${selectedLocation === key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {region.flag} {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Compliance Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'all', name: 'All Tasks', icon: Shield },
            ...Object.entries(currentRegion.categories).map(([key, category]) => ({
              id: key,
              name: category.name,
              icon: key === 'environmental' ? FileText : key === 'social' ? AlertTriangle : CheckCircle
            }))
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 px-4 py-4 font-medium transition-all duration-200
                  ${activeCategory === tab.id
                    ? 'bg-[#e9f1ea] text-green-700 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search compliance tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-6">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const taskStatus = taskProgress[task.id]?.status || task.status;
                const isOverdue = taskStatus !== 'completed' && new Date(task.deadline) < new Date();
                
                return (
                  <div
                    key={task.id}
                    className={`
                      p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                      ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}
                    `}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {task.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{task.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(taskStatus)}`}>
                                {taskStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {task.category}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                {isOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Building2 className="w-4 h-4" />
                                <span>{task.authority}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 min-w-32">
                        <select
                          value={taskStatus}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Documents & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Documents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Compliance Documents</span>
            </h3>
            <span className="text-sm text-gray-500">{currentRegion.documents.length} items</span>
          </div>

          <div className="space-y-4">
            {currentRegion.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{doc.type} • {doc.size}</span>
                    <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(doc)}
                  className="ml-4 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Regulations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Key Regulations</span>
            </h3>
            <span className="text-sm text-gray-500">{currentRegion.regulations.length} items</span>
          </div>

          <div className="space-y-4">
            {currentRegion.regulations.map((reg) => (
              <div
                key={reg.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{reg.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{reg.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Authority: {reg.authority}</span>
                      <span>Last Updated: {new Date(reg.lastAmendment).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Applies to: {reg.applicability}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-2 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;
