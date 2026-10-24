import React, { useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface EligibilityBadgeProps {
  eligible?: boolean;
  reasons?: string[];
  size?: 'sm' | 'md';
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  eligible,
  reasons = [],
  size = 'md',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (eligible === undefined || eligible === null) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg transition-colors select-none ${
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
        } ${
          eligible
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
        }`}
      >
        {eligible ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Eligible</span>
          </>
        ) : (
          <>
            <XCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Not Eligible</span>
            <Info className="w-3 h-3 text-amber-500 ml-0.5" />
          </>
        )}
      </button>

      {/* Reasons Tooltip / Popover */}
      {showTooltip && reasons.length > 0 && (
        <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs z-50 animate-fade-in pointer-events-none">
          <p className="font-bold text-amber-300 mb-1.5 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Eligibility Criteria Not Met:
          </p>
          <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px] leading-relaxed">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
