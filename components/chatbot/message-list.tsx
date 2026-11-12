"use client";

import * as React from "react";
import { Welcome } from "./welcome";
import { ChatMessageItem } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import { CHATBOT_LABELS } from "./defines";
import type { MessageListProps } from "./types";

/**
 * @description Scrollable conversation area. New messages scroll into view only
 * when the visitor is already near the bottom, so reading older answers is not
 * interrupted.
 * @param props Conversation, loading state and suggestion handler.
 * @returns The message log.
 */
export function MessageList({
  ownerName,
  messages,
  isSending,
  onSelectQuestion,
}: MessageListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const isPinnedToBottom = React.useRef(true);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;

    isPinnedToBottom.current =
      list.scrollHeight - list.scrollTop - list.clientHeight < 80;
  };

  React.useEffect(() => {
    if (!isPinnedToBottom.current) return;

    const list = listRef.current;
    if (!list) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (typeof list.scrollTo === "function") {
      list.scrollTo({
        top: list.scrollHeight,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    } else {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages, isSending]);

  return (
    <div
      ref={listRef}
      className="chatbot-messages"
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-label={CHATBOT_LABELS.conversation}
    >
      <div className="chatbot-messages-inner">
        {messages.length === 0 ? (
          <Welcome ownerName={ownerName} onSelectQuestion={onSelectQuestion} />
        ) : (
          messages.map((message) => <ChatMessageItem key={message.id} message={message} />)
        )}

        {isSending ? <TypingIndicator /> : null}
      </div>
    </div>
  );
}
