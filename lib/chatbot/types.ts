/** Who produced a chat message. */
export type ChatRole = "user" | "assistant";

/** A message kept in the current browser session. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

/** The minimal message shape accepted by the server endpoint. */
export interface ChatApiMessage {
  role: ChatRole;
  content: string;
}

/** Request body for `POST /api/chat`. */
export interface ChatRequest {
  messages: ChatApiMessage[];
}

/** Successful response from `POST /api/chat`. */
export interface ChatSuccessResponse {
  message: string;
}

/** Error response from `POST /api/chat`. */
export interface ChatErrorResponse {
  error: string;
}

/** A clickable or plain piece of an assistant message. */
export type MessageSegment =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };
