import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  FOOTER_CONTACT_HREF,
  FOOTER_CREDIT,
  FOOTER_CTA_LABEL,
  FOOTER_SOCIAL_HEADING,
  FOOTER_SOCIAL_LABELS,
  FOOTER_STATEMENT,
} from "./defines";
import type { FooterSocial, SiteFooterProps } from "./types";

/**
 * @description Site footer: closing statement, in-page contact link, the social
 * links that are configured, and the copyright line.
 * @param props Site name and optional contact details.
 * @returns The footer landmark.
 */
export function SiteFooter({
  siteName = "",
  contactEmail = "",
  gitHubUrl = null,
  linkedInUrl = null,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  const candidates: Array<FooterSocial | null> = [
    gitHubUrl
      ? { label: FOOTER_SOCIAL_LABELS.gitHub, href: gitHubUrl, external: true }
      : null,
    linkedInUrl
      ? { label: FOOTER_SOCIAL_LABELS.linkedIn, href: linkedInUrl, external: true }
      : null,
    contactEmail
      ? { label: FOOTER_SOCIAL_LABELS.email, href: `mailto:${contactEmail}`, external: false }
      : null,
  ];

  const socials = candidates.filter((social): social is FooterSocial => social !== null);

  return (
    <footer className="mt-auto border-t">
      <div className="shell py-14">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="font-serif max-w-sm text-[1.75rem] leading-[1.15] tracking-[-0.025em] text-balance">
              {FOOTER_STATEMENT.lead}{" "}
              <span className="wonky text-accent italic">{FOOTER_STATEMENT.emphasis}</span>
              {FOOTER_STATEMENT.trailing}
            </p>
            <Link
              href={FOOTER_CONTACT_HREF}
              className="link-underline text-ink mt-5 inline-flex items-center gap-1.5 font-mono text-[0.75rem] tracking-[0.12em] uppercase"
            >
              {FOOTER_CTA_LABEL}
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Link>
          </div>

          {socials.length > 0 ? (
            <div>
              <p className="eyebrow">{FOOTER_SOCIAL_HEADING}</p>
              <ul className="mt-4 space-y-2.5">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.external ? "_blank" : undefined}
                      rel={social.external ? "noreferrer noopener" : undefined}
                      className="link-underline text-ink-soft hover:text-ink font-mono text-[0.8125rem] tracking-[0.06em]"
                    >
                      {social.label}
                      {social.external ? (
                        <span className="sr-only"> (opens in a new tab)</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <Separator className="my-10" />

        <div className="text-muted-foreground flex flex-col gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteName}
          </p>
          <p>{FOOTER_CREDIT}</p>
        </div>
      </div>
    </footer>
  );
}
