import React from 'react';
import { cn } from '../../lib/utils';
import { ApplicationStatus, JobStatus, JobType } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  status?: ApplicationStatus | JobStatus | JobType | string;
  variant?: 'blue' | 'green' | 'amber' | 'rose' | 'slate' | 'indigo' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status,
  variant,
  size = 'md',
  className,
}) => {
  // If status is passed, auto-select appropriate palette and label
  let selectedVariant = variant || 'slate';
  let label = children;

  if (status) {
    switch (status) {
      case 'APPLIED':
        selectedVariant = 'blue';
        label = label || 'Applied';
        break;
      case 'SHORTLISTED':
        selectedVariant = 'indigo';
        label = label || 'Shortlisted';
        break;
      case 'ASSESSMENT':
        selectedVariant = 'amber';
        label = label || 'Assessment';
        break;
      case 'TECHNICAL_INTERVIEW':
        selectedVariant = 'purple';
        label = label || 'Tech Interview';
        break;
      case 'HR_INTERVIEW':
        selectedVariant = 'purple';
        label = label || 'HR Interview';
        break;
      case 'SELECTED':
        selectedVariant = 'green';
        label = label || 'Selected / Offered';
        break;
      case 'REJECTED':
        selectedVariant = 'rose';
        label = label || 'Rejected';
        break;
      case 'WITHDRAWN':
        selectedVariant = 'slate';
        label = label || 'Withdrawn';
        break;
      case 'PUBLISHED':
        selectedVariant = 'green';
        label = label || 'Active';
        break;
      case 'DRAFT':
        selectedVariant = 'slate';
        label = label || 'Draft';
        break;
      case 'CLOSED':
        selectedVariant = 'rose';
        label = label || 'Closed';
        break;
      case 'FULL_TIME':
        selectedVariant = 'blue';
        label = label || 'Full Time';
        break;
      case 'INTERNSHIP':
        selectedVariant = 'amber';
        label = label || 'Internship';
        break;
      case 'INTERN_TO_FULL_TIME':
        selectedVariant = 'indigo';
        label = label || 'Intern to FTE';
        break;
      default:
        label = label || status;
    }
  }

  const variants = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-medium rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-sans tracking-wide leading-none select-none',
        variants[selectedVariant],
        sizes[size],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};
