import type { Metadata } from "next";
import { PostsExplorer } from "@/components/posts/posts-explorer";
import { Reveal } from "@/components/motion/reveal";
import { getPosts } from "@/lib/contentful/posts";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on typography, motion, design systems, and building calmer interfaces.",
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="shell pt-16 pb-24 sm:pt-24 sm:pb-32">
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">Journal</span>
          <span aria-hidden className="bg-border-strong h-px w-6" />
          {posts.length} {posts.length === 1 ? "entry" : "entries"}
        </p>
        <h1 className="text-display text-ink mt-6 max-w-[14ch]">
          Notes on craft, <span className="wonky text-accent italic">written slowly</span>.
        </h1>
        <p className="text-ink-soft mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-pretty">
          Essays on typography, motion, and the unglamorous work of making interfaces feel
          considered. Everything here is written because something surprised me.
        </p>
      </Reveal>

      <div className="mt-14">
        <PostsExplorer posts={posts} />
      </div>
    </div>
  );
}

export const revalidate = 60;
