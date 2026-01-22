'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FileUpload from '@/components/admin/FileUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { generateSlug } from '@/lib/utils/slugify';

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo_url: '',
    tagline: '',
    category: '',
    founded_year: '',
    headquarters: '',
    website: '',
    contact_email: '',
    contact_phone: '',
    about_company: '',
    vision: '',
    mission: '',
    address: '',
    key_stats: {},
    strengths: [],
    services: [],
    tags: [],
    status: 'draft',
  });

  const [pastProjects, setPastProjects] = useState([]);
  const [liveProjects, setLiveProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [clients, setClients] = useState([]);

  const [errors, setErrors] = useState({});

  // Dynamic fields
  const [strengthInput, setStrengthInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [statKey, setStatKey] = useState('');
  const [statValue, setStatValue] = useState('');

  // Milestone fields
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDescription, setMilestoneDescription] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');

  // Client fields
  const [clientName, setClientName] = useState('');
  const [clientLogoUrl, setClientLogoUrl] = useState('');
  const [clientDescription, setClientDescription] = useState('');

  // Load vendor data
  useEffect(() => {
    fetchVendor();
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`);
      const data = await response.json();

      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        logo_url: data.logo_url || '',
        tagline: data.tagline || '',
        category: data.category || '',
        founded_year: data.founded_year || '',
        headquarters: data.headquarters || '',
        website: data.website || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        about_company: data.about_company || '',
        vision: data.vision || '',
        mission: data.mission || '',
        address: data.address || '',
        key_stats: data.key_stats || {},
        strengths: data.strengths || [],
        services: data.services || [],
        tags: data.tags || [],
        status: data.status || 'draft',
      });

      // Fetch related data
      await fetchPastProjects();
      await fetchLiveProjects();
      await fetchDocuments();
      await fetchMilestones();
      await fetchClients();

    } catch (error) {
      console.error('Error fetching vendor:', error);
      alert('Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPastProjects = async () => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/past-projects`);
      const data = await response.json();
      setPastProjects(data);
    } catch (error) {
      console.error('Error fetching past projects:', error);
    }
  };

  const fetchLiveProjects = async () => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/live-projects`);
      const data = await response.json();
      setLiveProjects(data);
    } catch (error) {
      console.error('Error fetching live projects:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/documents`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/milestones`);
      const data = await response.json();
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/clients`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Update slug when name changes
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  // Array management functions (same as Add page)
  const addStrength = () => {
    if (strengthInput.trim()) {
      setFormData({
        ...formData,
        strengths: [...formData.strengths, strengthInput.trim()],
      });
      setStrengthInput('');
    }
  };

  const removeStrength = (index) => {
    setFormData({
      ...formData,
      strengths: formData.strengths.filter((_, i) => i !== index),
    });
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, serviceInput.trim()],
      });
      setServiceInput('');
    }
  };

  const removeService = (index) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const addKeyStat = () => {
    if (statKey.trim() && statValue.trim()) {
      setFormData({
        ...formData,
        key_stats: {
          ...formData.key_stats,
          [statKey.trim()]: statValue.trim(),
        },
      });
      setStatKey('');
      setStatValue('');
    }
  };

  const removeKeyStat = (key) => {
    const newStats = { ...formData.key_stats };
    delete newStats[key];
    setFormData({
      ...formData,
      key_stats: newStats,
    });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Vendor name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (status) => {
    if (!validate()) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
        }),
      });

      if (!response.ok) throw new Error('Failed to update vendor');

      alert(`Vendor updated successfully!`);
      router.push('/admin/vendors');
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor');
    } finally {
      setSaving(false);
    }
  };

  // Delete past project
  const deletePastProject = async (projectId) => {
    if (!confirm('Delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/past-projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPastProjects();
        alert('Project deleted');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Delete live project
  const deleteLiveProject = async (projectId) => {
    if (!confirm('Delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/live-projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLiveProjects();
        alert('Project deleted');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Delete document
  const deleteDocument = async (docId) => {
    if (!confirm('Delete this document?')) return;

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/documents/${docId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDocuments();
        alert('Document deleted');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Add milestone
  const addMilestone = async () => {
    if (!milestoneTitle.trim()) {
      alert('Please enter a milestone title');
      return;
    }

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: milestoneTitle,
          description: milestoneDescription,
          milestone_date: milestoneDate || null,
          display_order: milestones.length,
        }),
      });

      if (response.ok) {
        setMilestoneTitle('');
        setMilestoneDescription('');
        setMilestoneDate('');
        fetchMilestones();
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      alert('Failed to add milestone');
    }
  };

  // Delete milestone
  const deleteMilestone = async (milestoneId) => {
    if (!confirm('Delete this milestone?')) return;

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/milestones/${milestoneId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMilestones();
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  // Add client
  const addClient = async () => {
    if (!clientName.trim()) {
      alert('Please enter a client name');
      return;
    }

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_logo_url: clientLogoUrl,
          description: clientDescription,
          display_order: clients.length,
        }),
      });

      if (response.ok) {
        setClientName('');
        setClientLogoUrl('');
        setClientDescription('');
        fetchClients();
      }
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    }
  };

  // Delete client
  const deleteClient = async (clientId) => {
    if (!confirm('Delete this client?')) return;

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClients();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-gray-600">Loading vendor data...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Company Details' },
    { id: 'address', label: 'Address' },
    { id: 'content', label: 'Content' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'clients', label: 'Clients' },
    { id: 'delivered', label: 'Delivered Projects' },
    { id: 'current', label: 'Current Projects' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/ploxi earth logo.jpeg"
                alt="Ploxi Earth"
                width={56}
                height={56}
                className="rounded-lg object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ploxi Earth Admin</h1>
                <p className="text-sm text-green-600 font-medium">Sustainability Platform Management</p>
              </div>
            </div>
            <Link
              href="/admin/vendors"
              className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              ← Back to Vendors
            </Link>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Vendor</h2>
                  <p className="text-gray-600 text-sm mt-1">{formData.name}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmit('draft')}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit('published')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Basic Info Tab - Same as Add page */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <FileUpload
                  label="Company Logo *"
                  accept="image/*"
                  onUpload={(url) => setFormData({ ...formData, logo_url: url })}
                />
                {formData.logo_url && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Logo:</p>
                    <img src={formData.logo_url} alt="Logo" className="w-32 h-32 object-contain border rounded-lg" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Details Tab - Same as Add page */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      value={formData.founded_year}
                      onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headquarters
                    </label>
                    <input
                      type="text"
                      value={formData.headquarters}
                      onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Key Stats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Statistics
                  </label>
                  <div className="space-y-3">
                    {Object.entries(formData.key_stats).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="flex-1 flex gap-3">
                          <input
                            type="text"
                            value={key}
                            disabled
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                          <input
                            type="text"
                            value={value}
                            disabled
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <button
                          onClick={() => removeKeyStat(key)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={statKey}
                        onChange={(e) => setStatKey(e.target.value)}
                        placeholder="Label"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={statValue}
                        onChange={(e) => setStatValue(e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={addKeyStat}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Strengths
                  </label>
                  <div className="space-y-2">
                    {formData.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={strength}
                          disabled
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => removeStrength(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={strengthInput}
                        onChange={(e) => setStrengthInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addStrength()}
                        placeholder="Add strength"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={addStrength}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services Offered
                  </label>
                  <div className="space-y-2">
                    {formData.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={service}
                          disabled
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => removeService(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addService()}
                        placeholder="Add service"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={addService}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(index)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Company
                  </label>
                  <RichTextEditor
                    value={formData.about_company}
                    onChange={(value) => setFormData({ ...formData, about_company: value })}
                    placeholder="Write about the company..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Statement
                  </label>
                  <RichTextEditor
                    value={formData.vision}
                    onChange={(value) => setFormData({ ...formData, vision: value })}
                    placeholder="Company vision..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Statement
                  </label>
                  <RichTextEditor
                    value={formData.mission}
                    onChange={(value) => setFormData({ ...formData, mission: value })}
                    placeholder="Company mission..."
                  />
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter complete address (street, city, state, country, postal code)"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the complete physical address of the company
                  </p>
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Milestone</h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={milestoneTitle}
                        onChange={(e) => setMilestoneTitle(e.target.value)}
                        placeholder="e.g., Reached 100 MW Capacity"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={milestoneDescription}
                        onChange={(e) => setMilestoneDescription(e.target.value)}
                        placeholder="Brief description of the milestone"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={milestoneDate}
                        onChange={(e) => setMilestoneDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={addMilestone}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Milestone
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {milestones.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No milestones added yet
                    </div>
                  ) : (
                    milestones.map((milestone) => (
                      <div key={milestone.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900 text-lg">{milestone.title}</h4>
                          <button
                            onClick={() => deleteMilestone(milestone.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {milestone.milestone_date && (
                          <p className="text-sm text-blue-600 font-medium mb-2">
                            {new Date(milestone.milestone_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                        {milestone.description && (
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Client</h3>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g., Tata Power"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Logo
                      </label>
                      <FileUpload
                        label="Upload Client Logo"
                        accept="image/*"
                        onUpload={(url) => setClientLogoUrl(url)}
                      />
                      {clientLogoUrl && (
                        <div className="mt-2">
                          <img src={clientLogoUrl} alt="Preview" className="w-24 h-24 object-contain border rounded-lg" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={clientDescription}
                        onChange={(e) => setClientDescription(e.target.value)}
                        placeholder="Brief description or project details"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={addClient}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Client
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {clients.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No clients added yet
                    </div>
                  ) : (
                    clients.map((client) => (
                      <div key={client.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => deleteClient(client.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {client.client_logo_url && (
                          <div className="w-full h-20 flex items-center justify-center mb-3 bg-gray-50 rounded-lg">
                            <img
                              src={client.client_logo_url}
                              alt={client.client_name}
                              className="max-w-full max-h-full object-contain p-2"
                            />
                          </div>
                        )}
                        <h4 className="font-semibold text-gray-900 text-center text-sm mb-1">
                          {client.client_name}
                        </h4>
                        {client.description && (
                          <p className="text-xs text-gray-600 text-center line-clamp-2">
                            {client.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Delivered Projects Tab (formerly Past Projects) */}
            {activeTab === 'delivered' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Past Projects</h3>
                  <Link
                    href={`/admin/vendors/${vendorId}/past-projects/add`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-900">{project.project_name}</h4>
                        <button
                          onClick={() => deletePastProject(project.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {project.capacity && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Capacity:</span> {project.capacity}
                        </p>
                      )}
                      {project.location && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Location:</span> {project.location}
                        </p>
                      )}
                      {project.completion_year && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Completion Year:</span> {project.completion_year}
                        </p>
                      )}
                      {project.display_order !== undefined && (
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Display Order:</span> {project.display_order}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {pastProjects.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No past projects added yet
                  </div>
                )}
              </div>
            )}

            {/* Current Projects Tab (formerly Live Projects) */}
            {activeTab === 'current' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Live Projects</h3>
                  <Link
                    href={`/admin/vendors/${vendorId}/live-projects/add`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Link>
                </div>

                <div className="space-y-4">
                  {liveProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{project.project_name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{project.short_description}</p>
                          {project.project_url && (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => deleteLiveProject(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {liveProjects.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No live projects added yet
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                  <Link
                    href={`/admin/vendors/${vendorId}/documents/upload`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </Link>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                      <div>
                        <p className="font-medium text-gray-900">{doc.file_name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.document_type} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          View
                        </a>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {documents.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No documents uploaded yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
