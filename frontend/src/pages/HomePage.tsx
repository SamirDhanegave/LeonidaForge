import React from 'react';
import { Link } from '../services/router';
import { useSEO } from '../hooks/useSEO';
import { useLatestNews } from '../hooks/useNews';
import { useSocialPosts } from '../hooks/useSocialPosts';
import { FeaturedNews } from '../components/news/FeaturedNews';
import { NewsGrid } from '../components/news/NewsGrid';
import { SocialPostCard } from '../components/news/SocialPostCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { getSiteUrl } from '../config/seoConfig';
import { GUIDES_DATA } from '../data/guides';
import {
  Car,
  DollarSign,
  CheckSquare,
  Compass,
  MapPin,
  Scale,
  ArrowRight,
  Newspaper,
  Twitter,
  BookOpen,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const siteUrl = getSiteUrl();

  useSEO({
    title: 'Leonida Forge | GTA VI News, Tools & Guides',
    description:
      'The GTA VI information hub. Breaking news from Rockstar Newswire, social updates, vehicle database, guides, missions, and player tools.',
    canonicalPath: '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Leonida Forge',
      alternateName: ['LeonidaForge', 'Leonida Forge GTA 6', 'Leonida Forge GTA VI'],
      url: siteUrl,
      description: 'GTA VI news, guides, vehicles, missions, tools and more.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  });

  const { news, loading: newsLoading, error: newsError, retry: retryNews } = useLatestNews();
  const { data: socialPosts, loading: socialLoading, error: socialError, retry: retrySocial } = useSocialPosts(1);

  const featuredArticle = news[0] ?? null;
  const latestNews      = news.slice(1, 4);   // 3 cards after featured
  const latestSocial    = socialPosts.slice(0, 3);

  const tools = [
    { id: 'tool-money',    title: 'Money Planner',        path: '/money',     icon: DollarSign,  badge: 'Calculator' },
    { id: 'tool-tracker',  title: 'Progress Tracker',     path: '/tracker',   icon: CheckSquare, badge: '100% Roadmap' },
    { id: 'tool-missions', title: 'Mission Directory',    path: '/missions',  icon: Compass,     badge: 'Interactive' },
    { id: 'tool-locations',title: 'Location Explorer',    path: '/locations', icon: MapPin,      badge: 'Map Ready' },
    { id: 'tool-vehicles', title: 'Vehicle Database',     path: '/vehicles',  icon: Car,         badge: '12+ Models' },
    { id: 'tool-compare',  title: 'Vehicle Comparison',   path: '/compare',   icon: Scale,       badge: '3-Way' },
  ];

  return (
    <div id="home-page-container" className="space-y-16 sm:space-y-20">

      {/* ── SECTION 1: Featured / Breaking Story ─────────────────── */}
      <section id="featured-news-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        {newsLoading && <LoadingState message="Loading featured story…" cards={1} />}
        {!newsLoading && newsError && <ErrorState message={newsError} onRetry={retryNews} />}
        {!newsLoading && !newsError && !featuredArticle && (
          <EmptyState
            title="No featured news yet"
            message="The latest GTA VI story will appear here automatically."
          />
        )}
        {!newsLoading && !newsError && featuredArticle && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c8f135]">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Featured Story</span>
            </div>
            {/* Reuse FeaturedNews which also calls useLatestNews — use the data we already have */}
            <FeaturedNews />
          </div>
        )}
      </section>

      {/* ── SECTION 2: Latest GTA VI News ────────────────────────── */}
      <section id="latest-news-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c8f135] mb-1">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Latest News</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              GTA VI Latest Updates
            </h2>
          </div>
          <Link
            id="home-view-all-news-link"
            to="/news"
            className="text-xs font-semibold text-[#c8f135] hover:underline flex items-center gap-1"
          >
            View All News <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {newsLoading && <LoadingState message="Loading news…" />}
        {!newsLoading && newsError && <ErrorState message={newsError} onRetry={retryNews} />}
        {!newsLoading && !newsError && latestNews.length === 0 && (
          <EmptyState
            title="No recent news"
            message="Check back soon for the latest GTA VI news from Rockstar Newswire."
          />
        )}
        {!newsLoading && !newsError && latestNews.length > 0 && (
          <NewsGrid articles={latestNews} />
        )}
      </section>

      {/* ── SECTION 3: Social / X Updates ────────────────────────── */}
      <section id="social-updates-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1d9bf0] mb-1">
              <Twitter className="w-3.5 h-3.5" />
              <span>Social Updates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              X / Twitter Updates
            </h2>
          </div>
          <Link
            id="home-view-all-social-link"
            to="/social"
            className="text-xs font-semibold text-[#1d9bf0] hover:underline flex items-center gap-1"
          >
            View All Posts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {socialLoading && <LoadingState message="Loading social posts…" />}
        {!socialLoading && socialError && <ErrorState message={socialError} onRetry={retrySocial} />}
        {!socialLoading && !socialError && latestSocial.length === 0 && (
          <EmptyState
            title="No social posts yet"
            message="X posts will appear here as they are collected by the watcher."
          />
        )}
        {!socialLoading && !socialError && latestSocial.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestSocial.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 4: Guides ────────────────────────────────────── */}
      <section id="guides-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c8f135] mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>GTA VI Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              Player Guides
            </h2>
          </div>
          <Link
            id="home-view-all-guides-link"
            to="/guides"
            className="text-xs font-semibold text-[#c8f135] hover:underline flex items-center gap-1"
          >
            All Guides <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GUIDES_DATA.slice(0, 3).map((guide) => (
            <Link
              key={guide.id}
              id={`home-guide-card-${guide.id}`}
              to={`/guides/${guide.slug}`}
              className="group rounded-2xl border border-[#202636] bg-[#0e1119] p-5 hover:border-[#c8f135]/40 hover:bg-[#111525] transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2638] text-[#94a3b8]">
                  {guide.category}
                </span>
                <span className="text-[10px] text-[#64748b]">{guide.readTimeMinutes} min read</span>
              </div>
              <h3 className="text-base font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors line-clamp-2 mb-2">
                {guide.title}
              </h3>
              <p className="text-xs text-[#8090a8] line-clamp-2 flex-1">{guide.subtitle}</p>
              <div className="mt-4 pt-3 border-t border-[#1a2030] flex items-center gap-1.5 text-xs font-semibold text-[#64748b] group-hover:text-[#c8f135] transition-colors">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: Tools ─────────────────────────────────────── */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c8f135] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Player Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              GTA VI Tools & Database
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                id={tool.id}
                to={tool.path}
                className="group rounded-2xl border border-[#202636] bg-[#0e1119] hover:bg-[#111525] hover:border-[#c8f135]/40 p-6 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1a202e] border border-[#273145] flex items-center justify-center text-[#c8f135] group-hover:bg-[#c8f135] group-hover:text-[#090a0f] transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-[#1a2130] text-[#94a3b8] border border-[#273248]">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors mb-1">
                  {tool.title}
                </h3>
                <div className="mt-4 pt-3 border-t border-[#1e2433] flex items-center justify-between text-xs font-semibold text-[#64748b] group-hover:text-[#c8f135] transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 6: Custom Placeholder Section ────────────────────── */}
      <section id="custom-placeholder-section" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
    
        
      </section>
    </div>
  );
};
