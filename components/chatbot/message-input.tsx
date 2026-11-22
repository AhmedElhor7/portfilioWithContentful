"use client";

import * as React from "react";
import { Mic, Send, Square } from "lucide-react";
import { CHATBOT_COPY, CHATBOT_LABELS } from "./defines";
import type { MessageInputProps } from "./types";

/** Minimal Web Speech API shape; these types are not in TypeScript's DOM lib. */
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

const subscribeToNothing = () => () => {};

/** Friendly copy for the SpeechRecognition error codes visitors can act on. */
const VOICE_ERRORS: Record<string, string> = {
  "not-allowed": CHATBOT_COPY.voiceDenied,
  "service-not-allowed": CHATBOT_COPY.voiceDenied,
  "audio-capture": CHATBOT_COPY.voiceNoMic,
  network: CHATBOT_COPY.voiceNetwork,
};

/**
 * @description Composer with Enter-to-send and Shift+Enter for a new line. The
 * textarea grows up to a small cap so long questions stay readable. When the
 * browser supports speech recognition, a mic button dictates into the
 * textarea; the visitor still reviews the text and presses Send.
 * @param props Sending state, length limit and submit handler.
 * @returns The message form.
 */
export function MessageInput({ isSending, maxLength, onSend }: MessageInputProps) {
  const [message, setMessage] = React.useState("");
  // Server snapshot is false so server and client markup match on hydration.
  const voiceSupported = React.useSyncExternalStore(
    subscribeToNothing,
    () => getSpeechRecognition() !== null,
    () => false,
  );
  const [isListening, setIsListening] = React.useState(false);
  const [voiceError, setVoiceError] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const canSend = message.trim().length > 0 && !isSending;

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    if (textarea.scrollHeight > 0) {
      textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
    }
  }, [message]);

  React.useEffect(() => () => recognitionRef.current?.abort(), []);

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const startListening = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    const baseText = message.trim();

    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results, (result) => result[0]?.transcript ?? "")
        .join("")
        .trim();

      setMessage([baseText, transcript].filter(Boolean).join(" ").slice(0, maxLength));
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") return;

      setVoiceError(VOICE_ERRORS[event.error] ?? CHATBOT_COPY.voiceError);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
      textareaRef.current?.focus();
    };

    setVoiceError(null);

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setVoiceError(CHATBOT_COPY.voiceError);
    }
  };

  const submit = () => {
    if (!canSend) return;

    stopListening();
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

  const hint = voiceError ?? (isListening ? CHATBOT_COPY.listeningHint : CHATBOT_COPY.composerHint);

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

        {voiceSupported ? (
          <button
            type="button"
            className="chatbot-mic"
            aria-label={isListening ? CHATBOT_LABELS.stopVoice : CHATBOT_LABELS.startVoice}
            aria-pressed={isListening}
            disabled={isSending}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <Square className="chatbot-mic-icon" aria-hidden />
            ) : (
              <Mic className="chatbot-mic-icon" aria-hidden />
            )}
          </button>
        ) : null}

        <button
          type="submit"
          className="chatbot-send"
          aria-label={CHATBOT_LABELS.send}
          disabled={!canSend}
        >
          <Send className="chatbot-send-icon" aria-hidden />
        </button>
      </form>

      <p className="chatbot-hint" aria-live="polite" data-error={voiceError ? "" : undefined}>
        {hint}
      </p>
    </div>
  );
}
