import { createClient, type ContentfulClientApi } from "contentful";
import type { EntryFieldTypes, EntrySkeletonType } from "contentful";

export const AUTHOR_CONTENT_TYPE = "author";
export const POST_CONTENT_TYPE = "post";

export type AuthorSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    role: EntryFieldTypes.Symbol;
    bio: EntryFieldTypes.Text;
    picture: EntryFieldTypes.AssetLink;
  },
  typeof AUTHOR_CONTENT_TYPE
>;

export type PostSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    excerpt: EntryFieldTypes.Text;
    /** Contentful's default rich-text field id is `content`; `body` is also accepted. */
    content: EntryFieldTypes.RichText;
    body: EntryFieldTypes.RichText;
    coverImage: EntryFieldTypes.AssetLink;
    author: EntryFieldTypes.EntryLink<AuthorSkeleton>;
    date: EntryFieldTypes.Date;
    tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    featured: EntryFieldTypes.Boolean;
  },
  typeof POST_CONTENT_TYPE
>;

let cachedClient: ContentfulClientApi<undefined> | null | undefined;

function getCredentials() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!space || !accessToken) return null;

  return { space, accessToken };
}

export function getClient(): ContentfulClientApi<undefined> | null {
  if (cachedClient !== undefined) return cachedClient;

  const credentials = getCredentials();

  if (!credentials) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[contentful] CONTENTFUL_SPACE_ID / CONTENTFUL_ACCESS_TOKEN are not set. Falling back to empty content.",
      );
    }
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient({
    space: credentials.space,
    accessToken: credentials.accessToken,
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
  });

  return cachedClient;
}
