import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "./robots";

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows crawlers but disallows the API routes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(result.sitemap).toBeUndefined();
  });

  it("points crawlers at the sitemap when the site URL is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const result = robots();

    expect(result.sitemap).toBe("https://example.com/sitemap.xml");
  });
});
