import React from 'react';
import { Link } from '../../services/router';
import { ShieldCheck, Compass, Car, DollarSign, CheckSquare, BookOpen, MapPin, Scale } from 'lucide-react';
import { POPULAR_SEARCHES_DATA } from '../../data/popularSearches';

export const Footer: React.FC = () => {
  return (
    <footer id="site-footer" className="border-t border-[#1e2330] bg-[#07090d] text-[#94a3b8] mt-20">
      {/* Top Internal Links Bento */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#161a24] border border-[#232a3a] flex items-center justify-center font-mono text-[10px] font-bold text-[#c8f135]">
                LF
              </div>
              <span className="text-sm font-bold text-[#f8fafc]">Leonida Forge</span>
            </div>
            <p className="text-xs text-[#8090a8] leading-relaxed">
              Fast, independent utility tools, calculators, and search-intent resources built for GTA VI players.
              Stop searching. Start playing.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#64748b]">
              <span className="w-2 h-2 rounded-full bg-[#c8f135]/80 animate-pulse" />
              <span>Telemetry validation & demand engine active</span>
            </div>
          </div>

          {/* Col 2: Core Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f1f5f9]">
              Player Utilities
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/vehicles" className="hover:text-[#c8f135] transition-colors flex items-center gap-1.5">
                  <Car className="w-3 h-3 text-[#64748b]" /> Vehicle Database
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#c8f135] transition-colors flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-[#64748b]" /> 3-Way Vehicle Comparison
                </Link>
              </li>
              <li>
                <Link to="/money" className="hover:text-[#c8f135] transition-colors flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-[#64748b]" /> Money & Affordability Planner
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-[#c8f135] transition-colors flex items-center gap-1.5">
                  <CheckSquare className="w-3 h-3 text-[#64748b]" /> 100% Progress Tracker
                </Link>
              </li>
              <li>
                <Link to="/missions" className="hover:text-[#c8f135] transition-colors flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-[#64748b]" /> Mission Directory
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-[#c8f135] transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#64748b]" /> Location Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Search Intent Hubs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f1f5f9]">
              SEO Guides & Queries
            </h4>
            <ul className="space-y-1.5 text-xs">
              {POPULAR_SEARCHES_DATA.slice(0, 5).map((search, idx) => (
                <li key={idx}>
                  <Link to={search.path} className="hover:text-[#c8f135] transition-colors flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#64748b]" />
                    <span className="truncate">{search.query}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/guides" className="text-xs text-[#c8f135] hover:underline pt-1 inline-block">
                  View all editorial guides →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Info & Legal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f1f5f9]">
              Project & Standards
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#c8f135] transition-colors">
                  About Leonida Forge
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#c8f135] transition-colors font-medium text-[#ededef]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#c8f135] transition-colors">
                  Global Search Index
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Callout Box */}
        <div className="p-4 rounded-xl border border-[#232836] bg-[#0c0e14] text-xs text-[#8090a8] space-y-2">
          <div className="flex items-center gap-2 text-[#ededef] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#c8f135]" />
            <span>Legal Disclaimer & Intellectual Property Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Leonida Forge is an independent fan-made project created for educational, analytical, and community utility purposes.
            This website is <strong>NOT affiliated with, endorsed by, sponsored by, or connected to Rockstar Games, Take-Two Interactive, or any of their subsidiaries</strong>.
            All Grand Theft Auto trademarks, vehicle names, and fictional locations remain the intellectual property of Take-Two Interactive.
          </p>
          <p className="text-[11px] text-[#64748b]">
            Pre-launch vehicle statistics and mission outlines represent sample telemetry modeling and community observations, clearly labeled as <em>Sample data</em>. No personal data is collected or transmitted; progress is saved exclusively in your local browser storage.
          </p>
        </div>

        {/* Copyright strip */}
        <div className="mt-8 pt-6 border-t border-[#181d28] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748b]">
          <div>© {new Date().getFullYear()} Leonida Forge. Independent player toolset.</div>
          <div className="flex items-center gap-4">
            <span>Fast • Clean • Client-Side</span>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#94a3b8] underline decoration-[#2f384c]">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-[#94a3b8]">About & Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
