import { apiFetch } from './api';
import type { News, PaginatedResponse } from '../types';

export async function getLatestNews(): Promise<{ data: News[] }> {
  return apiFetch<{ data: News[] }>('/news/latest');
}

export async function getAllNews(
  page = 1,
  limit = 12,
  source?: string,
): Promise<PaginatedResponse<News>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (source) params.set('source', source);
  return apiFetch<PaginatedResponse<News>>(`/news?${params}`);
}

export async function getNewsById(id: number): Promise<News> {
  return apiFetch<News>(`/news/${id}`);
}
