import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../lib/api';
import { Company, ApiResponse, PageResponse } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  MapPin,
  Edit2,
  CheckCircle2,
  XCircle,
  Briefcase
} from 'lucide-react';

export const CompaniesManagementPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const { success, error } = useToast();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query.trim());
      params.append('page', page.toString());
      params.append('size', '12');

      const res = await api.get<ApiResponse<PageResponse<Company>>>(`/api/admin/companies?${params.toString()}`);
      if (res.data.success && res.data.data) {
        setCompanies(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setName('');
    setIndustry('');
    setDescription('');
    setWebsite('');
    setLocation('');
    setLogoUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Company) => {
    setEditingCompany(c);
    setName(c.name);
    setIndustry(c.industry);
    setDescription(c.description || '');
    setWebsite(c.website || '');
    setLocation(c.location || '');
    setLogoUrl(c.logoUrl || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !industry) {
      error('Company name and industry are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        industry: industry.trim(),
        description: description.trim() || undefined,
        website: website.trim() || undefined,
        location: location.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
      };

      if (editingCompany) {
        await api.put(`/api/admin/companies/${editingCompany.id}`, payload);
        success('Company updated successfully');
      } else {
        await api.post('/api/admin/companies', payload);
        success('Company registered successfully');
      }

      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await api.patch(`/api/admin/companies/${id}/toggle-active`, { active: !currentActive });
      success(`Company ${!currentActive ? 'activated' : 'deactivated'}`);
      fetchCompanies();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to toggle active state');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Corporate Hiring Partners
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage corporate recruiting partnerships and company profiles.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Company
        </Button>
      </div>

      {/* Grid of Companies */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies registered yet"
          description="Register partner companies to start publishing campus recruitment drives."
          actionText="Add Partner Company"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-lg">
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{company.name}</h3>
                      <p className="text-xs text-blue-600 font-medium">{company.industry}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      company.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {company.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                  {company.description || 'No corporate overview provided.'}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  {company.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate"
                      >
                        {company.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(company.id, company.active)}
                  className={company.active ? 'text-slate-500' : 'text-emerald-600'}
                >
                  {company.active ? 'Deactivate' : 'Activate'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(company)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? 'Edit Partner Company' : 'Register New Partner Company'}
        description="Provide corporate details and recruitment contact specifications."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Legal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. TechFlow Systems"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Industry Sector *
              </label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Cloud Computing / FinTech"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Headquarters / Office Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Corporate Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Logo Image URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://.../logo.png"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Corporate Overview & Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of company operations, business domain, and culture..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              {editingCompany ? 'Save Changes' : 'Register Company'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
