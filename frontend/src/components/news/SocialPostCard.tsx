import React from 'react';
import { ExternalLink, Twitter } from 'lucide-react';
import type { SocialPost } from '../../types';

function formatDate(iso: string | null): string {
  if (!iso) return '';

  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

interface SocialPostCardProps {
  post: SocialPost;
}

export const SocialPostCard: React.FC<SocialPostCardProps> = ({ post }) => {
  const date = formatDate(post.date);

  // Construct X URL if not stored
  const xUrl =
    post.url ??
    (post.post_id
      ? `https://x.com/${post.username}/status/${post.post_id}`
      : null);

  return (
    <article
      id={`social-post-card-${post.id}`}
      className="rounded-2xl border border-[#1a2436] bg-[#0d1117] p-5 flex flex-col gap-4 hover:border-[#1d9bf0]/40 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#1d9bf0]/10 border border-[#1d9bf0]/20 flex items-center justify-center shrink-0">
            <Twitter className="w-4 h-4 text-[#1d9bf0]" />
          </div>

          <div>
            <div className="text-sm font-bold text-[#f8fafc]">
              @{post.username}
            </div>

            {date && (
              <div className="text-[11px] text-[#64748b]">
                {date}
              </div>
            )}
          </div>
        </div>

        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#1d9bf0]/10 text-[#1d9bf0] border border-[#1d9bf0]/30 shrink-0">
          X / SOCIAL
        </span>
      </div>

      {/* AI-generated news write-up */}
      <p className="text-sm text-[#c8d3e8] leading-relaxed whitespace-pre-wrap line-clamp-6">
        {post.classifier}
      </p>

      {/* Footer */}
      {xUrl && (
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d9bf0] hover:underline mt-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on X
        </a>
      )}
    </article>
  );
};