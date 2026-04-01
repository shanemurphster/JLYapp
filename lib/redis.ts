/**
 * Shared Redis client for API routes.
 *
 * Vercel's KV / Upstash Redis integration can produce different env var names
 * depending on how the database was created and which integration version is
 * in use. We try each known name in order and use the first one that is set.
 *
 * URL candidates (in priority order):
 *   KV_REST_API_URL          ← current Vercel KV / Upstash integration
 *   UPSTASH_REDIS_REST_URL   ← older Upstash direct integration
 *
 * Token candidates (in priority order):
 *   KV_REST_API_TOKEN        ← current Vercel KV / Upstash integration
 *   UPSTASH_REDIS_REST_TOKEN ← older Upstash direct integration
 */

import { Redis } from "@upstash/redis";

let _client: Redis | null = null;

export function getRedis(): Redis {
  if (!_client) {
    const url =
      process.env.KV_REST_API_URL ??
      process.env.UPSTASH_REDIS_REST_URL;

    const token =
      process.env.KV_REST_API_TOKEN ??
      process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "Redis credentials not found. " +
          "Set KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV integration) " +
          "or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in your " +
          ".env.local and Vercel project environment variables."
      );
    }

    _client = new Redis({ url, token });
  }
  return _client;
}

// Key used to store all push subscriptions as a Redis hash.
// hash field = base64url(endpoint)  →  value = JSON string of PushSubscription
export const SUBSCRIPTIONS_KEY = "dg:subscriptions";
