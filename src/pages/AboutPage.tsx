import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Link } from '../services/router';
import {
  ShieldCheck,
  Compass,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About Leonida Forge | Independent GTA VI Utility Tools',
    description:
      'Learn about Leonida Forge: an independent community toolset built for GTA VI players. Our philosophy, architecture, and legal disclaimers.',
    canonicalPath: '/about',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'About', item: '/about' },
    ],
  });

  return (
    <div id="about-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'About', path: '/about' }]} />

      {/* Header */}
      <section className="border-b border-[#1e2434] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#273145] bg-[#121622] text-xs font-semibold text-[#c8f135]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c8f135]" />
          <span>INDEPENDENT COMMUNITY PROJECT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f8fafc] tracking-tight">
          About Leonida Forge
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
          Useful tools, comparisons, and calculators for exploring Grand Theft Auto VI.
          Designed from first principles to answer player questions instantly without wiki noise or clickbait filler.
        </p>
      </section>

      {/* Core Philosophy Section */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#c8f135]" />
          <span>Core Product Principle: Answer, Don't Distract</span>
        </h2>
        <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-3 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          <p>
            Most video game fan websites are clogged with video popups, endless affiliate ads, and articles that stretch 2,000 words before answering a basic question.
          </p>
          <p className="text-[#ededef] font-medium">
            Leonida Forge is built like modern software: fast, dense, and directly answering real player questions:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-mono text-[#c8f135]">
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • What is this?
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • Where is it?
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • Which one is better?
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • How much does it cost?
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • What should I do next?
            </li>
            <li className="p-2 rounded-lg bg-[#161a26] border border-[#232a3a]">
              • How much progress have I made?
            </li>
          </ul>
        </div>
      </section>

      {/* Privacy Policy & Zero-Login Commitment */}
      <section id="privacy" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#c8f135]" />
            <span>Privacy Policy & Zero-Account Architecture</span>
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
            Leonida Forge is built on a strict privacy-first foundation: <strong>no accounts, no passwords, no email collection, and no selling of user profiles</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-[#0d1017] border border-[#1f2637]">
              <div className="font-bold text-[#f8fafc] pb-1">Client-Side Persistence</div>
              <p className="text-[#8090a8]">Checklist items, saved garages, and compare selections stay on your device via <code>localStorage</code>.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0d1017] border border-[#1f2637]">
              <div className="font-bold text-[#f8fafc] pb-1">No Behavioral Ad Tracking</div>
              <p className="text-[#8090a8]">We do not run third-party advertising cookies, cross-site trackers, or commercial data broker pixels.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0d1017] border border-[#1f2637]">
              <div className="font-bold text-[#f8fafc] pb-1">Total User Control</div>
              <p className="text-[#8090a8]">You can purge all saved local data at any time directly through the dedicated privacy page or browser controls.</p>
            </div>
          </div>
          <p className="pt-1">
            Need complete details regarding data storage keys, anonymous diagnostics, or GDPR/CCPA rights? Read our dedicated{' '}
            <Link to="/privacy" className="text-[#c8f135] underline font-medium">
              Leonida Forge Privacy Policy
            </Link>.
          </p>
        </div>
      </section>

      {/* Official Legal Disclaimer */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#c8f135]" />
          <span>Legal Disclaimer & Trademark Acknowledgment</span>
        </h2>
        <div className="p-6 rounded-2xl border border-[#202636] bg-[#0c0e14] space-y-3 text-xs text-[#8090a8] leading-relaxed">
          <p>
            Leonida Forge is an independent fan-made analytical utility project.
            <strong>
              {' '}This website is NOT affiliated with, sponsored by, endorsed by, or in any way associated with Rockstar Games, Take-Two Interactive Software, Inc., or any of their affiliated companies or subsidiaries.
            </strong>
          </p>
          <p>
            Grand Theft Auto, GTA VI, Vice City, and all associated vehicle models, character names, and logos are registered trademarks or service marks of Take-Two Interactive Software, Inc. All trademarks are the property of their respective owners.
          </p>
        </div>
      </section>

      {/* Feedback Module */}
      <section className="pt-6">
        <FeedbackModule
          pageSlug="about-page"
          contextTitle="About & Data Architecture"
        />
      </section>
    </div>
  );
};
