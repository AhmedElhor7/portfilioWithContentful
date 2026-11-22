import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns no entries when the site URL is not configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

    expect(sitemap()).toEqual([]);
  });

  it("lists the homepage when the site URL is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");

    const entries = sitemap();

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ url: "https://example.com/", priority: 1 });
    expect(entries[0]?.lastModified).toBeInstanceOf(Date);
  });
});
