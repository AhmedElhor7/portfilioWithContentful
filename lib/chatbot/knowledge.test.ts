import { describe, expect, it } from "vitest";
import { aboutSection, contactSection, heroContent, projects, siteSettings } from "@/test/fixtures";
import { collectTechnologies } from "@/lib/portfolio";
import { serializePortfolioKnowledge, type PortfolioKnowledge } from "./knowledge";
import { buildGeminiContents, buildSystemInstruction } from "./prompt";

const knowledge: PortfolioKnowledge = {
  settings: siteSettings,
  hero: heroContent,
  about: aboutSection,
  contactHeading: contactSection.heading,
  contactMessage: contactSection.message,
  projects,
  technologies: collectTechnologies(projects),
};

describe("serializePortfolioKnowledge", () => {
  it("includes published text, links, projects and technologies", () => {
    const text = serializePortfolioKnowledge(knowledge);

    expect(text).toContain("Name: Example Studio");
    expect(text).toContain("Contact email: hello@example.com");
    expect(text).toContain("GitHub: https://github.com/example");
    expect(text).toContain("1. Northwind");
    expect(text).toContain("Technologies: Next.js, TypeScript, Contentful");
    expect(text).toContain("Demo: https://northwind.example.com");
    expect(text).toContain("Technologies used across published projects:");
  });

  it("does not include image metadata", () => {
    const text = serializePortfolioKnowledge(knowledge);

    expect(text).not.toContain("images.ctfassets.net");
    expect(text).not.toContain("settings-1");
  });

  it("omits empty fields instead of inventing values", () => {
    const text = serializePortfolioKnowledge({
      ...knowledge,
      settings: {
        ...siteSettings,
        contactEmail: "",
        gitHubUrl: null,
        linkedInUrl: null,
        availabilityMessage: "",
        isAvailable: false,
      },
      about: null,
      contactHeading: "",
      contactMessage: "",
      projects: [],
      technologies: [],
    });

    expect(text).toContain("Availability: No");
    expect(text).toContain("No published projects are available.");
    expect(text).toContain("No technologies are available.");
    expect(text).not.toContain("Contact email:");
    expect(text).not.toContain("GitHub:");
  });

  it("marks the knowledge as unavailable when Contentful is empty", () => {
    const text = serializePortfolioKnowledge({
      ...knowledge,
      settings: null,
    });

    expect(text).toContain("Site settings are not available.");
  });
});

describe("buildSystemInstruction", () => {
  it("sets the portfolio scope and the no-invention rules", () => {
    const instruction = buildSystemInstruction(knowledge);

    expect(instruction).toContain("AI portfolio assistant for Example Studio");
    expect(instruction).toContain("Never invent");
    expect(instruction).toContain("information is not available");
    expect(instruction).toContain("PORTFOLIO KNOWLEDGE");
    expect(instruction).toContain("Northwind");
    expect(instruction).not.toContain("images.ctfassets.net");
  });
});

describe("buildGeminiContents", () => {
  it("maps assistant turns to model turns", () => {
    expect(
      buildGeminiContents([
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello" },
        { role: "user", content: "Projects?" },
      ]),
    ).toEqual([
      { role: "user", parts: [{ text: "Hi" }] },
      { role: "model", parts: [{ text: "Hello" }] },
      { role: "user", parts: [{ text: "Projects?" }] },
    ]);
  });
});
