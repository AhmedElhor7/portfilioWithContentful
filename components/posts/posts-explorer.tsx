"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import type { Post } from "@/lib/contentful/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PostCard } from "./post-card";
import { PostsEmptyState } from "./posts-empty";

type PostsExplorerProps = {
  posts: Post[];
};

const ALL_TAGS = "__all__";

export function PostsExplorer({ posts }: PostsExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState<string>(ALL_TAGS);
  const reducedMotion = useReducedMotion();

  const tags = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const value of post.tags) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([value]) => value);
  }, [posts]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();

    return posts.filter((post) => {
      if (tag !== ALL_TAGS && !post.tags.includes(tag)) return false;
      if (!needle) return true;

      const haystack = [post.title, post.excerpt, post.author.name, ...post.tags]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [posts, query, tag]);

  const isFiltered = query.trim().length > 0 || tag !== ALL_TAGS;

  function reset() {
    setQuery("");
    setTag(ALL_TAGS);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the journal…"
            aria-label="Search posts"
            className="rounded-full pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-ink absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-full transition-colors"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        {tags.length > 0 ? (
          <LayoutGroup id="post-tags">
            <ul className="flex flex-wrap gap-2">
              {[ALL_TAGS, ...tags].map((value) => {
                const active = tag === value;
                const label = value === ALL_TAGS ? "All" : value;

                return (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() => setTag(value)}
                      aria-pressed={active}
                      className={cn(
                        "relative rounded-full px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors duration-300",
                        "focus-visible:ring-ring/45 focus-visible:ring-2 focus-visible:outline-none",
                        active ? "text-accent-foreground" : "text-muted-foreground hover:text-ink",
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="post-tag-pill"
                          className="bg-accent absolute inset-0 -z-10 rounded-full"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      ) : null}
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        ) : null}
      </div>

      <div className="text-muted-foreground flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
        <p aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          {isFiltered ? " found" : ""}
        </p>
        {isFiltered ? (
          <button
            type="button"
            onClick={reset}
            className="link-underline text-ink-soft hover:text-ink"
          >
            Reset
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        posts.length === 0 ? (
          <PostsEmptyState />
        ) : (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-border flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-dashed px-6 py-16 text-center"
          >
            <p className="font-serif text-[1.35rem] tracking-[-0.02em]">No matches</p>
            <p className="text-ink-soft max-w-xs text-[0.9375rem] leading-relaxed">
              Nothing here matches that search. Try a different term or clear the filters.
            </p>
            <button
              type="button"
              onClick={reset}
              className="link-underline text-accent font-mono text-[0.75rem] tracking-[0.12em] uppercase"
            >
              Clear filters
            </button>
          </motion.div>
        )
      ) : (
        <LayoutGroup id="post-grid">
          <motion.ul layout className="grid grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((post, index) => (
                <motion.li
                  key={post.id}
                  layout
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <PostCard post={post} index={index} priority={index < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      )}
    </div>
  );
}
