import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SECTION_REVEAL_DEFAULTS, SECTION_REVEAL_OFFSETS } from "./defines";
import { SectionReveal } from "./section-reveal";

const motionState = vi.hoisted(() => ({ reducedMotion: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();

  return { ...actual, useReducedMotion: () => motionState.reducedMotion };
});

describe("SectionReveal", () => {
  it("renders sections with Motion scroll reveal and accessible labelling", () => {
    const { container } = render(
      <SectionReveal id="about" direction="left" labelledBy="about-title">
        <h2 id="about-title">About</h2>
      </SectionReveal>,
    );

    const section = container.querySelector("#about");

    expect(section).toHaveAttribute("aria-labelledby", "about-title");
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  });

  it("never hides content when reduced motion is preferred", () => {
    motionState.reducedMotion = true;

    const { container } = render(
      <SectionReveal id="contact" direction="left">
        <p>Contact</p>
      </SectionReveal>,
    );

    const section = container.querySelector("#contact") as HTMLElement;

    expect(section.tagName).toBe("SECTION");
    expect(section.style.opacity === "" || section.style.opacity === "1").toBe(true);
    expect(screen.getByText("Contact")).toBeVisible();

    motionState.reducedMotion = false;
  });

  it("defines an alternating offset for each direction", () => {
    expect(SECTION_REVEAL_OFFSETS.left.x).toBeLessThan(0);
    expect(SECTION_REVEAL_OFFSETS.right.x).toBeGreaterThan(0);
    expect(SECTION_REVEAL_OFFSETS.up.y).toBeGreaterThan(0);
    expect(SECTION_REVEAL_OFFSETS.left.x).toBe(-SECTION_REVEAL_DEFAULTS.distance);
    expect(SECTION_REVEAL_OFFSETS.right.x).toBe(SECTION_REVEAL_DEFAULTS.distance);
    expect(SECTION_REVEAL_OFFSETS.up.y).toBe(SECTION_REVEAL_DEFAULTS.distance);
  });
});
