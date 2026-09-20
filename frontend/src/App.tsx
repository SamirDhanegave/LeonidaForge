/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './services/router';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Existing pages
import { HomePage }        from './pages/HomePage';
import { VehiclesPage }    from './pages/VehiclesPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { ComparePage }     from './pages/ComparePage';
import { MoneyPage }       from './pages/MoneyPage';
import { TrackerPage }     from './pages/TrackerPage';
import { MissionsPage }    from './pages/MissionsPage';
import { LocationsPage }   from './pages/LocationsPage';
import { GuidesPage }      from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { SearchPage }      from './pages/SearchPage';
import { AboutPage }       from './pages/AboutPage';
import { PrivacyPage }     from './pages/PrivacyPage';
import { NotFoundPage }    from './pages/NotFoundPage';

// New pages — news, social, admin
import { NewsPage }          from './pages/NewsPage';
import { NewsArticlePage }   from './pages/NewsArticlePage';
import { SocialPage }        from './pages/SocialPage';
import { AdminScriptsPage }  from './pages/AdminScriptsPage';

const RouteRenderer: React.FC = () => {
  const { path } = useRouter();

  // Scroll to top on route change, or scroll to anchor if present
  useEffect(() => {
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [path]);

  // ── Dynamic segment routes ────────────────────────────────────

  // /vehicles/:slug
  if (path.startsWith('/vehicles/') && path !== '/vehicles') {
    return <VehicleDetailPage />;
  }

  // /guides/:slug
  if (path.startsWith('/guides/') && path !== '/guides') {
    return <GuideDetailPage />;
  }

  // /news/:id  (numeric id, not just /news)
  if (path.startsWith('/news/') && path !== '/news') {
    return <NewsArticlePage />;
  }

  // ── Static routes ─────────────────────────────────────────────

  switch (path) {
    case '/':
      return <HomePage />;

    // News & Social
    case '/news':
      return <NewsPage />;
    case '/social':
      return <SocialPage />;

    // Admin
    case '/admin/scripts':
    case '/admin':
      return <AdminScriptsPage />;

    // Vehicles
    case '/vehicles':
      return <VehiclesPage />;
    case '/compare':
      return <ComparePage />;

    // Tools
    case '/money':
      return <MoneyPage />;
    case '/tracker':
      return <TrackerPage />;
    case '/missions':
      return <MissionsPage />;
    case '/locations':
      return <LocationsPage />;

    // Guides
    case '/guides':
      return <GuidesPage />;

    // Utility
    case '/search':
      return <SearchPage />;
    case '/about':
      return <AboutPage />;
    case '/privacy':
      return <PrivacyPage />;

    case '/404':
    default:
      return <NotFoundPage />;
  }
};

export default function App() {
  return (
    <RouterProvider>
      <div
        id="leonida-app-root"
        className="min-h-screen flex flex-col bg-[#090a0f] text-[#ededef] antialiased selection:bg-[#c8f135] selection:text-[#090a0f]"
      >
        {/* Top Independent Fan Disclaimer */}
        {/* <DisclaimerBanner /> */}

        {/* Sticky App Header */}
        <Navbar />

        {/* Main Routed Content Area */}
        <main className="flex-1 py-6 sm:py-8">
          <RouteRenderer />
        </main>

        {/* Site Footer */}
        <Footer />
      </div>
    </RouterProvider>
  );
}
