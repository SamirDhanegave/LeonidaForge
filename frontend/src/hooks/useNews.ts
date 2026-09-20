import { useState, useEffect, useCallback } from 'react';
import { getLatestNews, getAllNews, getNewsById } from '../services/newsService';
import type { News, PaginatedResponse } from '../types';

// -------------------------------------------------------
// useLatestNews
// -------------------------------------------------------
export function useLatestNews() {
  const [news, setNews]     = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLatestNews();
      setNews(result.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { news, loading, error, retry: fetch };
}

// -------------------------------------------------------
// useAllNews
// -------------------------------------------------------
export function useAllNews(page = 1, source?: string) {
  const [result, setResult] = useState<PaginatedResponse<News>>({ data: [], page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllNews(page, 12, source);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }, [page, source]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...result, loading, error, retry: fetch };
}

// -------------------------------------------------------
// useNewsItem
// -------------------------------------------------------
export function useNewsItem(id: number) {
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNewsById(id);
      setArticle(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Article not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { article, loading, error, retry: fetch };
}
