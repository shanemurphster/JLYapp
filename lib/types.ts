export interface DailyEntry {
  id: number;
  shortMessage: string;
  verseReference: string;
  verseText: string;
  reflection: string;
  action: string;
  optionalSaintOrFeast?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string; // YYYY-MM-DD
}
