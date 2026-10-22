import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>TypeScript</Badge>);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("uses the inverting ink/paper tokens for the solid variant", () => {
    render(<Badge variant="solid">Featured</Badge>);

    const className = screen.getByText("Featured").className;

    expect(className).toContain("bg-ink");
    expect(className).toContain("text-paper");
    expect(className).not.toContain("dark:bg-paper");
    expect(className).not.toContain("dark:text-ink");
  });
});
