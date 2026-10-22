import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "./button";

describe("ButtonLink", () => {
  it("renders internal calls to action with the solid ink/paper tokens", () => {
    render(<ButtonLink href="/work">Contact me</ButtonLink>);

    const link = screen.getByRole("link", { name: "Contact me" });

    expect(link).toHaveAttribute("href", "/work");
    expect(link).not.toHaveAttribute("target");
    expect(link).toHaveClass("bg-ink", "text-paper");
  });

  it("does not override the solid tokens with dark-only colours", () => {
    render(<ButtonLink href="/work">Contact me</ButtonLink>);

    const className = screen.getByRole("link", { name: "Contact me" }).className;

    // The dark-mode regression came from `dark:text-paper` and `dark:bg-paper`,
    // which produced dark-on-dark text. The ink/paper tokens already invert.
    expect(className).not.toContain("dark:text-paper");
    expect(className).not.toContain("dark:bg-paper");
  });

  it("keeps the outline variant readable in both themes", () => {
    render(
      <ButtonLink href="/work" variant="outline">
        GitHub profile
      </ButtonLink>,
    );

    const className = screen.getByRole("link", { name: "GitHub profile" }).className;

    expect(className).toContain("text-ink");
    expect(className).toContain("border-border-strong");
    expect(className).not.toContain("dark:text-paper");
  });

  it("opens external destinations in a new tab with a safe rel", () => {
    render(
      <ButtonLink href="https://github.com/example" external>
        GitHub profile
      </ButtonLink>,
    );

    const link = screen.getByRole("link", { name: "GitHub profile" });

    expect(link).toHaveAttribute("href", "https://github.com/example");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("keeps mail and other anchors in the same tab", () => {
    render(<ButtonLink href="mailto:hello@example.com">Email</ButtonLink>);

    const link = screen.getByRole("link", { name: "Email" });

    expect(link).toHaveAttribute("href", "mailto:hello@example.com");
    expect(link).not.toHaveAttribute("target");
  });

  it("exposes a visible focus ring and forwards accessible names", () => {
    render(
      <ButtonLink href="mailto:hello@example.com" aria-label="Email hello@example.com">
        hello@example.com
      </ButtonLink>,
    );

    const link = screen.getByRole("link", { name: "Email hello@example.com" });

    expect(link).toHaveClass("focus-visible:ring-2");
  });
});
