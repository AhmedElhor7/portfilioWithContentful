---
name: design
description: Use when designing or changing the visual language of this portfolio — colors, typography, spacing, surfaces, layout, or motion. Keeps new sections and components consistent with the warm editorial system.
---

# Design

## Direction

This portfolio is warm, editorial, and restrained. It should feel like printed
paper rather than a generic SaaS dashboard.

- Paper, ink, and a single terracotta accent. No extra brand hues.
- Large serif display type paired with a quiet sans-serif body.
- Generous whitespace, thin rules, small mono labels, and few borders.
- Motion is slow and deliberate: reveal, settle, never bounce or flash.
- Content leads. Decoration must never compete with the work.

## Tokens are the source of truth

Design tokens live in `app/globals.css` under `@theme inline` and the `:root` /
`.dark` blocks. Use the semantic Tailwind names, never raw colors:

- Surfaces: `paper`, `paper-raised`, `background`, `card`, `popover`
- Text: `ink`, `ink-soft`, `foreground`, `muted-foreground`
- Accent: `accent`, `accent-soft`, `accent-foreground`
- Lines: `border`, `border-strong`, `input`, `ring`
- Type: `font-sans` (Inter), `font-serif` (Fraunces), `font-mono` (JetBrains Mono)
- Scale: `text-hero`, `text-display`, `text-title`
- Radius: `--radius-sm` through `--radius-2xl`
- Shadows: `shadow-lift`, `shadow-lift-lg`
- Motion: `--ease-out-expo`

If a value is missing, add a token rather than a one-off hex or arbitrary value.
Do not add `dark:` overrides for `ink` / `paper`: they already invert.

## Typography

- Display and section headings: `font-serif`, tight tracking, balanced lines.
- Body and supporting copy: `font-sans`, `text-pretty`, relaxed leading.
- Eyebrows, metadata, buttons, and labels: `font-mono`, uppercase, tracked.
- Keep body measure readable (roughly 60–75 characters).
- Avoid more than three type sizes in one component.

## Layout

- Reuse `section-spacing` / `section-spacing-top` for vertical rhythm.
- Reuse `section-lede`, `section-eyebrow`, `eyebrow-rule`, and `action-row`
  from `styles/utilities.css` before inventing new helpers.
- Prefer asymmetry and a clear reading column over centered card grids.
- Breakpoints are mobile-first. Test at 360 px, 768 px, and wide desktop.
- Respect `prefers-reduced-motion`; motion must degrade to an instant state.

## Styling placement

- Shared helpers go in `styles/utilities.css` and stay few.
- One-off section styles go in the component's `styles.css`, imported from
  `app/globals.css`.
- Prefer semantic class blocks (`hero-*`, `chatbot-*`) for multi-element
  layouts; use Tailwind utilities for local spacing and type.
- Use `cn()` from `lib/utils` for conditional classes.

## Review checklist

- Does it use existing tokens and helpers?
- Does it work in light and dark mode without custom overrides?
- Is the accent used sparingly and intentionally?
- Do headings, body, and labels follow the type roles?
- Does it still read well at narrow widths and with long CMS text?
- Is there any decoration that does not help the content?
