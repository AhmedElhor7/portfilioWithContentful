/**
 * Absolute URL of the deployed site, used for canonical links and Open Graph
 * metadata. Returns `null` when the deployment URL is not configured so that
 * no placeholder (such as localhost) is ever published.
 */
export function getSiteUrl(): URL | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}
