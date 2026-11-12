---
name: ui
description: Use when building or changing reusable interface elements — buttons, links, badges, cards, icons, form controls, dialogs, or state surfaces. Keeps controls consistent and theme-safe.
---

# UI

## Primitives

Reuse what exists in `components/ui` and the feature folders:

- `ButtonLink` (`components/ui/button.tsx`) for every button-styled action.
  - Variants: `solid`, `outline`, `ghost`, `accent`, `underline`, `link`.
  - Sizes: `sm`, `default`, `lg`, `icon`, `icon-sm`.
  - Same-origin paths and hashes render a Next.js `Link`; other URLs render an
    anchor. Pass `external` for off-site links that should open a new tab.
- `Badge`, `Separator`, and `ContentfulImage` for their respective roles.
- `components/chatbot/*` for chat surfaces and states.

Do not duplicate button classes by hand. If a new visual variant is genuinely
needed, add it to the `cva` definition so every caller benefits.

## Control rules

- Every interactive element must be reachable and operable by keyboard.
- Use the shared focus pattern: `focus-visible:ring-2 focus-visible:ring-ring/45`
  with an offset; never remove the outline without a replacement.
- Disabled controls use `disabled:opacity-45` and `disabled:pointer-events-none`.
- Do not use a `div` with `onClick` as a button or link.
- Icons are decorative unless they carry meaning: add `aria-hidden` when paired
  with a text label, otherwise give the control an accessible name.
- Use `lucide-react` icons at the sizes already used in the project.

## Surfaces and states

- Use the semantic tokens from `paper`, `ink`, `card`, `muted`, `border`, and
  `accent`. Never hard-code colors.
- Keep one visual hierarchy per surface: one primary action, secondary actions
  muted, destructive actions rare.
- Loading, empty, error, and success states are part of the component, not an
  afterthought. Show a stable placeholder to avoid layout shift.
- Prefer borders and background shifts over heavy shadows.
- Rounded corners follow `--radius-sm` through `--radius-2xl`.

## Composition

- Accept `className` on primitives and merge with `cn()`.
- Forward the small set of props that callers actually need; avoid a giant
  `...props` that bypasses typing.
- Keep component APIs declarative. A prop should describe intent, not a CSS
  class from the caller.
- Names describe purpose (`solid`, `accent`), not appearance only.

## Responsive behavior

- Controls must remain at least 24×24 px (WCAG 2.2 target size); primary mobile
  actions should be comfortably larger.
- Do not hide essential actions on mobile. Reflow or stack instead.
- Long labels wrap or truncate with an accessible full value.
- Floating and fixed surfaces must account for safe areas and mobile keyboards.

## Review checklist

- Is an existing primitive or variant being reused?
- Are hover, focus, active, disabled, and loading states all present?
- Does it work in both themes?
- Is the accessible name correct when the visual label is absent?
- Does it still lay out with long CMS copy and translated strings?
