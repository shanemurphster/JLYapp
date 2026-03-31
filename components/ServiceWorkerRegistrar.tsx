"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for offline caching and push notifications.
 * Renders nothing — side-effects only.
 * Included once in the root layout.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.warn("Service worker registration failed:", err));
    }
  }, []);

  return null;
}
