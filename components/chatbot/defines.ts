/** Id shared by the launcher and the chat dialog. */
export const CHATBOT_WINDOW_ID = "portfolio-chat";

/** Accessible names and short labels used by the chatbot controls. */
export const CHATBOT_LABELS = {
  open: "Open portfolio chat",
  close: "Close portfolio chat",
  title: "Portfolio assistant",
  subtitle: (ownerName: string) =>
    ownerName ? `Ask about ${ownerName}` : "AI · Published portfolio content",
  dialog: (ownerName: string) =>
    ownerName ? `Portfolio assistant for ${ownerName}` : "Portfolio assistant",
  inputLabel: "Message",
  inputPlaceholder: "Ask about projects, skills, or availability…",
  send: "Send message",
  retry: "Retry",
  reset: "Start a new chat",
  dismissError: "Dismiss error",
  conversation: "Conversation",
  userMessage: "You",
  assistantMessage: "Portfolio assistant",
} as const;

/** Visible chatbot copy. Keep UI text here instead of inside components. */
export const CHATBOT_COPY = {
  welcomeTitle: (ownerName: string) =>
    `Hi — I can help you explore ${ownerName || "this portfolio"}.`,
  welcomeText:
    "Ask about projects, technologies, background, contact details, or availability. I only answer from the published portfolio content.",
  suggestionsHeading: "Try asking",
  launcherHint: "Ask my portfolio",
  typing: "Portfolio assistant is typing…",
  composerHint: "Enter to send · Shift + Enter for a new line",
  opensInNewTab: " (opens in a new tab)",
  genericError: "The assistant could not answer right now. Please try again.",
} as const;

/**
 * @description Starter questions grounded in the Contentful models that
 * actually exist.
 * @param ownerName The portfolio owner's name, when available.
 * @returns Suggested visitor questions.
 */
export function getSuggestedQuestions(ownerName: string): string[] {
  const owner = ownerName || "the portfolio owner";

  return [
    `Who is ${owner}?`,
    "What projects are in the portfolio?",
    "Which technologies are used?",
    "How can I get in touch?",
    `Is ${owner} available for opportunities?`,
  ];
}
