"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/contentful/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DateComponent } from "@/components/ui/date-component";
import { ContentfulImage } from "@/components/ui/contentful-image";

const SHORT_DATE: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  timeZone: "UTC",
};

type PostCardProps = {
  post: Post;
  className?: string;
  priority?: boolean;
  index?: number;
};

export function PostCard({ post, className, priority = false, index = 0 }: PostCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 26, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: Math.min(index, 5) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/posts/${post.slug}`}
        aria-label={`Read “${post.title}”`}
        className={cn(
          "group border-border bg-card relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border",
          "transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)]",
          "hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-lift-lg)]",
          "focus-visible:ring-ring/45 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        )}
      >
        <div className="bg-muted relative aspect-[16/10] overflow-hidden">
          {post.coverImage ? (
            <motion.div
              className="h-full w-full"
              initial={false}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <ContentfulImage
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                width={post.coverImage.width}
                height={post.coverImage.height}
                renderedWidth={900}
                quality={68}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                className="h-full w-full object-cover saturate-[0.85] transition-[filter] duration-700 group-hover:saturate-100"
              />
            </motion.div>
          ) : (
            <div
              aria-hidden
              className="bg-muted from-accent/10 to-muted grid h-full w-full place-items-center bg-gradient-to-br"
            >
              <span className="text-accent/50 font-serif text-4xl italic">{post.title.charAt(0)}</span>
            </div>
          )}

          <div className="from-card/85 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
            <DateComponent dateString={post.date} options={SHORT_DATE} />
            <span aria-hidden className="bg-border-strong size-0.5 rounded-full" />
            <span>{post.readingMinutes} min read</span>
          </div>

          <h3 className="text-title text-ink mt-4 text-[1.6rem] transition-colors duration-300 group-hover:text-accent">
            {post.title}
          </h3>

          {post.excerpt ? (
            <p className="text-ink-soft mt-3 line-clamp-3 text-[0.975rem] leading-relaxed">
              {post.excerpt}
            </p>
          ) : null}

          {post.tags.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <li key={tag}>
                  <Badge variant="outline" size="sm">
                    {tag}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="border-border text-muted-foreground mt-auto flex items-center justify-between gap-4 border-t pt-5 pt-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name={post.author.name} picture={post.author.picture?.url} size="sm" />
              <span className="text-ink truncate font-mono text-[0.75rem] tracking-[0.04em]">
                {post.author.name}
              </span>
            </div>
            <span className="text-ink-soft group-hover:text-accent flex shrink-0 items-center gap-1 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors duration-300">
              Read
              <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
