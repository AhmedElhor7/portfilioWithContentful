"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { CHATBOT_COPY, CHATBOT_LABELS } from "./defines";
import type { MessageInputProps } from "./types";

/**
 * @description Composer with Enter-to-send and Shift+Enter for a new line. The
 * textarea grows up to a small cap so long questions stay readable.
 * @param props Sending state, length limit and submit handler.
 * @returns The message form.
 */
export function MessageInput({ isSending, maxLength, onSend }: MessageInputProps) {
  const [message, setMessage] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const canSend = message.trim().length > 0 && !isSending;

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    if (textarea.scrollHeight > 0) {
      textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
    }
  }, [message]);

  const submit = () => {
    if (!canSend) return;

    const content = message.trim();
    setMessage("");
    onSend(content);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;

    event.preventDefault();
    submit();
  };

  return (
    <div className="chatbot-composer">
      <form className="chatbot-composer-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chatbot-message">
          {CHATBOT_LABELS.inputLabel}
        </label>

        <textarea
          ref={textareaRef}
          id="chatbot-message"
          name="message"
          rows={1}
          value={message}
          maxLength={maxLength}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={CHATBOT_LABELS.inputPlaceholder}
          className="chatbot-textarea"
          autoFocus
        />

        <button
          type="submit"
          className="chatbot-send"
          aria-label={CHATBOT_LABELS.send}
          disabled={!canSend}
        >
          <Send className="chatbot-send-icon" aria-hidden />
        </button>
      </form>

      <p className="chatbot-hint">{CHATBOT_COPY.composerHint}</p>
    </div>
  );
}
