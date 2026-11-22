import type { ChatApiMessage, ChatRequest } from "./types";

/** Limits that keep the request small and predictable. */
export const CHAT_LIMITS = {
  maxMessages: 20,
  maxMessageLength: 2000,
  maxTotalLength: 12000,
} as const;

export type ChatRequestParseResult =
  | { ok: true; request: ChatRequest }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * @description Validates and trims the untrusted request body. Only the
 * `user` and `assistant` roles are accepted, so a visitor cannot inject a
 * system message. The conversation must end with a user question.
 * @param value Parsed JSON from the request body.
 * @returns The normalized request or a visitor-safe error message.
 */
export function parseChatRequest(value: unknown): ChatRequestParseResult {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    return { ok: false, error: "The request could not be understood." };
  }

  if (value.messages.length === 0) {
    return { ok: false, error: "Please enter a message." };
  }

  if (value.messages.length > CHAT_LIMITS.maxMessages) {
    return {
      ok: false,
      error: "This conversation is too long. Start a new chat and try again.",
    };
  }

  const messages: ChatApiMessage[] = [];
  let totalLength = 0;

  for (const item of value.messages) {
    if (!isRecord(item)) {
      return { ok: false, error: "The request could not be understood." };
    }

    if (item.role !== "user" && item.role !== "assistant") {
      return { ok: false, error: "The request could not be understood." };
    }

    const content = typeof item.content === "string" ? item.content.trim() : "";

    if (!content) {
      return { ok: false, error: "Please enter a message." };
    }

    if (content.length > CHAT_LIMITS.maxMessageLength) {
      return {
        ok: false,
        error: `Messages must be ${CHAT_LIMITS.maxMessageLength.toLocaleString("en-US")} characters or fewer.`,
      };
    }

    totalLength += content.length;

    if (totalLength > CHAT_LIMITS.maxTotalLength) {
      return {
        ok: false,
        error: "This conversation is too long. Start a new chat and try again.",
      };
    }

    messages.push({ role: item.role, content });
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return { ok: false, error: "The request could not be understood." };
  }

  return { ok: true, request: { messages } };
}

export type BodyReadResult =
  | { ok: true; body: unknown }
  | { ok: false; status: 413 | 400 };

/**
 * @description Reads the request body while enforcing a byte limit on the
 * bytes actually read, then parses it as JSON. The `Content-Length` header
 * alone is not a reliable guard: a client can omit it (chunked transfer
 * encoding has no length header) or send one that understates the real body,
 * so the limit is enforced against the stream itself.
 * @param request Incoming request.
 * @param maxBytes Maximum number of body bytes to accept.
 * @returns The parsed body, or the status code to report when it is rejected.
 */
export async function readJsonBodyWithLimit(
  request: Request,
  maxBytes: number,
): Promise<BodyReadResult> {
  const reader = request.body?.getReader();

  if (!reader) {
    return { ok: true, body: undefined };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value) {
      totalBytes += value.byteLength;

      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, status: 413 };
      }

      chunks.push(value);
    }
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, body: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { ok: false, status: 400 };
  }
}

/**
 * @description Converts session messages into the smaller API history.
 * @param messages Full conversation shown in the window.
 * @param limit Maximum number of recent messages to send.
 * @returns The most recent messages, preserving their order.
 */
export function toApiMessages(
  messages: ReadonlyArray<{ role: ChatApiMessage["role"]; content: string }>,
  limit = 16,
): ChatApiMessage[] {
  return messages.slice(-limit).map(({ role, content }) => ({ role, content }));
}

/**
 * @description Reads a safe error message from an unknown API response body.
 * @param value Parsed JSON from the response.
 * @returns The server-provided message, or `null` when it is not a string.
 */
export function readApiError(value: unknown): string | null {
  if (!isRecord(value) || typeof value.error !== "string") return null;

  const error = value.error.trim();
  return error || null;
}

/**
 * @description Reads the assistant answer from an unknown API response body.
 * @param value Parsed JSON from the response.
 * @returns The answer text, or `null` when it is missing.
 */
export function readApiReply(value: unknown): string | null {
  if (!isRecord(value) || typeof value.message !== "string") return null;

  const reply = value.message.trim();
  return reply || null;
}
