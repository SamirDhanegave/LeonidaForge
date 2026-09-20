import { apiFetch } from './api';
import type { SocialPost, PaginatedResponse } from '../types';

export async function getSocialPosts(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<SocialPost>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return apiFetch<PaginatedResponse<SocialPost>>(`/social?${params}`);
}
