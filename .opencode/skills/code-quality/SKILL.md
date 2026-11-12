---
name: code-quality
description: Use when implementing, reviewing, refactoring, or testing code in this repository. Covers TypeScript standards, file conventions, test expectations, and the required validation commands.
---

# Code quality

## Standards

- TypeScript strict mode, no `any`, no `@ts-ignore`, no unsafe casts.
- Match the surrounding style: kebab-case file names, PascalCase components,
  camelCase functions, SCREAMING_SNAKE_CASE constants.
- Keep modules focused. Pure logic in `lib/`, UI in `components/`, routes in
  `app/`.
- Prefer small pure functions and discriminated unions over boolean flags and
  mutable shared state.
- Handle errors explicitly and return visitor-safe messages.
- Add JSDoc (`@description`, `@param`, `@returns`) to exported functions and
  components, following existing files.
- Comments explain why, not what. Delete stale comments with the code.
- Do not leave dead code, unused exports, or commented-out blocks.

## Change discipline

- Read the relevant files before editing. Preserve unrelated user work.
- Make the smallest coherent change; do not refactor adjacent code silently.
- Keep existing behavior and public contracts unless the task requires a change.
- Reuse existing constants, helpers, and primitives before adding new ones.
- Never remove or weaken tests, lint rules, or type checks to make a change pass.
- Do not commit secrets or generated build output.

## Tests

- Tests live next to the code as `*.test.ts` / `*.test.tsx`.
- Shared fixtures live in `test/fixtures.ts`; DOM setup lives in `test/setup.ts`.
- Test behavior through roles, labels, and visible text — not CSS selectors or
  implementation details.
- Cover the happy path, validation boundaries, failure and retry paths, and
  empty data.
- Keep network calls stubbed; never call Gemini or Contentful in tests.
- Prefer a few meaningful assertions over snapshot churn.
- For server logic, test the pure functions (`parseChatRequest`,
  `serializePortfolioKnowledge`, `buildSystemInstruction`, rate limiting) rather
  than the transport.

## Validation

Use Node 22.22.3 or newer (the installed `jsdom` requires it):

```bash
export PATH="/home/IbrahimA31/.nvm/versions/node/v22.22.3/bin:$PATH"
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check:unused` is available for stricter unused-symbol checks.

All four must pass before the work is considered complete. If a command cannot
run, report the exact failure instead of claiming success.

## Review checklist

- Does the change follow existing structure and naming?
- Are null, empty, error, and loading cases handled?
- Are new paths covered by behavior tests?
- Is there any duplicated logic or styling?
- Do lint, typecheck, tests, and build all pass?
- Did the change avoid unrelated files and secrets?
