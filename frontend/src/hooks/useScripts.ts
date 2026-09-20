import { useState, useEffect, useCallback } from 'react';
import { getAllScripts, getScriptById } from '../services/scriptService';
import type { Script } from '../types';

export function useScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllScripts();
      setScripts(result.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load scripts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { scripts, loading, error, retry: fetch };
}

export function useScript(id: number) {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]    = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getScriptById(id);
      setScript(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Script not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { script, loading, error, retry: fetch };
}
