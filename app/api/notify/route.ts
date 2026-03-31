/**
 * GET /api/notify
 *
 * Sends today's daily push notification to all stored subscribers.
 * Called automatically by Vercel Cron (see vercel.json).
 *
 * Security: Vercel Cron attaches  Authorization: Bearer <CRON_SECRET>
 * to every request. This endpoint rejects anything without that header.
 *
 * Required environment variables:
 *   CRON_SECRET            — auto-set by Vercel, or add it manually
 *   NEXT_PUBLIC_VAPID_KEY  — your VAPID public key
 *   NEXT_PRIVATE_VAPID_KEY — your VAPID private key
 *   VAPID_SUBJECT          — mailto:you@example.com  (required by spec)
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
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
      "Missing VAPID config. Set VAPID_SUBJECT, NEXT_PUBLIC_VAPID_KEY, and NEXT_PRIVATE_VAPID_KEY."
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron (or an authorised caller)
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    initVapid();
  } catch (err) {
    console.error("[notify] VAPID init failed:", err);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Build today's notification payload
  const entry = getTodayEntry();
  const payload = JSON.stringify({
    title: "Daily Grace",
    body: entry.shortMessage,
  });

  // Load all subscriptions from Redis
  const redis = getRedis();
  const allSubs = await redis.hgetall<Record<string, string>>(SUBSCRIPTIONS_KEY);

  if (!allSubs || Object.keys(allSubs).length === 0) {
    return NextResponse.json({ sent: 0, removed: 0 });
  }

  const fields = Object.keys(allSubs);
  let sent = 0;
  const expiredFields: string[] = [];

  await Promise.allSettled(
    fields.map(async (field) => {
      const subscription = JSON.parse(allSubs[field]);

      try {
        await webpush.sendNotification(subscription, payload);
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          // 410 Gone = user unsubscribed; 404 = endpoint no longer exists
          expiredFields.push(field);
        } else {
          console.warn("[notify] Push failed for one subscription:", status, err);
        }
      }
    })
  );

  // Clean up expired subscriptions
  if (expiredFields.length > 0) {
    await redis.hdel(SUBSCRIPTIONS_KEY, ...expiredFields);
  }

  console.log(`[notify] Sent: ${sent}, Removed: ${expiredFields.length}`);
  return NextResponse.json({ sent, removed: expiredFields.length });
}
