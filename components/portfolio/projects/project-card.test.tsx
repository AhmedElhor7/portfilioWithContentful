import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/test/fixtures";
import { ProjectCard } from "./project-card";

describe("ProjectCard", () => {
  it("links to the live demo and repository with descriptive names", () => {
    render(<ProjectCard project={projects[0]} />);

    const demo = screen.getByRole("link", {
      name: "Live demo: Northwind (opens in a new tab)",
    });
    const repository = screen.getByRole("link", {
      name: "Repository: Northwind (opens in a new tab)",
    });

    expect(demo).toHaveAttribute("href", "https://northwind.example.com");
    expect(repository).toHaveAttribute("href", "https://github.com/example/northwind");
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("skips links that are missing from the entry", () => {
    render(<ProjectCard project={projects[1]} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the cover image with its alternative text", () => {
    render(<ProjectCard project={projects[0]} />);

    expect(
      screen.getByRole("img", { name: "Northwind documentation homepage" }),
    ).toBeInTheDocument();
  });

  it("falls back to a decorative initial when there is no cover image", () => {
    const { container } = render(<ProjectCard project={projects[1]} />);

    const fallback = container.querySelector(".project-card-media-fallback");

    expect(fallback).toHaveAttribute("aria-hidden", "true");
    expect(fallback).toHaveTextContent("A");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("marks featured projects and lists their technologies", () => {
    render(<ProjectCard project={projects[0]} />);

    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Contentful")).toBeInTheDocument();
  });

  it("does not mark a project as featured when the flag is false", () => {
    render(<ProjectCard project={projects[1]} />);

    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });
});
