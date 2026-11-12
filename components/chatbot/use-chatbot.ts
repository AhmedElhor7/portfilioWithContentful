"use client";

import * as React from "react";
import { readApiError, readApiReply, toApiMessages } from "@/lib/chatbot/request";
import type { ChatMessage, ChatRole } from "@/lib/chatbot/types";
import { CHATBOT_COPY } from "./defines";

const GENERIC_ERROR = CHATBOT_COPY.genericError;

let messageCounter = 0;

function createMessage(role: ChatRole, content: string): ChatMessage {
  messageCounter += 1;

  return {
    id: `chat-${Date.now()}-${messageCounter}`,
    role,
    content,
  };
}

class ChatRequestError extends Error {}

export interface UseChatbotResult {
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  canRetry: boolean;
  sendMessage: (message: string) => void;
  retryMessage: () => void;
  dismissError: () => void;
  clearConversation: () => void;
}

/**
 * @description Owns the current-session conversation and the request lifecycle.
 * Only one request can run at a time, failed requests keep their user message,
 * and a retry reuses the same history instead of duplicating it.
 * @returns Conversation state and actions for the chatbot UI.
 */
export function useChatbot(): UseChatbotResult {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastFailedRequest, setLastFailedRequest] = React.useState<ChatMessage[] | null>(null);
  const activeRequest = React.useRef<AbortController | null>(null);

  const requestReply = React.useCallback(async (history: ChatMessage[]) => {
    activeRequest.current?.abort();

    const controller = new AbortController();
    activeRequest.current = controller;

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toApiMessages(history) }),
        signal: controller.signal,
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ChatRequestError(readApiError(data) ?? GENERIC_ERROR);
      }

      const reply = readApiReply(data);

      if (!reply) {
        throw new ChatRequestError(GENERIC_ERROR);
      }

      setMessages((current) => [...current, createMessage("assistant", reply)]);
      setLastFailedRequest(null);
    } catch (caught) {
      if (controller.signal.aborted) return;

      setError(caught instanceof ChatRequestError ? caught.message : GENERIC_ERROR);
      setLastFailedRequest(history);
    } finally {
      if (!controller.signal.aborted) {
        setIsSending(false);
      }

      if (activeRequest.current === controller) {
        activeRequest.current = null;
      }
    }
  }, []);

  const sendMessage = React.useCallback(
    (message: string) => {
      const content = message.trim();

      if (!content || isSending) return;

      const nextMessages = [...messages, createMessage("user", content)];

      setMessages(nextMessages);
      setError(null);
      void requestReply(nextMessages);
    },
    [isSending, messages, requestReply],
  );

  const retryMessage = React.useCallback(() => {
    if (!lastFailedRequest || isSending) return;

    void requestReply(lastFailedRequest);
  }, [isSending, lastFailedRequest, requestReply]);

  const dismissError = React.useCallback(() => setError(null), []);

  const clearConversation = React.useCallback(() => {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setMessages([]);
    setError(null);
    setLastFailedRequest(null);
    setIsSending(false);
  }, []);

  React.useEffect(() => {
    return () => activeRequest.current?.abort();
  }, []);

  return {
    messages,
    isSending,
    error,
    canRetry: lastFailedRequest !== null,
    sendMessage,
    retryMessage,
    dismissError,
    clearConversation,
  };
}
