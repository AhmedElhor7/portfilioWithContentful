import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessageText } from "./chat-message-text";
import { CHATBOT_LABELS } from "./defines";
import type { ChatMessageItemProps } from "./types";

/**
 * @description One conversation bubble. Visitor messages align right; assistant
 * messages align left with the assistant mark.
 * @param props The message to render.
 * @returns The message row.
 */
export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn("chatbot-message", isUser && "chatbot-message-user")}
      aria-label={isUser ? CHATBOT_LABELS.userMessage : CHATBOT_LABELS.assistantMessage}
    >
      {isUser ? null : (
        <span className="chatbot-avatar" aria-hidden>
          <Sparkles className="chatbot-avatar-icon" />
        </span>
      )}

      <div
        className={cn(
          "chatbot-bubble",
          isUser ? "chatbot-bubble-user" : "chatbot-bubble-assistant",
        )}
      >
        <p className="chatbot-message-text">
          <ChatMessageText content={message.content} />
        </p>
      </div>
    </article>
  );
}
