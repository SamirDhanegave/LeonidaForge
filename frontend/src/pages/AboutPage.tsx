import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Link } from '../services/router';
import {
  ShieldCheck,
  Compass,
  Lock,
  Code2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About Leonida Forge | GTA VI Fan Project',
    description:
      'Learn about Leonida Forge, an independent GTA VI fan project built to bring together useful tools, interactive features, experiments, and community-focused experiences.',
    canonicalPath: '/about',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'About', item: '/about' },
    ],
  });

  return (
    <div
      id="about-page-container"
      className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8"
    >
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'About', path: '/about' }]} />

      {/* Header */}
      <section className="border-b border-[#1e2434] pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#273145] bg-[#121622] text-xs font-semibold text-[#c8f135]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c8f135]" />
          <span>INDEPENDENT FAN PROJECT</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
          About Leonida Forge
        </h1>

        <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
          Leonida Forge is an independent GTA VI fan project built around
          interactive tools, experiments, information, and community-focused
          features.
        </p>

        <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
          The goal is simple: create useful and interesting experiences for
          people following GTA VI, without trying to be another generic gaming
          news website.
        </p>
      </section>

      {/* What is Leonida Forge */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#c8f135]" />
          <span>What is Leonida Forge?</span>
        </h2>

        <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-4 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          <p>
            Leonida Forge is designed as a collection of different GTA VI
            experiences rather than a single-purpose website.
          </p>

          <p className="text-[#ededef] font-medium">
            Different parts of the project can serve different purposes:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-mono text-[#c8f135]">
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • Interactive tools
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • GTA VI information
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • Comparisons and calculators
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • Community features
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • News and social monitoring
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • Experimental projects
            </li>
          </ul>

          <p>
            The project can continue to grow as new ideas and features are
            developed.
          </p>
        </div>
      </section>

      {/* Built by Trinity Launchers */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#c8f135]" />
          <span>Built by Trinity Launchers</span>
        </h2>

        <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-4 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          <p>
            Leonida Forge is built by{' '}
            <strong className="text-[#f8fafc]">Trinity Launchers</strong>, an
            independent development group focused on building experimental
            software, websites, and digital projects.
          </p>

          <p>
            Leonida Forge is one of the projects developed under the Trinity
            Launchers umbrella.
          </p>

          {/* Replace the URL below */}
          <a
            href="PASTE-TRINITY-LAUNCHERS-LINK-HERE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2a3347] bg-[#161a26] text-[#c8f135] font-semibold hover:bg-[#1c2230] transition-colors"
          >
            <span>Visit Trinity Launchers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#c8f135]" />
            <span>Privacy & Data</span>
          </h2>

          <Link
            to="/privacy"
            className="text-xs font-semibold text-[#c8f135] hover:underline inline-flex items-center gap-1"
          >
            <span>Full Privacy Document</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-4 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          <p>
            Leonida Forge is designed with a privacy-first approach. The
            project does not require users to create an account simply to use
            its core features.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-[#0d1017] border border-[#1f2637]">
              <div className="font-bold text-[#f8fafc] pb-1">
                Client-Side Persistence
              </div>
              <p className="text-[#8090a8]">
                Where applicable, saved preferences, selections, and progress
                can remain on your device using browser storage.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1017] border border-[#1f2637]">
              <div className="font-bold text-[#f8fafc] pb-1">
                No Required Account
              </div>
              <p className="text-[#8090a8]">
                Core features are designed to work without requiring users to
                create an account.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1017] border border-[#1f2637]">
              <div className="font-bold text-[#f8fafc] pb-1">
                User Control
              </div>
              <p className="text-[#8090a8]">
                Users can manage or clear locally stored website data through
                their browser or the available privacy controls.
              </p>
            </div>
          </div>

          <p className="pt-1">
            For complete information about data handling and privacy, read the{' '}
            <Link
              to="/privacy"
              className="text-[#c8f135] underline font-medium"
            >
              Leonida Forge Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#c8f135]" />
          <span>Legal Disclaimer</span>
        </h2>

        <div className="p-6 rounded-2xl border border-[#202636] bg-[#0c0e14] space-y-3 text-xs text-[#8090a8] leading-relaxed">
          <p>
            Leonida Forge is an independent fan-made project.
            <strong>
              {' '}
              This website is NOT affiliated with, sponsored by, endorsed by,
              or in any way associated with Rockstar Games, Take-Two Interactive
              Software, Inc., or any of their affiliated companies or
              subsidiaries.
            </strong>
          </p>

          <p>
            Grand Theft Auto, GTA VI, Vice City, and associated names, logos,
            characters, locations, and other intellectual property are
            trademarks or property of their respective owners.
          </p>

          <p>
            Leonida Forge is created by fans for informational,
            entertainment, and experimental purposes.
          </p>
        </div>
      </section>


    </div>
  );
};