import { useState, useEffect, useCallback } from 'react';
import { getSocialPosts } from '../services/socialService';
import type { SocialPost, PaginatedResponse } from '../types';

export function useSocialPosts(page = 1) {
  const [result, setResult] = useState<PaginatedResponse<SocialPost>>({ data: [], page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSocialPosts(page);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load social posts');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...result, loading, error, retry: fetch };
}
