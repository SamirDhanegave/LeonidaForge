import React, { useState, useMemo } from 'react';
import { useRouter, Link } from '../services/router';
import { useSEO } from '../hooks/useSEO';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Scale,
  Bookmark,
  BookmarkCheck,
  Check,
  ArrowUpDown,
  Car,
  ChevronRight,
  Info,
} from 'lucide-react';
import { VEHICLES_DATA, VEHICLE_CATEGORIES } from '../data/vehicles';
import { VehicleCategory } from '../types';
import { StorageService } from '../services/storage';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const VehiclesPage: React.FC = () => {
  const { navigate } = useRouter();

  useSEO({
    title: 'GTA 6 Vehicles | Vehicle Database & Comparison',
    description:
      'Search and filter GTA 6 vehicles by top speed, class, acceleration, and spawn points in Vice Beach and Port Gellhorn.',
    canonicalPath: '/vehicles',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Vehicles', item: '/vehicles' },
    ],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [sortBy, setSortBy] = useState<'overall' | 'topSpeed' | 'acceleration' | 'priceAsc' | 'priceDesc'>('overall');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Local storage states for compare and tracked
  const [comparedList, setComparedList] = useState<string[]>(() =>
    StorageService.getComparedVehicles()
  );
  const [trackedList, setTrackedList] = useState<string[]>(() =>
    StorageService.getTrackedVehicles()
  );

  const handleToggleCompare = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (comparedList.includes(slug)) {
      const updated = StorageService.removeComparedVehicle(slug);
      setComparedList(updated);
    } else {
      const updated = StorageService.addComparedVehicle(slug);
      setComparedList(updated);
    }
  };

  const handleToggleTrack = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const isNowTracked = StorageService.toggleTrackedVehicle(slug);
    if (isNowTracked) {
      setTrackedList((prev) => [...prev, slug]);
    } else {
      setTrackedList((prev) => prev.filter((id) => id !== slug));
    }
  };

  const filteredVehicles = useMemo(() => {
    return VEHICLES_DATA.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.locationHint.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
      const matchesPrice = v.price <= maxPrice;

      return matchesSearch && matchesCat && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'overall') return b.overallScore - a.overallScore;
      if (sortBy === 'topSpeed') return b.topSpeedMph - a.topSpeedMph;
      if (sortBy === 'acceleration') return a.accelerationSec - b.accelerationSec;
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  return (
    <div id="vehicles-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Vehicles', path: '/vehicles' }]} />

      {/* SEO Introduction Header */}
      <section id="vehicles-seo-intro" className="border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
            Leonida Motor Vehicle Directory
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight mb-4">
          GTA 6 Vehicle Database & Performance Stats
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] max-w-3xl leading-relaxed">
          Comprehensive specifications, verified top speed simulations, 0-60 mph acceleration ratings,
          pricing benchmarks, and world spawn locations for vehicles observed in the State of Leonida.
          Use this database to find the ideal machine for highway getaways, track races, and wetland traversal.
        </p>

        {/* Quick Funnel Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[#64748b]">Jump to intent:</span>
          <Link
            to="/compare"
            className="px-2.5 py-1 rounded-md bg-[#161a26] border border-[#262e42] text-[#ededef] hover:text-[#c8f135] hover:border-[#c8f135]/40"
          >
            Compare 3 Vehicles ({comparedList.length} selected)
          </Link>
          <Link
            to="/guides/gta-6-fastest-car"
            className="px-2.5 py-1 rounded-md bg-[#161a26] border border-[#262e42] text-[#ededef] hover:text-[#c8f135] hover:border-[#c8f135]/40"
          >
            Fastest Cars Guide
          </Link>
          <Link
            to="/money"
            className="px-2.5 py-1 rounded-md bg-[#161a26] border border-[#262e42] text-[#ededef] hover:text-[#c8f135] hover:border-[#c8f135]/40"
          >
            Affordability Calculator
          </Link>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <section id="vehicle-filters" className="space-y-4">
        {/* Row 1: Search, Sort & View Mode */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="vehicle-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by car name, brand, location, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12151f] border border-[#232b3b] text-sm text-[#ededef] placeholder-[#64748b] focus:outline-none focus:border-[#c8f135] transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                id="vehicle-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort vehicles"
                className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-[#12151f] border border-[#232b3b] text-xs font-semibold text-[#ededef] focus:outline-none focus:border-[#c8f135] cursor-pointer"
              >
                <option value="overall">Sort: Highest Overall</option>
                <option value="topSpeed">Sort: Top Speed</option>
                <option value="acceleration">Sort: Quickest 0-60</option>
                <option value="priceAsc">Sort: Price (Low to High)</option>
                <option value="priceDesc">Sort: Price (High to Low)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#64748b] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl bg-[#12151f] border border-[#232b3b] p-1">
              <button
                id="vehicle-view-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#222a3d] text-[#c8f135]' : 'text-[#64748b] hover:text-[#ededef]'
                }`}
                title="Grid View"
                aria-label="Switch to grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="vehicle-view-list"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#222a3d] text-[#c8f135]' : 'text-[#64748b] hover:text-[#ededef]'
                }`}
                title="List View"
                aria-label="Switch to list view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-[#c8f135] text-[#090a0f] shadow-sm'
                : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
            }`}
          >
            All Classes ({VEHICLES_DATA.length})
          </button>
          {VEHICLE_CATEGORIES.map((cat) => {
            const count = VEHICLES_DATA.filter((v) => v.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#c8f135] text-[#090a0f] shadow-sm'
                    : 'bg-[#12151f] text-[#8090a8] hover:text-[#ededef] border border-[#202636]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Row 3: Price Slider & Status Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0f121a] border border-[#1e2434] text-xs">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-[#c8f135]" />
            <span className="text-[#8090a8]">Max In-Game Budget:</span>
            <span className="font-mono font-bold text-[#f8fafc]">
              ${maxPrice.toLocaleString()}
            </span>
            <input
              type="range"
              min={50000}
              max={3000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Filter by maximum price"
              className="w-32 sm:w-48 accent-[#c8f135] cursor-pointer"
            />
          </div>

          <div className="text-[#64748b] font-mono">
            Showing <strong className="text-[#ededef]">{filteredVehicles.length}</strong> of{' '}
            {VEHICLES_DATA.length} simulated vehicles
          </div>
        </div>
      </section>

      {/* Vehicle Listing Display */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-[#202636] bg-[#12151f] space-y-3">
          <Car className="w-10 h-10 text-[#64748b] mx-auto" />
          <h3 className="text-base font-bold text-[#f8fafc]">No matching vehicles found</h3>
          <p className="text-xs text-[#8090a8] max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Classes", or increasing the maximum budget slider.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMaxPrice(3000000);
            }}
            className="mt-2 text-xs font-semibold text-[#c8f135] underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View with semantic crawlable Link cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((veh) => {
            const isCompared = comparedList.includes(veh.slug);
            const isTracked = trackedList.includes(veh.slug);

            return (
              <Link
                key={veh.id}
                id={`vehicle-card-${veh.slug}`}
                to={`/vehicles/${veh.slug}`}
                className="group rounded-2xl border border-[#202636] bg-[#12151f] hover:bg-[#151926] hover:border-[#c8f135]/40 transition-all flex flex-col justify-between overflow-hidden shadow-sm"
              >
                {/* Visual Technical Schematic Placeholder */}
                <div className="h-40 bg-gradient-to-b from-[#181d2a] to-[#12151f] border-b border-[#1e2434] p-4 flex flex-col justify-between relative overflow-hidden">
                  {/* Subtle Grid Backdrop */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c8f135_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#0c0f16] text-[#94a3b8] border border-[#22293b]">
                      {veh.category}
                    </span>
                    <SampleDataBadge />
                  </div>

                  {/* Center Emblem Schematic */}
                  <div className="flex flex-col items-center justify-center my-auto text-center relative z-10">
                    <div className="text-xl font-extrabold tracking-wider font-mono text-[#c8f135]/80 group-hover:text-[#c8f135] transition-colors">
                      {veh.manufacturer.toUpperCase()}
                    </div>
                    <div className="text-[11px] font-mono text-[#64748b]">
                      CLASS: {veh.category.toUpperCase()} • {veh.drivetrain}
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-base font-extrabold text-[#f8fafc] font-mono">
                      ${veh.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#c8f135] font-mono font-semibold">
                      Score: {veh.overallScore}/100
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors">
                      {veh.name}
                    </h2>
                    <p className="text-xs text-[#8090a8] line-clamp-2 mt-1 leading-relaxed">
                      {veh.description}
                    </p>
                  </div>

                  {/* Performance Specs Mini Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#1c2230] text-center">
                    <div>
                      <div className="text-[10px] text-[#64748b] uppercase">Top Speed</div>
                      <div className="text-xs font-bold font-mono text-[#f8fafc]">
                        {veh.topSpeedMph} <span className="text-[10px] font-normal text-[#64748b]">MPH</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#64748b] uppercase">0-60 Accel</div>
                      <div className="text-xs font-bold font-mono text-[#c8f135]">
                        {veh.accelerationSec}s
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#64748b] uppercase">Handling</div>
                      <div className="text-xs font-bold font-mono text-[#f8fafc]">
                        {veh.handlingScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Actions: Compare & Track */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={(e) => handleToggleCompare(veh.slug, e)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                        isCompared
                          ? 'bg-[#c8f135]/15 border-[#c8f135]/50 text-[#c8f135]'
                          : 'bg-[#161a26] border-[#242c3d] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1d2232]'
                      }`}
                      title="Add or remove from 3-way compare"
                    >
                      {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                      <span>{isCompared ? 'Compared' : 'Compare'}</span>
                    </button>

                    <button
                      onClick={(e) => handleToggleTrack(veh.slug, e)}
                      className={`inline-flex items-center justify-center p-2 rounded-lg text-xs border transition-all ${
                        isTracked
                          ? 'bg-[#c8f135]/15 border-[#c8f135]/50 text-[#c8f135]'
                          : 'bg-[#161a26] border-[#242c3d] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1d2232]'
                      }`}
                      title={isTracked ? 'Saved to your garage' : 'Save vehicle to garage'}
                    >
                      {isTracked ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-[#c8f135]" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="p-2 text-[#64748b] group-hover:text-[#c8f135]">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* List View with semantic crawlable Link cards */
        <div className="space-y-2.5">
          {filteredVehicles.map((veh) => {
            const isCompared = comparedList.includes(veh.slug);
            const isTracked = trackedList.includes(veh.slug);

            return (
              <Link
                key={veh.id}
                to={`/vehicles/${veh.slug}`}
                className="group p-4 rounded-xl border border-[#202636] bg-[#12151f] hover:bg-[#161a27] hover:border-[#c8f135]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1b2130] border border-[#263148] flex items-center justify-center font-mono text-xs font-bold text-[#c8f135] shrink-0">
                    {veh.category.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors">
                        {veh.name}
                      </h2>
                      <SampleDataBadge />
                    </div>
                    <div className="text-xs text-[#8090a8] mt-0.5">
                      {veh.manufacturer} • {veh.drivetrain} • {veh.category}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
                  <div>
                    <span className="text-[#64748b]">Price:</span>{' '}
                    <strong className="text-[#f8fafc]">${veh.price.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748b]">Top Speed:</span>{' '}
                    <strong className="text-[#f8fafc]">{veh.topSpeedMph} MPH</strong>
                  </div>
                  <div>
                    <span className="text-[#64748b]">0-60:</span>{' '}
                    <strong className="text-[#c8f135]">{veh.accelerationSec}s</strong>
                  </div>
                  <div>
                    <span className="text-[#64748b]">Handling:</span>{' '}
                    <strong className="text-[#f8fafc]">{veh.handlingScore}/100</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleToggleCompare(veh.slug, e)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs border font-medium transition-all ${
                      isCompared
                        ? 'bg-[#c8f135]/15 border-[#c8f135]/50 text-[#c8f135]'
                        : 'bg-[#161a26] border-[#242c3d] text-[#94a3b8] hover:text-[#f8fafc]'
                    }`}
                  >
                    {isCompared ? 'In Compare' : 'Compare'}
                  </button>
                  <button
                    onClick={(e) => handleToggleTrack(veh.slug, e)}
                    className={`p-1.5 rounded-lg text-xs border transition-all ${
                      isTracked
                        ? 'bg-[#c8f135]/15 border-[#c8f135]/50 text-[#c8f135]'
                        : 'bg-[#161a26] border-[#242c3d] text-[#94a3b8] hover:text-[#f8fafc]'
                    }`}
                  >
                    {isTracked ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#c8f135]" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <ChevronRight className="w-4 h-4 text-[#64748b] group-hover:text-[#c8f135] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Internal SEO Linking Modules */}
      <section className="p-6 rounded-2xl border border-[#202636] bg-[#0e1118] space-y-4">
        <h2 className="text-sm font-bold text-[#f8fafc] uppercase tracking-wider">
          Explore Related GTA VI Systems & Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/compare"
            className="p-3.5 rounded-xl border border-[#1e2434] bg-[#141824] hover:bg-[#181d2c] transition-all text-xs space-y-1 group"
          >
            <div className="font-bold text-[#ededef] group-hover:text-[#c8f135]">3-Way Vehicle Comparison</div>
            <p className="text-[#8090a8]">Side-by-side telemetry benchmarking and radar overlay.</p>
          </Link>
          <Link
            to="/money"
            className="p-3.5 rounded-xl border border-[#1e2434] bg-[#141824] hover:bg-[#181d2c] transition-all text-xs space-y-1 group"
          >
            <div className="font-bold text-[#ededef] group-hover:text-[#c8f135]">Money &amp; Affordability Planner</div>
            <p className="text-[#8090a8]">Estimate mission play hours required to buy your chosen vehicles.</p>
          </Link>
          <Link
            to="/guides/gta-6-car-locations"
            className="p-3.5 rounded-xl border border-[#1e2434] bg-[#141824] hover:bg-[#181d2c] transition-all text-xs space-y-1 group"
          >
            <div className="font-bold text-[#ededef] group-hover:text-[#c8f135]">Vehicle Spawn Locations Guide</div>
            <p className="text-[#8090a8]">Observed spawn hotspots across Vice City, wetlands, and airports.</p>
          </Link>
        </div>
      </section>

      {/* User Discovery Feedback */}

    </div>
  );
};
