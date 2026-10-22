/**
 * @description Props for the site footer.
 */
export interface SiteFooterProps {
  /** Site name used in the copyright line. */
  siteName?: string;
  /** Public email address; the link is omitted when empty. */
  contactEmail?: string;
  /** GitHub profile URL; the link is omitted when missing. */
  gitHubUrl?: string | null;
  /** LinkedIn profile URL; the link is omitted when missing. */
  linkedInUrl?: string | null;
}

/** A resolved social link. */
export interface FooterSocial {
  label: string;
  href: string;
  /** External links open in a new tab with a safe referrer policy. */
  external: boolean;
}
