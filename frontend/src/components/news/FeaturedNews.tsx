import React from 'react';
import { useLatestNews } from '../../hooks/useNews';
import { NewsCard } from './NewsCard';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { EmptyState } from '../common/EmptyState';
import { Newspaper } from 'lucide-react';

export const FeaturedNews: React.FC = () => {
  const { news, loading, error, retry } = useLatestNews();
  const featured = news[0] ?? null;

  if (loading) return <LoadingState message="Loading latest GTA VI news…" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!featured) return (
    <EmptyState
      title="No featured news yet"
      message="Check back soon for the latest GTA VI updates from Rockstar Newswire."
    />
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c8f135]">
        <Newspaper className="w-3.5 h-3.5" />
        <span>Breaking / Featured</span>
      </div>
      <NewsCard article={featured} featured />
    </div>
  );
};
