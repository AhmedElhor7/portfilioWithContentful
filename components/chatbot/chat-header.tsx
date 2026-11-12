"use client";

import { Plus, Sparkles, X } from "lucide-react";
import { CHATBOT_LABELS } from "./defines";
import type { ChatHeaderProps } from "./types";

/**
 * @description Identity and window controls. "New chat" only appears once there
 * is history to clear.
 * @param props Owner name and window actions.
 * @returns The chat header.
 */
export function ChatHeader({ ownerName, hasMessages, onClose, onReset }: ChatHeaderProps) {
  return (
    <header className="chatbot-header">
      <div className="chatbot-identity">
        <span className="chatbot-mark" aria-hidden>
          <Sparkles className="chatbot-mark-icon" />
        </span>

        <div className="chatbot-identity-text">
          <p className="chatbot-title">{CHATBOT_LABELS.title}</p>
          <p className="chatbot-subtitle">
            <span className="chatbot-status-dot" aria-hidden />
            {CHATBOT_LABELS.subtitle(ownerName)}
          </p>
        </div>
      </div>

      <div className="chatbot-header-actions">
        {hasMessages ? (
          <button
            type="button"
            className="chatbot-icon-button"
            onClick={onReset}
            aria-label={CHATBOT_LABELS.reset}
          >
            <Plus className="chatbot-icon" aria-hidden />
          </button>
        ) : null}

        <button
          type="button"
          className="chatbot-icon-button"
          onClick={onClose}
          aria-label={CHATBOT_LABELS.close}
        >
          <X className="chatbot-icon" aria-hidden />
        </button>
      </div>
    </header>
  );
}
