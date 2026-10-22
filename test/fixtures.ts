import type { AboutSection, ContactSection, Project, ResolvedHero, SiteSettings } from "@/types";

/** Synthetic settings entry; no real personal data is used in tests. */
export const siteSettings: SiteSettings = {
  id: "settings-1",
  name: "Settings",
  siteName: "Example Studio",
  professionalTitle: "Front-End Developer",
  siteDescription: "A calm portfolio for a front-end developer.",
  location: "Lisbon, Portugal",
  contactEmail: "hello@example.com",
  gitHubUrl: "https://github.com/example",
  linkedInUrl: "https://www.linkedin.com/in/example",
  availabilityMessage: "Available for select projects",
  isAvailable: true,
  profileImage: {
    url: "https://images.ctfassets.net/space/portrait/portrait.jpg",
    width: 800,
    height: 800,
    alt: "Portrait of the developer",
  },
  ogImage: null,
};

/** Hero content after Contentful fallbacks have been applied. */
export const heroContent: ResolvedHero = {
  headline: "Software Developer specializing in Front-End Development",
  introduction: "I build accessible, fast interfaces with a focus on typography and motion.",
  primaryButtonLabel: "Selected work",
  primaryButtonUrl: "#work",
  secondaryButtonLabel: "Get in touch",
  secondaryButtonUrl: "#contact",
};

export const aboutSection: AboutSection = {
  id: "about-1",
  name: "About",
  heading: "A developer who cares about the details",
  description: "Ten years of building interfaces that stay readable and calm at any size.",
};

export const contactSection: ContactSection = {
  id: "contact-1",
  name: "Contact",
  heading: "Let’s talk.",
  message: "Tell me about the product, the audience and the constraints.",
};

export const projects: Project[] = [
  {
    id: "project-1",
    name: "Northwind",
    slug: "northwind",
    description: "A documentation platform with a static export and a strict design system.",
    technologies: ["Next.js", "TypeScript", "Contentful"],
    demoUrl: "https://northwind.example.com",
    repositoryUrl: "https://github.com/example/northwind",
    coverImage: {
      url: "https://images.ctfassets.net/space/cover/cover.jpg",
      width: 1600,
      height: 1000,
      alt: "Northwind documentation homepage",
    },
    featured: true,
    displayOrder: 1,
  },
  {
    id: "project-2",
    name: "Atlas",
    slug: "atlas",
    description: "An internal analytics dashboard.",
    technologies: ["React", "TypeScript"],
    demoUrl: null,
    repositoryUrl: null,
    coverImage: null,
    featured: false,
    displayOrder: 2,
  },
];
