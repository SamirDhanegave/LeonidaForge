import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Link } from '../services/router';
import {
  ShieldCheck,
  Lock,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Server,
  FileText,
  Clock,
} from 'lucide-react';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const PrivacyPage: React.FC = () => {
  const [cleared, setCleared] = useState(false);

  useSEO({
    title: 'Privacy Policy | Leonida Forge',
    description:
      'Learn how Leonida Forge protects your privacy with client-side local storage, zero-account architecture, and no personal tracking.',
    canonicalPath: '/privacy',
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'About', item: '/about' },
      { name: 'Privacy Policy', item: '/privacy' },
    ],
  });

  const handleClearLocalStorage = () => {
    try {
      localStorage.removeItem('leonida_checklist_progress');
      localStorage.removeItem('leonida_saved_garage');
      localStorage.removeItem('leonida_compare_slots');
      localStorage.removeItem('leonida_feedback_votes');
      setCleared(true);
      setTimeout(() => setCleared(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="privacy-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Semantic Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'About', path: '/about' },
          { label: 'Privacy Policy', path: '/privacy' },
        ]}
      />

      {/* Header */}
      <section className="border-b border-[#1e2434] pb-8 space-y-4">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#273145] bg-[#121622] text-xs font-semibold text-[#c8f135]">
          <Lock className="w-3.5 h-3.5 text-[#c8f135]" />
          <span>ZERO-ACCOUNT & CLIENT-SIDE ARCHITECTURE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f8fafc] tracking-tight">
          Privacy Policy
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#8090a8]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Effective Date: September 2026</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c8f135]" />
            <span>No Accounts Required</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5 text-[#c8f135]" />
            <span>No Personal Identifiable Information (PII) Collected</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
          Leonida Forge is built around a single core tenet: <strong>respect your time and your data</strong>.
          We provide high-density GTA VI utility tools without forcing user sign-ups, tracking your browsing identity, or selling marketing profiles.
        </p>
      </section>

      {/* Highlights Bento */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-[#202636] bg-[#12151f] space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#181d2a] border border-[#263044] flex items-center justify-center text-[#c8f135]">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#f8fafc]">No Sign-Up or Accounts</h3>
          <p className="text-xs text-[#8090a8] leading-relaxed">
            We never request your email, phone number, password, social accounts, or gamertags. You use the tools completely pseudonymously.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#202636] bg-[#12151f] space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#181d2a] border border-[#263044] flex items-center justify-center text-[#c8f135]">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#f8fafc]">Local-First Storage</h3>
          <p className="text-xs text-[#8090a8] leading-relaxed">
            Your checklist progress, vehicle bookmarks, and comparison slots are stored strictly in your device's browser <code>localStorage</code>.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#202636] bg-[#12151f] space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#181d2a] border border-[#263044] flex items-center justify-center text-[#c8f135]">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#f8fafc]">No Data Selling</h3>
          <p className="text-xs text-[#8090a8] leading-relaxed">
            We do not sell, rent, monetize, or broker your personal information. There are no advertising trackers or third-party pixel brokers.
          </p>
        </div>
      </section>

      {/* Main Policy Body */}
      <div className="space-y-10 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
        {/* Section 1 */}
        <section id="information-we-do-not-collect" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">01.</span>
            <span>Information We Do Not Collect</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-3">
            <p>
              Unlike traditional gaming wikis that rely on third-party user logins and behavioral advertising beacons, Leonida Forge operates on a <strong>zero-knowledge paradigm</strong>. We do NOT collect or ask for:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#cad2e0] font-mono">
              <li className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1e2535] flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> No real names or usernames
              </li>
              <li className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1e2535] flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> No email addresses or phone numbers
              </li>
              <li className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1e2535] flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> No passwords or credentials
              </li>
              <li className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1e2535] flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> No payment or billing details
              </li>
              <li className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1e2535] flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> No Social Club or PSN/Xbox IDs
              </li>
              <li className="p-2.5 rounded-lg bg-[#0e111a] border border-[#1e2535] flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span> No GPS or exact location coordinates
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section id="local-storage-use" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">02.</span>
            <span>How Local Storage Is Used on Your Device</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-4">
            <p>
              To ensure your game checklist and custom vehicle comparisons persist between visits without requiring an account, we use your browser's built-in <code>localStorage</code> API. This data is stored directly on your computer or mobile device and is never uploaded to an external server.
            </p>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#f8fafc] uppercase tracking-wider">
                Storage Keys Managed by Leonida Forge:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#20273a] text-[#8090a8]">
                      <th className="py-2 pr-4 font-semibold">Key Identifier</th>
                      <th className="py-2 pr-4 font-semibold">Purpose</th>
                      <th className="py-2 font-semibold">Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b212f] text-[#cad2e0]">
                    <tr>
                      <td className="py-2 pr-4 font-mono text-[#c8f135]">leonida_checklist_progress</td>
                      <td className="py-2 pr-4">Stores checkbox state for completed 100% checklist tasks.</td>
                      <td className="py-2 text-[#8090a8]">Client-side only</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-[#c8f135]">leonida_saved_garage</td>
                      <td className="py-2 pr-4">Stores vehicle IDs that you have bookmarked in your virtual garage.</td>
                      <td className="py-2 text-[#8090a8]">Client-side only</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-[#c8f135]">leonida_compare_slots</td>
                      <td className="py-2 pr-4">Remembers selected vehicle IDs in the 3-Way comparison matrix.</td>
                      <td className="py-2 text-[#8090a8]">Client-side only</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-[#c8f135]">leonida_feedback_votes</td>
                      <td className="py-2 pr-4">Prevents multiple duplicate helpfulness votes per page view.</td>
                      <td className="py-2 text-[#8090a8]">Client-side only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-[#8090a8]">
              You have full control over this data. You can inspect, modify, or erase these keys at any moment via your browser's Developer Tools (Application &gt; Local Storage) or by using our one-click data clear button below.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="data-management-tool" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">03.</span>
            <span>User Data Purging & Reset Utility</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-4">
            <p>
              Under global privacy principles (including GDPR Article 17 "Right to Erasure" and CCPA), you have the absolute right to purge all locally persisted application state at any time.
            </p>
            <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#232838] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Purge Local Forge Data</span>
                </div>
                <p className="text-xs text-[#8090a8]">
                  Clears all saved checklist progress, bookmarks, and comparison slots on this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearLocalStorage}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-2 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Erase All Local Data</span>
              </button>
            </div>
            {cleared && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All local storage keys have been successfully erased from this browser.</span>
              </div>
            )}
          </div>
        </section>

        {/* Section 4 */}
        <section id="analytics-and-server-logs" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">04.</span>
            <span>Anonymous Analytics & Infrastructure Logs</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-3">
            <p>
              To gauge community demand for new utility tools and maintain platform stability, we may log aggregate, anonymous technical metrics:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-[#cad2e0]">
              <li>
                <strong>Page Views & Navigation Flow:</strong> We analyze which calculators or guide topics receive the highest traffic to prioritize feature development.
              </li>
              <li>
                <strong>Standard Web Server Telemetry:</strong> Standard HTTP request headers (such as browser user-agent, operating system category, and referrer domain) are processed strictly for DDoS mitigation and server health monitoring.
              </li>
              <li>
                <strong>Feedback Submissions:</strong> Text submitted through our "Was this helpful?" feedback modules is collected solely to improve calculations and fix data errors. Submissions should never contain personal information.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section id="cookies-and-tracking" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">05.</span>
            <span>Cookies Policy</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-3">
            <p>
              Leonida Forge does <strong>NOT use third-party advertising cookies, cross-site behavioral tracking cookies, or commercial marketing pixels</strong>.
            </p>
            <p>
              Any session data necessary to render single-page transitions is kept strictly within application memory or local storage. You may disable cookies in your browser settings entirely without impacting your ability to use our vehicle database, calculators, or guides.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="childrens-privacy" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">06.</span>
            <span>Children's Privacy (COPPA Compliance)</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-3">
            <p>
              Our website is intended for players seeking video game analysis and utility tools. Because we do not ask for or store personal identifiable information from any user, we do not knowingly collect personal information from children under the age of 13.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="legal-disclaimer" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">07.</span>
            <span>Trademark & Third-Party Disclaimer</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#0c0e14] space-y-3 text-xs text-[#8090a8]">
            <p>
              Leonida Forge is an independent fan-made reference utility created under fair use principles.
              <strong>
                {' '}This website is NOT affiliated with, sponsored by, authorized by, or associated with Rockstar Games, Take-Two Interactive Software, Inc., Sony Interactive Entertainment, or Microsoft Corporation.
              </strong>
            </p>
            <p>
              Grand Theft Auto, GTA VI, Vice City, and all associated vehicle names, characters, logos, and game assets are registered trademarks or service marks of Take-Two Interactive Software, Inc.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="policy-changes-and-contact" className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] flex items-center gap-2">
            <span className="text-[#c8f135] font-mono text-sm">08.</span>
            <span>Changes to This Policy & Inquiries</span>
          </h2>
          <div className="p-6 rounded-2xl border border-[#202636] bg-[#12151f] space-y-3">
            <p>
              As Grand Theft Auto VI approaches release and new features or telemetry pipelines are introduced, this policy may be revised to reflect any changes in our architecture. All updates will be timestamped with an updated effective date.
            </p>
            <p>
              For privacy-related inquiries, data questions, or suggestions, please use the interactive feedback module below.
            </p>
          </div>
        </section>
      </div>

      {/* Feedback Module */}
      <section className="pt-4">
        <FeedbackModule
          pageSlug="privacy-policy"
          contextTitle="Privacy Policy & Data Rights"
        />
      </section>
    </div>
  );
};
