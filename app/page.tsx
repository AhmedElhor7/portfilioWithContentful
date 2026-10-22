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
import { buildSectionOrder, collectTechnologies, getSectionIndex } from "@/lib/portfolio";

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

  const sections = buildSectionOrder({
    about: about !== null,
    projects: projects.length > 0,
    toolkit: technologies.length > 0,
  });

  return (
    <>
      <Hero content={heroContent} settings={settings} />

      <Separator />

      {about ? <About section={about} index={getSectionIndex(sections, "about")} /> : null}

      {projects.length > 0 ? (
        <Projects
          projects={projects}
          index={getSectionIndex(sections, "work")}
          topSpacing={about === null}
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
