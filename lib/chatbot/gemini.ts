import { ProxyAgent } from "undici";
import type { PortfolioKnowledge } from "./knowledge";
import { buildGeminiContents, buildSystemInstruction } from "./prompt";
import type { ChatApiMessage } from "./types";

/** Gemini model used for portfolio answers. Override with `GEMINI_MODEL`. */
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 30_000;

let proxyAgent: ProxyAgent | undefined;

/**
 * @description Node's `fetch` does not read proxy environment variables on its
 * own. When an outbound proxy is configured, route only this Gemini request
 * through it so other server calls (such as Contentful) keep their normal
 * behavior. No proxy is created when the variables are absent.
 * @returns A reusable proxy dispatcher, or `undefined` for a direct request.
 */
function getProxyAgent(): ProxyAgent | undefined {
  const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (!proxy) return undefined;

  proxyAgent ??= new ProxyAgent(proxy);
  return proxyAgent;
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
};

export type ChatReplyResult =
  | { ok: true; text: string }
  | { ok: false; reason: "not_configured" | "busy" | "failed" };

function readReplyText(data: GeminiResponse): string {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}

function describeError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);

  const cause = error.cause as { code?: string; message?: string } | undefined;
  const detail = cause?.message || cause?.code;

  return detail ? `${error.message} (${detail})` : error.message;
}

/**
 * @description Calls Gemini from the server only. The key is sent in the
 * `x-goog-api-key` header rather than a URL so it does not appear in request
 * logs. Errors are reduced to a reason; no key or provider response is logged.
 * @param messages The validated conversation.
 * @param knowledge The published portfolio knowledge.
 * @returns The generated answer or a safe failure reason.
 */
export async function generateChatReply(
  messages: ChatApiMessage[],
  knowledge: PortfolioKnowledge,
): Promise<ChatReplyResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return { ok: false, reason: "not_configured" };
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const endpoint = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`;
  const dispatcher = getProxyAgent();

  try {
    const options: RequestInit & { dispatcher?: ProxyAgent } = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemInstruction(knowledge) }],
        },
        contents: buildGeminiContents(messages),
        generationConfig: {
          temperature: 0.35,
          topP: 0.9,
          maxOutputTokens: 900,
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      ...(dispatcher ? { dispatcher } : {}),
    };

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      const detail = await response.text().catch(() => "");

      console.error(
        `[chatbot] Gemini request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`,
      );

      return {
        ok: false,
        reason: response.status === 429 || response.status === 503 ? "busy" : "failed",
      };
    }

    const data = (await response.json()) as GeminiResponse;
    const text = readReplyText(data);

    if (!text) {
      console.error(
        `[chatbot] Gemini returned no text${data.promptFeedback?.blockReason ? `: ${data.promptFeedback.blockReason}` : ""}.`,
      );

      return { ok: false, reason: "failed" };
    }

    return { ok: true, text };
  } catch (error) {
    console.error(`[chatbot] Gemini request threw: ${describeError(error)}`);

    return { ok: false, reason: "failed" };
  }
}
