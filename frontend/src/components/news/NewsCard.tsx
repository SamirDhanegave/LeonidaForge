import React from 'react';
import { Link, useRouter } from '../../services/router';
import { ArrowRight, ImageOff } from 'lucide-react';
import { NewsSourceBadge } from './NewsSourceBadge';
import type { News } from '../../types';

interface NewsCardProps {
  article: News;
  featured?: boolean;
}

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

function excerpt(text: string | null, maxLen = 120): string {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + '…' : text;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const { navigate } = useRouter();
  const date = formatDate(article.published_at ?? article.collected_at);
  const slug = `/news/${article.id}`;

  if (featured) {
    return (
      <article
        id={`news-card-featured-${article.id}`}
        onClick={() => navigate(slug)}
        className="group cursor-pointer rounded-2xl border border-[#202636] bg-[#0e1119] overflow-hidden flex flex-col lg:flex-row hover:border-[#c8f135]/40 transition-all"
      >
        {/* Image */}
        <div className="lg:w-3/5 relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[340px] bg-[#141826] flex items-center justify-center shrink-0">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title ?? 'GTA VI News'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <ImageOff className="w-10 h-10 text-[#2b3345]" />
          )}
          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e1119]/60 hidden lg:block" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
          <div className="flex items-center gap-3 mb-4">
            <NewsSourceBadge source={article.source} />
            {date && <span className="text-xs text-[#64748b]">{date}</span>}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors leading-snug mb-3">
            {article.title ?? 'Untitled'}
          </h2>
          <p className="text-sm text-[#8090a8] leading-relaxed mb-6">
            {excerpt(article.raw_content, 180)}
          </p>
          <Link
            to={slug}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8f135] hover:underline"
          >
            Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      id={`news-card-${article.id}`}
      onClick={() => navigate(slug)}
      className="group cursor-pointer rounded-2xl border border-[#202636] bg-[#0e1119] overflow-hidden flex flex-col hover:border-[#c8f135]/40 hover:bg-[#111525] transition-all"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-[#141826] flex items-center justify-center shrink-0">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title ?? 'GTA VI News'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#151a26] to-[#0e1119] flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-[#2b3345]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <NewsSourceBadge source={article.source} />
          {date && <span className="text-[11px] text-[#64748b]">{date}</span>}
        </div>
        <h3 className="text-base font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors line-clamp-2 leading-snug mb-2">
          {article.title ?? 'Untitled'}
        </h3>
        <p className="text-xs text-[#8090a8] leading-relaxed line-clamp-3 flex-1">
          {excerpt(article.raw_content)}
        </p>
        <div className="mt-4 pt-3 border-t border-[#1a2030] flex items-center gap-1.5 text-xs font-semibold text-[#64748b] group-hover:text-[#c8f135] transition-colors">
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
};
