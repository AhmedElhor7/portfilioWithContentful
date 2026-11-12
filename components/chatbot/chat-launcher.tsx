"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { CHATBOT_COPY, CHATBOT_LABELS, CHATBOT_WINDOW_ID } from "./defines";
import type { ChatLauncherProps } from "./types";

/**
 * @description Floating launcher that opens and closes the chat. The label
 * states the action, and the icon swap is skipped for reduced motion.
 */
export const ChatLauncher = React.forwardRef<HTMLButtonElement, ChatLauncherProps>(
  function ChatLauncher({ isOpen, onClick }, ref) {
    const reducedMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        type="button"
        className="chatbot-launcher"
        onClick={onClick}
        aria-label={isOpen ? CHATBOT_LABELS.close : CHATBOT_LABELS.open}
        aria-expanded={isOpen}
        aria-controls={CHATBOT_WINDOW_ID}
        whileTap={reducedMotion ? undefined : { scale: 0.94 }}
      >
        {isOpen ? null : (
          <span className="chatbot-launcher-hint" aria-hidden>
            {CHATBOT_COPY.launcherHint}
          </span>
        )}

        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={isOpen ? "close" : "chat"}
            initial={reducedMotion ? false : { opacity: 0, rotate: -30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, rotate: 30, scale: 0.8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="chatbot-launcher-icon-wrap"
          >
            {isOpen ? (
              <X className="chatbot-launcher-icon" aria-hidden />
            ) : (
              <MessageCircle className="chatbot-launcher-icon" aria-hidden />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  },
);
