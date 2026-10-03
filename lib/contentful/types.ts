import type { Document } from "@contentful/rich-text-types";

export type ImageAsset = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type Author = {
  name: string;
  role: string;
  bio: string;
  picture: ImageAsset | null;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: Document | null;
  coverImage: ImageAsset | null;
  author: Author;
  date: string;
  tags: string[];
  featured: boolean;
  readingMinutes: number;
};

export type UnresolvedLink = {
  sys: {
    type: string;
    linkType?: string;
    id?: string;
  };
};

export function isResolvedLink(value: unknown): value is { fields?: unknown; sys?: unknown } {
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

export function normalizeAuthor(value: unknown): Author {
  if (!isResolvedLink(value)) {
    return { name: "Anonymous", role: "", bio: "", picture: null };
  }

  const fields = asRecord(asRecord(value)?.fields);
  if (!fields) {
    return { name: "Anonymous", role: "", bio: "", picture: null };
  }

  const name = asString(fields.name, "Anonymous");

  return {
    name,
    role: asString(fields.role),
    bio: asString(fields.bio),
    picture: normalizeImage(fields.picture, name),
  };
}

export function asDocument(value: unknown): Document | null {
  if (!value || typeof value !== "object") return null;
  const nodeType = (value as { nodeType?: string }).nodeType;
  return nodeType === "document" ? (value as Document) : null;
}

export function asTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0);
}
