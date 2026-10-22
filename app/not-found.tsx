import { ButtonLink } from "@/components/ui/button";

/**
 * @description Static 404 page for the exported site.
 * @returns A short explanation and links back to the homepage.
 */
export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <p className="eyebrow section-eyebrow">
        <span className="text-accent">404</span>
        <span aria-hidden className="eyebrow-rule" />
        Not found
      </p>
      <h1 className="text-display text-ink mt-6 max-w-[16ch]">
        This page went <span className="wonky text-accent italic">off the record</span>.
      </h1>
      <p className="section-lede mt-6 max-w-md">
        The address may have changed, or the page was never published.
      </p>
      <div className="action-row mt-10">
        <ButtonLink href="/" size="lg">
          Back to index
        </ButtonLink>
        <ButtonLink href="/#contact" size="lg" variant="outline">
          Get in touch
        </ButtonLink>
      </div>
    </div>
  );
}
