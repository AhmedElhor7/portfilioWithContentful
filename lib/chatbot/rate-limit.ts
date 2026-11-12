/** Best-effort per-instance rate limit for the chat endpoint. */
export const CHAT_RATE_LIMIT = {
  windowMs: 60_000,
  maxRequests: 12,
} as const;

const requestsByClient = new Map<string, number[]>();

/**
 * @description Reads the visitor's address from the proxy headers Vercel sets.
 * This is only used as a rate-limit bucket, never for authorization.
 * @param headers Incoming request headers.
 * @returns A stable bucket key.
 */
export function getClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const firstForwarded = forwarded?.split(",")[0]?.trim();

  if (firstForwarded) return firstForwarded;

  return headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * @description Records a request and reports whether the client exceeded the
 * window. Serverless instances each keep their own map, so this is a useful
 * first line of defence rather than a global quota.
 * @param clientKey The visitor bucket.
 * @param now Current timestamp in milliseconds.
 * @returns `true` when the request should be rejected with 429.
 */
export function isRateLimited(clientKey: string, now = Date.now()): boolean {
  const windowStart = now - CHAT_RATE_LIMIT.windowMs;
  const recent = (requestsByClient.get(clientKey) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recent.length >= CHAT_RATE_LIMIT.maxRequests) {
    requestsByClient.set(clientKey, recent);
    return true;
  }

  recent.push(now);
  requestsByClient.set(clientKey, recent);

  if (requestsByClient.size > 500) {
    for (const [key, timestamps] of requestsByClient) {
      if (timestamps.every((timestamp) => timestamp <= windowStart)) {
        requestsByClient.delete(key);
      }
    }
  }

  return false;
}

/** Clears the in-memory buckets. Intended for tests. */
export function resetRateLimits(): void {
  requestsByClient.clear();
}
