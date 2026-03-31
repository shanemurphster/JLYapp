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
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-muted">
          Support this project
        </p>
        <p className="font-sans text-base leading-relaxed text-grace-text-soft">
          Daily Grace is free and always will be. If it has been meaningful to
          you and you&apos;d like to help keep it going, a small contribution
          goes a long way.
        </p>
        <div className="bg-grace-warm rounded-2xl px-5 py-4 text-center">
          <p className="font-sans text-sm text-grace-muted">
            Donation link coming soon.
          </p>
        </div>
      </section>

      <hr className="border-grace-gold-light" />

      <p className="font-sans text-sm leading-relaxed text-grace-muted text-center">
        Made with care. No data collected. No account required.
      </p>
    </div>
  );
}
