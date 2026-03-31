/**
 * Daily Grace Service Worker
 *
 * Responsibilities:
 * 1. Cache app shell for offline use
 * 2. Handle incoming Web Push notifications
 * 3. Handle notification clicks (open the app)
 *
 * Caching strategy:
 * - Network-first for HTML navigation (ensures fresh daily content)
 * - Cache-first for static assets (JS, CSS, icons)
 */

const CACHE_NAME = "daily-grace-v1";

const PRECACHE_URLS = [
  "/",
  "/about",
  "/settings",
];

// ---------------------------------------------------------------------------
// Install — precache core pages
// ---------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ---------------------------------------------------------------------------
// Activate — clean up old caches
// ---------------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ---------------------------------------------------------------------------
// Fetch — network-first for navigation, cache-first for assets
// ---------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Navigation requests (HTML pages): network-first so the daily content is fresh
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update the cache with the fresh page
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// ---------------------------------------------------------------------------
// Push — show a notification when the server sends one
// ---------------------------------------------------------------------------
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data?.text() ?? "" };
  }

  const title = data.title || "Daily Grace";
  const options = {
    body: data.body || "Your daily word is ready.",
    icon: "/icons/icon-192",
    badge: "/icons/icon-192",
    tag: "daily-grace-reminder", // replaces any existing notification
    renotify: false,
    data: { url: "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ---------------------------------------------------------------------------
// Notification click — open or focus the app
// ---------------------------------------------------------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If the app is already open, focus it
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
