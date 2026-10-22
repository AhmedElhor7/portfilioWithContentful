import { cache } from "react";
import {
  ABOUT_SECTION_CONTENT_TYPE,
  CONTACT_SECTION_CONTENT_TYPE,
  HERO_SECTION_CONTENT_TYPE,
  PROJECT_CONTENT_TYPE,
  SITE_SETTINGS_CONTENT_TYPE,
  getClient,
  type AboutSectionSkeleton,
  type ContactSectionSkeleton,
  type HeroSectionSkeleton,
  type ProjectSkeleton,
  type SiteSettingsSkeleton,
} from "./client";
import {
  asExternalUrl,
  asLinkTarget,
  asStringArray,
  normalizeImage,
  type AboutSection,
  type ContactSection,
  type HeroSection,
  type Project,
  type ResolvedHero,
  type SiteSettings,
} from "./types";

type RawEntry = {
  sys?: { id?: string };
  fields?: Record<string, unknown>;
};

/**
 * Fallbacks used only when the matching Contentful entry is missing.
 * The headline and anchor targets are the values agreed for the portfolio;
 * no other copy is invented.
 */
const FALLBACK_HERO_HEADLINE = "Software Developer specializing in Front-End Development";
const FALLBACK_PRIMARY_BUTTON = { label: "Selected work", url: "#work" };
const FALLBACK_SECONDARY_BUTTON = { label: "Get in touch", url: "#contact" };
const FALLBACK_CONTACT_HEADING = "Let\u2019s talk.";

/** Placeholder copy that should never be published as a real description. */
const PLACEHOLDER_COPY = /^\s*(leave\s+empty|placeholder|todo|tbd|n\/?a)\b/i;

function readFields(entry: unknown): Record<string, unknown> {
  const fields = (entry as RawEntry | undefined)?.fields;
  return fields && typeof fields === "object" ? (fields as Record<string, unknown>) : {};
}

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(value: unknown): boolean {
  return value === true;
}

function readOrder(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * @description Site-wide settings. The space holds a single `siteSettings` entry,
 * so the first published one is used.
 * @returns The normalized settings, or `null` when unavailable.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const client = getClient();
  if (!client) {
    console.error("[contentful] getSiteSettings: no client (missing credentials)");
    return null;
  }

  try {
    const response = await client.getEntries<SiteSettingsSkeleton>({
      content_type: SITE_SETTINGS_CONTENT_TYPE,
      include: 2,
      limit: 1,
    });

    const entry = response.items[0];

    if (!entry) {
      console.error("[contentful] getSiteSettings: no entries found for content_type", SITE_SETTINGS_CONTENT_TYPE);
      return null;
    }

    const fields = readFields(entry);

    return {
      id: entry.sys.id,
      name: readText(fields.name),
      siteName: readText(fields.siteName),
      professionalTitle: readText(fields.professionalTitle),
      siteDescription: readText(fields.siteDescription),
      location: readText(fields.location),
      contactEmail: readText(fields.contactEmail),
      gitHubUrl: asExternalUrl(fields.gitHubUrl),
      linkedInUrl: asExternalUrl(fields.linkedInUrl),
      availabilityMessage: readText(fields.availabilityMessage),
      isAvailable: readBoolean(fields.isAvailable),
      profileImage: normalizeImage(fields.profileImage),
      ogImage: normalizeImage(fields.ogImage),
    };
  } catch (error) {
    console.error("[contentful] getSiteSettings failed:", (error as Error)?.message);
    return null;
  }
});

/**
 * @description Hero copy and calls to action.
 * @returns The normalized hero entry, or `null` when unavailable.
 */
export const getHeroSection = cache(async (): Promise<HeroSection | null> => {
  const client = getClient();
  if (!client) {
    console.error("[contentful] getHeroSection: no client (missing credentials)");
    return null;
  }

  try {
    const response = await client.getEntries<HeroSectionSkeleton>({
      content_type: HERO_SECTION_CONTENT_TYPE,
      include: 2,
      limit: 1,
    });

    const entry = response.items[0];

    if (!entry) {
      console.error("[contentful] getHeroSection: no entries found for content_type", HERO_SECTION_CONTENT_TYPE);
      return null;
    }

    const fields = readFields(entry);

    return {
      id: entry.sys.id,
      name: readText(fields.name),
      headline: readText(fields.heroHeadline),
      introduction: readText(fields.heroIntroduction),
      primaryButtonLabel: readText(fields.primaryButtonLabel),
      primaryButtonUrl: asLinkTarget(fields.primaryButtonUrl),
      secondaryButtonLabel: readText(fields.secondaryButtonLabel),
      secondaryButtonUrl: asLinkTarget(fields.secondaryButtonUrl),
    };
  } catch (error) {
    console.error("[contentful] getHeroSection failed:", (error as Error)?.message);
    return null;
  }
});

/**
 * @description About section copy.
 * @returns The normalized about entry, or `null` when unavailable.
 */
export const getAboutSection = cache(async (): Promise<AboutSection | null> => {
  const client = getClient();
  if (!client) {
    console.error("[contentful] getAboutSection: no client (missing credentials)");
    return null;
  }

  try {
    const response = await client.getEntries<AboutSectionSkeleton>({
      content_type: ABOUT_SECTION_CONTENT_TYPE,
      include: 2,
      limit: 1,
    });

    const entry = response.items[0];

    if (!entry) {
      console.error("[contentful] getAboutSection: no entries found for content_type", ABOUT_SECTION_CONTENT_TYPE);
      return null;
    }

    const fields = readFields(entry);

    return {
      id: entry.sys.id,
      name: readText(fields.name),
      heading: readText(fields.aboutHeading),
      description: readText(fields.aboutDescription),
    };
  } catch (error) {
    console.error("[contentful] getAboutSection failed:", (error as Error)?.message);
    return null;
  }
});

/**
 * @description Contact section copy. The email address lives in `siteSettings`.
 * @returns The normalized contact entry, or `null` when unavailable.
 */
export const getContactSection = cache(async (): Promise<ContactSection | null> => {
  const client = getClient();
  if (!client) {
    console.error("[contentful] getContactSection: no client (missing credentials)");
    return null;
  }

  try {
    const response = await client.getEntries<ContactSectionSkeleton>({
      content_type: CONTACT_SECTION_CONTENT_TYPE,
      include: 2,
      limit: 1,
    });

    const entry = response.items[0];

    if (!entry) {
      console.error("[contentful] getContactSection: no entries found for content_type", CONTACT_SECTION_CONTENT_TYPE);
      return null;
    }

    const fields = readFields(entry);

    return {
      id: entry.sys.id,
      name: readText(fields.name),
      heading: readText(fields.contactHeading),
      message: readText(fields.contactMessage),
    };
  } catch (error) {
    console.error("[contentful] getContactSection failed:", (error as Error)?.message);
    return null;
  }
});

/**
 * @description All published projects, ordered by `displayOrder` (missing values last).
 * @returns The normalized projects; an empty list when the request fails.
 */
export const getProjects = cache(async (): Promise<Project[]> => {
  const client = getClient();
  if (!client) {
    console.error("[contentful] getProjects: no client (missing credentials)");
    return [];
  }

  try {
    const response = await client.getEntries<ProjectSkeleton>({
      content_type: PROJECT_CONTENT_TYPE,
      include: 2,
      limit: 100,
      order: ["fields.displayOrder"],
    });

    if (!response.items || response.items.length === 0) {
      console.error("[contentful] getProjects: no entries found for content_type", PROJECT_CONTENT_TYPE);
    }

    const projects = response.items.map((item): Project => {
      const fields = readFields(item);

      return {
        id: item.sys.id,
        name: readText(fields.name),
        slug: readText(fields.slug),
        description: readText(fields.description),
        technologies: asStringArray(fields.technologies),
        demoUrl: asExternalUrl(fields.demoUrl),
        repositoryUrl: asExternalUrl(fields.repositoryUrl),
        coverImage: normalizeImage(fields.coverImage, readText(fields.name)),
        featured: readBoolean(fields.featured),
        displayOrder: readOrder(fields.displayOrder),
      };
    });

    return projects.sort((a, b) => {
      const aOrder = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.displayOrder ?? Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("[contentful] getProjects failed:", (error as Error)?.message);
    return [];
  }
});

/**
 * @description Description used for metadata. Falls back to the verified name and
 * title when the Contentful description is empty or still placeholder copy.
 * @param settings Site settings, if the entry exists.
 * @returns A non-empty description, or an empty string when there is nothing to show.
 */
export function resolveSiteDescription(settings: SiteSettings | null): string {
  const description = settings?.siteDescription ?? "";

  if (description && !PLACEHOLDER_COPY.test(description)) return description;

  return [settings?.siteName, settings?.professionalTitle].filter(Boolean).join(" \u2014 ");
}

/**
 * @description Hero values with the agreed fallbacks applied when the entry is missing.
 * @param hero The normalized hero entry, if any.
 * @returns Copy ready to render, including the fallback anchor targets.
 */
export function resolveHero(hero: HeroSection | null): ResolvedHero {
  return {
    headline: hero?.headline || FALLBACK_HERO_HEADLINE,
    introduction: hero?.introduction ?? "",
    primaryButtonLabel: hero?.primaryButtonLabel || FALLBACK_PRIMARY_BUTTON.label,
    primaryButtonUrl: hero?.primaryButtonUrl ?? FALLBACK_PRIMARY_BUTTON.url,
    secondaryButtonLabel: hero?.secondaryButtonLabel || FALLBACK_SECONDARY_BUTTON.label,
    secondaryButtonUrl: hero?.secondaryButtonUrl ?? FALLBACK_SECONDARY_BUTTON.url,
  };
}

/**
 * @description Contact heading falls back to a neutral line of copy.
 * @param contact The normalized contact entry, if any.
 * @returns The published heading or the fallback copy.
 */
export function resolveContactHeading(contact: ContactSection | null): string {
  return contact?.heading || FALLBACK_CONTACT_HEADING;
}
