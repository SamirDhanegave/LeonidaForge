import React, { useState } from 'react';
import { useRouter, Link } from '../services/router';
import { useSEO } from '../hooks/useSEO';
import {
  Car,
  Scale,
  Bookmark,
  BookmarkCheck,
  MapPin,
  CheckCircle2,
  XCircle,
  Gauge,
  Search,
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/vehicles';
import { StorageService } from '../services/storage';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { NotFoundPage } from './NotFoundPage';

export const VehicleDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug;

  const vehicle = VEHICLES_DATA.find((v) => v.slug === slug);

  // If vehicle is invalid or nonexistent, render dedicated 404
  if (!vehicle) {
    return <NotFoundPage />;
  }

  useSEO({
    title: `${vehicle.name} | GTA 6 Vehicle Database`,
    description:
      vehicle.seoDescription ||
      `Explore ${vehicle.name}, compare its sample performance data, specifications, top speed, and discover related GTA VI vehicle tools.`,
    canonicalPath: `/vehicles/${vehicle.slug}`,
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Vehicles', item: '/vehicles' },
      { name: vehicle.name, item: `/vehicles/${vehicle.slug}` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: `${vehicle.name} | GTA 6 Vehicle Database`,
      description: `Explore ${vehicle.name}, compare its sample performance data, specifications, top speed, and discover related GTA VI vehicle tools.`,
      mainEntity: {
        '@type': 'Vehicle',
        name: vehicle.name,
        manufacturer: {
          '@type': 'Organization',
          name: vehicle.manufacturer,
        },
        vehicleConfiguration: vehicle.category,
        driveWheelConfiguration: vehicle.drivetrain,
        speed: `${vehicle.topSpeedMph} MPH`,
        numberOfDoors: vehicle.seats,
      },
    },
  });

  const [comparedList, setComparedList] = useState<string[]>(() =>
    StorageService.getComparedVehicles()
  );
  const [isTracked, setIsTracked] = useState<boolean>(() =>
    StorageService.getTrackedVehicles().includes(vehicle.slug)
  );

  const isCompared = comparedList.includes(vehicle.slug);

  const handleOpenCompare = () => {
    if (!isCompared) {
      StorageService.addComparedVehicle(vehicle.slug);
    }
    navigate('/compare');
  };

  const handleToggleTrack = () => {
    const newState = StorageService.toggleTrackedVehicle(vehicle.slug);
    setIsTracked(newState);
  };

  const relatedVehicles = VEHICLES_DATA.filter(
    (v) => v.slug !== vehicle.slug && (v.category === vehicle.category || v.bestFor.some((b) => vehicle.bestFor.includes(b)))
  ).slice(0, 3);

  // Performance bar metrics
  const metrics = [
    { label: 'Overall Rating', value: vehicle.overallScore, max: 100, unit: '/100', color: 'bg-[#c8f135]' },
    { label: 'Top Speed', value: Math.min(100, Math.round((vehicle.topSpeedMph / 150) * 100)), display: `${vehicle.topSpeedMph} MPH`, color: 'bg-emerald-400' },
    { label: 'Acceleration', value: Math.min(100, Math.round(((6 - vehicle.accelerationSec) / 4) * 100)), display: `${vehicle.accelerationSec}s (0-60)`, color: 'bg-cyan-400' },
    { label: 'Handling Stability', value: vehicle.handlingScore, max: 100, unit: '/100', color: 'bg-sky-400' },
    { label: 'Braking Distance', value: vehicle.brakingScore, max: 100, unit: '/100', color: 'bg-indigo-400' },
  ];

  return (
    <div id="vehicle-detail-page" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Semantic Breadcrumbs with Microdata */}
      <Breadcrumbs
        items={[
          { label: 'Vehicles', path: '/vehicles' },
          { label: vehicle.name, path: `/vehicles/${vehicle.slug}` },
        ]}
      />

      {/* Main Vehicle Hero Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Schematic & Performance Visualization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Technical Schematic Banner */}
          <div className="rounded-2xl border border-[#232a3c] bg-gradient-to-br from-[#161a26] to-[#0f121a] p-6 sm:p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden shadow-md">
            {/* Subtle Grid Lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c8f135_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Top Row */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#090b10] border border-[#263045] text-[#c8f135]">
                  {vehicle.category.toUpperCase()}
                </span>
                <span className="text-xs text-[#8090a8] font-mono">{vehicle.drivetrain} DRIVETRAIN</span>
              </div>
              <SampleDataBadge />
            </div>

            {/* Primary H1 Heading */}
            <div className="my-10 text-center relative z-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono text-[#f8fafc] uppercase mb-1">
                {vehicle.name}
              </h1>
              <div className="text-xs font-mono text-[#c8f135] tracking-wider uppercase">
                ENGINEERING TELEMETRY SCHEMATIC • {vehicle.manufacturer}
              </div>
            </div>

            {/* Bottom Row Highlights */}
            <div className="grid grid-cols-3 gap-3 border-t border-[#222a3d] pt-4 relative z-10 text-center font-mono">
              <div>
                <div className="text-[10px] text-[#64748b] uppercase">Class Rank</div>
                <div className="text-sm font-bold text-[#f8fafc]">Top Tier</div>
              </div>
              <div>
                <div className="text-[10px] text-[#64748b] uppercase">Seating</div>
                <div className="text-sm font-bold text-[#f8fafc]">{vehicle.seats} Passengers</div>
              </div>
              <div>
                <div className="text-[10px] text-[#64748b] uppercase">Overall Score</div>
                <div className="text-sm font-bold text-[#c8f135]">{vehicle.overallScore}/100</div>
              </div>
            </div>
          </div>

          {/* Performance Visualization Metrics */}
          <div className="rounded-2xl border border-[#202636] bg-[#12151f] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#f8fafc] flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#c8f135]" />
                <span>Performance Telemetry</span>
              </h2>
              <span className="text-xs text-[#64748b]">Simulated Benchmarks</span>
            </div>

            <div className="space-y-3.5">
              {metrics.map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#94a3b8]">{m.label}</span>
                    <span className="text-[#f8fafc] font-mono font-bold">
                      {m.display || `${m.value}${m.unit || ''}`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#1b202c] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.color} transition-all duration-500`}
                      style={{ width: `${Math.max(5, m.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* "Best for" Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#64748b]">Best suited for:</span>
              {vehicle.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-[#1b2230] border border-[#2a3449] text-[#c8f135] text-[11px] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Specs, Price, Actions & Pros/Cons (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price & Action Header */}
          <div className="rounded-2xl border border-[#202636] bg-[#12151f] p-6 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1">
                Estimated In-Game Price
              </div>
              <div className="text-3xl font-extrabold text-[#f8fafc] font-mono">
                ${vehicle.price.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8090a8]">
                <span>Requires approx.</span>
                <strong className="text-[#c8f135]">
                  {Math.ceil(vehicle.price / 150000)} heist sessions
                </strong>
                <span>to afford</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="vehicle-detail-compare-btn"
                onClick={handleOpenCompare}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#c8f135] text-[#090a0f] text-xs font-bold hover:bg-[#d5f857] active:scale-95 transition-all shadow-md"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Specs</span>
              </button>

              <button
                id="vehicle-detail-track-btn"
                onClick={handleToggleTrack}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold active:scale-95 transition-all ${
                  isTracked
                    ? 'bg-[#c8f135]/15 border-[#c8f135]/50 text-[#c8f135]'
                    : 'bg-[#181d2a] border-[#293245] text-[#ededef] hover:bg-[#202638]'
                }`}
              >
                {isTracked ? <BookmarkCheck className="w-4 h-4 text-[#c8f135]" /> : <Bookmark className="w-4 h-4" />}
                <span>{isTracked ? 'Tracked in Garage' : 'Track Vehicle'}</span>
              </button>
            </div>

            {/* Quick Link to Money Tool */}
            <div className="p-3 rounded-xl bg-[#161a26] border border-[#22293b] flex items-center justify-between text-xs">
              <span className="text-[#8090a8]">Planning to purchase?</span>
              <Link to="/money" className="text-[#c8f135] font-semibold hover:underline">
                Open Money Planner →
              </Link>
            </div>

            {/* Overview Description */}
            <div className="space-y-2 pt-2 border-t border-[#1e2434]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                Vehicle Overview
              </h2>
              <p className="text-xs sm:text-sm text-[#ededef] leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Spawn Location Hint */}
            <div className="p-3.5 rounded-xl border border-[#20283b] bg-[#141824] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#c8f135]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Observed Spawn Location</span>
              </div>
              <p className="text-xs text-[#8090a8] leading-relaxed">
                {vehicle.locationHint}
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1e2434]">
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strengths</span>
                </div>
                <ul className="space-y-1 text-xs text-[#94a3b8]">
                  {vehicle.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Drawbacks</span>
                </div>
                <ul className="space-y-1 text-xs text-[#94a3b8]">
                  {vehicle.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Vehicles Section */}
      <section className="space-y-4 pt-4 border-t border-[#1e2434]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#f8fafc]">
            Related Vehicles in {vehicle.category}
          </h2>
          <Link to="/vehicles" className="text-xs text-[#c8f135] hover:underline">
            Browse All {vehicle.category} Vehicles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedVehicles.map((rel) => (
            <Link
              key={rel.id}
              to={`/vehicles/${rel.slug}`}
              className="p-4 rounded-xl border border-[#202636] bg-[#12151f] hover:bg-[#161a27] hover:border-[#c8f135]/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#1b2230] text-[#94a3b8]">
                    {rel.category}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#f8fafc]">
                    ${rel.price.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors">
                  {rel.name}
                </h3>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#8090a8] font-mono">
                <span>{rel.topSpeedMph} MPH</span>
                <span className="text-[#c8f135]">{rel.accelerationSec}s 0-60</span>
                <span>Score {rel.overallScore}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Related Searches Internal Links */}
      <section className="p-5 rounded-2xl border border-[#202636] bg-[#0e1118] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          <Search className="w-3.5 h-3.5 text-[#c8f135]" />
          <span>Related Player Searches</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/guides/gta-6-fastest-car"
            className="px-3 py-1.5 rounded-lg border border-[#242b3b] bg-[#141822] text-xs text-[#ededef] hover:border-[#c8f135]/50 hover:text-[#c8f135] transition-all"
          >
            GTA 6 fastest cars
          </Link>
          <Link
            to="/vehicles"
            className="px-3 py-1.5 rounded-lg border border-[#242b3b] bg-[#141822] text-xs text-[#ededef] hover:border-[#c8f135]/50 hover:text-[#c8f135] transition-all"
          >
            Compare GTA 6 vehicles
          </Link>
          <Link
            to="/guides/gta-6-car-locations"
            className="px-3 py-1.5 rounded-lg border border-[#242b3b] bg-[#141822] text-xs text-[#ededef] hover:border-[#c8f135]/50 hover:text-[#c8f135] transition-all"
          >
            GTA 6 car locations
          </Link>
          <Link
            to="/compare"
            className="px-3 py-1.5 rounded-lg border border-[#242b3b] bg-[#141822] text-xs text-[#ededef] hover:border-[#c8f135]/50 hover:text-[#c8f135] transition-all"
          >
            Launch 3-way compare tool
          </Link>
          <Link
            to="/money"
            className="px-3 py-1.5 rounded-lg border border-[#242b3b] bg-[#141822] text-xs text-[#ededef] hover:border-[#c8f135]/50 hover:text-[#c8f135] transition-all"
          >
            Open the money planner
          </Link>
        </div>
      </section>

      {/* Demand Discovery Feedback */}
      <FeedbackModule
        pageSlug={`vehicle-${vehicle.slug}`}
        contextTitle={`${vehicle.name} Specs & Telemetry`}
      />
    </div>
  );
};
