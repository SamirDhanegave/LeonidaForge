import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FileText,
  Instagram,
  Pencil,
  Play,
  RefreshCw,
  Save,
  Search,
  ShieldAlert,
  Square,
  Trash2,
  X,
  Youtube,
} from 'lucide-react';

// -------------------------------------------------------
// Configuration
// -------------------------------------------------------

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api'
).replace(/\/+$/, '');

// -------------------------------------------------------
// Types
// -------------------------------------------------------

type ServiceType = 'persistent' | 'oneshot';
type ServiceStatusValue = 'running' | 'stopped' | 'idle';

interface ServiceStatus {
  id: string;
  name: string;
  module: string;
  type: ServiceType;
  status: ServiceStatusValue;
  running: boolean;
  pid: number | null;
  exit_code: number | null;
  started_at: string | null;
  finished_at: string | null;
}

interface NewsItem {
  id: number;
  source: string;
  title: string;
  url: string;
  raw_content: string | null;
  classifier: string | null;
  published_at: string | null;
  image_url: string | null;
  collected_at: string;
  has_classifier?: boolean;
  has_script?: boolean;
  script_id?: number | null;
  script_status?: string | null;
}

interface ScriptItem {
  id: number;
  news_id: number;
  youtube_script: string | null;
  instagram_script: string | null;
  status: string;
  created_at: string;
  news?: {
    id: number;
    title: string;
    url: string;
    source: string;
    raw_content: string | null;
    classifier?: string | null;
  } | null;
}

type ScriptJobStatus =
  | 'idle'
  | 'starting'
  | 'running'
  | 'completed'
  | 'completed_with_errors'
  | 'failed';

interface ScriptJob {
  status: ScriptJobStatus;
  started_at: string | null;
  finished_at: string | null;
  stage: string | null;
  stage_label: string | null;
  total: number;
  processed: number;
  current_news_id: number | null;
  current_title: string | null;
  posts_classified: number;
  news_classified: number;
  scripts_generated: number;
  errors: string[];
  last_error: string | null;
  force: boolean;
}

interface ActivityItem {
  timestamp: string;
  message: string;
}

interface Stats {
  news: number;
  social_posts: number;
  scripts: number;
}

// -------------------------------------------------------
// API helper
// -------------------------------------------------------

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      typeof payload?.error === 'string'
        ? payload.error
        : `Request failed (${response.status})`;

    throw new Error(errorMessage);
  }

  return payload as T;
}

// -------------------------------------------------------
// Styles
// -------------------------------------------------------

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50';

const darkButton = `${buttonClass} border border-[#232836] bg-[#141826] text-[#94a3b8] hover:border-[#c8f135]/40 hover:text-[#f8fafc]`;

const greenButton = `${buttonClass} border border-[#c8f135]/30 bg-[#c8f135]/10 text-[#c8f135] hover:bg-[#c8f135]/15`;

const redButton = `${buttonClass} border border-red-400/25 bg-red-400/10 text-red-300 hover:bg-red-400/15`;

const inputClass =
  'w-full rounded-xl border border-[#232836] bg-[#141826] px-4 py-3 text-sm text-[#f8fafc] outline-none transition-colors focus:border-[#c8f135]/50';

const textareaClass =
  'w-full resize-y rounded-xl border border-[#232836] bg-[#141826] px-4 py-3 text-sm leading-relaxed text-[#f8fafc] outline-none transition-colors focus:border-[#c8f135]/50';

// -------------------------------------------------------
// Utilities
// -------------------------------------------------------

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatTime(value: string | null | undefined): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString();
}

function getNewsDisplayText(item: NewsItem): string {
  return item.classifier?.trim() || item.raw_content?.trim() || '';
}

function getServiceStatusLabel(service: ServiceStatus): string {
  if (service.running) {
    return service.pid ? `Running · PID ${service.pid}` : 'Running';
  }

  if (service.type === 'oneshot' && service.status === 'idle') {
    return 'Idle';
  }

  return 'Stopped';
}

// -------------------------------------------------------
// Copy button
// -------------------------------------------------------

const CopyButton: React.FC<{
  text: string;
  label?: string;
}> = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" onClick={copy} className={darkButton}>
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? 'Copied' : label}
    </button>
  );
};

// -------------------------------------------------------
// Service control card
// -------------------------------------------------------

const ServiceCard: React.FC<{
  service: ServiceStatus;
  busy: boolean;
  onStart: () => void;
  onStop: () => void;
  onRun: () => void;
}> = ({ service, busy, onStart, onStop, onRun }) => {
  const isRunning = service.running;
  const isOneShot = service.type === 'oneshot';

  return (
    <div
      id={`service-card-${service.id}`}
      className="rounded-2xl border border-[#1e2840] bg-[#0c101a] p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                isRunning
                  ? 'bg-[#c8f135] shadow-[0_0_10px_#c8f135]'
                  : 'bg-[#475569]'
              }`}
            />
            <h3 className="truncate text-sm font-bold text-[#f8fafc]">
              {service.name}
            </h3>
          </div>

          <p className="mt-2 break-all font-mono text-xs text-[#64748b]">
            {service.module}
          </p>

          <p className="mt-1 text-xs text-[#64748b]">
            {getServiceStatusLabel(service)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {isOneShot ? (
            <button
              id={`service-run-${service.id}`}
              type="button"
              onClick={onRun}
              disabled={busy || isRunning}
              className={greenButton}
            >
              <Play className="h-3.5 w-3.5" />
              {isRunning ? 'Running…' : 'Run Now'}
            </button>
          ) : isRunning ? (
            <button
              id={`service-stop-${service.id}`}
              type="button"
              onClick={onStop}
              disabled={busy}
              className={redButton}
            >
              <Square className="h-3.5 w-3.5" />
              Stop
            </button>
          ) : (
            <button
              id={`service-start-${service.id}`}
              type="button"
              onClick={onStart}
              disabled={busy}
              className={greenButton}
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </button>
          )}
        </div>
      </div>

      {(service.started_at || service.finished_at) && (
        <div className="mt-4 grid gap-2 border-t border-[#151b2a] pt-4 text-[11px] text-[#64748b] sm:grid-cols-2">
          <span>
            Started:{' '}
            <span className="text-[#8090a8]">
              {formatTime(service.started_at)}
            </span>
          </span>
          <span>
            Finished:{' '}
            <span className="text-[#8090a8]">
              {formatTime(service.finished_at)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------
// Script display card
// -------------------------------------------------------

const ScriptCard: React.FC<{
  script: ScriptItem;
  onRegenerate?: () => void;
  regenerating?: boolean;
}> = ({ script, onRegenerate, regenerating = false }) => {
  const [tab, setTab] = useState<'youtube' | 'instagram'>('youtube');
  const [expanded, setExpanded] = useState(false);

  const hasYoutube = Boolean(script.youtube_script?.trim());
  const hasInstagram = Boolean(script.instagram_script?.trim());

  const activeScript =
    tab === 'youtube' ? script.youtube_script : script.instagram_script;

  useEffect(() => {
    if (tab === 'youtube' && !hasYoutube && hasInstagram) {
      setTab('instagram');
      setExpanded(false);
    }
  }, [tab, hasYoutube, hasInstagram]);

  return (
    <article
      id={`script-card-${script.id}`}
      className="overflow-hidden rounded-2xl border border-[#1e2840] bg-[#0c101a]"
    >
      <div className="border-b border-[#1e2840] px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748b]">
              <span className="font-mono">Script #{script.id}</span>
              <span>·</span>
              <span>News #{script.news_id}</span>
              <span>·</span>
              <span>{script.news?.source || 'unknown'}</span>
              <span className="rounded-full bg-[#c8f135]/10 px-2 py-0.5 text-[#c8f135]">
                {script.status || 'generated'}
              </span>
            </div>

            <h3 className="mt-2 line-clamp-2 text-sm font-bold text-[#f8fafc]">
              {script.news?.title || `Script #${script.id}`}
            </h3>

            <p className="mt-1 text-xs text-[#64748b]">
              Generated {formatDate(script.created_at)}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {script.news?.url && (
              <a
                href={script.news.url}
                target="_blank"
                rel="noopener noreferrer"
                className={darkButton}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Source
              </a>
            )}

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={regenerating}
                className={greenButton}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    regenerating ? 'animate-spin' : ''
                  }`}
                />
                {regenerating ? 'Regenerating…' : 'Regenerate'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#1e2840]">
        <button
          id={`script-tab-youtube-${script.id}`}
          type="button"
          onClick={() => {
            setTab('youtube');
            setExpanded(false);
          }}
          disabled={!hasYoutube}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            tab === 'youtube'
              ? 'border-[#c8f135] text-[#c8f135]'
              : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
          }`}
        >
          <Youtube className="h-3.5 w-3.5 text-red-400" />
          YouTube
        </button>

        <button
          id={`script-tab-instagram-${script.id}`}
          type="button"
          onClick={() => {
            setTab('instagram');
            setExpanded(false);
          }}
          disabled={!hasInstagram}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            tab === 'instagram'
              ? 'border-[#c8f135] text-[#c8f135]'
              : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
          }`}
        >
          <Instagram className="h-3.5 w-3.5 text-pink-400" />
          Instagram
        </button>
      </div>

      <div className="p-5">
        {activeScript ? (
          <>
            <div
              className={`relative overflow-hidden ${
                expanded ? '' : 'max-h-48'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#c8d3e8]">
                {activeScript}
              </pre>

              {!expanded && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c101a] to-transparent" />
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={activeScript} label="Copy Script" />

              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className={darkButton}
              >
                {expanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
                {expanded ? 'Show less' : 'Show full script'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs italic text-[#64748b]">
            No {tab} script generated.
          </p>
        )}
      </div>
    </article>
  );
};

// -------------------------------------------------------
// News editor modal
// -------------------------------------------------------

const EditNewsModal: React.FC<{
  item: NewsItem;
  saving: boolean;
  onClose: () => void;
  onSave: (title: string, articleText: string) => void;
}> = ({ item, saving, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title);
  const [articleText, setArticleText] = useState(
    item.classifier?.trim() || item.raw_content?.trim() || '',
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, saving]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-news-title"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl border border-[#1e2840] bg-[#0c101a] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1e2840] bg-[#0c101a] px-5 py-4">
          <div>
            <p className="font-mono text-xs text-[#64748b]">
              NEWS #{item.id}
            </p>
            <h2
              id="edit-news-title"
              className="mt-1 text-lg font-bold text-[#f8fafc]"
            >
              Edit news
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-[#64748b] transition-colors hover:text-[#f8fafc] disabled:opacity-50"
            aria-label="Close edit dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#94a3b8]">
              Title
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
              autoFocus
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#94a3b8]">
              Published summary / article
            </span>

            <textarea
              value={articleText}
              onChange={(event) => setArticleText(event.target.value)}
              rows={16}
              className={textareaClass}
              placeholder="Write the article or summary that should be used by the site and script generator."
            />

            <span className="mt-2 block text-[11px] leading-relaxed text-[#64748b]">
              This edits the AI-written/public{' '}
              <span className="font-mono text-[#8090a8]">classifier</span>{' '}
              field. The original{' '}
              <span className="font-mono text-[#8090a8]">raw_content</span>{' '}
              source text is preserved.
            </span>
          </label>

          {item.raw_content && item.classifier && (
            <details className="rounded-xl border border-[#232836] bg-[#101520]">
              <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-[#94a3b8]">
                View original source summary
              </summary>

              <div className="border-t border-[#232836] p-4">
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-[#8090a8]">
                  {item.raw_content}
                </p>
              </div>
            </details>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={darkButton}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onSave(title.trim(), articleText.trim())}
              disabled={saving || !title.trim() || !articleText.trim()}
              className={greenButton}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// Main page
// -------------------------------------------------------

export const AdminScriptsPage: React.FC = () => {
  useSEO({
    title: 'Admin Control Center | Leonida Forge',
    description:
      'Internal Leonida Forge automation and content management dashboard.',
    canonicalPath: '/admin',
    noIndex: true,
  });

  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const [job, setJob] = useState<ScriptJob>({
    status: 'idle',
    started_at: null,
    finished_at: null,
    stage: null,
    stage_label: null,
    total: 0,
    processed: 0,
    current_news_id: null,
    current_title: null,
    posts_classified: 0,
    news_classified: 0,
    scripts_generated: 0,
    errors: [],
    last_error: null,
    force: false,
  });

  const [stats, setStats] = useState<Stats>({
    news: 0,
    social_posts: 0,
    scripts: 0,
  });

  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [busyService, setBusyService] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [regeneratingNewsId, setRegeneratingNewsId] = useState<number | null>(
    null,
  );

  const scriptJobRunning =
    job.status === 'starting' || job.status === 'running';

  const progress =
    job.total > 0
      ? Math.min(100, Math.round((job.processed / job.total) * 100))
      : scriptJobRunning
        ? 0
        : 100;

  const dismissNotices = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  const loadServicesScriptsActivityStats = useCallback(async () => {
    try {
      const [
        serviceResponse,
        scriptResponse,
        activityResponse,
        statsResponse,
      ] = await Promise.all([
        apiFetch<{ data: ServiceStatus[] }>('/admin/services'),
        apiFetch<{ data: ScriptItem[] }>('/scripts'),
        apiFetch<{ data: ActivityItem[] }>(
          '/admin/activity?limit=30',
        ),
        apiFetch<Stats>('/admin/stats'),
      ]);

      setServices(serviceResponse.data || []);
      setScripts(scriptResponse.data || []);
      setActivity(activityResponse.data || []);
      setStats(
        statsResponse || {
          news: 0,
          social_posts: 0,
          scripts: 0,
        },
      );
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error('Failed to load admin data');
    }
  }, []);

  const loadNews = useCallback(async (term: string = '') => {
    try {
      setNewsLoading(true);

      const query = new URLSearchParams({
        page: '1',
        limit: '30',
      });

      const trimmedTerm = term.trim();

      if (trimmedTerm) {
        query.set('search', trimmedTerm);
      }

      const response = await apiFetch<{
        data: NewsItem[];
        page: number;
        limit: number;
        total: number;
      }>(`/admin/news?${query.toString()}`);

      setNews(response.data || []);
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error('Failed to load news');
    } finally {
      setNewsLoading(false);
    }
  }, []);

  const loadJob = useCallback(async () => {
    try {
      const response = await apiFetch<{ job: ScriptJob }>(
        '/admin/scripts/status',
      );

      if (response.job) {
        setJob(response.job);
      }
    } catch {
      // Status polling should never break the rest of the dashboard.
    }
  }, []);

  const refreshDashboard = useCallback(
    async (term: string = '') => {
      setError(null);

      const results = await Promise.allSettled([
        loadServicesScriptsActivityStats(),
        loadNews(term),
        loadJob(),
      ]);

      const rejected = results.find(
        (result): result is PromiseRejectedResult =>
          result.status === 'rejected',
      );

      if (rejected) {
        throw rejected.reason instanceof Error
          ? rejected.reason
          : new Error('Failed to refresh admin dashboard');
      }
    },
    [loadJob, loadNews, loadServicesScriptsActivityStats],
  );

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      try {
        setLoading(true);
        setError(null);

        await refreshDashboard('');

        if (!mounted) return;

        setAppliedSearch('');
        setSearch('');
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load admin dashboard',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void initialLoad();

    return () => {
      mounted = false;
    };
  }, [refreshDashboard]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadJob();

      void (async () => {
        try {
          await loadServicesScriptsActivityStats();
        } catch {
          // Background refresh errors are intentionally silent.
        }
      })();

      void (async () => {
        try {
          await loadNews(appliedSearch);
        } catch {
          // Background refresh errors are intentionally silent.
        }
      })();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [
    appliedSearch,
    loadJob,
    loadNews,
    loadServicesScriptsActivityStats,
  ]);

  const runService = async (
    id: string,
    action: 'start' | 'stop' | 'run',
  ) => {
    try {
      setBusyService(id);
      dismissNotices();

      await apiFetch(`/admin/services/${id}/${action}`, {
        method: 'POST',
      });

      const actionText =
        action === 'run'
          ? 'started'
          : action === 'start'
            ? 'started'
            : 'stopped';

      setMessage(`${id} ${actionText} successfully.`);

      await loadServicesScriptsActivityStats();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Service action failed',
      );
    } finally {
      setBusyService(null);
    }
  };

  const runScripts = async (
    newsId?: number,
    force: boolean = false,
  ) => {
    try {
      dismissNotices();

      if (newsId !== undefined) {
        setRegeneratingNewsId(newsId);
      }

      await apiFetch('/admin/scripts/run', {
        method: 'POST',
        body: JSON.stringify({
          ...(newsId !== undefined ? { news_id: newsId } : {}),
          force,
        }),
      });

      setMessage(
        newsId !== undefined
          ? `Script generation started for News #${newsId}.`
          : 'Script generation started for all pending content.',
      );

      await loadJob();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not start script generation',
      );
    } finally {
      if (newsId !== undefined) {
        setRegeneratingNewsId(null);
      }
    }
  };

  const saveNews = async (
    title: string,
    articleText: string,
  ) => {
    if (!editing) return;

    const newsId = editing.id;

    try {
      setSaving(true);
      dismissNotices();

      await apiFetch(`/admin/news/${newsId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          classifier: articleText,
        }),
      });

      setEditing(null);
      setMessage(`News #${newsId} updated.`);

      await Promise.all([
        loadNews(),
        loadServicesScriptsActivityStats(),
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not update news',
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = async (item: NewsItem) => {
    const confirmed = window.confirm(
      `Delete News #${item.id}?\n\n${item.title}\n\nThis permanently deletes the news item and its generated scripts from Supabase.`,
    );

    if (!confirmed) return;

    try {
      dismissNotices();

      await apiFetch(`/admin/news/${item.id}`, {
        method: 'DELETE',
      });

      setMessage(`News #${item.id} deleted.`);

      await Promise.all([
        loadNews(),
        loadServicesScriptsActivityStats(),
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete news',
      );
    }
  };

  const submitSearch = () => {
    const nextTerm = search.trim();
    setAppliedSearch(nextTerm);

    void (async () => {
      try {
        setError(null);
        await loadNews(nextTerm);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to search news',
        );
      }
    })();
  };

  const clearSearch = () => {
    setSearch('');
    setAppliedSearch('');

    void (async () => {
      try {
        setError(null);
        await loadNews('');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load news',
        );
      }
    })();
  };

  const visibleServices = useMemo(() => services, [services]);

  const jobStatusText =
    job.status === 'completed_with_errors'
      ? 'Completed with errors'
      : job.status;

  if (loading) {
    return <LoadingState message="Loading Leonida Forge admin…" />;
  }

  if (error && !services.length && !scripts.length && !news.length) {
    return <ErrorState message={error} onRetry={() => void refreshDashboard()} />;
  }

  return (
    <div
      id="admin-scripts-page"
      className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6"
    >
      <Breadcrumbs items={[{ label: 'Admin', path: '/admin' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#64748b]">
            Leonida Forge
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#f8fafc]">
            Admin Control Center
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-[#8090a8]">
            Run collectors, generate scripts, search news, edit articles,
            and manage Supabase content.
          </p>
        </div>

        <button
          id="admin-refresh-all"
          type="button"
          onClick={() => {
            dismissNotices();

            void refreshDashboard().catch((err) => {
              setError(
                err instanceof Error
                  ? err.message
                  : 'Failed to refresh dashboard',
              );
            });
          }}
          className={darkButton}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh All
        </button>
      </div>

      {/* Safety banner */}
      <div className="flex items-start gap-3 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/5 p-4">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />

        <div className="text-xs leading-relaxed text-[#d4a44b]">
          <strong className="text-[#f59e0b]">Internal admin area.</strong>{' '}
          This dashboard can modify and delete Supabase data. Add
          authentication before exposing it publicly.
        </div>
      </div>

      {/* Notices */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto text-red-200/60 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-[#c8f135]/20 bg-[#c8f135]/5 p-4 text-xs text-[#c8f135]">
          <Check className="h-4 w-4 shrink-0" />
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-auto text-[#c8f135]/60 hover:text-[#c8f135]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Automation */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#f8fafc]">Automation</h2>
          <p className="mt-1 text-sm text-[#64748b]">
            Directly control the Python collectors.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {visibleServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              busy={busyService === service.id}
              onStart={() => void runService(service.id, 'start')}
              onStop={() => void runService(service.id, 'stop')}
              onRun={() => void runService(service.id, 'run')}
            />
          ))}
        </div>
      </section>

      {/* Run scripts */}
      <section className="rounded-2xl border border-[#1e2840] bg-[#0c101a] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#c8f135]" />

              <h2 className="text-xl font-bold text-[#f8fafc]">
                Run Scripts
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#64748b]">
              Process pending X posts and news, then generate YouTube and
              Instagram scripts.
            </p>
          </div>

          <button
            id="run-scripts-btn"
            type="button"
            onClick={() => void runScripts()}
            disabled={scriptJobRunning}
            className={greenButton}
          >
            <Play className="h-3.5 w-3.5" />

            {scriptJobRunning ? 'Generating…' : 'Run Scripts'}
          </button>
        </div>

        {(scriptJobRunning ||
          job.status === 'completed' ||
          job.status === 'completed_with_errors' ||
          job.status === 'failed') && (
          <div className="mt-5 rounded-xl border border-[#232836] bg-[#141826] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-[#94a3b8]">
                  Status: {jobStatusText}
                </span>

                {job.stage_label && (
                  <span className="rounded-full bg-[#c8f135]/10 px-2.5 py-1 text-[#c8f135]">
                    {job.stage_label}
                  </span>
                )}
              </div>

              <span className="text-[#64748b]">
                {job.processed}/{job.total} processed
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#232836]">
              <div
                className="h-full bg-[#c8f135] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#64748b]">
              <span>Posts: {job.posts_classified}</span>
              <span>News: {job.news_classified}</span>
              <span>Scripts: {job.scripts_generated}</span>

              {job.force && (
                <span className="text-amber-300">Force mode</span>
              )}
            </div>

            {job.current_title && (
              <p className="mt-3 text-xs text-[#8090a8]">
                Current: {job.current_title}
              </p>
            )}

            {job.current_news_id !== null && (
              <p className="mt-1 font-mono text-[11px] text-[#64748b]">
                News #{job.current_news_id}
              </p>
            )}

            {job.last_error && (
              <p className="mt-2 whitespace-pre-wrap text-xs text-red-300">
                {job.last_error}
              </p>
            )}

            {job.errors?.length > 1 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-[#94a3b8]">
                  View all {job.errors.length} errors
                </summary>

                <div className="mt-2 space-y-1">
                  {job.errors.map((item, index) => (
                    <p
                      key={`${item}-${index}`}
                      className="text-xs leading-relaxed text-red-300/90"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ['News', stats.news],
          ['X Posts', stats.social_posts],
          ['Scripts', stats.scripts],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-[#1e2840] bg-[#0c101a] p-5"
          >
            <p className="text-xs uppercase tracking-wider text-[#64748b]">
              {label}
            </p>

            <p className="mt-2 text-3xl font-extrabold text-[#f8fafc]">
              {value}
            </p>
          </div>
        ))}
      </section>

      {/* News management */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#f8fafc]">
              News Management
            </h2>

            <p className="mt-1 text-sm text-[#64748b]">
              Search, edit, generate, regenerate, or permanently delete news
              stored in Supabase.
            </p>
          </div>

          <div className="flex w-full max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

              <input
                id="admin-news-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    submitSearch();
                  }
                }}
                placeholder="Search news title…"
                className={`${inputClass} py-2.5 pl-9 pr-3`}
              />
            </div>

            <button
              id="admin-news-search-btn"
              type="button"
              onClick={submitSearch}
              className={greenButton}
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>

            {appliedSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className={darkButton}
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {appliedSearch && (
          <div className="text-xs text-[#64748b]">
            Showing results for{' '}
            <span className="font-semibold text-[#94a3b8]">
              “{appliedSearch}”
            </span>
          </div>
        )}

        <div className="space-y-3">
          {newsLoading && <LoadingState message="Loading news…" />}

          {!newsLoading && news.length === 0 && (
            <div className="rounded-2xl border border-[#1e2840] bg-[#0c101a] p-8 text-center text-sm text-[#64748b]">
              No news found.
            </div>
          )}

          {!newsLoading &&
            news.map((item) => {
              const displayText = getNewsDisplayText(item);

              return (
                <article
                  key={item.id}
                  id={`admin-news-${item.id}`}
                  className="rounded-2xl border border-[#1e2840] bg-[#0c101a] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748b]">
                        <span className="font-mono">#{item.id}</span>
                        <span>·</span>
                        <span>{item.source}</span>

                        {item.has_classifier && (
                          <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-sky-300">
                            Article ready
                          </span>
                        )}

                        {item.has_script && (
                          <span className="rounded-full bg-[#c8f135]/10 px-2 py-0.5 text-[#c8f135]">
                            Script ready
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-base font-bold text-[#f8fafc]">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-sm leading-relaxed text-[#94a3b8]">
                        {displayText || 'No article or summary available.'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#64748b]">
                        {item.published_at && (
                          <span>
                            Published: {formatDate(item.published_at)}
                          </span>
                        )}

                        <span>
                          Collected: {formatDate(item.collected_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={darkButton}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Source
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        className={darkButton}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void runScripts(
                            item.id,
                            Boolean(item.has_script),
                          )
                        }
                        disabled={
                          scriptJobRunning ||
                          regeneratingNewsId === item.id
                        }
                        className={greenButton}
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${
                            regeneratingNewsId === item.id
                              ? 'animate-spin'
                              : ''
                          }`}
                        />

                        {regeneratingNewsId === item.id
                          ? 'Generating…'
                          : item.has_script
                            ? 'Regenerate'
                            : 'Run Script'}
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteNews(item)}
                        className={redButton}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      {/* Scripts */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#c8f135]" />

              <h2 className="text-xl font-bold text-[#f8fafc]">
                Generated Scripts
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#64748b]">
              View scripts currently stored in Supabase and regenerate them
              from their news article.
            </p>
          </div>

          <span className="rounded-full border border-[#232836] bg-[#141826] px-3 py-1 text-xs text-[#94a3b8]">
            {scripts.length} stored
          </span>
        </div>

        {scripts.length === 0 ? (
          <div className="rounded-2xl border border-[#1e2840] bg-[#0c101a] p-8 text-center text-sm text-[#64748b]">
            No scripts have been generated yet.
          </div>
        ) : (
          <div className="space-y-5">
            {scripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                regenerating={regeneratingNewsId === script.news_id}
                onRegenerate={
                  script.news_id
                    ? () =>
                        void runScripts(script.news_id, true)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Activity */}
      <section className="rounded-2xl border border-[#1e2840] bg-[#0c101a] p-5">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#c8f135]" />

          <h2 className="text-xl font-bold text-[#f8fafc]">
            Recent Activity
          </h2>
        </div>

        <div className="mt-4 space-y-2">
          {activity.length === 0 ? (
            <p className="text-sm text-[#64748b]">No activity yet.</p>
          ) : (
            activity.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className="flex flex-col gap-1 rounded-lg border border-[#151b2a] bg-[#0a0f18] px-3 py-2 sm:flex-row sm:items-start sm:gap-3"
              >
                <span className="shrink-0 font-mono text-[10px] text-[#64748b]">
                  {formatTime(entry.timestamp)}
                </span>

                <span className="text-xs text-[#94a3b8]">
                  {entry.message}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Edit modal */}
      {editing && (
        <EditNewsModal
          item={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={saveNews}
        />
      )}
    </div>
  );
};