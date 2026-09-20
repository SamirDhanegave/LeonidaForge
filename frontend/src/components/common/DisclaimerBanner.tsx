import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  className?: string;
}

export const DisclaimerBanner: React.FC<Props> = ({ className = '' }) => {
  return (
    <div
      id="fan-project-disclaimer"
      className={`border-b border-[#232836] bg-[#0c0e14] py-1.5 px-4 text-xs text-[#94a3b8] ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
          <span className="truncate">
            <strong className="text-[#ededef] font-semibold">Independent Fan Project:</strong> Not affiliated with, endorsed by, or connected to Rockstar Games or Take-Two Interactive.
          </span>
        </div>
      </div>
    </div>
  );
};
