"use client";

import { useEffect, useState } from "react";
import {
  isPushSupported,
  getPermissionState,
  isSubscriptionSaved,
  requestPermission,
  subscribeToPush,
  saveSubscriptionToServer,
} from "@/lib/notifications";

type UIState =
  | "loading"       // SSR / before useEffect
  | "unsupported"   // not in standalone mode or browser doesn't support push
  | "subscribed"    // permission granted + subscription saved to server
  | "granted_only"  // permission granted but subscription couldn't be saved
  | "prompt"        // permission not yet asked
  | "requesting"    // mid-request
  | "denied";       // user blocked notifications

export default function NotificationToggle() {
  const [state, setState] = useState<UIState>("loading");

  useEffect(() => {
    if (!isPushSupported()) {
      setState("unsupported");
      return;
    }
    const perm = getPermissionState();
    if (perm === "denied") { setState("denied"); return; }
    if (perm === "granted") {
      setState(isSubscriptionSaved() ? "subscribed" : "granted_only");
      return;
    }
    setState("prompt");
  }, []);

  async function handleEnable() {
    setState("requesting");

    const perm = await requestPermission();
    if (perm !== "granted") { setState(perm === "denied" ? "denied" : "prompt"); return; }

    const subscription = await subscribeToPush();
    if (!subscription) { setState("granted_only"); return; }

    const saved = await saveSubscriptionToServer(subscription);
    setState(saved ? "subscribed" : "granted_only");
  }

  if (state === "loading") return null;

  if (state === "unsupported") {
    return (
      <Panel>
        <Label>Daily reminder</Label>
        <Body>
          To receive daily reminders, add Daily Grace to your Home Screen first,
          then reopen the app from there.
        </Body>
      </Panel>
    );
  }

  if (state === "subscribed") {
    return (
      <Panel>
        <div className="flex items-center justify-between">
          <div>
            <Label>Daily reminder</Label>
            <Sub>Active — 8 AM each morning</Sub>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-grace-sage" />
        </div>
        <Divider />
        <Body>
          You&apos;re all set. You&apos;ll receive one quiet reminder each morning.
        </Body>
      </Panel>
    );
  }

  if (state === "granted_only") {
    return (
      <Panel>
        <div className="flex items-center justify-between">
          <div>
            <Label>Daily reminder</Label>
            <Sub>Permission granted</Sub>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-grace-gold-light" />
        </div>
        <Divider />
        <Body>
          Your device is ready. Reminders will activate automatically — no
          further action needed.
        </Body>
      </Panel>
    );
  }

  if (state === "denied") {
    return (
      <Panel>
        <Label>Daily reminder</Label>
        <Body>
          Notifications are blocked. To enable them, go to{" "}
          <strong className="text-grace-text">Settings → Daily Grace → Notifications</strong>{" "}
          and tap Allow.
        </Body>
      </Panel>
    );
  }

  // "prompt" or "requesting"
  return (
    <Panel>
      <Label>Daily reminder</Label>
      <Body>
        Allow Daily Grace to send you one gentle reminder each morning.
      </Body>
      <button
        onClick={handleEnable}
        disabled={state === "requesting"}
        className="mt-1 w-full bg-grace-gold text-white font-sans text-sm font-medium
                   py-3 rounded-xl active:opacity-75 disabled:opacity-50 transition-opacity"
      >
        {state === "requesting" ? "Setting up…" : "Enable reminders"}
      </button>
    </Panel>
  );
}

// Small layout helpers to avoid repetition
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-grace-warm rounded-2xl px-5 py-4 flex flex-col gap-3">
      {children}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-sm text-grace-text font-medium">{children}</p>;
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-xs text-grace-muted mt-0.5">{children}</p>;
}
function Body({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-sm leading-relaxed text-grace-muted">{children}</p>;
}
function Divider() {
  return <hr className="border-grace-gold-light" />;
}
