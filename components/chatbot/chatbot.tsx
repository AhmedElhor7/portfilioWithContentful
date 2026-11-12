"use client";

import * as React from "react";
import { AnimatePresence } from "motion/react";
import { ChatLauncher } from "./chat-launcher";
import { ChatWindow } from "./chat-window";
import { useChatbot } from "./use-chatbot";
import type { ChatbotProps } from "./types";

/**
 * @description Independent portfolio assistant. The launcher stays available
 * on every page, conversation history lives only for the current session, and
 * all AI work happens behind the server endpoint.
 * @param props The owner name shown in the assistant identity.
 * @returns The floating launcher and, when open, the chat window.
 */
export function Chatbot({ ownerName = "" }: ChatbotProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const hasOpened = React.useRef(false);
  const {
    messages,
    isSending,
    error,
    canRetry,
    sendMessage,
    retryMessage,
    dismissError,
    clearConversation,
  } = useChatbot();

  React.useEffect(() => {
    if (isOpen) {
      hasOpened.current = true;
      return;
    }

    if (hasOpened.current) {
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  const closeChat = React.useCallback(() => setIsOpen(false), []);
  const toggleChat = React.useCallback(() => setIsOpen((open) => !open), []);

  return (
    <div className="chatbot-root">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <ChatWindow
            key="chat-window"
            ownerName={ownerName}
            messages={messages}
            isSending={isSending}
            error={error}
            canRetry={canRetry}
            onClose={closeChat}
            onSend={sendMessage}
            onRetry={retryMessage}
            onDismissError={dismissError}
            onReset={clearConversation}
          />
        ) : null}
      </AnimatePresence>

      <ChatLauncher ref={launcherRef} isOpen={isOpen} onClick={toggleChat} />
    </div>
  );
}
