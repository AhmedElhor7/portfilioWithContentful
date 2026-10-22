/**
 * @description Normalized Contentful asset, sized for `next/image`-free rendering.
 */
export type ImageAsset = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * @description Normalized `siteSettings` entry.
 * URLs are `null` when the field is empty or not an absolute http(s) URL so
 * that links are never rendered in a broken state.
 */
export type SiteSettings = {
  id: string;
  name: string;
  siteName: string;
  professionalTitle: string;
  siteDescription: string;
  location: string;
  contactEmail: string;
  gitHubUrl: string | null;
  linkedInUrl: string | null;
  availabilityMessage: string;
  isAvailable: boolean;
  profileImage: ImageAsset | null;
  ogImage: ImageAsset | null;
};

export type HeroSection = {
  id: string;
  name: string;
  headline: string;
  introduction: string;
  primaryButtonLabel: string;
  primaryButtonUrl: string | null;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string | null;
};

/**
 * @description Hero copy after fallbacks have been applied, ready for rendering.
 */
export type ResolvedHero = {
  headline: string;
  introduction: string;
  primaryButtonLabel: string;
  primaryButtonUrl: string | null;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string | null;
};

export type AboutSection = {
  id: string;
  name: string;
  heading: string;
  description: string;
};

export type ContactSection = {
  id: string;
  name: string;
  heading: string;
  message: string;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  technologies: string[];
  demoUrl: string | null;
  repositoryUrl: string | null;
  coverImage: ImageAsset | null;
  featured: boolean;
  displayOrder: number | null;
};

function isResolvedLink(value: unknown): value is { fields?: unknown; sys?: unknown } {
  if (!value || typeof value !== "object") return false;
  const sys = (value as { sys?: { type?: string } }).sys;
  return sys?.type !== "Link";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

/**
 * @description Reads a Contentful asset link into a plain image descriptor.
 * @param value Raw field value from the delivery API (resolved with `include`).
 * @param fallbackAlt Alternative text used when the asset has no title or description.
 * @returns The normalized asset, or `null` when the field is empty or unresolved.
 */
export function normalizeImage(value: unknown, fallbackAlt = ""): ImageAsset | null {
  if (!isResolvedLink(value)) return null;

  const entry = asRecord(value);
  if (!entry) return null;

  const fields = asRecord(entry.fields);
  if (!fields) return null;

  const file = asRecord(fields.file);
  if (!file) return null;

  const rawUrl = asString(file.url);
  if (!rawUrl) return null;

  const details = asRecord(file.details);
  const dimensions = details ? asRecord(details.image) : null;

  return {
    url: rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl,
    width: dimensions ? Number(dimensions.width ?? 0) || 1600 : 1600,
    height: dimensions ? Number(dimensions.height ?? 0) || 1000 : 1000,
    alt: asString(fields.title) || asString(fields.description) || fallbackAlt,
  };
}

/**
 * @description Normalizes Contentful `Array<Symbol>` fields such as project technologies.
 * @param value Raw field value from the delivery API.
 * @returns Trimmed, non-empty strings in their original order.
 */
export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * @description Keeps only absolute http(s) URLs; anything else is treated as missing.
 * @param value Raw URL field from the delivery API.
 * @returns The normalized absolute URL, or `null`.
 */
export function asExternalUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * @description Keeps only in-page anchors (e.g. `#work`) or absolute http(s) URLs.
 * @param value Raw link field from the delivery API.
 * @returns The normalized anchor/URL, or `null`.
 */
export function asLinkTarget(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("#")) return trimmed;

  return asExternalUrl(trimmed);
}
