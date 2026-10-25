import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import api from '../../lib/api';
import { AdminDashboardStats, ApiResponse } from '../../types';
import {
  BarChart3,
  Download,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  PieChart as PieChartIcon
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

export const AnalyticsReportsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<AdminDashboardStats>>('/api/admin/analytics');
        if (res.data.success && res.data.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExport = () => {
    window.open('/api/admin/reports/export', '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const COLORS = ['#2563EB', '#4F46E5', '#7C3AED', '#059669', '#D97706', '#DC2626', '#475569'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Recruitment Analytics & Accreditation Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated conversion rates, department placement distributions, and verified CSV exports.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download Official CSV Report
        </Button>
      </div>

      {/* Conversion Funnel Rates Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Batch Placement Rate
          </span>
          <p className="text-4xl font-black text-blue-950 mt-2">
            {stats?.placementRatePercentage}%
          </p>
          <p className="text-xs text-blue-800/80 mt-2 leading-relaxed">
            Denominator: {stats?.totalStudents} total registered students.
            Numerator: {stats?.distinctStudentsWithOffers} students with verified offers.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Shortlisting Rate
          </span>
          <p className="text-4xl font-black text-indigo-950 mt-2">
            {stats?.shortlistingRatePercentage}%
          </p>
          <p className="text-xs text-indigo-800/80 mt-2 leading-relaxed">
            {stats?.totalShortlisted} candidate shortlists from {stats?.totalApplications} total applications submitted.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Interview-to-Offer Conversion
          </span>
          <p className="text-4xl font-black text-emerald-950 mt-2">
            {stats?.interviewToOfferConversionPercentage}%
          </p>
          <p className="text-xs text-emerald-800/80 mt-2 leading-relaxed">
            {stats?.totalOffersMade} offers extended across {stats?.totalInterviewsScheduled} scheduled interview rounds.
          </p>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Offers by Department */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-1">Offers Extended by Department</h3>
          <p className="text-xs text-slate-500 mb-6">Placement outcomes across engineering branches</p>

          <div className="h-72">
            {stats?.offersByDepartment && stats.offersByDepartment.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.offersByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                      color: '#ffffff',
                      padding: '8px 12px',
                    }}
                    itemStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 600 }}
                    labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}
                  />
                  <Bar dataKey="offers" fill="#10B981" radius={[6, 6, 0, 0]} name="Offers" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No offers recorded yet
              </div>
            )}
          </div>
        </Card>

        {/* 2. Offers by Graduation Year */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-1">Outcomes by Graduation Class</h3>
          <p className="text-xs text-slate-500 mb-6">Placement performance by batch</p>

          <div className="h-72">
            {stats?.offersByGraduationYear && stats.offersByGraduationYear.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.offersByGraduationYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="graduationYear" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                      color: '#ffffff',
                      padding: '8px 12px',
                    }}
                    itemStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 600 }}
                    labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}
                  />
                  <Bar dataKey="studentsPlaced" fill="#6366F1" radius={[6, 6, 0, 0]} name="Placed Students" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No batch outcomes recorded yet
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* CSV Formula Injection Protection Notice */}
      <Card className="p-5 bg-slate-50 border-slate-200">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">
              Security Compliance: Spreadsheet Formula Injection Mitigation
            </p>
            <p className="leading-relaxed">
              In accordance with security requirements, Placera's server-side CSV export engine automatically sanitizes all cell values starting with symbols (=, +, -, @) by prepending a single quote. This eliminates CSV formula injection risks when opening reports in Microsoft Excel or Google Sheets.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
