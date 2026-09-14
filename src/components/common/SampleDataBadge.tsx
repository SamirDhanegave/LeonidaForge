import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  className?: string;
  showTooltip?: boolean;
}

export const SampleDataBadge: React.FC<Props> = ({ className = '', showTooltip = true }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 ${className}`}
      title={
        showTooltip
          ? 'Sample data: community observation and speculation model. Will be updated with verified official data post-launch.'
          : undefined
      }
    >
      <Info className="w-3 h-3 text-amber-400" />
      <span>Sample data</span>
    </span>
  );
};
