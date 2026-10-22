import { createClient, type ContentfulClientApi } from "contentful";
import type { EntryFieldTypes, EntrySkeletonType } from "contentful";

export const SITE_SETTINGS_CONTENT_TYPE = "siteSettings";
export const HERO_SECTION_CONTENT_TYPE = "heroSection";
export const ABOUT_SECTION_CONTENT_TYPE = "aboutSection";
export const CONTACT_SECTION_CONTENT_TYPE = "contactSection";
export const PROJECT_CONTENT_TYPE = "project";

export type SiteSettingsSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    siteName: EntryFieldTypes.Symbol;
    professionalTitle: EntryFieldTypes.Symbol;
    siteDescription: EntryFieldTypes.Text;
    location: EntryFieldTypes.Symbol;
    contactEmail: EntryFieldTypes.Symbol;
    gitHubUrl: EntryFieldTypes.Symbol;
    linkedInUrl: EntryFieldTypes.Symbol;
    availabilityMessage: EntryFieldTypes.Symbol;
    isAvailable: EntryFieldTypes.Boolean;
    profileImage: EntryFieldTypes.AssetLink;
    ogImage: EntryFieldTypes.AssetLink;
  },
  typeof SITE_SETTINGS_CONTENT_TYPE
>;

export type HeroSectionSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    heroHeadline: EntryFieldTypes.Symbol;
    heroIntroduction: EntryFieldTypes.Text;
    primaryButtonLabel: EntryFieldTypes.Symbol;
    primaryButtonUrl: EntryFieldTypes.Symbol;
    secondaryButtonLabel: EntryFieldTypes.Symbol;
    secondaryButtonUrl: EntryFieldTypes.Symbol;
  },
  typeof HERO_SECTION_CONTENT_TYPE
>;

export type AboutSectionSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    aboutHeading: EntryFieldTypes.Symbol;
    aboutDescription: EntryFieldTypes.Text;
  },
  typeof ABOUT_SECTION_CONTENT_TYPE
>;

export type ContactSectionSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    contactHeading: EntryFieldTypes.Symbol;
    contactMessage: EntryFieldTypes.Text;
  },
  typeof CONTACT_SECTION_CONTENT_TYPE
>;

export type ProjectSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    technologies: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    demoUrl: EntryFieldTypes.Symbol;
    repositoryUrl: EntryFieldTypes.Symbol;
    coverImage: EntryFieldTypes.AssetLink;
    featured: EntryFieldTypes.Boolean;
    displayOrder: EntryFieldTypes.Integer;
  },
  typeof PROJECT_CONTENT_TYPE
>;

let cachedClient: ContentfulClientApi<undefined> | null | undefined;

function getCredentials() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!space || !accessToken) return null;

  return { space, accessToken };
}

/**
 * @description Returns the shared Contentful delivery client.
 * Credentials stay on the server: they are read from non-public environment
 * variables and the client is created at most once per process.
 * @returns The client, or `null` when the environment is not configured.
 */
export function getClient(): ContentfulClientApi<undefined> | null {
  if (cachedClient !== undefined) return cachedClient;

  const credentials = getCredentials();

  if (!credentials) {
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
