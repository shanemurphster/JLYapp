import { getTodayEntry } from "@/lib/getTodayEntry";
import DailyCard from "@/components/DailyCard";

/**
 * Home — the entire product.
 * Renders today's card immediately with no loading state or friction.
 *
 * This is a React Server Component: the entry is resolved at request time
 * on the server, so the user always gets the correct day's content
 * without any client-side date logic.
 */
export default function Home() {
  const entry = getTodayEntry();

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return <DailyCard entry={entry} dateLabel={dateLabel} />;
}
