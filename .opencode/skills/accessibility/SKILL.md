---
name: accessibility
description: Use when building or reviewing keyboard access, screen-reader semantics, focus management, contrast, motion preferences, forms, or dialogs. Targets WCAG 2.2 AA for this portfolio and its assistant.
---

# Accessibility

## Target

WCAG 2.2 AA. Accessibility is part of correctness, not a later pass.

## Semantics

- Use landmarks: `header`, `nav`, `main`, `footer`. Keep one `main` with
  `id="main"` and the existing skip link working.
- Use real `button`, `a`, `input`, `label`, `ul`, and heading elements. Do not
  recreate them with clickable `div`s.
- One `h1` per page; do not skip heading levels for visual size.
- Name every region that needs it (`aria-label="Conversation"`).
- Use `article` for self-contained messages and give each an accessible name
  (`aria-label="You"` / `"Portfolio assistant"`).
- Decorative icons get `aria-hidden`; icon-only controls get an `aria-label`.

## Keyboard

- Everything interactive must be reachable in a logical tab order.
- Visible focus is mandatory. Use the shared ring pattern; never `outline-none`
  without a replacement.
- Support Enter and Space for buttons, Enter for links, and Escape to dismiss
  dialogs.
- Dialogs must move focus inside on open, keep it within while open, and return
  it to the trigger on close.
- Provide a way out of any flow without a pointer.
- Custom widgets need the expected arrow-key behavior or should be native.

## Screen readers and live regions

- The conversation log uses `role="log"` and `aria-live="polite"`.
- Typing and progress indicators use `role="status"`.
- Errors use `role="alert"` and are announced once.
- Do not announce every token of a streaming answer; announce stable updates.
- Hide purely visual duplicates from assistive technology.
- Ensure the composer has a programmatic label (currently "Message").

## Visual

- Body text should meet 4.5:1; large text and UI boundaries at least 3:1.
  Verify `ink-soft` and accent combinations in both themes rather than assuming.
- Never use color alone to convey state; pair it with text or an icon.
- Support 200% zoom and 320 px reflow without loss of content or function.
- Respect `prefers-reduced-motion`; disable parallax, reveals, and smooth
  scrolling when requested.
- Target size: at least 24×24 px for pointer targets (2.2 AA).

## Forms and feedback

- Label every field; placeholders are not labels.
- Keep errors next to the field, describe how to fix them, and link them with
  `aria-describedby` / `aria-invalid` where applicable.
- Preserve user input after a failed submission.
- Disabled controls still need enough contrast to be perceivable.

## Testing

- Query by role, name, and label in tests, not by CSS class.
- Add a test for the keyboard path of any new dialog or menu.
- Manually check with Tab, Shift+Tab, Escape, a screen reader, and reduced motion.
- Automated checks are a floor, not proof.

## Review checklist

- Can the whole task be completed with a keyboard only?
- Does focus go somewhere sensible after open, submit, error, and close?
- Are all names, states, and errors exposed to assistive technology?
- Is contrast verified in both themes?
- Does the layout survive zoom and narrow viewports?
