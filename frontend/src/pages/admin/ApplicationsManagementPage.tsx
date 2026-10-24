import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusTransitionModal } from '../../components/admin/StatusTransitionModal';
import { InterviewScheduleModal } from '../../components/admin/InterviewScheduleModal';
import api from '../../lib/api';
import { Application, ApplicationStatus, ApiResponse, PageResponse } from '../../types';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import {
  GitPullRequest,
  Search,
  Filter,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const ApplicationsManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);

  // Modals
  const [transitionApp, setTransitionApp] = useState<Application | null>(null);
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query.trim());
      if (urlJobId) params.append('jobId', urlJobId);
      if (selectedStatus) params.append('status', selectedStatus);
      if (department) params.append('department', department);
      params.append('page', page.toString());
      params.append('size', '15');

      const res = await api.get<ApiResponse<PageResponse<Application>>>(`/api/admin/applications?${params.toString()}`);
      if (res.data.success && res.data.data) {
        setApplications(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
        setTotalApplications(res.data.data.totalElements);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, selectedStatus, department, urlJobId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchApplications();
  };

  const handleExportCsv = () => {
    window.open('/api/admin/reports/export', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Application Pipeline & Stage Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Advance candidates, record internal evaluation notes, and schedule interview rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export All to CSV
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student, registration number, or job title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">All Recruitment Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="TECHNICAL_INTERVIEW">Tech Interview</option>
              <option value="HR_INTERVIEW">HR Interview</option>
              <option value="SELECTED">Selected / Offered</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <Button variant="primary" size="sm" type="submit" className="w-full h-full">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Applications Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-10">
            <EmptyState
              icon={GitPullRequest}
              title="No applications match your filter"
              description="Adjust your search query or stage filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-bold">Candidate</th>
                  <th className="py-3.5 px-6 font-bold">Academics</th>
                  <th className="py-3.5 px-6 font-bold">Job Drive</th>
                  <th className="py-3.5 px-6 font-bold">Resume</th>
                  <th className="py-3.5 px-6 font-bold">Stage</th>
                  <th className="py-3.5 px-6 font-bold">Internal Note</th>
                  <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {app.student.user?.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {app.student.registrationNumber}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-slate-700">
                        <span className="font-bold text-slate-900">{app.student.cgpa.toFixed(2)} CGPA</span>
                        <p className="text-[11px] text-slate-400">
                          {app.student.department} • {app.student.backlogCount} backlogs
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-900">{app.job.title}</p>
                        <p className="text-[11px] text-blue-600 font-semibold">{app.job.company.name}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {app.resume ? (
                        <a
                          href={`/api/resumes/${app.resume.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>PDF Resume</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">None attached</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <Badge status={app.status} size="sm" />
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      {app.internalNotes ? (
                        <p className="text-[11px] text-slate-600 truncate" title={app.internalNotes}>
                          {app.internalNotes}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No internal notes</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTransitionApp(app)}
                        >
                          Update Stage
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setInterviewApp(app)}
                          leftIcon={<Calendar className="w-3.5 h-3.5" />}
                        >
                          Interview
                        </Button>
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

      {/* Stage Transition Modal */}
      {transitionApp && (
        <StatusTransitionModal
          isOpen={!!transitionApp}
          onClose={() => setTransitionApp(null)}
          applicationId={transitionApp.id}
          currentStatus={transitionApp.status}
          candidateName={transitionApp.student.user?.fullName || ''}
          jobTitle={transitionApp.job.title}
          onSuccess={() => fetchApplications()}
        />
      )}

      {/* Interview Scheduling Modal */}
      {interviewApp && (
        <InterviewScheduleModal
          isOpen={!!interviewApp}
          onClose={() => setInterviewApp(null)}
          applicationId={interviewApp.id}
          candidateName={interviewApp.student.user?.fullName || ''}
          jobTitle={interviewApp.job.title}
          onSuccess={() => fetchApplications()}
        />
      )}
    </div>
  );
};
