/**
 * POST /api/test-push
 *
 * Sends a single test push notification to one specific subscription.
 * Used for manual end-to-end testing — does NOT require Redis.
 *
 * Protected by TEST_PUSH_SECRET. Include this header with every request:
 *   Authorization: Bearer <TEST_PUSH_SECRET>
 *
 * Request body:
 *   { subscription: PushSubscription }
 *
 * The client sends its own current subscription, so you're pushing only
 * to your own device. Safe to leave deployed as long as the secret is set.
 *
 * Required env vars:
 *   NEXT_PUBLIC_TEST_PUSH_SECRET — must match what the client sends
 *   NEXT_PUBLIC_VAPID_KEY
 *   NEXT_PRIVATE_VAPID_KEY
 *   VAPID_SUBJECT
 */

import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

export async function POST(req: NextRequest) {
  // Auth — reads the same var name the client uses so only one env var is needed
  const secret = process.env.NEXT_PUBLIC_TEST_PUSH_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret) {
    console.error("[test-push] 401: NEXT_PUBLIC_TEST_PUSH_SECRET is not set on the server");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!authHeader) {
    console.error("[test-push] 401: no Authorization header received");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (authHeader !== `Bearer ${secret}`) {
    console.error("[test-push] 401: Authorization header present but does not match secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // VAPID setup
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
  const privateKey = process.env.NEXT_PRIVATE_VAPID_KEY;
  if (!subject || !publicKey || !privateKey) {
    return NextResponse.json(
      { error: "Missing VAPID config (VAPID_SUBJECT, NEXT_PUBLIC_VAPID_KEY, NEXT_PRIVATE_VAPID_KEY)" },
      { status: 500 }
    );
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  // Parse body
  let subscription: webpush.PushSubscription;
  try {
    const body = await req.json();
    subscription = body.subscription;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      throw new Error("Missing required subscription fields");
    }
  } catch {
    return NextResponse.json({ error: "Invalid subscription in request body" }, { status: 400 });
  }

  // Send the push
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Daily Grace",
        body: "This is your test notification. It works!",
      })
    );
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode;
    return NextResponse.json(
      { error: "Push failed", statusCode: status },
      { status: 500 }
    );
  }
}
