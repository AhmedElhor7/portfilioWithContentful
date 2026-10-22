/**
 * Primary navigation. The hash targets stay on the single exported page, so they
 * keep working in a static export without client-side routing.
 */
export const SITE_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Scroll distance, in pixels, before the header gains its border and blur. */
export const HEADER_SCROLL_THRESHOLD = 12;

/** Id shared by the mobile navigation container and the menu button. */
export const MOBILE_NAV_ID = "mobile-nav";
