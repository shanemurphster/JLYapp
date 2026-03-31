/**
 * POST /api/subscribe
 *
 * Receives a PushSubscription object from the browser and stores it in Redis.
 * Called by NotificationToggle after the user grants notification permission.
 *
 * The endpoint URL is used as the unique key — re-subscribing from the same
 * device updates the stored subscription in place.
 */

import { NextRequest, NextResponse } from "next/server";
import { getRedis, SUBSCRIPTIONS_KEY } from "@/lib/redis";

interface PushSubscriptionBody {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function POST(req: NextRequest) {
  let body: PushSubscriptionBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body?.endpoint !== "string" ||
    typeof body?.keys?.p256dh !== "string" ||
    typeof body?.keys?.auth !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid push subscription object" },
      { status: 400 }
    );
  }

  try {
    const redis = getRedis();
    // Use the endpoint as a unique field key (base64url so it's a clean Redis field name)
    const field = Buffer.from(body.endpoint).toString("base64url");
    await redis.hset(SUBSCRIPTIONS_KEY, { [field]: JSON.stringify(body) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Redis error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
