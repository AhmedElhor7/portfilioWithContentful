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
 * @description The floating chat panel. Escape closes it, Tab is trapped
 * inside the panel so keyboard focus cannot reach the page behind it, and on
 * small screens the page behind is locked while the panel uses the full
 * viewport.
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
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isInsidePanel = active instanceof Node && panel.contains(active);

      if (event.shiftKey) {
        if (!isInsidePanel || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!isInsidePanel || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, []);

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
      ref={panelRef}
      id={CHATBOT_WINDOW_ID}
      role="dialog"
      aria-modal="true"
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
