import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  message = 'Check back later for updates.',
  icon,
}) => (
  <div
    id="empty-state"
    className="flex flex-col items-center justify-center gap-4 py-14 text-center rounded-2xl border border-[#1e2330] bg-[#0d1017]"
  >
    {icon ?? <Inbox className="w-10 h-10 text-[#2b3345]" />}
    <div className="space-y-1">
      <p className="text-sm font-semibold text-[#f8fafc]">{title}</p>
      <p className="text-xs text-[#8090a8] max-w-xs">{message}</p>
    </div>
  </div>
);
