import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { JobWizardModal } from '../../components/admin/JobWizardModal';
import api from '../../lib/api';
import { AdminDashboardStats, ApiResponse } from '../../types';
import {
  Users,
  Briefcase,
  GitPullRequest,
  Calendar,
  Award,
  TrendingUp,
  Building2,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<AdminDashboardStats>>('/api/admin/dashboard');
      if (res.data.success && res.data.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportCsv = async () => {
    window.open('/api/admin/reports/export', '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#64748B'];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Placement Cell Executive Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time university recruitment operations, pipeline conversions, and accreditation outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsJobModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Job Drive
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-t-4 border-t-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Students
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stats?.totalStudents}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Corporate Partners:</span>
            <span className="font-bold text-slate-800">{stats?.totalCompanies}</span>
          </div>
        </Card>

        <Card className="p-5 border-t-4 border-t-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Drives
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stats?.totalPublishedJobs}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Total Applications:</span>
            <span className="font-bold text-slate-800">{stats?.totalApplications}</span>
          </div>
        </Card>

        <Card className="p-5 border-t-4 border-t-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Interviews Scheduled
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stats?.totalInterviewsScheduled}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Shortlisted:</span>
            <span className="font-bold text-slate-800">{stats?.totalShortlisted}</span>
          </div>
        </Card>

        <Card className="p-5 border-t-4 border-t-emerald-600 bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Batch Placement Rate
              </p>
              <p className="text-3xl font-black text-emerald-700 mt-1">
                {stats?.placementRatePercentage}%
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-100 text-[11px] text-emerald-800">
            <span>Students with Offers:</span>
            <span className="font-bold">{stats?.distinctStudentsWithOffers} / {stats?.totalStudents}</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Application Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Applications by Department</h3>
              <p className="text-xs text-slate-500 mt-0.5">Recruitment drive volume distribution</p>
            </div>
          </div>
          <div className="h-64">
            {stats?.applicationsByDepartment && stats.applicationsByDepartment.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.applicationsByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No application data recorded yet
              </div>
            )}
          </div>
        </Card>

        {/* Status Breakdown Pie/Bar */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Status Funnel</h3>
              <p className="text-xs text-slate-500 mt-0.5">Current stage across all candidate pipelines</p>
            </div>
          </div>
          <div className="h-64">
            {stats?.statusDistribution && stats.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {stats.statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No application data recorded yet
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Top Companies Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Recruiting Partners</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ranked by total applications received</p>
          </div>
          <Link to="/admin/companies" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
            Manage Companies →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Company Name</th>
                <th className="py-3 px-4 font-bold">Applications Received</th>
                <th className="py-3 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.topCompaniesByApplications && stats.topCompaniesByApplications.length > 0 ? (
                stats.topCompaniesByApplications.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{c.company}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{c.count}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        Active Partner
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    No company recruitment activity yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Job Wizard Modal */}
      <JobWizardModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSuccess={() => fetchStats()}
      />
    </div>
  );
};
