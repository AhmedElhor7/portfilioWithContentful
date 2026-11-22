import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/**
 * @description Minimal sitemap for this single-page portfolio. Returns no
 * entries when the deployment URL is not configured, matching the rule
 * `getSiteUrl` already follows elsewhere: never publish a placeholder host
 * (such as `localhost`).
 * @returns The sitemap entries, or an empty list when the site URL is unset.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  return [
    {
      url: siteUrl.toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
