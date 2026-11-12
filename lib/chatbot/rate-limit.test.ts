import { beforeEach, describe, expect, it } from "vitest";
import {
  CHAT_RATE_LIMIT,
  getClientKey,
  isRateLimited,
  resetRateLimits,
} from "./rate-limit";

describe("isRateLimited", () => {
  beforeEach(resetRateLimits);

  it("allows requests up to the limit and rejects the next one", () => {
    const now = 1_000;

    for (let index = 0; index < CHAT_RATE_LIMIT.maxRequests; index += 1) {
      expect(isRateLimited("visitor", now)).toBe(false);
    }

    expect(isRateLimited("visitor", now)).toBe(true);
  });

  it("uses separate buckets per client and resets after the window", () => {
    const now = 1_000;

    for (let index = 0; index < CHAT_RATE_LIMIT.maxRequests; index += 1) {
      isRateLimited("first", now);
    }

    expect(isRateLimited("second", now)).toBe(false);
    expect(isRateLimited("first", now + CHAT_RATE_LIMIT.windowMs + 1)).toBe(false);
  });
});

describe("getClientKey", () => {
  it("uses the first forwarded address", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" });

    expect(getClientKey(headers)).toBe("203.0.113.5");
  });

  it("falls back to a shared bucket", () => {
    expect(getClientKey(new Headers())).toBe("unknown");
  });
});
