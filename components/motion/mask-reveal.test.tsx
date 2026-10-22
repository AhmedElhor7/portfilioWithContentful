import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MaskReveal } from "./mask-reveal";

describe("MaskReveal", () => {
  it("keeps every word in the accessible text", () => {
    const { container } = render(<MaskReveal text="Software Developer" />);

    expect(container.textContent).toContain("Software");
    expect(container.textContent).toContain("Developer");
  });

  it("does not clip the server markup before JavaScript runs", () => {
    const html = renderToStaticMarkup(<MaskReveal text="Readable headline" />);

    // The words are only pushed behind their masks after hydration.
    expect(html).not.toContain("translateY");
    expect(html).toContain("Readable");
    expect(html).toContain("headline");
  });
});
