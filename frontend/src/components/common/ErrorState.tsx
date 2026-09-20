import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => (
  <div
    id="error-state"
    className="flex flex-col items-center justify-center gap-4 py-14 text-center rounded-2xl border border-[#3a1e1e] bg-[#130d0d]"
  >
    <AlertCircle className="w-10 h-10 text-[#f87171]" />
    <div className="space-y-1">
      <p className="text-sm font-semibold text-[#f8fafc]">Unable to load content</p>
      <p className="text-xs text-[#8090a8] max-w-xs">{message}</p>
    </div>
    {onRetry && (
      <button
        id="error-state-retry-btn"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e1a1a] border border-[#3a2828] text-xs font-semibold text-[#f8fafc] hover:bg-[#2a1f1f] transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try Again
      </button>
    )}
  </div>
);
