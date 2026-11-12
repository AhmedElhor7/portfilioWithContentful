import { Sparkles } from "lucide-react";
import { CHATBOT_COPY } from "./defines";

/**
 * @description Assistant typing feedback. The visible dots are decorative; the
 * status text is announced to assistive technology.
 * @returns The typing indicator row.
 */
export function TypingIndicator() {
  return (
    <div className="chatbot-message" role="status">
      <span className="chatbot-avatar" aria-hidden>
        <Sparkles className="chatbot-avatar-icon" />
      </span>

      <div className="chatbot-bubble chatbot-bubble-assistant chatbot-typing" aria-hidden>
        <span className="chatbot-typing-dot" />
        <span className="chatbot-typing-dot" />
        <span className="chatbot-typing-dot" />
      </div>

      <span className="sr-only">{CHATBOT_COPY.typing}</span>
    </div>
  );
}
