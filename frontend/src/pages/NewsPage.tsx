import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useAllNews } from '../hooks/useNews';
import { NewsGrid } from '../components/news/NewsGrid';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';

type FilterSource = 'all' | 'rockstar_newswire';

const FILTERS: { label: string; value: FilterSource }[] = [
  { label: 'All', value: 'all' },
  { label: 'Rockstar', value: 'rockstar_newswire' },
];

export const NewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterSource>('all');

  useSEO({
    title: 'GTA VI News — Latest Updates | Leonida Forge',
    description: 'Stay up to date with the latest GTA VI news from Rockstar Newswire, social updates, and community reports.',
    canonicalPath: '/news',
  });

  const source = activeFilter === 'all' ? undefined : activeFilter;
  const { data: articles, loading, error, retry } = useAllNews(page, source);

  const handleFilter = (f: FilterSource) => {
    if (f !== activeFilter) {
      setActiveFilter(f);
      setPage(1);
    }
  };

  return (
    <div id="news-page" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      <Breadcrumbs items={[{ label: 'News', path: '/news' }]} />

      {/* Page Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c8f135]">
          <Newspaper className="w-3.5 h-3.5" />
          <span>GTA VI News</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
          Latest GTA VI News
        </h1>
        <p className="text-sm text-[#8090a8]">
          Breaking updates, official Rockstar Newswire articles, and community reports.
        </p>
      </header>

      {/* Filters */}
      <div
        id="news-filter-bar"
        className="flex items-center gap-2 flex-wrap"
        role="group"
        aria-label="Filter news by source"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            id={`news-filter-${f.value}`}
            onClick={() => handleFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeFilter === f.value
                ? 'bg-[#c8f135] text-[#090a0f] border-[#c8f135]'
                : 'bg-transparent text-[#94a3b8] border-[#232836] hover:border-[#c8f135]/40 hover:text-[#f8fafc]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && <LoadingState message="Loading GTA VI news…" />}
      {!loading && error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && articles.length === 0 && (
        <EmptyState
          title="No news found"
          message="No recent GTA VI news articles are available. Check back later."
        />
      )}
      {!loading && !error && articles.length > 0 && (
        <NewsGrid articles={articles} />
      )}

      {/* Pagination */}
      {!loading && !error && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            id="news-prev-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#232836] text-xs font-semibold text-[#94a3b8] disabled:opacity-40 hover:enabled:border-[#c8f135]/40 hover:enabled:text-[#f8fafc] transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          <span className="text-xs text-[#64748b] font-mono">Page {page}</span>
          <button
            id="news-next-page-btn"
            disabled={articles.length < 12}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#232836] text-xs font-semibold text-[#94a3b8] disabled:opacity-40 hover:enabled:border-[#c8f135]/40 hover:enabled:text-[#f8fafc] transition-all"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
