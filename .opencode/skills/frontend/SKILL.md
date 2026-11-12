---
name: frontend
description: Use when adding or changing app routes, React components, Contentful data access, or client/server boundaries in this Next.js portfolio. Covers project structure, TypeScript conventions, and validation.
---

# Frontend

## Stack

- Next.js 16 App Router with React 19 and TypeScript strict mode.
- Tailwind CSS v4 through `@theme inline` in `app/globals.css`.
- Contentful is the content source; Gemini is called server-side only.
- Path alias: `@/*` maps to the repository root.
- This Next.js version differs from older training data. Before using an API
  you are unsure about, read the relevant guide in `node_modules/next/dist/docs/`.

## Server and client boundaries

- Server Components are the default. Add `"use client"` only for state, events,
  refs, browser APIs, or animation.
- Keep `"use client"` at the smallest leaf that needs it. Do not mark whole
  pages or layouts as client components.
- Never call Gemini or use a Contentful access token in client code.
- Data access belongs in `lib/contentful/*`; pages and features call those
  functions instead of instantiating clients inline.
- Images come through `components/ui/contentful-image.tsx`, not raw `<img>`.

## File structure

Follow the existing feature-folder pattern:

```text
components/<area>/<feature>/
  <feature>.tsx        # component
  defines.ts           # constants and image options
  types.ts             # local props and domain types
  styles.css           # only when utilities are not enough
  <feature>.test.tsx   # behavior test
```

- `components/ui/` holds reusable primitives.
- `components/portfolio/` holds homepage sections.
- `components/chatbot/` is a self-contained feature with its own hook and styles.
- Pure logic belongs in `lib/`, not inside components.
- Small flat folders are fine when a feature has no CSS or shared types.

## TypeScript

- No `any`, no non-null assertions to silence the compiler, no ignored errors.
- Type component props explicitly; put shared props in `types.ts`.
- Use discriminated unions for state machines and API results (see
  `lib/chatbot/gemini.ts`).
- Validate unknown input at the boundary (`lib/chatbot/request.ts`) instead of
  casting it.
- Use `import type` for type-only imports.
- Prefer `ReadonlyArray` and readonly props for data that should not mutate.

## Components

- Keep components focused and composable; extract when a file mixes data,
  state, and several visual regions.
- Put user-facing constants and configuration in `defines.ts`.
- Use `cn()` for conditional classes.
- Reuse primitives from `components/ui` before writing a new button or badge.
- Add JSDoc with `@description`, `@param`, and `@returns` to exported functions
  and components, matching the surrounding style.
- Prefer semantic elements and native behavior over custom handlers.

## Contentful

- Only published content may reach the UI or the assistant.
- Normalize CMS values through `lib/contentful/portfolio.ts` helpers
  (`resolveHero`, `resolveSiteDescription`, `resolveContactHeading`, etc.).
- Handle nullable fields explicitly. Never render the entry title as a fact
  unless the UI genuinely needs it.
- Keep `siteName` as the public owner name; `name` is the Contentful entry title.

## Validation

Run these before handing work back:

```bash
export PATH="/home/IbrahimA31/.nvm/versions/node/v22.22.3/bin:$PATH"
npm run lint
npm run typecheck
npm test
npm run build
```

Do not change deployment architecture or output mode without approval.
