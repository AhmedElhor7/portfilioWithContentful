import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toolkit } from "./toolkit";

const technologies = ["Next.js", "TypeScript", "Contentful"];

describe("Toolkit", () => {
  it("renders every technology as a list item", () => {
    render(<Toolkit technologies={technologies} index="03" />);

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(technologies.length);
    expect(items.map((item) => item.textContent)).toEqual(technologies);
  });

  it("shows the section index, label and heading", () => {
    const { container } = render(<Toolkit technologies={technologies} index="03" />);

    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("Toolkit")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What I reach for" })).toHaveAttribute(
      "id",
      "toolkit-title",
    );
    expect(container.querySelector("#toolkit")).toHaveAttribute(
      "aria-labelledby",
      "toolkit-title",
    );
  });

  it("renders nothing when there are no technologies", () => {
    const { container } = render(<Toolkit technologies={[]} index="03" />);

    expect(container).toBeEmptyDOMElement();
  });
});
