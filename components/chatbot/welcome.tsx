import { Sparkles } from "lucide-react";
import { CHATBOT_COPY, getSuggestedQuestions } from "./defines";
import type { WelcomeProps } from "./types";

/**
 * @description Empty state shown before the visitor sends their first message.
 * The suggestions start with topics the published Contentful data can answer.
 * @param props Owner name and suggestion handler.
 * @returns The welcome panel.
 */
export function Welcome({ ownerName, onSelectQuestion }: WelcomeProps) {
  const questions = getSuggestedQuestions(ownerName);

  return (
    <div className="chatbot-welcome">
      <span className="chatbot-welcome-mark" aria-hidden>
        <Sparkles className="chatbot-welcome-icon" />
      </span>

      <h2 className="chatbot-welcome-title">{CHATBOT_COPY.welcomeTitle(ownerName)}</h2>

      <p className="chatbot-welcome-text">{CHATBOT_COPY.welcomeText}</p>

      <div className="chatbot-suggestions">
        <p className="eyebrow">{CHATBOT_COPY.suggestionsHeading}</p>

        <ul className="chatbot-suggestions-list">
          {questions.map((question) => (
            <li key={question}>
              <button
                type="button"
                className="chatbot-suggestion"
                onClick={() => onSelectQuestion(question)}
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
