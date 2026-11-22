/**
 * @description Props for the site header.
 */
export interface SiteHeaderProps {
  /** Site name shown in the wordmark. */
  siteName?: string;
  /** Whether the homepage renders a Work section. Defaults to `true` so the
   * nav keeps its current items unless a caller says Work is unavailable. */
  hasWork?: boolean;
}
