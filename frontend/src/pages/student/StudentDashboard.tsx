import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { EligibilityBadge } from '../../components/student/EligibilityBadge';
import api from '../../lib/api';
import {
  StudentProfile,
  Job,
  Application,
  Interview,
  ApiResponse,
  PageResponse
} from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/utils';
import {
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  Building2,
  Video,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [totalJobsCount, setTotalJobsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [profileRes, appsRes, interviewsRes, jobsRes] = await Promise.all([
          api.get<ApiResponse<StudentProfile>>('/api/students/me'),
          api.get<ApiResponse<Application[]>>('/api/students/me/applications'),
          api.get<ApiResponse<Interview[]>>('/api/students/me/interviews/upcoming'),
          api.get<ApiResponse<PageResponse<Job>>>('/api/jobs?size=4'),
        ]);

        if (profileRes.data.success && profileRes.data.data) {
          setProfile(profileRes.data.data);
        }
        if (appsRes.data.success && appsRes.data.data) {
          setRecentApplications(appsRes.data.data);
        }
        if (interviewsRes.data.success && interviewsRes.data.data) {
          setUpcomingInterviews(interviewsRes.data.data);
        }
        if (jobsRes.data.success && jobsRes.data.data) {
          setRecommendedJobs(jobsRes.data.data.content);
          setTotalJobsCount(jobsRes.data.data.totalElements);
        }
      } catch (err) {
        console.error('Failed to load student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const activeApplications = recentApplications.filter(
    (a) => a.status !== 'REJECTED' && a.status !== 'WITHDRAWN'
  );
  const offersReceived = recentApplications.filter((a) => a.status === 'SELECTED');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
            <span>{profile?.department} • Class of {profile?.graduationYear}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Your current verified CGPA is{' '}
            <span className="font-extrabold text-white">{profile?.cgpa?.toFixed(2)}</span> with{' '}
            <span className="font-extrabold text-white">{profile?.backlogCount}</span> active backlogs.
            Explore active placement drives tailored to your eligibility.
          </p>
          <div className="mt-5 flex gap-3">
            <Link to="/student/jobs">
              <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse Eligible Drives
              </Button>
            </Link>
            <Link to="/student/profile">
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                View Academic Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Live Database Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Drives
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalJobsCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Campus recruitment opportunities</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Applied
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{recentApplications.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            {activeApplications.length} active in recruitment pipeline
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Upcoming Interviews
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{upcomingInterviews.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Scheduled evaluation rounds</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Offers Received
              </p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{offersReceived.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Verified placement selections</p>
        </Card>
      </div>

      {/* Main Dashboard Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recommended & Eligible Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Featured Recruitment Opportunities</h3>
            <Link to="/student/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All Drives →
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedJobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No active drives yet"
                description="The placement cell hasn't published new recruitment drives yet. Please check back soon."
              />
            ) : (
              recommendedJobs.map((job) => (
                <Card key={job.id} hoverEffect className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {job.company.logoUrl ? (
                        <img
                          src={job.company.logoUrl}
                          alt={job.company.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">
                          {job.company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-blue-600">{job.company.name}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{job.location}</span>
                          <EligibilityBadge
                            eligible={job.userEligible}
                            reasons={job.ineligibilityReasons}
                            size="sm"
                          />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          <Link to={`/student/jobs/${job.id}`} className="hover:text-blue-600 transition-colors">
                            {job.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <Badge status={job.jobType} size="sm" />
                          <span className="text-xs font-extrabold text-slate-900">
                            {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                          </span>
                          <span className="text-xs text-slate-500">
                            Deadline: {formatDate(job.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link to={`/student/jobs/${job.id}`} className="sm:self-center flex-shrink-0">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Interviews & Application Status Snapshot */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Upcoming Interviews</h3>

          {upcomingInterviews.length === 0 ? (
            <Card className="p-6 text-center">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No interviews scheduled</p>
              <p className="text-xs text-slate-500 mt-1">
                You'll receive notifications when companies shortlist and schedule evaluation rounds.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((interview) => (
                <Card key={interview.id} className="p-4 border-l-4 border-l-blue-600">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 uppercase">
                        {interview.companyName}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 mt-0.5">{interview.roundName}</h5>
                    </div>
                    <Badge variant="purple" size="sm">
                      {interview.interviewType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateTime(interview.scheduledTime)}</span>
                    <span className="text-slate-400">({interview.durationMinutes}m)</span>
                  </div>
                  {interview.locationOrUrl && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={interview.locationOrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Meeting Link
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Quick Application Snapshot */}
          <div className="pt-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Applications</h3>
            {recentApplications.length === 0 ? (
              <p className="text-xs text-slate-500">You haven't applied to any drives yet.</p>
            ) : (
              <div className="space-y-3">
                {recentApplications.slice(0, 3).map((app) => (
                  <Card key={app.id} className="p-3.5 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{app.job.title}</p>
                      <p className="text-[11px] text-slate-500">{app.job.company.name}</p>
                    </div>
                    <Badge status={app.status} size="sm" />
                  </Card>
                ))}
                <Link to="/student/applications" className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-800 pt-1">
                  View Full Applications Tracker →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
