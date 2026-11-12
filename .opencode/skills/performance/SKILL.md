---
name: performance
description: Use when improving load speed, rendering strategy, caching, images, fonts, bundle size, or motion cost in this portfolio. Prefers server rendering and measured, minimal client JavaScript.
---

# Performance

## Rendering strategy

- Server Components are the default. Keep data fetching on the server.
- Prefer static rendering for content pages. Use dynamic rendering only where a
  request genuinely needs it (`/api/chat` is `force-dynamic`).
- Fetch independent data in parallel with `Promise.all` (see
  `lib/chatbot/knowledge.ts` and the homepage).
- Do not turn a page into a client component to satisfy one small interaction;
  isolate the interactive leaf.
- Avoid request waterfalls: fetch content at the route level, not in deeply
  nested client components.

## Caching

- `getPortfolioKnowledge` uses `unstable_cache` with a 300-second revalidation.
  Keep Contentful off the per-message path.
- Do not cache private or per-visitor responses. Gemini calls use
  `cache: "no-store"`.
- Cap conversation history sent to the server (currently the last 16 messages)
  and enforce server-side limits.
- If cache behavior changes, verify that newly published Contentful content
  appears within the documented window.

## Images

- Use `ContentfulImage` / `next/image` rather than raw `<img>`.
- Request the rendered width, quality, and `sizes` from the component's
  `defines.ts` (for example `HERO_PROFILE_IMAGE`).
- Always provide meaningful `alt` text from the CMS or an explicit empty alt for
  decorative images.
- Do not ship full-resolution originals for thumbnails.
- Reserve width and height to prevent layout shift.

## Fonts and assets

- Fonts load through `next/font/google` with `display: "swap"`.
- Do not add another font family without a clear reason.
- Import only the icons and utilities actually used.
- Keep global CSS small. Feature CSS is imported once from `app/globals.css`.

## Client JavaScript and motion

- Keep `"use client"` boundaries narrow; check what crosses the boundary.
- Animate `transform` and `opacity`, not layout properties.
- Use `prefers-reduced-motion` and the project's motion provider to avoid
  unnecessary animation work.
- Avoid scroll listeners that run on every frame; throttle or use observers.
- Lazy-load heavy, below-the-fold widgets when they are not needed at startup.

## Measurement

- `npm run build` reports route types and sizes. Watch for unexpected client
  growth.
- Use Lighthouse or the browser performance panel before and after a change.
- Do not add memoization, virtualization, or dynamic imports without a measured
  reason.
- Test on a throttled connection and a mid-range mobile device.

## Review checklist

- Is this work happening on the server when it could?
- Is Contentful hit once per cache window instead of once per request?
- Are images and fonts sized and prioritized correctly?
- Did the client bundle grow? If yes, why?
- Is motion cheap and optional?
