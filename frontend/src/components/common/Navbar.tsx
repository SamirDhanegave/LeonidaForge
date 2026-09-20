import React, { useState, useRef, useEffect } from 'react';
import { useRouter, Link } from '../../services/router';
import {
  Newspaper,
  Car,
  Layers,
  BookOpen,
  Search,
  Menu,
  X,
  ChevronDown,
  Twitter,
  Scale,
  DollarSign,
  CheckSquare,
  Compass,
  MapPin,
  Radio,
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

// -------------------------------------------------------
// Dropdown item type
// -------------------------------------------------------
interface DropdownItem {
  label: string;
  path: string;
  icon?: React.FC<{ className?: string }>;
  description?: string;
}

interface NavDropdownProps {
  label: string;
  icon?: React.FC<{ className?: string }>;
  items: DropdownItem[];
  isActive: boolean;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, icon: Icon, items, isActive }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { navigate } = useRouter();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id={`nav-dropdown-${label.toLowerCase()}`}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          isActive || open
            ? 'bg-[#181d27] text-[#c8f135] border border-[#293245]'
            : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#141822]'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          id={`nav-dropdown-menu-${label.toLowerCase()}`}
          className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[#232836] bg-[#0d1018] shadow-2xl shadow-black/60 z-50 overflow-hidden animate-in slide-in-from-top-1 duration-150"
        >
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.path}
                id={`nav-dropdown-item-${item.path.replace(/\//g, '-')}`}
                onClick={() => { navigate(item.path); setOpen(false); }}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#141826] transition-colors group"
              >
                {ItemIcon && (
                  <div className="w-7 h-7 rounded-lg bg-[#1a2030] border border-[#232836] flex items-center justify-center shrink-0 group-hover:border-[#c8f135]/40 transition-colors mt-0.5">
                    <ItemIcon className="w-3.5 h-3.5 text-[#c8f135]" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-[#f8fafc] group-hover:text-[#c8f135] transition-colors">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-[10px] text-[#64748b] mt-0.5 leading-snug">{item.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------
// Main Navbar
// -------------------------------------------------------
export const Navbar: React.FC = () => {
  const { path } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut: press / to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isSection = (prefix: string) => path === prefix || path.startsWith(prefix + '/');

  const newsItems: DropdownItem[] = [
    { label: 'Latest News',       path: '/news',    icon: Newspaper, description: 'Newest GTA VI articles' },
    { label: 'Social / X Updates',path: '/social',  icon: Twitter,   description: 'X posts & community updates' },
  ];

  const vehicleItems: DropdownItem[] = [
    { label: 'Vehicle Database',  path: '/vehicles', icon: Car,   description: 'Filter by class, speed & price' },
    { label: 'Compare Vehicles',  path: '/compare',  icon: Scale, description: '3-way performance comparison' },
  ];

  const toolItems: DropdownItem[] = [
    { label: 'Money Calculator',  path: '/money',     icon: DollarSign,  description: 'Heist & purchase planning' },
    { label: '100% Tracker',      path: '/tracker',   icon: CheckSquare, description: 'Completion roadmap' },
    { label: 'Missions',          path: '/missions',  icon: Compass,     description: 'Story & side operation guide' },
    { label: 'Locations',         path: '/locations', icon: MapPin,      description: 'POIs, shops & safehouses' },
  ];

  // Mobile flat nav
  const mobileItems = [
    { label: 'Home',     path: '/',         icon: Radio },
    { label: 'News',     path: '/news',     icon: Newspaper },
    { label: 'Social',   path: '/social',   icon: Twitter },
    { label: 'Guides',   path: '/guides',   icon: BookOpen },
    { label: 'Vehicles', path: '/vehicles', icon: Car },
    { label: 'Compare',  path: '/compare',  icon: Scale },
    { label: 'Money',    path: '/money',    icon: DollarSign },
    { label: 'Tracker',  path: '/tracker',  icon: CheckSquare },
    { label: 'Missions', path: '/missions', icon: Compass },
    { label: 'Locations',path: '/locations',icon: MapPin },
  ];

  return (
    <>
      <header
        id="main-navigation-bar"
        className="sticky top-0 z-40 w-full border-b border-[#232836] bg-[#090a0f]/90 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
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
                GTA VI Information Hub
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {/* Home */}
            <Link
              id="nav-link-home"
              to="/"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                path === '/'
                  ? 'bg-[#181d27] text-[#c8f135] border border-[#293245]'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#141822]'
              }`}
            >
              Home
            </Link>

            {/* News dropdown */}
            <NavDropdown
              label="News"
              icon={Newspaper}
              items={newsItems}
              isActive={isSection('/news') || isSection('/social')}
            />

            {/* Guides */}
            <Link
              id="nav-link-guides"
              to="/guides"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isSection('/guides')
                  ? 'bg-[#181d27] text-[#c8f135] border border-[#293245]'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#141822]'
              }`}
            >
              Guides
            </Link>

            {/* Vehicles dropdown */}
            <NavDropdown
              label="Vehicles"
              icon={Car}
              items={vehicleItems}
              isActive={isSection('/vehicles') || isSection('/compare')}
            />

            {/* Tools dropdown */}
            <NavDropdown
              label="Tools"
              icon={Layers}
              items={toolItems}
              isActive={isSection('/money') || isSection('/tracker') || isSection('/missions') || isSection('/locations')}
            />
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              id="nav-global-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#242b3b] bg-[#121620] hover:bg-[#181d2a] hover:border-[#343e54] text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-all"
              title="Search (press /)"
            >
              <Search className="w-3.5 h-3.5 text-[#64748b]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#1c2230] border border-[#283144] rounded text-[#8090a8]">
                /
              </kbd>
            </button>

            {/* Mobile toggle */}
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

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden border-b border-[#232836] bg-[#0c0e15] px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150"
          >
            <div className="grid grid-cols-2 gap-1.5 py-2">
              {mobileItems.map((item) => {
                const Icon = item.icon;
                const active = path === item.path || (item.path !== '/' && isSection(item.path));
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
