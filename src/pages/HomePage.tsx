import React from 'react';
import { useRouter, Link } from '../services/router';
import { useSEO } from '../hooks/useSEO';
import {
  Car,
  DollarSign,
  CheckSquare,
  Compass,
  MapPin,
  Scale,
  ArrowRight,
  Search,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { POPULAR_SEARCHES_DATA } from '../data/popularSearches';
import { VEHICLES_DATA } from '../data/vehicles';
import { GUIDES_DATA } from '../data/guides';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { getSiteUrl } from '../config/seoConfig';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const siteUrl = getSiteUrl();

  useSEO({
    title: 'Leonida Forge | GTA VI Tools, Guides & Trackers',
    description:
      'Explore GTA VI tools, vehicle comparisons, progress tracking, money calculators and practical guides for players.',
    canonicalPath: '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Leonida Forge',
      alternateName: ['LeonidaForge', 'Leonida Forge GTA 6', 'Leonida Forge GTA VI'],
      url: siteUrl,
      description: 'Useful tools, comparisons, trackers and guides for exploring GTA VI.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  });

  const tools = [
    {
      id: 'tool-vehicles',
      title: 'Vehicle Finder',
      description: 'Filter 10 vehicle classes by top speed, acceleration, price, and exact spawn locations in Vice Beach & Port Gellhorn.',
      path: '/vehicles',
      icon: Car,
      badge: '12+ Models',
      actionText: 'Browse Vehicles',
    },
    {
      id: 'tool-money',
      title: 'Money Planner',
      description: 'Calculate heist session requirements, business targets, and run instant "Can I afford it?" purchase checks.',
      path: '/money',
      icon: DollarSign,
      badge: 'Live Calculator',
      actionText: 'Calculate Goals',
    },
    {
      id: 'tool-tracker',
      title: 'Progress Tracker',
      description: 'Tick off story missions, strangers, collectibles, and activities. Persisted directly in your browser with zero login.',
      path: '/tracker',
      icon: CheckSquare,
      badge: '100% Roadmap',
      actionText: 'Track Progress',
    },
    {
      id: 'tool-missions',
      title: 'Mission Directory',
      description: 'Browse campaign and side operations with estimated payout rewards, required roles, and objective walkthroughs.',
      path: '/missions',
      icon: Compass,
      badge: 'Interactive',
      actionText: 'View Missions',
    },
    {
      id: 'tool-locations',
      title: 'Location Explorer',
      description: 'District directory with POIs, safehouses, underground chop shops, and secret sunken loot caches across Leonida.',
      path: '/locations',
      icon: MapPin,
      badge: 'Map Ready',
      actionText: 'Explore Map',
    },
    {
      id: 'tool-compare',
      title: '3-Way Vehicle Compare',
      description: 'Compare top speed, braking, 0-60 sprint, and value ratings side-by-side with visual performance telemetry bars.',
      path: '/compare',
      icon: Scale,
      badge: 'Telemetry Matrix',
      actionText: 'Launch Compare',
    },
  ];

  return (
    <div id="home-page-container" className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section id="hero-section" className="pt-10 sm:pt-16 pb-6 text-center max-w-4xl mx-auto px-4">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#273145] bg-[#121622] text-xs font-semibold uppercase tracking-widest text-[#c8f135] mb-6">
          <Zap className="w-3.5 h-3.5 text-[#c8f135]" />
          <span>LEONIDA FORGE • GTA VI UTILITY TOOLS</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#f8fafc] mb-6 leading-tight sm:leading-tight">
          <span className="block text-sm sm:text-base font-bold text-[#c8f135] tracking-widest uppercase mb-2">Leonida Forge</span>
          Stop searching.{' '}
          <span className="text-[#c8f135] underline decoration-[#c8f135]/40 underline-offset-8">
            Start playing.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed mb-8">
          Useful tools, comparisons, trackers and guides for exploring GTA VI.
          Built for players to quickly answer what it is, where it is, how much it costs, and what to do next.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            id="hero-explore-tools-cta"
            href="#tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c8f135] text-[#090a0f] text-sm font-bold hover:bg-[#d6f658] active:scale-95 transition-all shadow-lg shadow-[#c8f135]/15"
          >
            <span>Explore Tools</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            id="hero-browse-vehicles-cta"
            to="/vehicles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2b3345] bg-[#141824] text-sm font-semibold text-[#f8fafc] hover:bg-[#1a2030] hover:border-[#38435d] active:scale-95 transition-all"
          >
            <Car className="w-4 h-4 text-[#94a3b8]" />
            <span>Browse Vehicles</span>
          </Link>
        </div>

        {/* Fan Disclaimer Under Hero */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#64748b]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" />
          <span>Independent fan-made project. Not affiliated with Rockstar Games or Take-Two Interactive.</span>
        </div>
      </section>

      {/* Tool Launcher Section (The 6 Tools) */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c8f135] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Tool Launcher</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f8fafc]">
              Built to solve real in-game questions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8090a8] max-w-md">
            No endless wiki fluff. Each utility is crafted to deliver immediate answers in under 10 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                id={tool.id}
                to={tool.path}
                className="group rounded-2xl border border-[#202636] bg-[#12151f] hover:bg-[#151926] hover:border-[#c8f135]/50 p-6 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#1a202e] border border-[#273145] flex items-center justify-center text-[#c8f135] group-hover:bg-[#c8f135] group-hover:text-[#090a0f] transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-[#1a2130] text-[#94a3b8] border border-[#273248]">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8090a8] leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1e2433] flex items-center justify-between text-xs font-semibold text-[#ededef] group-hover:text-[#c8f135] transition-colors">
                  <span>{tool.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Searches ("What players are looking for") */}
      <section id="popular-searches-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-[#22293b] bg-[#0f121a] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c8f135] mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>Search Intent Index</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc]">
                What players are looking for
              </h2>
            </div>
            <span className="text-xs text-[#64748b]">
              Updated regularly from search-demand player queries
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {POPULAR_SEARCHES_DATA.map((item, idx) => (
              <Link
                key={idx}
                id={`popular-search-link-${idx}`}
                to={item.path}
                className="p-3.5 rounded-xl border border-[#1e2536] bg-[#141824] hover:bg-[#1a2030] hover:border-[#c8f135]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2638] text-[#94a3b8]">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#c8f135] font-semibold">
                      {item.intentBadge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors line-clamp-1">
                    {item.query}
                  </h3>
                  <p className="text-xs text-[#8090a8] mt-1 line-clamp-2 leading-snug">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#64748b] group-hover:text-[#c8f135]">
                  <span>Explore intent</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicle & Guide Highlights Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Top Speed Benchmark Preview */}
          <div className="lg:col-span-2 rounded-2xl border border-[#202636] bg-[#12151f] p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
                    Telemetry Leaderboard
                  </span>
                  <SampleDataBadge />
                </div>
                <Link to="/compare" className="text-xs text-[#c8f135] hover:underline font-semibold">
                  Open 3-Way Compare →
                </Link>
              </div>

              <h2 className="text-xl font-bold text-[#f8fafc] mb-2">
                Fastest Verified Vehicle Models (Sample Matrix)
              </h2>
              <p className="text-xs sm:text-sm text-[#8090a8] mb-6">
                Direct side-by-side performance benchmarks compiled from community observation simulations.
              </p>

              <div className="space-y-3">
                {VEHICLES_DATA.slice(0, 3).map((veh) => (
                  <Link
                    key={veh.id}
                    to={`/vehicles/${veh.slug}`}
                    className="p-3.5 rounded-xl border border-[#1e2434] bg-[#151926] hover:bg-[#1b2132] hover:border-[#2f3a52] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#202638] flex items-center justify-center font-mono text-xs font-bold text-[#c8f135]">
                        {veh.category.slice(0, 3)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors">
                          {veh.name}
                        </div>
                        <div className="text-xs text-[#8090a8]">
                          {veh.drivetrain} • {veh.seats} Seats • ${veh.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[#64748b]">Top Speed:</span>{' '}
                        <strong className="text-[#f8fafc] font-mono">{veh.topSpeedMph} MPH</strong>
                      </div>
                      <div>
                        <span className="text-[#64748b]">0-60:</span>{' '}
                        <strong className="text-[#c8f135] font-mono">{veh.accelerationSec}s</strong>
                      </div>
                      <span className="text-[#64748b] hidden sm:inline">Score: {veh.overallScore}/100</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1e2434] flex items-center justify-between text-xs text-[#8090a8]">
              <span>Need to compare specs before purchasing?</span>
              <Link to="/compare" className="font-semibold text-[#c8f135] hover:underline">
                Compare Top 3 Vehicles
              </Link>
            </div>
          </div>

          {/* Col 3: Editorial Search Guides */}
          <div className="rounded-2xl border border-[#202636] bg-[#12151f] p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
                  Search-Intent Guides
                </span>
                <Link to="/guides" className="text-xs text-[#c8f135] hover:underline">
                  View All
                </Link>
              </div>

              <h2 className="text-xl font-bold text-[#f8fafc] mb-2">
                High-Value Player Guides
              </h2>
              <p className="text-xs text-[#8090a8] mb-5 leading-relaxed">
                Objective, step-by-step answers without filler content or fabricated claims.
              </p>

              <div className="space-y-3">
                {GUIDES_DATA.slice(0, 3).map((guide) => (
                  <Link
                    key={guide.id}
                    to={`/guides/${guide.slug}`}
                    className="block p-3 rounded-xl border border-[#1e2434] bg-[#151926] hover:bg-[#1b2132] hover:border-[#c8f135]/40 transition-all group"
                  >
                    <div className="text-xs font-bold text-[#f8fafc] group-hover:text-[#c8f135] line-clamp-1">
                      {guide.title}
                    </div>
                    <div className="text-[11px] text-[#8090a8] mt-1 line-clamp-1">
                      {guide.readTimeMinutes} min read • {guide.category}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1e2434]">
              <Link
                to="/tracker"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#2b3345] bg-[#181d2c] hover:bg-[#20273b] text-xs font-semibold text-[#f8fafc] transition-all"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#c8f135]" />
                <span>Open 100% Progress Tracker</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demand Discovery Feedback on Homepage */}
      <section className="max-w-4xl mx-auto px-4">
        <FeedbackModule
          pageSlug="home"
          contextTitle="Homepage & Core Tool Launcher"
        />
      </section>
    </div>
  );
};
