import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { JobWizardModal } from '../../components/admin/JobWizardModal';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../lib/api';
import { Job, JobStatus, ApiResponse, PageResponse } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobsManagementPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { success, error } = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      params.append('page', page.toString());
      params.append('size', '15');

      const res = await api.get<ApiResponse<PageResponse<Job>>>(`/api/admin/jobs?${params.toString()}`);
      if (res.data.success && res.data.data) {
        setJobs(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load admin jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, selectedStatus]);

  const handlePublish = async (id: number) => {
    try {
      await api.patch(`/api/admin/jobs/${id}/publish`);
      success('Job published to student portal');
      fetchJobs();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to publish job');
    }
  };

  const handleClose = async (id: number) => {
    try {
      await api.patch(`/api/admin/jobs/${id}/close`);
      success('Job posting closed from further applications');
      fetchJobs();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to close job');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Recruitment Drives
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author, publish, and monitor corporate recruitment drives with eligibility enforcement.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsWizardOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Recruitment Drive
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 pb-2">
        {['', 'PUBLISHED', 'DRAFT', 'CLOSED'].map((st) => (
          <button
            key={st}
            onClick={() => {
              setSelectedStatus(st);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedStatus === st
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === '' ? 'All Drives' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-10">
            <EmptyState
              icon={Briefcase}
              title="No recruitment drives found"
              description="Create a recruitment drive to define job requirements and eligibility rules."
              actionText="Create New Drive"
              onAction={() => setIsWizardOpen(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-bold">Drive Title & Company</th>
                  <th className="py-3.5 px-6 font-bold">Format</th>
                  <th className="py-3.5 px-6 font-bold">Compensation</th>
                  <th className="py-3.5 px-6 font-bold">Criteria</th>
                  <th className="py-3.5 px-6 font-bold">Deadline</th>
                  <th className="py-3.5 px-6 font-bold">Applicants</th>
                  <th className="py-3.5 px-6 font-bold">Status</th>
                  <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                          {job.company.name}
                        </span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{job.title}</p>
                        <p className="text-[11px] text-slate-400">{job.location}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <Badge status={job.jobType} size="sm" />
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-800">
                      {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                    </td>

                    <td className="py-4 px-6">
                      {job.eligibilityRule ? (
                        <div className="text-[11px] text-slate-600 space-y-0.5">
                          <div>Min CGPA: <span className="font-bold text-slate-900">{job.eligibilityRule.minCgpa.toFixed(1)}</span></div>
                          <div>Max Backlogs: <span className="font-bold text-slate-900">{job.eligibilityRule.maxBacklogs}</span></div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Open</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(job.deadline)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <Link
                        to={`/admin/applications?jobId=${job.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantsCount} Candidates</span>
                      </Link>
                    </td>

                    <td className="py-4 px-6">
                      <Badge status={job.status} size="sm" />
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.status === 'DRAFT' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handlePublish(job.id)}
                          >
                            Publish
                          </Button>
                        )}
                        {job.status === 'PUBLISHED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClose(job.id)}
                            className="text-rose-600 hover:bg-rose-50"
                          >
                            Close
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Creation Wizard Modal */}
      <JobWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => fetchJobs()}
      />
    </div>
  );
};
