import { readingTime } from "@/lib/format";
import { getClient, POST_CONTENT_TYPE, type PostSkeleton } from "./client";
import { normalizeAuthor, normalizeImage, asDocument, asTags, type Post } from "./types";

type RawEntry = {
  sys?: { id?: string; createdAt?: string };
  fields?: Record<string, unknown>;
};

function normalizePost(entry: unknown): Post | null {
  const raw = entry as RawEntry;
  const fields = raw?.fields;

  if (!fields) return null;

  const slug = typeof fields.slug === "string" ? fields.slug : "";
  if (!slug) return null;

  const title = typeof fields.title === "string" ? fields.title : "Untitled";
  const excerpt = typeof fields.excerpt === "string" ? fields.excerpt : "";
  const body = asDocument(fields.body ?? fields.content);

  return {
    id: raw?.sys?.id ?? slug,
    title,
    slug,
    excerpt,
    body,
    coverImage: normalizeImage(fields.coverImage, title),
    author: normalizeAuthor(fields.author),
    date:
      (typeof fields.date === "string" && fields.date) ||
      raw?.sys?.createdAt ||
      new Date(0).toISOString(),
    tags: asTags(fields.tags),
    featured: fields.featured === true,
    readingMinutes: readingTime(
      `${excerpt} ${body ? JSON.stringify(body.data ?? {}) : ""}`,
    ),
  };
}

export async function getPosts(options?: { limit?: number }): Promise<Post[]> {
  const client = getClient();
  if (!client) return [];

  try {
    const response = await client.getEntries<PostSkeleton>({
      content_type: POST_CONTENT_TYPE,
      include: 2,
      order: ["-fields.date"],
      ...(options?.limit ? { limit: options.limit } : {}),
    });

    return response.items
      .map((item) => normalizePost(item))
      .filter((post): post is Post => post !== null);
  } catch (error) {
    console.error("[contentful] Failed to fetch posts:", error);
    return [];
  }
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await getPosts();
  const featured = posts.filter((post) => post.featured);
  return (featured.length > 0 ? featured : posts).slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.getEntries<PostSkeleton>({
      content_type: POST_CONTENT_TYPE,
      "fields.slug": slug,
      include: 2,
      limit: 1,
    });

    const entry = response.items[0];
    return entry ? normalizePost(entry) : null;
  } catch (error) {
    console.error(`[contentful] Failed to fetch post "${slug}":`, error);
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const client = getClient();
  if (!client) return [];

  try {
    const response = await client.getEntries<PostSkeleton>({
      content_type: POST_CONTENT_TYPE,
      select: ["fields.slug"],
      limit: 1000,
    });

    return response.items
      .map((item) => (item as RawEntry).fields?.slug)
      .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  } catch (error) {
    console.error("[contentful] Failed to fetch post slugs:", error);
    return [];
  }
}

export async function getRelatedPosts(current: Post, limit = 3): Promise<Post[]> {
  const posts = await getPosts();
  return posts
    .filter((post) => post.slug !== current.slug)
    .sort((a, b) => {
      const aScore = a.tags.filter((tag) => current.tags.includes(tag)).length;
      const bScore = b.tags.filter((tag) => current.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
}
