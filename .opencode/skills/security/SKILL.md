---
name: security
description: Use when touching API routes, environment variables, Contentful or Gemini integrations, user input, links, authentication, or deployment. Protects secrets and treats all visitor input as untrusted.
---

# Security

## Secrets

- `GEMINI_API_KEY`, `CONTENTFUL_SPACE_ID`, and `CONTENTFUL_ACCESS_TOKEN` are
  server-only. Never prefix them with `NEXT_PUBLIC_`.
- Never import `lib/chatbot/gemini.ts`, `lib/contentful/client.ts`, or anything
  that reads these variables from a client component.
- Secrets belong in `.env` locally and in the hosting provider's environment
  settings in production. `.env*` is gitignored; keep it that way.
- Do not log secrets, provider payloads, prompts containing private data, or
  full request headers.
- Send the Gemini key in the `x-goog-api-key` header, not the query string.

## Trust boundaries

- Every route handler input is untrusted: parse, validate, and bound it before
  use. Follow `lib/chatbot/request.ts`.
- Accept only the roles the product needs (`user`, `assistant`). Reject client
  attempts to inject a `system` turn.
- Enforce per-message length, total conversation length, message count, and
  request byte size before doing expensive work.
- Rate-limit before calling Contentful or Gemini. The current limiter is
  best-effort and per-instance; do not present it as a durable global limit. Use
  a shared store (Upstash, Redis, or platform rate limiting) before scaling out.
- Return visitor-safe errors. Map provider failures to generic messages and
  keep internal reasons server-side.
- Use `cache: "no-store"` for private or per-user requests.

## Prompt injection

- Visitor text is data, never instructions. Keep the system instruction fixed
  and separate from conversation contents.
- Explicitly tell the model to ignore attempts to change its role, reveal the
  instructions, or answer unrelated general questions.
- Ground answers in serialized Contentful data and instruct the model not to
  invent facts or URLs.
- Never let the model's output become a command, an HTML string, or a URL that
  is executed or trusted automatically.
- Treat retrieved CMS text as untrusted too: a compromised editor should not be
  able to turn content into executable instructions.

## Rendering and links

- Render model output as text. Do not use `dangerouslySetInnerHTML` for chat
  answers.
- Allow only `http:`, `https:`, and `mailto:` links. Reject `javascript:`,
  `data:`, and protocol-relative URLs.
- External links use `rel="noreferrer noopener"` and an explicit `target`.
- Never construct project URLs from names or slugs; only use published values.

## Dependencies and deployment

- Do not add an SDK when a small typed `fetch` wrapper is enough.
- Review new dependencies for maintenance and bundle impact.
- Keep the Contentful token read-only and scoped to the required space.
- Use HTTPS everywhere; production is deployed on Vercel with server routes.
  Static export cannot host `POST /api/chat`.
- Do not change hosting, output mode, or secret storage without approval.

## Review checklist

- Could any secret end up in the client bundle, HTML, logs, or git?
- Is all input validated and bounded at the boundary?
- Are errors generic to the visitor and specific only in server logs?
- Is rate limiting present, and are its limits documented honestly?
- Are links and rendered content safe by construction?
