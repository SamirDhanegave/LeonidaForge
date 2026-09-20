import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Link } from '../services/router';
import {
  MapPin,
  Search,
  Building,
  Anchor,
  Crosshair,
  Wrench,
  Shield,
  Layers,
} from 'lucide-react';
import { LOCATIONS_DATA, LOCATION_DISTRICTS } from '../data/locations';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const LocationsPage: React.FC = () => {
  useSEO({
    title: 'GTA 6 Map Locations | Leonida Safehouses & POIs',
    description:
      'Explore key districts, gun stores, underground chop shops, docks, and high-value loot caches across the State of Leonida.',
    canonicalPath: '/locations',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Locations', item: '/locations' },
    ],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const types = ['All', 'Safehouse', 'Mod Shop', 'Gun Store', 'Helipad', 'Boat Dock', 'Loot Spot', 'Collectible Area'];

  const filteredLocations = LOCATIONS_DATA.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || loc.district === selectedDistrict;
    const matchesType = selectedType === 'All' || loc.type === selectedType;
    return matchesSearch && matchesDistrict && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Safehouse':
        return Building;
      case 'Boat Dock':
        return Anchor;
      case 'Gun Store':
        return Crosshair;
      case 'Mod Shop':
        return Wrench;
      default:
        return MapPin;
    }
  };

  return (
    <div id="locations-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Locations', path: '/locations' }]} />

      {/* Header */}
      <section id="locations-header" className="border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
            Cartographic Intelligence
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight mb-2">
          State of Leonida Location Explorer
        </h1>
        <p className="text-sm text-[#94a3b8] max-w-2xl">
          Directory of safehouses, underground chop shops, gun retailers, boat slips, and sunken cargo containers.
        </p>

        {/* Search intent links */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link
            to="/guides/gta-6-map-guide"
            className="px-2.5 py-1 rounded-md bg-[#161a26] border border-[#262e42] text-[#c8f135] hover:underline"
          >
            Read Leonida Map Guide →
          </Link>
          <Link
            to="/vehicles"
            className="px-2.5 py-1 rounded-md bg-[#161a26] border border-[#262e42] text-[#ededef] hover:text-[#c8f135]"
          >
            Vehicle Spawn Coordinates →
          </Link>
        </div>
      </section>

      {/* Filters and Search Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="location-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations by name, utility, or keyword (e.g. helipad, docks, safehouse)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#242b3c] bg-[#121622] text-sm text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#c8f135]/60"
          />
        </div>

        {/* District Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDistrict('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDistrict === 'All'
                ? 'bg-[#c8f135] text-[#090a0f]'
                : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
            }`}
          >
            All Districts ({LOCATIONS_DATA.length})
          </button>
          {LOCATION_DISTRICTS.map((district) => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDistrict === district
                  ? 'bg-[#c8f135] text-[#090a0f]'
                  : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLocations.map((loc) => {
          const Icon = getTypeIcon(loc.type);

          return (
            <div
              key={loc.id}
              className="rounded-2xl border border-[#202636] bg-[#12151f] p-6 flex flex-col justify-between hover:border-[#2f394f] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#181d2a] border border-[#242e42] flex items-center justify-center text-[#c8f135]">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#181d2a] text-[#c8f135]">
                      {loc.type}
                    </span>
                  </div>
                  <span className="text-xs text-[#8090a8] font-mono">{loc.district}</span>
                </div>

                <h2 className="text-base font-bold text-[#f8fafc] mb-1.5">{loc.name}</h2>
                <p className="text-xs text-[#cad2e0] leading-relaxed mb-4">{loc.description}</p>
              </div>

              <div className="pt-3 border-t border-[#1c2230] space-y-2">
                <div className="text-[11px] text-[#64748b]">
                  <strong className="text-[#8090a8]">Strategic Value:</strong> {loc.whyItMatters}
                </div>

                {loc.activities && loc.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {loc.activities.map((act) => (
                      <span
                        key={act}
                        className="px-1.5 py-0.5 rounded bg-[#161a26] text-[9px] font-mono text-[#8090a8] border border-[#202636]"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Demand Discovery Feedback on Locations */}
      <section className="pt-6">
        <FeedbackModule
          pageSlug="locations-directory"
          contextTitle="Leonida Location Explorer & District POIs"
        />
      </section>
    </div>
  );
};
