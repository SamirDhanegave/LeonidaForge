import React from 'react';

interface LoadingStateProps {
  message?: string;
  cards?: number;
}

const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl border border-[#1a2030] bg-[#0e1119] overflow-hidden animate-pulse">
    <div className="aspect-video bg-[#141826]" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-24 bg-[#1e2840] rounded" />
      <div className="h-4 bg-[#1a2030] rounded w-full" />
      <div className="h-4 bg-[#1a2030] rounded w-4/5" />
      <div className="h-3 bg-[#141826] rounded w-3/5 mt-2" />
    </div>
  </div>
);

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading…',
  cards = 3,
}) => (
  <div id="loading-state" className="space-y-4">
    <p className="text-sm text-[#64748b] animate-pulse">{message}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);
