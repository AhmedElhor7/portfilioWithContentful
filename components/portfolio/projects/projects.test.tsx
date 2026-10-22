import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/test/fixtures";
import { Projects } from "./projects";

describe("Projects", () => {
  it("renders one card per published project", () => {
    const { container } = render(<Projects projects={projects} index="02" />);

    expect(screen.getByRole("heading", { level: 3, name: "Northwind" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Atlas" })).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Selected work")).toBeInTheDocument();
    expect(container.querySelector("#work")).toHaveAttribute("aria-labelledby", "work-title");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "work-title");
  });

  it("uses the work anchor so the header navigation can jump to it", () => {
    const { container } = render(<Projects projects={projects} index="02" />);

    expect(container.querySelector("#work")).not.toBeNull();
  });

  it("renders nothing when the space has no projects", () => {
    const { container } = render(<Projects projects={[]} index="02" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("adds top spacing only when the previous section is absent", () => {
    const { container, rerender } = render(
      <Projects projects={projects} index="02" topSpacing />,
    );

    expect(container.querySelector("#work")).toHaveClass("section-spacing-top");

    rerender(<Projects projects={projects} index="02" topSpacing={false} />);

    expect(container.querySelector("#work")).not.toHaveClass("section-spacing-top");
  });
});
