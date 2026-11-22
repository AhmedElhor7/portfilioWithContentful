import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Chatbot } from "./chatbot";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function openChatbot() {
  render(<Chatbot ownerName="Ahmed" />);
  fireEvent.click(screen.getByRole("button", { name: "Open portfolio chat" }));

  return screen.getByRole("dialog", { name: "Portfolio assistant for Ahmed" });
}

describe("Chatbot", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens with a welcome state and grounded suggestions", () => {
    openChatbot();

    expect(screen.getByRole("heading", { name: /explore Ahmed/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "What projects are in the portfolio?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "How can I get in touch?" })).toBeInTheDocument();
  });

  it("sends a suggestion, shows the reply and keeps the user message", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: "Ahmed built Northwind." }));

    openChatbot();
    fireEvent.click(
      screen.getByRole("button", { name: "What projects are in the portfolio?" }),
    );

    expect(screen.getByRole("article", { name: "You" })).toHaveTextContent(
      "What projects are in the portfolio?",
    );
    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(await screen.findByText("Ahmed built Northwind.")).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          messages: [
            { role: "user", content: "What projects are in the portfolio?" },
          ],
        }),
      }),
    );
  });

  it("keeps the failed message and retries it without duplicating it", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({ error: "The assistant could not answer right now." }, 502),
      )
      .mockResolvedValueOnce(jsonResponse({ message: "Ahmed is a front-end developer." }));

    openChatbot();

    const input = screen.getByRole("textbox", { name: "Message" });
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The assistant could not answer right now.",
    );
    expect(screen.getAllByText("Hello")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Ahmed is a front-end developer.")).toBeInTheDocument();
    expect(screen.getAllByText("Hello")).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("closes on Escape", async () => {
    openChatbot();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Portfolio assistant for Ahmed" }),
      ).not.toBeInTheDocument();
    });
  });

  it("hides the mic button when speech recognition is unsupported", () => {
    openChatbot();

    expect(screen.queryByRole("button", { name: "Start voice input" })).not.toBeInTheDocument();
  });

  describe("voice input", () => {
    class FakeRecognition {
      static instance: FakeRecognition | null = null;
      lang = "";
      continuous = true;
      interimResults = false;
      onresult: ((event: { results: { transcript: string }[][] }) => void) | null = null;
      onerror: ((event: { error: string }) => void) | null = null;
      onend: (() => void) | null = null;
      start = vi.fn();
      stop = vi.fn(() => this.onend?.());
      abort = vi.fn();

      constructor() {
        FakeRecognition.instance = this;
      }
    }

    beforeEach(() => {
      FakeRecognition.instance = null;
      vi.stubGlobal("webkitSpeechRecognition", FakeRecognition);
    });

    it("dictates into the textarea without sending", async () => {
      openChatbot();

      fireEvent.click(await screen.findByRole("button", { name: "Start voice input" }));
      const recognition = FakeRecognition.instance!;
      expect(recognition.start).toHaveBeenCalled();

      const stopButton = screen.getByRole("button", { name: "Stop voice input" });
      expect(stopButton).toHaveAttribute("aria-pressed", "true");

      act(() => {
        recognition.onresult?.({ results: [[{ transcript: "What projects" }], [{ transcript: " has he built?" }]] });
      });
      expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue(
        "What projects has he built?",
      );

      fireEvent.click(stopButton);
      expect(recognition.stop).toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Start voice input" })).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("explains when microphone access is blocked", async () => {
      openChatbot();

      fireEvent.click(await screen.findByRole("button", { name: "Start voice input" }));
      act(() => {
        FakeRecognition.instance!.onerror?.({ error: "not-allowed" });
        FakeRecognition.instance!.onend?.();
      });

      expect(screen.getByText(/Microphone access was blocked/)).toBeInTheDocument();
    });

    it("explains when the speech service is unreachable", async () => {
      openChatbot();

      fireEvent.click(await screen.findByRole("button", { name: "Start voice input" }));
      act(() => {
        FakeRecognition.instance!.onerror?.({ error: "network" });
        FakeRecognition.instance!.onend?.();
      });

      expect(screen.getByText(/could not reach its speech service/)).toBeInTheDocument();
    });
  });
});
