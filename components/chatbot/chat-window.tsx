"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { CHAT_LIMITS } from "@/lib/chatbot/request";
import { ChatError } from "./chat-error";
import { ChatHeader } from "./chat-header";
import { CHATBOT_LABELS, CHATBOT_WINDOW_ID } from "./defines";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import type { ChatWindowProps } from "./types";

/**
 * @description The floating chat panel. Escape closes it, and on small screens
 * the page behind is locked while the panel uses the full viewport.
 * @param props Conversation state, owner name and window actions.
 * @returns The animated chat dialog.
 */
export function ChatWindow({
  ownerName,
  messages,
  isSending,
  error,
  canRetry,
  onClose,
  onSend,
  onRetry,
  onDismissError,
  onReset,
}: ChatWindowProps) {
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    if (!media.matches) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <motion.div
      id={CHATBOT_WINDOW_ID}
      role="dialog"
      aria-label={CHATBOT_LABELS.dialog(ownerName)}
      className="chatbot-panel"
      initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <ChatHeader
        ownerName={ownerName}
        hasMessages={messages.length > 0}
        onClose={onClose}
        onReset={onReset}
      />

      <MessageList
        ownerName={ownerName}
        messages={messages}
        isSending={isSending}
        onSelectQuestion={onSend}
      />

      {error ? (
        <ChatError
          message={error}
          canRetry={canRetry}
          onRetry={onRetry}
          onDismiss={onDismissError}
        />
      ) : null}

      <MessageInput
        isSending={isSending}
        maxLength={CHAT_LIMITS.maxMessageLength}
        onSend={onSend}
      />
    </motion.div>
  );
}
