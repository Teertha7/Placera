import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../lib/api';
import { Interview, ApiResponse } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { Calendar, Clock, Video, MapPin, FileText, CheckCircle2 } from 'lucide-react';

export const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'all'>('upcoming');

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<Interview[]>>('/api/students/me/interviews');
        if (res.data.success && res.data.data) {
          setInterviews(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load interviews', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const now = new Date();
  const upcoming = interviews.filter(
    (i) => new Date(i.scheduledTime) >= now && i.status === 'SCHEDULED'
  );
  const past = interviews.filter(
    (i) => new Date(i.scheduledTime) < now || i.status !== 'SCHEDULED'
  );

  const displayedList = tab === 'upcoming' ? upcoming : interviews;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Interview Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access meeting links, instructions, and schedules for your campus recruitment evaluations.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Interviews ({interviews.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : displayedList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={tab === 'upcoming' ? 'No upcoming interviews' : 'No interview history'}
          description="When placement administrators schedule technical rounds, they will appear here with instructions and meeting links."
        />
      ) : (
        <div className="space-y-4">
          {displayedList.map((interview) => (
            <Card key={interview.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                      {interview.companyName}
                    </span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{interview.jobTitle}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{interview.roundName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="md">
                    Round {interview.roundNumber}
                  </Badge>
                  <Badge status={interview.status} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Date & Time
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateTime(interview.scheduledTime)}</span>
                    <span className="text-slate-400 font-normal">({interview.durationMinutes} mins)</span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Format & Venue
                  </span>
                  {interview.interviewType === 'ONLINE' ? (
                    <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                      <Video className="w-3.5 h-3.5" />
                      <span>Online Video Interview</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Campus In-Person</span>
                    </div>
                  )}
                </div>

                {interview.locationOrUrl && (
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Meeting Access
                    </span>
                    {interview.interviewType === 'ONLINE' ? (
                      <a
                        href={interview.locationOrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Conference
                      </a>
                    ) : (
                      <p className="font-semibold text-slate-800">{interview.locationOrUrl}</p>
                    )}
                  </div>
                )}
              </div>

              {interview.instructions && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl">
                  <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                    Special Candidate Instructions:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{interview.instructions}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
