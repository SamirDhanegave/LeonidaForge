import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, BarChart2 } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface FeedbackModuleProps {
  pageSlug: string;
  className?: string;
  contextTitle?: string;
}

export const FeedbackModule: React.FC<FeedbackModuleProps> = ({
  pageSlug,
  className = '',
  contextTitle,
}) => {
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const existing = StorageService.getFeedbackStatus(pageSlug);
    if (existing) {
      setVote(existing);
      setSubmitted(true);
    } else {
      setVote(null);
      setSubmitted(false);
    }
  }, [pageSlug]);

  const handleVote = (isUseful: boolean) => {
    StorageService.submitFeedback(pageSlug, isUseful);
    setVote(isUseful ? 'yes' : 'no');
    setSubmitted(true);
  };

  return (
    <aside
      id={`feedback-${pageSlug.replace(/[^a-zA-Z0-9_-]/g, '-')}`}
      className={`rounded-xl border border-[#232836] bg-[#12151d] p-4 sm:p-5 transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#c8f135]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Demand Discovery & Validation
            </span>
          </div>
          <p className="text-sm font-medium text-[#ededef]">
            Was this {contextTitle ? `"${contextTitle}"` : 'utility'} useful to you?
          </p>
          <p className="text-xs text-[#94a3b8]">
            Your anonymous vote signals which features should be built into advanced live tools.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {!submitted ? (
            <>
              <button
                id={`feedback-yes-${pageSlug}`}
                onClick={() => handleVote(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#2b3242] bg-[#181c26] text-xs font-semibold text-[#f8fafc] hover:border-[#c8f135]/50 hover:bg-[#c8f135]/10 hover:text-[#c8f135] active:scale-95 transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#c8f135]" />
                <span>Yes, useful</span>
              </button>
              <button
                id={`feedback-no-${pageSlug}`}
                onClick={() => handleVote(false)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#2b3242] bg-[#181c26] text-xs font-semibold text-[#94a3b8] hover:border-[#ef4444]/40 hover:bg-[#ef4444]/10 hover:text-[#ef4444] active:scale-95 transition-all"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-[#64748b]" />
                <span>No, improve</span>
              </button>
            </>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#c8f135]/10 border border-[#c8f135]/30 text-xs font-medium text-[#c8f135]">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Thanks for voting ({vote === 'yes' ? '👍 Useful' : '👎 Needs work'}). Saved locally!
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
