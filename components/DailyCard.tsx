import type { DailyEntry } from "@/lib/types";
import VerseBlock from "@/components/VerseBlock";
import ReflectionBlock from "@/components/ReflectionBlock";
import ActionBlock from "@/components/ActionBlock";
import SaintFooter from "@/components/SaintFooter";
import StreakBadge from "@/components/StreakBadge";

interface DailyCardProps {
  entry: DailyEntry;
  dateLabel: string;
}

export default function DailyCard({ entry, dateLabel }: DailyCardProps) {
  return (
    <article className="flex flex-col gap-7 w-full max-w-md mx-auto px-6
                        pt-[max(2.5rem,env(safe-area-inset-top)+1.5rem)] pb-6">
      {/* Persistent greeting — always above the card */}
      <p className="font-serif text-xl text-grace-gold text-center tracking-wide">
        Jesus loves you.
      </p>

      {/* Date */}
      <header>
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-muted">
          {dateLabel}
        </p>
      </header>

      {/* Opening message — the emotional anchor */}
      <h1 className="font-serif text-[2rem] leading-snug text-grace-text font-normal">
        {entry.shortMessage}
      </h1>

      {/* Scripture */}
      <VerseBlock reference={entry.verseReference} text={entry.verseText} />

      <hr className="border-grace-gold-light" />

      {/* Reflection */}
      <ReflectionBlock text={entry.reflection} />

      {/* Action */}
      <ActionBlock text={entry.action} />

      {/* Saint / feast note */}
      {entry.optionalSaintOrFeast && (
        <SaintFooter text={entry.optionalSaintOrFeast} />
      )}

      {/* Streak — client component, shows only when >= 2 days */}
      <StreakBadge />
    </article>
  );
}
