import { About } from "@/components/portfolio/about/about";
import { Contact } from "@/components/portfolio/contact/contact";
import { Hero } from "@/components/portfolio/hero/hero";
import { Projects } from "@/components/portfolio/projects/projects";
import { Toolkit } from "@/components/portfolio/toolkit/toolkit";
import { Separator } from "@/components/ui/separator";
import {
  getAboutSection,
  getContactSection,
  getHeroSection,
  getProjects,
  getSiteSettings,
  resolveContactHeading,
  resolveHero,
} from "@/lib/contentful/portfolio";
import { buildSectionOrder, collectTechnologies, getSectionIndex, hasAboutContent, hasPublishedWork } from "@/lib/portfolio";

/**
 * Time-based ISR for the homepage (and the shared root layout): once the
 * cached page is older than 300 seconds, the next request is still served the
 * cached copy and triggers a background re-render with fresh Contentful data,
 * which later requests receive. 300 matches `getPortfolioKnowledge`'s cache
 * window in `lib/chatbot/knowledge.ts`. Needs a Next.js server runtime
 * (Vercel); a static export cannot revalidate. There is no on-demand
 * Contentful webhook yet; see the README for the content-refresh behavior.
 */
export const revalidate = 300;

/**
 * @description Composes the homepage from the published Contentful entries.
 * Requests run in parallel and are memoized per render, so the settings entry is
 * read once even though the layout also uses it.
 * @returns The portfolio sections in page order.
 */
export default async function Home() {
  const [settings, hero, about, contact, projects] = await Promise.all([
    getSiteSettings(),
    getHeroSection(),
    getAboutSection(),
    getContactSection(),
    getProjects(),
  ]);

  const heroContent = resolveHero(hero);
  const contactHeading = resolveContactHeading(contact);
  const technologies = collectTechnologies(projects);
  const hasWork = hasPublishedWork(projects);
  const hasAbout = hasAboutContent(about);

  const sections = buildSectionOrder({
    about: hasAbout,
    projects: hasWork,
    toolkit: technologies.length > 0,
  });

  // Never link the hero's primary CTA to the Work section when it is not
  // rendered, which can happen with the CMS fallback copy and with an
  // editor-set URL alike.
  if (heroContent.primaryButtonUrl === "#work" && !hasWork) {
    heroContent.primaryButtonUrl = null;
  }

  return (
    <>
      <Hero content={heroContent} settings={settings} />

      <Separator />

      {about && hasAbout ? <About section={about} index={getSectionIndex(sections, "about")} /> : null}

      {hasWork ? (
        <Projects
          projects={projects}
          index={getSectionIndex(sections, "work")}
          topSpacing={!hasAbout}
        />
      ) : null}

      {technologies.length > 0 ? (
        <Toolkit technologies={technologies} index={getSectionIndex(sections, "toolkit")} />
      ) : null}

      <Contact
        heading={contactHeading}
        message={contact?.message ?? ""}
        email={settings?.contactEmail ?? ""}
        gitHubUrl={settings?.gitHubUrl ?? null}
        index={getSectionIndex(sections, "contact")}
      />
    </>
  );
}
