import NotificationToggle from "@/components/NotificationToggle";

// iOS Safari Share icon — matches the system glyph closely
function ShareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block align-[-3px] mx-0.5"
      aria-hidden="true"
    >
      <path d="M8 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <polyline points="16 3 12 7 8 3" />
      <line x1="12" y1="3" x2="12" y2="14" />
    </svg>
  );
}

const steps = [
  <>Tap the Share button <ShareIcon /> at the bottom of the screen.</>,
  <>Scroll down and tap <strong className="text-grace-text">&#8220;Add to Home Screen.&#8221;</strong></>,
  <>Tap <strong className="text-grace-text">Add.</strong> Done.</>,
];

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
          {steps.map((content, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-grace-gold-light text-grace-brown-deep
                               text-xs font-sans font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="font-sans text-sm leading-relaxed text-grace-text-soft">{content}</p>
            </li>
          ))}
        </ol>

        <p className="font-sans text-xs text-grace-muted">
          Requires iOS 16.4 or later for reminders.
        </p>
      </section>

      <hr className="border-grace-gold-light" />

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
