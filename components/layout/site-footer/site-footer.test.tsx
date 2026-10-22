import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

const siteName = "Example Studio";

describe("SiteFooter", () => {
  it("renders the closing statement, contact call to action and copyright", () => {
    render(
      <SiteFooter
        siteName={siteName}
        contactEmail="hello@example.com"
        gitHubUrl="https://github.com/example"
        linkedInUrl="https://www.linkedin.com/in/example"
      />,
    );

    expect(screen.getByText("Start a conversation")).toHaveAttribute("href", "/#contact");
    expect(
      screen.getByText(`© ${new Date().getFullYear()} ${siteName}`),
    ).toBeInTheDocument();
    expect(screen.queryByText(/journal/i)).not.toBeInTheDocument();
  });

  it("links to every configured profile", () => {
    render(
      <SiteFooter
        siteName={siteName}
        contactEmail="hello@example.com"
        gitHubUrl="https://github.com/example"
        linkedInUrl="https://www.linkedin.com/in/example"
      />,
    );

    const socials = screen.getByRole("list");

    expect(within(socials).getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/example",
    );
    expect(within(socials).getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/example",
    );
    expect(within(socials).getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
  });

  it("opens external profiles in a new tab without a referrer", () => {
    render(<SiteFooter siteName={siteName} gitHubUrl="https://github.com/example" />);

    const github = screen.getByRole("link", { name: /GitHub/ });

    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("omits the social list when nothing is configured", () => {
    render(<SiteFooter siteName={siteName} />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByText("Start a conversation")).toBeInTheDocument();
  });
});
