import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Link } from '../services/router';
import { Clock, ArrowRight } from 'lucide-react';
import { GUIDES_DATA } from '../data/guides';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const GuidesPage: React.FC = () => {
  useSEO({
    title: 'GTA 6 Guides & Walkthroughs | Leonida Forge',
    description:
      'Straight-to-the-point GTA 6 guides covering fastest vehicles, money tactics, map locations, and 100% completion milestones.',
    canonicalPath: '/guides',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Guides', item: '/guides' },
    ],
  });

  return (
    <div id="guides-index-container" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Guides', path: '/guides' }]} />

      {/* Header */}
      <section id="guides-header" className="border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
            Editorial Intel &amp; Fast Answers
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight mb-2">
          GTA VI Search-Intent Guides
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl">
          Straight-to-the-point answers designed to satisfy player queries with zero fluff,
          accompanied by interactive calculators and vehicle telemetry comparisons.
        </p>
      </section>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES_DATA.map((guide) => (
          <Link
            key={guide.id}
            to={`/guides/${guide.slug}`}
            className="rounded-2xl border border-[#202636] bg-[#12151f] hover:bg-[#151926] hover:border-[#c8f135]/40 transition-all p-6 flex flex-col justify-between shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1a2130] text-[#c8f135]">
                  {guide.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#64748b]">
                  <Clock className="w-3 h-3" />
                  <span>{guide.readTimeMinutes} min read</span>
                </div>
              </div>

              <h2 className="text-base font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors mb-2">
                {guide.title}
              </h2>
              <p className="text-xs text-[#8090a8] line-clamp-3 leading-relaxed mb-4">
                {guide.quickAnswer || guide.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1e2434] flex items-center justify-between text-xs font-semibold text-[#ededef] group-hover:text-[#c8f135] transition-colors">
              <span>Read Full Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

 
    </div>
  );
};
