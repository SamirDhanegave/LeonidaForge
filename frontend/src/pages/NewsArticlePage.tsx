import React from 'react';
import { useRouter, Link } from '../services/router';
import { useSEO } from '../hooks/useSEO';
import { useNewsItem, useAllNews } from '../hooks/useNews';
import { NewsSourceBadge } from '../components/news/NewsSourceBadge';
import { NewsGrid } from '../components/news/NewsGrid';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ExternalLink, Calendar, ArrowLeft, ImageOff } from 'lucide-react';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export const NewsArticlePage: React.FC = () => {
  const { params } = useRouter();
  const newsId = parseInt(params.id ?? '0', 10);

  const { article, loading, error, retry } = useNewsItem(newsId);
  // Load related articles for the bottom section
  const { data: related } = useAllNews(1);

  useSEO({
    title: article
      ? `${article.title ?? 'GTA VI News'} | Leonida Forge`
      : 'GTA VI News Article | Leonida Forge',
    description: article?.raw_content?.slice(0, 155) ?? 'Read the latest GTA VI news on Leonida Forge.',
    canonicalPath: `/news/${newsId}`,
    ogImage: article?.image_url ?? undefined,
  });

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <LoadingState message="Loading article…" cards={1} />
    </div>
  );

  if (error || !article) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <ErrorState message={error ?? 'Article not found.'} onRetry={retry} />
    </div>
  );

  const date = formatDate(article.published_at ?? article.collected_at);
  const relatedArticles = related.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div id="news-article-page" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: 'News', path: '/news' },
          { label: article.title ?? 'Article', path: `/news/${article.id}` },
        ]}
      />

      {/* Article */}
      <article
        id={`news-article-${article.id}`}
        className="max-w-3xl mx-auto space-y-8"
        itemScope
        itemType="https://schema.org/NewsArticle"
      >
        {/* Meta */}
        <header className="space-y-4">
          <NewsSourceBadge source={article.source} />
          <h1
            itemProp="headline"
            className="text-2xl sm:text-4xl font-extrabold text-[#f8fafc] leading-snug"
          >
            {article.title}
          </h1>
          {date && (
            <div className="flex items-center gap-2 text-sm text-[#64748b]">
              <Calendar className="w-4 h-4" />
              <time itemProp="datePublished" dateTime={article.published_at ?? ''}>
                {date}
              </time>
            </div>
          )}
        </header>

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden border border-[#1a2030] aspect-video bg-[#141826] flex items-center justify-center">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title ?? 'GTA VI'}
              className="w-full h-full object-cover"
              itemProp="image"
            />
          ) : (
            <ImageOff className="w-12 h-12 text-[#2b3345]" />
          )}
        </div>

        {/* Body */}
        <div
          itemProp="articleBody"
          className="prose prose-sm prose-invert max-w-none text-[#c8d3e8] leading-relaxed space-y-4"
        >
          {article.raw_content
            ? article.raw_content.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))
            : <p className="text-[#8090a8] italic">No article content available.</p>
          }
        </div>

        {/* Original source */}
        <footer className="pt-6 border-t border-[#1e2330] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#64748b]">
            This article was originally published on{' '}
            <strong className="text-[#94a3b8]">
              {article.source === 'rockstar_newswire' ? 'Rockstar Newswire' : article.source}
            </strong>
            . Leonida Forge is an independent fan site and is not affiliated with Rockstar Games.
          </p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            id="news-article-original-source-link"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2b3345] bg-[#141824] text-xs font-semibold text-[#f8fafc] hover:bg-[#1a2030] hover:border-[#c8f135]/40 transition-all shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#c8f135]" />
            View Original Source
          </a>
        </footer>
      </article>

      {/* Back + Related */}
      <section className="max-w-7xl space-y-6">
        <Link
          to="/news"
          id="news-article-back-btn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94a3b8] hover:text-[#c8f135] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All News
        </Link>

        {relatedArticles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#f8fafc]">Related GTA VI News</h2>
            <NewsGrid articles={relatedArticles} />
          </div>
        )}
      </section>
    </div>
  );
};
