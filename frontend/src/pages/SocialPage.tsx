import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useSocialPosts } from '../hooks/useSocialPosts';
import { SocialPostCard } from '../components/news/SocialPostCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Twitter, ChevronLeft, ChevronRight } from 'lucide-react';

export const SocialPage: React.FC = () => {
  const [page, setPage] = useState(1);

  useSEO({
    title: 'GTA VI Social Updates — X / Twitter | Leonida Forge',
    description: 'Latest GTA VI social media posts and community updates collected from monitored X accounts.',
    canonicalPath: '/social',
  });

  const { data: posts, loading, error, retry } = useSocialPosts(page);

  return (
    <div id="social-page" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Social Updates', path: '/social' }]} />

      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1d9bf0]">
          <Twitter className="w-3.5 h-3.5" />
          <span>X / Social Updates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
          Social Media Updates
        </h1>
        <p className="text-sm text-[#8090a8]">
          Monitored X posts related to GTA VI from tracked community accounts.
        </p>
      </header>

      {/* Content */}
      {loading && <LoadingState message="Loading social updates…" />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && posts.length === 0 && (
        <EmptyState
          title="No social posts yet"
          message="No X posts have been collected yet. The watcher collects new posts automatically."
        />
      )}
      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            id="social-prev-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#232836] text-xs font-semibold text-[#94a3b8] disabled:opacity-40 hover:enabled:border-[#1d9bf0]/40 hover:enabled:text-[#f8fafc] transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <span className="text-xs text-[#64748b] font-mono">Page {page}</span>
          <button
            id="social-next-page-btn"
            disabled={posts.length < 20}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#232836] text-xs font-semibold text-[#94a3b8] disabled:opacity-40 hover:enabled:border-[#1d9bf0]/40 hover:enabled:text-[#f8fafc] transition-all"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
