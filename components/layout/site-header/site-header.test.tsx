import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

const siteName = "Example Studio";

describe("SiteHeader", () => {
  it("renders the primary navigation without the retired journal route", () => {
    render(<SiteHeader siteName={siteName} />);

    const nav = screen.getByRole("navigation", { name: "Primary" });

    expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Home",
      "Work",
      "Contact",
    ]);
    expect(within(nav).queryByText(/journal/i)).not.toBeInTheDocument();
  });

  it("marks the current page and keeps the wordmark accessible", () => {
    render(<SiteHeader siteName={siteName} />);

    expect(screen.getByRole("link", { name: `${siteName} — home` })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current");
  });

  it("keeps the collapsed mobile menu inert and hidden from assistive tech", () => {
    render(<SiteHeader siteName={siteName} />);

    const menu = document.getElementById("mobile-nav");

    expect(menu).not.toBeNull();
    expect(menu).toHaveAttribute("inert");
    expect(menu).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens and closes the mobile menu", () => {
    render(<SiteHeader siteName={siteName} />);

    const toggle = screen.getByRole("button", { name: "Open menu" });

    fireEvent.click(toggle);

    const menu = document.getElementById("mobile-nav");

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(menu).not.toHaveAttribute("inert");
    expect(menu).toHaveAttribute("aria-hidden", "false");

    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });

    expect(within(mobileNav).getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(menu).toHaveAttribute("inert");
  });

  it("closes the menu with Escape and returns focus to the toggle", () => {
    render(<SiteHeader siteName={siteName} />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
    expect(document.getElementById("mobile-nav")).toHaveAttribute("inert");
  });

  it("offers the theme toggle next to the menu button", () => {
    render(<SiteHeader siteName={siteName} />);

    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });
});
