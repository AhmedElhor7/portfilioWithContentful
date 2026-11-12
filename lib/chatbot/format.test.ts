import { describe, expect, it } from "vitest";
import { tokenizeMessage } from "./format";

describe("tokenizeMessage", () => {
  it("keeps plain text in one segment", () => {
    expect(tokenizeMessage("Hello there")).toEqual([{ type: "text", text: "Hello there" }]);
  });

  it("turns a plain URL into a link", () => {
    expect(tokenizeMessage("See https://example.com for details")).toEqual([
      { type: "text", text: "See " },
      { type: "link", text: "https://example.com", href: "https://example.com" },
      { type: "text", text: " for details" },
    ]);
  });

  it("supports markdown links and keeps them safe", () => {
    expect(tokenizeMessage("Visit [my GitHub](https://github.com/example).")).toEqual([
      { type: "text", text: "Visit " },
      { type: "link", text: "my GitHub", href: "https://github.com/example" },
      { type: "text", text: "." },
    ]);
  });

  it("leaves trailing punctuation outside a plain URL", () => {
    expect(tokenizeMessage("Demo: https://example.com/project.")).toEqual([
      { type: "text", text: "Demo: " },
      { type: "link", text: "https://example.com/project", href: "https://example.com/project" },
      { type: "text", text: "." },
    ]);
  });
});
