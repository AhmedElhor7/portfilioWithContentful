"use client";

import { RotateCcw, X } from "lucide-react";
import { CHATBOT_LABELS } from "./defines";
import type { ChatErrorProps } from "./types";

/**
 * @description Failure feedback with an explicit retry and dismiss action.
 * @param props Error text and handlers.
 * @returns The inline error panel.
 */
export function ChatError({ message, canRetry, onRetry, onDismiss }: ChatErrorProps) {
  return (
    <div className="chatbot-error" role="alert">
      <p className="chatbot-error-text">{message}</p>

      <div className="chatbot-error-actions">
        {canRetry ? (
          <button type="button" className="chatbot-retry" onClick={onRetry}>
            <RotateCcw className="chatbot-retry-icon" aria-hidden />
            {CHATBOT_LABELS.retry}
          </button>
        ) : null}

        <button
          type="button"
          className="chatbot-icon-button"
          onClick={onDismiss}
          aria-label={CHATBOT_LABELS.dismissError}
        >
          <X className="chatbot-icon" aria-hidden />
        </button>
      </div>
    </div>
  );
}
