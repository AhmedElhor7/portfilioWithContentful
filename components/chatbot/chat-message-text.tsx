"use client";

import * as React from "react";
import { tokenizeMessage } from "@/lib/chatbot/format";
import { CHATBOT_COPY } from "./defines";

/**
 * @description Renders assistant text without HTML. Lines keep their breaks and
 * only http(s) links become anchors, so model output cannot inject markup.
 * @param props The assistant message content.
 * @returns Text with safe clickable links.
 */
export function ChatMessageText({ content }: { content: string }) {
  const segments = tokenizeMessage(content);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "link") {
          return (
            <a
              key={`${segment.href}-${index}`}
              href={segment.href}
              target="_blank"
              rel="noreferrer noopener"
              className="chatbot-link"
            >
              {segment.text}
              <span className="sr-only">{CHATBOT_COPY.opensInNewTab}</span>
            </a>
          );
        }

        return <React.Fragment key={index}>{segment.text}</React.Fragment>;
      })}
    </>
  );
}
