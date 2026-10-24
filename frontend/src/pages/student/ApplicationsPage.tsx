import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ApplicationTimeline } from '../../components/student/ApplicationTimeline';
import api from '../../lib/api';
import { Application, ApiResponse } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { FileCheck, Building2, Calendar, Clock, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [withdrawAppId, setWithdrawAppId] = useState<number | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { success, error } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<Application[]>>('/api/students/me/applications');
      if (res.data.success && res.data.data) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load student applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAppId) return;
    setIsWithdrawing(true);
    try {
      await api.patch(`/api/applications/${withdrawAppId}/withdraw`);
      success('Application successfully withdrawn');
      setWithdrawAppId(null);
      fetchApplications();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Tracking
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your recruitment progress across all corporate campus drives in real time.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No applications submitted yet"
          description="Browse published campus recruitment drives and submit applications."
          actionText="Explore Opportunities"
          onAction={() => (window.location.href = '/student/jobs')}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} hoverEffect className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  {app.job.company.logoUrl ? (
                    <img
                      src={app.job.company.logoUrl}
                      alt={app.job.company.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 font-extrabold text-xl flex items-center justify-center flex-shrink-0">
                      {app.job.company.name.charAt(0)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-blue-600 tracking-wide">
                        {app.job.company.name}
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <Badge status={app.status} size="sm" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      <Link to={`/student/jobs/${app.job.id}`} className="hover:text-blue-600 transition-colors">
                        {app.job.title}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                      <span>Applied on {formatDate(app.createdAt)}</span>
                      <span>•</span>
                      <span>{app.job.location}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(app.job.salaryMin)} - {formatCurrency(app.job.salaryMax)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:self-center flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApp(app)}
                  >
                    View Status Timeline
                  </Button>

                  {app.status !== 'SELECTED' &&
                    app.status !== 'REJECTED' &&
                    app.status !== 'WITHDRAWN' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => setWithdrawAppId(app.id)}
                      >
                        Withdraw
                      </Button>
                    )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Timeline Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Recruitment Status: ${selectedApp.job.title}`}
          description={`Company: ${selectedApp.job.company.name} • Applied on ${formatDate(selectedApp.createdAt)}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            <ApplicationTimeline
              currentStatus={selectedApp.status}
              history={selectedApp.statusHistory}
            />

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="primary" size="sm" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog for Withdrawal */}
      <Modal
        isOpen={!!withdrawAppId}
        onClose={() => setWithdrawAppId(null)}
        title="Confirm Application Withdrawal"
        description="Are you sure you want to withdraw your application?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Withdrawing will notify the placement cell and corporate recruiters. You cannot re-apply to this specific recruitment drive once withdrawn.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setWithdrawAppId(null)} disabled={isWithdrawing}>
              Keep Application
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleWithdraw}
              isLoading={isWithdrawing}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
