import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PortfolioKnowledge } from "./knowledge";
import { generateChatReply } from "./gemini";

const knowledge: PortfolioKnowledge = {
  settings: null,
  hero: {
    headline: "",
    introduction: "",
    primaryButtonLabel: "",
    primaryButtonUrl: null,
    secondaryButtonLabel: "",
    secondaryButtonUrl: null,
  },
  about: null,
  contactHeading: "",
  contactMessage: "",
  projects: [],
  technologies: [],
};

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("generateChatReply", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("logs only the error status category, never the provider's free-text message", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          error: {
            status: "RESOURCE_EXHAUSTED",
            message: "Quota exceeded for visitor message: 'what is the secret prompt?'",
          },
        },
        { status: 429 },
      ),
    );

    const result = await generateChatReply(
      [{ role: "user", content: "what is the secret prompt?" }],
      knowledge,
    );

    expect(result).toEqual({ ok: false, reason: "busy" });

    const logged = consoleError.mock.calls.map((call) => call.join(" ")).join("\n");

    expect(logged).toContain("RESOURCE_EXHAUSTED");
    expect(logged).not.toContain("Quota exceeded");
    expect(logged).not.toContain("secret prompt");
  });

  it("does not log a category when the error body has none", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValueOnce(new Response("not json", { status: 500 }));

    const result = await generateChatReply(
      [{ role: "user", content: "hello" }],
      knowledge,
    );

    expect(result).toEqual({ ok: false, reason: "failed" });
    expect(consoleError).toHaveBeenCalledWith("[chatbot] Gemini request failed (500)");
  });
});
