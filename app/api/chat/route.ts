import { NextResponse } from "next/server";
import { generateChatReply } from "@/lib/chatbot/gemini";
import { getPortfolioKnowledge } from "@/lib/chatbot/knowledge";
import { getClientKey, isRateLimited } from "@/lib/chatbot/rate-limit";
import { parseChatRequest } from "@/lib/chatbot/request";
import type { ChatErrorResponse } from "@/lib/chatbot/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 24_000;

function errorResponse(error: string, status: number) {
  return NextResponse.json<ChatErrorResponse>({ error }, { status });
}

/**
 * @description Secure server endpoint for the portfolio assistant. Gemini and
 * Contentful credentials never leave the server; the browser only sends the
 * conversation and receives the answer text.
 * @param request Incoming chat request.
 * @returns A JSON answer or a visitor-safe error.
 */
export async function POST(request: Request) {
  if (isRateLimited(getClientKey(request.headers))) {
    return errorResponse("Too many messages. Please wait a moment and try again.", 429);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return errorResponse("The request is too large.", 413);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("The request could not be understood.", 400);
  }

  const parsed = parseChatRequest(body);

  if (!parsed.ok) {
    return errorResponse(parsed.error, 400);
  }

  let knowledge;

  try {
    knowledge = await getPortfolioKnowledge();
  } catch {
    return errorResponse(
      "The portfolio content is temporarily unavailable. Please try again later.",
      503,
    );
  }

  const result = await generateChatReply(parsed.request.messages, knowledge);

  if (!result.ok) {
    if (result.reason === "not_configured") {
      return errorResponse("The portfolio assistant is not configured yet.", 503);
    }

    if (result.reason === "busy") {
      return errorResponse(
        "The assistant is busy right now. Please try again in a moment.",
        503,
      );
    }

    return errorResponse("The assistant could not answer right now. Please try again.", 502);
  }

  return NextResponse.json({ message: result.text });
}
