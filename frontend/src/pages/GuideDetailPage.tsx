import React from 'react';
import { useRouter, Link } from '../services/router';
import { useSEO } from '../hooks/useSEO';
import {
  Clock,
  Zap,
  HelpCircle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { GUIDES_DATA } from '../data/guides';
import { SampleDataBadge } from '../components/common/SampleDataBadge';
import { FeedbackModule } from '../components/common/FeedbackModule';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { NotFoundPage } from './NotFoundPage';

export const GuideDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;

  const guide = GUIDES_DATA.find((g) => g.slug === slug);

  // If guide is invalid or nonexistent, return dedicated 404 page
  if (!guide) {
    return <NotFoundPage />;
  }

  const faqs = guide.faqs || [
    {
      question: `Is the telemetry in "${guide.title}" official?`,
      answer: 'No. All gameplay values, speeds, and costs are sample figures derived from trailer telemetry and community simulations, clearly labeled as Sample Data.',
    },
    {
      question: 'Will this guide update upon GTA VI release?',
      answer: 'Yes. Our telemetry pipeline will benchmark official game release metrics and update this guide in real time.',
    },
    {
      question: 'Can I test or calculate these numbers myself?',
      answer: 'Yes. You can use our 3-Way Vehicle Compare tool and Money Goal Calculator to run custom simulations.',
    },
  ];

  const fastFacts = guide.fastFacts || [
    'Benchmarked from community telemetry simulations and physics models.',
    'Verified for highway traversal and metropolitan getaway agility.',
    'Saved locally without requiring third-party logins or cookies.',
    'Directly connected to interactive calculators and database filters.',
  ];

  const quickAnswer = guide.quickAnswer || guide.summary;

  const tools = guide.relatedTools || (guide.recommendedTools ? guide.recommendedTools.map((t) => ({
    label: t.title,
    path: t.path,
  })) : [
    { label: 'Vehicle Database', path: '/vehicles' },
    { label: '3-Way Vehicle Compare', path: '/compare' },
    { label: 'Money Goal Planner', path: '/money' },
    { label: '100% Progress Tracker', path: '/tracker' },
  ]);

  // Valid FAQPage schema matching visible FAQs
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  useSEO({
    title: guide.seoTitle,
    description: guide.seoDescription,
    canonicalPath: `/guides/${guide.slug}`,
    type: 'article',
    articleData: {
      publishedTime: guide.publishedDate || '2025-01-15',
      author: 'Leonida Forge Editorial',
    },
    breadcrumbData: [
      { name: 'Home', item: '/' },
      { name: 'Guides', item: '/guides' },
      { name: guide.title, item: `/guides/${guide.slug}` },
    ],
    structuredData: faqSchema,
  });

  return (
    <article id="guide-article-container" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Semantic Breadcrumbs with Microdata */}
      <Breadcrumbs
        items={[
          { label: 'Guides', path: '/guides' },
          { label: guide.title, path: `/guides/${guide.slug}` },
        ]}
      />

      {/* Guide Header */}
      <header className="space-y-4 border-b border-[#1e2434] pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#1a2130] text-[#c8f135] border border-[#273248]">
            {guide.category.toUpperCase()}
          </span>
          <span className="text-xs text-[#64748b]">•</span>
          <div className="flex items-center gap-1 text-xs text-[#8090a8]">
            <Clock className="w-3.5 h-3.5" />
            <span>{guide.readTimeMinutes} min read</span>
          </div>
          <span className="text-xs text-[#64748b]">•</span>
          <SampleDataBadge />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f8fafc] tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
          {guide.summary}
        </p>
      </header>

      {/* Fast Facts / Quick Answer Callout Box */}
      <section
        id="guide-fast-facts"
        className="rounded-2xl border border-[#c8f135]/30 bg-[#141822] p-6 space-y-4 shadow-sm"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c8f135]">
          <Zap className="w-4 h-4 text-[#c8f135]" />
          <span>Quick Answer Summary</span>
        </div>

        <p className="text-sm sm:text-base text-[#f8fafc] font-medium leading-relaxed">
          {quickAnswer}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#232b3b]">
          {fastFacts.map((fact, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[#94a3b8]">
              <CheckCircle className="w-3.5 h-3.5 text-[#c8f135] shrink-0" />
              <span>{fact}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Content Sections */}
      <div className="space-y-8 text-sm sm:text-base text-[#cad2e0] leading-relaxed">
        {guide.sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#f8fafc] tracking-tight pt-3">
              {section.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed whitespace-pre-line">
              {section.content || section.body}
            </p>

            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="space-y-1.5 pt-1 pl-4 list-disc text-xs sm:text-sm text-[#ededef]">
                {section.bulletPoints.map((bp, bidx) => (
                  <li key={bidx}>{bp}</li>
                ))}
              </ul>
            )}

            {section.callout && (
              <div className="p-3.5 rounded-xl border border-[#232b3b] bg-[#131622] text-xs text-[#c8f135] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#c8f135] shrink-0" />
                <span>{section.callout.text}</span>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Related Interactive Tools Callout */}
      <section className="rounded-2xl border border-[#20273a] bg-[#121520] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#f8fafc]">
          Related Community Utilities
        </h2>
        <p className="text-xs text-[#8090a8]">
          Explore interactive tools related to this guide's topic:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className="flex items-center justify-between p-3 rounded-xl border border-[#1e2434] bg-[#151926] hover:bg-[#1b2234] hover:border-[#c8f135]/50 transition-all text-xs font-medium text-[#ededef] group"
            >
              <span className="group-hover:text-[#c8f135] transition-colors">{tool.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#c8f135]" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section with FAQPage Schema Styling */}
      <section id="guide-faq-section" className="space-y-4 pt-4 border-t border-[#1e2434]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#c8f135]" />
          <h2 className="text-xl font-bold text-[#f8fafc]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#1e2434] bg-[#121520] space-y-1.5"
            >
              <h3 className="text-sm font-bold text-[#f8fafc]">
                {faq.question}
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

  
    </article>
  );
};
