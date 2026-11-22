import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/**
 * @description Allows crawlers everywhere except the API routes, which have
 * no content worth indexing. Only points crawlers at the sitemap when the
 * deployment URL is configured, so an unconfigured deployment never
 * advertises a placeholder host.
 * @returns The robots rules for this site.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    ...(siteUrl ? { sitemap: new URL("/sitemap.xml", siteUrl).toString() } : {}),
  };
}
