import { apiFetch } from './api';
import type { Script } from '../types';

export async function getAllScripts(): Promise<{ data: Script[] }> {
  return apiFetch<{ data: Script[] }>('/scripts');
}

export async function getScriptById(id: number): Promise<Script> {
  return apiFetch<Script>(`/scripts/${id}`);
}
