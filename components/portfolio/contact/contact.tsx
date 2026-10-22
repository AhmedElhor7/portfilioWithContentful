import { ArrowUpRight } from "lucide-react";
import { Parallax } from "@/components/motion/parallax";
import { SectionReveal } from "@/components/motion/section-reveal/section-reveal";
import { ButtonLink } from "@/components/ui/button";
import {
  CONTACT_GITHUB_LABEL,
  CONTACT_LABEL,
  CONTACT_PARALLAX_DISTANCE,
  CONTACT_REVEAL_DIRECTION,
  CONTACT_SECTION_ID,
} from "./defines";
import type { ContactProps } from "./types";

/**
 * @description Closing section with the contact heading, message and the
 * actions that are actually configured (email and/or GitHub).
 * @param props Resolved heading, contact details and section index.
 * @returns The revealed contact section.
 */
export function Contact({ heading, message, email, gitHubUrl, index }: ContactProps) {
  return (
    <SectionReveal
      id={CONTACT_SECTION_ID}
      direction={CONTACT_REVEAL_DIRECTION}
      className="contact-section"
      labelledBy={`${CONTACT_SECTION_ID}-title`}
    >
      <Parallax distance={CONTACT_PARALLAX_DISTANCE} className="shell contact-inner">
        <p className="eyebrow section-eyebrow">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="eyebrow-rule" />
          {CONTACT_LABEL}
        </p>

        <h2 id={`${CONTACT_SECTION_ID}-title`} className="contact-heading">
          {heading}
        </h2>

        {message ? <p className="section-lede contact-message">{message}</p> : null}

        {email || gitHubUrl ? (
          <div className="action-row contact-actions">
            {email ? (
              <ButtonLink
                href={`mailto:${email}`}
                size="lg"
                aria-label={`Email ${email}`}
              >
                {email}
              </ButtonLink>
            ) : null}
            {gitHubUrl ? (
              <ButtonLink href={gitHubUrl} external size="lg" variant="outline">
                {CONTACT_GITHUB_LABEL}
                <ArrowUpRight className="size-3.5" />
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </Parallax>
    </SectionReveal>
  );
}
