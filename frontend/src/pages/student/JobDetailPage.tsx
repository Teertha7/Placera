import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { EligibilityBadge } from '../../components/student/EligibilityBadge';
import api from '../../lib/api';
import { Job, StudentProfile, ApiResponse, Application } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Briefcase
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchJobAndProfile = async () => {
      setLoading(true);
      try {
        const [jobRes, profileRes, appsRes] = await Promise.all([
          api.get<ApiResponse<Job>>(`/api/jobs/${id}`),
          api.get<ApiResponse<StudentProfile>>('/api/students/me').catch(() => null),
          api.get<ApiResponse<Application[]>>('/api/students/me/applications').catch(() => null),
        ]);

        if (jobRes.data.success && jobRes.data.data) {
          setJob(jobRes.data.data);
        }
        if (profileRes && profileRes.data?.success && profileRes.data.data) {
          setStudentProfile(profileRes.data.data);
        }
        if (appsRes && appsRes.data?.success && appsRes.data.data) {
          const applied = appsRes.data.data.some((a) => a.job.id === Number(id));
          setHasApplied(applied);
        }
      } catch (err) {
        console.error('Failed to load job details', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJobAndProfile();
  }, [id]);

  const handleApply = async () => {
    if (!studentProfile?.activeResume && (!studentProfile?.resumes || studentProfile.resumes.length === 0)) {
      error('Please upload your resume in Profile before applying');
      setIsApplyModalOpen(false);
      navigate('/student/profile');
      return;
    }

    setIsApplying(true);
    try {
      const res = await api.post<ApiResponse<Application>>(`/api/jobs/${id}/applications`, {});
      if (res.data.success) {
        success('Application submitted successfully!');
        setHasApplied(true);
        setIsApplyModalOpen(false);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit application';
      error(errorMsg);
      setIsApplyModalOpen(false);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-800">Recruitment drive not found</p>
        <Link to="/student/jobs" className="text-xs text-blue-600 font-semibold mt-2 inline-block">
          ← Back to drives
        </Link>
      </div>
    );
  }

  const isExpired = job.expired || new Date(job.deadline) < new Date();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/student/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to all recruitment drives
      </Link>

      {/* Main Header Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-5">
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 font-extrabold text-2xl flex items-center justify-center flex-shrink-0">
                {job.company.name.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-blue-600">{job.company.name}</span>
                <span className="text-xs text-slate-300">•</span>
                <Badge status={job.jobType} size="sm" />
                {isExpired && <Badge variant="rose" size="sm">Deadline Passed</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{job.title}</h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Deadline: {formatDate(job.deadline)}
                </span>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right flex-shrink-0">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
              Offered Compensation
            </span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
            </p>
          </div>
        </div>

        {/* Eligibility & CTA Action Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EligibilityBadge eligible={job.userEligible} reasons={job.ineligibilityReasons} />
            {job.userEligible ? (
              <span className="text-xs text-emerald-700 font-medium">
                You meet all university & corporate recruitment criteria
              </span>
            ) : (
              <span className="text-xs text-amber-800 font-medium">
                Review eligibility criteria below before requesting exemption
              </span>
            )}
          </div>

          <div>
            {hasApplied ? (
              <Button variant="outline" disabled className="bg-emerald-50 text-emerald-800 border-emerald-200">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                Application Submitted
              </Button>
            ) : isExpired ? (
              <Button variant="outline" disabled>
                Recruitment Drive Closed
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                disabled={job.userEligible === false}
                onClick={() => setIsApplyModalOpen(true)}
              >
                Apply for this Position
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Grid: Description & Eligibility Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Job Description & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Role Description & Overview
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Key Skills & Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Academic Eligibility Criteria Card */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Drive Eligibility Rules
            </h2>

            {job.eligibilityRule ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Minimum Required CGPA
                  </span>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {job.eligibilityRule.minCgpa.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Your CGPA: {studentProfile?.cgpa?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Max Backlogs Permitted
                  </span>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {job.eligibilityRule.maxBacklogs}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Your Backlogs: {studentProfile?.backlogCount ?? 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Eligible Graduation Batches
                  </span>
                  <p className="font-semibold text-slate-800">
                    Class of {job.eligibilityRule.allowedGraduationYears.join(', ')}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Eligible Departments
                  </span>
                  <div className="space-y-1 mt-1">
                    {job.eligibilityRule.allowedDepartments.map((dept, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No strict eligibility restrictions defined.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation & One-Click Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Confirm Application Submission"
        description={`Position: ${job.title} at ${job.company.name}`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-bold text-slate-900">{studentProfile?.user?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registration Number:</span>
              <span className="font-bold text-slate-900">{studentProfile?.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Resume Attached:</span>
              <span className="font-bold text-blue-600 truncate max-w-[180px]">
                {studentProfile?.activeResume?.fileName || 'resume.pdf'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            By submitting, your academic profile and active resume will be transmitted to the recruiting company and university placement officers.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)} disabled={isApplying}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply} isLoading={isApplying}>
              Confirm and Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
