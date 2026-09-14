import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useRouter, Link } from '../services/router';
import {
  Compass,
  Search,
  ArrowLeft,
  Home,
  Car,
  Calculator,
  CheckSquare,
  MapPin,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { path, navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useSEO({
    title: '404 — Page Not Found — Leonida Forge',
    description:
      'The requested page could not be found in Leonida Forge. Explore vehicle benchmarks, money calculators, progress checklists, and game guides.',
    canonicalPath: '/404',
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search');
    }
  };

  const popularRoutes = [
    {
      title: 'Vehicle Database',
      description: 'Search exotics, sports cars, supercars & boats with raw stats',
      path: '/vehicles',
      icon: Car,
      badge: 'Database',
    },
    {
      title: '3-Way Compare Matrix',
      description: 'Side-by-side performance, speed and price telemetry',
      path: '/compare',
      icon: Compass,
      badge: 'Telemetry',
    },
    {
      title: 'Money Goal Planner',
      description: 'Calculate heist runs & playtime needed for major purchases',
      path: '/money',
      icon: Calculator,
      badge: 'Calculator',
    },
    {
      title: '100% Progress Tracker',
      description: 'Checklist for story missions, collectibles & hobbies',
      path: '/tracker',
      icon: CheckSquare,
      badge: 'Tracker',
    },
    {
      title: 'Districts & Locations',
      description: 'Safehouses, chop shops, docks & points of interest',
      path: '/locations',
      icon: MapPin,
      badge: 'Map & POIs',
    },
    {
      title: 'Guides & Walkthroughs',
      description: 'Spawn locations, speed tests, and heist payout breakdowns',
      path: '/guides',
      icon: FileText,
      badge: 'Strategy',
    },
  ];

  return (
    <div id="not-found-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* 404 Hero Display */}
      <div className="relative p-8 sm:p-12 rounded-3xl border border-[#232a3d] bg-gradient-to-b from-[#131722] via-[#0e111a] to-[#090b10] text-center overflow-hidden shadow-2xl">
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#2b344c_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-5">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>ERROR 404 // GPS SIGNAL OUT OF BOUNDS</span>
          </div>

          {/* Large Stylized 404 Headline */}
          <div className="space-y-2">
            <div className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#f8fafc] via-[#cad2e0] to-[#64748b] font-mono select-none">
              404
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              Road Ends Here in Leonida
            </h1>
          </div>

          {/* Explanation & Requested Path */}
          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            The coordinates or page you requested does not exist or may have been relocated.
          </p>

          {path && path !== '/' && (
            <div className="inline-block max-w-full truncate px-3.5 py-1.5 rounded-xl bg-[#090b10] border border-[#232a3d] text-xs font-mono text-[#cbd5e1]">
              <span className="text-[#64748b]">Missing path: </span>
              <span className="text-[#c8f135] font-semibold">{path}</span>
            </div>
          )}

          {/* Primary Quick Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8f135] text-[#090a0f] text-xs font-bold hover:bg-[#d5f756] transition-all shadow-md active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>

            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a202e] hover:bg-[#232b3e] text-[#f8fafc] border border-[#2b354a] text-xs font-semibold transition-all active:scale-95"
            >
              <Search className="w-4 h-4 text-[#c8f135]" />
              <span>Search All Tools</span>
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141722] hover:bg-[#1b2030] text-[#94a3b8] hover:text-[#f8fafc] border border-[#232a3d] text-xs font-medium transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Previous Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="p-6 rounded-2xl border border-[#202738] bg-[#0f121b] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f8fafc]">
            <Search className="w-4 h-4 text-[#c8f135]" />
            <span>Search Leonida Forge Index</span>
          </div>
          <span className="text-[11px] text-[#64748b]">Instant Directory Search</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles, guides, missions, districts (e.g. Banshee, heists, Vice Beach)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0d14] border border-[#232a3d] text-xs sm:text-sm text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#c8f135]/60 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#c8f135] hover:bg-[#d5f756] text-[#090a0f] text-xs font-bold transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Popular Destination Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#f8fafc] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c8f135]" />
            <span>Popular Destinations in Leonida</span>
          </h2>
          <span className="text-xs text-[#64748b]">Jump directly to active tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.path}
                to={route.path}
                className="group p-4 rounded-2xl bg-[#11141e] border border-[#1f2637] hover:border-[#c8f135]/50 hover:bg-[#141824] transition-all flex flex-col justify-between gap-3 text-left"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-[#181d2a] border border-[#262f43] flex items-center justify-center text-[#c8f135] group-hover:bg-[#c8f135]/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181d2a] text-[#8090a8] border border-[#262f43]">
                      {route.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#f8fafc] group-hover:text-white transition-colors">
                      {route.title}
                    </h3>
                    <p className="text-xs text-[#8090a8] line-clamp-2 mt-1 leading-relaxed">
                      {route.description}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-[#c8f135] flex items-center gap-1 pt-1">
                  <span>Open Tool</span>
                  <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
