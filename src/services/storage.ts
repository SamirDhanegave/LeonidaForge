/**
 * Namespaced client-side localStorage service for Leonida Forge.
 * Features graceful corruption recovery and safe JSON serialization.
 */

const STORAGE_KEYS = {
  TRACKER: 'leonida_tracker_completed_v1',
  COMPARED_VEHICLES: 'leonida_compared_vehicles_v1',
  TRACKED_VEHICLES: 'leonida_tracked_vehicles_v1',
  SAVED_LOCATIONS: 'leonida_saved_locations_v1',
  COMPLETED_MISSIONS: 'leonida_completed_missions_v1',
  FEEDBACK: 'leonida_feedback_votes_v1',
  MONEY_GOAL: 'leonida_saved_money_goal_v1',
} as const;

function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[Storage] Failed to read ${key}, resetting to default:`, err);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[Storage] Failed to write ${key}:`, err);
  }
}

export const StorageService = {
  // Tracker
  getCompletedTrackerItems(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.TRACKER, []);
  },
  setCompletedTrackerItems(ids: string[]): void {
    safeSetItem(STORAGE_KEYS.TRACKER, ids);
  },
  toggleTrackerItem(id: string): string[] {
    const current = this.getCompletedTrackerItems();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    this.setCompletedTrackerItems(next);
    return next;
  },
  resetTracker(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.TRACKER);
    } catch (e) {
      console.error(e);
    }
  },

  // Compared Vehicles (max 3)
  getComparedVehicles(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.COMPARED_VEHICLES, [
      'bravado-banshee-gts',
      'grotti-cheetah-classic',
      'pegassi-zorrusso',
    ]);
  },
  setComparedVehicles(slugs: string[]): void {
    safeSetItem(STORAGE_KEYS.COMPARED_VEHICLES, slugs.slice(0, 3));
  },
  addComparedVehicle(slug: string): string[] {
    const current = this.getComparedVehicles().filter((s) => s !== slug);
    const next = [slug, ...current].slice(0, 3);
    this.setComparedVehicles(next);
    return next;
  },
  removeComparedVehicle(slug: string): string[] {
    const next = this.getComparedVehicles().filter((s) => s !== slug);
    this.setComparedVehicles(next);
    return next;
  },
  clearComparedVehicles(): void {
    safeSetItem(STORAGE_KEYS.COMPARED_VEHICLES, []);
  },

  // Tracked / Bookmarked Vehicles
  getTrackedVehicles(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.TRACKED_VEHICLES, ['bravado-banshee-gts']);
  },
  toggleTrackedVehicle(slug: string): boolean {
    const current = this.getTrackedVehicles();
    const exists = current.includes(slug);
    const next = exists ? current.filter((s) => s !== slug) : [...current, slug];
    safeSetItem(STORAGE_KEYS.TRACKED_VEHICLES, next);
    return !exists;
  },

  // Saved Locations
  getSavedLocations(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.SAVED_LOCATIONS, []);
  },
  toggleSavedLocation(slug: string): boolean {
    const current = this.getSavedLocations();
    const exists = current.includes(slug);
    const next = exists ? current.filter((s) => s !== slug) : [...current, slug];
    safeSetItem(STORAGE_KEYS.SAVED_LOCATIONS, next);
    return !exists;
  },

  // Completed Missions
  getCompletedMissions(): string[] {
    return safeGetItem<string[]>(STORAGE_KEYS.COMPLETED_MISSIONS, []);
  },
  toggleCompletedMission(id: string): boolean {
    const current = this.getCompletedMissions();
    const exists = current.includes(id);
    const next = exists ? current.filter((s) => s !== id) : [...current, id];
    safeSetItem(STORAGE_KEYS.COMPLETED_MISSIONS, next);
    return !exists;
  },

  // Feedback (Validation & Demand Discovery)
  getFeedbackStatus(pageSlug: string): 'yes' | 'no' | null {
    const records = safeGetItem<Record<string, 'yes' | 'no'>>(STORAGE_KEYS.FEEDBACK, {});
    return records[pageSlug] || null;
  },
  submitFeedback(pageSlug: string, isUseful: boolean): void {
    const records = safeGetItem<Record<string, 'yes' | 'no'>>(STORAGE_KEYS.FEEDBACK, {});
    records[pageSlug] = isUseful ? 'yes' : 'no';
    safeSetItem(STORAGE_KEYS.FEEDBACK, records);
  },

  // Money goal draft
  getSavedMoneyGoal(): { target: number; current: number; rate: number } {
    return safeGetItem(STORAGE_KEYS.MONEY_GOAL, {
      target: 2500000,
      current: 450000,
      rate: 120000,
    });
  },
  setSavedMoneyGoal(goal: { target: number; current: number; rate: number }): void {
    safeSetItem(STORAGE_KEYS.MONEY_GOAL, goal);
  },
};
