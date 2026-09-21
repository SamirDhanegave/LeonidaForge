import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Link } from '../services/router';
import {
  Compass,
  Search,
  CheckSquare,
  Square,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
} from 'lucide-react';
import { MISSIONS_DATA, MISSION_CATEGORIES } from '../data/missions';
import { StorageService } from '../services/storage';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const MissionsPage: React.FC = () => {
  useSEO({
    title: 'GTA 6 Missions | Mission Directory & Payouts',
    description:
      'Browse GTA 6 campaign and side missions with estimated payouts, objective walkthroughs, and required character roles.',
    canonicalPath: '/missions',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Missions', item: '/missions' },
    ],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [completedMissions, setCompletedMissions] = useState<string[]>(() =>
    StorageService.getCompletedMissions()
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.toggleCompletedMission(id);
    setCompletedMissions(StorageService.getCompletedMissions());
  };

  const filteredMissions = MISSIONS_DATA.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="missions-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Missions', path: '/missions' }]} />

      {/* Header */}
      <section id="missions-header" className="border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
            Operational Intelligence
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight mb-2">
              GTA 6 Mission Directory
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-2xl">
              Directory of campaign storylines, bank heists, contracts, smuggling drops, and bounty targets across Leonida.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl border border-[#273043] bg-[#121622] text-[#94a3b8]">
              Completed: <strong className="text-[#c8f135]">{completedMissions.length}</strong> / {MISSIONS_DATA.length}
            </span>
            <Link
              to="/tracker"
              className="px-3 py-1.5 rounded-xl bg-[#1c2232] text-[#c8f135] font-semibold border border-[#273248] hover:bg-[#232b3f]"
            >
              Open Tracker →
            </Link>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="mission-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mission title, location, or target..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12151f] border border-[#232b3b] text-sm text-[#ededef] placeholder-[#64748b] focus:outline-none focus:border-[#c8f135]"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#c8f135] text-[#090a0f]'
                  : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
              }`}
            >
              All ({MISSIONS_DATA.length})
            </button>
            {MISSION_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#c8f135] text-[#090a0f]'
                    : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isComplete = completedMissions.includes(mission.id);
          const isExpanded = expandedId === mission.id;

          return (
            <div
              key={mission.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isComplete
                  ? 'bg-[#0f121a] border-[#1e2536]'
                  : 'bg-[#12151f] border-[#202636] hover:border-[#2f394f]'
              }`}
            >
              {/* Mission Card Top */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : mission.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={(e) => toggleComplete(mission.id, e)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${
                      isComplete
                        ? 'bg-[#c8f135] text-[#090a0f]'
                        : 'border border-[#38435d] text-transparent hover:border-[#c8f135]'
                    }`}
                    aria-label={`Toggle completion for ${mission.title}`}
                  >
                    {isComplete && <CheckSquare className="w-4 h-4 fill-current" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1a2130] text-[#c8f135] border border-[#273248]">
                        {mission.category}
                      </span>
                      <SampleDataBadge />
                    </div>

                    <h2
                      className={`text-base font-bold transition-colors ${
                        isComplete ? 'line-through text-[#64748b]' : 'text-[#f8fafc]'
                      }`}
                    >
                      {mission.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#8090a8] mt-2 font-mono">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#64748b]" />
                        <span>{mission.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#64748b]" />
                        <span>{mission.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#c8f135]">
                        <DollarSign className="w-3 h-3" />
                        <span>{mission.estimatedReward}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="p-1 rounded-lg text-[#64748b] hover:text-[#ededef] shrink-0"
                  aria-label={isExpanded ? 'Collapse mission details' : 'Expand mission details'}
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#1a202e] space-y-3 bg-[#0d1017]">
                  <p className="text-xs text-[#cad2e0] leading-relaxed">
                    {mission.description}
                  </p>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-[#8090a8] uppercase tracking-wider">
                      Key Objectives:
                    </div>
                    <ul className="space-y-1 text-xs text-[#94a3b8] pl-4 list-disc">
                      {mission.objectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1e2536] text-[#8090a8]">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#64748b]" />
                      <span>Protagonist: {mission.protagonist}</span>
                    </div>
                    {mission.prerequisites && (
                      <span>Prerequisites: {mission.prerequisites}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Demand Discovery Feedback on Missions */}
    
    </div>
  );
};
