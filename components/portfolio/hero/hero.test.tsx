import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { heroContent, siteSettings } from "@/test/fixtures";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the headline, introduction and section anchor", () => {
    const { container } = render(<Hero content={heroContent} settings={siteSettings} />);

    expect(container.querySelector("#top")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heroContent.headline);
    expect(screen.getByText(heroContent.introduction)).toBeInTheDocument();
    expect(container.querySelector("#top")).toHaveAttribute("aria-labelledby", "top-title");
    expect(
      screen.getByRole("heading", { level: 1, name: heroContent.headline }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: heroContent.headline }),
    ).toBeInTheDocument();
  });

  it("shows the availability message only when the profile is available", () => {
    const { rerender } = render(<Hero content={heroContent} settings={siteSettings} />);

    // Shown twice: once as the availability eyebrow and once as the status fact.
    expect(screen.getAllByText("Available for select projects")).toHaveLength(2);

    rerender(
      <Hero content={heroContent} settings={{ ...siteSettings, isAvailable: false }} />,
    );

    expect(screen.queryByText("Available for select projects")).not.toBeInTheDocument();
  });

  it("renders internal calls to action as plain links", () => {
    render(<Hero content={heroContent} settings={siteSettings} />);

    const primary = screen.getByRole("link", { name: "Selected work" });
    const secondary = screen.getByRole("link", { name: "Get in touch" });

    expect(primary).toHaveAttribute("href", "#work");
    expect(secondary).toHaveAttribute("href", "#contact");
    expect(primary).not.toHaveAttribute("target");
  });

  it("opens external calls to action in a new tab without a referrer", () => {
    render(
      <Hero
        content={{ ...heroContent, primaryButtonUrl: "https://example.com/work" }}
        settings={siteSettings}
      />,
    );

    const link = screen.getByRole("link", { name: "Selected work" });

    expect(link).toHaveAttribute("href", "https://example.com/work");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("renders the portrait with its alternative text", () => {
    render(<Hero content={heroContent} settings={siteSettings} />);

    expect(screen.getByRole("img", { name: "Portrait of the developer" })).toBeInTheDocument();
  });

  it("lists role, location and availability from the settings entry", () => {
    render(<Hero content={heroContent} settings={siteSettings} />);

    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Front-End Developer")).toBeInTheDocument();
    expect(screen.getByText("Based in")).toBeInTheDocument();
    expect(screen.getByText("Lisbon, Portugal")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getAllByText("Available for select projects")).toHaveLength(2);
  });

  it("does not invent facts that the CMS does not provide", () => {
    render(
      <Hero
        content={heroContent}
        settings={{
          ...siteSettings,
          professionalTitle: "",
          location: "",
          isAvailable: false,
          availabilityMessage: "",
          profileImage: null,
        }}
      />,
    );

    expect(screen.queryByText("Role")).not.toBeInTheDocument();
    expect(screen.queryByText("Based in")).not.toBeInTheDocument();
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
