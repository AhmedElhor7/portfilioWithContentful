import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import {
  getAboutSection,
  getContactSection,
  getHeroSection,
  getProjects,
  getSiteSettings,
} from "@/lib/contentful/portfolio";
import {
  aboutSection,
  contactSection,
  heroContent,
  projects,
  siteSettings,
} from "@/test/fixtures";

vi.mock("@/lib/contentful/portfolio", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/contentful/portfolio")>();

  return {
    ...actual,
    getSiteSettings: vi.fn(),
    getHeroSection: vi.fn(),
    getAboutSection: vi.fn(),
    getContactSection: vi.fn(),
    getProjects: vi.fn(),
  };
});

describe("Homepage composition", () => {
  beforeEach(() => {
    vi.mocked(getSiteSettings).mockResolvedValue(siteSettings);
    vi.mocked(getHeroSection).mockResolvedValue({
      id: "hero-1",
      name: "Hero",
      headline: heroContent.headline,
      introduction: heroContent.introduction,
      primaryButtonLabel: heroContent.primaryButtonLabel,
      primaryButtonUrl: heroContent.primaryButtonUrl,
      secondaryButtonLabel: heroContent.secondaryButtonLabel,
      secondaryButtonUrl: heroContent.secondaryButtonUrl,
    });
    vi.mocked(getAboutSection).mockResolvedValue(aboutSection);
    vi.mocked(getContactSection).mockResolvedValue(contactSection);
    vi.mocked(getProjects).mockResolvedValue(projects);
  });

  it("renders every section in order with sequential numbers", async () => {
    const { container } = render(await Home());

    expect(container.querySelector("#top")).not.toBeNull();
    expect(container.querySelector("#about")).not.toBeNull();
    expect(container.querySelector("#work")).not.toBeNull();
    expect(container.querySelector("#toolkit")).not.toBeNull();
    expect(container.querySelector("#contact")).not.toBeNull();

    for (const index of ["01", "02", "03", "04"]) {
      expect(screen.getByText(index)).toBeInTheDocument();
    }

    expect(screen.getByRole("heading", { level: 3, name: "Northwind" })).toBeInTheDocument();
  });

  it("does not render or link to the retired journal", async () => {
    const { container } = render(await Home());

    expect(container.querySelector('a[href="/posts"]')).toBeNull();
    expect(screen.queryByText(/journal/i)).toBeNull();
  });

  it("renumbers the sections when optional entries are missing", async () => {
    vi.mocked(getAboutSection).mockResolvedValue(null);
    vi.mocked(getProjects).mockResolvedValue([]);

    const { container } = render(await Home());

    expect(container.querySelector("#about")).toBeNull();
    expect(container.querySelector("#work")).toBeNull();
    expect(container.querySelector("#toolkit")).toBeNull();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("01").closest("section")).toBe(container.querySelector("#contact"));
  });

  it("falls back to the agreed copy when the entries are unavailable", async () => {
    vi.mocked(getSiteSettings).mockResolvedValue(null);
    vi.mocked(getContactSection).mockResolvedValue(null);
    vi.mocked(getHeroSection).mockResolvedValue(null);

    render(await Home());

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Software Developer specializing in Front-End Development",
    );
    expect(screen.getByRole("heading", { level: 2, name: "Let’s talk." })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Email/ })).not.toBeInTheDocument();
  });
});
