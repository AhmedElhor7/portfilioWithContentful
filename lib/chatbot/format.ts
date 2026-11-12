import type { MessageSegment } from "./types";

const LINK_PATTERN = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?]$/;
const CLOSING_BRACKET = /\)$/;

function splitTrailingPunctuation(value: string): { href: string; trailing: string } {
  let href = value;
  let trailing = "";

  while (href.length > 0) {
    if (TRAILING_PUNCTUATION.test(href)) {
      trailing = `${href.slice(-1)}${trailing}`;
      href = href.slice(0, -1);
      continue;
    }

    if (CLOSING_BRACKET.test(href)) {
      const openCount = (href.match(/\(/g) ?? []).length;
      const closeCount = (href.match(/\)/g) ?? []).length;

      if (closeCount > openCount) {
        trailing = `${href.slice(-1)}${trailing}`;
        href = href.slice(0, -1);
        continue;
      }
    }

    break;
  }

  return { href, trailing };
}

/**
 * @description Splits assistant text into plain and link segments without
 * rendering HTML. Supports exact URLs and `[label](url)` markdown links, and
 * keeps trailing punctuation outside the link.
 * @param content The assistant message text.
 * @returns Ordered text and link segments.
 */
export function tokenizeMessage(content: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ type: "text", text: content.slice(lastIndex, index) });
    }

    const label = match[1];
    const markdownHref = match[2];

    if (label && markdownHref) {
      segments.push({ type: "link", text: label, href: markdownHref });
    } else {
      const raw = match[3] ?? "";
      const { href, trailing } = splitTrailingPunctuation(raw);

      if (href) {
        segments.push({ type: "link", text: href, href });
      }

      if (trailing) {
        segments.push({ type: "text", text: trailing });
      }
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", text: content.slice(lastIndex) });
  }

  return segments.filter((segment) => segment.text.length > 0);
}
