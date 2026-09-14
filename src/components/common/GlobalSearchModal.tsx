import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Car, CheckSquare, MapPin, BookOpen, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useRouter } from '../../services/router';
import { VEHICLES_DATA } from '../../data/vehicles';
import { MISSIONS_DATA } from '../../data/missions';
import { LOCATIONS_DATA } from '../../data/locations';
import { GUIDES_DATA } from '../../data/guides';
import { POPULAR_SEARCHES_DATA } from '../../data/popularSearches';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { navigate } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global "/" key shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input or textarea
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        onClose(); // In case it's open, or trigger open
        const searchBtn = document.getElementById('nav-global-search-btn');
        searchBtn?.click();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingVehicles = trimmed
    ? VEHICLES_DATA.filter(
        (v) =>
          v.name.toLowerCase().includes(trimmed) ||
          v.category.toLowerCase().includes(trimmed) ||
          v.tags.some((t) => t.toLowerCase().includes(trimmed))
      ).slice(0, 4)
    : [];

  const matchingMissions = trimmed
    ? MISSIONS_DATA.filter(
        (m) =>
          m.title.toLowerCase().includes(trimmed) ||
          m.category.toLowerCase().includes(trimmed) ||
          m.description.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchingLocations = trimmed
    ? LOCATIONS_DATA.filter(
        (l) =>
          l.name.toLowerCase().includes(trimmed) ||
          l.district.toLowerCase().includes(trimmed) ||
          l.category.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchingGuides = trimmed
    ? GUIDES_DATA.filter(
        (g) =>
          g.title.toLowerCase().includes(trimmed) ||
          g.summary.toLowerCase().includes(trimmed) ||
          g.tags.some((t) => t.toLowerCase().includes(trimmed))
      ).slice(0, 3)
    : [];

  const totalResults =
    matchingVehicles.length +
    matchingMissions.length +
    matchingLocations.length +
    matchingGuides.length;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/80 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl rounded-2xl border border-[#232836] bg-[#12151d] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#232836] bg-[#151923]">
          <Search className="w-5 h-5 text-[#94a3b8] shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles, missions, locations, guides..."
            className="w-full bg-transparent text-sm sm:text-base text-[#f8fafc] placeholder-[#64748b] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#94a3b8] hover:text-[#ededef] hover:bg-[#232836]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-[#1f2430] border border-[#2b3242] text-[11px] text-[#94a3b8] hover:text-[#ededef]"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6">
          {!trimmed ? (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2.5">
                Popular Searches & Common Queries
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {POPULAR_SEARCHES_DATA.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.path)}
                    className="flex items-center justify-between text-left p-2.5 rounded-lg border border-[#232836] bg-[#161a24] hover:bg-[#1c2230] hover:border-[#c8f135]/40 transition-all group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#f8fafc] group-hover:text-[#c8f135]">
                        {item.query}
                      </div>
                      <div className="text-[11px] text-[#94a3b8] line-clamp-1">{item.description}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#c8f135] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex p-3 rounded-full bg-[#181c26] text-[#64748b] mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-[#ededef]">Nothing found for "{query}"</h4>
              <p className="text-xs text-[#94a3b8] mt-1 max-w-sm mx-auto">
                Try searching for a vehicle name (e.g., Banshee, Cheetah), category (Super, Off-road), district (Vice Beach), or topic (Money, 100%).
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Vehicles */}
              {matchingVehicles.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                    <Car className="w-3.5 h-3.5 text-[#c8f135]" />
                    <span>Vehicles ({matchingVehicles.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingVehicles.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleSelect(`/vehicles/${v.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#232836] bg-[#161a24] hover:bg-[#1c2230] hover:border-[#c8f135]/40 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#202533] flex items-center justify-center text-xs font-mono text-[#c8f135] shrink-0 font-semibold">
                            {v.category.slice(0, 3)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#f8fafc] group-hover:text-[#c8f135]">
                              {v.name}
                            </div>
                            <div className="text-xs text-[#94a3b8]">
                              ${v.price.toLocaleString()} • {v.topSpeedMph} MPH • {v.category}
                            </div>
                          </div>
                        </div>
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#c8f135]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Guides */}
              {matchingGuides.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#c8f135]" />
                    <span>Guides & Strategies ({matchingGuides.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingGuides.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleSelect(`/guides/${g.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#232836] bg-[#161a24] hover:bg-[#1c2230] hover:border-[#c8f135]/40 transition-all group text-left"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#f8fafc] group-hover:text-[#c8f135]">
                            {g.title}
                          </div>
                          <div className="text-xs text-[#94a3b8] line-clamp-1">{g.subtitle}</div>
                        </div>
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#c8f135] shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Missions */}
              {matchingMissions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                    <CheckSquare className="w-3.5 h-3.5 text-[#c8f135]" />
                    <span>Missions ({matchingMissions.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingMissions.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelect('/missions')}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#232836] bg-[#161a24] hover:bg-[#1c2230] hover:border-[#c8f135]/40 transition-all group text-left"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#f8fafc] group-hover:text-[#c8f135]">
                            {m.title}
                          </div>
                          <div className="text-xs text-[#94a3b8]">
                            {m.category} • {m.estimatedDuration} • {m.estimatedReward}
                          </div>
                        </div>
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#c8f135] shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              {matchingLocations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#c8f135]" />
                    <span>Locations ({matchingLocations.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingLocations.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleSelect('/locations')}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#232836] bg-[#161a24] hover:bg-[#1c2230] hover:border-[#c8f135]/40 transition-all group text-left"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#f8fafc] group-hover:text-[#c8f135]">
                            {l.name}
                          </div>
                          <div className="text-xs text-[#94a3b8]">
                            {l.district} • {l.category} • {l.coordinatesHint}
                          </div>
                        </div>
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#c8f135] shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#0f1218] border-t border-[#232836] flex items-center justify-between text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#c8f135]">[Esc]</span>
            <span>to close</span>
            <span className="mx-1">•</span>
            <span className="text-[11px] font-mono text-[#c8f135]">[/]</span>
            <span>quick trigger</span>
          </div>
          <button
            onClick={() => handleSelect('/search')}
            className="text-xs text-[#c8f135] hover:underline"
          >
            Full search page →
          </button>
        </div>
      </div>
    </div>
  );
};
