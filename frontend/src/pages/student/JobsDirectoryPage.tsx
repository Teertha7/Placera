import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { EligibilityBadge } from '../../components/student/EligibilityBadge';
import api from '../../lib/api';
import { Job, JobType, ApiResponse, PageResponse } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Search, Filter, Briefcase, MapPin, Calendar, ArrowRight, DollarSign } from 'lucide-react';

export const JobsDirectoryPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery.trim());
      if (selectedJobType) params.append('jobType', selectedJobType);
      if (selectedLocation) params.append('location', selectedLocation.trim());
      params.append('page', page.toString());
      params.append('size', '10');

      const res = await api.get<ApiResponse<PageResponse<Job>>>(`/api/jobs?${params.toString()}`);
      if (res.data.success && res.data.data) {
        setJobs(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
        setTotalElements(res.data.data.totalElements);
      }
    } catch (err) {
      console.error('Failed to search jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, selectedJobType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus Recruitment Drives
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore and apply for active opportunities from partner companies. All jobs display server-verified eligibility.
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 sm:p-5">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by job title or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedJobType}
              onChange={(e) => {
                setSelectedJobType(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">All Job Formats</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="INTERN_TO_FULL_TIME">Intern to FTE</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex gap-2">
            <input
              type="text"
              placeholder="Location..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="primary" size="sm" type="submit">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Found {totalElements} opportunities</span>
        <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
      </div>

      {/* Job Postings List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-1/3 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </Card>
          ))
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No recruitment drives match your filters"
            description="Try adjusting your keywords, job format, or location criteria."
            actionText="Clear Search"
            onAction={() => {
              setSearchQuery('');
              setSelectedJobType('');
              setSelectedLocation('');
              setPage(0);
              fetchJobs();
            }}
          />
        ) : (
          jobs.map((job) => (
            <Card key={job.id} hoverEffect className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  {job.company.logoUrl ? (
                    <img
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 font-extrabold text-xl flex items-center justify-center flex-shrink-0">
                      {job.company.name.charAt(0)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-blue-600 tracking-wide">
                        {job.company.name}
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <Badge status={job.jobType} size="sm" />
                      <EligibilityBadge
                        eligible={job.userEligible}
                        reasons={job.ineligibilityReasons}
                        size="sm"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      <Link to={`/student/jobs/${job.id}`} className="hover:text-blue-600 transition-colors">
                        {job.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Apply by {formatDate(job.deadline)}
                      </span>
                      {job.eligibilityRule && (
                        <span className="text-[11px] font-medium text-slate-500">
                          Min CGPA: {job.eligibilityRule.minCgpa.toFixed(1)} • Max Backlogs: {job.eligibilityRule.maxBacklogs}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:self-center flex-shrink-0">
                  <Link to={`/student/jobs/${job.id}`}>
                    <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      View & Apply
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-xs font-semibold px-3 py-1 bg-white rounded-lg border border-slate-200">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
