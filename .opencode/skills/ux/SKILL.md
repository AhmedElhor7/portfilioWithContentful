---
name: ux
description: Use when shaping user flows, states, copy, or interactions — especially the portfolio assistant, error recovery, empty states, and content-grounded answers. Focuses on clarity, trust, and graceful failure.
---

# UX

## Experience principles

- The portfolio is the product. Chat is an optional guide, not the main event.
- Every state should tell the visitor what is happening and what they can do.
- Prefer one clear next action over several competing ones.
- Never fabricate a fact, link, project, or credential to keep a conversation
  going. "That is not in the portfolio" is a valid, trustworthy answer.
- Keep the tone warm, direct, and professional. No hype, no filler, no
  emoji unless the existing product voice already uses them.

## Assistant flow

- Closed launcher → open window → welcome with grounded suggestions → answered
  conversation → close.
- Show a welcome state with a short explanation and 2–4 suggested questions
  derived from published content.
- While waiting, render a typing indicator and keep the composer available only
  if the request model supports it; otherwise disable send and explain why.
- On failure, keep the visitor's message visible, show a human-readable error,
  and offer Retry. Retrying must not duplicate the message.
- On success, scroll to the newest message only when the visitor is already near
  the bottom; do not yank them away from older answers.
- Starting over should clear the conversation through an explicit control, not
  by accident.
- Close on Escape, restore focus to the launcher, and lock background scroll on
  mobile while the window is open.

## Conversation quality

- Answers should be short: usually two to four sentences.
- Lead with the answer, then one useful detail or link.
- Use only the published portfolio knowledge. If a field is empty, say so.
- Share URLs verbatim from the content; never construct or guess one.
- Redirect off-topic requests back to portfolio topics politely.
- Do not claim to perform actions (send email, book calls, apply) on the
  owner's behalf.

## Errors and empty states

- Explain the problem in the visitor's language, not the provider's.
- Distinguish timeouts, rate limits, unavailable content, and unconfigured
  service only when the distinction helps the visitor act.
- Never expose stack traces, API keys, provider payloads, or internal IDs.
- Provide a recovery path: retry, dismiss, start over, or use direct contact.
- Empty states should suggest a concrete first step, not just say "nothing here".

## Content and copy

- Labels describe outcomes ("Send message", "Retry", "Open portfolio chat").
- Avoid jargon and internal names in the interface.
- Button and link text must make sense out of context.
- Keep the owner name consistent with `siteName`.

## Review checklist

- Can a first-time visitor tell what this does in one sentence?
- Is there a visible response within a moment of every action?
- What happens on slow network, failure, retry, and double-submit?
- Can the visitor leave the flow at any point?
- Is the answer grounded and honest when knowledge is missing?
