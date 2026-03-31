# Daily Grace

A mobile-first daily devotional web app. One encouraging message, one Bible verse, one reflection, one small action — every day.

No accounts. No feed. No clutter. Open it and go.

---

## Running the project

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

**To test on your iPhone over local network:**
1. Find your machine's local IP: `ipconfig getifaddr en0` (Mac) or check Network Settings (Windows)
2. Visit `http://YOUR_IP:3000` in Safari on your iPhone
3. Test "Add to Home Screen" from Safari's Share sheet

---

## Project structure

```
daily-grace/
├── app/
│   ├── layout.tsx              # App shell: meta tags, BottomNav, SW registrar
│   ├── globals.css             # Tailwind base + iPhone-specific resets
│   ├── page.tsx                # Home / Today — the core experience
│   ├── manifest.ts             # PWA manifest (auto-generates /manifest.webmanifest)
│   ├── icon.tsx                # Favicon (auto-generates <link rel="icon">)
│   ├── apple-icon.tsx          # Home Screen icon (auto-generates apple-touch-icon)
│   ├── icons/
│   │   ├── icon-192/route.tsx  # 192×192 PNG for PWA manifest
│   │   └── icon-512/route.tsx  # 512×512 PNG for PWA manifest
│   ├── settings/page.tsx       # Reminders + Home Screen install guide
│   └── about/page.tsx          # Mission + support placeholder
│
├── components/
│   ├── DailyCard.tsx           # Composes all card sections
│   ├── VerseBlock.tsx          # Scripture quote with gold border
│   ├── ReflectionBlock.tsx     # 1–3 sentence reflection
│   ├── ActionBlock.tsx         # "Today" action panel
│   ├── SaintFooter.tsx         # Optional saint/feast note
│   ├── BottomNav.tsx           # iOS-style tab bar (client component)
│   ├── StreakBadge.tsx         # Local streak display (client component)
│   ├── NotificationToggle.tsx  # Notification permission UI (client component)
│   └── ServiceWorkerRegistrar  # SW registration side-effect (client component)
│
├── data/
│   └── dailyEntries.csv        # Content source — add entries here
│
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   ├── parseEntries.ts         # CSV parser + loader (server-only)
│   ├── getTodayEntry.ts        # Day-of-year → entry lookup
│   ├── streak.ts               # Local streak logic (localStorage)
│   └── notifications.ts        # Push notification utilities (client-only)
│
└── public/
    └── sw.js                   # Service worker (caching + push handler)
```

---

## CSV content system

All daily content lives in `data/dailyEntries.csv`. This is the only file you need to edit to add, change, or remove content.

### Column order

```
id, shortMessage, verseReference, verseText, reflection, action, optionalSaintOrFeast
```

### Rules

- All text fields must be wrapped in double quotes: `"Your text here"`
- If your text contains a `"` character, escape it as `""` (two double quotes)
- `optionalSaintOrFeast` can be left as `""` (empty string = no saint note shown)
- The `id` field is a plain integer — no quotes needed

### Example row

```csv
31,"God's grace is enough.","2 Corinthians 9:8","And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work.","Grace is not scarce. You are not rationed a small amount and told to make it last. It pours out freely.","Write down one way grace showed up in your life this week.",""
```

### How the content rotates

`lib/getTodayEntry.ts` computes the day-of-year (1–366) and selects `entries[(dayOfYear - 1) % entries.length]`. With 30 entries the cycle repeats roughly every month. With 365 entries it rotates exactly once per year.

To swap in a CMS later: replace the implementation inside `getTodayEntry.ts`. The call signature stays the same.

---

## Streak tracking

Streaks are stored in `localStorage` under the key `daily-grace-streak`. They are:

- **Device-local only** — not synced, not backed up
- **Silently reset** if the user clears their browser data
- **Per-browser** — Safari on iPhone and Chrome on desktop track separately

The streak badge appears below the card only when the streak is 2 or more days, so first-time users don't see it.

---

## PWA and iPhone installability

### How it works

- `app/manifest.ts` generates `/manifest.webmanifest` — enables Chrome/Android install
- `app/apple-icon.tsx` generates the home screen icon at 180×180px
- `apple-mobile-web-app-capable: yes` enables standalone (full-screen) mode on iOS
- `public/sw.js` caches pages offline and handles push events

### iOS specifics

| Feature | Status |
|---|---|
| Add to Home Screen | Works — use Safari Share sheet |
| Full-screen standalone mode | Works on iOS 12+ |
| Offline support | Works — SW caches pages |
| Push notifications | iOS 16.4+ **and** installed to Home Screen required |
| Scheduled notifications (no backend) | Not possible — see below |

### iPhone installation steps (for testing)

1. Open `http://YOUR_LOCAL_IP:3000` in Safari on your iPhone
2. Tap the Share icon → **Add to Home Screen**
3. Tap **Add**
4. Open the app from your Home Screen — it now runs in standalone mode

---

## Push notifications

### How it works end-to-end

1. User taps "Enable reminders" in Settings
2. Browser requests `Notification` permission
3. Browser creates a `PushSubscription` (encrypted endpoint tied to this device)
4. App POSTs the subscription to `POST /api/subscribe` → stored in Upstash Redis
5. Every day at 8 AM ET, Vercel Cron calls `GET /api/notify`
6. `/api/notify` reads all subscriptions from Redis, sends each a Web Push message via `web-push`
7. The service worker receives the push event, shows the notification
8. User taps the notification → app opens to today's card

### Setting up for production (Vercel)

**Step 1 — Create a Redis database**
1. Go to your Vercel project → Storage → Browse Marketplace
2. Add **Upstash Redis** (free tier is sufficient)
3. Vercel automatically adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your project env vars

**Step 2 — Set environment variables in Vercel**

In your Vercel project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_VAPID_KEY` | your public VAPID key (already in `.env.local`) |
| `NEXT_PRIVATE_VAPID_KEY` | your private VAPID key (already in `.env.local`) |
| `VAPID_SUBJECT` | `mailto:your@email.com` — required by the Web Push spec |
| `CRON_SECRET` | a strong random secret — Vercel may auto-generate this |

**Step 3 — Deploy**

```bash
vercel --prod
```

Vercel reads `vercel.json` and sets up the cron job automatically. It fires `GET /api/notify` every day at 13:00 UTC (8 AM ET).

**Changing the notification time**

Edit the `schedule` in `vercel.json`. Uses standard cron syntax (UTC):
```json
"schedule": "0 13 * * *"   // 8 AM Eastern (EST) / 9 AM Eastern (EDT)
"schedule": "0 14 * * *"   // 9 AM Eastern (EST) / 10 AM Eastern (EDT)
```

### Testing notifications locally

You can trigger a test notification manually:

```bash
curl -X GET http://localhost:3000/api/notify \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace `YOUR_CRON_SECRET` with the value from your `.env.local`.

### iPhone limitation

Web Push on iPhone requires:
- iOS 16.4 or later
- The app **must** be installed to the Home Screen (regular Safari tabs cannot receive push)
- The user must grant permission from inside the installed app

### What works now vs. what needs Vercel

| Feature | Works locally | Works on Vercel |
|---|---|---|
| Offline caching | Yes | Yes |
| Add to Home Screen | Yes (over local network) | Yes |
| Notification permission request | Yes | Yes |
| Subscription saved to Redis | No (no Redis locally) | Yes |
| Daily push delivery | No | Yes |

---

## Testing

```bash
# Dev server
npm run dev

# Production build check
npm run build
npm start
```

To test a specific date's entry:
```typescript
import { getEntryForDate } from "@/lib/getTodayEntry";
const entry = getEntryForDate(new Date("2024-12-25")); // Christmas
```
