import React, { useState } from 'react';
import { useRouter, Link } from '../../services/router';
import {
  Compass,
  Car,
  CheckSquare,
  DollarSign,
  MapPin,
  BookOpen,
  Search,
  Menu,
  X,
  Layers,
  Scale,
  Sparkles,
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Navbar: React.FC = () => {
  const { path } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { label: 'Tools', path: '/#tools', isAnchor: true, icon: Layers },
    { label: 'Vehicles', path: '/vehicles', icon: Car },
    { label: 'Compare', path: '/compare', icon: Scale },
    { label: 'Tracker', path: '/tracker', icon: CheckSquare },
    { label: 'Money', path: '/money', icon: DollarSign },
    { label: 'Missions', path: '/missions', icon: Compass },
    { label: 'Locations', path: '/locations', icon: MapPin },
    { label: 'Guides', path: '/guides', icon: BookOpen },
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === '/#tools') return false;
    return path === itemPath || path.startsWith(itemPath + '/');
  };

  return (
    <>
      <header
        id="main-navigation-bar"
        className="sticky top-0 z-40 w-full border-b border-[#232836] bg-[#090a0f]/90 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            id="brand-logo-link"
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1b2230] to-[#141722] border border-[#2b3345] flex items-center justify-center group-hover:border-[#c8f135]/60 transition-all shadow-sm">
              <span className="font-mono text-xs font-bold text-[#c8f135] tracking-tighter">LF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[#f8fafc] group-hover:text-white transition-colors">
                Leonida Forge
              </span>
              <span className="hidden sm:inline-block text-[10px] text-[#64748b] -mt-0.5 tracking-wide">
                GTA VI Community Tools
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  id={`nav-link-${item.label.toLowerCase()}`}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#181d27] text-[#c8f135] border border-[#293245]'
                      : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#141822]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Search & Quick CTA */}
          <div className="flex items-center gap-2">
            <button
              id="nav-global-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#242b3b] bg-[#121620] hover:bg-[#181d2a] hover:border-[#343e54] text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-all"
              title="Search tools, vehicles & guides (press /)"
            >
              <Search className="w-3.5 h-3.5 text-[#64748b]" />
              <span className="hidden sm:inline">Search database</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#1c2230] border border-[#283144] rounded text-[#8090a8]">
                /
              </kbd>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-[#232836] bg-[#12151d] text-[#94a3b8] hover:text-[#f8fafc]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden border-b border-[#232836] bg-[#0c0e15] px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150"
          >
            <div className="grid grid-cols-2 gap-1.5 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.label}
                    id={`mobile-nav-${item.label.toLowerCase()}`}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#181d27] text-[#c8f135] border border-[#293245]'
                        : 'text-[#94a3b8] hover:text-[#f8fafc] bg-[#12151d] border border-[#1e2330]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#c8f135]' : 'text-[#64748b]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#1e2330] flex items-center justify-between text-xs text-[#64748b]">
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[#94a3b8] py-1"
              >
                About & Data Policy
              </Link>
              <span className="text-[11px] font-mono text-[#c8f135]">Press / to search</span>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
