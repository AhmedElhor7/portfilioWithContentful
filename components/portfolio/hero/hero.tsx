import { ArrowRight } from "lucide-react";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { SectionReveal } from "@/components/motion/section-reveal/section-reveal";
import { ButtonLink } from "@/components/ui/button";
import { ContentfulImage } from "@/components/ui/contentful-image";
import type { SiteSettings } from "@/types";
import { HERO_FACT_LABELS, HERO_PROFILE_IMAGE, HERO_REVEAL_DIRECTION, HERO_SECTION_ID } from "./defines";
import type { HeroFact, HeroProps } from "./types";

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * @description Renders a hero call to action, using a plain anchor for external
 * destinations so the browser handles navigation and new-tab behaviour.
 * @param props Destination, label and button styling.
 * @returns The call-to-action button.
 */
function HeroAction({
  href,
  label,
  variant = "solid",
  withArrow = false,
}: {
  href: string;
  label: string;
  variant?: "solid" | "outline";
  withArrow?: boolean;
}) {
  const content = (
    <>
      {label}
      {withArrow ? <ArrowRight className="size-3.5" /> : null}
    </>
  );

  if (isExternalHref(href)) {
    return (
      <ButtonLink href={href} external size="lg" variant={variant}>
        {content}
      </ButtonLink>
    );
  }

  return (
    <ButtonLink href={href} size="lg" variant={variant}>
      {content}
    </ButtonLink>
  );
}

/**
 * @description Builds the fact list from published settings, dropping values the
 * CMS does not provide instead of inventing replacements.
 * @param settings The site settings entry, if available.
 * @returns Label/value pairs ready to render.
 */
function buildFacts(settings: SiteSettings | null): HeroFact[] {
  const isAvailable = settings?.isAvailable === true;

  return [
    { label: HERO_FACT_LABELS.role, value: settings?.professionalTitle ?? "" },
    { label: HERO_FACT_LABELS.location, value: settings?.location ?? "" },
    {
      label: HERO_FACT_LABELS.status,
      value: isAvailable ? (settings?.availabilityMessage ?? "") : "",
    },
  ].filter((fact) => fact.value.length > 0);
}

/**
 * @description Opening section: availability, headline, introduction, calls to
 * action, portrait and the role/location/status facts.
 * @param props Hero copy and site settings.
 * @returns The hero section.
 */
export function Hero({ content, settings }: HeroProps) {
  const facts = buildFacts(settings);
  const availabilityMessage = settings?.isAvailable ? settings.availabilityMessage : "";
  const siteName = settings?.siteName ?? "";

  return (
    <SectionReveal
      id={HERO_SECTION_ID}
      direction={HERO_REVEAL_DIRECTION}
      className="shell hero-section"
      labelledBy={`${HERO_SECTION_ID}-title`}
    >
      {availabilityMessage ? (
        <p className="eyebrow section-eyebrow">
          <span aria-hidden className="hero-availability-dot" />
          {availabilityMessage}
        </p>
      ) : null}

      <h1 id={`${HERO_SECTION_ID}-title`} className="hero-title" aria-label={content.headline}>
        <span aria-hidden>
          <MaskReveal text={content.headline} />
        </span>
      </h1>

      <div className="hero-grid">
        <div>
          {content.introduction ? (
            <p className="section-lede hero-intro">{content.introduction}</p>
          ) : null}

          <div className="action-row hero-actions">
            {content.primaryButtonUrl ? (
              <HeroAction
                href={content.primaryButtonUrl}
                label={content.primaryButtonLabel}
                withArrow
              />
            ) : null}
            {content.secondaryButtonUrl ? (
              <HeroAction
                href={content.secondaryButtonUrl}
                label={content.secondaryButtonLabel}
                variant="outline"
              />
            ) : null}
          </div>
        </div>

        <div>
          {settings?.profileImage ? (
            <ContentfulImage
              src={settings.profileImage.url}
              alt={settings.profileImage.alt || siteName}
              width={settings.profileImage.width}
              height={settings.profileImage.height}
              renderedWidth={HERO_PROFILE_IMAGE.renderedWidth}
              quality={HERO_PROFILE_IMAGE.quality}
              sizes={HERO_PROFILE_IMAGE.sizes}
              className="hero-portrait"
            />
          ) : null}

          {facts.length > 0 ? (
            <dl className="hero-facts">
              {facts.map((fact) => (
                <div key={fact.label} className="hero-fact">
                  <dt className="hero-fact-label">{fact.label}</dt>
                  <dd className="hero-fact-value">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </SectionReveal>
  );
}
