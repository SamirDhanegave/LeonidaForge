import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Link } from '../services/router';
import {
  CheckSquare,
  Square,
  RotateCcw,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronRight,
  Filter,
  Compass,
} from 'lucide-react';
import { TRACKER_CATEGORIES_DATA } from '../data/trackerData';
import { StorageService } from '../services/storage';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TrackerPage: React.FC = () => {
  useSEO({
    title: 'GTA 6 100% Progress Tracker | Checklist & Completion',
    description:
      'Track your 100% GTA 6 completion progress. Interactive checklist for story missions, side jobs, collectibles, and Leonida activities.',
    canonicalPath: '/tracker',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: '100% Tracker', item: '/tracker' },
    ],
  });

  const [completedIds, setCompletedIds] = useState<string[]>(() =>
    StorageService.getCompletedTrackerItems()
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const toggleItem = (id: string) => {
    const updated = StorageService.toggleTrackerItem(id);
    setCompletedIds(updated);
  };

  const handleReset = () => {
    StorageService.resetTracker();
    setCompletedIds([]);
    setShowConfirmReset(false);
  };

  // Compute statistics
  const totalItemsCount = TRACKER_CATEGORIES_DATA.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );
  const completedCount = completedIds.length;
  const overallPercentage =
    totalItemsCount > 0
      ? Math.round((completedCount / totalItemsCount) * 100)
      : 0;

  const filteredCategories =
    activeCategory === 'all'
      ? TRACKER_CATEGORIES_DATA
      : TRACKER_CATEGORIES_DATA.filter((c) => c.id === activeCategory);

  return (
    <div id="tracker-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumbs */}
      <Breadcrumbs items={[{ label: '100% Tracker', path: '/tracker' }]} />

      {/* Header */}
      <section id="tracker-header" className="border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
            100% Completion Roadmap
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight mb-2">
              GTA 6 100% Progress Tracker
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-2xl">
              Check off missions, trophies, stunt jumps, and collectibles as you play through Leonida.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#273043] bg-[#121622] text-xs font-medium text-[#94a3b8] hover:text-[#ef4444] hover:border-[#ef4444]/40 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Progress</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#1b1e2b] p-1.5 rounded-xl border border-[#ef4444]/40">
                <span className="text-xs text-[#ef4444] font-medium pl-2">Confirm clear?</span>
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded bg-[#ef4444] text-white text-xs font-bold hover:bg-[#dc2626]"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2 py-1 rounded bg-[#273043] text-xs text-[#94a3b8] hover:text-[#ededef]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Local Persistence Callout Banner */}
        <div className="mt-6 p-4 rounded-xl border border-[#20283c] bg-[#121622] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#cad2e0]">
            <ShieldCheck className="w-4 h-4 text-[#c8f135] shrink-0" />
            <span>
              <strong>100% Client-Side Persistence:</strong> Your completion states are stored securely in your browser local storage.
            </span>
          </div>
          <Link
            to="/guides/gta-6-100-percent-completion"
            className="text-[#c8f135] hover:underline flex items-center gap-1 shrink-0 font-semibold"
          >
            <span>Read 100% Guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Progress Metric Overview Banner */}
      <section className="p-6 rounded-2xl border border-[#222a3d] bg-[#121520] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748b]">
              Overall Completion Status
            </h2>
            <div className="text-3xl font-extrabold font-mono text-[#f8fafc] mt-0.5">
              {overallPercentage}%{' '}
              <span className="text-xs font-normal text-[#8090a8]">
                ({completedCount} of {totalItemsCount} objectives completed)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#c8f135]" />
            <span className="text-xs text-[#94a3b8] font-mono font-medium">
              Target: 100% True Completion
            </span>
          </div>
        </div>

        <div className="h-2.5 w-full rounded-full bg-[#1b202c] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c8f135] to-emerald-400 transition-all duration-300"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </section>

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-[#c8f135] text-[#090a0f]'
              : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
          }`}
        >
          All Categories ({totalItemsCount})
        </button>
        {TRACKER_CATEGORIES_DATA.map((cat) => {
          const catDone = cat.items.filter((i) => completedIds.includes(i.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#c8f135] text-[#090a0f]'
                  : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
              }`}
            >
              {cat.name} ({catDone}/{cat.items.length})
            </button>
          );
        })}
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => {
          const catDone = cat.items.filter((i) => completedIds.includes(i.id)).length;
          const catPercent = Math.round((catDone / cat.items.length) * 100);

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-[#202636] bg-[#12151f] overflow-hidden shadow-sm"
            >
              {/* Category Header */}
              <div className="p-5 border-b border-[#1c2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151926]">
                <div>
                  <h3 className="text-base font-bold text-[#f8fafc]">{cat.name}</h3>
                  <p className="text-xs text-[#8090a8] mt-0.5">{cat.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#c8f135]">
                    {catDone} / {cat.items.length} ({catPercent}%)
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#1a202e]">
                {cat.items.map((item) => {
                  const isChecked = completedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#0f121a]/60 hover:bg-[#121622]'
                          : 'hover:bg-[#161a26]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#c8f135] text-[#090a0f]'
                              : 'border border-[#38435d] text-transparent hover:border-[#c8f135]'
                          }`}
                          aria-label={`Mark ${item.title} as completed`}
                        >
                          {isChecked && <CheckSquare className="w-4 h-4 fill-current" />}
                        </button>
                        <div>
                          <div
                            className={`text-sm font-semibold transition-colors ${
                              isChecked
                                ? 'line-through text-[#64748b]'
                                : 'text-[#f8fafc]'
                            }`}
                          >
                            {item.title}
                          </div>
                          <div className="text-xs text-[#8090a8]">
                            {item.requirement} • {item.detail}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-[#c8f135] shrink-0">
                        +{item.pointsPercentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Demand Discovery Feedback on Tracker */}
  
    </div>
  );
};
