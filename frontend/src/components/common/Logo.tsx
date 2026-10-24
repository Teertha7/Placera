import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  to?: string;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  to = '/',
  inverted = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Abstract connected career progression node symbol */}
      <svg
        className={`${iconSizes[size]} flex-shrink-0`}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="36" height="36" rx="9" fill={inverted ? '#FFFFFF' : '#0B192C'} />
        {/* Ascending pathway nodes and connection vectors */}
        <path
          d="M8 26L16 12L23 20L28 9"
          stroke={inverted ? '#008DDA' : '#00A8FF'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Career Milestone Nodes */}
        <circle cx="8" cy="26" r="2.5" fill={inverted ? '#1E3E62' : '#FFFFFF'} />
        <circle cx="16" cy="12" r="2.5" fill={inverted ? '#1E3E62' : '#FFFFFF'} />
        <circle cx="23" cy="20" r="2.5" fill={inverted ? '#1E3E62' : '#FFFFFF'} />
        <circle cx="28" cy="9" r="3" fill="#00A8FF" />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight leading-none ${textSizes[size]} ${
            inverted ? 'text-white' : 'text-slate-900'
          }`}
        >
          Placera
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-medium tracking-wide uppercase mt-0.5 ${
              inverted ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Campus Placement Platform
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
