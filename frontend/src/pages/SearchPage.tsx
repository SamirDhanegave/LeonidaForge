import React, { useState, useMemo } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useRouter, Link } from '../services/router';
import { Search, Car, BookOpen, Compass, MapPin, Layers, ArrowRight, Sparkles, Lock, ShieldCheck } from 'lucide-react';
import { VEHICLES_DATA } from '../data/vehicles';
import { GUIDES_DATA } from '../data/guides';
import { MISSIONS_DATA } from '../data/missions';
import { LOCATIONS_DATA } from '../data/locations';
import { POPULAR_SEARCHES_DATA } from '../data/popularSearches';
import { FeedbackModule } from '../components/common/FeedbackModule';

export const SearchPage: React.FC = () => {
  const { navigate } = useRouter();

  useSEO({
    title: 'Search Index — Leonida Forge',
    description:
      'Search all GTA VI vehicles, mission walkthroughs, district locations, calculators, and search-intent guides in one global index.',
    canonicalPath: '/search',
  });

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const allItems = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      category: string;
      type: 'tool' | 'vehicle' | 'guide' | 'mission' | 'location';
      description: string;
      path: string;
      icon: any;
    }> = [
      // Core Tools
      {
        id: 'tool-veh',
        title: 'Vehicle Finder & Database',
        category: 'Utility Tool',
        type: 'tool',
        description: 'Filter 10 vehicle classes by top speed, acceleration, and spawn points.',
        path: '/vehicles',
        icon: Car,
      },
      {
        id: 'tool-compare',
        title: '3-Way Vehicle Comparison Matrix',
        category: 'Utility Tool',
        type: 'tool',
        description: 'Side-by-side performance benchmarks for speed, 0-60, and handling.',
        path: '/compare',
        icon: Layers,
      },
      {
        id: 'tool-money',
        title: 'Money & Playtime Goal Planner',
        category: 'Utility Tool',
        type: 'tool',
        description: 'Session duration and heist earnings calculators with instant purchase checks.',
        path: '/money',
        icon: Layers,
      },
      {
        id: 'tool-tracker',
        title: '100% Game Completion Progress Tracker',
        category: 'Utility Tool',
        type: 'tool',
        description: 'Track campaign missions, collectibles, and side objectives locally in browser.',
        path: '/tracker',
        icon: Layers,
      },
      {
        id: 'tool-missions',
        title: 'Mission Directory',
        category: 'Utility Tool',
        type: 'tool',
        description: 'Campaign and side operations with payouts and step-by-step objectives.',
        path: '/missions',
        icon: Compass,
      },
      {
        id: 'tool-locations',
        title: 'Leonida Location Explorer',
        category: 'Utility Tool',
        type: 'tool',
        description: 'Safehouses, mod shops, boat docks, and secret loot spots across districts.',
        path: '/locations',
        icon: MapPin,
      },
      {
        id: 'tool-privacy',
        title: 'Privacy Policy & Zero-Account Pledge',
        category: 'Policy & Standards',
        type: 'tool',
        description: 'Zero personal data collection, client-side localStorage details, GDPR erasure, and no third-party ad tracking.',
        path: '/privacy',
        icon: Lock,
      },
      {
        id: 'tool-about',
        title: 'About Leonida Forge',
        category: 'Policy & Standards',
        type: 'tool',
        description: 'Independent project principles, zero-account architecture, and community feedback.',
        path: '/about',
        icon: ShieldCheck,
      },
    ];

    // Add vehicles
    VEHICLES_DATA.forEach((v) => {
      list.push({
        id: `veh-${v.slug}`,
        title: `${v.name} (${v.manufacturer})`,
        category: `Vehicle • ${v.category}`,
        type: 'vehicle',
        description: `${v.topSpeedMph} MPH Top Speed • ${v.accelerationSec}s 0-60 • $${v.price.toLocaleString()} • ${v.locationHint}`,
        path: `/vehicles/${v.slug}`,
        icon: Car,
      });
    });

    // Add guides
    GUIDES_DATA.forEach((g) => {
      list.push({
        id: `guide-${g.slug}`,
        title: g.title,
        category: `Guide • ${g.category}`,
        type: 'guide',
        description: g.quickAnswer || g.summary,
        path: `/guides/${g.slug}`,
        icon: BookOpen,
      });
    });

    // Add missions
    MISSIONS_DATA.forEach((m) => {
      list.push({
        id: `mission-${m.id}`,
        title: m.title,
        category: `Mission • ${m.category}`,
        type: 'mission',
        description: `${m.description} Reward: ${m.estimatedReward} (${m.estimatedDuration})`,
        path: '/missions',
        icon: Compass,
      });
    });

    // Add locations
    LOCATIONS_DATA.forEach((l) => {
      list.push({
        id: `loc-${l.id}`,
        title: `${l.name} (${l.district})`,
        category: `Location • ${l.type}`,
        type: 'location',
        description: `${l.description} Value: ${l.whyItMatters}`,
        path: '/locations',
        icon: MapPin,
      });
    });

    return list;
  }, []);

  const results = useMemo(() => {
    return allItems.filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesQuery =
        !query.trim() ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [allItems, query, filterType]);

  return (
    <div id="search-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <section className="pt-4 border-b border-[#1e2434] pb-6">
        <h1 className="text-3xl font-extrabold text-[#f8fafc] tracking-tight mb-2">
          Global Search Index
        </h1>
        <p className="text-sm text-[#94a3b8]">
          Instantly search all GTA VI tools, vehicles, mission walkthroughs, locations, and guides.
        </p>
      </section>

      {/* Input */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-[#64748b] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-page-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything (e.g. Cheetah, money, safehouse, 100%, Vice Beach)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#263148] bg-[#121622] text-base text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#c8f135]/70 shadow-sm"
            autoFocus
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'tool', label: 'Tools' },
            { id: 'vehicle', label: 'Vehicles' },
            { id: 'guide', label: 'Guides' },
            { id: 'mission', label: 'Missions' },
            { id: 'location', label: 'Locations' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === f.id
                  ? 'bg-[#c8f135] text-[#090a0f] font-bold'
                  : 'bg-[#141824] border border-[#21283a] text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search results summary */}
      <div className="flex items-center justify-between text-xs text-[#8090a8]">
        <span>
          Showing <strong className="text-[#f8fafc]">{results.length}</strong> matches
        </span>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-[#c8f135] hover:underline"
          >
            Clear query
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-[#202636] bg-[#12151f]">
            <Search className="w-8 h-8 text-[#64748b] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#f8fafc]">No matching records found</h3>
            <p className="text-xs text-[#8090a8] mt-1">
              Try searching with a broader keyword like "car", "money", "heist", or "docks".
            </p>
          </div>
        ) : (
          results.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                className="p-4 rounded-xl border border-[#1e2434] bg-[#121520] hover:bg-[#161a28] hover:border-[#c8f135]/40 transition-all cursor-pointer group flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1a202e] border border-[#273248] flex items-center justify-center text-[#c8f135] shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#19202e] text-[#94a3b8]">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8090a8] mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-1 text-[#64748b] group-hover:text-[#c8f135] shrink-0 mt-1">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Demand Discovery Feedback */}

    </div>
  );
};
