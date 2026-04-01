import { DONATION_URL } from "@/lib/config";

export default function SupportPage() {
  return (
    <div className="w-full max-w-md mx-auto px-6 pt-12 pb-4 flex flex-col gap-8">
      <header>
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-muted mb-1">
          Support
        </p>
        <h1 className="font-serif text-2xl text-grace-text">Daily Grace</h1>
      </header>

      <section className="flex flex-col gap-4">
        <p className="font-sans text-base leading-relaxed text-grace-text-soft">
          Daily Grace is a simple app with one purpose: one moment of peace,
          one verse, one small action — every day.
        </p>
        <p className="font-sans text-base leading-relaxed text-grace-text-soft">
          No feed. No followers. No score. Just a daily reminder that you are
          known, loved, and today is worth showing up for.
        </p>
        <p className="font-sans text-base leading-relaxed text-grace-text-soft">
          The content is rooted in the Christian faith — Scripture, reflection,
          and the gentle rhythm of the liturgical year.
        </p>
      </section>

      <hr className="border-grace-gold-light" />

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-grace-text">Support Daily Grace</h2>
        <p className="font-sans text-base leading-relaxed text-grace-text-soft">
          Your support helps keep Daily Grace running and growing.
        </p>
        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-grace-gold text-white font-sans text-sm font-medium
                     py-3 rounded-xl text-center active:opacity-75 transition-opacity"
        >
          Donate
        </a>
        <p className="font-sans text-xs text-grace-muted text-center">
          Daily Grace is free and always will be.
        </p>
      </section>

      <hr className="border-grace-gold-light" />

      <p className="font-sans text-sm leading-relaxed text-grace-muted text-center">
        Made with care. No data collected. No account required.
      </p>
    </div>
  );
}
