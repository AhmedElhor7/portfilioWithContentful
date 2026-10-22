import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { contactSection } from "@/test/fixtures";
import { Contact } from "./contact";

const baseProps = {
  heading: contactSection.heading,
  message: contactSection.message,
  email: "hello@example.com",
  gitHubUrl: "https://github.com/example",
  index: "04",
};

describe("Contact", () => {
  it("renders the heading and supporting message", () => {
    render(<Contact {...baseProps} />);

    expect(
      screen.getByRole("heading", { level: 2, name: contactSection.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(contactSection.message)).toBeInTheDocument();
  });

  it("exposes the contact anchor and its section index", () => {
    const { container } = render(<Contact {...baseProps} />);

    expect(container.querySelector("#contact")).not.toBeNull();
    expect(container.querySelector("#contact")).toHaveAttribute("aria-labelledby", "contact-title");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "contact-title");
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("links to the email address and the GitHub profile", () => {
    render(<Contact {...baseProps} />);

    expect(screen.getByRole("link", { name: "Email hello@example.com" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );

    const github = screen.getByRole("link", { name: /GitHub profile/ });

    expect(github).toHaveAttribute("href", "https://github.com/example");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("hides actions that have no destination", () => {
    render(<Contact {...baseProps} email="" gitHubUrl={null} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
