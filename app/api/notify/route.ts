/**
 * GET /api/notify
 *
 * Sends today's daily push notification to all stored subscribers.
 * Called automatically by Vercel Cron (see vercel.json).
 *
 * Vercel Cron attaches  Authorization: Bearer <CRON_SECRET>  to every request.
 * This endpoint rejects anything without that header.
 *
 * Required environment variables (must be set in Vercel project settings):
 *   CRON_SECRET
 *   NEXT_PUBLIC_VAPID_KEY
 *   NEXT_PRIVATE_VAPID_KEY
 *   VAPID_SUBJECT
 *   KV_REST_API_URL   (or UPSTASH_REDIS_REST_URL)
 *   KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_TOKEN)
 */

import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getRedis, SUBSCRIPTIONS_KEY } from "@/lib/redis";
import { getTodayEntry } from "@/lib/getTodayEntry";

function initVapid() {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
  const privateKey = process.env.NEXT_PRIVATE_VAPID_KEY;

  if (!subject || !publicKey || !privateKey) {
    throw new Error(
      "Missing VAPID config. Need VAPID_SUBJECT, NEXT_PUBLIC_VAPID_KEY, NEXT_PRIVATE_VAPID_KEY."
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function GET(req: NextRequest) {
  // --- Auth ---
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!cronSecret) {
    console.error("[notify] CRON_SECRET is not set — request rejected");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    console.error("[notify] Authorization header mismatch — request rejected");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("[notify] Auth passed");

  // --- VAPID ---
  try {
    initVapid();
  } catch (err) {
    console.error("[notify] VAPID init failed:", err);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // --- Today's content ---
  const entry = getTodayEntry();
  const payload = JSON.stringify({
    title: "Daily Grace",
    body: entry.shortMessage,
  });
  console.log("[notify] Payload ready, verseRef:", entry.verseReference);

  // --- Load subscriptions ---
  let allSubs: Record<string, string> | null = null;
  try {
    const redis = getRedis();
    allSubs = await redis.hgetall<Record<string, string>>(SUBSCRIPTIONS_KEY);
  } catch (err) {
    console.error("[notify] Redis read failed:", err);
    return NextResponse.json({ error: "Redis error" }, { status: 500 });
  }

  const subCount = allSubs ? Object.keys(allSubs).length : 0;
  console.log(`[notify] Subscriptions loaded: ${subCount}`);

  if (subCount === 0) {
    console.log("[notify] No subscriptions — nothing to send");
    return NextResponse.json({ sent: 0, removed: 0 });
  }

  // --- Send ---
  const fields = Object.keys(allSubs!);
  let sent = 0;
  let failed = 0;
  const expiredFields: string[] = [];

  await Promise.allSettled(
    fields.map(async (field) => {
      try {
        const raw = allSubs![field];
        const subscription = typeof raw === "string" ? JSON.parse(raw) : raw;
        await webpush.sendNotification(subscription, payload);
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          expiredFields.push(field);
        } else {
          failed++;
          console.warn("[notify] Push failed, statusCode:", status);
        }
      }
    })
  );

  // --- Clean up expired ---
  if (expiredFields.length > 0) {
    try {
      const redis = getRedis();
      await redis.hdel(SUBSCRIPTIONS_KEY, ...expiredFields);
    } catch (err) {
      console.warn("[notify] Failed to clean expired subscriptions:", err);
    }
  }

  console.log(
    `[notify] Done — sent: ${sent}, failed: ${failed}, expired/removed: ${expiredFields.length}`
  );
  return NextResponse.json({ sent, failed, removed: expiredFields.length });
}
