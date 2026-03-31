import NotificationToggle from "@/components/NotificationToggle";

export default function InstallPage() {
  return (
    <div className="w-full max-w-md mx-auto px-6 pt-12 pb-4 flex flex-col gap-8">
      <header>
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-muted mb-1">
          Setup
        </p>
        <h1 className="font-serif text-2xl text-grace-text">Add to Home Screen</h1>
      </header>

      <section className="flex flex-col gap-4">
        <p className="font-sans text-sm leading-relaxed text-grace-text-soft">
          Install Daily Grace on your iPhone to use it like a real app — and to receive your daily reminder.
        </p>

        <ol className="flex flex-col gap-3">
          {[
            'Open this page in <strong>Safari</strong> on your iPhone.',
            'Tap the <strong>Share</strong> button at the bottom of the screen.',
            'Tap <strong>"Add to Home Screen."</strong>',
            'Tap <strong>Add.</strong> Done.',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-grace-gold-light text-grace-brown-deep
                               text-xs font-sans font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p
                className="font-sans text-sm leading-relaxed text-grace-text-soft"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </li>
          ))}
        </ol>

        <p className="font-sans text-xs text-grace-muted">
          Requires iOS 16.4 or later for reminders. The app works on all modern browsers,
          but Home Screen installation is iPhone-only.
        </p>
      </section>

      <hr className="border-grace-gold-light" />

      {/* Notification toggle — only meaningful once app is installed */}
      <section className="flex flex-col gap-3">
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-muted">
          Daily reminder
        </p>
        <NotificationToggle />
      </section>

      <hr className="border-grace-gold-light" />

      <section className="flex flex-col gap-2">
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-grace-muted">
          Privacy
        </p>
        <p className="font-sans text-sm leading-relaxed text-grace-muted">
          No account. No sign-up. No data collected. Reminders go to your device only.
        </p>
      </section>
    </div>
  );
}
