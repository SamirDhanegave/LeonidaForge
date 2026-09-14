import React, { useState } from 'react';
import { useRouter, Link } from '../services/router';
import { useSEO } from '../hooks/useSEO';
import {
  Scale,
  Plus,
  Trash2,
  X,
  Gauge,
  CheckCircle2,
  Car,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/vehicles';
import { Vehicle } from '../types';
import { StorageService } from '../services/storage';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ComparePage: React.FC = () => {
  const { navigate } = useRouter();

  useSEO({
    title: 'Compare GTA 6 Vehicles | 3-Way Specs Comparison',
    description:
      'Compare up to three GTA 6 vehicles side-by-side. Compare top speed, 0-60 acceleration, handling scores, and pricing.',
    canonicalPath: '/compare',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Compare', item: '/compare' },
    ],
  });

  const [comparedSlugs, setComparedSlugs] = useState<string[]>(() =>
    StorageService.getComparedVehicles()
  );
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number>(0);

  const selectedVehicles: (Vehicle | null)[] = [0, 1, 2].map((idx) => {
    const slug = comparedSlugs[idx];
    if (!slug) return null;
    return VEHICLES_DATA.find((v) => v.slug === slug) || null;
  });

  const handleRemove = (slug: string) => {
    const updated = StorageService.removeComparedVehicle(slug);
    setComparedSlugs(updated);
  };

  const handleSelectSlotVehicle = (slug: string) => {
    const current = [...comparedSlugs];
    // If slug already exists, replace or place at slot
    const filtered = current.filter((s) => s !== slug);
    filtered.splice(pickerSlotIndex, 0, slug);
    const updated = filtered.slice(0, 3);
    StorageService.setComparedVehicles(updated);
    setComparedSlugs(updated);
    setIsPickerOpen(false);
  };

  const openPickerForSlot = (slotIdx: number) => {
    setPickerSlotIndex(slotIdx);
    setIsPickerOpen(true);
  };

  // Metric benchmark calculations
  const maxSpeed = Math.max(
    ...selectedVehicles.filter(Boolean).map((v) => v!.topSpeedMph),
    1
  );
  const minAccel = Math.min(
    ...selectedVehicles.filter(Boolean).map((v) => v!.accelerationSec),
    99
  );
  const maxHandling = Math.max(
    ...selectedVehicles.filter(Boolean).map((v) => v!.handlingScore),
    1
  );
  const maxOverall = Math.max(
    ...selectedVehicles.filter(Boolean).map((v) => v!.overallScore),
    1
  );

  return (
    <div id="compare-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Compare', path: '/compare' }]} />

      {/* Header */}
      <section id="compare-header" className="border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c8f135]">
            Telemetry Comparison Engine
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight mb-2">
              Compare GTA 6 Vehicles
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-2xl">
              Evaluate up to three vehicles simultaneously across speed, 0-60 acceleration, handling rating,
              and affordability. Saved locally in your browser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                StorageService.clearComparedVehicles();
                setComparedSlugs([]);
              }}
              className="px-3.5 py-2 rounded-xl border border-[#263148] bg-[#141824] hover:bg-[#1b2234] text-xs font-medium text-[#94a3b8] hover:text-[#f8fafc] transition-all"
            >
              Clear Comparison
            </button>
            <Link
              to="/vehicles"
              className="px-3.5 py-2 rounded-xl bg-[#c8f135] text-[#090a0f] text-xs font-bold hover:bg-[#d6f658] transition-all"
            >
              Browse Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Slot Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((slotIdx) => {
          const veh = selectedVehicles[slotIdx];

          if (!veh) {
            return (
              <div
                key={slotIdx}
                onClick={() => openPickerForSlot(slotIdx)}
                className="h-[440px] rounded-2xl border-2 border-dashed border-[#20283b] hover:border-[#c8f135]/50 bg-[#0e1118] hover:bg-[#121622] transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#181d2a] border border-[#263146] flex items-center justify-center text-[#64748b] group-hover:text-[#c8f135] group-hover:border-[#c8f135]/50 transition-all mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-[#f8fafc] mb-1">
                  Add Vehicle to Slot {slotIdx + 1}
                </div>
                <p className="text-xs text-[#64748b] max-w-[200px]">
                  Click to select from the 12+ vehicle simulated database
                </p>
              </div>
            );
          }

          const isBestSpeed = veh.topSpeedMph === maxSpeed && selectedVehicles.filter(Boolean).length > 1;
          const isBestAccel = veh.accelerationSec === minAccel && selectedVehicles.filter(Boolean).length > 1;
          const isBestHandling = veh.handlingScore === maxHandling && selectedVehicles.filter(Boolean).length > 1;
          const isBestOverall = veh.overallScore === maxOverall && selectedVehicles.filter(Boolean).length > 1;

          return (
            <div
              key={slotIdx}
              className="rounded-2xl border border-[#202636] bg-[#12151f] flex flex-col justify-between overflow-hidden shadow-sm relative"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-[#1c2230] space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1a2130] text-[#c8f135] border border-[#273248]">
                    {veh.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openPickerForSlot(slotIdx)}
                      className="text-[11px] font-medium text-[#8090a8] hover:text-[#f8fafc] px-2 py-1 rounded bg-[#161a26] border border-[#222938]"
                    >
                      Swap
                    </button>
                    <button
                      onClick={() => handleRemove(veh.slug)}
                      className="p-1 rounded text-[#64748b] hover:text-red-400 hover:bg-[#1e1c24] transition-colors"
                      title="Remove vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#f8fafc]">{veh.name}</h2>
                  <div className="text-xs text-[#8090a8] mt-0.5">
                    {veh.manufacturer} • {veh.drivetrain}
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-2">
                  <div className="text-2xl font-extrabold text-[#f8fafc] font-mono">
                    ${veh.price.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold font-mono text-[#c8f135]">
                    Score: {veh.overallScore}/100 {isBestOverall && '★'}
                  </div>
                </div>
              </div>

              {/* Metrics Table */}
              <div className="p-6 space-y-4 flex-1">
                {/* Metric 1: Top Speed */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8090a8]">Top Speed:</span>
                    <span className={`font-mono font-bold ${isBestSpeed ? 'text-emerald-400' : 'text-[#f8fafc]'}`}>
                      {veh.topSpeedMph} MPH {isBestSpeed && '(Fastest)'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1b202c] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isBestSpeed ? 'bg-emerald-400' : 'bg-[#c8f135]'}`}
                      style={{ width: `${(veh.topSpeedMph / 150) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: 0-60 Accel */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8090a8]">0-60 mph Sprint:</span>
                    <span className={`font-mono font-bold ${isBestAccel ? 'text-cyan-400' : 'text-[#f8fafc]'}`}>
                      {veh.accelerationSec}s {isBestAccel && '(Quickest)'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1b202c] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isBestAccel ? 'bg-cyan-400' : 'bg-sky-400'}`}
                      style={{ width: `${((6 - veh.accelerationSec) / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3: Handling */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8090a8]">Handling Stability:</span>
                    <span className={`font-mono font-bold ${isBestHandling ? 'text-sky-400' : 'text-[#f8fafc]'}`}>
                      {veh.handlingScore}/100
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1b202c] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isBestHandling ? 'bg-sky-400' : 'bg-indigo-400'}`}
                      style={{ width: `${veh.handlingScore}%` }}
                    />
                  </div>
                </div>

                {/* Metric 4: Braking */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8090a8]">Braking Rating:</span>
                    <span className="text-[#f8fafc] font-mono font-bold">
                      {veh.brakingScore}/100
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1b202c] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-400"
                      style={{ width: `${veh.brakingScore}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-3 border-t border-[#1e2434] space-y-1.5">
                  <div className="text-[11px] text-[#64748b]">Best use case:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {veh.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#161b26] text-[10px] text-[#c8f135] font-semibold border border-[#242e42]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-4 border-t border-[#1c2230] bg-[#0f121a]">
                <Link
                  to={`/vehicles/${veh.slug}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#161a26] hover:bg-[#1f2536] border border-[#242c3e] text-xs font-semibold text-[#f8fafc] transition-all"
                >
                  <span>View Full Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c8f135]" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicle Swap / Picker Modal */}
      {isPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsPickerOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-[#263148] bg-[#121520] p-6 shadow-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#1e2536] mb-4">
              <h2 className="text-base font-bold text-[#f8fafc]">
                Select Vehicle for Slot {pickerSlotIndex + 1}
              </h2>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1d2334]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1">
              {VEHICLES_DATA.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleSelectSlotVehicle(v.slug)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#1e2434] bg-[#151926] hover:bg-[#1b2234] hover:border-[#c8f135]/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#202738] flex items-center justify-center font-mono text-xs font-bold text-[#c8f135]">
                      {v.category.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#f8fafc] group-hover:text-[#c8f135]">
                        {v.name}
                      </div>
                      <div className="text-xs text-[#8090a8]">
                        {v.category} • ${v.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <div className="text-[#f8fafc] font-bold">{v.topSpeedMph} MPH</div>
                    <div className="text-[#c8f135]">{v.accelerationSec}s 0-60</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Demand Discovery Feedback on Compare */}
      <section className="pt-6">
        <FeedbackModule
          pageSlug="compare-tool"
          contextTitle="3-Way Vehicle Comparison Telemetry"
        />
      </section>
    </div>
  );
};
