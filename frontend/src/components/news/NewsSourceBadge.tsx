import React from 'react';

const SOURCE_STYLES: Record<string, { label: string; className: string }> = {
  rockstar_newswire: {
    label: 'ROCKSTAR NEWSWIRE',
    className:
      'bg-[#c8f135]/10 text-[#c8f135] border border-[#c8f135]/30',
  },
  x_social: {
    label: 'X / SOCIAL',
    className:
      'bg-[#1d9bf0]/10 text-[#1d9bf0] border border-[#1d9bf0]/30',
  },
  leonida_forge: {
    label: 'LEONIDA FORGE',
    className:
      'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30',
  },
};

const DEFAULT_STYLE = {
  label: 'NEWS',
  className: 'bg-[#64748b]/10 text-[#94a3b8] border border-[#64748b]/30',
};

interface NewsSourceBadgeProps {
  source: string;
  className?: string;
}

export const NewsSourceBadge: React.FC<NewsSourceBadgeProps> = ({ source, className = '' }) => {
  const style = SOURCE_STYLES[source] ?? DEFAULT_STYLE;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${style.className} ${className}`}
    >
      {style.label}
    </span>
  );
};
