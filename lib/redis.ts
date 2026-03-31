/**
 * Shared Redis client for API routes.
 * Uses Upstash Redis REST API — the same service Vercel's storage
 * marketplace connects to.
 *
 * Required environment variables (set in Vercel project settings):
 *   UPSTASH_REDIS_REST_URL   — from Upstash console or Vercel integration
 *   UPSTASH_REDIS_REST_TOKEN — from Upstash console or Vercel integration
 */

import { Redis } from "@upstash/redis";

// Module-level singleton — reused across warm serverless invocations
let _client: Redis | null = null;

export function getRedis(): Redis {
  if (!_client) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "Missing Redis credentials. " +
          "Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN " +
          "to your .env.local and Vercel project settings."
      );
    }

    _client = new Redis({ url, token });
  }
  return _client;
}

// Key used to store all push subscriptions as a Redis hash
// hash field = base64url(endpoint)  →  value = JSON string of PushSubscription
export const SUBSCRIPTIONS_KEY = "dg:subscriptions";
