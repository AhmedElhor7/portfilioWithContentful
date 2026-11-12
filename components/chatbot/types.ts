import type { ChatMessage } from "@/lib/chatbot/types";

/** Props for the top-level chatbot feature. */
export interface ChatbotProps {
  /** The displayed owner name, when Contentful provides one. */
  ownerName?: string;
}

/** Props shared by the chat window and its subcomponents. */
export interface ChatWindowProps {
  ownerName: string;
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  canRetry: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  onRetry: () => void;
  onDismissError: () => void;
  onReset: () => void;
}

export interface ChatHeaderProps {
  ownerName: string;
  hasMessages: boolean;
  onClose: () => void;
  onReset: () => void;
}

export interface MessageListProps {
  ownerName: string;
  messages: ChatMessage[];
  isSending: boolean;
  onSelectQuestion: (question: string) => void;
}

export interface ChatMessageItemProps {
  message: ChatMessage;
}

export interface MessageInputProps {
  isSending: boolean;
  maxLength: number;
  onSend: (message: string) => void;
}

export interface ChatLauncherProps {
  isOpen: boolean;
  onClick: () => void;
}

export interface WelcomeProps {
  ownerName: string;
  onSelectQuestion: (question: string) => void;
}

export interface ChatErrorProps {
  message: string;
  canRetry: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}
