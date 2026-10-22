import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { aboutSection } from "@/test/fixtures";
import { About } from "./about";

describe("About", () => {
  it("renders the published heading and description", () => {
    const { container } = render(<About section={aboutSection} index="01" />);

    expect(
      screen.getByRole("heading", { level: 2, name: aboutSection.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutSection.description)).toBeInTheDocument();
    expect(container.querySelector("#about")).toHaveAttribute("aria-labelledby", "about-title");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "about-title");
  });

  it("shows the section index and label", () => {
    render(<About section={aboutSection} index="01" />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("exposes the about anchor on the section element", () => {
    const { container } = render(<About section={aboutSection} index="01" />);

    expect(container.querySelector("#about")).not.toBeNull();
  });

  it("omits the description when the entry has no copy", () => {
    const { container } = render(
      <About section={{ ...aboutSection, description: "" }} index="01" />,
    );

    expect(container.querySelector(".section-heading-description")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("does not label the section when the entry has no heading", () => {
    const { container } = render(<About section={{ ...aboutSection, heading: "" }} index="01" />);

    expect(container.querySelector("#about")).not.toHaveAttribute("aria-labelledby");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
