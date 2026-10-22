import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders the index, label, title and description", () => {
    render(
      <SectionHeading
        index="02"
        label="Work"
        title="Selected work"
        titleId="work-title"
        description="A few projects."
      />,
    );

    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Selected work" }),
    ).toHaveAttribute("id", "work-title");
    expect(screen.getByText("A few projects.")).toBeInTheDocument();
  });

  it("omits the title and description when they are not provided", () => {
    const { container } = render(<SectionHeading index="01" label="About" />);

    expect(container.querySelector(".section-heading-title")).toBeNull();
    expect(container.querySelector(".section-heading-description")).toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("defaults to the between alignment and accepts the left variant", () => {
    const { container, rerender } = render(<SectionHeading index="01" label="About" />);

    expect(container.querySelector(".section-heading")).toHaveAttribute("data-align", "between");

    rerender(<SectionHeading index="01" label="About" align="left" />);

    expect(container.querySelector(".section-heading")).toHaveAttribute("data-align", "left");
  });

  it("renders trailing content for the toolkit list", () => {
    render(
      <SectionHeading index="03" label="Toolkit">
        <ul>
          <li>TypeScript</li>
        </ul>
      </SectionHeading>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("TypeScript");
  });
});
