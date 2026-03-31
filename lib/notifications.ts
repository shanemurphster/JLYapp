/**
 * Client-side notification utilities.
 * Must only be called from client components (browser environment).
 *
 * iPhone reality (iOS 16.4+):
 * - Push works ONLY when the app is installed to the Home Screen
 * - Regular Safari browser tabs do NOT receive push on iOS
 */

const SUB_SAVED_KEY = "daily-grace-subscribed";

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function getPermissionState(): NotificationPermission | null {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  return Notification.permission;
}

/** Whether we've already saved a subscription to the server this browser session. */
export function isSubscriptionSaved(): boolean {
  try {
    return localStorage.getItem(SUB_SAVED_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Request notification permission from the user.
 * Must be triggered by a direct user gesture (button tap).
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  return Notification.requestPermission();
}

/**
 * Get or create a Web Push subscription for this device.
 * Returns null if unsupported or if NEXT_PUBLIC_VAPID_KEY is not configured.
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY ?? "";
  if (!vapidKey) return null;

  try {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToArrayBuffer(vapidKey),
    });
  } catch (err) {
    console.warn("Daily Grace: push subscription failed:", err);
    return null;
  }
}

/**
 * POST the push subscription to /api/subscribe so the server can send
 * daily notifications to this device.
 */
export async function saveSubscriptionToServer(
  subscription: PushSubscription
): Promise<boolean> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
    if (res.ok) {
      localStorage.setItem(SUB_SAVED_KEY, "true");
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function urlBase64ToArrayBuffer(base64: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return buffer;
}
