"use client";

import { useEffect, useState } from "react";
import { recordVisit } from "@/lib/streak";

/**
 * Records today's visit and shows a subtle streak count if >= 2 days.
 * Hidden on day 1 so it doesn't feel like a pressure metric.
 */
export default function StreakBadge() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const data = recordVisit();
    setStreak(data.currentStreak);
  }, []);

  // Don't show on first visit or if streak is 0
  if (streak < 2) return null;

  return (
    <p className="text-xs font-sans text-grace-muted text-center tracking-wide">
      {streak} day{streak !== 1 ? "s" : ""} in a row
    </p>
  );
}
