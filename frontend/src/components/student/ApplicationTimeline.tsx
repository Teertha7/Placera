import React from 'react';
import { ApplicationStatus, ApplicationStatusHistory } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface ApplicationTimelineProps {
  currentStatus: ApplicationStatus;
  history?: ApplicationStatusHistory[];
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  currentStatus,
  history = [],
}) => {
  const steps: { key: ApplicationStatus; label: string }[] = [
    { key: 'APPLIED', label: 'Application Submitted' },
    { key: 'SHORTLISTED', label: 'Resume Shortlisted' },
    { key: 'TECHNICAL_INTERVIEW', label: 'Technical Rounds' },
    { key: 'HR_INTERVIEW', label: 'HR Interview' },
    { key: 'SELECTED', label: 'Offered / Selected' },
  ];

  const getStepIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED': return 0;
      case 'SHORTLISTED': return 1;
      case 'ASSESSMENT': return 1;
      case 'TECHNICAL_INTERVIEW': return 2;
      case 'HR_INTERVIEW': return 3;
      case 'SELECTED': return 4;
      default: return -1;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';
  const isWithdrawn = currentStatus === 'WITHDRAWN';

  return (
    <div className="space-y-6">
      {/* Visual Step Bar for standard progression */}
      {!isWithdrawn && (
        <div className="relative flex items-center justify-between max-w-2xl mx-auto py-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex && !isRejected;
            const isCurrent = idx === currentIndex && !isRejected;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 border-2 ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] leading-tight ${
                    isCurrent
                      ? 'text-blue-600'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Terminal State Banners */}
      {isRejected && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900 text-sm">
          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Application Not Selected</p>
            <p className="text-xs text-rose-700 mt-0.5">
              Thank you for participating. The recruitment team has decided not to proceed further at this time.
            </p>
          </div>
        </div>
      )}

      {isWithdrawn && (
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-slate-800 text-sm">
          <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Application Withdrawn</p>
            <p className="text-xs text-slate-600 mt-0.5">
              You voluntarily withdrew this application.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Status Event History Log */}
      {history.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Application Activity Log
          </h4>
          <div className="space-y-4">
            {history.map((h) => (
              <div key={h.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {h.newStatus.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDateTime(h.createdAt)}
                    </span>
                  </div>
                  {h.reasonOrNote && (
                    <p className="text-slate-600 mt-0.5">{h.reasonOrNote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
