import { describe, expect, it } from "vitest";
import type { Project } from "@/types";
import { buildSectionOrder, collectTechnologies, getSectionIndex } from "./portfolio";

function project(id: string, technologies: string[]): Project {
  return {
    id,
    name: id,
    slug: id,
    description: "",
    technologies,
    demoUrl: null,
    repositoryUrl: null,
    coverImage: null,
    featured: false,
    displayOrder: null,
  };
}

describe("collectTechnologies", () => {
  it("de-duplicates technologies case-insensitively", () => {
    const result = collectTechnologies([
      project("a", ["TypeScript", "Next.js"]),
      project("b", ["next.js", "Contentful"]),
      project("c", ["TYPESCRIPT"]),
    ]);

    expect(result).toEqual(["TypeScript", "Next.js", "Contentful"]);
  });

  it("returns an empty list when there are no projects", () => {
    expect(collectTechnologies([])).toEqual([]);
  });
});

describe("buildSectionOrder", () => {
  it("keeps only the sections that render, ending with contact", () => {
    expect(buildSectionOrder({ about: true, projects: true, toolkit: true })).toEqual([
      "about",
      "work",
      "toolkit",
      "contact",
    ]);

    expect(buildSectionOrder({ about: false, projects: true, toolkit: false })).toEqual([
      "work",
      "contact",
    ]);

    expect(buildSectionOrder({ about: false, projects: false, toolkit: false })).toEqual([
      "contact",
    ]);
  });
});

describe("getSectionIndex", () => {
  const order = buildSectionOrder({ about: true, projects: true, toolkit: false });

  it("zero-pads the visible position", () => {
    expect(getSectionIndex(order, "about")).toBe("01");
    expect(getSectionIndex(order, "work")).toBe("02");
    expect(getSectionIndex(order, "contact")).toBe("03");
  });

  it("returns an empty string for sections that are not rendered", () => {
    expect(getSectionIndex(order, "toolkit")).toBe("");
  });
});
