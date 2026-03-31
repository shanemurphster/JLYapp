import { loadEntriesFromCSV } from "@/lib/parseEntries";
import type { DailyEntry } from "@/lib/types";

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)); // 1–366
}

/** Returns today's daily entry. Called from Server Components only. */
export function getTodayEntry(): DailyEntry {
  const entries = loadEntriesFromCSV();
  const index = (dayOfYear(new Date()) - 1) % entries.length;
  return entries[index];
}

/** Returns the entry for any given date — useful for testing. */
export function getEntryForDate(date: Date): DailyEntry {
  const entries = loadEntriesFromCSV();
  const index = (dayOfYear(date) - 1) % entries.length;
  return entries[index];
}
