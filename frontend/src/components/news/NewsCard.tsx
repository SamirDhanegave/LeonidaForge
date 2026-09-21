import React, { useState } from 'react';
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

  return text.length > maxLen
    ? `${text.slice(0, maxLen).trimEnd()}…`
    : text;
}

interface NewsImageProps {
  src: string | null;
  alt: string;
  featured?: boolean;
}

const NewsImage: React.FC<NewsImageProps> = ({
  src,
  alt,
  featured = false,
}) => {
  const [fit, setFit] = useState<'cover' | 'contain'>('cover');

  if (!src) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#151a26] to-[#0b0e14]">
        <ImageOff className={featured ? 'w-10 h-10' : 'w-8 h-8'} />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b0e14]">
      {/* Soft atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a202c] via-[#10141c] to-[#090c11]" />

      {/* Subtle background image for visual depth */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-15"
      />

      {/* Main image */}
      <div className="relative z-10 h-full w-full flex items-center justify-center p-3 sm:p-4">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(event) => {
            const image = event.currentTarget;

            if (!image.naturalWidth || !image.naturalHeight) {
              return;
            }

            const ratio = image.naturalWidth / image.naturalHeight;

            // Wide images fill the card.
            // Square/portrait images preserve their full composition.
            setFit(ratio >= 1.35 ? 'cover' : 'contain');
          }}
          className={[
            'h-full w-full transition-transform duration-500',
            fit === 'cover'
              ? 'object-cover'
              : 'object-contain max-w-full max-h-full',
            'group-hover:scale-[1.025]',
          ].join(' ')}
        />
      </div>

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
    </div>
  );
};

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  featured = false,
}) => {
  const { navigate } = useRouter();
  const date = formatDate(article.published_at ?? article.collected_at);
  const slug = `/news/${article.id}`;

  if (featured) {
    return (
      <article
        id={`news-card-featured-${article.id}`}
        onClick={() => navigate(slug)}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-[#202636] bg-[#0e1119] transition-all hover:border-[#c8f135]/40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Image */}
          <div className="relative h-[280px] sm:h-[340px] lg:h-[420px]">
            <NewsImage
              src={article.image_url}
              alt={article.title ?? 'GTA VI News'}
              featured
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e1119]/40 hidden lg:block" />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="mb-4 flex items-center gap-3">
              <NewsSourceBadge source={article.source} />

              {date && (
                <span className="text-xs text-[#64748b]">
                  {date}
                </span>
              )}
            </div>

            <h2 className="mb-3 text-xl sm:text-2xl font-extrabold leading-snug text-[#f8fafc] transition-colors group-hover:text-[#c8f135]">
              {article.title ?? 'Untitled'}
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-[#8090a8]">
              {excerpt(article.raw_content, 180)}
            </p>

            <Link
              to={slug}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8f135] hover:underline"
            >
              Read Article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      id={`news-card-${article.id}`}
      onClick={() => navigate(slug)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#202636] bg-[#0e1119] transition-all hover:border-[#c8f135]/40 hover:bg-[#111525]"
    >
      {/* Image */}
      <div className="relative h-52 sm:h-56 lg:h-60">
        <NewsImage
          src={article.image_url}
          alt={article.title ?? 'GTA VI News'}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <NewsSourceBadge source={article.source} />

          {date && (
            <span className="text-[11px] text-[#64748b]">
              {date}
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[#f8fafc] transition-colors group-hover:text-[#c8f135]">
          {article.title ?? 'Untitled'}
        </h3>

        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-[#8090a8]">
          {excerpt(article.raw_content)}
        </p>

        <div className="mt-4 flex items-center gap-1.5 border-t border-[#1a2030] pt-3 text-xs font-semibold text-[#64748b] transition-colors group-hover:text-[#c8f135]">
          <span>Read Article</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </article>
  );
};