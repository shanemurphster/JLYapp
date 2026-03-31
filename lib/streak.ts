/**
 * Device-local streak tracking via localStorage.
 * No backend, no sync, no accounts.
 *
 * Limitations:
 * - Resets if the user clears browser/app data
 * - Does not sync across devices
 * - Streak is per-browser (Safari on iPhone ≠ Chrome on Mac)
 */

import type { StreakData } from "@/lib/types";

const STORAGE_KEY = "daily-grace-streak";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function defaultStreak(): StreakData {
  return { currentStreak: 0, longestStreak: 0, lastVisitDate: "" };
}

function readStored(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStreak();
    const parsed = JSON.parse(raw) as Partial<StreakData>;
    return {
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      lastVisitDate: parsed.lastVisitDate ?? "",
    };
  } catch {
    return defaultStreak();
  }
}

function write(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage might be unavailable in private browsing — fail silently
  }
}

/**
 * Call once when the user opens the app and views today's card.
 * Returns the updated streak data.
 *
 * Logic:
 * - Same day as last visit → no change (already counted today)
 * - Day after last visit   → increment streak
 * - Any gap larger         → reset streak to 1
 */
export function recordVisit(): StreakData {
  const today = todayString();
  const stored = readStored();

  if (stored.lastVisitDate === today) {
    return stored; // already counted
  }

  const newStreak =
    stored.lastVisitDate === yesterdayString()
      ? stored.currentStreak + 1
      : 1; // gap or first visit

  const updated: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, stored.longestStreak),
    lastVisitDate: today,
  };

  write(updated);
  return updated;
}

/** Read current streak without modifying it. */
export function getStreak(): StreakData {
  return readStored();
}
